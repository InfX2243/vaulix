import { decryptPayload, deriveMasterKey, encryptPayload, generateRandomBytes, importAesKey, randomBase64, unwrapKey, wrapKey } from './crypto'

export interface EncryptedFragment {
  iv: string
  data: string
}

export interface VaultEntry {
  id: string
  service: string
  username: string
  secret: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface VaultData {
  entries: VaultEntry[]
}

export interface AddCredentialInput {
  service: string
  username: string
  secret: string
  notes?: string
}

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
  encryption: {
    algorithm: 'AES-GCM'
    kdf: 'PBKDF2-SHA256'
    kdfIterations: number
    salt: string
    keyLength: number
  }
  wrappedVek: {
    withMasterKey: EncryptedFragment
    withRecoveryKey: EncryptedFragment
  }
  vaultData: EncryptedFragment
  integrity: {
    algorithm: 'SHA-256'
    metadataDigest: string
    vaultDataDigest: string
  }
}

export interface CreateVaultResult {
  vlx: VlxFile
  recoveryKey: string
}

const encoder = new TextEncoder()

function b64FromBuffer(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

async function sha256Base64(value: string) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(value))
  return b64FromBuffer(digest)
}

async function computeIntegrity(metadata: VaultMetadata, vaultData: EncryptedFragment) {
  return {
    algorithm: 'SHA-256' as const,
    metadataDigest: await sha256Base64(JSON.stringify(metadata)),
    vaultDataDigest: await sha256Base64(JSON.stringify(vaultData)),
  }
}

function createVaultId() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : 'vault-' + Math.random().toString(36).slice(2, 10)
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

  const initialVault: VaultData = { entries: [] }
  const vaultData = await encryptPayload(initialVault, vek)

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
    encryption: {
      algorithm: 'AES-GCM',
      kdf: 'PBKDF2-SHA256',
      kdfIterations: 200_000,
      salt: btoa(String.fromCharCode(...salt)),
      keyLength: 256,
    },
    wrappedVek: {
      withMasterKey: wrappedVekWithMaster,
      withRecoveryKey: wrappedVekWithRecovery,
    },
    vaultData,
    integrity: await computeIntegrity(metadata, vaultData),
  }

  return { vlx, recoveryKey }
}

export function serializeVault(vlx: VlxFile) {
  return JSON.stringify(vlx, null, 2)
}

export async function deserializeVault(serialized: string): Promise<VlxFile> {
  const parsed = JSON.parse(serialized) as VlxFile

  if (!parsed || parsed.format !== 'vaulix.vlx') {
    throw new Error('Invalid .vlx format')
  }
  if (!parsed.metadata || !parsed.vaultData || !parsed.wrappedVek || !parsed.integrity) {
    throw new Error('Incomplete .vlx container')
  }

  const integrity = await computeIntegrity(parsed.metadata, parsed.vaultData)
  if (
    integrity.metadataDigest !== parsed.integrity.metadataDigest ||
    integrity.vaultDataDigest !== parsed.integrity.vaultDataDigest
  ) {
    throw new Error('Vault integrity check failed')
  }

  return parsed
}

export const vaultCrypto = {
  async decryptVaultWithPassword(vlx: VlxFile, password: string): Promise<VaultData> {
    const salt = Uint8Array.from(atob(vlx.encryption.salt), (c) => c.charCodeAt(0))
    const masterKey = await deriveMasterKey(password, salt)
    const vekRaw = await unwrapKey(vlx.wrappedVek.withMasterKey, masterKey)
    const vek = await importAesKey(vekRaw)
    return decryptPayload(vlx.vaultData, vek) as Promise<VaultData>
  },
}

function makeEntryId() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : 'entry-' + Math.random().toString(36).slice(2, 10)
}

async function unwrapVekWithPassword(vlx: VlxFile, password: string) {
  const salt = Uint8Array.from(atob(vlx.encryption.salt), (c) => c.charCodeAt(0))
  const masterKey = await deriveMasterKey(password, salt)
  const vekRaw = await unwrapKey(vlx.wrappedVek.withMasterKey, masterKey)
  return importAesKey(vekRaw)
}

export async function unlockVault(serialized: string, password: string) {
  const vlx = await deserializeVault(serialized)
  const vek = await unwrapVekWithPassword(vlx, password)
  const decrypted = await decryptPayload(vlx.vaultData, vek) as VaultData
  return { vlx, data: decrypted }
}

export async function addCredential(params: {
  serialized: string
  password: string
  credential: AddCredentialInput
}): Promise<{ serialized: string; entry: VaultEntry; entries: VaultEntry[] }> {
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

  const nextData: VaultData = {
    entries: [entry, ...(data.entries ?? [])],
  }

  const vek = await unwrapVekWithPassword(vlx, params.password)
  const encrypted = await encryptPayload(nextData, vek)

  const updated: VlxFile = {
    ...vlx,
    metadata: {
      ...vlx.metadata,
      updatedAt: now,
      lastUnlockedAt: now,
    },
    vaultData: encrypted,
  }

  updated.integrity = await computeIntegrity(updated.metadata, updated.vaultData)

  return {
    serialized: serializeVault(updated),
    entry,
    entries: nextData.entries,
  }
}
