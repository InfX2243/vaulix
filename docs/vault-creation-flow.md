# Vault Creation Flow

## Overview

The create-vault flow initializes a new encrypted vault and recovery path without exposing plaintext vault content.

## Steps

1. User opens create flow from gateway.
2. User sets vault name.
3. User sets master password (strength feedback shown).
4. App generates:
   - random salt
   - random VEK
   - recovery key
5. App performs:
   - master key derivation (PBKDF2)
   - VEK wrap with master key
   - VEK wrap with recovery key
   - AES-GCM encryption of initial vault payload
6. App serializes:
   - `.vlx` binary container
   - `.vlk` binary recovery file
7. User is required to download `.vlk`.
8. Vault record is saved locally after confirmation.
9. User is routed to vault dashboard.

## Persistence

- IndexedDB stores vault record and serialized vault container.
- localStorage stores quick flags and `.vlx` base64 cache.

## Guarantees

- No plaintext credentials are stored.
- VEK is never persisted unwrapped.
- Recovery file is generated client-side only.
