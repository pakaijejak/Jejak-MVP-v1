// Worker Cloudflare untuk Runtut. Melayani app React statis (lewat ASSETS,
// otomatis oleh Cloudflare karena wrangler.jsonc punya "assets" + "main"),
// PLUS route API baru /api/referral/* dan /api/admin/referral untuk sistem
// referral (lihat worker/referral.ts). Sistem kode akses Runtut V1 (statis,
// di src/lib/aksesGerbang.ts) TIDAK disentuh sama sekali oleh Worker ini.

import { handleAdminReferral } from './adminPage';
import { handleReferral, type Env as ReferralEnv } from './referral';

export interface Env extends ReferralEnv {
  ASSETS: Fetcher;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/referral/')) {
      return handleReferral(request, env, url);
    }

    if (url.pathname === '/api/admin/referral') {
      return handleAdminReferral(request, env, url);
    }

    // Jaring pengaman: wrangler.jsonc sudah mengatur assets.run_worker_first
    // cuma untuk "/api/*", jadi request lain seharusnya sudah dilayani
    // otomatis oleh lapisan assets tanpa pernah sampai ke sini. Ini cuma
    // fallback kalau suatu saat ada request non-API yang somehow nyasar ke
    // worker ini.
    return env.ASSETS.fetch(request);
  },
};
