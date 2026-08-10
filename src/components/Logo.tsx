// Lockup 5 garis menyempit ke tengah — proporsi lebar relatif terhadap garis
// terlebar: 100% - 80% - 60% - 80% - 100%, sudut membulat di tiap ujung garis.
const PROPORSI_LEBAR = [1, 0.8, 0.6, 0.8, 1]

interface LogoProps {
  lebarTerlebar: number
  tinggiGaris: number
  jarakGaris: number
}

function Logo({ lebarTerlebar, tinggiGaris, jarakGaris }: LogoProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: jarakGaris }}>
      {PROPORSI_LEBAR.map((proporsi, index) => (
        <div
          key={index}
          style={{
            width: lebarTerlebar * proporsi,
            height: tinggiGaris,
            borderRadius: tinggiGaris / 2,
            background: 'var(--color-ink)',
          }}
        />
      ))}
    </div>
  )
}

export default Logo
