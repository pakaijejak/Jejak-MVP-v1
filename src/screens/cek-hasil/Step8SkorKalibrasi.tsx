import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import {
  KALIMAT_GAP_KALIBRASI,
  KALIMAT_REASSURANCE_KALIBRASI,
  cariInsightPola,
  hitungSkorKalibrasi,
} from '../../lib/kalibrasi'
import { nudgeCardStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'

interface Step8Props {
  keputusan: Keputusan
  hasilPersen: number
  onLanjut: () => void
  onKembali: () => void
}

function Step8SkorKalibrasi({ keputusan, hasilPersen, onLanjut, onKembali }: Step8Props) {
  const skorKalibrasi = hitungSkorKalibrasi(keputusan.keyakinanAwal, hasilPersen)
  const insight = cariInsightPola(keputusan.kategori)
  const kalimatReassurance = KALIMAT_REASSURANCE_KALIBRASI[skorKalibrasi]

  return (
    <StepScreen step={8} totalSteps={9} onKembali={onKembali}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0 }}>Kamu bilang {keputusan.keyakinanAwal}% yakin ini bakal berhasil.</p>
        <p style={{ margin: 0 }}>Hasilnya, {hasilPersen}% sesuai harapanmu.</p>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ margin: 0 }}>{KALIMAT_GAP_KALIBRASI[skorKalibrasi]}</p>
          <Tooltip
            istilah="Skor Kalibrasi"
            isi="Ini bandingin seberapa yakin kamu dulu vs apa yang beneran terjadi. Semakin dekat, semakin 'kenal diri sendiri' cara mikirmu."
          />
        </div>

        {kalimatReassurance && (
          <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>{kalimatReassurance}</p>
        )}
      </div>

      {insight && (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>
            {insight.jumlah} keputusan terakhir soal {insight.kategori}, rata-rata keyakinanmu{' '}
            {Math.round(insight.rataKeyakinan)}%{' '}
            {insight.arah === 'terlalu_yakin'
              ? `tapi rata-rata hasilnya cuma ${Math.round(insight.rataHasil)}% sesuai harapan. Yakinmu di kategori ${insight.kategori} ini cenderung lebih tinggi dari hasilnya.`
              : `padahal rata-rata hasilnya sampai ${Math.round(insight.rataHasil)}% sesuai harapan. Hasil di kategori ${insight.kategori} ini cenderung lebih baik dari yakinmu.`}
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
