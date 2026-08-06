import { useState } from 'react'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { ambilKeputusanPending } from '../lib/storage'

interface BerandaProps {
  onMulaiKeputusanBaru: () => void
  onRiwayatPola: () => void
  onLihatCekHasil: () => void
}

function Beranda({ onMulaiKeputusanBaru, onRiwayatPola, onLihatCekHasil }: BerandaProps) {
  const [pending] = useState(() => ambilKeputusanPending())

  return (
    <Screen>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>👋 Selamat datang lagi!</h1>

      {pending.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingBottom: 24,
            borderBottom: '1px solid var(--color-ink-muted)',
          }}
        >
          <p style={{ margin: 0 }}>
            🔔 {pending.length} keputusan menunggu direview
          </p>
          <Button variant="primary" onClick={onLihatCekHasil}>
            Lihat &amp; Cek Hasil
          </Button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="primary" onClick={onMulaiKeputusanBaru}>
          + Mulai Keputusan Baru
        </Button>
        <Button variant="secondary" onClick={onRiwayatPola}>
          Riwayat &amp; Pola
        </Button>
      </div>
    </Screen>
  )
}

export default Beranda
