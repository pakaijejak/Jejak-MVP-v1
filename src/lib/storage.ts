import type { Keputusan, OptInStatus } from '../types/keputusan';

const KEPUTUSAN_KEY = 'jejak:keputusan';
const ONBOARDING_SELESAI_KEY = 'jejak:onboardingSelesai';
const OPT_IN_STATUS_KEY = 'jejak:optInStatus';

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

export function hapusSemuaData(): void {
  localStorage.removeItem(KEPUTUSAN_KEY);
  localStorage.removeItem(ONBOARDING_SELESAI_KEY);
  localStorage.removeItem(OPT_IN_STATUS_KEY);
}
