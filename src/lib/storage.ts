import type { Keputusan, OptInStatus, RefleksiGrafik } from '../types/keputusan';

const KEPUTUSAN_KEY = 'runut:keputusan';
const ONBOARDING_SELESAI_KEY = 'runut:onboardingSelesai';
const OPT_IN_STATUS_KEY = 'runut:optInStatus';
const TAMPILKAN_GRAFIK_POLA_KEY = 'runut:tampilkanGrafikPola';
const NAMA_SAPAAN_KEY = 'runut:namaSapaan';
const KATEGORI_TERSEMBUNYI_KEY = 'runut:kategoriTersembunyi';
const TERVERIFIKASI_KEY = 'runut:terverifikasi';
const PROMPT_INSTALL_DITUTUP_KEY = 'runut:promptInstallDitutup';
const REFLEKSI_GRAFIK_KEY = 'runut:refleksiGrafik';
const KODE_REFERRAL_SAYA_KEY = 'runut:kodeReferralSaya';
const KODE_REFERRAL_PENGAJU_KEY = 'runut:kodeReferralPengaju';
const KONVERSI_SUDAH_DIKIRIM_KEY = 'runut:konversiSudahDikirim';
const NAMA_TAMPILAN_REFERRAL_KEY = 'runut:namaTampilanReferral';

export const KATEGORI_TETAP = ['Karier', 'Uang', 'Relasi', 'Kesehatan'];
const KATA_LAINNYA = 'lainnya';

type KeputusanBaru = Omit<Keputusan, 'id' | 'createdAt' | 'status'>;

function simpanSemuaKeputusan(semua: Keputusan[]): void {
  localStorage.setItem(KEPUTUSAN_KEY, JSON.stringify(semua));
}

export function ambilSemuaKeputusan(): Keputusan[] {
  const raw = localStorage.getItem(KEPUTUSAN_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Keputusan[];
}

export function tambahKeputusan(data: KeputusanBaru): Keputusan {
  const keputusan: Keputusan = {
    ...data,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    status: 'menunggu_direview',
  };
  const semua = ambilSemuaKeputusan();
  semua.push(keputusan);
  simpanSemuaKeputusan(semua);
  return keputusan;
}

export function tambahKeputusanBanyak(daftar: Keputusan[]): void {
  const semua = ambilSemuaKeputusan();
  simpanSemuaKeputusan([...semua, ...daftar]);
}

export function ambilKategoriCustom(): string[] {
  const tetapLower = new Set(KATEGORI_TETAP.map((k) => k.toLowerCase()));
  const terlihat = new Set<string>();
  const hasil: string[] = [];

  for (const k of ambilSemuaKeputusan()) {
    const lower = k.kategori.toLowerCase();
    // "Lainnya" adalah kata pemicu yang dicadangkan (bukan kategori sungguhan), jadi
    // dikecualikan supaya tidak pernah muncul dobel dengan chip trigger "Lainnya".
    if (tetapLower.has(lower) || lower === KATA_LAINNYA || terlihat.has(lower)) continue;
    terlihat.add(lower);
    hasil.push(k.kategori);
  }

  return hasil;
}

export function resolveKategori(teks: string): string {
  const bersih = teks.trim();
  const sudahAda = ambilKategoriCustom().find((k) => k.toLowerCase() === bersih.toLowerCase());
  return sudahAda ?? bersih;
}

export function ambilKategoriTersembunyi(): string[] {
  const raw = localStorage.getItem(KATEGORI_TERSEMBUNYI_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as string[];
}

export function sembunyikanKategori(kategori: string): void {
  const daftar = ambilKategoriTersembunyi();
  if (daftar.some((k) => k.toLowerCase() === kategori.toLowerCase())) return;
  daftar.push(kategori);
  localStorage.setItem(KATEGORI_TERSEMBUNYI_KEY, JSON.stringify(daftar));
}

// Kategori custom yang masih boleh dipilih untuk keputusan baru — kategori yang
// sudah disembunyikan tetap ada di data lama, cuma tidak lagi ditawarkan sebagai chip.
export function ambilKategoriCustomTerlihat(): string[] {
  const tersembunyi = new Set(ambilKategoriTersembunyi().map((k) => k.toLowerCase()));
  return ambilKategoriCustom().filter((k) => !tersembunyi.has(k.toLowerCase()));
}

export function ambilKeputusanById(id: string): Keputusan | undefined {
  return ambilSemuaKeputusan().find((k) => k.id === id);
}

export function updateKeputusan(
  id: string,
  dataBaru: Partial<Keputusan>,
): Keputusan | undefined {
  const semua = ambilSemuaKeputusan();
  const index = semua.findIndex((k) => k.id === id);
  if (index === -1) return undefined;

  const updated = { ...semua[index], ...dataBaru };
  semua[index] = updated;
  simpanSemuaKeputusan(semua);
  return updated;
}

export function hapusKeputusan(id: string): void {
  const semua = ambilSemuaKeputusan().filter((k) => k.id !== id);
  simpanSemuaKeputusan(semua);
}

function tanggalSudahLewatAtauHariIni(tanggalIso: string): boolean {
  const target = new Date(tanggalIso);
  const today = new Date();
  const targetTanpaJam = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const todayTanpaJam = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return targetTanpaJam.getTime() <= todayTanpaJam.getTime();
}

export function ambilKeputusanPending(): Keputusan[] {
  return ambilSemuaKeputusan().filter(
    (k) => k.status === 'menunggu_direview' && tanggalSudahLewatAtauHariIni(k.tanggalTargetReview),
  );
}

export function ambilOnboardingSelesai(): boolean {
  return localStorage.getItem(ONBOARDING_SELESAI_KEY) === 'true';
}

export function setOnboardingSelesai(selesai: boolean): void {
  localStorage.setItem(ONBOARDING_SELESAI_KEY, String(selesai));
}

export function ambilOptInStatus(): OptInStatus {
  const raw = localStorage.getItem(OPT_IN_STATUS_KEY);
  if (raw === 'ya' || raw === 'nanti_aja') return raw;
  return 'belum_ditanya';
}

export function setOptInStatus(status: OptInStatus): void {
  localStorage.setItem(OPT_IN_STATUS_KEY, status);
}

export function ambilTampilkanGrafikPola(): boolean {
  const raw = localStorage.getItem(TAMPILKAN_GRAFIK_POLA_KEY);
  if (raw === null) return true;
  return raw === 'true';
}

export function setTampilkanGrafikPola(tampilkan: boolean): void {
  localStorage.setItem(TAMPILKAN_GRAFIK_POLA_KEY, String(tampilkan));
}

export function ambilNamaSapaan(): string {
  return localStorage.getItem(NAMA_SAPAAN_KEY) ?? '';
}

export function setNamaSapaan(nama: string): void {
  const bersih = nama.trim();
  if (bersih) {
    localStorage.setItem(NAMA_SAPAAN_KEY, bersih);
  } else {
    localStorage.removeItem(NAMA_SAPAAN_KEY);
  }
}

export function ambilTerverifikasi(): boolean {
  return localStorage.getItem(TERVERIFIKASI_KEY) === 'true';
}

export function setTerverifikasi(status: boolean): void {
  localStorage.setItem(TERVERIFIKASI_KEY, String(status));
}

export function ambilPromptInstallDitutup(): boolean {
  return localStorage.getItem(PROMPT_INSTALL_DITUTUP_KEY) === 'true';
}

export function setPromptInstallDitutup(status: boolean): void {
  localStorage.setItem(PROMPT_INSTALL_DITUTUP_KEY, String(status));
}

export function ambilRefleksiGrafik(): RefleksiGrafik[] {
  const raw = localStorage.getItem(REFLEKSI_GRAFIK_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as RefleksiGrafik[];
}

export function tambahRefleksiGrafik(teks: string): RefleksiGrafik {
  const entri: RefleksiGrafik = {
    id: crypto.randomUUID(),
    teks: teks.trim(),
    createdAt: new Date().toISOString(),
  };
  const semua = ambilRefleksiGrafik();
  semua.push(entri);
  localStorage.setItem(REFLEKSI_GRAFIK_KEY, JSON.stringify(semua));
  return entri;
}

export function hapusRefleksiGrafik(id: string): void {
  const semua = ambilRefleksiGrafik().filter((r) => r.id !== id);
  localStorage.setItem(REFLEKSI_GRAFIK_KEY, JSON.stringify(semua));
}

export function hapusSemuaData(): void {
  localStorage.removeItem(KEPUTUSAN_KEY);
  localStorage.removeItem(ONBOARDING_SELESAI_KEY);
  localStorage.removeItem(OPT_IN_STATUS_KEY);
  localStorage.removeItem(TAMPILKAN_GRAFIK_POLA_KEY);
  localStorage.removeItem(NAMA_SAPAAN_KEY);
  localStorage.removeItem(KATEGORI_TERSEMBUNYI_KEY);
  localStorage.removeItem(TERVERIFIKASI_KEY);
  localStorage.removeItem(PROMPT_INSTALL_DITUTUP_KEY);
  localStorage.removeItem(REFLEKSI_GRAFIK_KEY);
  localStorage.removeItem(KODE_REFERRAL_SAYA_KEY);
  localStorage.removeItem(KODE_REFERRAL_PENGAJU_KEY);
  localStorage.removeItem(KONVERSI_SUDAH_DIKIRIM_KEY);
  localStorage.removeItem(NAMA_TAMPILAN_REFERRAL_KEY);
}

const KARAKTER_KODE_REFERRAL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function generateKodeReferral(): string {
  let acak = '';
  for (let i = 0; i < 6; i++) {
    acak += KARAKTER_KODE_REFERRAL[Math.floor(Math.random() * KARAKTER_KODE_REFERRAL.length)];
  }
  return `RT-${acak}`;
}

// Generate sekali saja, dipakai terus setelahnya (bukan token rahasia, jadi
// Math.random cukup -- risiko tabrakan antar 2 user sangat kecil di skala MVP).
export function ambilKodeReferralSaya(): string {
  const ada = localStorage.getItem(KODE_REFERRAL_SAYA_KEY);
  if (ada) return ada;
  const baru = generateKodeReferral();
  localStorage.setItem(KODE_REFERRAL_SAYA_KEY, baru);
  return baru;
}

export function ambilKodeReferralPengaju(): string | null {
  return localStorage.getItem(KODE_REFERRAL_PENGAJU_KEY);
}

// Cuma simpan kalau user belum pernah verifikasi kode akses DAN belum ada
// kodeReferralPengaju tersimpan sebelumnya -- supaya orang yang buka link
// referral tidak menimpa nilai yang sudah ada, dan supaya user yang sudah
// terverifikasi tidak ikut tercatat sebagai "diajak".
export function setKodeReferralPengajuJikaBelumAda(kode: string): void {
  if (ambilTerverifikasi()) return;
  if (ambilKodeReferralPengaju()) return;
  localStorage.setItem(KODE_REFERRAL_PENGAJU_KEY, kode);
}

export function ambilKonversiSudahDikirim(): boolean {
  return localStorage.getItem(KONVERSI_SUDAH_DIKIRIM_KEY) === 'true';
}

export function setKonversiSudahDikirim(status: boolean): void {
  localStorage.setItem(KONVERSI_SUDAH_DIKIRIM_KEY, String(status));
}

export function ambilNamaTampilanReferral(): string {
  return localStorage.getItem(NAMA_TAMPILAN_REFERRAL_KEY) ?? '';
}

export function setNamaTampilanReferral(nama: string): void {
  const bersih = nama.trim();
  if (bersih) {
    localStorage.setItem(NAMA_TAMPILAN_REFERRAL_KEY, bersih);
  } else {
    localStorage.removeItem(NAMA_TAMPILAN_REFERRAL_KEY);
  }
}
