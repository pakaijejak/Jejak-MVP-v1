// Gerbang kode akses — dicocokkan lewat hash, bukan teks polos.
//
// Kode aktif saat ini ada dua, cocok salah satu sudah dianggap benar:
// - "RUNTUTPIKIR": kode utama untuk pembeli.
// - "RUNTUTTES": kode SEMENTARA untuk keperluan testing internal.
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
  '81df67915933a0c017400905bde7b1b675568ced3aecf6b8318e61985e8318b4', // hash dari "RUNTUTPIKIR"
  'ad103e5436b5c2ecc9761557f2198bf22734256d0eb7884bc0a89ca9cc61bf74', // hash dari "RUNTUTTES" (sementara, testing)
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
