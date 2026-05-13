// =========================
// GhostKey Core App
// =========================

console.log("GhostKey initialized");

// =========================
// App State (future use)
// =========================

const GhostKeyApp = {
    initialized: false,
    userSession: null
};

// =========================
// Core Initialization
// =========================

function initApp() {
    console.log("Initializing GhostKey system...");

    GhostKeyApp.initialized = true;

    // Future modules will plug in here:
    // initCrypto();
    // initUI();
    // initStorage();

    console.log("GhostKey ready.");
}

// =========================
// Event Binding
// =========================

document.addEventListener("DOMContentLoaded", initApp);