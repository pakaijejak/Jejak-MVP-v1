import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { cariInsightPola, hitungSkorKalibrasi } from '../../lib/kalibrasi'
import type { Keputusan } from '../../types/keputusan'

type SkorKalibrasi = NonNullable<Keputusan['skorKalibrasi']>

const IKON_HASIL: Record<NonNullable<Keputusan['hasilAktual']>, { simbol: string; warna?: string }> = {
  Berhasil: { simbol: '✅' },
  Campuran: { simbol: '🔶' },
  'Tidak berhasil': { simbol: '○', warna: 'var(--color-ink-muted)' },
}

const KALIMAT_GAP: Record<SkorKalibrasi, string> = {
  'Cukup Akurat': 'Prediksimu deket banget sama kenyataan.',
  'Terlalu Yakin': 'Yakinmu waktu itu lebih tinggi dari hasilnya.',
  'Kurang Yakin': 'Hasilnya ternyata lebih baik dari yang kamu kira.',
}

const KALIMAT_PENENANG: Partial<Record<SkorKalibrasi, string>> = {
  'Terlalu Yakin':
    'Wajar kok, hampir semua orang begini. Menyadarinya aja udah jadi langkah maju buat keputusan berikutnya.',
  'Kurang Yakin': 'Ini juga informasi berguna, biar makin pas nebak keyakinan di lain waktu.',
}

interface Step8Props {
  keputusan: Keputusan
  hasilAktual: NonNullable<Keputusan['hasilAktual']>
  onLanjut: () => void
  onKembali: () => void
}

function Step8SkorKalibrasi({ keputusan, hasilAktual, onLanjut, onKembali }: Step8Props) {
  const skorKalibrasi = hitungSkorKalibrasi(keputusan.keyakinanAwal, hasilAktual)
  const insight = cariInsightPola(keputusan.kategori)
  const ikon = IKON_HASIL[hasilAktual]
  const kalimatPenenang = KALIMAT_PENENANG[skorKalibrasi]

  return (
    <StepScreen step={8} totalSteps={9} onKembali={onKembali}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0 }}>Kamu bilang {keputusan.keyakinanAwal}% yakin soal ini.</p>
        <p style={{ margin: 0 }}>
          Hasilnya {hasilAktual.toLowerCase()}. <span style={{ color: ikon.warna }}>{ikon.simbol}</span>
        </p>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ margin: 0 }}>{KALIMAT_GAP[skorKalibrasi]}</p>
          <Tooltip
            istilah="Skor Kalibrasi"
            isi="Ini bandingin seberapa yakin kamu dulu vs apa yang beneran terjadi. Semakin dekat, semakin 'kenal diri sendiri' cara mikirmu."
          />
        </div>

        {kalimatPenenang && <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>{kalimatPenenang}</p>}
      </div>

      {insight && (
        <div
          style={{
            background: 'rgba(193, 121, 63, 0.12)',
            border: '1px solid var(--color-accent)',
            borderRadius: 12,
            padding: 16,
          }}
        >
          <p style={{ margin: 0 }}>
            {insight.jumlah} keputusan terakhir soal {insight.kategori}, rata-rata keyakinanmu{' '}
            {Math.round(insight.rataKeyakinan)}%{' '}
            {insight.arah === 'terlalu_yakin'
              ? `tapi hasil berhasil cuma ${Math.round(insight.tingkatKeberhasilan)}%. Yakinmu di kategori ${insight.kategori} ini cenderung lebih tinggi dari hasilnya.`
              : `padahal hasil berhasil sampai ${Math.round(insight.tingkatKeberhasilan)}%. Hasil di kategori ${insight.kategori} ini cenderung lebih baik dari yakinmu.`}
          </p>
        </div>
      )}

      <Button variant="primary" onClick={onLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step8SkorKalibrasi
