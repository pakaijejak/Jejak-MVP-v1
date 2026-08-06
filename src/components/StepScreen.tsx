import type { ReactNode } from 'react'

interface StepScreenProps {
  step: number
  totalSteps: number
  onKembali: () => void
  children: ReactNode
}

function StepScreen({ step, totalSteps, onKembali, children }: StepScreenProps) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: '24px 24px 40px',
        maxWidth: 480,
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
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
        <span style={{ color: 'var(--color-ink-muted)', fontSize: '0.85rem' }}>
          Langkah {step} dari {totalSteps}
        </span>
      </div>
      {children}
    </div>
  )
}

export default StepScreen
