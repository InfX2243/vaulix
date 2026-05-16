 

import { type ChangeEvent, useRef, useState } from 'react'
import CreateVaultFlow from '../components/CreateVaultFlow'
import { PlusSquare, Key, DownloadCloud, ArrowLeft, X, HardDriveUpload, Cloud, Link as LinkIcon } from 'lucide-react'

export default function GatewayPage({ vaultExists, onCreateVault, onContinueVault, onImportVault, onBack }: {
  vaultExists: boolean
  onCreateVault: () => void
  onContinueVault: () => void
  onImportVault: (file: File) => Promise<void>
  onBack: () => void
}) {
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [showImportOptions, setShowImportOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleImportClick = () => {
    setShowImportOptions(true)
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setIsImporting(true)
    try {
      await onImportVault(file)
      setShowImportOptions(false)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to import vault file.'
      alert(message)
    } finally {
      setIsImporting(false)
      event.target.value = ''
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(77,214,255,0.06),_transparent_40%),linear-gradient(180deg,#0B0F14_0%,#111827_100%)] text-vaulix-main-text flex flex-col">
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl px-6 py-12 sm:px-8 lg:px-12">
          {!isCreating && (
            <div className="mb-8">
              <button
                onClick={onBack}
                className="inline-flex items-center gap-2 rounded-2xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 px-4 py-2 text-sm text-vaulix-secondary-text hover:border-vaulix-accent hover:text-vaulix-main-text"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to landing
              </button>
            </div>
          )}

          {!isCreating ? (
            <div className="grid gap-6 md:grid-cols-3">
              <Card
                Icon={PlusSquare}
                title="Create a vault"
                description="Initialize a new encrypted vault locally."
                cta="Create"
                onClick={() => setIsCreating(true)}
                tone="primary"
              />
              <Card
                Icon={Key}
                title="Continue vault"
                description="Unlock an existing local vault."
                cta="Continue"
                onClick={onContinueVault}
                tone={vaultExists ? 'accent' : 'muted'}
                disabled={!vaultExists}
              />
              <Card
                Icon={DownloadCloud}
                title="Import backup"
                description={vaultExists ? 'Import an encrypted backup file (.vlx).' : 'No local vault found. Import your .vlx file to continue.'}
                cta={isImporting ? 'Importing...' : 'Import .vlx'}
                onClick={handleImportClick}
                tone="secondary"
                disabled={isImporting}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CreateVaultFlow onComplete={() => { setIsCreating(false); onCreateVault() }} onCancel={() => setIsCreating(false)} />
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".vlx,application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          {showImportOptions && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
              <div className="w-full max-w-xl rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/95 p-6 sm:p-7">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold">Import vault backup</h3>
                    <p className="mt-1 text-sm text-vaulix-secondary-text">Choose how you want to import your `.vlx` file.</p>
                  </div>
                  <button onClick={() => setShowImportOptions(false)} className="rounded-xl border border-vaulix-surface-bg p-2 text-vaulix-secondary-text hover:text-vaulix-main-text">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/20 p-4 text-left transition-all hover:border-vaulix-accent disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <HardDriveUpload className="h-5 w-5 text-vaulix-accent" />
                    <p className="mt-3 text-sm font-semibold">{isImporting ? 'Importing...' : 'Upload from device'}</p>
                    <p className="mt-1 text-xs text-vaulix-secondary-text">Select local `.vlx` file.</p>
                  </button>

                  <button
                    onClick={() => alert('Google Drive import UI will be enabled in a future update.')}
                    className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/20 p-4 text-left transition-all hover:border-vaulix-accent"
                  >
                    <Cloud className="h-5 w-5 text-vaulix-accent" />
                    <p className="mt-3 text-sm font-semibold">Google Drive</p>
                    <p className="mt-1 text-xs text-vaulix-secondary-text">Coming soon (frontend ready).</p>
                  </button>

                  <button
                    onClick={() => alert('Import by URL is planned.')}
                    className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-main-bg/20 p-4 text-left transition-all hover:border-vaulix-accent"
                  >
                    <LinkIcon className="h-5 w-5 text-vaulix-accent" />
                    <p className="mt-3 text-sm font-semibold">Import from URL</p>
                    <p className="mt-1 text-xs text-vaulix-secondary-text">Coming soon (frontend ready).</p>
                  </button>
                </div>

                <div className="mt-5 flex justify-end">
                  <button onClick={() => setShowImportOptions(false)} className="btn-secondary">Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

function Card({ Icon, title, description, cta, onClick, tone, disabled }: { Icon: any; title: string; description: string; cta: string; onClick: () => void; tone?: 'primary' | 'accent' | 'secondary' | 'muted'; disabled?: boolean }) {
  const toneClass =
    tone === 'primary'
      ? 'bg-vaulix-accent text-vaulix-dark-bg hover:shadow-[0_18px_48px_rgba(77,214,255,0.22)]'
      : tone === 'accent'
        ? 'bg-vaulix-primary text-vaulix-main-bg hover:opacity-90'
        : tone === 'secondary'
          ? 'border border-vaulix-surface-bg text-vaulix-main-text hover:border-vaulix-accent'
          : 'border border-vaulix-surface-bg text-vaulix-secondary-text'

  return (
    <div
      className={`rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-7 shadow-sm transition-all ${
        disabled ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:border-vaulix-accent/60'
      } min-h-[260px] flex flex-col`}
    >
      <div className="flex items-start gap-4">
        <div className="rounded-2xl p-3 bg-vaulix-accent/10">
          <Icon className="h-6 w-6 text-vaulix-accent" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mt-2 text-sm leading-7 text-vaulix-secondary-text">{description}</p>
        </div>
      </div>

      <div className="mt-auto pt-8 flex items-center justify-between">
        <button onClick={onClick} disabled={disabled} className={`rounded-2xl px-5 py-2.5 font-semibold transition-all ${toneClass}`}>
          {cta}
        </button>
        <div className="text-xs text-vaulix-secondary-text">{disabled ? 'Unavailable' : ''}</div>
      </div>
    </div>
  )
}
