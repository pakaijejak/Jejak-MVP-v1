import { useMemo, useState } from 'react'
import Chip from '../../components/Chip'
import Screen from '../../components/Screen'
import { ambilSemuaKeputusan } from '../../lib/storage'
import type { Keputusan } from '../../types/keputusan'
import GrafikKalibrasi from './GrafikKalibrasi'
import KartuRiwayat from './KartuRiwayat'

const KATEGORI_LIST: Keputusan['kategori'][] = ['Karier', 'Uang', 'Relasi', 'Kesehatan', 'Lainnya']
type FilterKategori = 'Semua' | Keputusan['kategori']

interface RiwayatPolaProps {
  onKembali: () => void
  onPilihPending: (id: string) => void
}

function RiwayatPola({ onKembali, onPilihPending }: RiwayatPolaProps) {
  const [semua] = useState(() => ambilSemuaKeputusan())
  const [filter, setFilter] = useState<FilterKategori>('Semua')

  const terfilter = useMemo(() => {
    const hasil = filter === 'Semua' ? semua : semua.filter((k) => k.kategori === filter)
    return [...hasil].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [semua, filter])

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onKembali}
          aria-label="Kembali"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-ink)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Riwayat &amp; Pola</h1>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        <Chip label="Semua" selected={filter === 'Semua'} onClick={() => setFilter('Semua')} />
        {KATEGORI_LIST.map((kategori) => (
          <Chip
            key={kategori}
            label={kategori}
            selected={filter === kategori}
            onClick={() => setFilter(kategori)}
          />
        ))}
      </div>

      <GrafikKalibrasi data={terfilter} />

      <div>
        <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Daftar keputusan</p>
        {terfilter.length === 0 ? (
          <p style={{ color: 'var(--color-ink-muted)' }}>Belum ada keputusan di kategori ini.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {terfilter.map((k) => (
              <KartuRiwayat
                key={k.id}
                keputusan={k}
                onTap={k.status === 'menunggu_direview' ? () => onPilihPending(k.id) : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </Screen>
  )
}

export default RiwayatPola
