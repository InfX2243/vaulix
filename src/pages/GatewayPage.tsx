 

import { useState } from 'react'
import CreateVaultFlow from '../components/CreateVaultFlow'
import { PlusSquare, Key, DownloadCloud, ArrowLeft } from 'lucide-react'

export default function GatewayPage({ vaultExists, onCreateVault, onContinueVault, onBack }: {
  vaultExists: boolean
  onCreateVault: () => void
  onContinueVault: () => void
  onBack: () => void
}) {
  const [isCreating, setIsCreating] = useState(false)

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
                description="Import an encrypted backup file (.vlx/.vlk)."
                cta="Import"
                onClick={() => alert('Import coming soon')}
                tone="secondary"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CreateVaultFlow onComplete={() => { setIsCreating(false); onCreateVault() }} onCancel={() => setIsCreating(false)} />
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
