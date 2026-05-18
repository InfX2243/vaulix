# Forgot Password / Master Password Reset Flow

## Overview

Vaulix supports password reset via recovery file (`.vlk`) when master password is forgotten.

## User Flow

1. User clicks `Forgot password?` on locked vault screen.
2. User uploads `.vlk` recovery file.
3. User enters and confirms a new master password.
4. App validates recovery file and vault binding (`vaultId` match).
5. App resets key wrapping:
   - unwrap VEK using recovery key from `.vlk`
   - wrap VEK with new master-password-derived key
   - rotate recovery key and wrap VEK again
6. App updates vault metadata:
   - `updatedAt`
   - `lastPasswordResetAt`
   - `recoveryGeneratedAt`
   - `lastUnlockedAt`
7. App generates a new `.vlk` file.
8. User must download new `.vlk` before continuing.
9. Updated `.vlx` is persisted and vault unlock proceeds with new password.

## Security Behavior

- Reset requires possession of valid `.vlk`.
- Old recovery material is rotated out.
- New master password updates wrapped VEK in `.vlx`.
- Download gate prevents accidental loss of new recovery data.
