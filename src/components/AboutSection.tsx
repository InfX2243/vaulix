import AnimatedSection from './AnimatedSection'

export default function AboutSection() {
  return (
    <AnimatedSection id="about" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="rounded-[2rem] border border-vaulix-surface-bg bg-vaulix-dark-card/90 p-10 shadow-xl shadow-black/20">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">About Vaulix</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">About Vaulix</h2>
          <p className="text-base leading-8 text-vaulix-secondary-text">
            Vaulix was created to provide a modern and privacy-first approach to password security. Instead of relying on server-side access and unnecessary data collection, Vaulix focuses on local encryption, zero-knowledge architecture, and complete user ownership.
          </p>
          <p className="text-base leading-8 text-vaulix-secondary-text font-semibold">
            Give users full control over their digital security without sacrificing usability.
          </p>
        </div>
      </div>
    </AnimatedSection>
  )
}
