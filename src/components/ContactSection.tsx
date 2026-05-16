import AnimatedSection from './AnimatedSection'

export default function ContactSection() {
  return (
    <AnimatedSection id="contact" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center rounded-[2rem] border border-vaulix-surface-bg bg-vaulix-dark-card/90 p-10 shadow-xl shadow-black/20">
        <div className="space-y-5">
          <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Contact Us</p>
          <h2 className="text-3xl font-semibold sm:text-4xl">Have feedback, suggestions, or questions about Vaulix?</h2>
          <p className="text-base leading-8 text-vaulix-secondary-text max-w-2xl">Feel free to reach out or contribute to the project. We welcome privacy-minded users, designers, and developers.</p>
        </div>

        <div className="space-y-4 rounded-3xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 p-8">
          <a href="https://github.com/yourgithubusername" target="_blank" rel="noreferrer" className="block rounded-2xl border border-vaulix-dark-bg bg-vaulix-dark-bg/80 px-5 py-4 text-sm font-semibold text-vaulix-main-text hover:bg-vaulix-dark-bg">GitHub Profile</a>
          <a href="https://github.com/yourgithubusername/vaulix" target="_blank" rel="noreferrer" className="block rounded-2xl border border-vaulix-dark-bg bg-vaulix-dark-bg/80 px-5 py-4 text-sm font-semibold text-vaulix-main-text hover:bg-vaulix-dark-bg">GitHub Repository</a>
          <a href="mailto:hello@vaulix.example" className="block rounded-2xl border border-vaulix-dark-bg bg-vaulix-dark-bg/80 px-5 py-4 text-sm font-semibold text-vaulix-main-text hover:bg-vaulix-dark-bg">Email Us</a>
          <a href="https://twitter.com/yourgithubusername" target="_blank" rel="noreferrer" className="block rounded-2xl border border-vaulix-dark-bg bg-vaulix-dark-bg/80 px-5 py-4 text-sm font-semibold text-vaulix-main-text hover:bg-vaulix-dark-bg">Twitter</a>
        </div>
      </div>
    </AnimatedSection>
  )
}
