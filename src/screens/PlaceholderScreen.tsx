import Button from '../components/Button'
import Screen from '../components/Screen'

interface PlaceholderScreenProps {
  pesan: string
  onKembali: () => void
}

function PlaceholderScreen({ pesan, onKembali }: PlaceholderScreenProps) {
  return (
    <Screen>
      <p style={{ margin: 0, fontSize: '1.1rem', lineHeight: 1.5 }}>{pesan}</p>
      <Button variant="secondary" onClick={onKembali}>
        Kembali
      </Button>
    </Screen>
  )
}

export default PlaceholderScreen
