import type { CSSProperties } from 'react'
import type { Keputusan } from '../../types/keputusan'

const LABEL_STATUS: Record<Keputusan['status'], string> = {
  menunggu_direview: 'Menunggu Direview',
  sudah_direview: 'Sudah Dicek',
}

function potongMasalah(teks: string): string {
  if (teks.length <= 50) return teks
  return `${teks.slice(0, 50).trimEnd()}…`
}

function formatHari(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: '2-digit' })
}

function formatBulanSingkat(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { month: 'short' }).slice(0, 3).toUpperCase()
}

function MiniVisualisasi({ keyakinanAwal, hasilPersen }: { keyakinanAwal: number; hasilPersen: number }) {
  return (
    <svg
      viewBox="0 0 100 16"
      preserveAspectRatio="none"
      style={{ width: '100%', height: 16, display: 'block', marginTop: 8 }}
      aria-hidden="true"
    >
      <line x1={0} y1={8} x2={100} y2={8} stroke="var(--color-ink-muted)" strokeWidth={1} />
      <circle cx={keyakinanAwal} cy={8} r={3} fill="#C1793F" />
      <circle cx={hasilPersen} cy={8} r={3} fill="#2B3A42" />
    </svg>
  )
}

function IkonCentang() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" role="img" aria-label="Sudah Dicek">
      <path
        d="M5 13l4 4L19 7"
        stroke="var(--color-ink-muted)"
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IkonJam() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" role="img" aria-label="Menunggu Direview">
      <circle cx="12" cy="12" r="9" stroke="var(--color-ink-muted)" strokeWidth={2} />
      <path d="M12 7v5l3.5 2" stroke="var(--color-ink-muted)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

interface KartuRiwayatProps {
  keputusan: Keputusan
  onTap: () => void
  tanpaGarisBawah?: boolean
}

function KartuRiwayat({ keputusan, onTap, tanpaGarisBawah }: KartuRiwayatProps) {
  const kontainerStyle: CSSProperties = {
    display: 'block',
    width: '100%',
    textAlign: 'left',
    border: 'none',
    borderBottom: tanpaGarisBawah ? 'none' : '0.5px solid var(--color-hairline)',
    padding: '14px 0',
    background: 'transparent',
    color: 'var(--color-ink)',
    fontFamily: 'inherit',
    fontSize: '1rem',
    cursor: 'pointer',
  }

  return (
    <button type="button" onClick={onTap} style={kontainerStyle} aria-label={LABEL_STATUS[keputusan.status]}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ width: 32, flexShrink: 0, textAlign: 'center' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 500, color: 'var(--color-ink)', lineHeight: 1.1 }}>
            {formatHari(keputusan.createdAt)}
          </div>
          <div
            style={{
              fontSize: '0.65rem',
              fontWeight: 600,
              color: 'var(--color-ink-muted)',
              letterSpacing: '0.03em',
              marginTop: 2,
            }}
          >
            {formatBulanSingkat(keputusan.createdAt)}
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontStyle: 'italic' }}>{potongMasalah(keputusan.masalah)}</p>
          <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: 'var(--color-accent)' }}>{keputusan.kategori}</p>

          {keputusan.status === 'sudah_direview' && keputusan.hasilPersen !== undefined && (
            <MiniVisualisasi keyakinanAwal={keputusan.keyakinanAwal} hasilPersen={keputusan.hasilPersen} />
          )}
        </div>

        <div style={{ flexShrink: 0, paddingTop: 2 }}>
          {keputusan.status === 'sudah_direview' ? <IkonCentang /> : <IkonJam />}
        </div>
      </div>
    </button>
  )
}

export default KartuRiwayat
