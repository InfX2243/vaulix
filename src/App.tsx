import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import GatewayPage from './pages/GatewayPage'
import DashboardPage, { PageType } from './pages/DashboardPage'
import { deserializeVault } from './lib/vaultContainer'
import { saveVault } from './lib/vaultStorage'

type AppStage = 'landing' | 'gateway' | 'vault'

export default function App() {
  const [stage, setStage] = useState<AppStage>('landing')
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard')
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false)
  const [vaultExists, setVaultExists] = useState(false)

  useEffect(() => {
    const savedVault = localStorage.getItem('vaulix_vault_exists')
    setVaultExists(savedVault === 'true')
  }, [])

  const handleCreateVault = () => {
    localStorage.setItem('vaulix_vault_exists', 'true')
    setVaultExists(true)
    setIsVaultUnlocked(true)
    setStage('vault')
    setCurrentPage('dashboard')
  }

  const handleContinueVault = () => {
    if (!vaultExists) return
    setIsVaultUnlocked(true)
    setStage('vault')
    setCurrentPage('dashboard')
  }

  const handleLockVault = () => {
    setIsVaultUnlocked(false)
    setStage('gateway')
  }

  const handleImportVault = async (file: File) => {
    const content = await file.text()
    const vlx = await deserializeVault(content)

    await saveVault({
      id: vlx.metadata.vaultId,
      name: vlx.metadata.name,
      createdAt: vlx.metadata.createdAt,
      salt: vlx.encryption.salt,
      vlx: content,
      vaultBlob: vlx.vaultData,
      wrappedVekWithMaster: vlx.wrappedVek.withMasterKey,
      wrappedVekWithRecovery: vlx.wrappedVek.withRecoveryKey,
    })

    localStorage.setItem('vaulix_vault_exists', 'true')
    setVaultExists(true)
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
            onCreateVault={handleCreateVault}
            onContinueVault={handleContinueVault}
            onImportVault={handleImportVault}
            onBack={() => setStage('landing')}
          />
        )
      ) : (
        <DashboardPage currentPage={currentPage} setCurrentPage={setCurrentPage} onLock={handleLockVault} />
      )}
    </div>
  )
}

