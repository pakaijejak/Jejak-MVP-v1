import type { ReactNode } from 'react'

function Screen({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 24,
        padding: '32px 24px',
        maxWidth: 480,
        margin: '0 auto',
      }}
    >
      {children}
    </div>
  )
}

export default Screen
