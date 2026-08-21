// Logika sistem referral Runtut V1. Murni untuk melacak referral & menyimpan
// reward, TIDAK menyentuh sistem kode akses Runtut V1 (itu tetap statis, di
// src/lib/aksesGerbang.ts, tidak disentuh sama sekali oleh file ini).

export interface Env {
  REFERRAL_KV: KVNamespace;
  ADMIN_KEY: string;
}

export const AMBANG_REFERRAL = 5;
const PANJANG_MAKS_NAMA = 40;

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

function normalisasiKode(kode: string): string {
  return kode.trim().toUpperCase();
}

async function bacaJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T;
  } catch {
    return null;
  }
}

// POST /api/referral/konversi — body { kodeReferral }
// Tambah 1 ke counter. Kode yang belum pernah ada (kemungkinan diketik
// manual/palsu) tetap diterima tanpa error, cuma mulai dari 0.
//
// CATATAN JUJUR: KV tidak punya operasi increment atomik, jadi ini baca-lalu-
// tulis biasa. Kalau ada 2 request untuk kode referral YANG SAMA persis di
// milidetik yang sama, salah satu update bisa "tertimpa" (lost update). Untuk
// skala MVP ini risikonya sangat kecil (butuh 2 teman beda yang verifikasi
// kode akses di detik yang sama persis pakai kode referral yang sama), dan
// diterima sebagai konsekuensi wajar dari pendekatan KV yang sederhana, bukan
// Durable Objects. Kalau nanti perlu akurasi 100%, itu pertimbangan sesi
// terpisah.
export async function handleKonversi(request: Request, env: Env): Promise<Response> {
  const body = await bacaJson<{ kodeReferral?: string }>(request);
  const kode = normalisasiKode(body?.kodeReferral ?? '');
  if (!kode) {
    return jsonResponse({ error: 'kodeReferral wajib diisi' }, 400);
  }

  const keyJumlah = `referral:${kode}:jumlah`;
  const jumlahSekarang = Number((await env.REFERRAL_KV.get(keyJumlah)) ?? '0');
  const jumlahBaru = jumlahSekarang + 1;
  await env.REFERRAL_KV.put(keyJumlah, String(jumlahBaru));

  return jsonResponse({ ok: true, jumlah: jumlahBaru });
}

async function ambilDariKolamDanAssign(env: Env, kode: string): Promise<string | null> {
  const kolamRaw = await env.REFERRAL_KV.get('kolam-reward:tersedia');
  const kolam: string[] = kolamRaw ? JSON.parse(kolamRaw) : [];
  if (kolam.length === 0) return null;

  const kodeReward = kolam.shift() as string;
  await env.REFERRAL_KV.put('kolam-reward:tersedia', JSON.stringify(kolam));
  await env.REFERRAL_KV.put(`referral:${kode}:kodeReward`, kodeReward);
  return kodeReward;
}

// GET /api/referral/status?kode={kodeReferral}
// Kalau jumlah >= AMBANG_REFERRAL dan kodeReward belum pernah di-assign,
// ambil 1 dari kolam & simpan permanen dulu baru dikembalikan.
export async function handleStatus(url: URL, env: Env): Promise<Response> {
  const kode = normalisasiKode(url.searchParams.get('kode') ?? '');
  if (!kode) {
    return jsonResponse({ error: 'parameter kode wajib diisi' }, 400);
  }

  const [jumlahRaw, namaTampilan, kodeRewardTersimpan] = await Promise.all([
    env.REFERRAL_KV.get(`referral:${kode}:jumlah`),
    env.REFERRAL_KV.get(`referral:${kode}:namaTampilan`),
    env.REFERRAL_KV.get(`referral:${kode}:kodeReward`),
  ]);
  const jumlah = Number(jumlahRaw ?? '0');

  let kodeReward = kodeRewardTersimpan;
  if (jumlah >= AMBANG_REFERRAL && !kodeReward) {
    kodeReward = await ambilDariKolamDanAssign(env, kode);
  }

  return jsonResponse({ jumlah, namaTampilan: namaTampilan ?? null, kodeReward: kodeReward ?? null });
}

// POST /api/referral/nama — body { kodeReferral, namaTampilan }
export async function handleNama(request: Request, env: Env): Promise<Response> {
  const body = await bacaJson<{ kodeReferral?: string; namaTampilan?: string }>(request);
  const kode = normalisasiKode(body?.kodeReferral ?? '');
  const nama = (body?.namaTampilan ?? '').trim().slice(0, PANJANG_MAKS_NAMA);
  if (!kode || !nama) {
    return jsonResponse({ error: 'kodeReferral dan namaTampilan wajib diisi' }, 400);
  }

  await env.REFERRAL_KV.put(`referral:${kode}:namaTampilan`, nama);
  return jsonResponse({ ok: true, namaTampilan: nama });
}

// GET /api/referral/leaderboard — publik, tidak perlu autentikasi.
// CATATAN: list() KV dibatasi 1000 key per panggilan; untuk skala MVP ini
// dianggap cukup, belum ada paginasi lanjutan.
export async function handleLeaderboard(env: Env): Promise<Response> {
  const daftarKey = await env.REFERRAL_KV.list({ prefix: 'referral:' });
  const kodeDenganNama = daftarKey.keys
    .filter((k) => k.name.endsWith(':namaTampilan'))
    .map((k) => k.name.replace(/^referral:/, '').replace(/:namaTampilan$/, ''));

  const entri = await Promise.all(
    kodeDenganNama.map(async (kode) => {
      const [namaTampilan, jumlahRaw] = await Promise.all([
        env.REFERRAL_KV.get(`referral:${kode}:namaTampilan`),
        env.REFERRAL_KV.get(`referral:${kode}:jumlah`),
      ]);
      return { kode, namaTampilan: namaTampilan ?? '', jumlah: Number(jumlahRaw ?? '0') };
    }),
  );

  const terurut = entri.sort((a, b) => b.jumlah - a.jumlah).slice(0, 20);
  return jsonResponse(terurut);
}

export async function handleReferral(request: Request, env: Env, url: URL): Promise<Response> {
  const { pathname } = url;

  if (pathname === '/api/referral/konversi' && request.method === 'POST') {
    return handleKonversi(request, env);
  }
  if (pathname === '/api/referral/status' && request.method === 'GET') {
    return handleStatus(url, env);
  }
  if (pathname === '/api/referral/nama' && request.method === 'POST') {
    return handleNama(request, env);
  }
  if (pathname === '/api/referral/leaderboard' && request.method === 'GET') {
    return handleLeaderboard(env);
  }

  return jsonResponse({ error: 'Not found' }, 404);
}

// ---------------------------------------------------------------------------
// Bagian C (BELUM dibangun, sengaja hanya pengingat): begitu Runtut Mendalam
// mulai dibangun, gerbang kode aksesnya perlu 2 endpoint tambahan di sini:
//   - GET  /api/reward/verify?kode=X   -> cek kode reward masih valid/belum terpakai
//   - POST /api/reward/gunakan          -> tandai terpakai setelah berhasil dipakai,
//                                          supaya tidak bisa dipakai dobel
// ---------------------------------------------------------------------------

// Untuk panel admin (lihat adminPage.ts): kumpulkan semua kode referral yang
// pernah tercatat (punya jumlah, namaTampilan, ATAU kodeReward), lalu ambil
// detail masing-masing.
export interface BarisAdmin {
  kode: string;
  jumlah: number;
  namaTampilan: string | null;
  kodeReward: string | null;
}

export async function kumpulkanDataAdmin(env: Env): Promise<BarisAdmin[]> {
  const daftarKey = await env.REFERRAL_KV.list({ prefix: 'referral:' });
  const kodeSet = new Set<string>();
  for (const k of daftarKey.keys) {
    const kode = k.name.replace(/^referral:/, '').replace(/:(jumlah|namaTampilan|kodeReward)$/, '');
    kodeSet.add(kode);
  }

  const baris = await Promise.all(
    [...kodeSet].map(async (kode): Promise<BarisAdmin> => {
      const [jumlahRaw, namaTampilan, kodeReward] = await Promise.all([
        env.REFERRAL_KV.get(`referral:${kode}:jumlah`),
        env.REFERRAL_KV.get(`referral:${kode}:namaTampilan`),
        env.REFERRAL_KV.get(`referral:${kode}:kodeReward`),
      ]);
      return { kode, jumlah: Number(jumlahRaw ?? '0'), namaTampilan, kodeReward };
    }),
  );

  return baris.sort((a, b) => b.jumlah - a.jumlah);
}
