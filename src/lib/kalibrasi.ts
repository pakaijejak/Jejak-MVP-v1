import { ambilSemuaKeputusan } from './storage';
import type { Keputusan } from '../types/keputusan';

export type SkorKalibrasi = NonNullable<Keputusan['skorKalibrasi']>;

export function hitungSkorKalibrasi(keyakinanAwal: number, hasilPersen: number): SkorKalibrasi {
  const selisih = Math.abs(keyakinanAwal - hasilPersen);

  if (selisih <= 20) return 'Cukup Akurat';
  if (keyakinanAwal > hasilPersen) return 'Terlalu Yakin';
  return 'Kurang Yakin';
}

export const KALIMAT_GAP_KALIBRASI: Record<SkorKalibrasi, string> = {
  'Cukup Akurat': 'Prediksimu deket banget sama kenyataan.',
  'Terlalu Yakin': 'Yakinmu waktu itu lebih tinggi dari hasilnya.',
  'Kurang Yakin': 'Hasilnya ternyata lebih baik dari yang kamu kira.',
};

export const KALIMAT_REASSURANCE_KALIBRASI: Partial<Record<SkorKalibrasi, string>> = {
  'Terlalu Yakin':
    'Wajar kok, hampir semua orang begini. Menyadarinya aja udah jadi langkah maju buat keputusan berikutnya.',
  'Kurang Yakin': 'Ini juga informasi berguna, biar makin pas nebak keyakinan di lain waktu.',
};

export interface InsightPola {
  jumlah: number;
  kategori: Keputusan['kategori'];
  rataKeyakinan: number;
  rataHasil: number;
  arah: 'terlalu_yakin' | 'kurang_yakin';
}

export function cariInsightPola(kategori: Keputusan['kategori']): InsightPola | null {
  const relevan = ambilSemuaKeputusan().filter(
    (k) => k.kategori === kategori && k.hasilPersen !== undefined,
  );

  if (relevan.length < 5) return null;

  const rataKeyakinan = relevan.reduce((total, k) => total + k.keyakinanAwal, 0) / relevan.length;
  const rataHasil = relevan.reduce((total, k) => total + (k.hasilPersen as number), 0) / relevan.length;

  const selisih = rataKeyakinan - rataHasil;

  if (selisih > 20) {
    return { jumlah: relevan.length, kategori, rataKeyakinan, rataHasil, arah: 'terlalu_yakin' };
  }
  if (selisih < -20) {
    return { jumlah: relevan.length, kategori, rataKeyakinan, rataHasil, arah: 'kurang_yakin' };
  }
  return null;
}
