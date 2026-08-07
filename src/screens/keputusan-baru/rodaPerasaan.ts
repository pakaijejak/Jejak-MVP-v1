// Roda Perasaan Dr. Gloria Wilcox, diterjemahkan dari jurnal asli.
// Data ini sudah final dan terkunci — jangan diubah tanpa instruksi eksplisit.
// Catatan: di "Gembira" ada 2 cabang bernama sama persis "Bersemangat"
// (menuju "Berani" dan "Memukau") — ini disengaja, bukan duplikat data yang keliru.

export interface CabangEmosi {
  cabang: string
  daun: string
}

export interface IntiEmosi {
  inti: string
  cabang: CabangEmosi[]
}

export const RODA_PERASAAN: IntiEmosi[] = [
  {
    inti: 'Berdaya',
    cabang: [
      { cabang: 'Bangga', daun: 'Ceria' },
      { cabang: 'Dihormati', daun: 'Puas' },
      { cabang: 'Diapresiasi', daun: 'Berharga' },
      { cabang: 'Penuh Harap', daun: 'Bermanfaat' },
      { cabang: 'Penting', daun: 'Cerdas' },
      { cabang: 'Setia', daun: 'Percaya Diri' },
    ],
  },
  {
    inti: 'Gembira',
    cabang: [
      { cabang: 'Bersemangat', daun: 'Berani' },
      { cabang: 'Bersemangat', daun: 'Memukau' },
      { cabang: 'Enerjik', daun: 'Terstimulasi' },
      { cabang: 'Menyenangkan', daun: 'Terhibur' },
      { cabang: 'Kreatif', daun: 'Berlebihan' },
      { cabang: 'Sadar Penuh', daun: 'Menarik' },
    ],
  },
  {
    inti: 'Takut',
    cabang: [
      { cabang: 'Ditolak', daun: 'Limbung' },
      { cabang: 'Bingung', daun: 'Berkecil Hati' },
      { cabang: 'Tak Berdaya', daun: 'Tidak Signifikan' },
      { cabang: 'Tunduk', daun: 'Lemah' },
      { cabang: 'Merasa Tidak Aman', daun: 'Konyol' },
      { cabang: 'Cemas', daun: 'Malu' },
    ],
  },
  {
    inti: 'Marah',
    cabang: [
      { cabang: 'Kritis', daun: 'Skeptis' },
      { cabang: 'Penuh Benci', daun: 'Kesal' },
      { cabang: 'Mengamuk', daun: 'Geram' },
      { cabang: 'Murka', daun: 'Frustasi' },
      { cabang: 'Agresif', daun: 'Egois' },
      { cabang: 'Terluka', daun: 'Cemburu' },
    ],
  },
  {
    inti: 'Sedih',
    cabang: [
      { cabang: 'Bersalah', daun: 'Segan' },
      { cabang: 'Malu', daun: 'Bodoh' },
      { cabang: 'Tertekan', daun: 'Menderita/Putus Asa' },
      { cabang: 'Kesepian', daun: 'Tidak Memadai' },
      { cabang: 'Bosan', daun: 'Rendah Diri' },
      { cabang: 'Letih', daun: 'Apatis' },
    ],
  },
  {
    inti: 'Tenang',
    cabang: [
      { cabang: 'Terpenuhi', daun: 'Termenung' },
      { cabang: 'Penuh Pertimbangan', daun: 'Santai' },
      { cabang: 'Mendalam', daun: 'Responsif' },
      { cabang: 'Penuh Kasih Sayang', daun: 'Tenteram' },
      { cabang: 'Percaya', daun: 'Sentimentil' },
      { cabang: 'Penuh Perhatian', daun: 'Berterima Kasih' },
    ],
  },
]

export const INTI_NEGATIF = ['Takut', 'Marah', 'Sedih']
