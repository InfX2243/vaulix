import AnimatedSection from './AnimatedSection'

export default function FinalCtaSection({ onLaunch }: { onLaunch: () => void }) {
  return (
    <AnimatedSection id="final-cta" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="rounded-[2rem] border border-vaulix-surface-bg bg-vaulix-dark-card/90 p-10 text-center shadow-xl shadow-black/20">
        <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Take control of your digital security.</p>
        <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">Your passwords should stay private, encrypted, and fully under your control.</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-vaulix-secondary-text">Vaulix gives you the confidence of zero-knowledge encryption with a lightweight, modern interface designed for privacy-first workflows.</p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button onClick={onLaunch} className="btn-primary px-8 py-4">Launch Vaulix</button>
          <a href="#features" className="btn-secondary px-8 py-4">Learn More</a>
        </div>
      </div>
    </AnimatedSection>
  )
}
