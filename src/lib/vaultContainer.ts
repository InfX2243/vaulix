import { decryptPayload, deriveMasterKey, encryptPayload, generateRandomBytes, importAesKey, randomBase64, unwrapKey, wrapKey } from './crypto'

export interface EncryptedFragment { iv: string; data: string }
export interface VaultEntry { id: string; service: string; username: string; secret: string; notes?: string; createdAt: string; updatedAt: string }
export interface VaultData { entries: VaultEntry[] }
export interface AddCredentialInput { service: string; username: string; secret: string; notes?: string }
export interface VaultMetadata {
  createdAt: string
  updatedAt: string
  lastUnlockedAt: string | null
  lastPasswordResetAt: string | null
  recoveryGeneratedAt: string
  vaultId: string
  version: string
  name: string
}
export interface VlxFile {
  format: 'vaulix.vlx'
  metadata: VaultMetadata
  encryption: { algorithm: 'AES-GCM'; kdf: 'PBKDF2-SHA256'; kdfIterations: number; salt: string; keyLength: number }
  wrappedVek: { withMasterKey: EncryptedFragment; withRecoveryKey: EncryptedFragment }
  vaultData: EncryptedFragment
  integrity: { algorithm: 'SHA-256'; metadataDigest: string; vaultDataDigest: string }
}
export interface CreateVaultResult { vlx: VlxFile; recoveryKey: string }
export interface RecoveryPayloadLike {
  version: string
  recoveryKey: string
  wrappedVekWithRecovery: { iv: string; data: string }
  vaultId: string
}

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const MAGIC = new Uint8Array([0xd3, 0xa1, 0x5c, 0x42])
const ENVELOPE_VERSION = 1
const PAYLOAD_VERSION = 3

function b64FromBuffer(buffer: ArrayBuffer) { return btoa(String.fromCharCode(...new Uint8Array(buffer))) }
function bytesToBase64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)) }
function base64ToBytes(value: string) {
  const binary = atob(value)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i)
  return out
}
async function sha256Base64(value: string) { return b64FromBuffer(await crypto.subtle.digest('SHA-256', encoder.encode(value))) }
async function sha256Bytes(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.length)
  copy.set(bytes)
  return new Uint8Array(await crypto.subtle.digest('SHA-256', copy as BufferSource))
}
async function computeIntegrity(metadata: VaultMetadata, vaultData: EncryptedFragment) {
  return {
    algorithm: 'SHA-256' as const,
    metadataDigest: await sha256Base64(JSON.stringify(metadata)),
    vaultDataDigest: await sha256Base64(JSON.stringify(vaultData)),
  }
}
function createVaultId() { return (crypto as any).randomUUID ? (crypto as any).randomUUID() : 'vault-' + Math.random().toString(36).slice(2, 10) }

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((s, p) => s + p.length, 0)
  const out = new Uint8Array(total)
  let o = 0
  for (const p of parts) { out.set(p, o); o += p.length }
  return out
}
function u16(n: number) { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, n, false); return b }
function u32(n: number) { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, false); return b }
function f64(n: number) { const b = new Uint8Array(8); new DataView(b.buffer).setFloat64(0, n, false); return b }
function nowMs(iso: string | null) { return iso ? new Date(iso).getTime() : -1 }
function isoFromMs(ms: number) { return ms < 0 ? null : new Date(ms).toISOString() }
function encFrag(f: EncryptedFragment) {
  const iv = base64ToBytes(f.iv)
  const data = base64ToBytes(f.data)
  return concat([u16(iv.length), iv, u32(data.length), data])
}
function readFactory(bytes: Uint8Array) {
  let o = 0
  const take = (n: number) => { const s = bytes.slice(o, o + n); o += n; return s }
  const vu16 = () => new DataView(take(2).buffer).getUint16(0, false)
  const vu32 = () => new DataView(take(4).buffer).getUint32(0, false)
  const vf64 = () => new DataView(take(8).buffer).getFloat64(0, false)
  const frag = (): EncryptedFragment => {
    const iv = take(vu16())
    const data = take(vu32())
    return { iv: bytesToBase64(iv), data: bytesToBase64(data) }
  }
  const takeBytes = (n: number) => take(n)
  return { vu16, vu32, vf64, frag, takeBytes }
}

function uuidToBytes(id: string) {
  const clean = id.replace(/-/g, '')
  if (!/^[0-9a-fA-F]{32}$/.test(clean)) return generateRandomBytes(16)
  const out = new Uint8Array(16)
  for (let i = 0; i < 16; i += 1) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  return out
}
function bytesToUuid(bytes: Uint8Array) {
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

function encodePayload(vlx: VlxFile) {
  const salt = base64ToBytes(vlx.encryption.salt)
  const mdDigest = base64ToBytes(vlx.integrity.metadataDigest)
  const vdDigest = base64ToBytes(vlx.integrity.vaultDataDigest)
  const versionMajor = Number(vlx.metadata.version.split('.')[0] || 1)
  const nameBytes = encoder.encode(vlx.metadata.name || '')

  return concat([
    new Uint8Array([PAYLOAD_VERSION, versionMajor]),
    uuidToBytes(vlx.metadata.vaultId),
    f64(nowMs(vlx.metadata.createdAt)),
    f64(nowMs(vlx.metadata.updatedAt)),
    f64(nowMs(vlx.metadata.lastUnlockedAt)),
    f64(nowMs(vlx.metadata.lastPasswordResetAt)),
    f64(nowMs(vlx.metadata.recoveryGeneratedAt)),
    u16(nameBytes.length),
    nameBytes,
    u16(salt.length),
    salt,
    u32(vlx.encryption.kdfIterations),
    u16(vlx.encryption.keyLength),
    encFrag(vlx.wrappedVek.withMasterKey),
    encFrag(vlx.wrappedVek.withRecoveryKey),
    encFrag(vlx.vaultData),
    mdDigest,
    vdDigest,
  ])
}

function decodePayload(payload: Uint8Array): VlxFile {
  if (payload[0] !== PAYLOAD_VERSION) throw new Error('Unsupported VLX payload version')
  const majorVersion = payload[1]
  const r = readFactory(payload.slice(2))
  const vaultId = bytesToUuid(r.takeBytes(16))
  const createdAt = new Date(r.vf64()).toISOString()
  const updatedAt = new Date(r.vf64()).toISOString()
  const lastUnlockedAt = isoFromMs(r.vf64())
  const lastPasswordResetAt = isoFromMs(r.vf64())
  const recoveryGeneratedAt = new Date(r.vf64()).toISOString()
  const nameLen = r.vu16()
  const name = decoder.decode(r.takeBytes(nameLen))
  const salt = bytesToBase64(r.takeBytes(r.vu16()))
  const kdfIterations = r.vu32()
  const keyLength = r.vu16()
  const wrappedMaster = r.frag()
  const wrappedRecovery = r.frag()
  const vaultData = r.frag()
  const metadataDigest = bytesToBase64(r.takeBytes(32))
  const vaultDataDigest = bytesToBase64(r.takeBytes(32))

  return {
    format: 'vaulix.vlx',
    metadata: {
      createdAt,
      updatedAt,
      lastUnlockedAt,
      lastPasswordResetAt,
      recoveryGeneratedAt,
      vaultId,
      version: `${majorVersion}.0`,
      name,
    },
    encryption: {
      algorithm: 'AES-GCM',
      kdf: 'PBKDF2-SHA256',
      kdfIterations,
      salt,
      keyLength,
    },
    wrappedVek: { withMasterKey: wrappedMaster, withRecoveryKey: wrappedRecovery },
    vaultData,
    integrity: { algorithm: 'SHA-256', metadataDigest, vaultDataDigest },
  }
}

async function packEnvelope(payload: Uint8Array) {
  const digest = await sha256Bytes(payload)
  return concat([MAGIC, new Uint8Array([ENVELOPE_VERSION]), u32(payload.length), payload, digest])
}
async function unpackEnvelope(bytes: Uint8Array) {
  for (let i = 0; i < 4; i += 1) if (bytes[i] !== MAGIC[i]) throw new Error('Invalid binary container header')
  if (bytes[4] !== ENVELOPE_VERSION) throw new Error('Unsupported binary container version')
  const len = new DataView(bytes.slice(5, 9).buffer).getUint32(0, false)
  const payload = bytes.slice(9, 9 + len)
  const digest = bytes.slice(9 + len, 9 + len + 32)
  if (9 + len + 32 !== bytes.length) throw new Error('Corrupted binary container size')
  const actual = await sha256Bytes(payload)
  for (let i = 0; i < 32; i += 1) if (digest[i] !== actual[i]) throw new Error('Binary container integrity check failed')
  return payload
}

function validateVlx(vlx: VlxFile) {
  if (vlx.format !== 'vaulix.vlx') throw new Error('Invalid .vlx format')
}

export async function createVault(params: { password: string; name: string }): Promise<CreateVaultResult> {
  const now = new Date().toISOString()
  const vaultId = createVaultId()
  const salt = generateRandomBytes(16)
  const masterKey = await deriveMasterKey(params.password, salt)
  const vekRaw = generateRandomBytes(32)
  const vek = await importAesKey(vekRaw)
  const wrappedVekWithMaster = await wrapKey(vekRaw, masterKey)
  const recoveryKey = randomBase64(32)
  const recoveryKeyBytes = Uint8Array.from(atob(recoveryKey), (c) => c.charCodeAt(0))
  const recoveryAesKey = await importAesKey(recoveryKeyBytes)
  const wrappedVekWithRecovery = await wrapKey(vekRaw, recoveryAesKey)
  const vaultData = await encryptPayload({ entries: [] } as VaultData, vek)

  const metadata: VaultMetadata = {
    createdAt: now,
    updatedAt: now,
    lastUnlockedAt: null,
    lastPasswordResetAt: null,
    recoveryGeneratedAt: now,
    vaultId,
    version: '1.0',
    name: params.name.trim(),
  }
  const vlx: VlxFile = {
    format: 'vaulix.vlx',
    metadata,
    encryption: { algorithm: 'AES-GCM', kdf: 'PBKDF2-SHA256', kdfIterations: 200_000, salt: btoa(String.fromCharCode(...salt)), keyLength: 256 },
    wrappedVek: { withMasterKey: wrappedVekWithMaster, withRecoveryKey: wrappedVekWithRecovery },
    vaultData,
    integrity: await computeIntegrity(metadata, vaultData),
  }
  return { vlx, recoveryKey }
}

export async function serializeVaultToBinary(vlx: VlxFile) {
  validateVlx(vlx)
  return packEnvelope(encodePayload(vlx))
}
export async function serializeVault(vlx: VlxFile) { return bytesToBase64(await serializeVaultToBinary(vlx)) }

export async function deserializeVaultFromBinary(bytes: Uint8Array): Promise<VlxFile> {
  const payload = await unpackEnvelope(bytes)
  const vlx = decodePayload(payload)
  const integrity = await computeIntegrity(vlx.metadata, vlx.vaultData)
  if (integrity.metadataDigest !== vlx.integrity.metadataDigest || integrity.vaultDataDigest !== vlx.integrity.vaultDataDigest) throw new Error('Vault integrity check failed')
  return vlx
}

export async function deserializeVault(serialized: string): Promise<VlxFile> {
  const t = serialized.trim()
  if (t.startsWith('{')) {
    const parsed = JSON.parse(t) as VlxFile
    validateVlx(parsed)
    return parsed
  }
  return deserializeVaultFromBinary(base64ToBytes(t))
}

function makeEntryId() { return (crypto as any).randomUUID ? (crypto as any).randomUUID() : 'entry-' + Math.random().toString(36).slice(2, 10) }
async function unwrapVekWithPassword(vlx: VlxFile, password: string) {
  const salt = Uint8Array.from(atob(vlx.encryption.salt), (c) => c.charCodeAt(0))
  const masterKey = await deriveMasterKey(password, salt)
  return importAesKey(await unwrapKey(vlx.wrappedVek.withMasterKey, masterKey))
}

export async function unlockVault(serialized: string, password: string) {
  const vlx = await deserializeVault(serialized)
  const key = await unwrapVekWithPassword(vlx, password)
  return { vlx, data: await decryptPayload(vlx.vaultData, key) as VaultData }
}

export async function addCredential(params: { serialized: string; password: string; credential: AddCredentialInput }): Promise<{ serialized: string; entry: VaultEntry; entries: VaultEntry[] }> {
  const { vlx, data } = await unlockVault(params.serialized, params.password)
  const now = new Date().toISOString()
  const entry: VaultEntry = {
    id: makeEntryId(),
    service: params.credential.service.trim(),
    username: params.credential.username.trim(),
    secret: params.credential.secret,
    notes: params.credential.notes?.trim() || '',
    createdAt: now,
    updatedAt: now,
  }
  const entries = [entry, ...(data.entries ?? [])]
  const key = await unwrapVekWithPassword(vlx, params.password)
  const encrypted = await encryptPayload({ entries } as VaultData, key)
  const updated: VlxFile = { ...vlx, metadata: { ...vlx.metadata, updatedAt: now, lastUnlockedAt: now }, vaultData: encrypted, integrity: vlx.integrity }
  updated.integrity = await computeIntegrity(updated.metadata, updated.vaultData)
  return { serialized: await serializeVault(updated), entry, entries }
}

export async function resetMasterPasswordWithRecovery(params: {
  serialized: string
  recovery: RecoveryPayloadLike
  newPassword: string
}): Promise<{ serialized: string; newRecovery: RecoveryPayloadLike }> {
  const vlx = await deserializeVault(params.serialized)
  if (params.recovery.vaultId !== vlx.metadata.vaultId) {
    throw new Error('Recovery file does not match this vault.')
  }

  const recoveryBytes = Uint8Array.from(atob(params.recovery.recoveryKey), (c) => c.charCodeAt(0))
  const recoveryKey = await importAesKey(recoveryBytes)
  const vekRaw = await unwrapKey(vlx.wrappedVek.withRecoveryKey, recoveryKey)

  const salt = Uint8Array.from(atob(vlx.encryption.salt), (c) => c.charCodeAt(0))
  const newMasterKey = await deriveMasterKey(params.newPassword, salt)
  const wrappedWithNewMaster = await wrapKey(vekRaw, newMasterKey)

  const newRecoveryKey = randomBase64(32)
  const newRecoveryKeyBytes = Uint8Array.from(atob(newRecoveryKey), (c) => c.charCodeAt(0))
  const newRecoveryAesKey = await importAesKey(newRecoveryKeyBytes)
  const wrappedWithNewRecovery = await wrapKey(vekRaw, newRecoveryAesKey)

  const now = new Date().toISOString()
  const updated: VlxFile = {
    ...vlx,
    metadata: {
      ...vlx.metadata,
      updatedAt: now,
      lastUnlockedAt: now,
      lastPasswordResetAt: now,
      recoveryGeneratedAt: now,
    },
    wrappedVek: {
      withMasterKey: wrappedWithNewMaster,
      withRecoveryKey: wrappedWithNewRecovery,
    },
  }
  updated.integrity = await computeIntegrity(updated.metadata, updated.vaultData)

  return {
    serialized: await serializeVault(updated),
    newRecovery: {
      version: '1.0',
      recoveryKey: newRecoveryKey,
      wrappedVekWithRecovery: wrappedWithNewRecovery,
      vaultId: updated.metadata.vaultId,
    },
  }
}
