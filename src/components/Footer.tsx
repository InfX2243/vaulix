 

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-vaulix-surface-bg/20 bg-transparent">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="text-lg font-semibold text-vaulix-accent">Vaulix</div>
            <p className="text-sm text-vaulix-secondary-text">Security that stays with you.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-vaulix-secondary-text">
            <a href="#features" className="hover:text-vaulix-main-text">Features</a>
            <a href="#security" className="hover:text-vaulix-main-text">Security</a>
            <a href="#about" className="hover:text-vaulix-main-text">About</a>
            <a href="https://github.com/yourgithubusername/vaulix" target="_blank" rel="noreferrer" className="hover:text-vaulix-main-text">GitHub</a>
            <a href="#contact" className="hover:text-vaulix-main-text">Contact</a>
          </div>
        </div>

        <div className="mt-10 border-t border-vaulix-surface-bg/20 pt-6 text-sm text-vaulix-secondary-text flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Vaulix. Privacy-first password security.</p>
          <p>Built and maintained by @yourgithubusername</p>
        </div>
      </div>
    </footer>
  )
}
