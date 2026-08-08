import { useState } from 'react'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { kodeCadanganValid, pulihkanDariKode } from '../../lib/cadanganData'
import { nudgeCardStyle, textInputStyle } from '../../styles/formStyles'

interface PulihkanDataProps {
  onKembali: () => void
  onSelesai: () => void
}

function PulihkanData({ onKembali, onSelesai }: PulihkanDataProps) {
  const [kode, setKode] = useState('')
  const [error, setError] = useState(false)
  const [mintaKonfirmasi, setMintaKonfirmasi] = useState(false)

  function handleTapPulihkan() {
    if (!kodeCadanganValid(kode)) {
      setError(true)
      setMintaKonfirmasi(false)
      return
    }
    setError(false)
    setMintaKonfirmasi(true)
  }

  function handleKonfirmasi() {
    pulihkanDariKode(kode)
    onSelesai()
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
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Pulihkan Data</h1>
      </div>

      <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
        Tempel kode cadangan yang sebelumnya kamu simpan.
      </p>

      <div>
        <textarea
          value={kode}
          onChange={(e) => {
            setKode(e.target.value)
            setError(false)
          }}
          placeholder="Tempel kode cadangan di sini"
          rows={8}
          style={{ ...textInputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.8rem' }}
        />
        {error && (
          <p style={{ margin: '8px 0 0', color: 'var(--color-accent)', fontSize: '0.9rem' }}>
            Kode tidak valid, coba cek lagi.
          </p>
        )}
      </div>

      {mintaKonfirmasi ? (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>
            Data dari kode ini akan digabungkan dengan data yang sudah ada di HP ini. Data yang sudah ada tidak
            akan hilang. Lanjutkan?
          </p>
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <Button variant="secondary" onClick={() => setMintaKonfirmasi(false)}>
                Batal
              </Button>
            </div>
            <div style={{ flex: 1 }}>
              <Button variant="primary" onClick={handleKonfirmasi}>
                Ya
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <Button variant="primary" onClick={handleTapPulihkan} disabled={!kode.trim()}>
          Pulihkan
        </Button>
      )}

      <Button variant="secondary" onClick={onKembali}>
        Kembali
      </Button>
    </Screen>
  )
}

export default PulihkanData
