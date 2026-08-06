import Button from '../../components/Button'
import Screen from '../../components/Screen'
import type { OptInStatus } from '../../types/keputusan'

// TODO ganti sebelum deploy final: ini placeholder, belum link Google Form asli.
const GOOGLE_FORM_URL = 'TODO_GANTI_DENGAN_LINK_FORM_ASLI'

interface OptInProps {
  onPilih: (status: OptInStatus) => void
}

function OptIn({ onPilih }: OptInProps) {
  function handleYaKabariSaya() {
    window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer')
    onPilih('ya')
  }

  return (
    <Screen>
      <h1 style={{ margin: 0, fontSize: '1.4rem' }}>Suka dengan sesi refleksi ini?</h1>

      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Kami lagi siapin versi lanjutan dan beberapa tools serupa lainnya.
      </p>

      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Mau dikabari kalau ada yang baru? Nggak akan spam, ini janji. Cuma update penting sesekali.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="primary" onClick={handleYaKabariSaya}>
          Ya, Kabari Saya
        </Button>
        <Button variant="secondary" onClick={() => onPilih('nanti_aja')}>
          Nanti Aja
        </Button>
      </div>
    </Screen>
  )
}

export default OptIn
