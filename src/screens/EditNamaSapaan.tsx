import { useState } from 'react'
import BottomSheet from '../components/BottomSheet'
import Button from '../components/Button'
import { textInputStyle } from '../styles/formStyles'

const MAKS_KARAKTER = 20

interface EditNamaSapaanProps {
  namaSaatIni: string
  onSimpan: (nama: string) => void
}

function EditNamaSapaan({ namaSaatIni, onSimpan }: EditNamaSapaanProps) {
  const [terbuka, setTerbuka] = useState(false)
  const [nilai, setNilai] = useState(namaSaatIni)

  function buka() {
    setNilai(namaSaatIni)
    setTerbuka(true)
  }

  function simpan() {
    onSimpan(nilai)
    setTerbuka(false)
  }

  return (
    <>
      <button
        type="button"
        onClick={buka}
        style={{
          background: 'none',
          border: 'none',
          fontSize: '0.85rem',
          fontWeight: 600,
          color: 'var(--color-accent)',
          cursor: 'pointer',
          padding: 0,
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        {namaSaatIni ? 'Ubah nama' : '+ Kasih nama panggilan'}
      </button>

      <BottomSheet terbuka={terbuka} onTutup={() => setTerbuka(false)}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Mau dipanggil apa?</h3>
        <input
          value={nilai}
          onChange={(e) => setNilai(e.target.value.slice(0, MAKS_KARAKTER))}
          maxLength={MAKS_KARAKTER}
          placeholder="Nama panggilan"
          style={textInputStyle}
          autoFocus
        />
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
          {nilai.length}/{MAKS_KARAKTER} karakter
        </p>
        <Button variant="primary" onClick={simpan}>
          Simpan
        </Button>
      </BottomSheet>
    </>
  )
}

export default EditNamaSapaan
