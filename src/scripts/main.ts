import { initShell, setTheme } from "./shell";
import { initCrtBoot } from "./crt";
import { initPacketStages } from "./packets";

initCrtBoot();
initPacketStages();

function initReveal() {
  const els = document.querySelectorAll<HTMLElement>(".reveal");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: "0px 0px -8% 0px" },
  );
  els.forEach((el) => io.observe(el));
}

function initActiveNav() {
  const links = new Map<string, HTMLElement>();
  document.querySelectorAll<HTMLElement>("[data-nav]").forEach((a) => links.set(a.dataset["nav"] ?? "", a));
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        const a = links.get(e.target.id);
        if (a) a.classList.toggle("active", e.isIntersecting);
      }
    },
    { rootMargin: "-45% 0px -50% 0px" },
  );
  links.forEach((_, id) => {
    const s = document.getElementById(id);
    if (s) io.observe(s);
  });
}

document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => setTheme());

initReveal();
initActiveNav();
initShell();
