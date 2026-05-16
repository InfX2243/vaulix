import React from 'react'

export default function TrustCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-vaulix-surface-bg bg-vaulix-surface-bg/6 p-6 transform transition-transform hover:-translate-y-1 hover:shadow-lg">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-vaulix-primary/8 text-vaulix-accent">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-vaulix-secondary-text">{children}</p>
    </div>
  )
}
