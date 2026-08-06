import { useState } from 'react'
import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import { labelStyle, textInputStyle } from '../../styles/formStyles'

interface Step7Props {
  hasilPersen?: number
  catatanHasil: string
  onUpdate: (partial: { hasilPersen?: number; catatanHasil?: string }) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step7CatatHasil({ hasilPersen, catatanHasil, onUpdate, onLanjut, onKembali }: Step7Props) {
  const [tersentuh, setTersentuh] = useState(hasilPersen !== undefined)
  const nilai = hasilPersen ?? 50
  const bisaLanjut = tersentuh

  function handleSlider(value: number) {
    setTersentuh(true)
    onUpdate({ hasilPersen: value })
  }

  return (
    <StepScreen step={7} totalSteps={9} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Menurutmu, hasilnya gimana?</p>
        <p style={{ textAlign: 'center', fontSize: '1.5rem', fontWeight: 700, margin: '16px 0 0' }}>{nilai}%</p>
        <input
          type="range"
          min={0}
          max={100}
          value={nilai}
          onChange={(e) => handleSlider(Number(e.target.value))}
          style={{ width: '100%', marginTop: 8, accentColor: 'var(--color-accent)' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.8rem',
            color: 'var(--color-ink-muted)',
          }}
        >
          <span>Meleset dari harapan</span>
          <span>Sesuai harapan</span>
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
