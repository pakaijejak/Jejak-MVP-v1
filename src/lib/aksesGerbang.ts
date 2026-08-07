// Gerbang kode akses — dicocokkan lewat hash, bukan teks polos.
//
// Kode aktif saat ini ada dua, cocok salah satu sudah dianggap benar:
// - "RUNUTPIKIR": kode utama untuk pembeli.
// - "RUNUTTES": kode SEMENTARA untuk keperluan testing internal.
//   Cabut entri ini (hapus dari array di bawah) sebelum rilis final ke pembeli sungguhan.
//
// CARA MENAMBAH / MENGGANTI KODE:
// 1. Tentukan kode akses baru, lalu ubah ke huruf besar semua (samakan dengan
//    normalisasi di cocokkanKodeAkses di bawah).
// 2. Hitung hash SHA-256-nya — JANGAN tempel kode polosnya di file ini.
//    Cara cepat lewat browser console (F12):
//      const data = new TextEncoder().encode('KODE_BARU_DI_SINI');
//      const buf = await crypto.subtle.digest('SHA-256', data);
//      console.log([...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join(''));
// 3. Tambah/ganti nilainya di array HASH_KODE_AKSES_VALID di bawah.

export const HASH_KODE_AKSES_VALID = [
  'cfaa3ae4f352e0171c7c00bd15a47e095e17c38d17f2cd7e8e03a366e69e513a', // hash dari "RUNUTPIKIR"
  'da7aa8628eb29cd82a4f3487a1726fde923a96a53f3394a4ef644fb594e6657a', // hash dari "RUNUTTES" (sementara, testing)
]

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
  return HASH_KODE_AKSES_VALID.includes(hash);
}
