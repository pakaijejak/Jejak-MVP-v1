import Button from '../../components/Button'
import Screen from '../../components/Screen'
import type { KeputusanDraft } from './types'

interface SelfAssessmentProsesProps {
  draft: KeputusanDraft
  onLanjut: () => void
  onKembali: () => void
}

function ItemChecklist({ label, terisi }: { label: string; terisi: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <span
        style={{
          flexShrink: 0,
          width: 20,
          fontWeight: 700,
          color: terisi ? 'var(--color-accent)' : 'var(--color-ink-muted)',
        }}
      >
        {terisi ? '✓' : '○'}
      </span>
      <p style={{ margin: 0, color: terisi ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>{label}</p>
    </div>
  )
}

function SelfAssessmentProses({ draft, onLanjut, onKembali }: SelfAssessmentProsesProps) {
  const daftarChecklist = [
    {
      label: 'Menguji asumsi yang kamu anggap pasti benar',
      terisi: Boolean(draft.asumsiYangDianggapPasti?.trim()),
    },
    {
      label: 'Mencari pandangan yang berbeda/bertentangan',
      terisi: draft.sudahCekPandanganBerbeda !== undefined,
    },
    {
      label: 'Mempertimbangkan pendapat orang lain yang dipercaya',
      terisi: Boolean(draft.perspektifOrangLain?.trim()),
    },
    {
      label: 'Memikirkan skenario terburuk',
      terisi: draft.opsi.every((o) => o.skenarioTerburuk.trim().length > 0),
    },
    {
      label: 'Menilai risiko dari pilihanmu',
      terisi: draft.opsi.some((o) => o.risiko?.ada !== undefined),
    },
  ]

  return (
    <Screen>
      <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
        Ini sudut-sudut yang sempat kamu tinjau soal keputusan ini:
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {daftarChecklist.map((item) => (
          <ItemChecklist key={item.label} label={item.label} terisi={item.terisi} />
        ))}
      </div>

      <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
        Nggak ada jumlah yang "benar", ini cuma cerminan proses berpikirmu kali ini.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="primary" onClick={onLanjut}>
          Lanjut
        </Button>
        <Button variant="secondary" onClick={onKembali}>
          Balik Dulu
        </Button>
      </div>
    </Screen>
  )
}

export default SelfAssessmentProses
