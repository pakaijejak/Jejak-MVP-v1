import { useState, type CSSProperties } from 'react'
import Button from '../../components/Button'
import Screen from '../../components/Screen'
import { KALIMAT_GAP_KALIBRASI, KALIMAT_REASSURANCE_KALIBRASI } from '../../lib/kalibrasi'
import { updateKeputusan } from '../../lib/storage'
import { textInputStyle } from '../../styles/formStyles'
import type { Keputusan } from '../../types/keputusan'

const sectionTitleStyle: CSSProperties = {
  margin: '0 0 8px',
  fontWeight: 700,
  fontSize: '0.8rem',
  color: 'var(--color-ink-muted)',
  textTransform: 'uppercase',
  letterSpacing: '0.03em',
}

const fieldLabelStyle: CSSProperties = {
  margin: '0 0 2px',
  fontSize: '0.85rem',
  color: 'var(--color-ink-muted)',
}

const fieldValueStyle: CSSProperties = {
  margin: '0 0 12px',
  fontSize: '1rem',
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={fieldLabelStyle}>{label}</p>
      <p style={fieldValueStyle}>{value}</p>
    </div>
  )
}

const editLinkStyle: CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--color-accent)',
  fontSize: '0.85rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  whiteSpace: 'nowrap',
  padding: 0,
}

function FieldRefleksi({
  label,
  value,
  onSimpan,
}: {
  label: string
  value: string
  onSimpan: (nilaiBaru: string) => void
}) {
  const [mode, setMode] = useState<'lihat' | 'edit'>('lihat')
  const [draft, setDraft] = useState(value)

  function mulaiEdit() {
    setDraft(value)
    setMode('edit')
  }

  function simpan() {
    onSimpan(draft.trim())
    setMode('lihat')
  }

  function batal() {
    setDraft(value)
    setMode('lihat')
  }

  if (mode === 'edit') {
    return (
      <div style={{ marginBottom: 12 }}>
        <p style={fieldLabelStyle}>{label}</p>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          style={{ ...textInputStyle, resize: 'vertical' }}
          autoFocus
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
          <div style={{ flex: 1 }}>
            <Button variant="secondary" onClick={batal}>
              Batal
            </Button>
          </div>
          <div style={{ flex: 1 }}>
            <Button variant="primary" onClick={simpan}>
              Simpan
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ marginBottom: 12 }}>
      <p style={fieldLabelStyle}>{label}</p>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        {value ? (
          <p style={{ ...fieldValueStyle, margin: 0 }}>{value}</p>
        ) : (
          <p style={{ margin: 0, color: 'var(--color-ink-muted)' }}>Belum diisi</p>
        )}
        <button type="button" onClick={mulaiEdit} style={editLinkStyle}>
          {value ? 'Edit' : '+ Isi sekarang'}
        </button>
      </div>
    </div>
  )
}

interface DetailKeputusanProps {
  keputusan: Keputusan
  onKembali: () => void
  onUpdateKeputusan: (updated: Keputusan) => void
}

function DetailKeputusan({ keputusan, onKembali, onUpdateKeputusan }: DetailKeputusanProps) {
  const opsiTerpilih = keputusan.opsi[keputusan.opsiTerpilihIndex]?.teks ?? '-'
  const skorKalibrasi = keputusan.skorKalibrasi
  const kalimatGap = skorKalibrasi ? KALIMAT_GAP_KALIBRASI[skorKalibrasi] : undefined
  const kalimatReassurance = skorKalibrasi ? KALIMAT_REASSURANCE_KALIBRASI[skorKalibrasi] : undefined

  function simpanRefleksi(partial: Partial<NonNullable<Keputusan['refleksi']>>) {
    if (!keputusan.refleksi) return
    const updated = updateKeputusan(keputusan.id, {
      refleksi: { ...keputusan.refleksi, ...partial },
    })
    if (updated) {
      onUpdateKeputusan(updated)
    }
  }

  return (
    <Screen>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <button
          type="button"
          onClick={onKembali}
          aria-label="Kembali"
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            color: 'var(--color-ink)',
            cursor: 'pointer',
            padding: 4,
            lineHeight: 1,
            fontFamily: 'inherit',
          }}
        >
          ←
        </button>
        <h1 style={{ margin: 0, fontSize: '1.2rem' }}>Detail Keputusan</h1>
      </div>

      <section>
        <p style={sectionTitleStyle}>Awal</p>
        <Field label="Masalah" value={keputusan.masalah} />
        <Field label="Kategori" value={keputusan.kategori} />
        <Field label="Emosi" value={`${keputusan.emosi} (${keputusan.intensitasEmosi})`} />
      </section>

      <section>
        <p style={sectionTitleStyle}>Opsi &amp; Pertimbangan</p>
        <Field label="Info yang dimiliki" value={keputusan.infoYangDimiliki} />
        {keputusan.asumsiYangDianggapPasti && (
          <Field label="Asumsi yang dianggap pasti" value={keputusan.asumsiYangDianggapPasti} />
        )}
        <Field
          label="Sudah cek pandangan berbeda?"
          value={keputusan.sudahCekPandanganBerbeda ? 'Sudah' : 'Belum'}
        />
        <p style={fieldLabelStyle}>Opsi yang dipertimbangkan</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          {keputusan.opsi.map((o, i) => (
            <div key={i} style={{ border: '1px solid var(--color-ink-muted)', borderRadius: 8, padding: 10 }}>
              <p style={{ margin: 0, fontWeight: 600 }}>{o.teks}</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: 'var(--color-ink-muted)' }}>
                Skenario terburuk: {o.skenarioTerburuk}
              </p>
            </div>
          ))}
        </div>
        {keputusan.perspektifOrangLain && (
          <Field label="Perspektif orang lain" value={keputusan.perspektifOrangLain} />
        )}
      </section>

      <section>
        <p style={sectionTitleStyle}>Keputusan</p>
        <Field label="Opsi yang dipilih" value={opsiTerpilih} />
        <Field label="Keyakinan awal" value={`${keputusan.keyakinanAwal}%`} />
      </section>

      <section>
        <p style={sectionTitleStyle}>Hasil &amp; Refleksi</p>
        <Field label="Hasil" value={`${keputusan.hasilPersen}% sesuai harapan`} />
        {kalimatGap && (
          <div style={{ marginBottom: 12 }}>
            <p style={{ margin: 0 }}>{kalimatGap}</p>
            {kalimatReassurance && (
              <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>{kalimatReassurance}</p>
            )}
          </div>
        )}
        {keputusan.catatanHasil && <Field label="Catatan hasil" value={keputusan.catatanHasil} />}
        {keputusan.refleksi && (
          <>
            <FieldRefleksi
              label="Apa yang bikin hasilnya seperti ini?"
              value={keputusan.refleksi.apaYangBikinBegini}
              onSimpan={(v) => simpanRefleksi({ apaYangBikinBegini: v })}
            />
            <FieldRefleksi
              label="Bagian yang menolong / kurang"
              value={keputusan.refleksi.prosesYangMembantuAtauKurang}
              onSimpan={(v) => simpanRefleksi({ prosesYangMembantuAtauKurang: v })}
            />
            <FieldRefleksi
              label="Perasaan sekarang"
              value={keputusan.refleksi.perasaanSekarang}
              onSimpan={(v) => simpanRefleksi({ perasaanSekarang: v })}
            />
            <FieldRefleksi
              label="Hal yang mau dilakukan beda"
              value={keputusan.refleksi.halYangBedaKedepan}
              onSimpan={(v) => simpanRefleksi({ halYangBedaKedepan: v })}
            />
            <FieldRefleksi
              label="Pertanyaan paling susah dijawab"
              value={keputusan.refleksi.metaRefleksi ?? ''}
              onSimpan={(v) => simpanRefleksi({ metaRefleksi: v || undefined })}
            />
          </>
        )}
      </section>

      <Button variant="secondary" onClick={onKembali}>
        Kembali
      </Button>
    </Screen>
  )
}

export default DetailKeputusan
