import type { Keputusan } from '../../types/keputusan'

export interface KeputusanDraft {
  masalah: string
  kategori?: Keputusan['kategori']
  emosi?: Keputusan['emosi']
  intensitasEmosi?: Keputusan['intensitasEmosi']
  infoYangDimiliki: string
  asumsiYangDianggapPasti?: string
  sudahCekPandanganBerbeda?: boolean
  opsi: { teks: string; skenarioTerburuk: string }[]
  perspektifOrangLain?: string
  opsiTerpilihIndex?: number
  keyakinanAwal?: number
}

export const draftAwal: KeputusanDraft = {
  masalah: '',
  infoYangDimiliki: '',
  asumsiYangDianggapPasti: '',
  perspektifOrangLain: '',
  opsi: [
    { teks: '', skenarioTerburuk: '' },
    { teks: '', skenarioTerburuk: '' },
  ],
}
