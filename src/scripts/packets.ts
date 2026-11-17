// "Network traffic" stage: a live, Wireshark-style packet list drawn on a canvas.
// Hover brightens nearby rows; clicking a row follows that TCP stream for 5 seconds.

interface Packet {
  no: number;
  t: string;
  src: string;
  dst: string;
  proto: string;
  len: number;
  info: string;
  stream: number;
}

const HOSTS = ["marketplace.example", "crm.example", "booking.example", "shop.example", "chat.example"];
const PATHS = [
  "/api/v1/vendors?city=istanbul",
  "/api/leads",
  "/api/reports/pipeline",
  "/api/bookings?page=2",
  "/api/catalog/search?q=dress",
  "/media/hero.webp",
  "/sitemap.xml",
  "/healthz",
];
const EDGE = "203.0.113.10";
const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)]!;

const COLS = ["No.", "Time", "Source", "Destination", "Proto", "Len", "Info"];
const ROW = 18;

function readColors() {
  const cs = getComputedStyle(document.documentElement);
  const v = (n: string) => cs.getPropertyValue(n).trim();
  return { fg: v("--text"), muted: v("--faint"), accent: v("--accent"), warm: v("--warm"), bad: v("--rose") };
}

function withAlpha(hex: string, a: number) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h.slice(0, 6);
  const n = parseInt(full, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export function initPacketStages() {
  document.querySelectorAll<HTMLElement>('.bgstage[data-bg="packets"]').forEach(mount);
}

function mount(stage: HTMLElement) {
  const canvas = stage.querySelector<HTMLCanvasElement>("canvas");
  const ctx = canvas?.getContext("2d");
  if (!canvas || !ctx) return;

  let W = 0;
  let H = 0;
  let colors = readColors();
  const mouse = { x: -9999, y: -9999 };
  const packets: Packet[] = [];
  let counter = 1;
  let acc = 0;
  let followed: number | null = null;
  let followUntil = 0;
  const start = performance.now();
  let running = false;
  let last = 0;
  let font = "11px monospace";

  const resize = () => {
    const r = stage.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width;
    H = r.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    font = `11px ${getComputedStyle(document.documentElement).getPropertyValue("--mono")}`;
  };

  const add = () => {
    const s = Math.floor(Math.random() * 40);
    const client = `198.51.100.${s + 10}`;
    const port = 40000 + 37 * s;
    const host = HOSTS[s % HOSTS.length]!;
    const upstream = `172.18.${(s % 5) + 1}.${(s % 7) + 2}`;
    const rows: [string, string, string, number, string][] = [
      [client, EDGE, "TCP", 74, `${port} → 443 [SYN] Seq=0 Win=64240 MSS=1460`],
      [EDGE, client, "TCP", 74, `443 → ${port} [SYN, ACK] Seq=0 Ack=1`],
      [client, EDGE, "TLSv1.3", 583, `Client Hello (SNI=${host})`],
      [client, EDGE, "HTTP2", 112, `HEADERS GET ${pick(PATHS)}`],
      ["172.18.0.2", upstream, "HTTP", 410, `GET ${pick(PATHS)} HTTP/1.1 (varnish MISS → api)`],
      [upstream, "172.18.0.2", "HTTP", 1514, "HTTP/1.1 200 OK (application/json)"],
      [upstream, "172.18.0.9", "AMQP", 236, "Basic.Publish exchange=events rk=lead.created"],
      [upstream, "172.18.0.7", "RESP", 88, "GET cache:vendor:listing:ist"],
      [EDGE, client, "HTTP2", 96, Math.random() < 0.12 ? "HEADERS 429 Too Many Requests" : "HEADERS 200 OK, DATA"],
      [client, "1.1.1.1", "DNS", 78, `Standard query A ${host}`],
      ["1.1.1.1", client, "DNS", 94, `Standard query response A ${host} A ${EDGE}`],
    ];
    const [src, dst, proto, len, info] = pick(rows);
    packets.push({
      no: counter++,
      t: ((performance.now() - start) / 1000).toFixed(6),
      src,
      dst,
      proto,
      len,
      info,
      stream: s,
    });
    if (packets.length > 80) packets.shift();
  };

  for (let i = 0; i < 60; i++) add();

  const columns = () =>
    W < 520
      ? [12, 52, 999, 999, 130, 999, 190]
      : W < 760
        ? [12, 52, 132, 999, 262, 999, 330]
        : [16, 70, 170, 330, 490, 570, 620];

  const text = (s: string, x: number, y: number, color: string) => {
    ctx.fillStyle = color;
    ctx.fillText(s, x, y);
  };

  const draw = (now: number) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    acc += 7 * dt;
    while (acc > 1) {
      acc--;
      add();
    }
    if (now > followUntil) followed = null;

    ctx.clearRect(0, 0, W, H);
    ctx.font = font;
    ctx.textBaseline = "middle";
    const cx = columns();
    const bottom = H - 24;

    COLS.forEach((h, i) => {
      if (cx[i]! < W - 40) text(h, cx[i]!, 18, withAlpha(colors.muted, 0.85));
    });

    for (let i = packets.length - 1, n = 0; i >= 0; i--, n++) {
      const y = bottom - ROW * n;
      if (y < 40) break;
      const p = packets[i]!;
      const near = Math.max(0, 1 - Math.abs(mouse.y - y) / 140);
      const isFollowed = followed !== null && p.stream === followed;
      const alpha = isFollowed ? 0.95 : 0.3 + 0.65 * near;
      const base = isFollowed
        ? colors.warm
        : p.info.includes("429")
          ? colors.bad
          : p.proto === "DNS"
            ? colors.accent
            : colors.fg;
      const cells = [String(p.no), p.t, p.src, p.dst, p.proto, String(p.len), p.info];
      cells.forEach((c, k) => {
        if (cx[k]! < W - 40) text(c, cx[k]!, y, withAlpha(base, alpha));
      });
    }

    if (running) requestAnimationFrame(draw);
  };

  const play = () => {
    if (running) return;
    running = true;
    last = performance.now();
    requestAnimationFrame(draw);
  };

  stage.addEventListener("pointermove", (e) => {
    const r = stage.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  stage.addEventListener("pointerleave", () => {
    mouse.x = mouse.y = -9999;
  });
  stage.addEventListener("click", (e) => {
    const r = stage.getBoundingClientRect();
    const y = e.clientY - r.top;
    const idx = packets.length - 1 - Math.round((H - 24 - y) / ROW);
    const p = packets[idx];
    if (p) {
      followed = p.stream;
      followUntil = performance.now() + 5000;
    }
  });

  new ResizeObserver(resize).observe(stage);
  new MutationObserver(() => (colors = readColors())).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) play();
    else running = false;
  }).observe(stage);

  resize();
}
