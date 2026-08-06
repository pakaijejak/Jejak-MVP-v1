import { ambilSemuaKeputusan } from './storage';
import type { Keputusan } from '../types/keputusan';

const ANGKA_HASIL: Record<NonNullable<Keputusan['hasilAktual']>, number> = {
  Berhasil: 100,
  Campuran: 50,
  'Tidak berhasil': 0,
};

export function hitungSkorKalibrasi(
  keyakinanAwal: number,
  hasilAktual: NonNullable<Keputusan['hasilAktual']>,
): NonNullable<Keputusan['skorKalibrasi']> {
  const angkaHasil = ANGKA_HASIL[hasilAktual];
  const selisih = Math.abs(keyakinanAwal - angkaHasil);

  if (selisih <= 20) return 'Cukup Akurat';
  if (keyakinanAwal > angkaHasil) return 'Terlalu Yakin';
  return 'Kurang Yakin';
}

export interface InsightPola {
  jumlah: number;
  kategori: Keputusan['kategori'];
  rataKeyakinan: number;
  tingkatKeberhasilan: number;
  arah: 'terlalu_yakin' | 'kurang_yakin';
}

export function cariInsightPola(kategori: Keputusan['kategori']): InsightPola | null {
  const relevan = ambilSemuaKeputusan().filter(
    (k) => k.kategori === kategori && k.hasilAktual !== undefined,
  );

  if (relevan.length < 5) return null;

  const rataKeyakinan = relevan.reduce((total, k) => total + k.keyakinanAwal, 0) / relevan.length;

  const totalSkorHasil = relevan.reduce((total, k) => total + ANGKA_HASIL[k.hasilAktual!], 0);
  const tingkatKeberhasilan = totalSkorHasil / relevan.length;

  const selisih = rataKeyakinan - tingkatKeberhasilan;

  if (selisih > 20) {
    return { jumlah: relevan.length, kategori, rataKeyakinan, tingkatKeberhasilan, arah: 'terlalu_yakin' };
  }
  if (selisih < -20) {
    return { jumlah: relevan.length, kategori, rataKeyakinan, tingkatKeberhasilan, arah: 'kurang_yakin' };
  }
  return null;
}
