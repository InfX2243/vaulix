const MAGIC = new Uint8Array([0xb2, 0x7a, 0x19, 0x63])
const ENVELOPE_VERSION = 1
const PAYLOAD_VERSION = 2

export interface RecoveryPayload {
  version: string
  recoveryKey: string
  wrappedVekWithRecovery: { iv: string; data: string }
  vaultId: string
}

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((s, p) => s + p.length, 0)
  const out = new Uint8Array(total)
  let o = 0
  for (const p of parts) { out.set(p, o); o += p.length }
  return out
}
function u16(n: number) { const b = new Uint8Array(2); new DataView(b.buffer).setUint16(0, n, false); return b }
function u32(n: number) { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, false); return b }
function base64ToBytes(value: string) {
  const binary = atob(value)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) out[i] = binary.charCodeAt(i)
  return out
}
function bytesToBase64(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)) }
function encFrag(f: { iv: string; data: string }) {
  const iv = base64ToBytes(f.iv)
  const data = base64ToBytes(f.data)
  return concat([u16(iv.length), iv, u32(data.length), data])
}
function readFactory(bytes: Uint8Array) {
  let o = 0
  const take = (n: number) => { const s = bytes.slice(o, o + n); o += n; return s }
  const vu16 = () => new DataView(take(2).buffer).getUint16(0, false)
  const vu32 = () => new DataView(take(4).buffer).getUint32(0, false)
  const frag = () => ({ iv: bytesToBase64(take(vu16())), data: bytesToBase64(take(vu32())) })
  return { take, frag }
}
function uuidToBytes(id: string) {
  const clean = id.replace(/-/g, '')
  const out = new Uint8Array(16)
  if (!/^[0-9a-fA-F]{32}$/.test(clean)) return out
  for (let i = 0; i < 16; i += 1) out[i] = parseInt(clean.slice(i * 2, i * 2 + 2), 16)
  return out
}
function bytesToUuid(bytes: Uint8Array) {
  const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('')
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}
async function sha256(bytes: Uint8Array) {
  const copy = new Uint8Array(bytes.length)
  copy.set(bytes)
  return new Uint8Array(await crypto.subtle.digest('SHA-256', copy as BufferSource))
}

function encodePayload(payload: RecoveryPayload) {
  const rk = base64ToBytes(payload.recoveryKey)
  return concat([new Uint8Array([PAYLOAD_VERSION]), uuidToBytes(payload.vaultId), u16(rk.length), rk, encFrag(payload.wrappedVekWithRecovery)])
}
function decodePayload(bytes: Uint8Array): RecoveryPayload {
  if (bytes[0] !== PAYLOAD_VERSION) throw new Error('Unsupported .vlk payload version')
  const r = readFactory(bytes.slice(1))
  const vaultId = bytesToUuid(r.take(16))
  const rkLen = new DataView(r.take(2).buffer).getUint16(0, false)
  const recoveryKey = bytesToBase64(r.take(rkLen))
  const wrappedVekWithRecovery = r.frag()
  return { version: '1.0', recoveryKey, wrappedVekWithRecovery, vaultId }
}

export async function serializeRecoveryToBinary(payload: RecoveryPayload) {
  const p = encodePayload(payload)
  const d = await sha256(p)
  return concat([MAGIC, new Uint8Array([ENVELOPE_VERSION]), u32(p.length), p, d])
}

export async function deserializeRecoveryFromBinary(bytes: Uint8Array): Promise<RecoveryPayload> {
  for (let i = 0; i < 4; i += 1) if (bytes[i] !== MAGIC[i]) throw new Error('Invalid .vlk header')
  if (bytes[4] !== ENVELOPE_VERSION) throw new Error('Unsupported .vlk version')
  const len = new DataView(bytes.slice(5, 9).buffer).getUint32(0, false)
  const payload = bytes.slice(9, 9 + len)
  const digest = bytes.slice(9 + len, 9 + len + 32)
  if (9 + len + 32 !== bytes.length) throw new Error('Corrupted .vlk size')
  const actual = await sha256(payload)
  for (let i = 0; i < 32; i += 1) if (actual[i] !== digest[i]) throw new Error('Recovery file integrity check failed')
  const parsed = decodePayload(payload)
  if (!parsed.vaultId || !parsed.recoveryKey) throw new Error('Invalid recovery payload')
  return parsed
}
