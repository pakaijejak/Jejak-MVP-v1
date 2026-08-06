import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import { labelStyle, textInputStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'
import type { KeputusanDraft } from './types'

const KATEGORI_LIST: Keputusan['kategori'][] = ['Karier', 'Uang', 'Relasi', 'Kesehatan', 'Lainnya']

interface Step2Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step2RumuskanMasalah({ draft, onUpdate, onLanjut, onKembali }: Step2Props) {
  const bisaLanjut = draft.masalah.trim().length > 0 && Boolean(draft.kategori)

  return (
    <StepScreen step={2} totalSteps={6} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Keputusan apa yang lagi kamu hadapi?</p>
        <textarea
          value={draft.masalah}
          onChange={(e) => onUpdate({ masalah: e.target.value })}
          placeholder="Misal: Saya bingung lanjut kerja di kantor sekarang atau resign untuk coba peluang baru."
          rows={4}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div>
        <p style={labelStyle}>Ini soal apa?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
          {KATEGORI_LIST.map((kategori) => (
            <Chip
              key={kategori}
              label={kategori}
              selected={draft.kategori === kategori}
              onClick={() => onUpdate({ kategori })}
            />
          ))}
        </div>
      </div>

      <Button variant="primary" onClick={onLanjut} disabled={!bisaLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step2RumuskanMasalah
