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

// Versi generik dari cariInsightPola: menerima daftar keputusan yang SUDAH difilter
// (misal ikut tab kategori aktif di Riwayat & Pola), bukan selalu baca ulang semua
// data dan filter per 1 kategori tetap. Dipakai untuk insight yang cakupannya
// mengikuti tab filter yang sedang aktif (termasuk tab "Semua").
export interface InsightKalibrasiAgregat {
  jumlah: number;
  rataKeyakinan: number;
  rataHasil: number;
  arah: 'terlalu_yakin' | 'kurang_yakin';
}

export function hitungInsightKalibrasi(daftar: Keputusan[]): InsightKalibrasiAgregat | null {
  const relevan = daftar.filter((k) => k.hasilPersen !== undefined);
  if (relevan.length < 5) return null;

  const rataKeyakinan = relevan.reduce((total, k) => total + k.keyakinanAwal, 0) / relevan.length;
  const rataHasil = relevan.reduce((total, k) => total + (k.hasilPersen as number), 0) / relevan.length;
  const selisih = rataKeyakinan - rataHasil;

  if (selisih > 20) return { jumlah: relevan.length, rataKeyakinan, rataHasil, arah: 'terlalu_yakin' };
  if (selisih < -20) return { jumlah: relevan.length, rataKeyakinan, rataHasil, arah: 'kurang_yakin' };
  return null;
}

type LevelRisiko = 'Rendah' | 'Sedang' | 'Tinggi';
const URUTAN_LEVEL_RISIKO: LevelRisiko[] = ['Tinggi', 'Sedang', 'Rendah'];

export interface InsightRisiko {
  level: LevelRisiko;
  jumlah: number;
  rataKeyakinan: number;
  rataHasil: number;
  arah: 'lebih_tinggi' | 'lebih_rendah' | 'deket';
}

// Pola kalibrasi berdasarkan level risiko dari opsi yang DIPILIH user (Step 4).
// Kalau lebih dari 1 level sama-sama memenuhi syarat >=5, level dengan data
// terbanyak yang ditampilkan (paling representatif secara statistik).
export function hitungInsightRisiko(daftar: Keputusan[]): InsightRisiko | null {
  let terbaik: InsightRisiko | null = null;

  for (const level of URUTAN_LEVEL_RISIKO) {
    const relevan = daftar.filter((k) => {
      const opsiTerpilih = k.opsi[k.opsiTerpilihIndex];
      return k.hasilPersen !== undefined && opsiTerpilih?.risiko?.ada === true && opsiTerpilih.risiko.level === level;
    });

    if (relevan.length < 5) continue;
    if (terbaik && relevan.length <= terbaik.jumlah) continue;

    const rataKeyakinan = relevan.reduce((total, k) => total + k.keyakinanAwal, 0) / relevan.length;
    const rataHasil = relevan.reduce((total, k) => total + (k.hasilPersen as number), 0) / relevan.length;
    const selisih = rataKeyakinan - rataHasil;
    const arah = selisih > 20 ? 'lebih_tinggi' : selisih < -20 ? 'lebih_rendah' : 'deket';

    terbaik = { level, jumlah: relevan.length, rataKeyakinan, rataHasil, arah };
  }

  return terbaik;
}
