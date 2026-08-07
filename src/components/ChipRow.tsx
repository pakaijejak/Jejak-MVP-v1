import type { CSSProperties, ReactNode } from 'react'

const containerStyle: CSSProperties = {
  overflowX: 'auto',
  WebkitOverflowScrolling: 'touch',
}

function ChipRow({ children }: { children: ReactNode }) {
  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', gap: 10, width: 'max-content', paddingBottom: 4 }}>{children}</div>
    </div>
  )
}

export default ChipRow
