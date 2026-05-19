# Vaulix Architecture

## 1. Design Goals

- Keep secrets encrypted at rest and in transit.
- Operate as local-first by default.
- Provide portable vault backups without server dependency.
- Support secure master-password reset via recovery material.

## 2. Runtime Layers

- `src/pages`: stage-level app routing and major views.
- `src/components`: UI flows (create, reset, dashboard interactions).
- `src/lib/crypto.ts`: primitive crypto operations (PBKDF2, AES-GCM, wrap/unwrap).
- `src/lib/vaultContainer.ts`: `.vlx` binary encoding/decoding + vault mutation pipeline.
- `src/lib/recoveryContainer.ts`: `.vlk` binary encoding/decoding.
- `src/lib/vaultStorage.ts`: IndexedDB persistence + localStorage cache.

## 3. Trust Boundary

- Trusted runtime: browser process + in-memory state.
- Persistent local stores:
  - IndexedDB: structured encrypted vault record.
  - localStorage: serialized binary `.vlx` (base64) for fast access.
- Exported files:
  - `.vlx` binary vault file.
  - `.vlk` binary recovery file.

## 4. Cryptographic Model

1. Master password -> PBKDF2-SHA256 -> master wrapping key.
2. Generate random VEK (256-bit).
3. Encrypt vault payload with VEK using AES-GCM.
4. Wrap VEK with:
   - master-derived key
   - recovery key
5. Store only encrypted/wrapped material.

## 5. Container Integrity

Both `.vlx` and `.vlk` include:

- binary magic marker
- envelope version
- payload length
- payload bytes
- SHA-256 digest over payload bytes

Parsing fails on header/version/length/digest mismatch.

## 6. Vault Lifecycle

1. Create vault:
   - initialize metadata
   - encrypt empty vault data
   - generate `.vlk`
   - persist `.vlx`
2. Unlock vault:
   - unwrap VEK with master password
   - decrypt vault payload in memory
3. Mutate vault (add credential):
   - decrypt -> update -> re-encrypt
   - update metadata/integrity
4. Export/import:
   - binary `.vlx` download and upload
5. Forgot-password reset:
   - use `.vlk` recovery to unwrap VEK
   - re-wrap with new master password
   - rotate recovery key and issue new `.vlk`
6. Multi-vault selection:
   - all local vaults are listed in gateway continue flow
   - user selects active vault by `vaultId`
   - `lastOpenedAt` is updated when vault is selected/opened
   - imported vaults are marked with `source: imported`
7. In-dashboard vault management:
   - switch active vault without returning to gateway
   - delete flow requires:
     - user acknowledgement
     - mandatory backup downloads (`.vlx` + `.vlk`)
     - typed vault-name confirmation
   - vault deletion removes local record and refreshes active vault state

## 7. Security Considerations

- Plaintext keys/metadata strings are not serialized as clear JSON in file payloads.
- Secrets are decrypted only in memory after unlock/reset.
- Recovery flow requires possession of `.vlk`.
- Current app is client-only; secure endpoint hygiene remains user/device-dependent.
