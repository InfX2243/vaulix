import React from 'react'
import { Plus, Settings as SettingsIcon, LogOut, Search, ShieldCheck, Sparkles, Lock } from 'lucide-react'
import { loadVault } from '../lib/vaultStorage'

export type PageType = 'dashboard' | 'settings'

export default function DashboardLayout({ currentPage, setCurrentPage, onLock }: {
  currentPage: PageType
  setCurrentPage: (p: PageType) => void
  onLock: () => void
}) {
  const [vaultName, setVaultName] = React.useState('My Vault')
  const [searchQuery, setSearchQuery] = React.useState('')

  React.useEffect(() => {
    let mounted = true
    loadVault()
      .then((vault) => {
        if (!mounted) return
        setVaultName(vault?.name?.trim() || 'My Vault')
      })
      .catch(() => {
        if (!mounted) return
        setVaultName('My Vault')
      })

    return () => {
      mounted = false
    }
  }, [])

  const handleAddCredential = () => {
    alert('Credential creation UI is coming next. This CTA is now wired and ready.')
  }

  return (
    <div className="flex h-screen bg-[radial-gradient(circle_at_top,_rgba(77,214,255,0.06),_transparent_40%),linear-gradient(180deg,#0B0F14_0%,#111827_100%)] text-vaulix-main-text">
      <aside className="hidden w-72 flex-shrink-0 border-r border-vaulix-surface-bg bg-vaulix-dark-card/85 p-6 md:block">
        <div className="flex h-full flex-col">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-vaulix-accent">Vaulix</h1>
            <p className="text-xs text-vaulix-secondary-text">Security that stays with you</p>
          </div>

          <div className="mt-8 rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/20 p-4">
            <p className="text-xs uppercase tracking-[0.25em] text-vaulix-accent/80">Active vault</p>
            <p className="mt-2 text-sm font-semibold text-vaulix-main-text">{vaultName}</p>
          </div>

          <nav className="mt-8 space-y-2">
            <button
              onClick={() => setCurrentPage('dashboard')}
              className={`w-full rounded-xl px-4 py-2 text-left transition-all ${currentPage === 'dashboard' ? 'bg-vaulix-accent text-vaulix-dark-bg font-semibold' : 'text-vaulix-secondary-text hover:bg-vaulix-main-bg/40 hover:text-vaulix-main-text'}`}
            >
              Vault
            </button>
            <button
              onClick={() => setCurrentPage('settings')}
              className={`w-full rounded-xl px-4 py-2 text-left transition-all ${currentPage === 'settings' ? 'bg-vaulix-accent text-vaulix-dark-bg font-semibold' : 'text-vaulix-secondary-text hover:bg-vaulix-main-bg/40 hover:text-vaulix-main-text'}`}
            >
              <SettingsIcon className="mr-2 inline-block h-4 w-4 align-text-bottom" />
              Settings
            </button>
          </nav>

          <button onClick={onLock} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2 text-vaulix-secondary-text transition-all hover:bg-vaulix-main-bg/40 hover:text-vaulix-main-text">
            <LogOut className="h-4 w-4" />
            Lock Vault
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="border-b border-vaulix-surface-bg bg-vaulix-dark-card/80 px-5 py-4 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="w-full max-w-2xl">
              <div className="flex items-center rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/30 px-3 focus-within:border-vaulix-accent focus-within:ring-2 focus-within:ring-vaulix-accent/30">
                <Search className="h-4 w-4 flex-shrink-0 text-vaulix-secondary-text" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search credentials, usernames, websites..."
                  className="w-full bg-transparent py-3 pl-2 pr-2 text-sm text-vaulix-main-text placeholder-vaulix-secondary-text/80 focus:outline-none"
                />
              </div>
            </div>
            <button onClick={handleAddCredential} className="btn-accent flex w-full max-w-[220px] items-center justify-center gap-2 rounded-2xl py-3">
              <Plus className="h-4 w-4" />
              Add Credential
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-5 py-6 sm:px-8">
          {currentPage === 'dashboard' && <VaultDashboard vaultName={vaultName} onAddCredential={handleAddCredential} />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>
    </div>
  )
}

function VaultDashboard({ vaultName, onAddCredential }: { vaultName: string; onAddCredential: () => void }) {
  const [entries] = React.useState<any[]>([])

  return (
    <div className="space-y-6">
      <section className="welcome-rise rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-vaulix-accent/80">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold">{vaultName}</h2>
            <p className="mt-3 text-sm leading-7 text-vaulix-secondary-text">Your private vault is ready. Add credentials to start building your secure workspace.</p>
          </div>
          <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/20 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-vaulix-secondary-text">Stored</p>
            <p className="mt-1 text-lg font-semibold text-vaulix-main-text">{entries.length} credentials</p>
          </div>
        </div>
      </section>

      {entries.length === 0 ? (
        <section className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 px-8 py-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vaulix-accent/10 text-vaulix-accent">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-semibold">Your vault is empty</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-vaulix-secondary-text">Start by adding your first credential. Vaulix will encrypt and store it safely in this vault.</p>
          <div className="mt-8">
            <button onClick={onAddCredential} className="inline-flex items-center gap-2 rounded-2xl bg-vaulix-accent px-6 py-3 font-semibold text-vaulix-dark-bg shadow-[0_14px_40px_rgba(77,214,255,0.16)] hover:shadow-[0_18px_48px_rgba(77,214,255,0.22)]">
              <Plus className="h-4 w-4" />
              Add your first credential
            </button>
          </div>
        </section>
      ) : (
        <section className="grid gap-4">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-5">
              <p>{entry.service}</p>
            </div>
          ))}
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/75 p-5">
          <div className="mb-3 flex items-center gap-2 text-vaulix-accent">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-sm font-semibold">Encryption Active</p>
          </div>
          <p className="text-sm leading-6 text-vaulix-secondary-text">Your credentials stay encrypted locally before storage.</p>
        </div>
        <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/75 p-5">
          <div className="mb-3 flex items-center gap-2 text-vaulix-accent">
            <Lock className="h-4 w-4" />
            <p className="text-sm font-semibold">Vault Identity</p>
          </div>
          <p className="text-sm leading-6 text-vaulix-secondary-text">Current vault: <span className="text-vaulix-main-text">{vaultName}</span></p>
        </div>
        <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/75 p-5">
          <div className="mb-3 flex items-center gap-2 text-vaulix-accent">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-semibold">Quick Start</p>
          </div>
          <p className="text-sm leading-6 text-vaulix-secondary-text">Use the Add Credential button to begin saving accounts.</p>
        </div>
      </section>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold">Settings</h2>
        <p className="mt-2 text-sm text-vaulix-secondary-text">Manage how your vault behaves on this device.</p>
      </div>

      <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-6 space-y-4">
        <h3 className="font-semibold text-vaulix-main-text">Vault Security</h3>
        <div className="space-y-3 text-sm text-vaulix-secondary-text">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="h-4 w-4 accent-vaulix-accent" />
            <span>Auto-lock after 5 minutes of inactivity</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="h-4 w-4 accent-vaulix-accent" />
            <span>Require password on app startup</span>
          </label>
        </div>
      </div>

      <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-6 space-y-4">
        <h3 className="font-semibold text-vaulix-main-text">Cloud Sync (Coming Soon)</h3>
        <p className="text-sm text-vaulix-secondary-text">Optionally sync your encrypted vault with Google Drive for multi-device access.</p>
        <button className="btn-primary">Connect Google Drive</button>
      </div>
    </div>
  )
}
