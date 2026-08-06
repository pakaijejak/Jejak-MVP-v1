export interface Keputusan {
  id: string;
  createdAt: string; // ISO date string

  // Step 1 — Jeda Emosi
  emosi: 'Cemas' | 'Bingung' | 'Marah' | 'Sedih' | 'Netral' | 'Bersemangat';
  intensitasEmosi: 'Ringan' | 'Sedang' | 'Kuat';

  // Step 2 — Rumuskan Masalah
  masalah: string;
  kategori: 'Karier' | 'Uang' | 'Relasi' | 'Kesehatan' | 'Lainnya';

  // Step 3 — Cek Fakta vs Asumsi
  infoYangDimiliki: string;
  sudahCekPandanganBerbeda: boolean;

  // Step 4 — Opsi & Skenario Terburuk
  opsi: { teks: string; skenarioTerburuk: string }[];

  // Step 5 — Putuskan + Prediksi Keyakinan
  opsiTerpilihIndex: number; // index ke array opsi di atas
  keyakinanAwal: number; // 0-100

  // Step 6 — Jadwalkan Cek Ulang
  tanggalTargetReview: string; // ISO date string

  // Status (dipakai Beranda & Riwayat)
  status: 'menunggu_direview' | 'sudah_direview';

  // Step 7 — Catat Hasil Aktual (diisi belakangan, opsional dulu)
  hasilAktual?: 'Berhasil' | 'Campuran' | 'Tidak berhasil';
  catatanHasil?: string;

  // Step 8 — Skor Kalibrasi (dihitung dari keyakinanAwal vs hasilAktual, bukan input manual)
  skorKalibrasi?: 'Cukup Akurat' | 'Terlalu Yakin' | 'Kurang Yakin';

  // Step 9 — Refleksi Hasil
  refleksi?: {
    apaYangBikinBegini: string;
    prosesYangMembantuAtauKurang: string;
    perasaanSekarang: string;
    halYangBedaKedepan: string;
  };

  reviewedAt?: string; // ISO date string, kapan Step 7-9 selesai diisi
}

export type OptInStatus = 'belum_ditanya' | 'ya' | 'nanti_aja';
