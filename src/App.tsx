import { useState } from 'react'
import DebugPage from './debug/DebugPage'
import { ambilOnboardingSelesai, setOnboardingSelesai } from './lib/storage'
import Beranda from './screens/Beranda'
import CekHasilFlow from './screens/cek-hasil/CekHasilFlow'
import LihatCekHasil from './screens/LihatCekHasil'
import Onboarding from './screens/Onboarding'
import OnboardingContoh from './screens/OnboardingContoh'
import PlaceholderScreen from './screens/PlaceholderScreen'
import MulaiKeputusanBaru from './screens/keputusan-baru/MulaiKeputusanBaru'

type Layar =
  | 'onboarding'
  | 'onboarding-contoh'
  | 'beranda'
  | 'mulai-keputusan'
  | 'riwayat-pola'
  | 'lihat-cek-hasil'
  | 'cek-hasil-detail'

function MainApp() {
  const [layar, setLayar] = useState<Layar>(() =>
    ambilOnboardingSelesai() ? 'beranda' : 'onboarding',
  )
  const [idKeputusanDipilih, setIdKeputusanDipilih] = useState<string | null>(null)

  function selesaikanOnboarding() {
    setOnboardingSelesai(true)
    setLayar('beranda')
  }

  switch (layar) {
    case 'onboarding':
      return (
        <Onboarding
          onCobaSekarang={() => setLayar('onboarding-contoh')}
          onLewati={selesaikanOnboarding}
        />
      )
    case 'onboarding-contoh':
      return <OnboardingContoh onLanjut={selesaikanOnboarding} />
    case 'beranda':
      return (
        <Beranda
          onMulaiKeputusanBaru={() => setLayar('mulai-keputusan')}
          onRiwayatPola={() => setLayar('riwayat-pola')}
          onLihatCekHasil={() => setLayar('lihat-cek-hasil')}
        />
      )
    case 'mulai-keputusan':
      return (
        <MulaiKeputusanBaru
          onSelesai={() => setLayar('beranda')}
          onBatal={() => setLayar('beranda')}
        />
      )
    case 'riwayat-pola':
      return (
        <PlaceholderScreen
          pesan="Riwayat & Pola akan dibangun di sesi berikutnya."
          onKembali={() => setLayar('beranda')}
        />
      )
    case 'lihat-cek-hasil':
      return (
        <LihatCekHasil
          onKembali={() => setLayar('beranda')}
          onPilih={(id) => {
            setIdKeputusanDipilih(id)
            setLayar('cek-hasil-detail')
          }}
        />
      )
    case 'cek-hasil-detail':
      if (!idKeputusanDipilih) return null
      return (
        <CekHasilFlow
          keputusanId={idKeputusanDipilih}
          onSelesai={() => setLayar('beranda')}
          onBatal={() => setLayar('lihat-cek-hasil')}
        />
      )
  }
}

function App() {
  if (window.location.pathname === '/debug') {
    return <DebugPage />
  }

  return <MainApp />
}

export default App
