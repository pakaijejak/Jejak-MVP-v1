import { useState } from 'react'
import DebugPage from './debug/DebugPage'
import { ambilOnboardingSelesai, ambilTerverifikasi, setOnboardingSelesai, setTerverifikasi } from './lib/storage'
import Beranda from './screens/Beranda'
import CekHasilFlow from './screens/cek-hasil/CekHasilFlow'
import GerbangAkses from './screens/GerbangAkses'
import LihatCekHasil from './screens/LihatCekHasil'
import Onboarding from './screens/Onboarding'
import OnboardingContoh from './screens/OnboardingContoh'
import RiwayatPola from './screens/riwayat-pola/RiwayatPola'
import MulaiKeputusanBaru from './screens/keputusan-baru/MulaiKeputusanBaru'

type Layar =
  | 'onboarding'
  | 'onboarding-contoh'
  | 'beranda'
  | 'mulai-keputusan'
  | 'riwayat-pola'
  | 'lihat-cek-hasil'
  | 'cek-hasil-detail'

type AsalCekHasil = 'lihat-cek-hasil' | 'riwayat-pola'

function MainApp() {
  const [layar, setLayar] = useState<Layar>(() =>
    ambilOnboardingSelesai() ? 'beranda' : 'onboarding',
  )
  const [idKeputusanDipilih, setIdKeputusanDipilih] = useState<string | null>(null)
  const [asalCekHasil, setAsalCekHasil] = useState<AsalCekHasil>('lihat-cek-hasil')

  function selesaikanOnboarding() {
    setOnboardingSelesai(true)
    setLayar('beranda')
  }

  function pilihKeputusanUntukDicek(id: string, asal: AsalCekHasil) {
    setIdKeputusanDipilih(id)
    setAsalCekHasil(asal)
    setLayar('cek-hasil-detail')
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
        <RiwayatPola
          onKembali={() => setLayar('beranda')}
          onPilihPending={(id) => pilihKeputusanUntukDicek(id, 'riwayat-pola')}
        />
      )
    case 'lihat-cek-hasil':
      return (
        <LihatCekHasil
          onKembali={() => setLayar('beranda')}
          onPilih={(id) => pilihKeputusanUntukDicek(id, 'lihat-cek-hasil')}
        />
      )
    case 'cek-hasil-detail':
      if (!idKeputusanDipilih) return null
      return (
        <CekHasilFlow
          keputusanId={idKeputusanDipilih}
          onSelesai={() => setLayar('beranda')}
          onBatal={() => setLayar(asalCekHasil)}
        />
      )
  }
}

function AksesGate() {
  const [terverifikasi, setTerverifikasiState] = useState(() => ambilTerverifikasi())

  if (!terverifikasi) {
    return (
      <GerbangAkses
        onTerverifikasi={() => {
          setTerverifikasi(true)
          setTerverifikasiState(true)
        }}
      />
    )
  }

  return <MainApp />
}

function App() {
  if (window.location.pathname === '/debug') {
    return <DebugPage />
  }

  return <AksesGate />
}

export default App
