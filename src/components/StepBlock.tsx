 

export default function StepBlock({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="rounded-3xl border border-vaulix-dark-bg bg-[#0d1220] p-5">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-vaulix-primary/10 font-semibold text-vaulix-accent">{number}</div>
      <h3 className="mt-4 text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-vaulix-secondary-text">{description}</p>
    </div>
  )
}
