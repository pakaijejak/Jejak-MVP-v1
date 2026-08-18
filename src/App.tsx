import { useState } from 'react'
import DebugPage from './debug/DebugPage'
import { ambilTerverifikasi, setOnboardingSelesai, setTerverifikasi } from './lib/storage'
import BantuanMasukan from './screens/BantuanMasukan'
import Beranda from './screens/Beranda'
import CekHasilFlow from './screens/cek-hasil/CekHasilFlow'
import GerbangAkses from './screens/GerbangAkses'
import KebijakanPrivasi from './screens/KebijakanPrivasi'
import LihatCekHasil from './screens/LihatCekHasil'
import Onboarding from './screens/Onboarding'
import OnboardingContoh from './screens/OnboardingContoh'
import RiwayatPola from './screens/riwayat-pola/RiwayatPola'
import MulaiKeputusanBaru from './screens/keputusan-baru/MulaiKeputusanBaru'

type Layar =
  | 'beranda'
  | 'mulai-keputusan'
  | 'riwayat-pola'
  | 'lihat-cek-hasil'
  | 'cek-hasil-detail'
  | 'bantuan-masukan'

type AsalCekHasil = 'lihat-cek-hasil' | 'riwayat-pola'

function MainApp() {
  const [layar, setLayar] = useState<Layar>('beranda')
  const [idKeputusanDipilih, setIdKeputusanDipilih] = useState<string | null>(null)
  const [asalCekHasil, setAsalCekHasil] = useState<AsalCekHasil>('lihat-cek-hasil')

  function pilihKeputusanUntukDicek(id: string, asal: AsalCekHasil) {
    setIdKeputusanDipilih(id)
    setAsalCekHasil(asal)
    setLayar('cek-hasil-detail')
  }

  switch (layar) {
    case 'beranda':
      return (
        <Beranda
          onMulaiKeputusanBaru={() => setLayar('mulai-keputusan')}
          onRiwayatPola={() => setLayar('riwayat-pola')}
          onLihatCekHasil={() => setLayar('lihat-cek-hasil')}
          onBantuanMasukan={() => setLayar('bantuan-masukan')}
        />
      )
    case 'bantuan-masukan':
      return <BantuanMasukan onKembali={() => setLayar('beranda')} />
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

type LayarPraVerifikasi = 'onboarding' | 'onboarding-contoh' | 'gerbang'
type AsalWalkthrough = 'onboarding' | 'gerbang'

function AksesGate() {
  const [terverifikasi, setTerverifikasiState] = useState(() => ambilTerverifikasi())
  const [layar, setLayar] = useState<LayarPraVerifikasi>('onboarding')
  const [asalWalkthrough, setAsalWalkthrough] = useState<AsalWalkthrough>('onboarding')

  if (terverifikasi) {
    return <MainApp />
  }

  function bukaWalkthrough(asal: AsalWalkthrough) {
    setAsalWalkthrough(asal)
    setLayar('onboarding-contoh')
  }

  switch (layar) {
    case 'onboarding':
      return (
        <Onboarding
          onCobaSekarang={() => bukaWalkthrough('onboarding')}
          onLewati={() => {
            setOnboardingSelesai(true)
            setLayar('gerbang')
          }}
        />
      )
    case 'onboarding-contoh':
      return (
        <OnboardingContoh
          onLanjut={() => {
            setOnboardingSelesai(true)
            setLayar('gerbang')
          }}
          onBatal={() => setLayar(asalWalkthrough)}
        />
      )
    case 'gerbang':
      return (
        <GerbangAkses
          onTerverifikasi={() => {
            setTerverifikasi(true)
            setTerverifikasiState(true)
          }}
          onLihatContoh={() => bukaWalkthrough('gerbang')}
        />
      )
  }
}

function App() {
  if (window.location.pathname === '/debug') {
    return <DebugPage />
  }

  if (window.location.pathname === '/privasi') {
    return <KebijakanPrivasi />
  }

  return <AksesGate />
}

export default App
