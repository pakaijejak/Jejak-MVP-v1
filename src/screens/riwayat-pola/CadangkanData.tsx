import { useState } from 'react'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { buatKodeCadangan } from '../../lib/cadanganData'
import { textInputStyle } from '../../styles/formStyles'

interface CadangkanDataProps {
  onKembali: () => void
}

function CadangkanData({ onKembali }: CadangkanDataProps) {
  const [kode] = useState(() => buatKodeCadangan())
  const [tersalin, setTersalin] = useState(false)

  async function salinKode() {
    await navigator.clipboard.writeText(kode)
    setTersalin(true)
    setTimeout(() => setTersalin(false), 2000)
  }

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onKembali}
          aria-label="Kembali"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-ink)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Cadangkan Data</h1>
      </div>

      <textarea
        value={kode}
        readOnly
        rows={8}
        style={{ ...textInputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
        onFocus={(e) => e.target.select()}
      />

      <Button variant="secondary" onClick={salinKode}>
        {tersalin ? 'Tersalin!' : 'Salin'}
      </Button>

      <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5, fontSize: '0.9rem' }}>
        Salin kode ini dan simpan di tempat aman, misalnya kirim ke dirimu sendiri lewat WhatsApp atau catat di
        Notes. Kode ini dipakai untuk memulihkan data kalau HP-mu ganti atau app ter-uninstall.
      </p>

      <Button variant="secondary" onClick={onKembali}>
        Kembali
      </Button>
    </Screen>
  )
}

export default CadangkanData
