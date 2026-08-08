import type { Keputusan, OptInStatus } from '../types/keputusan';
import {
  ambilKategoriTersembunyi,
  ambilNamaSapaan,
  ambilOnboardingSelesai,
  ambilOptInStatus,
  ambilSemuaKeputusan,
  ambilTampilkanGrafikPola,
  sembunyikanKategori,
  setNamaSapaan,
  setOnboardingSelesai,
  setOptInStatus,
  tambahKeputusanBanyak,
} from './storage';

const PENANDA = 'RUNTUT1:';

interface DataCadangan {
  keputusan: Keputusan[];
  namaSapaan: string;
  onboardingSelesai: boolean;
  optInStatus: OptInStatus;
  tampilkanGrafikPola: boolean;
  kategoriTersembunyi: string[];
}

function utf8KeBase64(teks: string): string {
  const bytes = new TextEncoder().encode(teks);
  let biner = '';
  for (const byte of bytes) {
    biner += String.fromCharCode(byte);
  }
  return btoa(biner);
}

function base64KeUtf8(base64: string): string {
  const biner = atob(base64);
  const bytes = new Uint8Array(biner.length);
  for (let i = 0; i < biner.length; i++) {
    bytes[i] = biner.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function buatKodeCadangan(): string {
  const data: DataCadangan = {
    keputusan: ambilSemuaKeputusan(),
    namaSapaan: ambilNamaSapaan(),
    onboardingSelesai: ambilOnboardingSelesai(),
    optInStatus: ambilOptInStatus(),
    tampilkanGrafikPola: ambilTampilkanGrafikPola(),
    kategoriTersembunyi: ambilKategoriTersembunyi(),
  };
  return PENANDA + utf8KeBase64(JSON.stringify(data));
}

export function kodeCadanganValid(kode: string): boolean {
  return decodeKodeCadangan(kode) !== null;
}

function decodeKodeCadangan(kode: string): DataCadangan | null {
  const bersih = kode.trim();
  if (!bersih.startsWith(PENANDA)) return null;

  try {
    const json = base64KeUtf8(bersih.slice(PENANDA.length));
    const data = JSON.parse(json) as Partial<DataCadangan>;
    if (!Array.isArray(data.keputusan)) return null;
    return {
      keputusan: data.keputusan,
      namaSapaan: data.namaSapaan ?? '',
      onboardingSelesai: Boolean(data.onboardingSelesai),
      optInStatus: data.optInStatus ?? 'belum_ditanya',
      tampilkanGrafikPola: data.tampilkanGrafikPola ?? true,
      kategoriTersembunyi: Array.isArray(data.kategoriTersembunyi) ? data.kategoriTersembunyi : [],
    };
  } catch {
    return null;
  }
}

export interface HasilPulihkan {
  jumlahKeputusanBaru: number;
}

// Menggabungkan data dari kode cadangan dengan data yang sudah ada di HP ini
// (data yang sudah ada tidak pernah ditimpa/dihapus). Return null kalau kode
// tidak valid/rusak.
export function pulihkanDariKode(kode: string): HasilPulihkan | null {
  const data = decodeKodeCadangan(kode);
  if (!data) return null;

  const idYangSudahAda = new Set(ambilSemuaKeputusan().map((k) => k.id));
  const keputusanBaru = data.keputusan.filter((k) => !idYangSudahAda.has(k.id));
  if (keputusanBaru.length > 0) {
    tambahKeputusanBanyak(keputusanBaru);
  }

  if (!ambilNamaSapaan() && data.namaSapaan) {
    setNamaSapaan(data.namaSapaan);
  }

  if (data.onboardingSelesai && !ambilOnboardingSelesai()) {
    setOnboardingSelesai(true);
  }

  if (ambilOptInStatus() === 'belum_ditanya' && data.optInStatus !== 'belum_ditanya') {
    setOptInStatus(data.optInStatus);
  }

  // Preferensi tampilkan grafik: sengaja tidak diambil dari kode, pakai nilai HP ini.

  for (const kategori of data.kategoriTersembunyi) {
    sembunyikanKategori(kategori);
  }

  return { jumlahKeputusanBaru: keputusanBaru.length };
}
