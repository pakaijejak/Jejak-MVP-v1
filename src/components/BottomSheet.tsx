import type { ReactNode } from 'react'

interface BottomSheetProps {
  terbuka: boolean
  onTutup: () => void
  children: ReactNode
}

function BottomSheet({ terbuka, onTutup, children }: BottomSheetProps) {
  if (!terbuka) return null

  return (
    <div
      onClick={onTutup}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(43, 58, 66, 0.4)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          background: 'var(--color-surface)',
          borderRadius: '20px 20px 0 0',
          padding: 24,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default BottomSheet
