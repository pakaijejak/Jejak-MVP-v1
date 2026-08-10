import { useState } from 'react'
import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { labelStyle, nudgeCardStyle, textInputStyle } from '../../styles/formStyles'
import type { KeputusanDraft } from './types'

interface Step3Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step3CekFakta({ draft, onUpdate, onLanjut, onKembali }: Step3Props) {
  const [tampilkanNudge, setTampilkanNudge] = useState(false)

  const bisaLanjut = draft.infoYangDimiliki.trim().length > 0 && draft.sudahCekPandanganBerbeda !== undefined

  function pilihSudah() {
    onUpdate({ sudahCekPandanganBerbeda: true })
    setTampilkanNudge(false)
  }

  function pilihBelum() {
    onUpdate({ sudahCekPandanganBerbeda: false })
    setTampilkanNudge(true)
  }

  return (
    <StepScreen step={3} totalSteps={6} onKembali={onKembali}>
      <div>
        <p style={labelStyle}>Info apa yang sudah kamu punya soal ini?</p>
        <textarea
          value={draft.infoYangDimiliki}
          onChange={(e) => onUpdate({ infoYangDimiliki: e.target.value })}
          rows={4}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>
            Keyakinan apa yang kamu anggap pasti benar soal ini, padahal belum tentu? (opsional)
          </p>
          <Tooltip
            istilah="Asumsi Tersembunyi"
            isi="Otak kita sering menganggap sesuatu pasti benar tanpa sadar itu cuma asumsi. Menyadari ini, bikin kamu lihat opsi yang tadinya nggak kepikiran."
          />
        </div>
        <textarea
          value={draft.asumsiYangDianggapPasti ?? ''}
          onChange={(e) => onUpdate({ asumsiYangDianggapPasti: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical', marginTop: 8 }}
        />
      </div>

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>
            Sudah cari pandangan yang BERTENTANGAN dengan pendapatmu?
          </p>
          <Tooltip
            istilah="Bias Konfirmasi"
            isi="Otak kita secara alami suka cari info yang mendukung apa yang sudah kita yakini duluan, dan mengabaikan yang bertentangan. Makanya penting sengaja cari sudut pandang yang beda."
          />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <Chip label="Sudah" selected={draft.sudahCekPandanganBerbeda === true} onClick={pilihSudah} />
          <Chip label="Belum" selected={draft.sudahCekPandanganBerbeda === false} onClick={pilihBelum} />
        </div>
      </div>

      {tampilkanNudge && (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>
            Coba cari 1 sumber/pendapat yang beda dulu, biar keputusanmu lebih seimbang.
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Button variant="secondary" onClick={() => setTampilkanNudge(false)}>
                Saya cari dulu
              </Button>
            </div>
            <div style={{ flex: 1 }}>
              <Button variant="secondary" onClick={onLanjut}>
                Lanjut saja
              </Button>
            </div>
          </div>
        </div>
      )}

      <Button variant="primary" onClick={onLanjut} disabled={!bisaLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step3CekFakta
