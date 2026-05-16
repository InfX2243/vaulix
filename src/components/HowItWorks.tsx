import StepBlock from './StepBlock'
import AnimatedSection from './AnimatedSection'

export default function HowItWorks() {
  return (
    <AnimatedSection id="how-it-works" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Simple workflow. Strong security.</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">Simple workflow. Strong security.</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <div>
          <div className="mt-6 space-y-4">
            <StepBlock number="01" title="Create Your Master Password" description="Your master password generates local encryption keys directly inside your browser." />
            <StepBlock number="02" title="Store Credentials Securely" description="Every credential is encrypted before being stored on your device." />
            <StepBlock number="03" title="Sync Encrypted Vaults" description="Optionally upload encrypted vault backups to Google Drive for secure multi-device access." />
            <StepBlock number="04" title="Unlock Anywhere Safely" description="Access your encrypted vault securely using your master password on any device." />
          </div>
        </div>

        <aside className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/90 p-8 shadow-xl shadow-black/15">
          <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">How Vaulix protects you</p>
          <h3 className="mt-4 text-xl font-semibold">Trusted local encryption</h3>
          <p className="mt-3 text-sm text-vaulix-secondary-text">Vaulix keeps encryption inside the browser, never storing plaintext on external servers. This keeps your vault secure, private, and under your control.</p>
        </aside>
      </div>
    </AnimatedSection>
  )
}
