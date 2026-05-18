# `.vlx` Vault Container Format

## 1. Overview

`.vlx` is the Vaulix portable vault backup file.  
It is a binary container and not human-readable JSON.

## 2. Envelope Format

| Offset | Length | Description |
|---|---:|---|
| 0 | 4 bytes | magic bytes (binary marker) |
| 4 | 1 byte | envelope version |
| 5 | 4 bytes | payload length (uint32 big-endian) |
| 9 | N bytes | binary payload |
| 9+N | 32 bytes | SHA-256 digest(payload) |

Validation rejects malformed or tampered files.

## 3. Payload Format (current)

Payload is binary field-encoded, not key/value JSON strings.

High-level logical fields represented in payload:

- format/version markers
- `vaultId` (16-byte uuid form)
- metadata timestamps as numeric epoch values
- vault name bytes
- KDF configuration (`iterations`, `keyLength`, salt bytes)
- wrapped VEK (master)
- wrapped VEK (recovery)
- encrypted vault data fragment
- logical integrity digests (`metadataDigest`, `vaultDataDigest`)

## 4. Logical Vault Model

The decoded logical model in app memory is:

- `metadata`
  - `createdAt`
  - `updatedAt`
  - `lastUnlockedAt`
  - `lastPasswordResetAt`
  - `recoveryGeneratedAt`
  - `vaultId`
  - `version`
  - `name`
- `encryption`
  - algorithm: AES-GCM
  - kdf: PBKDF2-SHA256
  - iterations
  - salt
  - keyLength
- `wrappedVek`
  - master-wrapped fragment
  - recovery-wrapped fragment
- `vaultData`
  - AES-GCM encrypted vault payload fragment
- `integrity`
  - metadata digest
  - vaultData digest

## 5. Security Notes

- Credentials are never persisted in plaintext.
- File-level digest protects binary payload tampering.
- Logical integrity digests protect internal consistency checks after decode.
- `.vlx` should be treated as sensitive despite binary obfuscation.
