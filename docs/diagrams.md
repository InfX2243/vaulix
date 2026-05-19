# Diagrams

Implementation-aligned architecture and flow diagrams.

## High-Level Runtime

```mermaid
flowchart TB
    U["User"] --> UI["Vaulix UI (React)"]
    UI --> C["Crypto Layer (Web Crypto API)"]
    C --> DB["IndexedDB (Encrypted Record)"]
    UI --> LS["localStorage (flags + serialized .vlx cache)"]
    UI --> FILES["Binary Files: .vlx / .vlk"]
```

## Vault Creation

```mermaid
flowchart TD
    G["Gateway"] --> CV["Create Vault"]
    CV --> PW["Set Master Password"]
    PW --> GEN["Generate Salt + VEK + Recovery Key"]
    GEN --> ENC["Encrypt Vault Data (AES-GCM)"]
    ENC --> WRAP["Wrap VEK (Master + Recovery)"]
    WRAP --> VLX["Build Binary .vlx"]
    WRAP --> VLK["Build Binary .vlk"]
    VLK --> DL["User Downloads .vlk"]
    DL --> SAVE["Persist Vault Locally"]
    SAVE --> DASH["Open Dashboard"]
```

## Unlock and Credential Add

```mermaid
flowchart TD
    L["Locked Vault"] --> MP["Enter Master Password"]
    MP --> DER["Derive Master Key (PBKDF2)"]
    DER --> UNWRAP["Unwrap VEK"]
    UNWRAP --> DEC["Decrypt Vault Payload"]
    DEC --> MEM["In-Memory Entries"]
    MEM --> ADD["Add Credential"]
    ADD --> REENC["Re-encrypt Vault Payload"]
    REENC --> PERSIST["Persist Updated .vlx"]
```

## Forgot Password Reset (`.vlk`)

```mermaid
flowchart TD
    FP["Forgot Password"] --> UP["Upload .vlk"]
    UP --> VALID["Validate .vlk + vaultId"]
    VALID --> NP["Set New Master Password"]
    NP --> R1["Unwrap VEK with Recovery Key"]
    R1 --> R2["Wrap VEK with New Master Key"]
    R2 --> R3["Rotate Recovery Key + Wrap VEK"]
    R3 --> UVLX["Update .vlx metadata + wraps"]
    UVLX --> NVLK["Generate New .vlk"]
    NVLK --> GATE["Require .vlk Download"]
    GATE --> ACCESS["Allow Vault Access"]
```

## Import / Export

```mermaid
flowchart LR
    EXP["Export .vlx"] --> BIN1["Binary Envelope Encode"] --> FILE["Download File"]
    FILE --> IMP["Import .vlx"]
    IMP --> BIN2["Binary Envelope Decode + Digest Check"]
    BIN2 --> SAVE["Save Vault Local"]
```

## Multi-Vault Continue Flow

```mermaid
flowchart TD
    G["Gateway"] --> C["Continue Vault"]
    C --> LIST["Show Local Vault List"]
    LIST --> META["Show createdAt + lastOpenedAt + source badge"]
    META --> PICK["User Picks Vault"]
    PICK --> TOUCH["Update lastOpenedAt"]
    TOUCH --> DASH["Open Selected Vault Dashboard"]
```

## In-Dashboard Vault Deletion Flow

```mermaid
flowchart TD
    M["Vault Management"] --> W["Show Warning + Risk Notice"]
    W --> ACK["User Acknowledges"]
    ACK --> BK["Mandatory Backup Step"]
    BK --> DVLX["Download .vlx"]
    BK --> DVLK["Download .vlk"]
    DVLX --> READY["Both Downloads Completed"]
    DVLK --> READY
    READY --> CONF["Type Vault Name Confirmation"]
    CONF --> DEL["Delete Vault Locally"]
    DEL --> REFRESH["Refresh Vault List + Active State"]
```
