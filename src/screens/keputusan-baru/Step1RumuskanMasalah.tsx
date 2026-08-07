import { useState } from 'react'
import Chip from '../../components/Chip'
import ChipRow from '../../components/ChipRow'
import Button from '../../components/Button'
import StepScreen from '../../components/StepScreen'
import { KATEGORI_TETAP, ambilKategoriCustomTerlihat, sembunyikanKategori } from '../../lib/storage'
import { labelStyle, nudgeCardStyle, textInputStyle } from '../../styles/formStyles'
import type { KeputusanDraft } from './types'

interface Step1Props {
  draft: KeputusanDraft
  onUpdate: (partial: Partial<KeputusanDraft>) => void
  onLanjut: () => void
  onKembali: () => void
}

function cocokTetap(nilai: string | undefined): boolean {
  if (!nilai) return false
  return KATEGORI_TETAP.some((k) => k.toLowerCase() === nilai.toLowerCase())
}

function Step1RumuskanMasalah({ draft, onUpdate, onLanjut, onKembali }: Step1Props) {
  const [kategoriCustom, setKategoriCustom] = useState(() => ambilKategoriCustomTerlihat())
  const [kategoriAkanDihapus, setKategoriAkanDihapus] = useState<string | null>(null)
  const [modeLainnya, setModeLainnya] = useState(() => {
    if (!draft.kategori) return false
    if (cocokTetap(draft.kategori)) return false
    const cocokCustom = kategoriCustom.some((k) => k.toLowerCase() === draft.kategori!.toLowerCase())
    return !cocokCustom
  })

  const bisaLanjut = draft.masalah.trim().length > 0 && Boolean(draft.kategori?.trim())

  const saran = modeLainnya
    ? kategoriCustom.filter(
        (k) =>
          draft.kategori &&
          draft.kategori.trim().length > 0 &&
          k.toLowerCase().includes(draft.kategori.trim().toLowerCase()) &&
          k.toLowerCase() !== draft.kategori.trim().toLowerCase(),
      )
    : []

  function pilihChip(kategori: string) {
    setModeLainnya(false)
    onUpdate({ kategori })
  }

  function bukaLainnya() {
    setModeLainnya(true)
    onUpdate({ kategori: '' })
  }

  function konfirmasiHapusKategori() {
    if (!kategoriAkanDihapus) return
    sembunyikanKategori(kategoriAkanDihapus)
    setKategoriCustom((prev) => prev.filter((k) => k.toLowerCase() !== kategoriAkanDihapus.toLowerCase()))
    setKategoriAkanDihapus(null)
  }

  return (
    <StepScreen step={1} totalSteps={6} onKembali={onKembali}>
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
        <div style={{ marginTop: 8 }}>
          <ChipRow>
            {KATEGORI_TETAP.map((kategori) => (
              <Chip
                key={kategori}
                label={kategori}
                selected={!modeLainnya && draft.kategori?.toLowerCase() === kategori.toLowerCase()}
                onClick={() => pilihChip(kategori)}
              />
            ))}
            {kategoriCustom.map((kategori) => (
              <div key={kategori} style={{ position: 'relative', display: 'inline-block' }}>
                <Chip
                  label={kategori}
                  selected={!modeLainnya && draft.kategori?.toLowerCase() === kategori.toLowerCase()}
                  onClick={() => pilihChip(kategori)}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setKategoriAkanDihapus(kategori)
                  }}
                  aria-label={`Hapus kategori ${kategori} dari pilihan`}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: '1px solid var(--color-ink-muted)',
                    background: 'var(--color-surface)',
                    color: 'var(--color-ink-muted)',
                    fontSize: '0.7rem',
                    lineHeight: 1,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 0,
                    fontFamily: 'inherit',
                  }}
                >
                  ×
                </button>
              </div>
            ))}
            <Chip label="Lainnya" selected={modeLainnya} onClick={bukaLainnya} />
          </ChipRow>
        </div>

        {kategoriAkanDihapus && (
          <div style={{ ...nudgeCardStyle, marginTop: 12 }}>
            <p style={{ margin: 0 }}>Hapus kategori "{kategoriAkanDihapus}" ini dari pilihan?</p>
            <div style={{ display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <Button variant="secondary" onClick={() => setKategoriAkanDihapus(null)}>
                  Batal
                </Button>
              </div>
              <div style={{ flex: 1 }}>
                <Button variant="primary" onClick={konfirmasiHapusKategori}>
                  Ya
                </Button>
              </div>
            </div>
          </div>
        )}

        {modeLainnya && (
          <div style={{ marginTop: 12 }}>
            <input
              value={draft.kategori ?? ''}
              onChange={(e) => onUpdate({ kategori: e.target.value })}
              placeholder="Tulis kategori..."
              style={textInputStyle}
              autoFocus
            />
            {saran.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <ChipRow>
                  {saran.map((s) => (
                    <Chip key={s} label={s} selected={false} onClick={() => onUpdate({ kategori: s })} />
                  ))}
                </ChipRow>
              </div>
            )}
          </div>
        )}
      </div>

      <Button variant="primary" onClick={onLanjut} disabled={!bisaLanjut}>
        Lanjut
      </Button>
    </StepScreen>
  )
}

export default Step1RumuskanMasalah
