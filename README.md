# Vaulix

Security that stays with you.

Vaulix is a local-first, privacy-focused password vault built with React + TypeScript.  
Encryption and decryption happen in the browser, and vault data is stored as encrypted binary containers.

## Product Highlights

- Zero-knowledge model: no plaintext credentials persisted.
- Binary vault container (`.vlx`) for encrypted backup/portability.
- Binary recovery file (`.vlk`) for master-password reset flow.
- Gateway import/export flow for vault portability.
- Credential UX with add, masked reveal, and copy actions.

## Current Scope

Implemented now:

- Landing, gateway, and dashboard flows.
- Vault creation with strong-password gating.
- Binary `.vlx` + `.vlk` generation and validation.
- Vault import/export from/to binary files.
- Forgot-password reset using `.vlk`, with forced new `.vlk` download before re-entry.
- Credential add flow with decrypt -> mutate -> re-encrypt pipeline.

Planned next:

- Edit/delete credentials.
- Recovery-only unlock mode.
- Cloud sync providers (Google Drive).
- Session timeout/auto-lock hardening.

## Tech Stack

- React 18
- TypeScript 5
- Vite
- Tailwind CSS
- Web Crypto API (PBKDF2 + AES-GCM)
- IndexedDB + localStorage

## Quick Start

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Security Model (Current)

- Master password derives wrapping key via PBKDF2-SHA256.
- Vault Encryption Key (VEK) encrypts vault payload with AES-GCM.
- VEK is wrapped by:
  - master-derived key
  - recovery key
- Binary envelope digest checks detect file tampering.

Note: File obfuscation and encryption help reduce accidental leakage and tampering risk, but endpoint security (device compromise, keylogging, malware) remains out of scope for client-only apps.

## Documentation

See [`docs/`](docs/) for full project documentation:

- Product and architecture
- Vault/recovery binary formats
- Creation and reset flows
- Implementation status and roadmap
- Updated mermaid diagrams

## Scripts

- `npm run dev` - start development server
- `npm run build` - compile and build production assets
- `npm run preview` - preview built app

## License

MIT
