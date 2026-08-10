import type { CSSProperties } from 'react'

export const labelStyle: CSSProperties = {
  fontWeight: 600,
  fontSize: '1.1rem',
  margin: 0,
}

export const textInputStyle: CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '1rem',
  padding: '12px 14px',
  borderRadius: 12,
  border: '1.5px solid var(--color-ink-muted)',
  background: 'transparent',
  color: 'var(--color-ink)',
  width: '100%',
  boxSizing: 'border-box',
}

export const nudgeCardStyle: CSSProperties = {
  background: 'rgba(193, 121, 63, 0.12)',
  borderRadius: 12,
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
}
