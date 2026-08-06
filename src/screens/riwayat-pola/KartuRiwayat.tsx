import type { CSSProperties } from 'react'
import type { Keputusan } from '../../types/keputusan'

const LABEL_STATUS: Record<Keputusan['status'], string> = {
  menunggu_direview: 'Menunggu Direview',
  sudah_direview: 'Sudah Dicek',
}

const tagStyle: CSSProperties = {
  fontSize: '0.8rem',
  color: 'var(--color-ink-muted)',
  border: '1px solid var(--color-ink-muted)',
  borderRadius: 999,
  padding: '2px 10px',
}

const kontainerStyle: CSSProperties = {
  display: 'block',
  width: '100%',
  textAlign: 'left',
  border: '1px solid var(--color-ink-muted)',
  borderRadius: 12,
  padding: 16,
  background: 'transparent',
  color: 'var(--color-ink)',
  fontFamily: 'inherit',
  fontSize: '1rem',
}

function potongMasalah(teks: string): string {
  if (teks.length <= 50) return teks
  return `${teks.slice(0, 50).trimEnd()}…`
}

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

interface KartuRiwayatProps {
  keputusan: Keputusan
  onTap?: () => void
}

function KartuRiwayat({ keputusan, onTap }: KartuRiwayatProps) {
  const isi = (
    <>
      <p style={{ margin: 0, fontWeight: 600 }}>{potongMasalah(keputusan.masalah)}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <span style={tagStyle}>{formatTanggal(keputusan.createdAt)}</span>
        <span style={tagStyle}>{keputusan.kategori}</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={tagStyle}>{LABEL_STATUS[keputusan.status]}</span>
      </div>
    </>
  )

  if (onTap) {
    return (
      <button type="button" onClick={onTap} style={{ ...kontainerStyle, cursor: 'pointer' }}>
        {isi}
      </button>
    )
  }

  return <div style={kontainerStyle}>{isi}</div>
}

export default KartuRiwayat
