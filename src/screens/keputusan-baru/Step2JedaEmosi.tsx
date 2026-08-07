import { useState } from 'react'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { labelStyle, nudgeCardStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'
import { INTI_NEGATIF, RODA_PERASAAN } from './rodaPerasaan'
import type { KeputusanDraft } from './types'

const EMOSI_TETAP = ['Cemas', 'Bingung', 'Marah', 'Sedih', 'Netral', 'Bersemangat']
const EMOSI_TETAP_NEGATIF = ['Cemas', 'Bingung', 'Marah', 'Sedih']
const INTENSITAS_LIST: Keputusan['intensitasEmosi'][] = ['Ringan', 'Sedang', 'Kuat']

interface Step2Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

interface StateWheel {
  modeWheel: boolean
  intiIndex: number | null
  cabangIndex: number | null
  negatif: boolean
}

function cariStateAwal(emosi: string | undefined): StateWheel {
  const kosong: StateWheel = { modeWheel: false, intiIndex: null, cabangIndex: null, negatif: false }
  if (!emosi) return kosong

  if (EMOSI_TETAP.includes(emosi)) {
    return { ...kosong, negatif: EMOSI_TETAP_NEGATIF.includes(emosi) }
  }

  for (let i = 0; i < RODA_PERASAAN.length; i++) {
    const inti = RODA_PERASAAN[i]
    if (inti.inti === emosi) {
      return { modeWheel: true, intiIndex: i, cabangIndex: null, negatif: INTI_NEGATIF.includes(inti.inti) }
    }
    for (let j = 0; j < inti.cabang.length; j++) {
      const c = inti.cabang[j]
      if (c.cabang === emosi || c.daun === emosi) {
        return { modeWheel: true, intiIndex: i, cabangIndex: j, negatif: INTI_NEGATIF.includes(inti.inti) }
      }
    }
  }

  return kosong
}

function Step2JedaEmosi({ draft, onUpdate, onLanjut, onKembali }: Step2Props) {
  const [state, setState] = useState<StateWheel>(() => cariStateAwal(draft.emosi))

  const bisaLanjut = Boolean(draft.emosi && draft.intensitasEmosi)
  const emosiKuatNegatif = draft.intensitasEmosi === 'Kuat' && state.negatif

  function pilihTetap(emosi: string) {
    setState({ modeWheel: false, intiIndex: null, cabangIndex: null, negatif: EMOSI_TETAP_NEGATIF.includes(emosi) })
    onUpdate({ emosi })
  }

  function bukaWheel() {
    setState({ modeWheel: true, intiIndex: null, cabangIndex: null, negatif: false })
    onUpdate({ emosi: undefined })
  }

  function pilihInti(index: number) {
    const inti = RODA_PERASAAN[index]
    setState({ modeWheel: true, intiIndex: index, cabangIndex: null, negatif: INTI_NEGATIF.includes(inti.inti) })
    onUpdate({ emosi: inti.inti })
  }

  function pilihCabang(index: number) {
    if (state.intiIndex === null) return
    setState((prev) => ({ ...prev, cabangIndex: index }))
    onUpdate({ emosi: RODA_PERASAAN[state.intiIndex].cabang[index].cabang })
  }

  function pilihDaun() {
    if (state.intiIndex === null || state.cabangIndex === null) return
    onUpdate({ emosi: RODA_PERASAAN[state.intiIndex].cabang[state.cabangIndex].daun })
  }

  const intiAktif = state.intiIndex !== null ? RODA_PERASAAN[state.intiIndex] : null
  const cabangAktif = intiAktif && state.cabangIndex !== null ? intiAktif.cabang[state.cabangIndex] : null

  return (
    <StepScreen step={2} totalSteps={6} onKembali={onKembali}>
      <p style={labelStyle}>Lagi ngerasa apa soal keputusan ini?</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {EMOSI_TETAP.map((emosi) => (
          <Chip
            key={emosi}
            label={emosi}
            selected={!state.modeWheel && draft.emosi === emosi}
            onClick={() => pilihTetap(emosi)}
          />
        ))}
        <Chip label="Lainnya" selected={state.modeWheel} onClick={bukaWheel} />
      </div>

      {state.modeWheel && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {RODA_PERASAAN.map((inti, index) => (
            <Chip
              key={inti.inti}
              label={inti.inti}
              selected={state.intiIndex === index}
              onClick={() => pilihInti(index)}
            />
          ))}
        </div>
      )}

      {intiAktif && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {intiAktif.cabang.map((c, index) => (
            <Chip
              key={index}
              label={c.cabang}
              selected={state.cabangIndex === index}
              onClick={() => pilihCabang(index)}
            />
          ))}
        </div>
      )}

      {cabangAktif && (
        <div>
          <Chip label={cabangAktif.daun} selected={draft.emosi === cabangAktif.daun} onClick={pilihDaun} />
        </div>
      )}

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
