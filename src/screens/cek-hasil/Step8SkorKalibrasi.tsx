import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { cariInsightPola, hitungSkorKalibrasi } from '../../lib/kalibrasi'
import { labelStyle, nudgeCardStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'

const EMOJI_HASIL: Record<NonNullable<Keputusan['hasilAktual']>, string> = {
  Berhasil: '✅',
  Campuran: '🔶',
  'Tidak berhasil': '❌',
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

  return (
    <StepScreen step={8} totalSteps={9} onKembali={onKembali}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0 }}>Prediksimu dulu: {keputusan.keyakinanAwal}% yakin</p>
        <p style={{ margin: 0 }}>
          Hasil aktual: {hasilAktual} {EMOJI_HASIL[hasilAktual]}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>Kalibrasimu: {skorKalibrasi}</p>
          <Tooltip
            istilah="Skor Kalibrasi"
            isi="Ini bandingin seberapa yakin kamu dulu vs apa yang beneran terjadi. Semakin dekat, semakin 'kenal diri sendiri' cara mikirmu."
          />
        </div>
      </div>

      {insight && (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>
            {insight.jumlah} keputusan terakhir soal {insight.kategori}, rata-rata keyakinanmu{' '}
            {Math.round(insight.rataKeyakinan)}%{' '}
            {insight.arah === 'terlalu_yakin'
              ? `tapi hasil berhasil cuma ${Math.round(insight.tingkatKeberhasilan)}%. Kamu cenderung terlalu yakin soal ${insight.kategori}.`
              : `padahal hasil berhasil sampai ${Math.round(insight.tingkatKeberhasilan)}%. Kamu cenderung kurang yakin soal ${insight.kategori}.`}
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
