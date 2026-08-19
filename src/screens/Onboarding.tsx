import Button from '../components/Button'
import Screen from '../components/Screen'

interface OnboardingProps {
  onCobaSekarang: () => void
  onLewati: () => void
}

function Onboarding({ onCobaSekarang, onLewati }: OnboardingProps) {
  return (
    <Screen>
      <div>
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', fontSize: '0.95rem' }}>
          Yuk coba dulu pakai contoh receh:
        </p>
        <h1 style={{ margin: '8px 0 0', fontSize: '1.75rem', lineHeight: 1.3 }}>
          Mau makan siang apa hari ini?
        </h1>
      </div>

      <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
        Cocok dipakai saat kamu punya waktu buat mikir jernih, apalagi untuk keputusan yang berat.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <Button variant="primary" onClick={onCobaSekarang}>
            Coba Sekarang
          </Button>
          <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--color-ink-muted)', textAlign: 'center' }}>
            (sekitar 5 menit)
          </p>
        </div>
        <Button variant="secondary" onClick={onLewati}>
          Lewati, langsung ke keputusan saya
        </Button>
      </div>
    </Screen>
  )
}

export default Onboarding
