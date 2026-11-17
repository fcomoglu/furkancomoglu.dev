import { profile, experience, stack, projects, nav, languages, education } from "../data/profile";

type Out = string | Node;
type Command = { desc: string; run: (args: string[]) => Out[] | void; hidden?: boolean };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const html = (s: string): Node => {
  const p = document.createElement("p");
  p.innerHTML = s;
  return p;
};
const c = (cls: string, s: string) => `<span class="${cls}">${esc(s)}</span>`;
const link = (href: string, label: string, external = true) =>
  `<a href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${esc(label)}</a>`;

const sections = [...nav.map((n) => n.id), "background", "contact", "top"];

export function setTheme(next?: "light" | "dark") {
  const root = document.documentElement;
  const current =
    root.dataset["theme"] ?? (matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  const theme = next ?? (current === "dark" ? "light" : "dark");
  root.dataset["theme"] = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {
    /* storage unavailable */
  }
  return theme;
}

export function initShell() {
  const root = document.querySelector<HTMLElement>("[data-shell]");
  const out = document.querySelector<HTMLElement>("[data-shell-out]");
  const form = document.querySelector<HTMLFormElement>("[data-shell-form]");
  const input = form?.querySelector("input");
  if (!root || !out || !form || !input) return;

  const history: string[] = [];
  let hIdx = 0;
  let lastFocus: Element | null = null;

  const print = (...lines: Out[]) => {
    for (const l of lines) out.append(typeof l === "string" ? html(l) : l);
    out.scrollTop = out.scrollHeight;
  };

  const goto = (id: string) => {
    close();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const commands: Record<string, Command> = {
    help: {
      desc: "list commands",
      run: () => [
        c("muted", "available commands:"),
        ...Object.entries(commands)
          .filter(([, v]) => !v.hidden)
          .map(([k, v]) => `  ${c("accent", k.padEnd(12))}${c("muted", v.desc)}`),
        "",
        c("faint", "tip: ↑/↓ for history, tab to complete, esc to close"),
      ],
    },
    whoami: {
      desc: "who is this?",
      run: () => [`${c("accent", profile.name)}, ${esc(profile.role)}`, c("muted", profile.location), "", esc(profile.summary)],
    },
    ls: {
      desc: "list sections",
      run: () => [sections.filter((s) => s !== "top").map((s) => c("cyan", `${s}/`)).join("  ")],
    },
    cd: {
      desc: "jump to a section, e.g. cd projects",
      run: (args) => {
        const target = (args[0] ?? "top").replace(/\/$/, "").replace(/^~$/, "top");
        if (!sections.includes(target)) return [c("rose", `cd: no such section: ${target}`)];
        goto(target);
        return [];
      },
    },
    stack: {
      desc: "tech stack",
      run: () => stack.flatMap((s) => [c("amber", `# ${s.title}`), `  ${esc(s.items.join(", "))}`]),
    },
    experience: {
      desc: "git log of my career",
      run: () =>
        experience.map(
          (r) =>
            `${c("amber", r.hash)} ${c("rose", `(${r.tag})`)} ${esc(r.title)} @ ${c("accent", r.company)} ${c("faint", r.period)}`,
        ),
    },
    projects: {
      desc: "selected work",
      run: () => projects.map((p, i) => `${c("faint", String(i + 1).padStart(2, "0"))} ${esc(p.name)} ${c("violet", `[${p.domain}]`)}`),
    },
    education: {
      desc: "degrees & languages",
      run: () => [
        ...education.map((e) => `${esc(e.school)}: ${esc(e.degree)} ${c("faint", e.period)}`),
        "",
        languages.map((l) => `${l.name} ${c("faint", `(${l.level})`)}`).join(", "),
      ],
    },
    contact: {
      desc: "how to reach me",
      run: () => [
        `email     ${link(`mailto:${profile.email}`, profile.email, false)}`,
        ...profile.links.map((l) => `${l.label.toLowerCase().padEnd(10)}${link(l.href, l.href.replace(/^https?:\/\//, ""))}`),
      ],
    },
    resume: {
      desc: "download my resume (pdf)",
      run: () => {
        const a = document.createElement("a");
        a.href = profile.resume;
        a.download = "";
        a.click();
        return [c("accent", "downloading resume.pdf…")];
      },
    },
    email: {
      desc: "open a new email",
      run: () => {
        location.href = `mailto:${profile.email}`;
        return [c("muted", `opening mail client → ${profile.email}`)];
      },
    },
    theme: {
      desc: "toggle light / dark",
      run: (args) => {
        const arg = args[0];
        const t = setTheme(arg === "light" || arg === "dark" ? arg : undefined);
        return [c("muted", `theme → ${t}`)];
      },
    },
    clear: { desc: "clear the screen", run: () => void out.replaceChildren() },
    exit: { desc: "close the shell", run: () => void close() },
    sudo: { desc: "", hidden: true, run: () => [c("rose", "nice try. this incident will be reported.")] },
    date: { desc: "", hidden: true, run: () => [esc(new Date().toString())] },
    echo: { desc: "", hidden: true, run: (args) => [esc(args.join(" "))] },
    pwd: { desc: "", hidden: true, run: () => [`/home/${profile.user}`] },
    hire: { desc: "", hidden: true, run: () => commands["contact"]!.run([]) },
  };

  const exec = (raw: string) => {
    const line = raw.trim();
    print(`${c("accent", "➜")} ${c("cyan", "~")} ${esc(line)}`);
    if (!line) return;
    history.push(line);
    hIdx = history.length;
    const [name = "", ...args] = line.split(/\s+/);
    const cmd = commands[name.toLowerCase()];
    if (!cmd) {
      print(`${c("rose", `zsh: command not found: ${name}`)} ${c("faint", "(try 'help')")}`);
      return;
    }
    const res = cmd.run(args);
    if (res) print(...res);
  };

  function open(initial?: string) {
    if (!root || !input) return;
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.style.overflow = "hidden";
    if (!out!.childElementCount) {
      print(c("muted", `Last login: ${new Date().toDateString()} on ttys000`), `Type ${c("accent", "help")} to see what I can do.`, "");
    }
    if (initial !== undefined) exec(initial);
    input.focus();
  }

  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus instanceof HTMLElement) lastFocus.focus();
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value;
    input.value = "";
    exec(v);
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      hIdx = Math.max(0, hIdx - 1);
      input.value = history[hIdx] ?? "";
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hIdx = Math.min(history.length, hIdx + 1);
      input.value = history[hIdx] ?? "";
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [first = "", second] = input.value.split(/\s+/);
      if (second !== undefined && first === "cd") {
        const m = sections.find((s) => s.startsWith(second));
        if (m) input.value = `cd ${m}`;
      } else {
        const m = Object.keys(commands).find((k) => !commands[k]!.hidden && k.startsWith(first));
        if (m) input.value = m;
      }
    }
  });

  root.addEventListener("click", (e) => {
    if (e.target === root) close();
  });
  root.querySelector("[data-shell-close]")?.addEventListener("click", close);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") return close();
    const t = e.target as HTMLElement | null;
    const typing = t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable);
    // backtick; on Turkish Q layouts the same physical key types '"'
    if (!typing && (e.key === "`" || e.code === "Backquote") && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      if (root.hidden) open();
      else close();
    }
  });

  // hero prompt hands its command to the shell
  const hero = document.querySelector<HTMLFormElement>("[data-hero-prompt]");
  hero?.addEventListener("submit", (e) => {
    e.preventDefault();
    const field = hero.querySelector("input");
    const v = field?.value.trim() || "help";
    if (field) field.value = "";
    open(v);
  });
}
