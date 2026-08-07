// Gerbang kode akses — dicocokkan lewat hash, bukan teks polos.
//
// Kode aktif saat ini adalah kode SEMENTARA untuk testing: "JEJAKTEST".
//
// CARA MENGGANTI KE KODE ASLI (lakukan sebelum jual ke publik):
// 1. Tentukan kode akses final.
// 2. Hitung hash SHA-256-nya — JANGAN tempel kode polosnya di file ini.
//    Cara cepat lewat browser console (F12):
//      const data = new TextEncoder().encode('KODE_BARU_DI_SINI');
//      const buf = await crypto.subtle.digest('SHA-256', data);
//      console.log([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''));
// 3. Ganti nilai HASH_KODE_AKSES di bawah dengan hasil hash tadi.

export const HASH_KODE_AKSES = '89fa0c2391ac84357eab428ec0d3d6994445c99d8333816ee1fda6d5273e9981'; // hash dari "JEJAKTEST"

async function hitungHashSha256(teks: string): Promise<string> {
  const data = new TextEncoder().encode(teks);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function cocokkanKodeAkses(input: string): Promise<boolean> {
  const hash = await hitungHashSha256(input.trim());
  return hash === HASH_KODE_AKSES;
}
