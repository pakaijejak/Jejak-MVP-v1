// Panggilan client ke Worker untuk sistem referral (lihat worker/referral.ts).
// Semua fungsi di sini sengaja "gagal diam-diam" (return null/false, tidak throw)
// supaya tidak ada satupun pemanggil yang perlu try/catch sendiri -- terutama
// kirimKonversi(), yang dipanggil dari momen kritis verifikasi kode akses dan
// TIDAK BOLEH menghalangi user masuk ke app kalau Worker tidak bisa dihubungi.

export interface StatusReferral {
  jumlah: number;
  namaTampilan: string | null;
  kodeReward: string | null;
}

async function fetchDenganTimeout(url: string, init: RequestInit, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function kirimKonversi(kodeReferral: string): Promise<void> {
  try {
    await fetchDenganTimeout('/api/referral/konversi', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kodeReferral }),
    });
  } catch {
    // Diabaikan dengan sengaja -- lihat komentar di atas file.
  }
}

export async function ambilStatusReferral(kode: string): Promise<StatusReferral | null> {
  try {
    const res = await fetchDenganTimeout(`/api/referral/status?kode=${encodeURIComponent(kode)}`, {
      method: 'GET',
    });
    if (!res.ok) return null;
    return (await res.json()) as StatusReferral;
  } catch {
    return null;
  }
}

export async function kirimNamaTampilanReferral(kodeReferral: string, namaTampilan: string): Promise<boolean> {
  try {
    const res = await fetchDenganTimeout('/api/referral/nama', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ kodeReferral, namaTampilan }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
