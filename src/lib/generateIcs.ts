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

// Pakai atribut `download` (bukan target="_blank" ke blob URL). `download`
// adalah unduhan blob langsung, bukan navigasi ke tab baru, jadi tidak kena
// popup-blocker dan benar-benar memicu notifikasi "Download selesai" yang
// nyata di HP -- beda dari pendekatan sebelumnya yang bisa di-block browser
// secara diam-diam tanpa exception apa pun.
function unduhIcs(namaFile: string, konten: string): void {
  const blob = new Blob([konten], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = namaFile
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export type HasilTambahKalenderLain = 'dibagikan' | 'dibatalkan' | 'diunduh' | 'gagal'

// Lampirkan file .ics ke menu share asli Android (navigator.share), supaya
// user pilih sendiri app kalender yang mereka mau, bukan sistem yang
// menebak.
//
// PENTING: fallback unduh manual HANYA dipicu di jalur yang sepenuhnya
// sinkron dari tap user (saat share file sejak awal tidak didukung),
// SEBELUM ada `await` apa pun. Sengaja TIDAK mencoba fallback unduh SETELAH
// navigator.share() gagal/reject -- begitu share() dipanggil, ia
// mengonsumsi transient activation dari tap user (berhasil maupun gagal),
// jadi trigger unduhan susulan di titik itu berisiko besar diblokir browser
// secara diam-diam tanpa exception apa pun, membuat kita mengira triggernya
// berhasil padahal tidak terjadi apa-apa di HP. Makanya kalau share() gagal
// (bukan dibatalkan user), kita laporkan gagal secara jujur, bukan berasumsi
// berhasil dengan pesan sukses palsu.
export async function tambahKeKalenderLain(namaFile: string, konten: string): Promise<HasilTambahKalenderLain> {
  const file = new File([konten], namaFile, { type: 'text/calendar' })
  const dukungShareFile =
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function' &&
    navigator.canShare({ files: [file] })

  if (!dukungShareFile) {
    unduhIcs(namaFile, konten)
    return 'diunduh'
  }

  try {
    await navigator.share({ files: [file] })
    return 'dibagikan'
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      return 'dibatalkan'
    }
    return 'gagal'
  }
}
