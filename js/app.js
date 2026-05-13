// =========================
// GhostKey Core App
// =========================

console.log("GhostKey initialized");

// =========================
// App State (future use)
// =========================

const GhostKeyApp = {
    state: "initial", // initial | loading | ready | error
    initialized: false,

    data: {
        vaults: [],
        activeVault: null
    },

    errors: [],

    listeners: []
};

function setState(newState) {
    GhostKeyApp.state = newState;
    notifyListeners();
}

function subscribe(callback) {
    GhostKeyApp.listeners.push(callback);
}

function notifyListeners() {
    GhostKeyApp.listeners.forEach(cb => cb(GhostKeyApp));
}

// =========================
// Core Initialization
// =========================

function initializeModules() {
    // Future hooks:
    // initCrypto();
    // initStorage();
    // initUI();

    console.log("Modules initialized (placeholder)");
}

function initApp() {
    console.log("GhostKey initializing...");

    setState("loading");

    try {
        // Simulated boot process (future: crypto init, storage init)
        initializeModules();

        GhostKeyApp.initialized = true;

        setState("ready");

        console.log("GhostKey ready.");
    } catch (err) {
        console.error("Initialization failed:", err);

        GhostKeyApp.errors.push(err);
        setState("error");
    }
}

// =========================
// Event Binding
// =========================

document.addEventListener("DOMContentLoaded", initApp);
subscribe((app) => {
    console.log("[GhostKey State Update]", app.state);
});