# GhostKey

GhostKey is a client-side, zero-knowledge credential vault designed to securely encrypt and manage sensitive data directly in the browser before storing it in an external persistence layer.

All encryption operations occur locally, ensuring that plaintext credentials are never transmitted or stored in an unencrypted form.

---

## Overview

GhostKey is built around a zero-knowledge architecture where the user retains full control of encryption keys. The system ensures that:

- Credentials are encrypted in the browser before leaving the client
- Decryption is only possible with a user-provided master key
- External storage contains only encrypted payloads

This design minimizes trust assumptions on any backend or storage provider.

---

## Core Principles

### Zero-Knowledge Design
The system is structured so that stored data is never readable without the user’s master key.

### Client-Side Cryptography
All cryptographic operations are executed in the browser using the Web Crypto API.

### Minimal Exposure
No plaintext credentials are stored in local storage, transmitted over the network, or exposed in logs.

---

## Planned Architecture

GhostKey follows a fully client-driven architecture:

- Frontend Application: Handles UI and cryptographic operations
- Web Crypto API: Provides secure encryption primitives
- Google Sheets Storage Layer: Stores only encrypted payloads
- Google Apps Script: Acts as a lightweight API interface

---

## Security Model

GhostKey assumes that:

- The client environment is trusted by the user
- The master password is never transmitted or stored
- Encryption keys are derived locally using PBKDF2
- Each credential entry uses unique cryptographic salts and initialization vectors

---

## Data Flow

1. User enters credential data in the browser
2. System derives encryption key from master password
3. Data is encrypted locally using AES-GCM
4. Encrypted payload is sent to external storage
5. Retrieval requires decryption using the same master key locally

---

## Technology Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Web Crypto API
- Google Sheets (planned storage layer)
- Google Apps Script (planned API layer)

---

## Project Status

GhostKey is currently in early development. Core architecture and encryption modules are under active implementation.

---

## Security Disclaimer

GhostKey is a client-side encryption system. Security depends heavily on correct usage, secure master password selection, and trusted execution environment. It is not intended to replace audited enterprise-grade password managers at this stage.

---

## Roadmap

- Core UI implementation
- AES-GCM encryption module
- PBKDF2 key derivation system
- Credential storage integration
- Retrieval and decryption flow
- UI/UX refinement and optimization