// Gerbang kode akses — dicocokkan lewat hash, bukan teks polos.
//
// Kode aktif saat ini adalah kode FINAL: "RUNUTPIKIR".
//
// CARA MENGGANTI KE KODE BARU:
// 1. Tentukan kode akses baru, lalu ubah ke huruf besar semua (samakan dengan
//    normalisasi di cocokkanKodeAkses di bawah).
// 2. Hitung hash SHA-256-nya — JANGAN tempel kode polosnya di file ini.
//    Cara cepat lewat browser console (F12):
//      const data = new TextEncoder().encode('KODE_BARU_DI_SINI');
//      const buf = await crypto.subtle.digest('SHA-256', data);
//      console.log([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''));
// 3. Ganti nilai HASH_KODE_AKSES di bawah dengan hasil hash tadi.

export const HASH_KODE_AKSES = 'cfaa3ae4f352e0171c7c00bd15a47e095e17c38d17f2cd7e8e03a366e69e513a'; // hash dari "RUNUTPIKIR"

async function hitungHashSha256(teks: string): Promise<string> {
  const data = new TextEncoder().encode(teks);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function cocokkanKodeAkses(input: string): Promise<boolean> {
  const dinormalisasi = input.trim().toUpperCase();
  const hash = await hitungHashSha256(dinormalisasi);
  return hash === HASH_KODE_AKSES;
}
