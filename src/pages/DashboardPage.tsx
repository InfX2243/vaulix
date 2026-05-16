import React from 'react'
import { Plus, Settings as SettingsIcon, LogOut, Search, Lock } from 'lucide-react'

export type PageType = 'dashboard' | 'settings'

export default function DashboardLayout({ currentPage, setCurrentPage, onLock }: {
  currentPage: PageType
  setCurrentPage: (p: PageType) => void
  onLock: () => void
}) {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-vaulix-surface-bg border-r border-vaulix-main-bg p-6 space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-vaulix-primary">Vaulix</h1>
          <p className="text-xs text-vaulix-secondary-text">Secure vault workspace</p>
        </div>

        <nav className="space-y-2">
          <button onClick={() => setCurrentPage('dashboard')} className={`w-full text-left px-4 py-2 rounded-lg transition-all ${currentPage === 'dashboard' ? 'bg-vaulix-primary text-vaulix-main-bg' : 'text-vaulix-secondary-text hover:bg-vaulix-main-bg'}`}>
            Vault
          </button>
          <button onClick={() => setCurrentPage('settings')} className={`w-full text-left px-4 py-2 rounded-lg transition-all ${currentPage === 'settings' ? 'bg-vaulix-primary text-vaulix-main-bg' : 'text-vaulix-secondary-text hover:bg-vaulix-main-bg'}`}>
            <SettingsIcon className="inline-block mr-2 h-4 w-4 align-text-bottom" />
            Settings
          </button>
        </nav>

        <button onClick={onLock} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-vaulix-secondary-text hover:bg-vaulix-main-bg rounded-lg transition-all">
          <LogOut className="w-4 h-4" />
          Lock Vault
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="bg-vaulix-surface-bg border-b border-vaulix-main-bg px-8 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-vaulix-secondary-text" />
              <input type="text" placeholder="Search vault..." className="input pl-10" />
            </div>
          </div>
          <button className="btn-accent flex items-center justify-center gap-2 w-full max-w-[220px]">
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          {currentPage === 'dashboard' && <VaultDashboard />}
          {currentPage === 'settings' && <SettingsPage />}
        </div>
      </div>
    </div>
  )
}

function VaultDashboard() {
  const [entries] = React.useState([
    { id: 1, service: 'Gmail', username: 'user@gmail.com', lastModified: '2 hours ago' },
    { id: 2, service: 'GitHub', username: 'username', lastModified: '1 week ago' },
  ])

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Vault</h2>
        <p className="text-vaulix-secondary-text">{entries.length} entries secured</p>
      </div>

      <div className="grid gap-4">
        {entries.length === 0 ? (
          <div className="card text-center py-12">
            <Lock className="w-12 h-12 text-vaulix-secondary-text mx-auto mb-4 opacity-50" />
            <p className="text-vaulix-secondary-text">No entries yet. Create your first entry to get started.</p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="card flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-vaulix-primary">{entry.service}</h3>
                <p className="text-sm text-vaulix-secondary-text">{entry.username}</p>
                <p className="text-xs text-vaulix-secondary-text mt-1">Modified {entry.lastModified}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-vaulix-primary text-vaulix-main-bg text-sm rounded">Edit</button>
                <button className="px-3 py-1 bg-vaulix-main-bg text-vaulix-secondary-text text-sm rounded border border-vaulix-surface-bg">Delete</button>
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
        <h3 className="font-semibold text-vaulix-primary">Vault Security</h3>
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
        <h3 className="font-semibold text-vaulix-primary">Cloud Sync (Coming Soon)</h3>
        <p className="text-sm text-vaulix-secondary-text">Optionally sync your encrypted vault with Google Drive for multi-device access.</p>
        <button className="btn-primary">Connect Google Drive</button>
      </div>
    </div>
  )
}
