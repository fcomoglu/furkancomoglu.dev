# furkancomoglu.dev

Kişisel portfolyo — Astro + TypeScript, statik çıktı, Cloudflare Workers (static assets, ücretsiz plan).

## Geliştirme

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # astro check + dist/
npm run preview
```

İçeriğin tamamı `src/data/profile.ts` dosyasında. CV PDF'i: `public/furkan-comoglu-resume.pdf`.

Sitede <kbd>`</kbd> (TR-Q klavyede `"` tuşu) ile açılan bir shell var: `help`, `whoami`, `ls`, `cd projects`, `experience`, `stack`, `contact`, `resume`, `theme`, `clear`, `exit`.

## Cloudflare'e deploy

**A) Git ile (önerilen):** Repoyu GitHub'a pushla → Cloudflare Dashboard → Workers & Pages → Create → Import a repository.
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`

Ayarlar `wrangler.jsonc` içinde (`assets.directory = ./dist`).

**B) Yerelden:** `npx wrangler login`, ardından `npm run deploy`.

Özel alan adı: Worker → Settings → Domains & Routes → `furkancomoglu.dev`.
