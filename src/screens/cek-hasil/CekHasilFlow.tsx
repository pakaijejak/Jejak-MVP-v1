import { useState } from 'react'
import { ambilKeputusanById, ambilOptInStatus, setOptInStatus, updateKeputusan } from '../../lib/storage'
import { hitungSkorKalibrasi } from '../../lib/kalibrasi'
import type { Keputusan } from '../../types/keputusan'
import KartuRingkasan from './KartuRingkasan'
import OptIn from './OptIn'
import Step7CatatHasil from './Step7CatatHasil'
import Step8SkorKalibrasi from './Step8SkorKalibrasi'
import Step9RefleksiHasil, { type RefleksiJawaban } from './Step9RefleksiHasil'

type Tahap = 'step7' | 'step8' | 'step9' | 'ringkasan' | 'optin'

interface CekHasilFlowProps {
  keputusanId: string
  onSelesai: () => void
  onBatal: () => void
}

interface DraftHasil {
  hasilAktual?: Keputusan['hasilAktual']
  catatanHasil: string
}

function CekHasilFlow({ keputusanId, onSelesai, onBatal }: CekHasilFlowProps) {
  const [keputusanAwal] = useState(() => ambilKeputusanById(keputusanId))
  const [tahap, setTahap] = useState<Tahap>('step7')
  const [draft, setDraft] = useState<DraftHasil>({ catatanHasil: '' })
  const [keputusanTersimpan, setKeputusanTersimpan] = useState<Keputusan | null>(null)

  if (!keputusanAwal) {
    onBatal()
    return null
  }

  function updateDraft(partial: Partial<DraftHasil>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function simpanRefleksi(refleksi: RefleksiJawaban) {
    const skorKalibrasi = hitungSkorKalibrasi(keputusanAwal!.keyakinanAwal, draft.hasilAktual!)
    const updated = updateKeputusan(keputusanId, {
      hasilAktual: draft.hasilAktual,
      catatanHasil: draft.catatanHasil,
      skorKalibrasi,
      refleksi,
      status: 'sudah_direview',
      reviewedAt: new Date().toISOString(),
    })
    setKeputusanTersimpan(updated ?? null)
    setTahap('ringkasan')
  }

  switch (tahap) {
    case 'step7':
      return (
        <Step7CatatHasil
          hasilAktual={draft.hasilAktual}
          catatanHasil={draft.catatanHasil}
          onUpdate={updateDraft}
          onLanjut={() => setTahap('step8')}
          onKembali={onBatal}
        />
      )
    case 'step8':
      return (
        <Step8SkorKalibrasi
          keputusan={keputusanAwal}
          hasilAktual={draft.hasilAktual as NonNullable<Keputusan['hasilAktual']>}
          onLanjut={() => setTahap('step9')}
          onKembali={() => setTahap('step7')}
        />
      )
    case 'step9':
      return (
        <Step9RefleksiHasil
          hasilAktual={draft.hasilAktual as NonNullable<Keputusan['hasilAktual']>}
          onSelesai={simpanRefleksi}
          onKembali={() => setTahap('step8')}
        />
      )
    case 'ringkasan':
      return (
        <KartuRingkasan
          keputusan={keputusanTersimpan ?? keputusanAwal}
          onSelesai={() => {
            if (ambilOptInStatus() === 'belum_ditanya') {
              setTahap('optin')
            } else {
              onSelesai()
            }
          }}
        />
      )
    case 'optin':
      return (
        <OptIn
          onPilih={(status) => {
            setOptInStatus(status)
            onSelesai()
          }}
        />
      )
    default:
      return null
  }
}

export default CekHasilFlow
