import AnimatedSection from './AnimatedSection'

const useCases = [
  {
    title: 'Personal Password Management',
    description: 'Securely manage daily credentials and sensitive information.',
  },
  {
    title: 'Multi-Device Access',
    description: 'Access encrypted vaults safely across devices using optional secure sync.',
  },
  {
    title: 'Privacy-Conscious Users',
    description: 'Maintain full ownership of encrypted data without exposing sensitive information.',
  },
  {
    title: 'Lightweight Alternative',
    description: 'A clean and focused alternative to bloated password management platforms.',
  },
]

export default function UseCasesSection() {
  return (
    <AnimatedSection id="use-cases" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Built for modern digital security</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">Built for modern digital security</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {useCases.map((item) => (
          <div key={item.title} className="rounded-3xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 p-7 hover:-translate-y-1 transition-transform duration-300">
            <h3 className="text-xl font-semibold text-white">{item.title}</h3>
            <p className="mt-3 text-sm leading-7 text-vaulix-secondary-text">{item.description}</p>
          </div>
        ))}
      </div>
    </AnimatedSection>
  )
}
