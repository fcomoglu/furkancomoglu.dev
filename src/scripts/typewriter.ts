// Hero name typed out character by character after the CRT power-on, caret following the text.
// The full name stays in the HTML (SEO, screen readers via aria-label, no-JS fallback).

const rand = (min: number, max: number) => min + Math.random() * (max - min);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function initTypewriter() {
  const heading = document.querySelector<HTMLElement>("[data-typewriter]");
  if (!heading) return;
  const parts = [...heading.querySelectorAll<HTMLElement>("[data-type]")];
  const caret = heading.querySelector<HTMLElement>(".caret");
  const texts = parts.map((p) => p.textContent ?? "");

  // keep the heading's height while it is empty/partial so nothing below jumps
  heading.style.minHeight = `${heading.offsetHeight}px`;
  parts.forEach((p) => (p.textContent = ""));
  caret?.classList.add("typing");

  const type = async () => {
    await sleep(200);
    for (const [i, part] of parts.entries()) {
      for (const ch of texts[i] ?? "") {
        part.textContent += ch;
        // human-ish rhythm: irregular keystrokes, a beat after finishing a word
        await sleep(ch === " " ? rand(90, 140) : rand(30, 75));
      }
    }
    caret?.classList.remove("typing");
    heading.style.removeProperty("min-height");
  };

  if (document.documentElement.classList.contains("crt-ready")) void type();
  else window.addEventListener("crt:ready", () => void type(), { once: true });
}
