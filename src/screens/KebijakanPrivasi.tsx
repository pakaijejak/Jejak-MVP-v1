import type { CSSProperties } from 'react'
import Button from '../components/Button'
import Screen from '../components/Screen'

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 8px',
  fontWeight: 700,
  fontSize: '0.8rem',
  color: 'var(--color-ink-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}

const paragrafStyle: CSSProperties = {
  margin: '0 0 8px',
  lineHeight: 1.6,
}

const bulletListStyle: CSSProperties = {
  margin: '0 0 8px',
  paddingLeft: 20,
  lineHeight: 1.6,
}

type Blok = { tipe: 'p'; teks: string } | { tipe: 'ul'; item: string[] }

interface Bagian {
  judul: string
  blok: Blok[]
}

const BAGIAN: Bagian[] = [
  {
    judul: 'Ringkasan Singkat',
    blok: [
      {
        tipe: 'p',
        teks: 'Runtut dirancang supaya isi refleksi dan keputusanmu tidak pernah meninggalkan HP-mu sendiri. Tidak ada server, tidak ada akun, tidak ada AI yang membaca tulisanmu. Data lain (seperti email) cuma dikumpulkan kalau kamu memberikannya sendiri secara sadar, misalnya saat membeli atau memilih untuk dikabari produk baru, dan dipakai sesuai tujuan yang sudah dijelaskan di titik itu.',
      },
      { tipe: 'p', teks: 'Detail lengkapnya di bawah ini.' },
    ],
  },
  {
    judul: '1. Data yang Tersimpan di HP Kamu Sendiri',
    blok: [
      {
        tipe: 'p',
        teks: 'Semua isi refleksi, catatan keputusan, prediksi, hasil, dan riwayatmu tersimpan secara lokal di penyimpanan browser HP kamu (localStorage). Data ini:',
      },
      {
        tipe: 'ul',
        item: [
          'Tidak pernah dikirim ke server mana pun, karena Runtut memang tidak punya server',
          'Tidak pernah dibaca atau diproses oleh AI dalam bentuk apa pun',
          'Tidak bisa diakses oleh pembuat Runtut, kecuali kamu sendiri yang menunjukkannya',
        ],
      },
      {
        tipe: 'p',
        teks: 'Kalau kamu uninstall aplikasi atau menghapus data browser, data ini akan hilang dan tidak bisa dipulihkan oleh pembuat Runtut, karena memang tidak pernah tersimpan di tempat lain.',
      },
    ],
  },
  {
    judul: '2. Data yang Kamu Ekspor Sendiri (Fitur Cadangkan Data)',
    blok: [
      {
        tipe: 'p',
        teks: 'Runtut menyediakan fitur untuk mencadangkan datamu jadi kode teks, supaya bisa dipulihkan kalau kamu ganti HP atau install ulang. Kode ini:',
      },
      {
        tipe: 'ul',
        item: [
          'Dibuat sepenuhnya di HP kamu, tanpa melalui server mana pun',
          'Sepenuhnya jadi tanggung jawab dan kendali kamu untuk menyimpannya di tempat yang aman',
          'Tidak pernah dikirim atau diketahui oleh pembuat Runtut',
        ],
      },
    ],
  },
  {
    judul: '3. Data yang Dikumpulkan Lewat Google Form (Opsional)',
    blok: [
      {
        tipe: 'p',
        teks: 'Kalau kamu memilih untuk dikabari soal produk baru, kamu akan diarahkan ke Google Form terpisah dari aplikasi. Di situ kamu bisa memberikan nama dan email.',
      },
      {
        tipe: 'ul',
        item: [
          'Data ini tersimpan di infrastruktur Google, mengikuti kebijakan privasi Google Forms',
          'Dipakai HANYA untuk mengabari produk digital baru dari Runtut, bukan untuk tujuan lain',
          'Kamu bisa berhenti menerima email kapan saja lewat link unsubscribe di tiap email yang dikirim',
          'Data ini sepenuhnya terpisah dari isi refleksi/keputusanmu di dalam aplikasi',
        ],
      },
    ],
  },
  {
    judul: '4. Data yang Dikumpulkan Saat Pembelian Lewat Lynk.id',
    blok: [
      {
        tipe: 'p',
        teks: 'Saat membeli Runtut lewat Lynk.id, kamu diminta memberikan email (wajib dari sistem Lynk) dan nomor HP (opsional). Data ini:',
      },
      {
        tipe: 'ul',
        item: [
          'Dikumpulkan dan disimpan oleh Lynk.id, mengikuti kebijakan privasi mereka sendiri',
          'Dipakai pembuat Runtut untuk mengirimkan kode akses pembelian, dan (kalau kamu setuju lewat pertanyaan consent terpisah) untuk info produk lain di kemudian hari',
          'Tidak dijual atau dibagikan ke pihak ketiga di luar keperluan itu',
        ],
      },
    ],
  },
  {
    judul: '5. Data yang Kamu Kirim Lewat Fitur Bantuan & Masukan',
    blok: [
      {
        tipe: 'p',
        teks: 'Kalau kamu memakai fitur "Bantuan & Masukan" di dalam aplikasi, pesanmu dikirim langsung lewat aplikasi email milikmu sendiri ke alamat email pembuat Runtut. Ini murni inisiatif kamu sendiri, dan isinya cuma dipakai untuk menjawab pertanyaan atau menindaklanjuti masukanmu.',
      },
    ],
  },
  {
    judul: '6. Yang Tidak Dilakukan Runtut',
    blok: [
      {
        tipe: 'ul',
        item: [
          'Tidak menjalankan AI atau model bahasa apa pun untuk memproses isi refleksimu',
          'Tidak memasang pelacak (analytics/tracker) pihak ketiga di dalam aplikasi',
          'Tidak menjual atau membagikan datamu ke pengiklan',
          'Tidak menyimpan isi refleksimu di server mana pun',
        ],
      },
    ],
  },
  {
    judul: '7. Hak Kamu',
    blok: [
      {
        tipe: 'p',
        teks: 'Untuk data yang dikumpulkan lewat Google Form atau Lynk.id, kamu berhak:',
      },
      {
        tipe: 'ul',
        item: [
          'Meminta data itu dihapus, dengan menghubungi kontak di bagian bawah',
          'Berhenti menerima komunikasi kapan saja',
        ],
      },
    ],
  },
  {
    judul: '8. Perubahan Kebijakan',
    blok: [
      {
        tipe: 'p',
        teks: 'Kebijakan ini bisa diperbarui dari waktu ke waktu. Perubahan penting akan dicantumkan dengan tanggal pembaruan di bagian atas dokumen ini.',
      },
    ],
  },
  {
    judul: '9. Kontak',
    blok: [{ tipe: 'p', teks: 'Ada pertanyaan soal privasi datamu? Hubungi: runtut.support@gmail.com' }],
  },
]

function KebijakanPrivasi() {
  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <a
          href="/"
          aria-label="Kembali ke gerbang kode akses"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-ink)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            textDecoration: 'none',
          }}
        >
          ←
        </a>
        <h1 style={{ margin: 0, fontSize: '1.3rem' }}>Kebijakan Privasi</h1>
      </div>

      <p style={{ margin: 0, color: 'var(--color-ink-muted)', fontSize: '0.85rem' }}>
        Berlaku mulai: 10 Agustus 2026
      </p>

      {BAGIAN.map((bagian) => (
        <section key={bagian.judul}>
          <p style={sectionTitleStyle}>{bagian.judul}</p>
          {bagian.blok.map((blok, index) =>
            blok.tipe === 'p' ? (
              <p key={index} style={paragrafStyle}>
                {blok.teks}
              </p>
            ) : (
              <ul key={index} style={bulletListStyle}>
                {blok.item.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ),
          )}
        </section>
      ))}

      <Button variant="secondary" onClick={() => (window.location.href = '/')}>
        Kembali
      </Button>
    </Screen>
  )
}

export default KebijakanPrivasi
