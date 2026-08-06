import Button from '../../components/Button'
import Screen from '../../components/Screen'
import type { Keputusan } from '../../types/keputusan'

interface KartuRingkasanProps {
  keputusan: Keputusan
  onSelesai: () => void
}

function KartuRingkasan({ keputusan, onSelesai }: KartuRingkasanProps) {
  const opsiTerpilih = keputusan.opsi[keputusan.opsiTerpilihIndex]?.teks ?? '-'

  return (
    <Screen>
      <p style={{ margin: 0, fontWeight: 600, fontSize: '1.1rem' }}>{keputusan.masalah}</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-ink-muted)', fontSize: '0.8rem' }}>
            SEBELUM
          </p>
          <p style={{ margin: 0 }}>Keyakinan: {keputusan.keyakinanAwal}%</p>
          <p style={{ margin: 0 }}>Opsi dipilih: {opsiTerpilih}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <p style={{ margin: 0, fontWeight: 600, color: 'var(--color-ink-muted)', fontSize: '0.8rem' }}>
            SESUDAH
          </p>
          <p style={{ margin: 0 }}>Hasil: {keputusan.hasilAktual}</p>
          <p style={{ margin: 0 }}>Kalibrasi: {keputusan.skorKalibrasi}</p>
          <p style={{ margin: 0 }}>Pelajaran: {keputusan.refleksi?.halYangBedaKedepan || '-'}</p>
        </div>
      </div>

      <Button variant="primary" onClick={onSelesai}>
        Selesai
      </Button>
    </Screen>
  )
}

export default KartuRingkasan
