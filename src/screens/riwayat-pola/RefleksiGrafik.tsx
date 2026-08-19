import { useState } from 'react'
import BottomSheet from '../../components/BottomSheet'
import Button from '../../components/Button'
import { ambilRefleksiGrafik, hapusRefleksiGrafik, tambahRefleksiGrafik } from '../../lib/storage'
import { textInputStyle } from '../../styles/formStyles'
import type { RefleksiGrafik as RefleksiGrafikEntri } from '../../types/keputusan'

const linkStyle = {
  background: 'none',
  border: 'none',
  padding: 0,
  color: 'var(--color-accent)',
  fontWeight: 600,
  fontSize: '0.85rem',
  fontFamily: 'inherit',
  cursor: 'pointer',
  textDecoration: 'underline',
} as const

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function terbaruDari(daftar: RefleksiGrafikEntri[]): RefleksiGrafikEntri | null {
  if (daftar.length === 0) return null
  return [...daftar].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0]
}

function RefleksiGrafik() {
  const [daftar, setDaftar] = useState(() => ambilRefleksiGrafik())
  const [tulisTerbuka, setTulisTerbuka] = useState(false)
  const [draft, setDraft] = useState('')
  const [konfirmasiHapusTerbuka, setKonfirmasiHapusTerbuka] = useState(false)

  const terbaru = terbaruDari(daftar)

  function bukaTulis() {
    setDraft('')
    setTulisTerbuka(true)
  }

  function simpan() {
    if (!draft.trim()) return
    tambahRefleksiGrafik(draft)
    setDaftar(ambilRefleksiGrafik())
    setTulisTerbuka(false)
  }

  function konfirmasiHapus() {
    if (!terbaru) return
    hapusRefleksiGrafik(terbaru.id)
    setDaftar(ambilRefleksiGrafik())
    setKonfirmasiHapusTerbuka(false)
  }

  return (
    <div style={{ marginTop: 16 }}>
      {terbaru && (
        <div style={{ marginBottom: 8 }}>
          <p style={{ margin: 0, fontStyle: 'italic' }}>Ternyata {terbaru.teks}</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
            {formatTanggal(terbaru.createdAt)}{' '}
            <button type="button" onClick={() => setKonfirmasiHapusTerbuka(true)} style={{ ...linkStyle, fontSize: 'inherit' }}>
              Hapus
            </button>
          </p>
        </div>
      )}

      <button type="button" onClick={bukaTulis} style={linkStyle}>
        Apa pendapatmu tentang hasil dari chartmu?
      </button>

      <BottomSheet terbuka={tulisTerbuka} onTutup={() => setTulisTerbuka(false)}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Apa pendapatmu tentang hasil dari chartmu?</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontWeight: 600, flexShrink: 0 }}>Ternyata</span>
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            style={{ ...textInputStyle, flex: 1 }}
            autoFocus
          />
        </div>
        <Button variant="primary" onClick={simpan} disabled={!draft.trim()}>
          Simpan
        </Button>
      </BottomSheet>

      <BottomSheet terbuka={konfirmasiHapusTerbuka} onTutup={() => setKonfirmasiHapusTerbuka(false)}>
        <p style={{ margin: 0, lineHeight: 1.5 }}>Yakin mau hapus refleksi ini?</p>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <Button variant="secondary" onClick={() => setKonfirmasiHapusTerbuka(false)}>
              Batal
            </Button>
          </div>
          <div style={{ flex: 1 }}>
            <Button variant="secondary" onClick={konfirmasiHapus}>
              Ya
            </Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  )
}

export default RefleksiGrafik
