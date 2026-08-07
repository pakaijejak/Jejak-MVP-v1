import { useState, type ReactNode } from 'react'
import BottomSheet from './BottomSheet'

interface PanduanInstalasiProps {
  trigger: (buka: () => void) => ReactNode
}

function PanduanInstalasi({ trigger }: PanduanInstalasiProps) {
  const [terbuka, setTerbuka] = useState(false)

  return (
    <>
      {trigger(() => setTerbuka(true))}

      <BottomSheet terbuka={terbuka} onTutup={() => setTerbuka(false)}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Cara Install ke HP</h3>

        <div style={{ color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
          <p style={{ margin: 0 }}>
            <strong style={{ color: 'var(--color-ink)' }}>Kalau HP kamu Android (Chrome):</strong>
            <br />
            Tunggu beberapa detik, biasanya muncul kotak kecil di bawah layar menawarkan install, tinggal tap itu.
            Kalau tidak muncul, tap titik tiga di pojok kanan atas, cari dan pilih "Install and create shortcut"
            (tergantung versi Chrome, kadang cuma tertulis "Install").
          </p>
          <p style={{ margin: '12px 0 0' }}>
            <strong style={{ color: 'var(--color-ink)' }}>Kalau HP kamu iPhone (wajib pakai Safari, bukan Chrome):</strong>
            <br />
            Tap ikon Share (kotak dengan panah ke atas) di bagian bawah layar, scroll ke bawah, pilih "Add to Home
            Screen".
          </p>
        </div>

        <button
          type="button"
          onClick={() => setTerbuka(false)}
          style={{
            marginTop: 8,
            alignSelf: 'flex-start',
            background: 'transparent',
            border: 'none',
            color: 'var(--color-ink)',
            fontWeight: 600,
            fontFamily: 'inherit',
            cursor: 'pointer',
            padding: 0,
          }}
        >
          Tutup
        </button>
      </BottomSheet>
    </>
  )
}

export default PanduanInstalasi
