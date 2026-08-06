import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { labelStyle, nudgeCardStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'
import type { KeputusanDraft } from './types'

const EMOSI_LIST: Keputusan['emosi'][] = ['Cemas', 'Bingung', 'Marah', 'Sedih', 'Netral', 'Bersemangat']
const INTENSITAS_LIST: Keputusan['intensitasEmosi'][] = ['Ringan', 'Sedang', 'Kuat']
const EMOSI_NEGATIF: Keputusan['emosi'][] = ['Cemas', 'Bingung', 'Marah', 'Sedih']

interface Step2Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step2JedaEmosi({ draft, onUpdate, onLanjut, onKembali }: Step2Props) {
  const bisaLanjut = Boolean(draft.emosi && draft.intensitasEmosi)
  const emosiKuatNegatif =
    draft.intensitasEmosi === 'Kuat' && draft.emosi !== undefined && EMOSI_NEGATIF.includes(draft.emosi)

  return (
    <StepScreen step={2} totalSteps={6} onKembali={onKembali}>
      <p style={labelStyle}>Lagi ngerasa apa soal keputusan ini?</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {EMOSI_LIST.map((emosi) => (
          <Chip key={emosi} label={emosi} selected={draft.emosi === emosi} onClick={() => onUpdate({ emosi })} />
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>Seberapa kuat?</p>
          <Tooltip
            istilah="Affect Labeling"
            isi="Sekadar menyebut nama emosimu ('saya lagi cemas') terbukti bikin otak lebih tenang dan lebih siap mikir jernih. Makanya kita mulai dari sini."
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          {INTENSITAS_LIST.map((intensitas) => (
            <Chip
              key={intensitas}
              label={intensitas}
              selected={draft.intensitasEmosi === intensitas}
              onClick={() => onUpdate({ intensitasEmosi: intensitas })}
            />
          ))}
        </div>
      </div>

      {emosiKuatNegatif && (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>
            Emosi kamu lagi cukup kuat. Nggak masalah lanjut sekarang, tapi kalau bisa ditunda, coba tunda dulu ya.
          </p>
        </div>
      )}

      <Button variant="primary" onClick={onLanjut} disabled={!bisaLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step2JedaEmosi
