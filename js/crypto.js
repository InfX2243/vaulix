// =========================
// GhostKey Crypto Module
// AES-256-GCM Encryption
// =========================

const GhostKeyCrypto = {
    encoder: new TextEncoder(),
    decoder: new TextDecoder()
};

async function importKey(rawKey) {
    return await crypto.subtle.importKey(
        "raw",
        rawKey,
        "AES-GCM",
        false,
        ["encrypt", "decrypt"]
    );
}

async function encryptData(plainText, key) {

    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encoded = GhostKeyCrypto.encoder.encode(plainText);

    const cipherBuffer = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoded
    );

    return {
        version: 1,
        iv: arrayBufferToBase64(iv),
        ciphertext: arrayBufferToBase64(cipherBuffer),
        algorithm: "AES-GCM"
    };
}

async function decryptData(payload, key) {

    const iv = base64ToArrayBuffer(payload.iv);
    const data = base64ToArrayBuffer(payload.ciphertext);

    const plainBuffer = await crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        data
    );

    return GhostKeyCrypto.decoder.decode(plainBuffer);
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);

    bytes.forEach(b => binary += String.fromCharCode(b));

    return window.btoa(binary);
}

function base64ToArrayBuffer(base64) {
    const binary = window.atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }

    return bytes.buffer;
}

window.GhostKeyCrypto = {
    encryptData,
    decryptData,
    importKey
};