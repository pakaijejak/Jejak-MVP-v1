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
// 3. Tambah/ganti entrinya di array HASH_KODE_AKSES_VALID di bawah. Field
//    `kadaluarsa` opsional: null = tidak pernah kadaluarsa, atau ISO 8601
//    dengan offset zona waktu eksplisit (misal '2026-08-21T23:59:00+07:00')
//    kalau kode itu memang harus berhenti berlaku mulai tanggal/jam tertentu.
//
// CATATAN JUJUR soal kadaluarsa: pengecekan ini mengandalkan jam di HP
// masing-masing user (tidak ada server buat verifikasi independen), jadi
// kalau ada yang mengubah jam HP-nya secara manual, batas ini bisa
// terlewati. Ini bukan bug, itu konsekuensi wajar dari arsitektur tanpa
// server, sama seperti keterbatasan hash yang sudah didokumentasikan di
// atas.

interface EntriKodeAkses {
  hash: string;
  kadaluarsa: string | null;
}

export const HASH_KODE_AKSES_VALID: EntriKodeAkses[] = [
  { hash: '81df67915933a0c017400905bde7b1b675568ced3aecf6b8318e61985e8318b4', kadaluarsa: null }, // hash dari "RUNTUTPIKIR"
  { hash: 'ad103e5436b5c2ecc9761557f2198bf22734256d0eb7884bc0a89ca9cc61bf74', kadaluarsa: '2026-08-21T23:59:00+07:00' }, // hash dari "RUNTUTTES" (sementara, testing) — berhenti berlaku 21 Agustus 2026 23:59 WIB
  { hash: '4760636d799ae816b4f1ea29c5a84dec8a62483a0914b6ef0df81608ab111ef2', kadaluarsa: null }, // hash dari "RUNTUTTES11"
  { hash: '9e0aa7f4f9a6e5ce3ab6b55703430ec8f06c32d4cde6ed77e5ce664d12dfd5f9', kadaluarsa: null }, // hash dari "RUNTUTTES12"
  { hash: 'a31d46eb1359e0f4c30d80a7ca2aeb604a1399e8b34082106f7830a34a187c7f', kadaluarsa: null }, // hash dari "RUNTUTPIKIR26"
  { hash: '2c02833a1a786ce828106c4c81346a178b60402713790cb9fc1fe48bb4a0fced', kadaluarsa: null }, // hash dari "RUNTUTPIKIR192"
  { hash: '1d74988c8756088ef19c5e4561fe3eb3b716156af8d153f1a1ed331aec4d7935', kadaluarsa: null }, // hash dari "RUNTUTPIKIR221"
  { hash: 'bee37098a23a2eccb22db3e2ba3212b0d5fb28f091c6d018d5f7cf4b06e89fd6', kadaluarsa: null }, // hash dari "RUNTUTPIKIR331"
  { hash: 'e1ecab44a5bfa95cde4b9741d2e6e94e06eaedaf726f473a59c5dbcf471e3949', kadaluarsa: null }, // hash dari "RUNTUTPIKIR921"
  { hash: '82ac2b657bbec11add2bb9c9834d9978cf1d0febcf35c72066432b0ffe4c552d', kadaluarsa: null }, // hash dari "RUNTUTTESIM"
  { hash: 'd460fa27dbaca95ffaaef15df88d88665cb230f11251918be3e17de9d7857684', kadaluarsa: null }, // hash dari "RUNTUTTESGUIM"
];

async function hitungHashSha256(teks: string): Promise<string> {
  const data = new TextEncoder().encode(teks);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export type HasilKodeAkses = 'diterima' | 'kadaluarsa' | 'tidak_cocok';

export async function cocokkanKodeAkses(input: string): Promise<HasilKodeAkses> {
  const dinormalisasi = input.trim().toUpperCase();
  const hash = await hitungHashSha256(dinormalisasi);
  const entri = HASH_KODE_AKSES_VALID.find((e) => e.hash === hash);

  if (!entri) return 'tidak_cocok';
  if (entri.kadaluarsa !== null && Date.now() >= new Date(entri.kadaluarsa).getTime()) {
    return 'kadaluarsa';
  }
  return 'diterima';
}
