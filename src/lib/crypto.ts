const encoder = new TextEncoder()
const decoder = new TextDecoder()

function base64FromArrayBuffer(buffer: ArrayBuffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

function arrayBufferFromBase64(base64: string) {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

export async function deriveMasterKey(password: string, salt: Uint8Array) {
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 200_000,
      hash: 'SHA-256',
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export function generateRandomBytes(length = 32) {
  const buffer = new Uint8Array(length)
  crypto.getRandomValues(buffer)
  return buffer
}

export function randomBase64(length = 32) {
  const bytes = generateRandomBytes(length)
  return base64FromArrayBuffer(bytes.buffer)
}

export async function importAesKey(raw: Uint8Array) {
  return crypto.subtle.importKey(
    'raw',
    raw as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  )
}

export async function encryptPayload(payload: unknown, key: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const data = encoder.encode(JSON.stringify(payload))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data)

  return {
    iv: base64FromArrayBuffer(iv.buffer),
    data: base64FromArrayBuffer(encrypted),
  }
}

export async function decryptPayload(encrypted: { iv: string; data: string }, key: CryptoKey) {
  const iv = new Uint8Array(arrayBufferFromBase64(encrypted.iv))
  const data = arrayBufferFromBase64(encrypted.data)
  const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data)
  return JSON.parse(decoder.decode(decrypted))
}

export async function wrapKey(rawKey: Uint8Array, wrappingKey: CryptoKey) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, wrappingKey, rawKey as BufferSource)

  return {
    iv: base64FromArrayBuffer(iv.buffer),
    data: base64FromArrayBuffer(encrypted),
  }
}

export async function unwrapKey(encrypted: { iv: string; data: string }, wrappingKey: CryptoKey) {
  const iv = new Uint8Array(arrayBufferFromBase64(encrypted.iv))
  const data = arrayBufferFromBase64(encrypted.data)
  const raw = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, wrappingKey, data)
  return new Uint8Array(raw)
}
