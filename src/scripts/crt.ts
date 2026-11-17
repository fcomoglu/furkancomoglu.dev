// CRT power-on: flash line sweeps down, static noise, picture fades in with a small vertical jolt.
// Timings mirror the reference site's GSAP timeline, implemented with a single rAF loop.

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const easeIn = (t: number) => t * t; // power1.in
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2); // power2.inOut
const prog = (t: number, start: number, dur: number) => clamp01((t - start) / dur);

/* ---------- picture instability: subtle jitter + brightness flashes at random times ---------- */

const rand = (min: number, max: number) => min + Math.random() * (max - min);
let instabilityStarted = false;

function startInstability() {
  if (instabilityStarted) return;
  instabilityStarted = true;

  const pulse = document.querySelector<HTMLElement>(".crt-pulse");
  const targets = [document.querySelector("main"), document.querySelector(".nav")].filter(
    (el): el is HTMLElement => el instanceof HTMLElement,
  );
  const isDark = () => document.documentElement.dataset["theme"] !== "light";

  // 1px horizontal sync jitter (whole px only, so text never blurs)
  const jitter = () => {
    const dir = Math.random() < 0.5 ? 1 : -1;
    const frames: Keyframe[] = [
      { transform: "none" },
      { transform: `translateX(${dir}px)` },
      { transform: "none" },
      ...(Math.random() < 0.5 ? [{ transform: `translateX(${-dir}px)` }, { transform: "none" }] : []),
    ];
    for (const el of targets) el.animate(frames, { duration: 60 * frames.length, easing: "steps(1, end)" });
  };

  // occasional 1px sync jitter
  const tick = () => {
    if (isDark() && !document.hidden) jitter();
    setTimeout(tick, rand(4000, 11000));
  };
  setTimeout(tick, rand(1500, 3500));

  // continuous brightness instability: the picture never sits at one steady luminance.
  // Three sines at non-multiple frequencies -> an irregular drift that never visibly repeats.
  const dim = document.querySelector<HTMLElement>(".crt-dim");
  const flicker = document.querySelector<HTMLElement>(".crt-flicker");
  if (!pulse || !dim) return;
  const BRIGHTEN = 0.01; // max opacity of the light (screen) layer
  const DARKEN = 0.06; // max opacity of the dark layer
  const ph = [rand(0, 6), rand(0, 6), rand(0, 6)];
  const TAU = Math.PI * 2;
  const t0 = performance.now();
  const loop = (now: number) => {
    if (isDark() && !document.hidden) {
      const t = (now - t0) / 1000;
      const v =
        0.45 * Math.sin(TAU * 3.6 * t + ph[0]!) +
        0.35 * Math.sin(TAU * 9.2 * t + ph[1]!) +
        0.2 * Math.sin(TAU * 24.4 * t + ph[2]!);
      pulse.style.opacity = v > 0 ? (v * BRIGHTEN).toFixed(4) : "0";
      dim.style.opacity = v < 0 ? (-v * DARKEN).toFixed(4) : "0";
      // fast flicker: a new random intensity every frame (runs at the display refresh rate)
      if (flicker) flicker.style.opacity = Math.random().toFixed(3);
    }
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

export function initCrtBoot() {
  const boot = document.querySelector<HTMLElement>(".crt-boot");
  const main = document.querySelector<HTMLElement>("main");
  if (!boot || !main) return;

  let finished = false;
  const done = () => {
    if (finished) return;
    finished = true;
    boot.remove();
    main.style.removeProperty("filter");
    main.style.removeProperty("opacity");
    main.style.removeProperty("transform");
    startInstability();  };

  const lightTheme = document.documentElement.dataset["theme"] === "light";
  if (lightTheme || getComputedStyle(boot).display === "none") return done();

  const flash = boot.querySelector<HTMLElement>(".crt-flash");
  const canvas = boot.querySelector<HTMLCanvasElement>(".crt-noise");
  const ctx = canvas?.getContext("2d");
  if (!flash || !canvas || !ctx) return done();

  boot.style.animation = "none";
  const wide = matchMedia("(min-width: 900px)").matches;
  const img = ctx.createImageData(canvas.width, canvas.height);
  const vh = innerHeight / 100;

  const drawNoise = () => {
    const d = img.data;
    for (let i = 0; i < d.length; i += 4) {
      const r = Math.random() * 255;
      d[i] = r * 0.85;
      d[i + 1] = r;
      d[i + 2] = r;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  };

  const setMain = (p: number) => {
    if (wide) main.style.filter = `contrast(${p}) brightness(${p})`;
    else main.style.opacity = String(p);
  };

  // jolt keyframes (seconds → px), stepped
  const jolts: [number, number][] = [
    [0.86, -18],
    [1.03, 11],
    [1.24, -5],
    [1.41, 0],
  ];

  setMain(0);
  const t0 = performance.now();

  const frame = (now: number) => {
    const t = (now - t0) / 1000;

    // flash: 0.15–0.27 drop in, 0.27–0.43 sweep & squash, 0.43–0.53 fade
    if (t < 0.15) {
      flash.style.opacity = "0";
    } else if (t < 0.27) {
      const p = easeIn(prog(t, 0.15, 0.12));
      flash.style.opacity = String(p);
      flash.style.transform = `translateY(${lerp(0, 38 * vh, p)}px) scale(1, 0.8)`;
    } else if (t < 0.43) {
      const p = prog(t, 0.27, 0.16);
      flash.style.opacity = "1";
      flash.style.transform = `translateY(${lerp(-38 * vh, 30 * vh, p)}px) scale(${lerp(1, 1.3, p)}, ${lerp(0.8, 0.6, p)})`;
    } else {
      flash.style.opacity = String(1 - prog(t, 0.43, 0.1));
    }

    // noise: up 0.49–0.61, down 0.71–2.11
    if (t >= 0.49) {
      drawNoise();
      const up = prog(t, 0.49, 0.12) * 0.55;
      const down = easeIn(prog(t, 0.71, 1.4));
      canvas.style.opacity = String(up * (1 - down));
    }

    // picture: from 0.61
    if (t >= 0.61) {
      boot.style.backgroundColor = "transparent";
      setMain(easeInOut(prog(t, 0.61, wide ? 1.5 : 1.2)));
      let y = 0;
      for (const [at, px] of jolts) if (t >= at) y = px;
      main.style.transform = y ? `translateY(${y}px)` : "";
    }

    if (finished) return;
    if (t < 2.15) requestAnimationFrame(frame);
    else done();
  };

  requestAnimationFrame(frame);
  // safety net: never leave the page dark if frames stall (background tab, slow device)
  setTimeout(done, 4000);
}
