const PANJANG_MAKS_MASALAH = 60
const DESKRIPSI_ACARA = 'Ingetin buka Runtut buat catat hasil dan lihat kalibrasi keyakinanmu.'

function potongMasalah(masalah: string): string {
  if (masalah.length <= PANJANG_MAKS_MASALAH) return masalah
  return `${masalah.slice(0, PANJANG_MAKS_MASALAH).trimEnd()}...`
}

export function buatJudulAcara(masalah: string): string {
  return `Cek hasil keputusan: ${potongMasalah(masalah)}`
}

function formatTanggalIcs(tanggal: Date): string {
  const tahun = tanggal.getFullYear()
  const bulan = String(tanggal.getMonth() + 1).padStart(2, '0')
  const hari = String(tanggal.getDate()).padStart(2, '0')
  return `${tahun}${bulan}${hari}`
}

function formatWaktuUtcIcs(tanggal: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return (
    `${tanggal.getUTCFullYear()}${pad(tanggal.getUTCMonth() + 1)}${pad(tanggal.getUTCDate())}` +
    `T${pad(tanggal.getUTCHours())}${pad(tanggal.getUTCMinutes())}${pad(tanggal.getUTCSeconds())}Z`
  )
}

function escapeTeksIcs(teks: string): string {
  return teks.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

// Acara sehari penuh: tanggal akhir standar iCal/Google Calendar HARUS 1 hari
// setelah tanggal mulai, kalau tidak acaranya bakal tampil 2 hari.
function rentangTanggalAllDay(tanggalTargetReview: Date): { mulai: Date; selesai: Date } {
  const mulai = new Date(
    tanggalTargetReview.getFullYear(),
    tanggalTargetReview.getMonth(),
    tanggalTargetReview.getDate(),
  )
  const selesai = new Date(mulai)
  selesai.setDate(selesai.getDate() + 1)
  return { mulai, selesai }
}

export function buatKontenIcs(masalah: string, tanggalTargetReview: Date): string {
  const judul = buatJudulAcara(masalah)
  const { mulai: tanggalMulai, selesai: tanggalSelesai } = rentangTanggalAllDay(tanggalTargetReview)

  const waktuAlarmLokal = new Date(
    tanggalMulai.getFullYear(),
    tanggalMulai.getMonth(),
    tanggalMulai.getDate(),
    9,
    0,
    0,
  )

  const uid = `runtut-${formatTanggalIcs(tanggalMulai)}-${Math.random().toString(36).slice(2, 10)}@runtut.app`

  const baris = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Runtut//Cek Ulang Keputusan//ID',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatWaktuUtcIcs(new Date())}`,
    `DTSTART;VALUE=DATE:${formatTanggalIcs(tanggalMulai)}`,
    `DTEND;VALUE=DATE:${formatTanggalIcs(tanggalSelesai)}`,
    `SUMMARY:${escapeTeksIcs(judul)}`,
    `DESCRIPTION:${escapeTeksIcs(DESKRIPSI_ACARA)}`,
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeTeksIcs(judul)}`,
    `TRIGGER;VALUE=DATE-TIME:${formatWaktuUtcIcs(waktuAlarmLokal)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]

  return baris.join('\r\n')
}

// Link langsung ke Google Calendar, tanpa file sama sekali, jadi tidak
// bergantung pada bagaimana HP menangani file .ics. Catatan jujur: jalur ini
// TIDAK bisa mengatur alarm spesifik jam 9 pagi seperti di buatKontenIcs,
// Google Calendar akan pakai pengaturan notifikasi default mereka sendiri
// untuk acara sehari penuh. Ini pertukaran yang diterima demi keandalan.
export function buatUrlGoogleCalendar(masalah: string, tanggalTargetReview: Date): string {
  const judul = buatJudulAcara(masalah)
  const { mulai, selesai } = rentangTanggalAllDay(tanggalTargetReview)

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: judul,
    dates: `${formatTanggalIcs(mulai)}/${formatTanggalIcs(selesai)}`,
    details: DESKRIPSI_ACARA,
  })

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

// Tanpa atribut `download`, supaya browser mencoba menangani tipe
// text/calendar langsung lewat pilihan "Buka dengan" (app Kalender), bukan
// otomatis unduh ke folder Downloads. Perilaku ini beda-beda tergantung
// versi Chrome/Android; kalau browser tetap memilih untuk mengunduh, itu
// bukan kesalahan di sini, jadi tetap dibarengi panduan manual di UI.
function bukaIcs(konten: string): void {
  const blob = new Blob([konten], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.target = '_blank'
  link.rel = 'noopener'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  // Revoke ditunda karena penanganan file (buka app Kalender / unduh) di HP
  // berjalan async, revoke terlalu cepat bisa bikin browser gagal memuatnya.
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

export type HasilBagikanIcs = 'dibagikan' | 'dibatalkan' | 'fallback'

// Lampirkan file .ics ke menu share asli Android (navigator.share), supaya
// user pilih sendiri app kalender yang mereka mau, bukan sistem yang
// menebak. Kalau browser tidak dukung share file (canShare), jatuh ke cara
// unduh manual yang sudah ada, dibarengi pesan panduan di UI.
export async function bagikanAtauBukaIcs(namaFile: string, konten: string): Promise<HasilBagikanIcs> {
  const file = new File([konten], namaFile, { type: 'text/calendar' })
  const bisaBagikanFile =
    typeof navigator.canShare === 'function' && typeof navigator.share === 'function' && navigator.canShare({ files: [file] })

  if (bisaBagikanFile) {
    try {
      await navigator.share({ files: [file] })
      return 'dibagikan'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'dibatalkan'
      }
      // gagal karena alasan lain (jarang), jatuh ke fallback unduh manual di bawah
    }
  }

  bukaIcs(konten)
  return 'fallback'
}
