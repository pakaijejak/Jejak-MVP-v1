import { useMemo, useState } from 'react'
import {
  type InsightKalibrasiAgregat,
  type InsightRisiko,
  hitungInsightKalibrasi,
  hitungInsightRisiko,
} from '../../lib/kalibrasi'
import { nudgeCardStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'

function kalimatKalibrasi(insight: InsightKalibrasiAgregat, labelKategori: string): string {
  const keyakinan = Math.round(insight.rataKeyakinan)
  const hasil = Math.round(insight.rataHasil)
  const soalKategori = labelKategori === 'Semua' ? '' : ` soal ${labelKategori}`
  const diKategori = labelKategori === 'Semua' ? 'belakangan ini' : `di kategori ${labelKategori} ini`

  if (insight.arah === 'terlalu_yakin') {
    return `${insight.jumlah} keputusan terakhir${soalKategori}, rata-rata keyakinanmu ${keyakinan}% tapi rata-rata hasilnya cuma ${hasil}% sesuai harapan. Yakinmu ${diKategori} cenderung lebih tinggi dari hasilnya.`
  }
  return `${insight.jumlah} keputusan terakhir${soalKategori}, rata-rata keyakinanmu ${keyakinan}% padahal rata-rata hasilnya sampai ${hasil}% sesuai harapan. Hasil ${diKategori} cenderung lebih baik dari yakinmu.`
}

function kalimatRisiko(insight: InsightRisiko): string {
  const arahTeks =
    insight.arah === 'lebih_tinggi' ? 'lebih tinggi' : insight.arah === 'lebih_rendah' ? 'lebih rendah' : 'deket-deket aja'
  return `Dari beberapa keputusan yang kamu tandai berisiko ${insight.level}, keyakinanmu di awal biasanya ${arahTeks} dari hasil yang sebenarnya terjadi.`
}

interface InsightPolaProps {
  daftar: Keputusan[]
  labelKategori: string
}

function InsightPola({ daftar, labelKategori }: InsightPolaProps) {
  const insightKalibrasi = useMemo(() => hitungInsightKalibrasi(daftar), [daftar])
  const insightRisiko = useMemo(() => hitungInsightRisiko(daftar), [daftar])
  const [risikoTerbuka, setRisikoTerbuka] = useState(false)

  if (!insightKalibrasi && !insightRisiko) return null

  return (
    <div style={{ marginTop: 16 }}>
      {insightKalibrasi && (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>{kalimatKalibrasi(insightKalibrasi, labelKategori)}</p>
        </div>
      )}

      {insightRisiko && (
        <div style={{ marginTop: insightKalibrasi ? 8 : 0 }}>
          {risikoTerbuka ? (
            <p style={{ margin: 0, color: 'var(--color-ink-muted)', fontSize: '0.9rem' }}>
              {kalimatRisiko(insightRisiko)}
            </p>
          ) : (
            <button
              type="button"
              onClick={() => setRisikoTerbuka(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--color-accent)',
                fontWeight: 600,
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Ada juga pola soal risiko yang bisa dilihat
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default InsightPola
