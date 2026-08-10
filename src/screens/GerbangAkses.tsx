import { useState } from 'react'
import Button from '../components/Button'
import Logo from '../components/Logo'
import PanduanInstalasi from '../components/PanduanInstalasi'
import Screen from '../components/Screen'
import { cocokkanKodeAkses } from '../lib/aksesGerbang'
import { apakahModeStandalone } from '../lib/pwa'
import { textInputStyle } from '../styles/formStyles'

const LINK_BELI_LYNK = 'https://lynk.id/runtut'

interface GerbangAksesProps {
  onTerverifikasi: () => void
}

function GerbangAkses({ onTerverifikasi }: GerbangAksesProps) {
  const [kode, setKode] = useState('')
  const [error, setError] = useState(false)
  const [memeriksa, setMemeriksa] = useState(false)
  const [standalone] = useState(() => apakahModeStandalone())

  async function handleBuka() {
    setMemeriksa(true)
    const cocok = await cocokkanKodeAkses(kode)
    setMemeriksa(false)

    if (cocok) {
      onTerverifikasi()
      return
    }

    setError(true)
  }

  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Logo lebarTerlebar={26} tinggiGaris={4} jarakGaris={2} />
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Runtut</h1>
      </div>

      <p style={{ margin: 0, lineHeight: 1.5 }}>Masukkan kode akses yang kamu terima saat pembelian.</p>

      <div>
        <input
          value={kode}
          onChange={(e) => {
            setKode(e.target.value)
            setError(false)
          }}
          placeholder="Kode akses"
          style={textInputStyle}
          autoFocus
        />
        {error && (
          <p style={{ margin: '8px 0 0', color: 'var(--color-accent)', fontSize: '0.9rem' }}>
            Kode belum sesuai, coba cek lagi.
          </p>
        )}
      </div>

      <Button variant="primary" onClick={handleBuka} disabled={!kode.trim() || memeriksa}>
        Buka
      </Button>

      {!standalone && (
        <PanduanInstalasi
          trigger={(buka) => (
            <button
              type="button"
              onClick={buka}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--color-ink-muted)',
                fontSize: '0.85rem',
                textAlign: 'center',
                cursor: 'pointer',
                fontFamily: 'inherit',
                padding: 0,
              }}
            >
              📲 Cara install ke HP
            </button>
          )}
        />
      )}

      <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--color-ink-muted)', textAlign: 'center' }}>
        Belum beli?{' '}
        <a
          href={LINK_BELI_LYNK}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--color-accent)', fontWeight: 600 }}
        >
          Beli di sini
        </a>
      </p>
    </Screen>
  )
}

export default GerbangAkses
