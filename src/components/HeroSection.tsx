import { ArrowRight, ShieldCheck, Cloud, Lock } from 'lucide-react'

export default function HeroSection({ onLaunch }: { onLaunch: () => void }) {
  return (
    <section className="relative overflow-hidden pt-8">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_center,_rgba(77,214,255,0.14),_transparent_45%)] pointer-events-none" />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/90">Zero-knowledge password vault</p>
          <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl leading-tight">Security that stays with you.</h1>
          <p className="max-w-2xl text-base leading-8 text-vaulix-secondary-text">Vaulix is a zero-knowledge password vault built for modern privacy and security. Your passwords are encrypted locally in your browser, giving you complete ownership of your data.</p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <button onClick={onLaunch} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-vaulix-accent text-vaulix-dark-bg px-6 py-3 font-semibold shadow-[0_14px_40px_rgba(77,214,255,0.16)] hover:shadow-[0_18px_48px_rgba(77,214,255,0.22)] transition-shadow">
              Launch Vaulix
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href="#features" className="inline-flex items-center justify-center rounded-2xl border border-vaulix-surface-bg px-6 py-3 text-sm text-vaulix-secondary-text hover:border-vaulix-accent hover:text-vaulix-main-text transition-all">Learn More</a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              'Zero-Knowledge Encryption',
              'Local-First Security',
              'Optional Secure Cloud Sync',
              'Private by Design',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-3xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 px-5 py-4 shadow-sm transition-all hover:-translate-y-1">
                <div className="rounded-2xl bg-vaulix-primary/10 p-3 text-vaulix-accent">
                  {item.includes('Cloud') ? <Cloud className="h-4 w-4" /> : item.includes('Zero') ? <ShieldCheck className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </div>
                <span className="text-sm text-vaulix-secondary-text">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2.5rem] border border-vaulix-accent/10 bg-vaulix-dark-card/95 p-6 shadow-2xl shadow-black/30">
            <div className="mb-5 flex items-center justify-between rounded-3xl bg-[#0f1623] px-5 py-4 text-sm text-vaulix-secondary-text">
              <span>Vault overview</span>
              <span className="rounded-full bg-vaulix-primary/10 px-3 py-1 text-vaulix-accent">Secure</span>
            </div>
            <div className="space-y-4">
              <div className="rounded-3xl bg-[#111827] p-5">
                <div className="mb-4 flex items-center justify-between text-sm text-vaulix-secondary-text">
                  <span>Search</span>
                  <span className="rounded-full bg-vaulix-surface-bg/80 px-3 py-1">Ctrl + K</span>
                </div>
                <div className="h-3 w-full rounded-full bg-vaulix-surface-bg/60" />
              </div>
              <div className="rounded-3xl bg-[#111827] p-5 space-y-4">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-vaulix-secondary-text">
                  <span>Recent entry</span>
                  <span>Updated</span>
                </div>
                <div className="space-y-2">
                  <div className="font-semibold text-white">Gmail</div>
                  <div className="text-sm text-vaulix-secondary-text">user@gmail.com</div>
                </div>
                <div className="flex items-center gap-3 text-sm text-vaulix-secondary-text">
                  <span className="rounded-full bg-vaulix-primary/10 px-2 py-1">Reveal</span>
                  <span className="rounded-full bg-vaulix-accent/10 px-2 py-1 text-vaulix-accent">Copy</span>
                </div>
              </div>
              <div className="rounded-3xl border border-vaulix-surface-bg/40 bg-[#0d1220] p-5">
                <div className="flex items-center justify-between text-sm text-vaulix-secondary-text">
                  <span>Password generator</span>
                  <span className="text-vaulix-accent font-semibold">Strong</span>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-vaulix-main-bg/10 p-4 text-sm text-vaulix-secondary-text">16 characters</div>
                  <div className="rounded-2xl bg-vaulix-main-bg/10 p-4 text-sm text-vaulix-secondary-text">Secure strength</div>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-10 h-32 w-32 rounded-3xl bg-vaulix-accent/10 blur-3xl" />
        </div>
      </div>
    </section>
  )
}
