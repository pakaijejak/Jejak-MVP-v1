import { useState } from 'react'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import { buatKontenIcs, bukaIcs } from '../../lib/generateIcs'
import { labelStyle, textInputStyle } from '../../styles/formStyles'

type PilihanCepat = '1minggu' | '1bulan' | '3bulan' | 'sendiri'

interface Step6Props {
  masalah: string
  onSimpan: (tanggalTargetReview: string) => void
  onSelesai: () => void
  onKembali: () => void
}

function hitungTanggal(pilihan: PilihanCepat, tanggalManual: string): Date | null {
  const hasil = new Date()
  if (pilihan === '1minggu') {
    hasil.setDate(hasil.getDate() + 7)
    return hasil
  }
  if (pilihan === '1bulan') {
    hasil.setMonth(hasil.getMonth() + 1)
    return hasil
  }
  if (pilihan === '3bulan') {
    hasil.setMonth(hasil.getMonth() + 3)
    return hasil
  }
  if (pilihan === 'sendiri' && tanggalManual) {
    return new Date(`${tanggalManual}T00:00:00`)
  }
  return null
}

function formatTanggal(tanggal: Date): string {
  return tanggal.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function tanggalKeString(tanggal: Date): string {
  const tahun = tanggal.getFullYear()
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0')
  const hari = String(tanggal.getDate()).padStart(2, '0')
  return `${tahun}-${bulan}-${hari}`
}

function tanggalBukanMasaLalu(tanggal: Date): boolean {
  const hariIni = new Date()
  const tanggalTanpaJam = new Date(tanggal.getFullYear(), tanggal.getMonth(), tanggal.getDate())
  const hariIniTanpaJam = new Date(hariIni.getFullYear(), hariIni.getMonth(), hariIni.getDate())
  return tanggalTanpaJam.getTime() >= hariIniTanpaJam.getTime()
}

function Step6JadwalkanReview({ masalah, onSimpan, onSelesai, onKembali }: Step6Props) {
  const [pilihan, setPilihan] = useState<PilihanCepat | null>(null)
  const [tanggalManual, setTanggalManual] = useState('')
  const [tersimpan, setTersimpan] = useState(false)
  const [tanggalTersimpan, setTanggalTersimpan] = useState<Date | null>(null)
  const [pesanError, setPesanError] = useState('')
  const [tampilkanPanduanKalender, setTampilkanPanduanKalender] = useState(false)

  const tanggalTerhitung = pilihan ? hitungTanggal(pilihan, tanggalManual) : null
  const bisaSimpan = tanggalTerhitung !== null
  const tanggalMinimal = tanggalKeString(new Date())

  function handleTambahKeKalender() {
    if (!tanggalTerhitung) return
    const konten = buatKontenIcs(masalah, tanggalTerhitung)
    bukaIcs(konten)
    setTampilkanPanduanKalender(true)
  }

  function handleKlikSimpan() {
    if (!tanggalTerhitung) return

    if (!tanggalBukanMasaLalu(tanggalTerhitung)) {
      setPesanError('Tanggal cek ulang tidak boleh di masa lalu. Pilih hari ini atau tanggal setelahnya.')
      return
    }

    setPesanError('')
    onSimpan(tanggalTerhitung.toISOString())
    setTanggalTersimpan(tanggalTerhitung)
    setTersimpan(true)
    setTimeout(onSelesai, 1500)
  }

  if (tersimpan && tanggalTersimpan) {
    return (
      <StepScreen step={6} totalSteps={6} onKembali={onKembali}>
        <p style={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
          Tersimpan! Nanti kalau kamu buka app lagi setelah {formatTanggal(tanggalTersimpan)}, kita tunjukkan di
          Beranda.
        </p>
      </StepScreen>
    )
  }

  return (
    <StepScreen step={6} totalSteps={6} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Kapan sebaiknya kita cek lagi hasilnya?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
          <Chip label="1 minggu" selected={pilihan === '1minggu'} onClick={() => setPilihan('1minggu')} />
          <Chip label="1 bulan" selected={pilihan === '1bulan'} onClick={() => setPilihan('1bulan')} />
          <Chip label="3 bulan" selected={pilihan === '3bulan'} onClick={() => setPilihan('3bulan')} />
          <Chip label="Atur sendiri" selected={pilihan === 'sendiri'} onClick={() => setPilihan('sendiri')} />
        </div>
        <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.85rem', marginTop: 8 }}>
          usulan otomatis berdasarkan skala keputusan
        </p>

        {pilihan === 'sendiri' && (
          <input
            type="date"
            value={tanggalManual}
            min={tanggalMinimal}
            onChange={(e) => {
              setTanggalManual(e.target.value)
              setPesanError('')
            }}
            style={{ ...textInputStyle, marginTop: 12 }}
          />
        )}

        {pesanError && (
          <p style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginTop: 12 }}>{pesanError}</p>
        )}

        {bisaSimpan && (
          <div style={{ marginTop: 16 }}>
            <Button variant="secondary" onClick={handleTambahKeKalender}>
              Tambahkan ke Kalender
            </Button>
          </div>
        )}
      </div>

      <Button variant="primary" onClick={handleKlikSimpan} disabled={!bisaSimpan}>
        Selesai & Simpan
      </Button>

      <BottomSheet terbuka={tampilkanPanduanKalender} onTutup={() => setTampilkanPanduanKalender(false)}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>File Kalender Disiapkan</h3>
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
          File kalender sudah disiapkan. Kalau tidak langsung kebuka, cek notifikasi "Download selesai" di HP kamu,
          lalu tap filenya dan pilih app Kalender.
        </p>
        <button
          type="button"
          onClick={() => setTampilkanPanduanKalender(false)}
          style={{
            marginTop: 8,
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-ink)',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Tutup
        </button>
      </BottomSheet>
    </StepScreen>
  )
}

export default Step6JadwalkanReview
