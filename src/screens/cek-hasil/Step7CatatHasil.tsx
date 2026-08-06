import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import { labelStyle, textInputStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'

const HASIL_LIST: NonNullable<Keputusan['hasilAktual']>[] = ['Berhasil', 'Campuran', 'Tidak berhasil']

interface Step7Props {
  hasilAktual?: Keputusan['hasilAktual']
  catatanHasil: string
  onUpdate: (partial: { hasilAktual?: Keputusan['hasilAktual']; catatanHasil?: string }) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step7CatatHasil({ hasilAktual, catatanHasil, onUpdate, onLanjut, onKembali }: Step7Props) {
  const bisaLanjut = Boolean(hasilAktual)

  return (
    <StepScreen step={7} totalSteps={9} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Gimana hasilnya?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
          {HASIL_LIST.map((hasil) => (
            <Chip
              key={hasil}
              label={hasil}
              selected={hasilAktual === hasil}
              onClick={() => onUpdate({ hasilAktual: hasil })}
            />
          ))}
        </div>
      </div>

      <div>
        <p style={labelStyle}>Catatan singkat (opsional):</p>
        <textarea
          value={catatanHasil}
          onChange={(e) => onUpdate({ catatanHasil: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <Button variant="primary" onClick={onLanjut} disabled={!bisaLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step7CatatHasil
