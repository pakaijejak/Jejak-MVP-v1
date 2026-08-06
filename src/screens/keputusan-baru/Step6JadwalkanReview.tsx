import { useState } from 'react'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import { labelStyle, textInputStyle } from '../../styles/formStyles'

type PilihanCepat = '1minggu' | '1bulan' | '3bulan' | 'sendiri'

interface Step6Props {
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

function Step6JadwalkanReview({ onSimpan, onSelesai, onKembali }: Step6Props) {
  const [pilihan, setPilihan] = useState<PilihanCepat | null>(null)
  const [tanggalManual, setTanggalManual] = useState('')
  const [tersimpan, setTersimpan] = useState(false)
  const [tanggalTersimpan, setTanggalTersimpan] = useState<Date | null>(null)

  const tanggalTerhitung = pilihan ? hitungTanggal(pilihan, tanggalManual) : null
  const bisaSimpan = tanggalTerhitung !== null

  function handleKlikSimpan() {
    if (!tanggalTerhitung) return
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
            onChange={(e) => setTanggalManual(e.target.value)}
            style={{ ...textInputStyle, marginTop: 12 }}
          />
        )}
      </div>

      <Button variant="primary" onClick={handleKlikSimpan} disabled={!bisaSimpan}>
        Selesai & Simpan
      </Button>
    </StepScreen>
  )
}

export default Step6JadwalkanReview
