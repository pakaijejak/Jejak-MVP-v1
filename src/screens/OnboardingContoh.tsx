import { useState } from 'react'
import Button from '../components/Button'
import Screen from '../components/Screen'
import SelfAssessmentProses from './keputusan-baru/SelfAssessmentProses'
import Step1RumuskanMasalah from './keputusan-baru/Step1RumuskanMasalah'
import Step2JedaEmosi from './keputusan-baru/Step2JedaEmosi'
import Step3CekFakta from './keputusan-baru/Step3CekFakta'
import Step4OpsiSkenario from './keputusan-baru/Step4OpsiSkenario'
import Step5Putuskan from './keputusan-baru/Step5Putuskan'
import type { KeputusanDraft } from './keputusan-baru/types'
import Step7CatatHasil from './cek-hasil/Step7CatatHasil'
import Step8SkorKalibrasi from './cek-hasil/Step8SkorKalibrasi'
import Step9RefleksiHasil from './cek-hasil/Step9RefleksiHasil'
import { resolveKategori } from '../lib/storage'
import type { Keputusan } from '../types/keputusan'

// Walkthrough Latihan memakai ulang komponen Step 1-9 ASLI (mode praktik),
// supaya pembaruan alur sungguhan otomatis ikut ke sini, tidak perlu
// disinkronkan manual lagi. Draft & hasil HANYA hidup di state komponen ini,
// tidak pernah dikirim ke tambahKeputusan()/updateKeputusan() di storage.ts.

const draftAwalLatihan: KeputusanDraft = {
  masalah: 'Mau makan apa hari ini?',
  infoYangDimiliki: '',
  asumsiYangDianggapPasti: '',
  perspektifOrangLain: '',
  opsi: [
    { teks: 'Nasi Padang', skenarioTerburuk: '' },
    { teks: 'Soto', skenarioTerburuk: '' },
  ],
}

interface DraftHasilLatihan {
  hasilPersen?: number
  catatanHasil: string
}

type Langkah =
  | 'step1'
  | 'step2'
  | 'step3'
  | 'step4'
  | 'step5'
  | 'penilaian'
  | 'transisi'
  | 'step7'
  | 'step8'
  | 'step9'
  | 'penutup'

interface OnboardingContohProps {
  onLanjut: () => void
  onBatal: () => void
}

function OnboardingContoh({ onLanjut, onBatal }: OnboardingContohProps) {
  const [langkah, setLangkah] = useState<Langkah>('step1')
  const [draft, setDraft] = useState<KeputusanDraft>(draftAwalLatihan)
  const [draftHasil, setDraftHasil] = useState<DraftHasilLatihan>({ catatanHasil: '' })
  const [keputusanLatihan, setKeputusanLatihan] = useState<Keputusan | null>(null)

  function updateDraft(partial: Partial<KeputusanDraft>) {
    setDraft((prev) => ({ ...prev, ...partial }))
  }

  function updateDraftHasil(partial: Partial<DraftHasilLatihan>) {
    setDraftHasil((prev) => ({ ...prev, ...partial }))
  }

  function selesaikanStep5() {
    setKeputusanLatihan({
      id: 'latihan',
      createdAt: new Date().toISOString(),
      masalah: draft.masalah,
      kategori: resolveKategori(draft.kategori as string),
      emosi: draft.emosi as string,
      intensitasEmosi: draft.intensitasEmosi as NonNullable<KeputusanDraft['intensitasEmosi']>,
      infoYangDimiliki: draft.infoYangDimiliki,
      asumsiYangDianggapPasti: draft.asumsiYangDianggapPasti?.trim() || undefined,
      sudahCekPandanganBerbeda: draft.sudahCekPandanganBerbeda as boolean,
      opsi: draft.opsi,
      perspektifOrangLain: draft.perspektifOrangLain?.trim() || undefined,
      opsiTerpilihIndex: draft.opsiTerpilihIndex as number,
      keyakinanAwal: draft.keyakinanAwal as number,
      tanggalTargetReview: new Date().toISOString(),
      status: 'menunggu_direview',
    })
    setLangkah('penilaian')
  }

  switch (langkah) {
    case 'step1':
      return (
        <Step1RumuskanMasalah
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setLangkah('step2')}
          onKembali={onBatal}
          modePraktik
        />
      )
    case 'step2':
      return (
        <Step2JedaEmosi
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setLangkah('step3')}
          onKembali={() => setLangkah('step1')}
        />
      )
    case 'step3':
      return (
        <Step3CekFakta
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setLangkah('step4')}
          onKembali={() => setLangkah('step2')}
        />
      )
    case 'step4':
      return (
        <Step4OpsiSkenario
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={() => setLangkah('step5')}
          onKembali={() => setLangkah('step3')}
        />
      )
    case 'step5':
      return (
        <Step5Putuskan
          draft={draft}
          onUpdate={updateDraft}
          onLanjut={selesaikanStep5}
          onKembali={() => setLangkah('step4')}
        />
      )
    case 'penilaian':
      return (
        <SelfAssessmentProses draft={draft} onLanjut={() => setLangkah('transisi')} onKembali={() => setLangkah('step5')} />
      )
    case 'transisi':
      return (
        <Screen>
          <p style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.5 }}>
            Oke, sekarang anggap kamu udah makan. Gimana hasilnya?
          </p>
          <Button variant="primary" onClick={() => setLangkah('step7')}>
            Lanjut
          </Button>
        </Screen>
      )
    case 'step7':
      return (
        <Step7CatatHasil
          hasilPersen={draftHasil.hasilPersen}
          catatanHasil={draftHasil.catatanHasil}
          onUpdate={updateDraftHasil}
          onLanjut={() => setLangkah('step8')}
          onKembali={() => setLangkah('step5')}
        />
      )
    case 'step8':
      if (!keputusanLatihan) return null
      return (
        <Step8SkorKalibrasi
          keputusan={keputusanLatihan}
          hasilPersen={draftHasil.hasilPersen as number}
          onLanjut={() => setLangkah('step9')}
          onKembali={() => setLangkah('step7')}
        />
      )
    case 'step9':
      return <Step9RefleksiHasil onSelesai={() => setLangkah('penutup')} onKembali={() => setLangkah('step8')} />
    case 'penutup':
      return (
        <Screen>
          <p style={{ margin: 0, lineHeight: 1.6 }}>
            Nah, ini yang bakal kamu lakuin tiap kali ambil keputusan beneran. Bedanya, di keputusan asli biasanya
            butuh waktu buat tau hasilnya, nggak secepat makan.
          </p>
          <Button variant="primary" onClick={onLanjut}>
            Lanjut ke Gerbang Kode Akses
          </Button>
        </Screen>
      )
  }
}

export default OnboardingContoh
