// Generate kartu gambar pencapaian (canvas) untuk dibagikan ke sosial media,
// murni lokal di HP -- tidak ada Worker/server yang terlibat sama sekali.

const LEBAR = 1080
const TINGGI = 1920
const WARNA_LATAR = '#F7F2E9' // Parchment
const WARNA_INK = '#2B3A42' // Ink Navy
const WARNA_INK_MUTED = '#5C6B74'

export interface DataKartuPencapaian {
  jumlahKeputusan: number
  kutipan: string | null // teks lanjutan setelah "Ternyata", tanpa prefiksnya
}

// Pastikan Plus Jakarta Sans (di-bundle lewat @fontsource) benar-benar sudah
// termuat sebelum canvas menggambar teks -- kalau tidak, teks bisa kegambar
// pakai font fallback sistem dulu sebelum font asli sempat siap.
async function pastikanFontSiap(): Promise<void> {
  const spesifikasi = ['700 60px "Plus Jakarta Sans"', 'italic 500 40px "Plus Jakarta Sans"', '600 32px "Plus Jakarta Sans"']
  await Promise.all(spesifikasi.map((spec) => document.fonts.load(spec)))
  await document.fonts.ready
}

function bungkusTeksSemua(ctx: CanvasRenderingContext2D, teks: string, maxWidth: number): string[] {
  const kata = teks.split(/\s+/).filter(Boolean)
  const baris: string[] = []
  let current = ''

  for (const kataIni of kata) {
    const cobaan = current ? `${current} ${kataIni}` : kataIni
    if (current && ctx.measureText(cobaan).width > maxWidth) {
      baris.push(current)
      current = kataIni
    } else {
      current = cobaan
    }
  }
  if (current) baris.push(current)
  return baris
}

// Sama seperti bungkusTeksSemua, tapi dibatasi jumlah barisnya -- kelebihan
// dipotong dan baris terakhir diberi elipsis, supaya kutipan yang sangat
// panjang tidak pernah menabrak lockup logo di bawahnya.
function bungkusTeksDenganBatas(
  ctx: CanvasRenderingContext2D,
  teks: string,
  maxWidth: number,
  maxBaris: number,
): string[] {
  const semua = bungkusTeksSemua(ctx, teks, maxWidth)
  if (semua.length <= maxBaris) return semua

  const dipotong = semua.slice(0, maxBaris)
  let terakhir = dipotong[maxBaris - 1]
  while (terakhir.length > 1 && ctx.measureText(`${terakhir}…`).width > maxWidth) {
    terakhir = terakhir.slice(0, -1).trimEnd()
  }
  dipotong[maxBaris - 1] = `${terakhir}…`
  return dipotong
}

// Batang bulat mengikuti proporsi src/components/Logo.tsx: 3 garis, lebar
// 100% - 59% - 100%, ujung membulat.
function gambarBatangBulat(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const r = h / 2
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
  ctx.fill()
}

function gambarLogoLockup(ctx: CanvasRenderingContext2D, centerX: number, mulaiY: number): void {
  const lebarTerlebar = 180
  const tinggiGaris = 18
  const jarakGaris = 14
  const proporsiLebar = [1, 0.59, 1]

  ctx.fillStyle = WARNA_INK
  let y = mulaiY
  for (const proporsi of proporsiLebar) {
    const w = lebarTerlebar * proporsi
    gambarBatangBulat(ctx, centerX - w / 2, y, w, tinggiGaris)
    y += tinggiGaris + jarakGaris
  }

  ctx.fillStyle = WARNA_INK_MUTED
  ctx.font = '600 32px "Plus Jakarta Sans"'
  ctx.textAlign = 'center'
  ctx.fillText('RUNTUT', centerX, y + 34)
}

export async function buatKartuPencapaian(data: DataKartuPencapaian): Promise<Blob> {
  await pastikanFontSiap()

  const canvas = document.createElement('canvas')
  canvas.width = LEBAR
  canvas.height = TINGGI
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D context tidak tersedia')

  ctx.fillStyle = WARNA_LATAR
  ctx.fillRect(0, 0, LEBAR, TINGGI)

  const centerX = LEBAR / 2
  const maxTextWidth = 860
  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'
  const headingLineHeight = 76
  const kutipanLineHeight = 56
  const gapHeadingKeKutipan = 40

  ctx.font = '700 60px "Plus Jakarta Sans"'
  const headingBaris = bungkusTeksSemua(
    ctx,
    `🧠 Aku udah ${data.jumlahKeputusan} keputusan direfleksikan bareng Runtut`,
    maxTextWidth,
  )

  const kutipanBersih = data.kutipan?.trim()
  let kutipanBaris: string[] = []
  if (kutipanBersih) {
    ctx.font = 'italic 500 40px "Plus Jakarta Sans"'
    kutipanBaris = bungkusTeksDenganBatas(ctx, `Ternyata ${kutipanBersih}`, maxTextWidth, 4)
  }

  // Blok heading+kutipan diposisikan di tengah area di atas logo, bukan Y
  // tetap -- supaya kartu tanpa kutipan tidak menyisakan area kosong besar
  // di tengah, dan kartu dengan kutipan panjang tetap punya jarak aman ke logo.
  const logoY = TINGGI - 220
  const areaAtas = 140
  const areaBawah = logoY - 100
  const tinggiBlokHeading = headingBaris.length * headingLineHeight
  const tinggiBlokKutipan = kutipanBaris.length > 0 ? gapHeadingKeKutipan + kutipanBaris.length * kutipanLineHeight : 0
  const tinggiBlok = tinggiBlokHeading + tinggiBlokKutipan

  let y = areaAtas + Math.max(0, (areaBawah - areaAtas - tinggiBlok) / 2) + headingLineHeight * 0.78

  ctx.fillStyle = WARNA_INK
  ctx.font = '700 60px "Plus Jakarta Sans"'
  for (const baris of headingBaris) {
    ctx.fillText(baris, centerX, y)
    y += headingLineHeight
  }

  if (kutipanBaris.length > 0) {
    y += gapHeadingKeKutipan
    ctx.font = 'italic 500 40px "Plus Jakarta Sans"'
    for (const baris of kutipanBaris) {
      ctx.fillText(baris, centerX, y)
      y += kutipanLineHeight
    }
  }

  gambarLogoLockup(ctx, centerX, logoY)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Gagal membuat gambar kartu'))
    }, 'image/png')
  })
}

export type HasilBagikanKartu = 'dibagikan' | 'dibatalkan' | 'diunduh' | 'gagal'

function unduhGambar(namaFile: string, blob: Blob): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = namaFile
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

// Pola sama persis seperti tambahKeKalenderLain di generateIcs.ts: fallback
// unduh HANYA dipicu di jalur sinkron sebelum ada await apa pun (saat share
// file sejak awal tidak didukung). Kalau navigator.share() sendiri yang
// gagal/reject, kita laporkan gagal secara jujur -- TIDAK mencoba unduh
// susulan setelahnya, karena titik itu sudah tidak lagi punya transient
// activation dari tap user, jadi trigger unduhan bisa diblokir diam-diam.
export async function bagikanKartuPencapaian(blob: Blob): Promise<HasilBagikanKartu> {
  const namaFile = 'runtut-pencapaian.png'
  const file = new File([blob], namaFile, { type: 'image/png' })
  const dukungShareFile =
    typeof navigator.canShare === 'function' &&
    typeof navigator.share === 'function' &&
    navigator.canShare({ files: [file] })

  if (!dukungShareFile) {
    unduhGambar(namaFile, blob)
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
