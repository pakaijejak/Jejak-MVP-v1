import { useState } from 'react'
import { tambahKeputusan } from '../../lib/storage'
import Step1JedaEmosi from './Step1JedaEmosi'
import Step2RumuskanMasalah from './Step2RumuskanMasalah'
import Step3CekFakta from './Step3CekFakta'
import Step4OpsiSkenario from './Step4OpsiSkenario'
import Step5Putuskan from './Step5Putuskan'
import Step6JadwalkanReview from './Step6JadwalkanReview'
import { draftAwal, type KeputusanDraft } from './types'

interface MulaiKeputusanBaruProps {
  onSelesai: () => void
  onBatal: () => void
}

function MulaiKeputusanBaru({ onSelesai, onBatal }: MulaiKeputusanBaruProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [draft, setDraft] = useState<KeputusanDraft>(draftAwal)

  function updateDraft(partial: Partial<KeputusanDraft>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function kembali() {
    if (currentStep <= 1) {
      onBatal()
      return
    }
    setCurrentStep((step) => step - 1)
  }

  function simpanKeputusan(tanggalTargetReview: string) {
    tambahKeputusan({
      emosi: draft.emosi as NonNullable<KeputusanDraft['emosi']>,
      intensitasEmosi: draft.intensitasEmosi as NonNullable<KeputusanDraft['intensitasEmosi']>,
      masalah: draft.masalah,
      kategori: draft.kategori as NonNullable<KeputusanDraft['kategori']>,
      infoYangDimiliki: draft.infoYangDimiliki,
      sudahCekPandanganBerbeda: draft.sudahCekPandanganBerbeda as boolean,
      opsi: draft.opsi,
      opsiTerpilihIndex: draft.opsiTerpilihIndex as number,
      keyakinanAwal: draft.keyakinanAwal as number,
      tanggalTargetReview,
    })
  }

  switch (currentStep) {
    case 1:
      return (
        <Step1JedaEmosi
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setCurrentStep(2)}
          onKembali={kembali}
        />
      )
    case 2:
      return (
        <Step2RumuskanMasalah
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setCurrentStep(3)}
          onKembali={kembali}
        />
      )
    case 3:
      return (
        <Step3CekFakta
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setCurrentStep(4)}
          onKembali={kembali}
        />
      )
    case 4:
      return (
        <Step4OpsiSkenario
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setCurrentStep(5)}
          onKembali={kembali}
        />
      )
    case 5:
      return (
        <Step5Putuskan
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setCurrentStep(6)}
          onKembali={kembali}
        />
      )
    case 6:
      return <Step6JadwalkanReview onSimpan={simpanKeputusan} onSelesai={onSelesai} onKembali={kembali} />
    default:
      return null
  }
}

export default MulaiKeputusanBaru
