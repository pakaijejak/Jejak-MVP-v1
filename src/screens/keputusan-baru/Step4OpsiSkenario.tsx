import Button from '../../components/Button'
import Chip from '../../components/Chip'
import StepScreen from '../../components/StepScreen'
import Tooltip from '../../components/Tooltip'
import { labelStyle, textInputStyle } from '../../styles/formStyles'
import type { KeputusanDraft } from './types'

const LEVEL_RISIKO = ['Rendah', 'Sedang', 'Tinggi'] as const

const MAX_OPSI = 4
const MIN_OPSI = 2

interface Step4Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

function Step4OpsiSkenario({ draft, onUpdate, onLanjut, onKembali }: Step4Props) {
  const opsi = draft.opsi

  const bisaLanjut =
    opsi.length >= MIN_OPSI &&
    opsi.every((o) => o.teks.trim().length > 0 && o.skenarioTerburuk.trim().length > 0)

  function updateOpsi(index: number, partial: Partial<KeputusanDraft['opsi'][number]>) {
    const next = opsi.map((o, i) => (i === index ? { ...o, ...partial } : o))
    onUpdate({ opsi: next })
  }

  function updateRisiko(index: number, partial: Partial<NonNullable<KeputusanDraft['opsi'][number]['risiko']>>) {
    const risikoSaatIni = opsi[index].risiko ?? {}
    updateOpsi(index, { risiko: { ...risikoSaatIni, ...partial } })
  }

  function tambahOpsi() {
    if (opsi.length >= MAX_OPSI) return
    onUpdate({ opsi: [...opsi, { teks: '', skenarioTerburuk: '' }] })
  }

  function hapusOpsi(index: number) {
    if (opsi.length <= MIN_OPSI) return
    onUpdate({ opsi: opsi.filter((_, i) => i !== index) })
  }

  return (
    <StepScreen step={4} totalSteps={6} onKembali={onKembali}>
      <p style={labelStyle}>Tulis 2 sampai 3 opsi yang kamu pertimbangkan:</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <p style={{ ...labelStyle, margin: 0 }}>Pilihan Keputusan</p>
        {opsi.map((o, index) => (
          <div
            key={index}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ ...labelStyle, fontSize: '0.95rem' }}>Pilihan {index + 1}</p>
              {opsi.length > MIN_OPSI && (
                <button
                  type="button"
                  onClick={() => hapusOpsi(index)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--color-ink-muted)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                  }}
                >
                  Hapus
                </button>
              )}
            </div>
            <input
              value={o.teks}
              onChange={(e) => updateOpsi(index, { teks: e.target.value })}
              placeholder="Tulis opsi..."
              style={textInputStyle}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                Kalau opsi ini gagal, hal terburuk apa yang bisa terjadi? Bisa kamu tangani?
              </p>
              {index === 0 && (
                <Tooltip
                  istilah="Regret Minimization"
                  isi="Mikir dari sisi penyesalan, bukan cuma untung-rugi. Kadang pilihan yang 'secara matematis' terbaik bukan yang bikin kamu paling tenang kalau ternyata gagal."
                />
              )}
            </div>
            <textarea
              value={o.skenarioTerburuk}
              onChange={(e) => updateOpsi(index, { skenarioTerburuk: e.target.value })}
              rows={2}
              style={{ ...textInputStyle, resize: 'vertical' }}
            />

            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                Apakah opsi ini punya risiko? (opsional)
              </p>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <Chip label="Ya" selected={o.risiko?.ada === true} onClick={() => updateRisiko(index, { ada: true })} />
                <Chip
                  label="Tidak"
                  selected={o.risiko?.ada === false}
                  onClick={() => updateRisiko(index, { ada: false, level: undefined })}
                />
              </div>
              {o.risiko?.ada === true && (
                <div style={{ marginTop: 8 }}>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>Seberapa besar?</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    {LEVEL_RISIKO.map((level) => (
                      <Chip
                        key={level}
                        label={level}
                        selected={o.risiko?.level === level}
                        onClick={() => updateRisiko(index, { level })}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {opsi.length < MAX_OPSI && (
        <Button variant="secondary" onClick={tambahOpsi}>
          + Tambah opsi
        </Button>
      )}

      <div>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>
            Kalau orang yang kamu percaya lihat opsi-opsi ini, kira-kira dia bakal bilang apa? (opsional)
          </p>
          <Tooltip
            istilah="Sudut Pandang Luar"
            isi="Minta pendapat orang lain, bahkan cuma dibayangin, bisa nunjukin sudut pandang yang otak kamu sendiri suka lewatkan."
          />
        </div>
        <textarea
          value={draft.perspektifOrangLain ?? ''}
          onChange={(e) => onUpdate({ perspektifOrangLain: e.target.value })}
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

export default Step4OpsiSkenario
