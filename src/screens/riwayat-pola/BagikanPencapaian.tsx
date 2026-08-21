import { useEffect, useRef, useState } from 'react'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { bagikanKartuPencapaian, buatKartuPencapaian } from '../../lib/kartuPencapaian'
import { ambilRefleksiGrafikTerbaru, hitungKeputusanSudahDicek } from '../../lib/storage'
import { textInputStyle } from '../../styles/formStyles'

const MAKS_KARAKTER_KUTIPAN = 140

interface BagikanPencapaianProps {
  onKembali: () => void
}

function BagikanPencapaian({ onKembali }: BagikanPencapaianProps) {
  const [jumlahKeputusan] = useState(() => hitungKeputusanSudahDicek())
  const [kutipanAsli] = useState(() => ambilRefleksiGrafikTerbaru()?.teks ?? null)
  const [kutipanEdit, setKutipanEdit] = useState(kutipanAsli ?? '')
  const [kutipanDihapus, setKutipanDihapus] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [blobTerkini, setBlobTerkini] = useState<Blob | null>(null)
  const [status, setStatus] = useState<'menyiapkan' | 'siap' | 'error'>('menyiapkan')
  const [sedangMembagikan, setSedangMembagikan] = useState(false)
  const [pesanBagikan, setPesanBagikan] = useState('')
  const previewUrlRef = useRef<string | null>(null)

  useEffect(() => {
    let dibatalkan = false
    const timer = setTimeout(async () => {
      setStatus('menyiapkan')
      try {
        const blob = await buatKartuPencapaian({
          jumlahKeputusan,
          kutipan: kutipanDihapus ? null : kutipanEdit,
        })
        if (dibatalkan) return
        if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
        const url = URL.createObjectURL(blob)
        previewUrlRef.current = url
        setPreviewUrl(url)
        setBlobTerkini(blob)
        setStatus('siap')
      } catch {
        if (!dibatalkan) setStatus('error')
      }
    }, 250)
    return () => {
      dibatalkan = true
      clearTimeout(timer)
    }
  }, [jumlahKeputusan, kutipanEdit, kutipanDihapus])

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    }
  }, [])

  async function handleBagikan() {
    if (!blobTerkini) return
    setSedangMembagikan(true)
    setPesanBagikan('')
    const hasil = await bagikanKartuPencapaian(blobTerkini)
    setSedangMembagikan(false)

    if (hasil === 'diunduh') {
      setPesanBagikan('Gambar kartu berhasil diunduh. Buka galeri HP kamu buat bagikan manual ke Instagram/WhatsApp Story.')
    } else if (hasil === 'gagal') {
      setPesanBagikan('Gagal membagikan kartu. Coba lagi ya.')
    }
  }

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onKembali}
          aria-label="Kembali"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-ink)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Bagikan Pencapaian</h1>
      </div>

      <div
        style={{
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(43, 58, 66, 0.15)',
          aspectRatio: '1080 / 1920',
          background: 'var(--color-surface-raised)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Preview kartu pencapaian"
            style={{ width: '100%', height: '100%', display: 'block', objectFit: 'contain' }}
          />
        ) : (
          <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9rem' }}>
            {status === 'error' ? 'Gagal membuat preview kartu.' : 'Menyiapkan preview...'}
          </p>
        )}
      </div>

      {kutipanAsli !== null && (
        <div>
          {!kutipanDihapus ? (
            <>
              <textarea
                value={kutipanEdit}
                onChange={(e) => setKutipanEdit(e.target.value.slice(0, MAKS_KARAKTER_KUTIPAN))}
                rows={3}
                style={{ ...textInputStyle, resize: 'vertical' }}
              />
              <p style={{ margin: '6px 0 0', fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
                {kutipanEdit.length}/{MAKS_KARAKTER_KUTIPAN} karakter
              </p>
              <button
                type="button"
                onClick={() => setKutipanDihapus(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  marginTop: 6,
                  color: 'var(--color-accent)',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  fontFamily: 'inherit',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Hapus kutipan dari kartu ini
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setKutipanDihapus(false)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: 'var(--color-accent)',
                fontWeight: 600,
                fontSize: '0.85rem',
                fontFamily: 'inherit',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Tampilkan lagi kutipannya di kartu
            </button>
          )}
          <p style={{ margin: '8px 0 0', fontSize: '0.8rem', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
            Perubahan di sini cuma buat kartu yang mau dibagikan, tidak mengubah refleksi yang tersimpan di Riwayat
            &amp; Pola.
          </p>
        </div>
      )}

      <Button variant="primary" onClick={handleBagikan} disabled={status !== 'siap' || sedangMembagikan}>
        Bagikan
      </Button>
      {pesanBagikan && (
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>
          {pesanBagikan}
        </p>
      )}
    </Screen>
  )
}

export default BagikanPencapaian
