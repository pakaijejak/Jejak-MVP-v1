import { useState } from 'react'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { ambilKeputusanPending, ambilNamaSapaan, setNamaSapaan } from '../lib/storage'
import EditNamaSapaan from './EditNamaSapaan'

interface BerandaProps {
  onMulaiKeputusanBaru: () => void
  onRiwayatPola: () => void
  onLihatCekHasil: () => void
}

function Beranda({ onMulaiKeputusanBaru, onRiwayatPola, onLihatCekHasil }: BerandaProps) {
  const [pending] = useState(() => ambilKeputusanPending())
  const [namaSapaan, setNamaSapaanState] = useState(() => ambilNamaSapaan())

  return (
    <Screen>
      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          👋 Selamat datang lagi{namaSapaan ? `, ${namaSapaan}` : ''}!
        </h1>
        <div style={{ marginTop: 4 }}>
          <EditNamaSapaan
            namaSaatIni={namaSapaan}
            onSimpan={(nama) => {
              setNamaSapaan(nama)
              setNamaSapaanState(ambilNamaSapaan())
            }}
          />
        </div>
      </div>

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
