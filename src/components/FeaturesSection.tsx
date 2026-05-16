import { ShieldCheck, Lock, Cloud, Zap, Key, Smartphone } from 'lucide-react'
import AnimatedSection from './AnimatedSection'
import TrustCard from './TrustCard'

const features = [
  {
    title: 'Zero-Knowledge Encryption',
    description: 'Encryption and decryption happen entirely inside your browser. Vaulix never sees your passwords or encryption keys.',
    icon: <ShieldCheck className="h-5 w-5" />, 
  },
  {
    title: 'Local-First Architecture',
    description: 'Your encrypted vault is securely stored on your device using browser-based encrypted storage.',
    icon: <Lock className="h-5 w-5" />,
  },
  {
    title: 'Optional Secure Sync',
    description: 'Securely sync encrypted vaults across devices using Google Drive without exposing sensitive data.',
    icon: <Cloud className="h-5 w-5" />,
  },
  {
    title: 'Fast Vault Management',
    description: 'Quickly search, reveal, copy, edit, and organize credentials with a clean and responsive interface.',
    icon: <Zap className="h-5 w-5" />,
  },
  {
    title: 'Password Generator',
    description: 'Generate strong passwords instantly with customizable security settings.',
    icon: <Key className="h-5 w-5" />,
  },
  {
    title: 'Responsive Everywhere',
    description: 'Built for desktop, tablet, and mobile browsers with touch-friendly interactions.',
    icon: <Smartphone className="h-5 w-5" />,
  },
]

export default function FeaturesSection() {
  return (
    <AnimatedSection id="features" className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
      <div className="text-center mb-10">
        <p className="text-sm uppercase tracking-[0.35em] text-vaulix-accent/80">Built around privacy and simplicity</p>
        <h2 className="text-3xl font-semibold sm:text-4xl">Built around privacy and simplicity</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature) => (
          <TrustCard key={feature.title} title={feature.title} icon={feature.icon}>
            {feature.description}
          </TrustCard>
        ))}
      </div>
    </AnimatedSection>
  )
}
