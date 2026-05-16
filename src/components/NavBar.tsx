import { Lock } from 'lucide-react'

export default function NavBar({ onLaunch }: { onLaunch: () => void }) {
  return (
    <nav className="backdrop-blur-sm sticky top-0 z-40 bg-vaulix-main-bg/90 border-b border-vaulix-surface-bg/20 shadow-sm">
      <div className="mx-auto max-w-7xl px-6 py-4 sm:px-8 lg:px-12 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center justify-center rounded-2xl bg-vaulix-primary/10 p-2">
            <Lock className="h-6 w-6 text-vaulix-accent" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-wide text-vaulix-accent">Vaulix</div>
            <div className="text-xs text-vaulix-secondary-text">Security that stays with you</div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-vaulix-secondary-text">
          <a href="#preview" className="hover:text-vaulix-main-text">Preview</a>
          <a href="#features" className="hover:text-vaulix-main-text">Features</a>
          <a href="#how-it-works" className="hover:text-vaulix-main-text">How it works</a>
          <a href="#security" className="hover:text-vaulix-main-text">Security</a>
          <a href="#about" className="hover:text-vaulix-main-text">About</a>
          <button onClick={onLaunch} className="btn-primary ml-2">Launch Vaulix</button>
        </div>
      </div>
    </nav>
  )
}
