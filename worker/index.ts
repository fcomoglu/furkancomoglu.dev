// Single Worker for the site: 301 www -> apex, everything else served from static assets.
// Static files (/_astro/*, favicon) skip this code entirely (see run_worker_first in wrangler.jsonc).

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
}

const APEX = "furkancomoglu.dev";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.hostname === `www.${APEX}`) {
      url.protocol = "https:";
      url.hostname = APEX;
      url.port = "";
      return Response.redirect(url.toString(), 301);
    }
    return env.ASSETS.fetch(request);
  },
};
