import type { Keputusan } from '../../types/keputusan'

export interface KeputusanDraft {
  emosi?: Keputusan['emosi']
  intensitasEmosi?: Keputusan['intensitasEmosi']
  masalah: string
  kategori?: Keputusan['kategori']
  infoYangDimiliki: string
  sudahCekPandanganBerbeda?: boolean
  opsi: { teks: string; skenarioTerburuk: string }[]
  opsiTerpilihIndex?: number
  keyakinanAwal?: number
}

export const draftAwal: KeputusanDraft = {
  masalah: '',
  infoYangDimiliki: '',
  opsi: [
    { teks: '', skenarioTerburuk: '' },
    { teks: '', skenarioTerburuk: '' },
  ],
}
