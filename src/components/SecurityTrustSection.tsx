import AnimatedSection from './AnimatedSection'

const trustItems = [
  {
    title: 'Local Encryption',
    description: 'Sensitive data is encrypted locally before storage or syncing.',
  },
  {
    title: 'No Plaintext Storage',
    description: 'Passwords and vault contents never leave your device unencrypted.',
  },
  {
    title: 'User-Controlled Backups',
    description: 'Export and import encrypted vault files anytime.',
  },
  {
    title: 'Privacy-First Architecture',
    description: 'Vaulix is built around transparency, simplicity, and user ownership.',
  },
]

export default function SecurityTrustSection() {
  return (
    <AnimatedSection id="security" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Designed for complete ownership</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">Designed for complete ownership</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {trustItems.map((item) => (
          <div key={item.title} className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-dark-card/80 p-6 hover:-translate-y-1 hover:border-vaulix-accent/30 transition-transform duration-300">
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-vaulix-secondary-text">{item.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}
