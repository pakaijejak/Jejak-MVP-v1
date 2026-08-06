import type { CSSProperties, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'text'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: ButtonVariant
}

const baseStyle: CSSProperties = {
  fontFamily: 'inherit',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '14px 20px',
  borderRadius: '12px',
  cursor: 'pointer',
  width: '100%',
}

const variantStyle: Record<ButtonVariant, CSSProperties> = {
  primary: {
    background: 'var(--color-accent)',
    color: '#ffffff',
    border: 'none',
  },
  secondary: {
    background: 'transparent',
    color: 'var(--color-ink)',
    border: '1.5px solid var(--color-ink)',
  },
  text: {
    background: 'transparent',
    color: 'var(--color-ink-muted)',
    border: 'none',
    fontWeight: 500,
  },
}

function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{ ...baseStyle, ...variantStyle[variant] }}
    >
      {children}
    </button>
  )
}

export default Button
