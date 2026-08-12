const PANJANG_MAKS_MASALAH = 60

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

export function buatKontenIcs(masalah: string, tanggalTargetReview: Date): string {
  const judul = buatJudulAcara(masalah)
  const deskripsi = 'Ingetin buka Runtut buat catat hasil dan lihat kalibrasi keyakinanmu.'

  const tanggalMulai = new Date(
    tanggalTargetReview.getFullYear(),
    tanggalTargetReview.getMonth(),
    tanggalTargetReview.getDate(),
  )
  const tanggalSelesai = new Date(tanggalMulai)
  tanggalSelesai.setDate(tanggalSelesai.getDate() + 1)

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
    `DESCRIPTION:${escapeTeksIcs(deskripsi)}`,
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

export function unduhIcs(namaFile: string, konten: string): void {
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
