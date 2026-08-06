import { useState } from 'react'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { ambilKeputusanPending } from '../lib/storage'

interface LihatCekHasilProps {
  onKembali: () => void
  onPilih: (id: string) => void
}

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function LihatCekHasil({ onKembali, onPilih }: LihatCekHasilProps) {
  const [pending] = useState(() => ambilKeputusanPending())

  return (
    <Screen>
      <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Lihat &amp; Cek Hasil</h1>

      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {pending.map((k) => (
          <li key={k.id}>
            <button
              type="button"
              onClick={() => onPilih(k.id)}
              style={{
                width: '100%',
                textAlign: 'left',
                border: '1px solid var(--color-ink-muted)',
                borderRadius: 12,
                padding: 16,
                background: 'transparent',
                color: 'var(--color-ink)',
                fontFamily: 'inherit',
                cursor: 'pointer',
              }}
            >
              <p style={{ margin: 0, fontWeight: 600 }}>{k.masalah}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                Dicatat {formatTanggal(k.createdAt)}
              </p>
            </button>
          </li>
        ))}
      </ul>

      <Button variant="secondary" onClick={onKembali}>
        Kembali
      </Button>
    </Screen>
  )
}

export default LihatCekHasil
