import { useState } from 'react'
import Button from '../components/Button'
import Screen from '../components/Screen'
import { textInputStyle } from '../styles/formStyles'

const EMAIL_BANTUAN = 'pakai.jejak@gmail.com'
const SUBJEK_EMAIL = 'Masukan Runtut'

interface BantuanMasukanProps {
  onKembali: () => void
}

function BantuanMasukan({ onKembali }: BantuanMasukanProps) {
  const [pesan, setPesan] = useState('')
  const [error, setError] = useState(false)

  function kirimLewatEmail() {
    if (!pesan.trim()) {
      setError(true)
      return
    }
    setError(false)
    const mailto = `mailto:${EMAIL_BANTUAN}?subject=${encodeURIComponent(SUBJEK_EMAIL)}&body=${encodeURIComponent(pesan)}`
    window.location.href = mailto
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
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Bantuan &amp; Masukan</h1>
      </div>

      <p style={{ margin: 0, lineHeight: 1.5 }}>Ada pertanyaan, komplain, atau masukan? Tulis di bawah ini.</p>

      <div>
        <textarea
          value={pesan}
          onChange={(e) => {
            setPesan(e.target.value)
            setError(false)
          }}
          rows={6}
          style={{ ...textInputStyle, resize: 'vertical' }}
          autoFocus
        />
        {error && (
          <p style={{ margin: '8px 0 0', color: 'var(--color-accent)', fontSize: '0.9rem' }}>
            Tulis dulu pesannya ya.
          </p>
        )}
      </div>

      <Button variant="primary" onClick={kirimLewatEmail}>
        Kirim Lewat Email
      </Button>
    </Screen>
  )
}

export default BantuanMasukan
