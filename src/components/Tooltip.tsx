import { useState } from 'react'
import BottomSheet from './BottomSheet'

interface TooltipProps {
  istilah: string
  isi: string
}

function Tooltip({ istilah, isi }: TooltipProps) {
  const [terbuka, setTerbuka] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setTerbuka(true)}
        aria-label={`Info: ${istilah}`}
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: '1.5px solid var(--color-ink-muted)',
          background: 'transparent',
          color: 'var(--color-ink-muted)',
          fontSize: '0.75rem',
          lineHeight: 1,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontFamily: 'inherit',
        }}
      >
        ?
      </button>

      <BottomSheet terbuka={terbuka} onTutup={() => setTerbuka(false)}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>{istilah}</h3>
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>{isi}</p>
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

export default Tooltip
