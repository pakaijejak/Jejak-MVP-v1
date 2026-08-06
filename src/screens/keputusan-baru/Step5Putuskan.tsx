import { useState } from 'react'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { labelStyle } from '../../styles/formStyles'
import type { KeputusanDraft } from './types'

interface Step5Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step5Putuskan({ draft, onUpdate, onLanjut, onKembali }: Step5Props) {
  const [tersentuh, setTersentuh] = useState(draft.keyakinanAwal !== undefined)

  const keyakinan = draft.keyakinanAwal ?? 50
  const bisaLanjut = draft.opsiTerpilihIndex !== undefined && tersentuh

  function handleSlider(value: number) {
    setTersentuh(true)
    onUpdate({ keyakinanAwal: value })
  }

  return (
    <StepScreen step={5} totalSteps={6} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Dari opsi di atas, mana yang kamu pilih?</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 8 }}>
          {draft.opsi.map((o, index) => (
            <Chip
              key={index}
              label={o.teks || `Opsi ${index + 1}`}
              selected={draft.opsiTerpilihIndex === index}
              onClick={() => onUpdate({ opsiTerpilihIndex: index })}
            />
          ))}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>Seberapa yakin ini keputusan yang tepat?</p>
          <Tooltip
            istilah="Kalibrasi Keyakinan"
            isi="Rasa yakin itu gampang meleset dari kenyataan — banyak orang yakin 90% padahal hasilnya cuma benar separuhnya. Nilai jujur di sini, bukan yang 'kedengarannya pede'."
          />
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={keyakinan}
          onChange={(e) => handleSlider(Number(e.target.value))}
          style={{ width: '100%', marginTop: 12, accentColor: 'var(--color-accent)' }}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.85rem',
            color: 'var(--color-ink-muted)',
          }}
        >
          <span>0%</span>
          <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{keyakinan}%</span>
          <span>100%</span>
        </div>
      </div>

      <Button variant="primary" onClick={onLanjut} disabled={!bisaLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step5Putuskan
