 

export default function GatewayPage({ vaultExists, onCreateVault, onContinueVault, onBack }: {
  vaultExists: boolean
  onCreateVault: () => void
  onContinueVault: () => void
  onBack: () => void
}) {
  return (
    <div className="min-h-screen bg-vaulix-main-bg text-vaulix-main-text">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between rounded-2xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 p-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/90">Gateway</p>
            <h1 className="mt-3 text-3xl font-semibold">Welcome to Vaulix</h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-vaulix-secondary-text">
              The gateway is your secure entry point into the vault experience. Create a new vault, continue an existing one, or prepare for future sync and import flows.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 text-right">
            <span className="text-sm text-vaulix-secondary-text">Detected vault</span>
            <p className={`text-lg font-semibold ${vaultExists ? 'text-vaulix-accent' : 'text-vaulix-secondary-text'}`}>
              {vaultExists ? 'Existing local vault found' : 'No local vault found yet'}
            </p>
            <button onClick={onBack} className="btn-secondary text-sm">
              Back to Landing
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6 rounded-2xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 p-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/90">Entry options</p>
              <h2 className="text-2xl font-semibold">Start or resume your secure vault session.</h2>
            </div>

            <div className="space-y-4">
              <button
                onClick={onCreateVault}
                className="btn-primary w-full rounded-2xl px-6 py-4 text-left text-base font-semibold"
              >
                <span>Create a new vault</span>
                <p className="mt-2 text-sm text-vaulix-secondary-text">
                  Generate a fresh encrypted vault locally and begin storing credentials.
                </p>
              </button>

              <button
                onClick={onContinueVault}
                disabled={!vaultExists}
                className={`w-full rounded-2xl border px-6 py-4 text-left text-base font-semibold transition-all ${vaultExists ? 'border-vaulix-primary text-vaulix-main-text hover:border-vaulix-accent' : 'border-vaulix-surface-bg text-vaulix-secondary-text bg-vaulix-main-bg cursor-not-allowed'}`}
              >
                <span>Continue existing vault</span>
                <p className="mt-2 text-sm text-vaulix-secondary-text">
                  Unlock the vault that already exists on this device.
                </p>
              </button>

              <button onClick={() => alert('Import coming soon')} className="btn-secondary w-full rounded-2xl px-6 py-4 text-left text-base font-semibold">
                <span>Import encrypted vault</span>
                <p className="mt-2 text-sm text-vaulix-secondary-text">Bring in an encrypted backup file and unlock it locally.</p>
              </button>
            </div>
          </section>

          <aside className="space-y-4 rounded-2xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 p-8">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/90">What this gateway does</p>
              <p className="text-base leading-7 text-vaulix-secondary-text">Vaulix gateway detects your local vault state, offers account continuation, and prepares the secure environment for safe vault creation.</p>
            </div>

            <div className="space-y-4">
              <InfoRow label="Local vault detection" value={vaultExists ? 'Enabled' : 'None found'} />
              <InfoRow label="Encryption" value="Browser-only AES-GCM" />
              <InfoRow label="Sync-ready" value="Encrypted backup path" />
              <InfoRow label="Privacy" value="Zero-knowledge by design" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-vaulix-surface-bg bg-vaulix-main-bg/60 px-5 py-3">
      <span className="text-sm text-vaulix-secondary-text">{label}</span>
      <span className="text-sm font-semibold text-vaulix-main-text">{value}</span>
    </div>
  )
}
