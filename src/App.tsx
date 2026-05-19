import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import GatewayPage from './pages/GatewayPage'
import DashboardPage, { PageType } from './pages/DashboardPage'
import { deserializeVaultFromBinary, serializeVault } from './lib/vaultContainer'
import { deleteVaultById, listVaults, saveVault, touchVaultOpenedAt, type VaultRecord } from './lib/vaultStorage'

type AppStage = 'landing' | 'gateway' | 'vault'

export default function App() {
  const [stage, setStage] = useState<AppStage>('landing')
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false)
  const [vaultExists, setVaultExists] = useState(false)
  const [activeVaultId, setActiveVaultId] = useState<string | null>(null)
  const [vaults, setVaults] = useState<VaultRecord[]>([])

  useEffect(() => {
    const savedVault = localStorage.getItem('vaulix_vault_exists')
    setVaultExists(savedVault === 'true')
    void refreshVaults()
  }, [])

  const refreshVaults = async () => {
    const all = await listVaults()
    const sorted = [...all].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setVaults(sorted)
    setVaultExists(sorted.length > 0)
  }

  const handleCreateVault = async (vaultId: string) => {
    localStorage.setItem('vaulix_vault_exists', 'true')
    setActiveVaultId(vaultId)
    await touchVaultOpenedAt(vaultId)
    await refreshVaults()
    setIsVaultUnlocked(true)
    setStage('vault')
    setCurrentPage('dashboard')
  }

  const handleContinueVault = async (vaultId: string) => {
    setActiveVaultId(vaultId)
    await touchVaultOpenedAt(vaultId)
    await refreshVaults()
    setIsVaultUnlocked(true)
    setStage('vault')
    setCurrentPage('dashboard')
  }

  const handleLockVault = () => {
    setIsVaultUnlocked(false)
    setStage('gateway')
  }

  const handleSwitchVault = async (vaultId: string) => {
    setActiveVaultId(vaultId)
    await touchVaultOpenedAt(vaultId)
    await refreshVaults()
  }

  const handleDeleteVault = async (vaultId: string) => {
    await deleteVaultById(vaultId)
    await refreshVaults()
    const remaining = await listVaults()
    localStorage.setItem('vaulix_vault_exists', remaining.length > 0 ? 'true' : 'false')
    if (remaining.length === 0) localStorage.removeItem('vaulix_vlx')
    setVaultExists(remaining.length > 0)
    setActiveVaultId(null)
    setIsVaultUnlocked(false)
    setStage('gateway')
    setCurrentPage('dashboard')
  }

  const handleImportVault = async (file: File) => {
    const bytes = new Uint8Array(await file.arrayBuffer())
    const vlx = await deserializeVaultFromBinary(bytes)
    const serialized = await serializeVault(vlx)

    await saveVault({
      id: vlx.metadata.vaultId,
      name: vlx.metadata.name,
      createdAt: vlx.metadata.createdAt,
      lastOpenedAt: new Date().toISOString(),
      source: 'imported',
      salt: vlx.encryption.salt,
      vlx: serialized,
      vlk: undefined,
      vaultBlob: vlx.vaultData,
      wrappedVekWithMaster: vlx.wrappedVek.withMasterKey,
      wrappedVekWithRecovery: vlx.wrappedVek.withRecoveryKey,
    })

    localStorage.setItem('vaulix_vault_exists', 'true')
    setActiveVaultId(vlx.metadata.vaultId)
    await refreshVaults()
    setIsVaultUnlocked(true)
    setStage('vault')
    setCurrentPage('dashboard')
  }

  return (
    <div className="min-h-screen bg-vaulix-main-bg text-vaulix-main-text">
      {!isVaultUnlocked ? (
        stage === 'landing' ? (
          <LandingPage onLaunch={() => setStage('gateway')} />
        ) : (
          <GatewayPage
            vaultExists={vaultExists}
            vaults={vaults}
            onCreateVault={handleCreateVault}
            onContinueVault={handleContinueVault}
            onImportVault={handleImportVault}
            onBack={() => setStage('landing')}
          />
        )
      ) : (
        <DashboardPage
          activeVaultId={activeVaultId}
          vaults={vaults}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onLock={handleLockVault}
          onSwitchVault={handleSwitchVault}
          onDeleteVault={handleDeleteVault}
        />
      )}
    </div>
  )
}

