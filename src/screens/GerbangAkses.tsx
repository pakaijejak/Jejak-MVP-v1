import { useState } from 'react'
import Button from '../components/Button'
import Logo from '../components/Logo'
import PanduanInstalasi from '../components/PanduanInstalasi'
import Screen from '../components/Screen'
import { cocokkanKodeAkses } from '../lib/aksesGerbang'
import { apakahModeStandalone } from '../lib/pwa'
import { kirimKonversi } from '../lib/referralApi'
import {
  ambilKodeReferralPengaju,
  ambilKonversiSudahDikirim,
  setKonversiSudahDikirim,
} from '../lib/storage'
import { textInputStyle } from '../styles/formStyles'

const LINK_BELI_LYNK = 'https://lynk.id/runtut'

interface GerbangAksesProps {
  onTerverifikasi: () => void
  onLihatContoh: () => void
}

function GerbangAkses({ onTerverifikasi, onLihatContoh }: GerbangAksesProps) {
  const [kode, setKode] = useState('')
  const [pesanError, setPesanError] = useState('')
  const [memeriksa, setMemeriksa] = useState(false)
  const [standalone] = useState(() => apakahModeStandalone())

  async function handleBuka() {
    setMemeriksa(true)
    const hasil = await cocokkanKodeAkses(kode)
    setMemeriksa(false)

    if (hasil === 'diterima') {
      // Ini cuma "numpang lewat" di momen verifikasi berhasil, TIDAK PERNAH
      // di-await -- kalau Worker gagal/tidak bisa dihubungi, verifikasi kode
      // akses tetap harus berhasil seperti biasa (onTerverifikasi() di bawah
      // selalu jalan, tidak bergantung sama sekali pada hasil fetch ini).
      const kodePengaju = ambilKodeReferralPengaju()
      if (kodePengaju && !ambilKonversiSudahDikirim()) {
        setKonversiSudahDikirim(true)
        void kirimKonversi(kodePengaju)
      }

      onTerverifikasi()
      return
    }

    if (hasil === 'kadaluarsa') {
      setPesanError('Kode ini sudah tidak berlaku lagi')
      return
    }

    setPesanError('Kode belum sesuai, coba cek lagi.')
  }

  return (
    <Screen>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
        <Logo lebarTerlebar={30} tinggiGaris={7} jarakGaris={6} />
        <h1 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 500 }}>Runtut</h1>
      </div>

      <p style={{ margin: 0, lineHeight: 1.5 }}>Masukkan kode akses yang kamu terima saat pembelian.</p>

      <div>
        <input
          value={kode}
          onChange={(e) => {
            setKode(e.target.value)
            setPesanError('')
          }}
          placeholder="Kode akses"
          style={textInputStyle}
          autoFocus
        />
        {pesanError && (
          <p style={{ margin: '8px 0 0', color: 'var(--color-accent)', fontSize: '0.9rem' }}>{pesanError}</p>
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

      <button
        type="button"
        onClick={onLihatContoh}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--color-ink-muted)',
          fontSize: '0.85rem',
          textAlign: 'center',
          cursor: 'pointer',
          fontFamily: 'inherit',
          padding: 0,
          textDecoration: 'underline',
        }}
      >
        Belum coba dulu? Lihat contoh interaktifnya
      </button>

      <p style={{ margin: 0, textAlign: 'center' }}>
        <a href="/privasi" style={{ fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
          Kebijakan Privasi
        </a>
      </p>
    </Screen>
  )
}

export default GerbangAkses
