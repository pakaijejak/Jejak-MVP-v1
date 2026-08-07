// HALAMAN SEMENTARA — hanya untuk testing manual data layer.
// Hapus sebelum deploy final (route: /debug).

import { useState } from 'react'
import { hitungSkorKalibrasi } from '../lib/kalibrasi'
import {
  ambilOnboardingSelesai,
  ambilOptInStatus,
  ambilPromptInstallDitutup,
  ambilSemuaKeputusan,
  ambilTerverifikasi,
  hapusSemuaData,
  setOnboardingSelesai,
  setOptInStatus,
  setPromptInstallDitutup,
  setTerverifikasi,
  tambahKeputusan,
  tambahKeputusanBanyak,
} from '../lib/storage'
import type { Keputusan } from '../types/keputusan'

function buatDataContoh(): Omit<Keputusan, 'id' | 'createdAt' | 'status'> {
  const targetReview = new Date()
  targetReview.setDate(targetReview.getDate() - 1)

  return {
    masalah: 'Contoh masalah dummy dibuat pada ' + new Date().toLocaleTimeString(),
    kategori: 'Hobi',
    emosi: 'Cemburu',
    intensitasEmosi: 'Sedang',
    infoYangDimiliki: 'Info dummy yang sudah dikumpulkan.',
    asumsiYangDianggapPasti: 'Saya anggap pasti atasan akan langsung setuju.',
    sudahCekPandanganBerbeda: true,
    opsi: [
      { teks: 'Opsi A (dummy)', skenarioTerburuk: 'Skenario terburuk A' },
      { teks: 'Opsi B (dummy)', skenarioTerburuk: 'Skenario terburuk B' },
    ],
    perspektifOrangLain: 'Teman bilang saya sudah cukup siap.',
    opsiTerpilihIndex: 0,
    keyakinanAwal: 70,
    tanggalTargetReview: targetReview.toISOString(),
  }
}

function hariLalu(n: number): string {
  const tanggal = new Date()
  tanggal.setDate(tanggal.getDate() - n)
  return tanggal.toISOString()
}

interface SpekVariatif {
  kategori: string
  emosi?: string
  keyakinanAwal: number
  hasilPersen?: number
  createdAtHariLalu: number
  reviewedAtHariLalu?: number
  asumsiYangDianggapPasti?: string
  perspektifOrangLain?: string
  metaRefleksi?: string
}

// Sebar kategori (Karier sengaja diberi 5 entri supaya insight pola di Step 8 ikut ketes,
// plus beberapa kategori custom di luar 4 kategori tetap), sebagian besar sudah_direview
// dengan variasi kalibrasi, sisanya menunggu_direview, tanggal disebar di beberapa hari
// terakhir supaya grafik punya bentuk. Beberapa entri diisi field baru
// (asumsiYangDianggapPasti, perspektifOrangLain, metaRefleksi, emosi custom dari Roda
// Perasaan) supaya fitur kategori/emosi custom dan layar detail Riwayat & Pola ikut ketes.
const SPEK_VARIATIF: SpekVariatif[] = [
  {
    kategori: 'Karier',
    emosi: 'Percaya Diri',
    keyakinanAwal: 88,
    hasilPersen: 92,
    createdAtHariLalu: 20,
    reviewedAtHariLalu: 14,
    asumsiYangDianggapPasti: 'Saya kira atasan pasti akan menolak.',
    perspektifOrangLain: 'Teman bilang saya terlalu takut ambil risiko.',
  },
  { kategori: 'Karier', keyakinanAwal: 90, hasilPersen: 10, createdAtHariLalu: 18, reviewedAtHariLalu: 12 },
  {
    kategori: 'Karier',
    emosi: 'Frustasi',
    keyakinanAwal: 25,
    hasilPersen: 85,
    createdAtHariLalu: 16,
    reviewedAtHariLalu: 10,
    metaRefleksi: 'Paling susah jawab soal perasaan sekarang.',
  },
  { kategori: 'Karier', keyakinanAwal: 60, hasilPersen: 55, createdAtHariLalu: 14, reviewedAtHariLalu: 8 },
  { kategori: 'Karier', keyakinanAwal: 80, hasilPersen: 15, createdAtHariLalu: 12, reviewedAtHariLalu: 6 },
  {
    kategori: 'Investasi',
    keyakinanAwal: 70,
    hasilPersen: 75,
    createdAtHariLalu: 10,
    reviewedAtHariLalu: 5,
    asumsiYangDianggapPasti: 'Saya pikir harga pasti naik terus.',
  },
  {
    kategori: 'Keluarga',
    emosi: 'Tenteram',
    keyakinanAwal: 50,
    hasilPersen: 45,
    createdAtHariLalu: 9,
    reviewedAtHariLalu: 4,
    perspektifOrangLain: 'Sahabat bilang wajar kalau ragu.',
  },
  { kategori: 'Hobi', keyakinanAwal: 65, createdAtHariLalu: 3 },
  { kategori: 'Relasi', keyakinanAwal: 55, createdAtHariLalu: 2 },
  { kategori: 'Kesehatan', keyakinanAwal: 40, createdAtHariLalu: 1 },
]

function buatBanyakDataContohVariatif(): Keputusan[] {
  return SPEK_VARIATIF.map((spek, index) => {
    const pending = spek.hasilPersen === undefined

    const dasar: Keputusan = {
      id: crypto.randomUUID(),
      createdAt: hariLalu(spek.createdAtHariLalu),
      masalah: `Contoh variatif ${spek.kategori} #${index + 1}`,
      kategori: spek.kategori,
      emosi: spek.emosi ?? 'Netral',
      intensitasEmosi: 'Sedang',
      infoYangDimiliki: 'Info dummy variatif.',
      asumsiYangDianggapPasti: spek.asumsiYangDianggapPasti,
      sudahCekPandanganBerbeda: true,
      opsi: [
        { teks: `Opsi A variatif ${index + 1}`, skenarioTerburuk: 'Skenario buruk A' },
        { teks: `Opsi B variatif ${index + 1}`, skenarioTerburuk: 'Skenario buruk B' },
      ],
      perspektifOrangLain: spek.perspektifOrangLain,
      opsiTerpilihIndex: 0,
      keyakinanAwal: spek.keyakinanAwal,
      tanggalTargetReview: pending ? hariLalu(1) : hariLalu(spek.reviewedAtHariLalu ?? 0),
      status: pending ? 'menunggu_direview' : 'sudah_direview',
    }

    if (pending || spek.hasilPersen === undefined) {
      return dasar
    }

    return {
      ...dasar,
      hasilPersen: spek.hasilPersen,
      catatanHasil: 'Catatan dummy variatif.',
      skorKalibrasi: hitungSkorKalibrasi(spek.keyakinanAwal, spek.hasilPersen),
      refleksi: {
        apaYangBikinBegini: 'Refleksi dummy.',
        prosesYangMembantuAtauKurang: 'Proses dummy.',
        perasaanSekarang: 'Perasaan dummy.',
        halYangBedaKedepan: 'Hal beda dummy.',
        metaRefleksi: spek.metaRefleksi,
      },
      reviewedAt: hariLalu(spek.reviewedAtHariLalu ?? 0),
    }
  })
}

function DebugPage() {
  const [semua, setSemua] = useState<Keputusan[]>(() => ambilSemuaKeputusan())
  const [onboardingSelesai, setOnboardingSelesaiState] = useState(() => ambilOnboardingSelesai())
  const [optInStatus, setOptInStatusState] = useState(() => ambilOptInStatus())
  const [terverifikasi, setTerverifikasiState] = useState(() => ambilTerverifikasi())
  const [promptInstallDitutup, setPromptInstallDitutupState] = useState(() => ambilPromptInstallDitutup())

  function refresh() {
    setSemua(ambilSemuaKeputusan())
  }

  function handleTambahDataContoh() {
    tambahKeputusan(buatDataContoh())
    refresh()
  }

  function handleTambahBanyakVariatif() {
    tambahKeputusanBanyak(buatBanyakDataContohVariatif())
    refresh()
  }

  function handleHapusSemua() {
    hapusSemuaData()
    refresh()
    setOnboardingSelesaiState(ambilOnboardingSelesai())
    setOptInStatusState(ambilOptInStatus())
    setTerverifikasiState(ambilTerverifikasi())
    setPromptInstallDitutupState(ambilPromptInstallDitutup())
  }

  function handleToggleOnboarding() {
    const next = !onboardingSelesai
    setOnboardingSelesai(next)
    setOnboardingSelesaiState(next)
  }

  function handleToggleTerverifikasi() {
    const next = !terverifikasi
    setTerverifikasi(next)
    setTerverifikasiState(next)
  }

  function handleTogglePromptInstall() {
    const next = !promptInstallDitutup
    setPromptInstallDitutup(next)
    setPromptInstallDitutupState(next)
  }

  function handleCycleOptIn() {
    const urutan: Array<typeof optInStatus> = ['belum_ditanya', 'ya', 'nanti_aja']
    const next = urutan[(urutan.indexOf(optInStatus) + 1) % urutan.length]
    setOptInStatus(next)
    setOptInStatusState(next)
  }

  return (
    <div>
      <h1>Halaman Debug (Sementara)</h1>
      <p>Halaman ini hanya untuk testing data layer. Akan dihapus sebelum deploy final.</p>

      <button type="button" onClick={handleTambahDataContoh}>
        Tambah Data Contoh
      </button>{' '}
      <button type="button" onClick={handleTambahBanyakVariatif}>
        Tambah 10 Data Contoh Variatif
      </button>{' '}
      <button type="button" onClick={handleHapusSemua}>
        Hapus Semua Data
      </button>

      <h2>Flag Global</h2>
      <p>
        terverifikasi: {String(terverifikasi)}{' '}
        <button type="button" onClick={handleToggleTerverifikasi}>
          Toggle
        </button>
      </p>
      <p>
        onboardingSelesai: {String(onboardingSelesai)}{' '}
        <button type="button" onClick={handleToggleOnboarding}>
          Toggle
        </button>
      </p>
      <p>
        promptInstallDitutup: {String(promptInstallDitutup)}{' '}
        <button type="button" onClick={handleTogglePromptInstall}>
          Toggle
        </button>
      </p>
      <p>
        optInStatus: {optInStatus}{' '}
        <button type="button" onClick={handleCycleOptIn}>
          Ubah
        </button>
      </p>

      <h2>Data Tersimpan ({semua.length})</h2>
      {semua.length === 0 ? (
        <p>Belum ada data.</p>
      ) : (
        <ul>
          {semua.map((k) => (
            <li key={k.id}>
              <pre>{JSON.stringify(k, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default DebugPage
