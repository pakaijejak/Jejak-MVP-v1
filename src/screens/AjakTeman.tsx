import { useCallback, useEffect, useState } from 'react'
import Button from '../components/Button'
import BottomSheet from '../components/BottomSheet'
import Screen from '../components/Screen'
import { ambilStatusReferral, kirimNamaTampilanReferral, type StatusReferral } from '../lib/referralApi'
import { ambilKodeReferralSaya, ambilNamaTampilanReferral, setNamaTampilanReferral } from '../lib/storage'
import { textInputStyle } from '../styles/formStyles'

// Ambang ditentukan di server (worker/referral.ts), diduplikasi di sini cuma
// untuk progress bar. Kalau ambang server berubah, ini cuma memengaruhi
// tampilan progress, bukan keputusan reward (itu 100% dari server).
const AMBANG_TAMPILAN = 5
const MAKS_KARAKTER_NAMA = 40

interface AjakTemanProps {
  onKembali: () => void
}

function buatLinkReferral(kode: string): string {
  return `${window.location.origin}/?ref=${encodeURIComponent(kode)}`
}

function AjakTeman({ onKembali }: AjakTemanProps) {
  const [kodeSaya] = useState(() => ambilKodeReferralSaya())
  const [status, setStatus] = useState<'memuat' | 'berhasil' | 'gagal'>('memuat')
  const [data, setData] = useState<StatusReferral | null>(null)
  const [pesanBagikan, setPesanBagikan] = useState('')
  const [sheetNamaTerbuka, setSheetNamaTerbuka] = useState(false)
  const [namaInput, setNamaInput] = useState(() => ambilNamaTampilanReferral())
  const [namaTersimpan, setNamaTersimpan] = useState(() => ambilNamaTampilanReferral())
  const [mengirimNama, setMengirimNama] = useState(false)

  const muatStatus = useCallback(async () => {
    setStatus('memuat')
    const hasil = await ambilStatusReferral(kodeSaya)
    if (!hasil) {
      setStatus('gagal')
      return
    }
    setData(hasil)
    setStatus('berhasil')
  }, [kodeSaya])

  useEffect(() => {
    muatStatus()
  }, [muatStatus])

  async function bagikan() {
    const url = buatLinkReferral(kodeSaya)
    const teks = 'Aku pakai Runtut buat bantu ambil keputusan, coba juga yuk:'

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: 'Runtut', text: teks, url })
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        salinLink(url)
      }
      return
    }

    salinLink(url)
  }

  function salinLink(url: string) {
    if (typeof navigator.clipboard?.writeText === 'function') {
      navigator.clipboard
        .writeText(url)
        .then(() => setPesanBagikan('Link disalin ke clipboard.'))
        .catch(() => setPesanBagikan(url))
      return
    }
    setPesanBagikan(url)
  }

  async function simpanNama() {
    const bersih = namaInput.trim()
    if (!bersih) {
      setSheetNamaTerbuka(false)
      return
    }
    setMengirimNama(true)
    const berhasil = await kirimNamaTampilanReferral(kodeSaya, bersih)
    setMengirimNama(false)
    if (berhasil) {
      setNamaTampilanReferral(bersih)
      setNamaTersimpan(bersih)
      setSheetNamaTerbuka(false)
    } else {
      setPesanBagikan('Gagal simpan nama, coba lagi nanti.')
    }
  }

  const jumlah = data?.jumlah ?? 0
  const sudahCapaiAmbang = data !== null && (data.jumlah >= AMBANG_TAMPILAN || data.kodeReward !== null)

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
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Ajak Teman</h1>
      </div>

      <p style={{ margin: 0, lineHeight: 1.5 }}>Bagikan link ini ke teman yang mungkin butuh Runtut juga:</p>

      <div
        style={{
          padding: '12px 14px',
          borderRadius: 12,
          border: '1.5px solid var(--color-ink-muted)',
          fontFamily: 'monospace',
          fontSize: '0.95rem',
          wordBreak: 'break-all',
        }}
      >
        {buatLinkReferral(kodeSaya)}
      </div>

      <div>
        <Button variant="primary" onClick={bagikan}>
          Bagikan
        </Button>
        {pesanBagikan && (
          <p style={{ margin: '8px 0 0', fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>{pesanBagikan}</p>
        )}
      </div>

      {status === 'memuat' && (
        <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>Memuat data referral...</p>
      )}

      {status === 'gagal' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>
            Gak bisa ambil data referral sekarang. Coba lagi kalau koneksi sudah normal.
          </p>
          <Button variant="secondary" onClick={muatStatus}>
            Coba Lagi
          </Button>
        </div>
      )}

      {status === 'berhasil' && !sudahCapaiAmbang && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{ margin: 0, fontWeight: 600 }}>Kamu udah berhasil ajak {jumlah} teman!</p>
          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: 'rgba(43, 58, 66, 0.1)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                width: `${Math.min(100, (jumlah / AMBANG_TAMPILAN) * 100)}%`,
                background: 'var(--color-accent)',
                borderRadius: 999,
              }}
            />
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
            {AMBANG_TAMPILAN - jumlah} lagi menuju kode Runtut Mendalam gratis.
          </p>
        </div>
      )}

      {status === 'berhasil' && sudahCapaiAmbang && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data?.kodeReward ? (
            <>
              <p style={{ margin: 0, fontWeight: 600 }}>Kamu berhasil! Ini kode Runtut Mendalam gratismu:</p>
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 12,
                  background: 'rgba(193, 121, 63, 0.12)',
                  fontFamily: 'monospace',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  textAlign: 'center',
                }}
              >
                {data.kodeReward}
              </div>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--color-ink-muted)' }}>
                Simpan baik-baik, dipakai nanti begitu Runtut Mendalam rilis.
              </p>
            </>
          ) : (
            <p style={{ margin: 0, lineHeight: 1.5 }}>
              Kamu berhasil capai ambang! Kode Runtut Mendalam-mu akan muncul di sini begitu produknya siap rilis.
            </p>
          )}
        </div>
      )}

      <div>
        <button
          type="button"
          onClick={() => setSheetNamaTerbuka(true)}
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
          {namaTersimpan ? 'Ubah nama panggilan di papan peringkat' : '+ Kasih nama panggilan'}
        </button>
        <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
          Opsional, buat muncul di papan peringkat. Beda dari nama sapaan di Beranda.
        </p>
      </div>

      <BottomSheet terbuka={sheetNamaTerbuka} onTutup={() => setSheetNamaTerbuka(false)}>
        <h3 style={{ margin: 0, fontSize: '1.05rem' }}>Mau muncul sebagai siapa di papan peringkat?</h3>
        <input
          value={namaInput}
          onChange={(e) => setNamaInput(e.target.value.slice(0, MAKS_KARAKTER_NAMA))}
          maxLength={MAKS_KARAKTER_NAMA}
          placeholder="Nama panggilan"
          style={textInputStyle}
          autoFocus
        />
        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--color-ink-muted)' }}>
          {namaInput.length}/{MAKS_KARAKTER_NAMA} karakter
        </p>
        <Button variant="primary" onClick={simpanNama} disabled={mengirimNama}>
          Simpan
        </Button>
      </BottomSheet>
    </Screen>
  )
}

export default AjakTeman
