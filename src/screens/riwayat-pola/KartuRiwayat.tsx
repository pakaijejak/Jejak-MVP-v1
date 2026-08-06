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
  cursor: 'pointer',
}

function potongMasalah(teks: string): string {
  if (teks.length <= 50) return teks
  return `${teks.slice(0, 50).trimEnd()}…`
}

function formatTanggal(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function MiniVisualisasi({ keyakinanAwal, hasilPersen }: { keyakinanAwal: number; hasilPersen: number }) {
  return (
    <svg
      viewBox="0 0 100 16"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 16, display: 'block', marginTop: 10 }}
      aria-hidden="true"
    >
      <line x1={0} y1={8} x2={100} y2={8} stroke="var(--color-ink-muted)" strokeWidth={1} />
      <circle cx={keyakinanAwal} cy={8} r={3} fill="#C1793F" />
      <circle cx={hasilPersen} cy={8} r={3} fill="#2B3A42" />
    </svg>
  )
}

interface KartuRiwayatProps {
  keputusan: Keputusan
  onTap: () => void
}

function KartuRiwayat({ keputusan, onTap }: KartuRiwayatProps) {
  return (
    <button type="button" onClick={onTap} style={kontainerStyle}>
      <p style={{ margin: 0, fontWeight: 600 }}>{potongMasalah(keputusan.masalah)}</p>

      {keputusan.status === 'sudah_direview' && keputusan.hasilPersen !== undefined && (
        <MiniVisualisasi keyakinanAwal={keputusan.keyakinanAwal} hasilPersen={keputusan.hasilPersen} />
      )}

      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <span style={tagStyle}>{formatTanggal(keputusan.createdAt)}</span>
        <span style={tagStyle}>{keputusan.kategori}</span>
      </div>
      <div style={{ marginTop: 8 }}>
        <span style={tagStyle}>{LABEL_STATUS[keputusan.status]}</span>
      </div>
    </button>
  )
}

export default KartuRiwayat
