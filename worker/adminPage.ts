import { AMBANG_REFERRAL, kumpulkanDataAdmin, type BarisAdmin, type Env } from './referral';

function escapeHtml(teks: string): string {
  return teks
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function statusBaris(baris: BarisAdmin): string {
  if (baris.kodeReward) return `Sudah dapat kode: ${escapeHtml(baris.kodeReward)}`;
  if (baris.jumlah >= AMBANG_REFERRAL) return 'Capai ambang, kolam kosong';
  return 'Belum capai ambang';
}

function renderHtml(daftar: BarisAdmin[]): string {
  const baris = daftar
    .map(
      (b) => `
        <tr>
          <td>${escapeHtml(b.kode)}</td>
          <td>${b.jumlah}</td>
          <td>${b.namaTampilan ? escapeHtml(b.namaTampilan) : '-'}</td>
          <td>${statusBaris(b)}</td>
        </tr>`,
    )
    .join('');

  return `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8" />
<title>Panel Admin Referral — Runtut</title>
<style>
  body { font-family: system-ui, sans-serif; background: #f6f3ee; color: #2b3a42; padding: 24px; }
  h1 { font-size: 1.3rem; }
  table { border-collapse: collapse; width: 100%; max-width: 800px; background: #fff; }
  th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; font-size: 0.9rem; }
  th { background: #efe7db; }
  p.catatan { color: #5c6b74; font-size: 0.85rem; }
</style>
</head>
<body>
  <h1>Panel Admin Referral (read-only)</h1>
  <p class="catatan">
    Total kode referral tercatat: ${daftar.length}. Ambang reward: ${AMBANG_REFERRAL} konversi.
    Untuk cabut kode reward yang bocor, lakukan manual lewat dashboard Cloudflare KV.
  </p>
  <table>
    <thead>
      <tr><th>Kode Referral</th><th>Jumlah</th><th>Nama Tampilan</th><th>Status Reward</th></tr>
    </thead>
    <tbody>
      ${daftar.length === 0 ? '<tr><td colspan="4">Belum ada data.</td></tr>' : baris}
    </tbody>
  </table>
</body>
</html>`;
}

export async function handleAdminReferral(request: Request, env: Env, url: URL): Promise<Response> {
  const key = url.searchParams.get('key');
  if (!env.ADMIN_KEY || key !== env.ADMIN_KEY) {
    return new Response('Akses ditolak.', { status: 401, headers: { 'content-type': 'text/plain; charset=utf-8' } });
  }

  const daftar = await kumpulkanDataAdmin(env);
  return new Response(renderHtml(daftar), { headers: { 'content-type': 'text/html; charset=utf-8' } });
}
