import type { CSSProperties, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary'

interface ButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: ButtonVariant
  disabled?: boolean
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
}

const disabledStyle: CSSProperties = {
  opacity: 0.45,
  cursor: 'not-allowed',
}

function Button({ children, onClick, variant = 'primary', disabled = false }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        ...baseStyle,
        ...variantStyle[variant],
        ...(disabled ? disabledStyle : {}),
      }}
    >
      {children}
    </button>
  )
}

export default Button
