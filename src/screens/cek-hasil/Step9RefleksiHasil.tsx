import { useState } from 'react'
import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import { labelStyle, textInputStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'

export interface RefleksiJawaban {
  apaYangBikinBegini: string
  prosesYangMembantuAtauKurang: string
  perasaanSekarang: string
  halYangBedaKedepan: string
}

interface Step9Props {
  hasilAktual: NonNullable<Keputusan['hasilAktual']>
  onSelesai: (refleksi: RefleksiJawaban) => void
  onKembali: () => void
}

function Step9RefleksiHasil({ hasilAktual, onSelesai, onKembali }: Step9Props) {
  const [jawaban, setJawaban] = useState<RefleksiJawaban>({
    apaYangBikinBegini: '',
    prosesYangMembantuAtauKurang: '',
    perasaanSekarang: '',
    halYangBedaKedepan: '',
  })

  function update(partial: Partial<RefleksiJawaban>) {
    setJawaban((prev) => ({ ...prev, ...partial }))
  }

  return (
    <StepScreen step={9} totalSteps={9} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Apa yang bikin ini {hasilAktual.toLowerCase()}?</p>
        <textarea
          value={jawaban.apaYangBikinBegini}
          onChange={(e) => update({ apaYangBikinBegini: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div>
        <p style={labelStyle}>
          Kalau kamu ulang proses mikirnya, bagian mana yang paling nolong? Bagian mana yang kurang?
        </p>
        <textarea
          value={jawaban.prosesYangMembantuAtauKurang}
          onChange={(e) => update({ prosesYangMembantuAtauKurang: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div>
        <p style={labelStyle}>Gimana perasaanmu sekarang soal ini, dibanding waktu pertama kali nulis?</p>
        <textarea
          value={jawaban.perasaanSekarang}
          onChange={(e) => update({ perasaanSekarang: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div>
        <p style={labelStyle}>Kalau ketemu situasi serupa lagi, 1 hal apa yang mau kamu lakukan beda?</p>
        <textarea
          value={jawaban.halYangBedaKedepan}
          onChange={(e) => update({ halYangBedaKedepan: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <Button variant="primary" onClick={() => onSelesai(jawaban)}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step9RefleksiHasil
