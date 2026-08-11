import Button from '../../components/Button'
import Screen from '../../components/Screen'
import type { OptInStatus } from '../../types/keputusan'

const GOOGLE_FORM_URL = 'https://forms.gle/c9SUqwi4Uc7ApKeo9'

interface OptInProps {
  onPilih: (status: OptInStatus) => void
}

function OptIn({ onPilih }: OptInProps) {
  function handleKasihMasukan() {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer')
    onPilih('ya')
  }

  return (
    <Screen>
      <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Gimana rasanya sesi refleksi barusan?</h1>

      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Cerita singkatmu bantu kami bikin Runtut lebih pas buat kamu ke depannya.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="primary" onClick={handleKasihMasukan}>
          Kasih Masukan
        </Button>
        <Button variant="secondary" onClick={() => onPilih('nanti_aja')}>
          Nanti Aja
        </Button>
      </div>
    </Screen>
  )
}

export default OptIn
