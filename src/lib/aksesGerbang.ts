// Gerbang kode akses — dicocokkan lewat hash, bukan teks polos.
//
// Kode aktif saat ini adalah kode SEMENTARA untuk testing: "RUNUTTEST".
//
// CARA MENGGANTI KE KODE ASLI (lakukan sebelum jual ke publik):
// 1. Tentukan kode akses final.
// 2. Hitung hash SHA-256-nya — JANGAN tempel kode polosnya di file ini.
//    Cara cepat lewat browser console (F12):
//      const data = new TextEncoder().encode('KODE_BARU_DI_SINI');
//      const buf = await crypto.subtle.digest('SHA-256', data);
//      console.log([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''));
// 3. Ganti nilai HASH_KODE_AKSES di bawah dengan hasil hash tadi.

export const HASH_KODE_AKSES = 'c8730ec796a09a329c29149cb5c2fa69d80d388a087b208ffaf0bdff94b0a4ad'; // hash dari "RUNUTTEST"

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
