import React from 'react'
import { Plus, Settings as SettingsIcon, LogOut, Search, ShieldCheck, Sparkles, Lock, Eye, EyeOff, Copy, Check, Download } from 'lucide-react'
import { addCredential, deserializeVault, resetMasterPasswordWithRecovery, serializeVaultToBinary, unlockVault, type RecoveryPayloadLike, type VaultEntry } from '../lib/vaultContainer'
import { deserializeRecoveryFromBinary, serializeRecoveryToBinary } from '../lib/recoveryContainer'
import { loadVault, loadVlxLocal, saveVault, saveVlxLocal } from '../lib/vaultStorage'

export type PageType = 'dashboard' | 'settings'

export default function DashboardLayout({ currentPage, setCurrentPage, onLock }: {
  currentPage: PageType
  setCurrentPage: (p: PageType) => void
  onLock: () => void
}) {
  const [vaultName, setVaultName] = React.useState('My Vault')
  const [searchQuery, setSearchQuery] = React.useState('')
  const [serializedVlx, setSerializedVlx] = React.useState<string | null>(null)
  const [masterPassword, setMasterPassword] = React.useState('')
  const [unlockInput, setUnlockInput] = React.useState('')
  const [unlockError, setUnlockError] = React.useState<string | null>(null)
  const [entries, setEntries] = React.useState<VaultEntry[]>([])
  const [showAddModal, setShowAddModal] = React.useState(false)
  const [showResetModal, setShowResetModal] = React.useState(false)

  React.useEffect(() => {
    let mounted = true
    loadVault().then((vault) => {
      if (!mounted) return
      setVaultName(vault?.name?.trim() || 'My Vault')
      setSerializedVlx(vault?.vlx || loadVlxLocal())
    }).catch(() => {
      if (!mounted) return
      setSerializedVlx(loadVlxLocal())
    })

    return () => {
      mounted = false
    }
  }, [])

  const isUnlocked = !!masterPassword

  const handleUnlock = async () => {
    if (!serializedVlx || !unlockInput) return
    try {
      setUnlockError(null)
      const { data } = await unlockVault(serializedVlx, unlockInput)
      setEntries(data.entries ?? [])
      setMasterPassword(unlockInput)
      setUnlockInput('')
    } catch {
      setUnlockError('Unable to unlock vault. Check your master password.')
    }
  }

  const handleAddCredential = () => {
    if (!isUnlocked) return
    setShowAddModal(true)
  }

  const handleCredentialSaved = async (payload: { service: string; username: string; secret: string; notes?: string }) => {
    if (!serializedVlx || !masterPassword) return
    const result = await addCredential({
      serialized: serializedVlx,
      password: masterPassword,
      credential: payload,
    })
    setSerializedVlx(result.serialized)
    setEntries(result.entries)
    saveVlxLocal(result.serialized)

    const existing = await loadVault()
    if (existing) await saveVault({ ...existing, vlx: result.serialized })
  }

  const handleExportVault = async () => {
    if (!serializedVlx) {
      alert('No vault data available to export.')
      return
    }
    const vlx = await deserializeVault(serializedVlx)
    const binary = await serializeVaultToBinary(vlx)
    const blob = new Blob([binary], { type: 'application/octet-stream' })
    const filename = `${vaultName.toLowerCase().replace(/[^a-z0-9_-]/gi, '-') || 'vaulix-vault'}-${new Date().toISOString().slice(0, 10)}.vlx`
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    URL.revokeObjectURL(url)
  }

  const filteredEntries = entries.filter((entry) => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return true
    return entry.service.toLowerCase().includes(q) || entry.username.toLowerCase().includes(q) || (entry.notes || '').toLowerCase().includes(q)
  })

  const handleFinalizePasswordReset = async (params: { serialized: string; newPassword: string }) => {
    setSerializedVlx(params.serialized)
    saveVlxLocal(params.serialized)
    const existing = await loadVault()
    if (existing) await saveVault({ ...existing, vlx: params.serialized })

    const unlocked = await unlockVault(params.serialized, params.newPassword)
    setEntries(unlocked.data.entries ?? [])
    setMasterPassword(params.newPassword)
    setUnlockError(null)
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
            <button onClick={() => setCurrentPage('dashboard')} className={`w-full rounded-xl px-4 py-2 text-left transition-all ${currentPage === 'dashboard' ? 'bg-vaulix-accent text-vaulix-dark-bg font-semibold' : 'text-vaulix-secondary-text hover:bg-vaulix-main-bg/40 hover:text-vaulix-main-text'}`}>Vault</button>
            <button onClick={() => setCurrentPage('settings')} className={`w-full rounded-xl px-4 py-2 text-left transition-all ${currentPage === 'settings' ? 'bg-vaulix-accent text-vaulix-dark-bg font-semibold' : 'text-vaulix-secondary-text hover:bg-vaulix-main-bg/40 hover:text-vaulix-main-text'}`}>
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
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search credentials, usernames, websites..." className="w-full bg-transparent py-3 pl-2 pr-2 text-sm text-vaulix-main-text placeholder-vaulix-secondary-text/80 focus:outline-none" />
              </div>
            </div>
            <div className="flex w-full max-w-[430px] items-center gap-3">
              <button onClick={handleExportVault} disabled={!serializedVlx} className="btn-secondary flex w-full items-center justify-center gap-2 rounded-2xl py-3 disabled:cursor-not-allowed disabled:opacity-50">
                <Download className="h-4 w-4" />
                Export .vlx
              </button>
              <button onClick={handleAddCredential} disabled={!isUnlocked} className="btn-accent flex w-full items-center justify-center gap-2 rounded-2xl py-3 disabled:cursor-not-allowed disabled:opacity-50">
                <Plus className="h-4 w-4" />
                Add Credential
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-5 py-6 sm:px-8">
          {currentPage === 'dashboard' && (
            <VaultDashboard
              vaultName={vaultName}
              entries={filteredEntries}
              isUnlocked={isUnlocked}
              unlockInput={unlockInput}
              onUnlockInputChange={setUnlockInput}
              onUnlock={handleUnlock}
              unlockError={unlockError}
              onAddCredential={handleAddCredential}
              onForgotPassword={() => setShowResetModal(true)}
            />
          )}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {showAddModal && (
        <AddCredentialModal
          onClose={() => setShowAddModal(false)}
          onSave={async (payload) => {
            await handleCredentialSaved(payload)
            setShowAddModal(false)
          }}
        />
      )}
      {showResetModal && serializedVlx && (
        <ResetPasswordModal
          serializedVlx={serializedVlx}
          onClose={() => setShowResetModal(false)}
          onComplete={async (payload) => {
            await handleFinalizePasswordReset(payload)
            setShowResetModal(false)
          }}
        />
      )}
    </div>
  )
}

function VaultDashboard({ vaultName, entries, isUnlocked, unlockInput, onUnlockInputChange, onUnlock, unlockError, onAddCredential, onForgotPassword }: {
  vaultName: string
  entries: VaultEntry[]
  isUnlocked: boolean
  unlockInput: string
  onUnlockInputChange: (value: string) => void
  onUnlock: () => void
  unlockError: string | null
  onAddCredential: () => void
  onForgotPassword: () => void
}) {
  return (
    <div className="space-y-6">
      <section className="welcome-rise rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-vaulix-accent/80">Welcome back</p>
            <h2 className="mt-3 text-3xl font-semibold">{vaultName}</h2>
            <p className="mt-3 text-sm leading-7 text-vaulix-secondary-text">Your private vault is ready. Unlock to view and manage credentials.</p>
          </div>
          <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/20 px-4 py-3 text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-vaulix-secondary-text">Stored</p>
            <p className="mt-1 text-lg font-semibold text-vaulix-main-text">{entries.length} credentials</p>
          </div>
        </div>
      </section>

      {!isUnlocked ? (
        <section className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 px-8 py-10">
          <div className="mx-auto max-w-lg text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vaulix-accent/10 text-vaulix-accent">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="text-2xl font-semibold">Unlock your vault</h3>
            <p className="mx-auto mt-3 text-sm leading-7 text-vaulix-secondary-text">Enter your master password to decrypt credentials for this session.</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <input type="password" value={unlockInput} onChange={(e) => onUnlockInputChange(e.target.value)} className="input flex-1" placeholder="Master password" />
              <button onClick={onUnlock} className="btn-primary">Unlock</button>
            </div>
            <button onClick={onForgotPassword} className="mt-4 text-sm text-vaulix-secondary-text hover:text-vaulix-main-text underline underline-offset-4">
              Forgot password?
            </button>
            {unlockError && <p className="mt-3 text-sm text-red-500">{unlockError}</p>}
          </div>
        </section>
      ) : entries.length === 0 ? (
        <section className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 px-8 py-12 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-vaulix-accent/10 text-vaulix-accent">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-2xl font-semibold">Your vault is empty</h3>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-vaulix-secondary-text">Start by adding your first credential. Vaulix will encrypt and store it safely in your vault.</p>
          <div className="mt-8">
            <button onClick={onAddCredential} className="inline-flex items-center gap-2 rounded-2xl bg-vaulix-accent px-6 py-3 font-semibold text-vaulix-dark-bg shadow-[0_14px_40px_rgba(77,214,255,0.16)] hover:shadow-[0_18px_48px_rgba(77,214,255,0.22)]">
              <Plus className="h-4 w-4" />
              Add your first credential
            </button>
          </div>
        </section>
      ) : (
        <CredentialList entries={entries} />
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/75 p-5">
          <div className="mb-3 flex items-center gap-2 text-vaulix-accent">
            <ShieldCheck className="h-4 w-4" />
            <p className="text-sm font-semibold">Encryption Active</p>
          </div>
          <p className="text-sm leading-6 text-vaulix-secondary-text">Credentials remain encrypted at rest inside your local `.vlx` container.</p>
        </div>
      </section>
    </div>
  )
}

function ResetPasswordModal({
  serializedVlx,
  onClose,
  onComplete,
}: {
  serializedVlx: string
  onClose: () => void
  onComplete: (payload: { serialized: string; newPassword: string }) => Promise<void>
}) {
  const [recoveryPayload, setRecoveryPayload] = React.useState<RecoveryPayloadLike | null>(null)
  const [newPassword, setNewPassword] = React.useState('')
  const [confirmPassword, setConfirmPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [resetResult, setResetResult] = React.useState<{ serialized: string; recoveryBytes: Uint8Array; filename: string; newPassword: string } | null>(null)
  const [hasDownloaded, setHasDownloaded] = React.useState(false)

  const canReset = !!recoveryPayload && newPassword.length >= 8 && newPassword === confirmPassword

  const handleRecoveryFile = async (file: File) => {
    try {
      setError(null)
      const bytes = new Uint8Array(await file.arrayBuffer())
      const parsed = await deserializeRecoveryFromBinary(bytes)
      setRecoveryPayload(parsed)
    } catch {
      setError('Invalid recovery file. Please select a valid .vlk file.')
    }
  }

  const handleReset = async () => {
    if (!canReset || !recoveryPayload) return
    setIsProcessing(true)
    setError(null)
    try {
      const result = await resetMasterPasswordWithRecovery({
        serialized: serializedVlx,
        recovery: recoveryPayload,
        newPassword,
      })
      const recoveryBytes = await serializeRecoveryToBinary(result.newRecovery)
      const filename = `vaulix-recovery-reset-${new Date().toISOString().slice(0, 10)}.vlk`
      setResetResult({ serialized: result.serialized, recoveryBytes, filename, newPassword })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset master password.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!resetResult) return
    const bytes = new Uint8Array(resetResult.recoveryBytes.length)
    bytes.set(resetResult.recoveryBytes)
    const blob = new Blob([bytes], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = resetResult.filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setHasDownloaded(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/95 p-6">
        <h3 className="text-xl font-semibold">Reset master password</h3>
        {!resetResult ? (
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-vaulix-secondary-text">Upload recovery file (.vlk)</span>
              <input
                type="file"
                accept=".vlk,application/octet-stream"
                onChange={(e) => { const file = e.target.files?.[0]; if (file) void handleRecoveryFile(file) }}
                className="input"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New master password" className="input" />
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className="input" />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex items-center justify-between gap-3">
              <button onClick={onClose} className="btn-secondary">Cancel</button>
              <button onClick={handleReset} disabled={!canReset || isProcessing} className="btn-primary ml-auto">Reset password</button>
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-sm leading-7 text-vaulix-secondary-text">
              Master password has been reset. Download your new recovery file to continue.
            </p>
            <div className="flex items-center justify-between gap-3">
              <button onClick={handleDownload} className="btn-primary">Download new .vlk</button>
              <button
                onClick={() => void onComplete({ serialized: resetResult.serialized, newPassword: resetResult.newPassword })}
                disabled={!hasDownloaded}
                className="btn-primary"
              >
                Continue to vault
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CredentialList({ entries }: { entries: VaultEntry[] }) {
  const [visibleSecrets, setVisibleSecrets] = React.useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = React.useState<string | null>(null)

  const toggleReveal = (id: string) => {
    setVisibleSecrets((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  const handleCopy = async (id: string, value: string) => {
    await navigator.clipboard.writeText(value)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 1200)
  }

  return (
    <section className="grid gap-4">
      {entries.map((entry) => (
        <article key={entry.id} className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-5">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">{entry.service}</h3>
              <p className="mt-1 text-sm text-vaulix-secondary-text">{entry.username}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => toggleReveal(entry.id)} className="rounded-xl border border-vaulix-surface-bg px-3 py-1.5 text-xs text-vaulix-secondary-text hover:text-vaulix-main-text">
                {visibleSecrets[entry.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              <button onClick={() => handleCopy(entry.id, entry.secret)} className="rounded-xl border border-vaulix-surface-bg px-3 py-1.5 text-xs text-vaulix-secondary-text hover:text-vaulix-main-text">
                {copiedId === entry.id ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="mt-4 rounded-xl border border-vaulix-surface-bg/70 bg-vaulix-main-bg/20 px-4 py-3 font-mono text-sm">
            {visibleSecrets[entry.id] ? entry.secret : '•'.repeat(Math.max(12, entry.secret.length))}
          </div>
          {!!entry.notes && <p className="mt-3 text-sm text-vaulix-secondary-text">{entry.notes}</p>}
        </article>
      ))}
    </section>
  )
}

function AddCredentialModal({ onClose, onSave }: {
  onClose: () => void
  onSave: (payload: { service: string; username: string; secret: string; notes?: string }) => Promise<void>
}) {
  const [service, setService] = React.useState('')
  const [username, setUsername] = React.useState('')
  const [secret, setSecret] = React.useState('')
  const [notes, setNotes] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const canSave = service.trim() && username.trim() && secret.trim()

  const handleSave = async () => {
    if (!canSave) return
    setIsSaving(true)
    try {
      await onSave({ service, username, secret, notes })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/95 p-6">
        <h3 className="text-xl font-semibold">Add credential</h3>
        <div className="mt-5 space-y-3">
          <input value={service} onChange={(e) => setService(e.target.value)} placeholder="Service (e.g. GitHub)" className="input" />
          <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username or email" className="input" />
          <input value={secret} onChange={(e) => setSecret(e.target.value)} placeholder="Password / secret" className="input" />
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Notes (optional)" className="input min-h-[90px]" />
        </div>
        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={handleSave} disabled={!canSave || isSaving} className="btn-primary ml-auto">Save credential</button>
        </div>
      </div>
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
    </div>
  )
}
