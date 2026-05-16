import { useEffect, useState } from 'react'
import LandingPage from './pages/LandingPage'
import GatewayPage from './pages/GatewayPage'
import DashboardPage, { PageType } from './pages/DashboardPage'

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
            onBack={() => setStage('landing')}
          />
        )
      ) : (
        <DashboardPage currentPage={currentPage} setCurrentPage={setCurrentPage} onLock={handleLockVault} />
      )}
    </div>
  )
}

