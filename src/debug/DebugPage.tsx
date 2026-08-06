// HALAMAN SEMENTARA — hanya untuk testing manual data layer.
// Hapus sebelum deploy final (route: /debug).

import { useState } from 'react'
import {
  ambilOnboardingSelesai,
  ambilOptInStatus,
  ambilSemuaKeputusan,
  hapusSemuaData,
  setOnboardingSelesai,
  setOptInStatus,
  tambahKeputusan,
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
