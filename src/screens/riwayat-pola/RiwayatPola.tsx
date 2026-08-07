import { useMemo, useState } from 'react'
import Chip from '../../components/Chip'
import ChipRow from '../../components/ChipRow'
import Screen from '../../components/Screen'
import {
  KATEGORI_TETAP,
  ambilKategoriCustom,
  ambilSemuaKeputusan,
  ambilTampilkanGrafikPola,
  setTampilkanGrafikPola,
} from '../../lib/storage'
import DetailKeputusan from './DetailKeputusan'
import GrafikKalibrasi from './GrafikKalibrasi'
import KartuRiwayat from './KartuRiwayat'

type FilterKategori = 'Semua' | string

interface RiwayatPolaProps {
  onKembali: () => void
  onPilihPending: (id: string) => void
}

function RiwayatPola({ onKembali, onPilihPending }: RiwayatPolaProps) {
  const [semua] = useState(() => ambilSemuaKeputusan())
  const [kategoriCustom] = useState(() => ambilKategoriCustom())
  const [filter, setFilter] = useState<FilterKategori>('Semua')
  const [tampilkanGrafik, setTampilkanGrafikState] = useState(() => ambilTampilkanGrafikPola())
  const [idDetail, setIdDetail] = useState<string | null>(null)

  const terfilter = useMemo(() => {
    const hasil =
      filter === 'Semua' ? semua : semua.filter((k) => k.kategori.toLowerCase() === filter.toLowerCase())
    return [...hasil].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [semua, filter])

  function toggleGrafik() {
    const next = !tampilkanGrafik
    setTampilkanGrafikPola(next)
    setTampilkanGrafikState(next)
  }

  if (idDetail) {
    const detail = semua.find((k) => k.id === idDetail)
    if (detail) {
      return <DetailKeputusan keputusan={detail} onKembali={() => setIdDetail(null)} />
    }
  }

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

      <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
        Riwayat ini bukan rapor buat menilai kamu. Ini buat bantu kamu liat pola cara berpikirmu dari waktu ke
        waktu.
      </p>

      <ChipRow>
        <Chip label="Semua" selected={filter === 'Semua'} onClick={() => setFilter('Semua')} />
        {KATEGORI_TETAP.map((kategori) => (
          <Chip
            key={kategori}
            label={kategori}
            selected={filter !== 'Semua' && filter.toLowerCase() === kategori.toLowerCase()}
            onClick={() => setFilter(kategori)}
          />
        ))}
        {kategoriCustom.map((kategori) => (
          <Chip
            key={kategori}
            label={kategori}
            selected={filter !== 'Semua' && filter.toLowerCase() === kategori.toLowerCase()}
            onClick={() => setFilter(kategori)}
          />
        ))}
      </ChipRow>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#C1793F', display: 'inline-block' }}
              />
              Prediksi
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <span
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#2B3A42', display: 'inline-block' }}
              />
              Hasil
            </span>
          </div>
          <button
            type="button"
            onClick={toggleGrafik}
            aria-label={tampilkanGrafik ? 'Sembunyikan grafik' : 'Tampilkan grafik'}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-ink-muted)',
              fontSize: '0.85rem',
              cursor: 'pointer',
              fontFamily: 'inherit',
              textDecoration: 'underline',
              whiteSpace: 'nowrap',
            }}
          >
            {tampilkanGrafik ? '👁 Sembunyikan grafik' : '👁 Tampilkan grafik'}
          </button>
        </div>
        {tampilkanGrafik && <GrafikKalibrasi data={terfilter} />}
      </div>

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
                onTap={k.status === 'menunggu_direview' ? () => onPilihPending(k.id) : () => setIdDetail(k.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Screen>
  )
}

export default RiwayatPola
