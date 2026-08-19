import { useMemo, useState } from 'react'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import ChipRow from '../../components/ChipRow'
import Screen from '../../components/Screen'
import {
  KATEGORI_TETAP,
  ambilKategoriCustom,
  ambilSemuaKeputusan,
  ambilTampilkanGrafikPola,
  hapusKeputusan,
  setTampilkanGrafikPola,
} from '../../lib/storage'
import type { Keputusan } from '../../types/keputusan'
import CadangkanData from './CadangkanData'
import DetailKeputusan from './DetailKeputusan'
import GrafikKalibrasi from './GrafikKalibrasi'
import InsightPola from './InsightPola'
import KartuRiwayat from './KartuRiwayat'
import PulihkanData from './PulihkanData'
import RefleksiGrafik from './RefleksiGrafik'

type FilterKategori = 'Semua' | string
type SubLayar = 'daftar' | 'cadangkan' | 'pulihkan'

interface RiwayatPolaProps {
  onKembali: () => void
  onPilihPending: (id: string) => void
}

function RiwayatPola({ onKembali, onPilihPending }: RiwayatPolaProps) {
  const [semua, setSemua] = useState(() => ambilSemuaKeputusan())
  const [kategoriCustom] = useState(() => ambilKategoriCustom())
  const [filter, setFilter] = useState<FilterKategori>('Semua')
  const [tampilkanGrafik, setTampilkanGrafikState] = useState(() => ambilTampilkanGrafikPola())
  const [idDetail, setIdDetail] = useState<string | null>(null)
  const [subLayar, setSubLayar] = useState<SubLayar>('daftar')
  const [menuTerbuka, setMenuTerbuka] = useState(false)
  const [kartuDipilih, setKartuDipilih] = useState<Keputusan | null>(null)
  const [konfirmasiHapusTerbuka, setKonfirmasiHapusTerbuka] = useState(false)

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

  function handleLanjutKeTujuan() {
    if (!kartuDipilih) return
    const k = kartuDipilih
    setKartuDipilih(null)
    if (k.status === 'menunggu_direview') {
      onPilihPending(k.id)
    } else {
      setIdDetail(k.id)
    }
  }

  function handleBatalHapus() {
    setKonfirmasiHapusTerbuka(false)
    setKartuDipilih(null)
  }

  function handleKonfirmasiHapus() {
    if (!kartuDipilih) return
    hapusKeputusan(kartuDipilih.id)
    setSemua((prev) => prev.filter((k) => k.id !== kartuDipilih.id))
    setKonfirmasiHapusTerbuka(false)
    setKartuDipilih(null)
  }

  if (idDetail) {
    const detail = semua.find((k) => k.id === idDetail)
    if (detail) {
      return (
        <DetailKeputusan
          keputusan={detail}
          onKembali={() => setIdDetail(null)}
          onUpdateKeputusan={(updated) =>
            setSemua((prev) => prev.map((k) => (k.id === updated.id ? updated : k)))
          }
        />
      )
    }
  }

  if (subLayar === 'cadangkan') {
    return <CadangkanData onKembali={() => setSubLayar('daftar')} />
  }

  if (subLayar === 'pulihkan') {
    return <PulihkanData onKembali={() => setSubLayar('daftar')} onSelesai={onKembali} />
  }

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
        <button
          type="button"
          onClick={() => setMenuTerbuka(true)}
          aria-label="Menu cadangkan & pulihkan data"
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
          ⋮
        </button>
      </div>

      <BottomSheet terbuka={menuTerbuka} onTutup={() => setMenuTerbuka(false)}>
        <Button
          variant="secondary"
          onClick={() => {
            setMenuTerbuka(false)
            setSubLayar('cadangkan')
          }}
        >
          Cadangkan Data
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            setMenuTerbuka(false)
            setSubLayar('pulihkan')
          }}
        >
          Pulihkan Data
        </Button>
      </BottomSheet>

      <div>
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
          Riwayat ini bukan rapor buat menilai kamu. Ini buat bantu kamu liat pola cara berpikirmu dari waktu ke
          waktu.
        </p>
        <p style={{ margin: '8px 0 0', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
          ⚠️ Data ini cuma tersimpan di HP kamu. Install ulang app atau hapus data browser bisa menghilangkan
          riwayat ini.{' '}
          <button
            type="button"
            onClick={() => setSubLayar('cadangkan')}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: 'var(--color-accent)',
              fontWeight: 600,
              fontSize: 'inherit',
              fontFamily: 'inherit',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Cadangkan Data
          </button>{' '}
          sekarang biar aman.
        </p>
      </div>

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
        <div
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            background: 'var(--color-surface)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            paddingTop: 12,
            paddingBottom: 12,
          }}
        >
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
        {tampilkanGrafik && (
          <>
            <GrafikKalibrasi data={terfilter} />
            <RefleksiGrafik />
          </>
        )}
        <InsightPola daftar={terfilter} labelKategori={filter} />

        <div style={{ marginTop: 16 }}>
          <p style={{ margin: '0 0 12px', fontWeight: 600 }}>Daftar keputusan</p>
          {terfilter.length === 0 ? (
            <p style={{ color: 'var(--color-ink-muted)' }}>Belum ada keputusan di kategori ini.</p>
          ) : (
            <div>
              {terfilter.map((k, index) => (
                <KartuRiwayat
                  key={k.id}
                  keputusan={k}
                  onTap={() => setKartuDipilih(k)}
                  tanpaGarisBawah={index === terfilter.length - 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomSheet
        terbuka={kartuDipilih !== null && !konfirmasiHapusTerbuka}
        onTutup={() => setKartuDipilih(null)}
      >
        <Button variant="secondary" onClick={handleLanjutKeTujuan}>
          {kartuDipilih?.status === 'menunggu_direview' ? 'Cek Hasil Sekarang' : 'Lihat Detail'}
        </Button>
        <Button variant="secondary" onClick={() => setKonfirmasiHapusTerbuka(true)}>
          Hapus Keputusan Ini
        </Button>
      </BottomSheet>

      <BottomSheet terbuka={konfirmasiHapusTerbuka} onTutup={handleBatalHapus}>
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          Yakin mau hapus keputusan ini? Tindakan ini tidak bisa dibatalkan.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Button variant="secondary" onClick={handleBatalHapus}>
              Batal
            </Button>
          </div>
          <div style={{ flex: 1 }}>
            <Button variant="secondary" onClick={handleKonfirmasiHapus}>
              Ya
            </Button>
          </div>
        </div>
      </BottomSheet>
    </Screen>
  )
}

export default RiwayatPola
