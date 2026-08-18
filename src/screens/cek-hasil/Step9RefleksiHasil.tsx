import { useState } from 'react'
import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import { labelStyle, textInputStyle } from '../../styles/formStyles'

export interface RefleksiJawaban {
  apaYangBikinBegini: string
  prosesYangMembantuAtauKurang: string
  perasaanSekarang: string
  halYangBedaKedepan: string
  kekhawatiranTerbukti: string
  metaRefleksi?: string
}

interface Step9Props {
  onSelesai: (refleksi: RefleksiJawaban) => void
  onKembali: () => void
}

function Step9RefleksiHasil({ onSelesai, onKembali }: Step9Props) {
  const [jawaban, setJawaban] = useState({
    apaYangBikinBegini: '',
    prosesYangMembantuAtauKurang: '',
    perasaanSekarang: '',
    halYangBedaKedepan: '',
    kekhawatiranTerbukti: '',
  })
  const [metaRefleksi, setMetaRefleksi] = useState('')
  const [terbukaMeta, setTerbukaMeta] = useState(false)

  function update(partial: Partial<typeof jawaban>) {
    setJawaban((prev) => ({ ...prev, ...partial }))
  }

  function handleSelesai() {
    onSelesai({
      ...jawaban,
      metaRefleksi: metaRefleksi.trim() || undefined,
    })
  }

  return (
    <StepScreen step={9} totalSteps={9} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Apa yang bikin hasilnya seperti ini?</p>
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

      <div>
        <p style={labelStyle}>Apakah kekhawatiranmu terbukti?</p>
        <textarea
          value={jawaban.kekhawatiranTerbukti}
          onChange={(e) => update({ kekhawatiranTerbukti: e.target.value })}
          placeholder="Misal: kekhawatiran atau asumsi yang kamu tulis di awal (Step 2-3)"
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div style={{ border: '1px solid var(--color-ink-muted)', borderRadius: 12, padding: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Mau gali lebih dalam? (opsional)</p>
          <button
            type="button"
            onClick={() => setTerbukaMeta((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-accent)',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
          >
            {terbukaMeta ? 'Tutup' : 'Tap untuk buka'}
          </button>
        </div>
        {terbukaMeta && (
          <div style={{ marginTop: 12 }}>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              Dari semua pertanyaan tadi, mana yang paling susah kamu jawab? Kenapa?
            </p>
            <textarea
              value={metaRefleksi}
              onChange={(e) => setMetaRefleksi(e.target.value)}
              rows={3}
              style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
            />
          </div>
        )}
      </div>

      <Button variant="primary" onClick={handleSelesai}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step9RefleksiHasil
