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
  '4760636d799ae816b4f1ea29c5a84dec8a62483a0914b6ef0df81608ab111ef2', // hash dari "RUNTUTTES11"
  '9e0aa7f4f9a6e5ce3ab6b55703430ec8f06c32d4cde6ed77e5ce664d12dfd5f9', // hash dari "RUNTUTTES12"
  'a31d46eb1359e0f4c30d80a7ca2aeb604a1399e8b34082106f7830a34a187c7f', // hash dari "RUNTUTPIKIR26"
  '2c02833a1a786ce828106c4c81346a178b60402713790cb9fc1fe48bb4a0fced', // hash dari "RUNTUTPIKIR192"
  '1d74988c8756088ef19c5e4561fe3eb3b716156af8d153f1a1ed331aec4d7935', // hash dari "RUNTUTPIKIR221"
  'bee37098a23a2eccb22db3e2ba3212b0d5fb28f091c6d018d5f7cf4b06e89fd6', // hash dari "RUNTUTPIKIR331"
  'e1ecab44a5bfa95cde4b9741d2e6e94e06eaedaf726f473a59c5dbcf471e3949', // hash dari "RUNTUTPIKIR921"
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
