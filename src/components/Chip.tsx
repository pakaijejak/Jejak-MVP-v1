interface ChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

function Chip({ label, selected, onClick }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '10px 16px',
        borderRadius: 999,
        border: selected ? '1.5px solid var(--color-accent)' : '1.5px solid var(--color-ink-muted)',
        background: selected ? 'var(--color-accent)' : 'transparent',
        color: selected ? '#ffffff' : 'var(--color-ink)',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}

export default Chip
