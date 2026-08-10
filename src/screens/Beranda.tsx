import { useState } from 'react'
import Button from '../components/Button'
import Logo from '../components/Logo'
import PanduanInstalasi from '../components/PanduanInstalasi'
import Screen from '../components/Screen'
import { apakahModeStandalone } from '../lib/pwa'
import {
  ambilKeputusanPending,
  ambilNamaSapaan,
  ambilPromptInstallDitutup,
  setNamaSapaan,
  setPromptInstallDitutup,
} from '../lib/storage'
import { nudgeCardStyle } from '../styles/formStyles'
import EditNamaSapaan from './EditNamaSapaan'

interface BerandaProps {
  onMulaiKeputusanBaru: () => void
  onRiwayatPola: () => void
  onLihatCekHasil: () => void
  onBantuanMasukan: () => void
}

function Beranda({ onMulaiKeputusanBaru, onRiwayatPola, onLihatCekHasil, onBantuanMasukan }: BerandaProps) {
  const [pending] = useState(() => ambilKeputusanPending())
  const [namaSapaan, setNamaSapaanState] = useState(() => ambilNamaSapaan())
  const [tampilkanPromptInstall, setTampilkanPromptInstall] = useState(
    () => !apakahModeStandalone() && !ambilPromptInstallDitutup(),
  )

  function tutupPromptInstall() {
    setPromptInstallDitutup(true)
    setTampilkanPromptInstall(false)
  }

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Logo lebarTerlebar={16} tinggiGaris={4} jarakGaris={3} />
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--color-ink-muted)',
            letterSpacing: '0.08em',
          }}
        >
          RUNTUT
        </span>
      </div>

      <div>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>
          👋 Selamat datang lagi{namaSapaan ? `, ${namaSapaan}` : ''}!
        </h1>
        <div style={{ marginTop: 4 }}>
          <EditNamaSapaan
            namaSaatIni={namaSapaan}
            onSimpan={(nama) => {
              setNamaSapaan(nama)
              setNamaSapaanState(ambilNamaSapaan())
            }}
          />
        </div>
      </div>

      {tampilkanPromptInstall && (
        <div style={nudgeCardStyle}>
          <p style={{ margin: 0 }}>💡 Biar gampang dibuka lagi, install Runtut ke HP kamu.</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1 }}>
              <PanduanInstalasi
                trigger={(buka) => (
                  <Button variant="secondary" onClick={buka}>
                    Lihat Caranya
                  </Button>
                )}
              />
            </div>
            <button
              type="button"
              onClick={tutupPromptInstall}
              aria-label="Tutup ajakan install"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1.5px solid var(--color-ink-muted)',
                background: 'transparent',
                color: 'var(--color-ink-muted)',
                fontSize: '1rem',
                lineHeight: 1,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontFamily: 'inherit',
              }}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {pending.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            paddingBottom: 24,
            borderBottom: '1px solid var(--color-ink-muted)',
          }}
        >
          <p style={{ margin: 0 }}>
            🔔 {pending.length} keputusan menunggu direview
          </p>
          <Button variant="secondary" onClick={onLihatCekHasil}>
            Lihat &amp; Cek Hasil
          </Button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Button variant="primary" onClick={onMulaiKeputusanBaru}>
          + Mulai Keputusan Baru
        </Button>
        <Button variant="secondary" onClick={onRiwayatPola}>
          Riwayat &amp; Pola
        </Button>
      </div>

      <button
        type="button"
        onClick={onBantuanMasukan}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-accent)',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        Butuh bantuan atau punya masukan?
      </button>
    </Screen>
  )
}

export default Beranda
