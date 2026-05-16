import { useEffect, useState } from 'react'
import { ArrowLeft, Lock, ShieldCheck as ShieldIcon } from 'lucide-react'
import { deriveMasterKey, encryptPayload, generateRandomBytes, importAesKey, randomBase64, wrapKey } from '../lib/crypto'
import { saveVault } from '../lib/vaultStorage'

interface CreateVaultFlowProps {
  onComplete: () => void
  onCancel: () => void
}

type RecoveryPayload = {
  version: string
  recoveryKey: string
  wrappedVekWithRecovery: { iv: string; data: string }
}

export default function CreateVaultFlow({ onComplete, onCancel }: CreateVaultFlowProps) {
  const [stage, setStage] = useState<'intro' | 'name' | 'password' | 'download' | 'final'>('intro')
  const [vaultName, setVaultName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hasDownloadedRecovery, setHasDownloadedRecovery] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [recoveryFilename, setRecoveryFilename] = useState('')
  const [recoveryUrl, setRecoveryUrl] = useState<string | null>(null)
  const [pendingVaultRecord, setPendingVaultRecord] = useState<any | null>(null)
  const [strength, setStrength] = useState({ score: 0, label: 'Too weak' })

  useEffect(() => {
    setError(null)
    setHasDownloadedRecovery(false)
    setStrength(computePasswordStrength(password))
  }, [password])

  const start = () => setStage('name')

  function computePasswordStrength(pw: string) {
    let score = 0
    if (pw.length >= 10) score += 1
    if (pw.length >= 14) score += 1
    if (/[a-z]/.test(pw)) score += 1
    if (/[A-Z]/.test(pw)) score += 1
    if (/[0-9]/.test(pw)) score += 1
    if (/[^A-Za-z0-9]/.test(pw)) score += 1
    const lower = pw.toLowerCase()
    if (lower.includes('password') || lower.includes('1234') || lower.includes('qwerty')) score = Math.max(0, score - 2)

    const label = score >= 5 ? 'Strong' : score >= 3 ? 'Good' : 'Weak'
    return { score, label }
  }

  function validatePassword() {
    if (!vaultName.trim()) {
      setError('Provide a name for the vault.')
      return false
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return false
    }
    if (strength.score < 3) {
      setError('Choose a stronger password.')
      return false
    }
    return true
  }

  const prepareRecovery = async () => {
    if (!validatePassword()) return
    setError(null)
    setIsProcessing(true)
    try {
      const salt = generateRandomBytes(16)
      const masterKey = await deriveMasterKey(password, salt)
      const vek = generateRandomBytes(32)
      const vaultKey = await importAesKey(vek)
      const wrappedVekWithMaster = await wrapKey(vek, masterKey)

      const recoveryKey = randomBase64(32)
      const recoveryKeyBytes = Uint8Array.from(atob(recoveryKey), (c) => c.charCodeAt(0))
      const recoveryAesKey = await importAesKey(recoveryKeyBytes)
      const wrappedVekWithRecovery = await wrapKey(vek, recoveryAesKey)

      const initialVault = {
        createdAt: new Date().toISOString(),
        version: '1.0',
        entries: [],
      }

      const vaultBlob = await encryptPayload(initialVault, vaultKey)
      const vaultId = (crypto as any).randomUUID ? (crypto as any).randomUUID() : 'vault-' + Math.random().toString(36).slice(2, 10)

      const vaultRecord = {
        id: vaultId,
        name: vaultName.trim(),
        createdAt: new Date().toISOString(),
        salt: btoa(String.fromCharCode(...salt)),
        vaultBlob,
        wrappedVekWithMaster,
        wrappedVekWithRecovery,
      }

      const recoveryPayload: RecoveryPayload = {
        version: '1.0',
        recoveryKey,
        wrappedVekWithRecovery,
      }

      const blob = new Blob([JSON.stringify(recoveryPayload, null, 2)], { type: 'application/json' })
      const filename = `vaulix-recovery-${vaultName.trim().replace(/[^a-z0-9_-]/gi, '-')}-${new Date().toISOString().slice(0, 10)}.vlk`

      const url = URL.createObjectURL(blob)
      setRecoveryUrl(url)
      setRecoveryFilename(filename)
      setPendingVaultRecord(vaultRecord)
      setStage('download')
    } catch (err) {
      console.error(err)
      setError('Unable to prepare recovery file.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!recoveryUrl) return
    const link = document.createElement('a')
    link.href = recoveryUrl
    link.download = recoveryFilename
    document.body.appendChild(link)
    link.click()
    link.remove()
    setHasDownloadedRecovery(true)
  }

  const confirmAndSave = async () => {
    if (!pendingVaultRecord) return
    setIsProcessing(true)
    try {
      await saveVault(pendingVaultRecord)
      setStage('final')
      onComplete()
    } catch (err) {
      console.error(err)
      setError('Unable to save vault locally.')
    } finally {
      setIsProcessing(false)
      if (recoveryUrl) {
        URL.revokeObjectURL(recoveryUrl)
        setRecoveryUrl(null)
      }
    }
  }

  return (
    <section className="w-full max-w-3xl mx-auto rounded-[2rem] border border-vaulix-surface-bg bg-vaulix-dark-card/85 p-8 sm:p-10 shadow-2xl shadow-black/20">
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="inline-flex items-center gap-2 rounded-2xl border border-vaulix-surface-bg px-3 py-2 text-sm text-vaulix-secondary-text hover:border-vaulix-accent hover:text-vaulix-main-text"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to gateway
        </button>
        <p className="text-xs uppercase tracking-[0.3em] text-vaulix-accent/80">Vault setup</p>
      </div>

      {stage === 'intro' && (
        <div className="space-y-6 py-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-vaulix-accent/10 text-vaulix-accent">
            <ShieldIcon className="h-6 w-6" />
          </div>
          <h2 className="text-3xl font-semibold">Create a new vault</h2>
          <p className="text-sm leading-7 text-vaulix-secondary-text">A guided wizard will help you create and secure a new vault.</p>
          <div className="mt-4 flex justify-center gap-3">
            <button onClick={start} className="btn-primary">Get started</button>
            <button onClick={onCancel} className="btn-secondary">Cancel</button>
          </div>
        </div>
      )}

      {stage === 'name' && (
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold">Name your vault</h3>
          <p className="text-sm leading-7 text-vaulix-secondary-text">Give this vault a recognizable name so you can distinguish multiple vaults.</p>
          <label className="space-y-2">
            <input value={vaultName} onChange={(e) => setVaultName(e.target.value)} placeholder="e.g. Personal / Work" className="input" />
          </label>
          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setStage('intro')} className="btn-secondary">Back</button>
            <button onClick={() => setStage('password')} disabled={!vaultName.trim()} className="btn-primary ml-auto">Next</button>
          </div>
        </div>
      )}

      {stage === 'password' && (
        <div className="space-y-5">
          <div className="flex items-center gap-3 text-vaulix-primary">
            <div className="rounded-2xl bg-vaulix-primary/10 p-3">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-vaulix-accent/90">Master password</p>
              <h2 className="text-2xl font-semibold">Set a strong master password</h2>
            </div>
          </div>

          <label className="space-y-2">
            <span className="text-sm font-medium text-vaulix-main-text">Master password</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="Choose a strong password" />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-vaulix-main-text">Confirm password</span>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input" placeholder="Repeat password" />
          </label>

          <div className="mt-2">
            <div className="h-2 w-full rounded-full bg-vaulix-surface-bg">
              <div style={{ width: `${Math.min(100, (strength.score / 6) * 100)}%` }} className={`h-2 rounded-full ${strength.score >= 5 ? 'bg-green-500' : strength.score >= 3 ? 'bg-yellow-400' : 'bg-red-500'}`} />
            </div>
            <p className="mt-2 text-sm text-vaulix-secondary-text">Strength: {strength.label}</p>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex items-center justify-between gap-3">
            <button onClick={() => setStage('name')} className="btn-secondary">Back</button>
            <button onClick={prepareRecovery} disabled={isProcessing} className="btn-primary ml-auto">Confirm Password</button>
          </div>
        </div>
      )}

      {stage === 'download' && (
        <div className="space-y-5">
          <h3 className="text-2xl font-semibold">Download recovery file</h3>
          <p className="text-sm leading-7 text-vaulix-secondary-text">Download the recovery file and store it securely. This file is required if you lose the master password.</p>
          <p className="mt-2 text-sm font-medium text-vaulix-main-text">Filename: {recoveryFilename}</p>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <button onClick={() => setStage('password')} className="btn-secondary">Back</button>
            <div className="ml-auto flex items-center gap-3">
              <button onClick={handleDownload} className="btn-primary">Download recovery file</button>
              <button
                onClick={confirmAndSave}
                disabled={!hasDownloadedRecovery || isProcessing}
                className="btn-primary"
              >
                Next
              </button>
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}

      {stage === 'final' && (
        <div className="space-y-6 rounded-3xl border border-vaulix-surface-bg bg-vaulix-main-bg/30 p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-vaulix-accent/10 text-vaulix-accent">
            <ShieldIcon className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-semibold">Your vault is ready</h2>
          <p className="text-sm leading-7 text-vaulix-secondary-text">Your encrypted vault is stored locally, and your recovery file has been created.</p>
        </div>
      )}
    </section>
  )
}
