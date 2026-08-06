// HALAMAN SEMENTARA — hanya untuk testing manual data layer.
// Hapus sebelum deploy final (route: /debug).

import { useState } from 'react'
import { hitungSkorKalibrasi } from '../lib/kalibrasi'
import {
  ambilOnboardingSelesai,
  ambilOptInStatus,
  ambilSemuaKeputusan,
  hapusSemuaData,
  setOnboardingSelesai,
  setOptInStatus,
  tambahKeputusan,
  tambahKeputusanBanyak,
} from '../lib/storage'
import type { Keputusan } from '../types/keputusan'

function buatDataContoh(): Omit<Keputusan, 'id' | 'createdAt' | 'status'> {
  const targetReview = new Date()
  targetReview.setDate(targetReview.getDate() - 1)

  return {
    emosi: 'Cemas',
    intensitasEmosi: 'Sedang',
    masalah: 'Contoh masalah dummy dibuat pada ' + new Date().toLocaleTimeString(),
    kategori: 'Karier',
    infoYangDimiliki: 'Info dummy yang sudah dikumpulkan.',
    sudahCekPandanganBerbeda: true,
    opsi: [
      { teks: 'Opsi A (dummy)', skenarioTerburuk: 'Skenario terburuk A' },
      { teks: 'Opsi B (dummy)', skenarioTerburuk: 'Skenario terburuk B' },
    ],
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
  kategori: Keputusan['kategori']
  keyakinanAwal: number
  hasilAktual?: Keputusan['hasilAktual']
  createdAtHariLalu: number
  reviewedAtHariLalu?: number
}

// Sebar kategori (Karier sengaja diberi 5 entri supaya insight pola di Step 8 ikut ketes),
// sebagian besar sudah_direview dengan variasi kalibrasi, sisanya menunggu_direview,
// tanggal disebar di beberapa hari terakhir supaya grafik punya bentuk.
const SPEK_VARIATIF: SpekVariatif[] = [
  { kategori: 'Karier', keyakinanAwal: 88, hasilAktual: 'Berhasil', createdAtHariLalu: 20, reviewedAtHariLalu: 14 },
  { kategori: 'Karier', keyakinanAwal: 90, hasilAktual: 'Tidak berhasil', createdAtHariLalu: 18, reviewedAtHariLalu: 12 },
  { kategori: 'Karier', keyakinanAwal: 25, hasilAktual: 'Berhasil', createdAtHariLalu: 16, reviewedAtHariLalu: 10 },
  { kategori: 'Karier', keyakinanAwal: 60, hasilAktual: 'Campuran', createdAtHariLalu: 14, reviewedAtHariLalu: 8 },
  { kategori: 'Karier', keyakinanAwal: 80, hasilAktual: 'Tidak berhasil', createdAtHariLalu: 12, reviewedAtHariLalu: 6 },
  { kategori: 'Uang', keyakinanAwal: 70, hasilAktual: 'Berhasil', createdAtHariLalu: 10, reviewedAtHariLalu: 5 },
  { kategori: 'Relasi', keyakinanAwal: 50, hasilAktual: 'Campuran', createdAtHariLalu: 9, reviewedAtHariLalu: 4 },
  { kategori: 'Uang', keyakinanAwal: 65, createdAtHariLalu: 3 },
  { kategori: 'Relasi', keyakinanAwal: 55, createdAtHariLalu: 2 },
  { kategori: 'Kesehatan', keyakinanAwal: 40, createdAtHariLalu: 1 },
]

function buatBanyakDataContohVariatif(): Keputusan[] {
  return SPEK_VARIATIF.map((spek, index) => {
    const pending = spek.hasilAktual === undefined

    const dasar: Keputusan = {
      id: crypto.randomUUID(),
      createdAt: hariLalu(spek.createdAtHariLalu),
      emosi: 'Netral',
      intensitasEmosi: 'Sedang',
      masalah: `Contoh variatif ${spek.kategori} #${index + 1}`,
      kategori: spek.kategori,
      infoYangDimiliki: 'Info dummy variatif.',
      sudahCekPandanganBerbeda: true,
      opsi: [
        { teks: `Opsi A variatif ${index + 1}`, skenarioTerburuk: 'Skenario buruk A' },
        { teks: `Opsi B variatif ${index + 1}`, skenarioTerburuk: 'Skenario buruk B' },
      ],
      opsiTerpilihIndex: 0,
      keyakinanAwal: spek.keyakinanAwal,
      tanggalTargetReview: pending ? hariLalu(1) : hariLalu(spek.reviewedAtHariLalu ?? 0),
      status: pending ? 'menunggu_direview' : 'sudah_direview',
    }

    if (pending || !spek.hasilAktual) {
      return dasar
    }

    return {
      ...dasar,
      hasilAktual: spek.hasilAktual,
      catatanHasil: 'Catatan dummy variatif.',
      skorKalibrasi: hitungSkorKalibrasi(spek.keyakinanAwal, spek.hasilAktual),
      refleksi: {
        apaYangBikinBegini: 'Refleksi dummy.',
        prosesYangMembantuAtauKurang: 'Proses dummy.',
        perasaanSekarang: 'Perasaan dummy.',
        halYangBedaKedepan: 'Hal beda dummy.',
      },
      reviewedAt: hariLalu(spek.reviewedAtHariLalu ?? 0),
    }
  })
}

function DebugPage() {
  const [semua, setSemua] = useState<Keputusan[]>(() => ambilSemuaKeputusan())
  const [onboardingSelesai, setOnboardingSelesaiState] = useState(() => ambilOnboardingSelesai())
  const [optInStatus, setOptInStatusState] = useState(() => ambilOptInStatus())

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
  }

  function handleToggleOnboarding() {
    const next = !onboardingSelesai
    setOnboardingSelesai(next)
    setOnboardingSelesaiState(next)
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
        onboardingSelesai: {String(onboardingSelesai)}{' '}
        <button type="button" onClick={handleToggleOnboarding}>
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
