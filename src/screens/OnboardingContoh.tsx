import Button from '../components/Button'
import Screen from '../components/Screen'

interface OnboardingContohProps {
  onLanjut: () => void
}

function OnboardingContoh({ onLanjut }: OnboardingContohProps) {
  return (
    <Screen>
      <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>
        Contoh interaktif akan tersedia di sesi berikutnya.
      </p>
      <Button variant="primary" onClick={onLanjut}>
        Lanjut ke Beranda
      </Button>
    </Screen>
  )
}

export default OnboardingContoh
