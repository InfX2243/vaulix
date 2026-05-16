import { Eye, Plus, Search, ClipboardList } from 'lucide-react'
import AnimatedSection from './AnimatedSection'

export default function ProductPreviewSection() {
  return (
    <AnimatedSection id="preview" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Product preview</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Simple, secure password management</h2>
          <p className="text-base leading-8 text-vaulix-secondary-text max-w-2xl">Store credentials, generate strong passwords, and securely manage sensitive information through a fast and minimal interface designed for everyday use.</p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-vaulix-accent/10 p-3 text-vaulix-accent">
                  <Search className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Search vault entries</h3>
                  <p className="mt-2 text-sm text-vaulix-secondary-text">Find passwords quickly with instant search and category filters.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-vaulix-accent/10 p-3 text-vaulix-accent">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Add entries instantly</h3>
                  <p className="mt-2 text-sm text-vaulix-secondary-text">Quickly save new logins, notes, and secure entries with one tap.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-vaulix-accent/10 p-3 text-vaulix-accent">
                  <Eye className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Reveal & copy securely</h3>
                  <p className="mt-2 text-sm text-vaulix-secondary-text">Control when passwords are visible and copy them safely to your clipboard.</p>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-5">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-vaulix-accent/10 p-3 text-vaulix-accent">
                  <ClipboardList className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Sync status at a glance</h3>
                  <p className="mt-2 text-sm text-vaulix-secondary-text">See when your encrypted vault is ready for secure backup and sync.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-[2.25rem] border border-vaulix-accent/10 bg-vaulix-dark-card/90 p-6 shadow-2xl shadow-black/30">
            <div className="mb-6 flex items-center justify-between rounded-3xl bg-[#0f1623] px-5 py-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-vaulix-accent/80">Vault dashboard</p>
              </div>
              <span className="rounded-full bg-vaulix-primary/10 px-3 py-1 text-xs font-semibold text-vaulix-accent">Synced</span>
            </div>

            <div className="space-y-4">
              <div className="rounded-3xl bg-[#111827] p-4">
                <div className="h-3 w-2/3 rounded-full bg-vaulix-accent/20 mb-4" />
                <div className="flex items-center justify-between text-sm text-vaulix-secondary-text">
                  <span>Search entries</span>
                  <Search className="h-4 w-4 text-vaulix-accent" />
                </div>
              </div>
              <div className="rounded-3xl bg-[#111827] p-5 space-y-3">
                <div className="flex items-center justify-between text-sm text-vaulix-secondary-text">
                  <span>Gmail</span>
                  <span className="rounded-full bg-vaulix-primary/10 px-2 py-1 text-xs text-vaulix-accent">Updated</span>
                </div>
                <p className="text-base font-medium text-white">user@gmail.com</p>
              </div>
              <div className="rounded-3xl bg-[#111827] p-5 space-y-3">
                <div className="flex items-center justify-between text-sm text-vaulix-secondary-text">
                  <span>GitHub</span>
                  <span className="rounded-full bg-vaulix-primary/10 px-2 py-1 text-xs text-vaulix-accent">New</span>
                </div>
                <p className="text-base font-medium text-white">username</p>
              </div>
              <div className="rounded-3xl border border-vaulix-accent/10 p-4 text-sm text-vaulix-secondary-text">
                <p className="font-medium text-vaulix-main-text">Need a new password?</p>
                <p className="mt-2">Generate a strong password instantly and save it to your vault.</p>
              </div>
            </div>
          </div>
          <div className="absolute -right-8 -bottom-10 h-32 w-32 rounded-3xl bg-vaulix-accent/10 blur-3xl" />
        </div>
      </div>
    </AnimatedSection>
  )
}
