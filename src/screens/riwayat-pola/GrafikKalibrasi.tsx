import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip as ChartTooltip,
} from 'chart.js'
import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import type { Keputusan } from '../../types/keputusan'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ChartTooltip, Legend)
ChartJS.defaults.font.family = "'Plus Jakarta Sans', system-ui, sans-serif"
ChartJS.defaults.color = '#5C6B74'

const ANGKA_HASIL: Record<NonNullable<Keputusan['hasilAktual']>, number> = {
  Berhasil: 100,
  Campuran: 50,
  'Tidak berhasil': 0,
}

function formatTanggalPendek(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}

interface GrafikKalibrasiProps {
  data: Keputusan[]
}

function GrafikKalibrasi({ data }: GrafikKalibrasiProps) {
  const sudahDireview = useMemo(
    () =>
      data
        .filter((k) => k.status === 'sudah_direview' && k.hasilAktual !== undefined)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [data],
  )

  if (sudahDireview.length === 0) {
    return (
      <p style={{ color: 'var(--color-ink-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '32px 0' }}>
        Grafik akan muncul setelah kamu mereview beberapa keputusan.
      </p>
    )
  }

  const chartData = {
    labels: sudahDireview.map((k) => formatTanggalPendek(k.createdAt)),
    datasets: [
      {
        label: 'Prediksi',
        data: sudahDireview.map((k) => k.keyakinanAwal),
        borderColor: '#C1793F',
        backgroundColor: '#C1793F',
        tension: 0.3,
      },
      {
        label: 'Hasil',
        data: sudahDireview.map((k) => ANGKA_HASIL[k.hasilAktual as NonNullable<Keputusan['hasilAktual']>]),
        borderColor: '#2B3A42',
        backgroundColor: '#2B3A42',
        tension: 0.3,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { min: 0, max: 100, ticks: { stepSize: 25 } },
    },
    plugins: {
      legend: { position: 'bottom' as const },
    },
  }

  return (
    <div style={{ height: 220 }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default GrafikKalibrasi
