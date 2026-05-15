import { useState } from 'react'
import { Lock, Plus, Settings, LogOut, Search } from 'lucide-react'

type PageType = 'landing' | 'dashboard' | 'settings'

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('landing')
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false)

  return (
    <div className="min-h-screen bg-vaulix-dark-bg text-vaulix-light-bg">
      {!isVaultUnlocked ? (
        currentPage === 'landing' ? (
          <LandingPage setIsVaultUnlocked={setIsVaultUnlocked} setCurrentPage={setCurrentPage} />
        ) : null
      ) : (
        <DashboardLayout 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage}
          setIsVaultUnlocked={setIsVaultUnlocked}
        />
      )}
    </div>
  )
}

interface LandingPageProps {
  setIsVaultUnlocked: (value: boolean) => void
  setCurrentPage: (page: PageType) => void
}

function LandingPage({ setIsVaultUnlocked, setCurrentPage }: LandingPageProps) {
  const [masterPassword, setMasterPassword] = useState('')
  const [step, setStep] = useState<'welcome' | 'create' | 'unlock'>('welcome')

  const handleCreateVault = () => {
    if (masterPassword.length < 8) {
      alert('Master password must be at least 8 characters')
      return
    }
    // TODO: Implement vault creation logic
    localStorage.setItem('vault_encrypted', 'true')
    setIsVaultUnlocked(true)
    setCurrentPage('dashboard')
    setStep('welcome')
    setMasterPassword('')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {step === 'welcome' && (
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <div className="flex justify-center">
                <Lock className="w-16 h-16 text-vaulix-accent" />
              </div>
              <h1 className="text-4xl font-bold text-vaulix-accent">Vaulix</h1>
              <p className="text-vaulix-light-text text-lg">Security that stays with you</p>
            </div>

            <p className="text-vaulix-light-bg">
              Your zero-knowledge password vault with local-first encryption.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => setStep('create')}
                className="btn-primary w-full"
              >
                Create Vault
              </button>
              <button
                onClick={() => setStep('unlock')}
                className="btn-secondary w-full"
              >
                Unlock Existing Vault
              </button>
            </div>

            <div className="pt-8 border-t border-vaulix-dark-card space-y-4">
              <div>
                <h3 className="font-semibold text-vaulix-accent mb-2">Why Vaulix?</h3>
                <ul className="text-sm text-vaulix-light-text space-y-1">
                  <li>✓ Zero-knowledge encryption</li>
                  <li>✓ Local-first architecture</li>
                  <li>✓ Optional encrypted cloud sync</li>
                  <li>✓ Complete data ownership</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {step === 'create' && (
          <div className="space-y-6">
            <button
              onClick={() => setStep('welcome')}
              className="text-vaulix-light-text hover:text-vaulix-accent text-sm"
            >
              ← Back
            </button>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Create Your Vault</h2>
              <p className="text-vaulix-light-text">Set a strong master password</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Master Password</label>
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter master password..."
                  className="input"
                />
                <p className="text-xs text-vaulix-light-text mt-1">
                  Minimum 8 characters recommended
                </p>
              </div>

              <button
                onClick={handleCreateVault}
                className="btn-primary w-full"
              >
                Create Vault
              </button>
            </div>

            <p className="text-xs text-vaulix-light-text">
              Your password is never stored on any server. Everything is encrypted locally in your browser.
            </p>
          </div>
        )}

        {step === 'unlock' && (
          <div className="space-y-6">
            <button
              onClick={() => setStep('welcome')}
              className="text-vaulix-light-text hover:text-vaulix-accent text-sm"
            >
              ← Back
            </button>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Unlock Your Vault</h2>
              <p className="text-vaulix-light-text">Enter your master password</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Master Password</label>
                <input
                  type="password"
                  value={masterPassword}
                  onChange={(e) => setMasterPassword(e.target.value)}
                  placeholder="Enter master password..."
                  className="input"
                />
              </div>

              <button
                onClick={() => {
                  if (masterPassword) {
                    // TODO: Implement vault unlock logic
                    setIsVaultUnlocked(true)
                    setStep('welcome')
                    setMasterPassword('')
                  }
                }}
                className="btn-primary w-full"
              >
                Unlock
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

interface DashboardLayoutProps {
  currentPage: PageType
  setCurrentPage: (page: PageType) => void
  setIsVaultUnlocked: (value: boolean) => void
}

function DashboardLayout({ currentPage, setCurrentPage, setIsVaultUnlocked }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-vaulix-dark-card border-r border-vaulix-dark-bg p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-vaulix-accent">Vaulix</h1>
          <p className="text-xs text-vaulix-light-text">Your Password Vault</p>
        </div>

        <nav className="space-y-2">
          <button
            onClick={() => setCurrentPage('dashboard')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
              currentPage === 'dashboard'
                ? 'bg-vaulix-primary text-white'
                : 'text-vaulix-light-text hover:bg-vaulix-dark-bg'
            }`}
          >
            Vault
          </button>
          <button
            onClick={() => setCurrentPage('settings')}
            className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
              currentPage === 'settings'
                ? 'bg-vaulix-primary text-white'
                : 'text-vaulix-light-text hover:bg-vaulix-dark-bg'
            }`}
          >
            <Settings/>Settings
          </button>
        </nav>

        <button
          onClick={() => setIsVaultUnlocked(false)}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-vaulix-light-text hover:bg-vaulix-dark-bg rounded-lg transition-all"
        >
          <LogOut className="w-4 h-4" />
          Lock Vault
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-vaulix-dark-card border-b border-vaulix-dark-bg px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vaulix-light-text" />
              <input
                type="text"
                placeholder="Search vault..."
                className="input pl-10"
              />
            </div>
          </div>
          <button className="btn-accent flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8">
          {currentPage === 'dashboard' && <VaultDashboard />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  )
}

function VaultDashboard() {
  const [entries, _setEntries] = useState([
    {
      id: 1,
      service: 'Gmail',
      username: 'user@gmail.com',
      lastModified: '2 days ago',
    },
    {
      id: 2,
      service: 'GitHub',
      username: 'username',
      lastModified: '1 week ago',
    },
  ])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Vault</h2>
        <p className="text-vaulix-light-text">{entries.length} entries secured</p>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <Lock className="w-12 h-12 text-vaulix-light-text mx-auto mb-4 opacity-50" />
            <p className="text-vaulix-light-text">No entries yet. Create your first entry to get started.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-vaulix-accent">{entry.service}</h3>
                <p className="text-sm text-vaulix-light-text">{entry.username}</p>
                <p className="text-xs text-vaulix-light-text mt-1">Modified {entry.lastModified}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-vaulix-primary text-white text-sm rounded hover:bg-opacity-90">
                  Edit
                </button>
                <button className="px-3 py-1 bg-vaulix-dark-bg text-vaulix-light-bg text-sm rounded hover:border-vaulix-primary border">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Settings</h2>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-vaulix-accent">Vault Security</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" defaultChecked className="w-4 h-4" />
            <span>Auto-lock after 5 minutes of inactivity</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4" />
            <span>Require password on app startup</span>
          </label>
        </div>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-vaulix-accent">Cloud Sync (Coming Soon)</h3>
        <p className="text-sm text-vaulix-light-text">
          Optionally sync your encrypted vault with Google Drive for multi-device access.
        </p>
        <button className="btn-primary">Connect Google Drive</button>
      </div>

      <div className="card space-y-4">
        <h3 className="font-semibold text-vaulix-accent">Backup & Recovery</h3>
        <div className="space-y-2">
          <button className="btn-secondary w-full">Export Encrypted Vault</button>
          <button className="btn-secondary w-full">Import Vault Backup</button>
        </div>
      </div>
    </div>
  )
}
