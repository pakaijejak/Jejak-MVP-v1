import { useState } from 'react'
import Button from '../components/Button'
import Chip from '../components/Chip'
import StepScreen from '../components/StepScreen'
import { KALIMAT_GAP_KALIBRASI, KALIMAT_REASSURANCE_KALIBRASI, hitungSkorKalibrasi } from '../lib/kalibrasi'
import { labelStyle, textInputStyle } from '../styles/formStyles'

const EMOSI_PILIHAN = ['Cemas', 'Bingung', 'Marah', 'Sedih', 'Netral', 'Bersemangat']

// State latihan ini SENGAJA hanya di komponen (tidak pernah tambahKeputusan()/localStorage),
// karena ini cuma simulasi contoh receh, bukan keputusan sungguhan.
interface DraftLatihan {
  masalah: string
  emosi: string | null
  opsi: [string, string]
  opsiTerpilihIndex: number | null
  keyakinanAwal: number
  hasilPersen: number
}

const draftAwal: DraftLatihan = {
  masalah: 'Mau makan siang apa hari ini',
  emosi: null,
  opsi: ['Nasi Padang', 'Soto'],
  opsiTerpilihIndex: null,
  keyakinanAwal: 50,
  hasilPersen: 50,
}

interface OnboardingContohProps {
  onLanjut: () => void
  onBatal: () => void
}

function OnboardingContoh({ onLanjut, onBatal }: OnboardingContohProps) {
  const [langkah, setLangkah] = useState(1)
  const [draft, setDraft] = useState<DraftLatihan>(draftAwal)
  const [tersentuhKeyakinan, setTersentuhKeyakinan] = useState(false)
  const [tersentuhHasil, setTersentuhHasil] = useState(false)

  function update(partial: Partial<DraftLatihan>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function kembali() {
    if (langkah <= 1) {
      onBatal()
      return
    }
    setLangkah((l) => l - 1)
  }

  if (langkah === 1) {
    const bisaLanjut = draft.masalah.trim().length > 0

    return (
      <StepScreen step={1} totalSteps={5} onKembali={kembali}>
        <p style={labelStyle}>Keputusan apa yang lagi kamu hadapi?</p>
        <textarea
          value={draft.masalah}
          onChange={(e) => update({ masalah: e.target.value })}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical' }}
          autoFocus
        />
        <Button variant="primary" onClick={() => setLangkah(2)} disabled={!bisaLanjut}>
          Lanjut
        </Button>
      </StepScreen>
    )
  }

  if (langkah === 2) {
    return (
      <StepScreen step={2} totalSteps={5} onKembali={kembali}>
        <p style={labelStyle}>Lagi ngerasa apa soal keputusan ini?</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {EMOSI_PILIHAN.map((emosi) => (
            <Chip key={emosi} label={emosi} selected={draft.emosi === emosi} onClick={() => update({ emosi })} />
          ))}
        </div>
        <Button variant="primary" onClick={() => setLangkah(3)} disabled={!draft.emosi}>
          Lanjut
        </Button>
      </StepScreen>
    )
  }

  if (langkah === 3) {
    const bisaLanjut =
      draft.opsiTerpilihIndex !== null && tersentuhKeyakinan && draft.opsi.every((o) => o.trim().length > 0)

    return (
      <StepScreen step={3} totalSteps={5} onKembali={kembali}>
        <div>
          <p style={labelStyle}>Opsi apa aja yang kamu pertimbangkan?</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
            {draft.opsi.map((teks, index) => (
              <input
                key={index}
                value={teks}
                onChange={(e) => {
                  const opsiBaru: [string, string] = [...draft.opsi]
                  opsiBaru[index] = e.target.value
                  update({ opsi: opsiBaru })
                }}
                style={textInputStyle}
              />
            ))}
          </div>
        </div>

        <div>
          <p style={labelStyle}>Kamu pilih yang mana?</p>
          <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
            {draft.opsi.map((teks, index) => (
              <Chip
                key={index}
                label={teks.trim() || `Opsi ${index + 1}`}
                selected={draft.opsiTerpilihIndex === index}
                onClick={() => update({ opsiTerpilihIndex: index })}
              />
            ))}
          </div>
        </div>

        <div>
          <p style={{ ...labelStyle, fontSize: '1rem' }}>Seberapa yakin ini pilihan yang tepat?</p>
          <input
            type="range"
            min={0}
            max={100}
            value={draft.keyakinanAwal}
            onChange={(e) => {
              setTersentuhKeyakinan(true)
              update({ keyakinanAwal: Number(e.target.value) })
            }}
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
            <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{draft.keyakinanAwal}%</span>
            <span>100%</span>
          </div>
        </div>

        <Button variant="primary" onClick={() => setLangkah(4)} disabled={!bisaLanjut}>
          Lanjut
        </Button>
      </StepScreen>
    )
  }

  if (langkah === 4) {
    return (
      <StepScreen step={4} totalSteps={5} onKembali={kembali}>
        <p style={labelStyle}>Oke, anggap kamu udah makan. Gimana, sesuai ekspektasi?</p>
        <input
          type="range"
          min={0}
          max={100}
          value={draft.hasilPersen}
          onChange={(e) => {
            setTersentuhHasil(true)
            update({ hasilPersen: Number(e.target.value) })
          }}
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
          <span>Meleset</span>
          <span style={{ fontWeight: 600, color: 'var(--color-ink)' }}>{draft.hasilPersen}%</span>
          <span>Sesuai</span>
        </div>
        <Button variant="primary" onClick={() => setLangkah(5)} disabled={!tersentuhHasil}>
          Lanjut
        </Button>
      </StepScreen>
    )
  }

  const skorKalibrasi = hitungSkorKalibrasi(draft.keyakinanAwal, draft.hasilPersen)
  const kalimatReassurance = KALIMAT_REASSURANCE_KALIBRASI[skorKalibrasi]

  return (
    <StepScreen step={5} totalSteps={5} onKembali={kembali}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ margin: 0 }}>Kamu bilang {draft.keyakinanAwal}% yakin ini bakal berhasil.</p>
        <p style={{ margin: 0 }}>Hasilnya, {draft.hasilPersen}% sesuai harapanmu.</p>
        <p style={{ margin: 0 }}>{KALIMAT_GAP_KALIBRASI[skorKalibrasi]}</p>
        {kalimatReassurance && (
          <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>{kalimatReassurance}</p>
        )}
      </div>

      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Nah, ini yang bakal kamu lakuin tiap kali ambil keputusan beneran. Bedanya, di keputusan asli biasanya
        butuh waktu buat tau hasilnya, nggak secepat makan siang.
      </p>

      <Button variant="primary" onClick={onLanjut}>
        Lanjut ke Beranda
      </Button>
    </StepScreen>
  )
}

export default OnboardingContoh
