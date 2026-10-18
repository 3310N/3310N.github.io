(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const C = CONTENT, W = 1280, H = 800;
  const isMobile = () => innerWidth < 760 || (innerWidth < 1000 && innerHeight > innerWidth);
  const MOBILE = isMobile();
  const open_ = u => u && window.open(u, "_blank", "noopener");

  /* ================= settings (persisted) ================= */
  const S = { theme: "dark", sound: false, rain: false, reduce: matchMedia("(prefers-reduced-motion: reduce)").matches, quality: "high", tod: "auto", flat: null };
  try { Object.assign(S, JSON.parse(localStorage.getItem("mahdi-os") || "{}")); } catch (_) {}
  const save = () => { try { localStorage.setItem("mahdi-os", JSON.stringify(S)); } catch (_) {} };
  const isDay = () => S.tod === "day" || (S.tod === "auto" && new Date().getHours() >= 7 && new Date().getHours() < 19);
  function applySettings() {
    document.body.classList.toggle("reduce", S.reduce);
    document.body.classList.toggle("lowq", S.quality === "low");
    $("#os").classList.toggle("light", S.theme === "light");
    const day = isDay(), st = $("#stage");
    st.classList.toggle("day", day); st.classList.toggle("night", !day); st.classList.toggle("rainy", S.rain);
    anime.speed = S.reduce ? 1000 : 1;
    rainSound(S.sound && S.rain);
  }

  /* ================= rain sound (WebAudio, user-gesture only) ================= */
  let ac, rainGain;
  function rainSound(on) {
    try {
      if (on && !ac) {
        ac = new (window.AudioContext || window.webkitAudioContext)();
        const len = ac.sampleRate * 2, buf = ac.createBuffer(1, len, ac.sampleRate), d = buf.getChannelData(0);
        let last = 0; for (let i = 0; i < len; i++) { last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = last * 3.5; }
        const src = ac.createBufferSource(); src.buffer = buf; src.loop = true;
        const f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 1400;
        rainGain = ac.createGain(); rainGain.gain.value = 0; src.connect(f).connect(rainGain).connect(ac.destination); src.start();
      }
      if (rainGain) { ac.resume && ac.resume(); rainGain.gain.setTargetAtTime(on ? 0.18 : 0, ac.currentTime, 0.3); }
    } catch (_) {}
  }

  /* ================= icons ================= */
  const g = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>`;
  const sq = (id, a, b, inner) => `<svg viewBox="0 0 64 64">${g(id, a, b)}<rect x="4" y="4" width="56" height="56" rx="14" fill="url(#${id})"/>${inner}</svg>`;
  const SVG = {
    folder: `<svg viewBox="0 0 64 64"><defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc2ff"/><stop offset="1" stop-color="#1b7be0"/></linearGradient><linearGradient id="fb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6dcff"/><stop offset="1" stop-color="#4aa3f0"/></linearGradient></defs><path d="M6 14a5 5 0 0 1 5-5h14l6 6h22a5 5 0 0 1 5 5v31a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#fa)"/><path d="M6 24a5 5 0 0 1 5-5h42a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#fb)"/></svg>`,
    about: sq("ga", "#8e7bff", "#3a2bb8", `<circle cx="32" cy="25" r="10" fill="#fff"/><path d="M13 52c2-11 10-15 19-15s17 4 19 15z" fill="#fff"/>`),
    experience: sq("xa", "#f7a24b", "#c4561b", `<rect x="14" y="24" width="36" height="24" rx="4" fill="#fff"/><path d="M25 24v-4a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v4" fill="none" stroke="#fff" stroke-width="3.5"/><path d="M14 35h36" stroke="#c4561b" stroke-width="2.500"/><rect x="29" y="32" width="6" height="7" rx="1.500" fill="#c4561b"/>`),
    skills: sq("sa", "#3ddc97", "#0a8f6a", `<rect x="20" y="20" width="24" height="24" rx="4" fill="#fff"/><path d="M26 14v6M32 14v6M38 14v6M26 44v6M32 44v6M38 44v6M14 26h6M14 32h6M14 38h6M44 26h6M44 32h6M44 38h6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="26" y="26" width="12" height="12" rx="2" fill="#0a8f6a"/>`),
    docs: sq("da", "#ff7a7a", "#c42b4a", `<path d="M20 12h17l9 9v29a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3V15a3 3 0 0 1 3-3z" fill="#fff"/><path d="M37 12l9 9h-7a2 2 0 0 1-2-2z" fill="#f2b3bd"/><rect x="22" y="30" width="18" height="3" rx="1.500" fill="#c42b4a"/><rect x="22" y="37" width="14" height="3" rx="1.500" fill="#e8a3b0"/>`),
    contact: sq("ca", "#4fc3ff", "#0a6fd8", `<rect x="13" y="19" width="38" height="27" rx="5" fill="#fff"/><path d="M15 23l17 12 17-12" fill="none" stroke="#0a6fd8" stroke-width="3" stroke-linejoin="round"/>`),
    terminal: sq("ta", "#4a4d5a", "#12131a", `<path d="M17 24l11 8-11 8" fill="none" stroke="#7dffa8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 42h15" stroke="#7dffa8" stroke-width="4" stroke-linecap="round"/>`),
    settings: sq("ea", "#9aa3b8", "#4b5368", `<circle cx="32" cy="32" r="8" fill="none" stroke="#fff" stroke-width="4"/><path d="M32 12v7M32 45v7M12 32h7M45 32h7M18 18l5 5M41 41l5 5M46 18l-5 5M23 41l-5 5" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`),
    recycle: sq("ra", "#7e8aa3", "#3a4256", `<path d="M19 22h26l-2 26a3 3 0 0 1-3 3H24a3 3 0 0 1-3-3z" fill="#fff"/><path d="M16 22h32M27 22v-4h10v4" stroke="#fff" stroke-width="3.500" stroke-linecap="round" fill="none"/><path d="M27 29v16M32 29v16M37 29v16" stroke="#7e8aa3" stroke-width="2.500"/>`),
    doc: c => `<svg viewBox="0 0 64 64"><path d="M14 4h25l13 13v39a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="#f4f5f9"/><path d="M39 4l13 13H43a4 4 0 0 1-4-4z" fill="#c7cad6"/><rect x="10" y="38" width="42" height="16" fill="${c}"/><rect x="17" y="21" width="22" height="3" rx="1.500" fill="#c3c7d4"/><rect x="17" y="28" width="28" height="3" rx="1.500" fill="#d6d9e3"/><path d="M10 54v2a4 4 0 0 0 4 4h34a4 4 0 0 0 4-4v-2z" fill="${c}"/></svg>`,
    gh: `<svg viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="14" fill="#1b1f27"/><circle cx="32" cy="32" r="16" fill="#fff"/><path d="M26 44v-5c-5 1-6-3-6-3m17 8v-5c0-2 .5-3 1-3 5-.5 9-2 9-9 0-2-.7-3.500-2-5 .3-1.500 0-3.500-.5-4.500 0 0-1.500 0-4.500 2a15 15 0 0 0-8 0c-3-2-4.500-2-4.500-2-.5 1-.8 3-.5 4.500-1.300 1.500-2 3-2 5 0 7 4 8.500 9 9" fill="none" stroke="#1b1f27" stroke-width="2.200"/></svg>`,
    li: `<svg viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="14" fill="#0a66c2"/><path fill="#fff" d="M17 26h6v20h-6zM20 16.500a3.500 3.500 0 1 1 0 7 3.500 3.500 0 0 1 0-7zM27 26h5.700v2.800c.9-1.600 3-3.300 6.200-3.300C45 25.500 47 29 47 34v12h-6V35.500c0-2.600-.9-4.400-3.200-4.400-2.400 0-3.800 1.700-3.800 4.400V46h-6z"/></svg>`,
    ig: `<svg viewBox="0 0 64 64"><defs><linearGradient id="ia" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fdc468"/><stop offset=".4" stop-color="#e1306c"/><stop offset="1" stop-color="#5b51d8"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="14" fill="url(#ia)"/><rect x="17" y="17" width="30" height="30" rx="9" fill="none" stroke="#fff" stroke-width="3.500"/><circle cx="32" cy="32" r="7" fill="none" stroke="#fff" stroke-width="3.500"/><circle cx="41" cy="23" r="2.200" fill="#fff"/></svg>`,
  };
  const CATCOL = { ai: "#8e5bff", backend: "#e8541e", automation: "#0a9c78", data: "#18a8d8", fullstack: "#3b6cf0", archive: "#6b7488" };
  const CATS = { all: "All projects", ai: "AI", backend: "Backend", automation: "Automation", data: "Data / BI", fullstack: "Full-stack", archive: "Archive" };

  /* ================= apps registry ================= */
  const APPS = {
    about:      { title: "About Me",       ico: "about",      path: "/home/mahdi/profile/",   w: 600, h: 470 },
    projects:   { title: "Projects",       ico: "folder",     path: "/home/mahdi/projects/",  w: 860, h: 520 },
    experience: { title: "Experience",     ico: "experience", path: "/home/mahdi/work/",      w: 640, h: 500 },
    skills:     { title: "Tech Stack",     ico: "skills",     path: "/home/mahdi/system/skills/", w: 620, h: 460 },
    docs:       { title: "CV & Documents", ico: "docs",       path: "/home/mahdi/documents/", w: 560, h: 360 },
    contact:    { title: "Contact",        ico: "contact",    path: "/home/mahdi/network/",   w: 520, h: 520 },
    terminal:   { title: "Terminal",       ico: "terminal",   path: "/system/terminal",       w: 660, h: 420 },
    settings:   { title: "Settings",       ico: "settings",   path: "/system/settings",       w: 520, h: 520 },
    recycle:    { title: "Recycle Bin",    ico: "recycle",    path: "/trash/",                w: 460, h: 320 },
  };
  const DESK = ["about", "projects", "experience", "skills", "docs", "contact", "terminal", "settings", "recycle"];
  const TASKBAR_ORDER = DESK;

  const badge = p => `<span class="badge ${esc(p.status)}">${esc(p.status)}</span>${p.verified ? "" : ' <span class="badge draft" title="Details not yet confirmed">Draft</span>'}`;
  const docColor = p => CATCOL[p.category] || "#5b6579";

  /* ---------- app bodies ---------- */
  function aboutHTML() {
    const p = C.profile;
    return `<div class="hero"><div class="avatar"><img src="assets/me.jpg" alt="Portrait of ${esc(p.name)}" width="84" height="84"></div><div><h2 style="margin:0">${esc(p.name)}</h2><p style="margin:2px 0 0">${esc(p.title)} · ${esc(p.location)}</p></div></div>
      <p>${esc(p.summary)}</p><div class="chips">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <h3>Timeline</h3><div class="tl">${p.timeline.map(t => `<div class="it"><div class="yr">${esc(t.year)}</div>${esc(t.text)}</div>`).join("")}</div>
      <h3>Education</h3>${p.education.map(e => `<div class="row"><b>${esc(e.school)}</b> · ${esc(e.years)}<br>${esc(e.degree)}</div>`).join("")}
      <h3>Languages</h3><div class="chips">${p.languages.map(l => `<span>${esc(l)}</span>`).join("")}</div>`;
  }
  function experienceHTML() {
    const kinds = ["Professional", "Internships", "Personal projects"];
    return kinds.map(k => `<h3>${k}</h3>` + C.experience.filter(e => e.kind === k).map(e => `<div class="row"><b>${esc(e.role)}</b> — ${esc(e.org)}${e.period ? ` <span class="badge">${esc(e.period)}</span>` : ""}${e.verified ? "" : ' <span class="badge draft">Draft</span>'}
      <ul>${e.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul><div class="chips">${(e.stack || []).map(s => `<span>${esc(s)}</span>`).join("")}</div></div>`).join("")).join("");
  }
  function docsHTML() {
    return C.docs.map(d => {
      const url = d.name.startsWith("Résumé") ? C.cv : d.url;
      return `<div class="row"><b>${esc(d.name)}</b><p style="margin:.2em 0 8px">${esc(d.note)}</p>${url ? `<a class="go" href="${esc(url)}" target="_blank" rel="noopener"${d.type === "pdf" ? " download" : ""}>${d.type === "pdf" ? "Download" : "Open"} ↗</a>` : `<button class="go" disabled>Not available yet</button>`}</div>`;
    }).join("");
  }
  const LINKS = [["GitHub", "gh", C.links.github], ["LinkedIn", "li", C.links.linkedin], ["Instagram", "ig", C.links.instagram]];
  function contactHTML() {
    const em = C.links.email;
    return `<h2>Get in touch</h2><p>Recruiters, engineering teams and clients — reach me on LinkedIn or GitHub${em ? ", or by e-mail" : ""}.</p>
      <div class="files" style="grid-template-columns:repeat(3,1fr);margin:8px 0 14px">${LINKS.map(([n, i, u]) => `<a class="file" href="${esc(u)}" target="_blank" rel="noopener">${SVG[i]}<span>${n}</span></a>`).join("")}</div>`
      + (em ? `<p><button class="go alt" id="rv">Reveal e-mail</button> <span id="rvout"></span></p>
      <h3>Message</h3><form class="form" id="cf"><label>Your name<input name="n" required></label><label>Your e-mail<input name="e" type="email" required></label><label>Message<textarea name="m" rows="4" required></textarea></label>
      <div><button class="go" type="submit">Send via your mail app</button> <small style="color:var(--mut)">No server involved — this opens your e-mail client.</small></div></form>` : `<p style="color:var(--mut)">A direct e-mail address isn't published on this site. Please send a LinkedIn message.</p>`);
  }
  function contactAfter(win) {
    const em = C.links.email;
    if (!em) return;
    $("#rv", win).onclick = () => { $("#rvout", win).innerHTML = em ? `<a href="mailto:${esc(em)}" style="color:var(--acc)">${esc(em)}</a>` : "Not published yet."; };
    $("#cf", win).onsubmit = e => {
      e.preventDefault(); if (!em) return;
      const f = new FormData(e.target);
      location.href = `mailto:${em}?subject=${encodeURIComponent("Portfolio message from " + f.get("n"))}&body=${encodeURIComponent(f.get("m") + "\n\n— " + f.get("n") + " (" + f.get("e") + ")")}`;
    };
  }
  function skillsHTML() { return `<div class="chips" id="sg">${C.skills.map((s, i) => `<button class="tab${i ? "" : " on"}" data-g="${i}">${esc(s.group)}</button>`).join("")}</div><div id="sl" class="chips"></div><div id="sinfo" class="row" style="margin-top:12px"></div>`; }
  function skillsAfter(win, opts = {}) {
    const showGroup = i => { $$("#sg button", win).forEach(b => b.classList.toggle("on", +b.dataset.g === i));
      $("#sl", win).innerHTML = C.skills[i].items.map(it => `<button data-s="${esc(it)}">${esc(it)}</button>`).join(""); $("#sinfo", win).innerHTML = "Select a skill to see where it was used."; };
    const showSkill = name => {
      const q = name.toLowerCase(), used = C.projects.filter(p => (p.stack || []).some(s => s.name.toLowerCase().includes(q.split(" / ")[0])));
      $$("#sl button", win).forEach(b => b.classList.toggle("on", b.dataset.s === name));
      $("#sinfo", win).innerHTML = `<b>${esc(name)}</b><br>${used.length ? "Used in: " + used.map(p => `<a href="#" data-p="${p.id}" style="color:var(--acc)">${esc(p.name)}</a>`).join(", ") : "No listed project uses it yet — it appears in my CV skills."}`;
    };
    win.addEventListener("click", e => {
      const t = e.target.closest("button[data-g]"); if (t) return showGroup(+t.dataset.g);
      const s = e.target.closest("button[data-s]"); if (s) return showSkill(s.dataset.s);
      const a = e.target.closest("a[data-p]"); if (a) { e.preventDefault(); openApp("projects", { project: a.dataset.p }); }
    });
    const gi = opts.skill ? Math.max(0, C.skills.findIndex(s => s.items.includes(opts.skill))) : 0;
    showGroup(gi); if (opts.skill) showSkill(opts.skill);
  }
  const RECYCLE = [["old_bugs.log", "Creating bugs since 2020 — this file was getting too big."], ["TODO_sleep.txt", "Moved here after 3 attempts."], ["final_final_v2_REAL.docx", "Nobody knows."], ["jQuery_tutorial.mp4", "Archived with respect."]];
  function recycleHTML() { return `<p>Nothing here belongs to you — it's just a prop.</p>` + RECYCLE.map(([n, t]) => `<div class="row" tabindex="0"><b>🗑 ${esc(n)}</b><br><small>${esc(t)}</small></div>`).join(""); }

  /* settings */
  function settingsHTML() {
    const sw = (k, label, sub) => `<div class="set"><div>${label}<small>${sub}</small></div><button class="sw" role="switch" data-k="${k}" aria-checked="${!!S[k]}" aria-label="${label}"></button></div>`;
    const sel = (k, label, opts) => `<div class="set"><div>${label}</div><select data-k="${k}">${opts.map(([v, t]) => `<option value="${v}"${S[k] === v ? " selected" : ""}>${t}</option>`).join("")}</select></div>`;
    return sel("theme", "Theme", [["dark", "Dark"], ["light", "Light"]]) + sel("tod", "Outside", [["auto", "Auto (local time)"], ["day", "Day"], ["night", "Night"]])
      + sw("rain", "Rain", "Show rain outside the window") + sw("sound", "Ambient rain sound", "Only plays while rain is on") + sw("reduce", "Reduced motion", "Disable animations")
      + sel("quality", "Animation quality", [["high", "High"], ["low", "Low (faster)"]])
      + `<div class="set"><div>Plain portfolio view<small>A conventional page, no 3D</small></div><button class="go" id="goflat">Switch</button></div>`;
  }
  function settingsAfter(win) {
    win.addEventListener("click", e => {
      const b = e.target.closest(".sw"); if (b) { S[b.dataset.k] = !S[b.dataset.k]; b.setAttribute("aria-checked", S[b.dataset.k]); apply_(); }
      if (e.target.id === "goflat") setFlat(true);
    });
    win.addEventListener("change", e => { const s = e.target.closest("select"); if (s) { S[s.dataset.k] = s.value; apply_(); } });
  }
  const apply_ = () => { save(); applySettings(); };

  /* terminal */
  function terminalAfter(win, opts = {}) {
    const t = $(".term", win), row = document.createElement("div"); row.className = "in";
    row.innerHTML = `<span>visitor@mah-desktop:~$</span><input spellcheck="false" autocomplete="off" aria-label="Terminal input">`; t.append(row);
    const inp = $("input", row), hist = []; let hi = 0;
    const out = h => { const d = document.createElement("div"); d.className = "ln"; d.innerHTML = h; t.insertBefore(d, row); t.scrollTop = t.scrollHeight; };
    const run = line => {
      out(`<span style="color:#fff">visitor@mah-desktop:~$ ${esc(line)}</span>`);
      const [c, ...r] = line.trim().split(/\s+/), a = r.join(" "), f = CMDS[(c || "").toLowerCase()];
      const res = f ? f(a) : `command not found: ${esc(c)} — try <b>help</b>`; if (res != null) out(res);
    };
    const CMDS = {
      help: () => "Commands: help · whoami · neofetch · ls [projects|skills|apps] · open &lt;app|project-id&gt; · projects [category] · skills · contact · theme dark|light · explore · clear",
      whoami: () => "visitor — welcome! You are exploring " + esc(C.profile.name) + "'s portfolio.",
      neofetch: () => `${esc(C.profile.name)}\n${esc(C.profile.title)}\nLocation: ${esc(C.profile.location)}\nProjects: ${C.projects.length}\nShell: MahdiOS (simulated, browser-only)`,
      explore: () => "Opening the Projects folder…" + (openApp("projects"), ""),
      ls: a => a === "skills" ? C.skills.map(s => s.group).join("\n") : a === "apps" ? DESK.join("\n") : C.projects.map(p => p.id).join("\n"),
      projects: a => C.projects.filter(p => !a || p.category === a).map(p => `${p.id.padEnd(26)} ${p.status}`).join("\n") || "no projects in that category",
      skills: () => C.skills.map(s => `${s.group}: ${s.items.join(", ")}`).join("\n"),
      contact: () => `GitHub: <a href="${C.links.github}" target="_blank" rel="noopener">${C.links.github}</a>\nLinkedIn: <a href="${C.links.linkedin}" target="_blank" rel="noopener">${C.links.linkedin}</a>\nUse the Contact app to reveal the e-mail.`,
      theme: a => (a === "dark" || a === "light") ? (S.theme = a, apply_(), "theme set to " + a) : "usage: theme dark|light",
      open: a => { const q = (a || "").toLowerCase(); if (APPS[q]) { openApp(q); return "opening " + q + "…"; } const p = C.projects.find(p => p.id === q); if (p) { openApp("projects", { project: p.id }); return "opening " + esc(p.name) + "…"; } return "usage: open &lt;app|project-id&gt;"; },
      sudo: () => "visitor is not in the sudoers file. This incident will be reported. (to nobody.)",
      clear: () => { $$(".ln", t).forEach(x => x.remove()); return null; },
    };
    out("Welcome to MahdiOS. Type <b>help</b> to see commands. (Simulated shell — it only queries portfolio data.)");
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") { hi = Math.max(0, hi - 1); inp.value = hist[hi] || ""; e.preventDefault(); }
      if (e.key === "ArrowDown") { hi = Math.min(hist.length, hi + 1); inp.value = hist[hi] || ""; }
      if (e.key !== "Enter") return;
      const l = inp.value.trim(); inp.value = ""; if (!l) return; hist.push(l); hi = hist.length; run(l);
    });
    t.onclick = () => inp.focus(); setTimeout(() => inp.focus(), 60);
    if (opts.cmd) run(opts.cmd);
  }

  /* ================= project explorer ================= */
  function explorerHTML() {
    return `<div class="ex"><div class="ex-bar"><button data-act="up" aria-label="Back">←</button><div class="crumb"></div><input class="exq" placeholder="Search projects" aria-label="Search projects"><select class="exs" aria-label="Sort"><option value="name">Name</option><option value="status">Status</option><option value="category">Category</option></select></div>
      <div class="ex-main"><aside>${Object.entries(CATS).map(([k, v]) => `<button data-cat="${k}">${v}</button>`).join("")}</aside><section></section></div></div>`;
  }
  function explorerAfter(win, opts = {}) {
    const st = { cat: "all", q: "", sort: "name", proj: opts.project || null };
    const sec = $("section", win), crumb = $(".crumb", win);
    const list = () => {
      let a = C.projects.filter(p => (st.cat === "all" || p.category === st.cat) && (!st.q || [p.name, p.summary, p.category, ...(p.stack || []).map(s => s.name)].join(" ").toLowerCase().includes(st.q)));
      a.sort((x, y) => String(x[st.sort] ?? x.name).localeCompare(String(y[st.sort] ?? y.name)) || x.name.localeCompare(y.name)); return a;
    };
    const render = () => {
      $$("aside button", win).forEach(b => b.classList.toggle("on", b.dataset.cat === st.cat));
      const p = st.proj && C.projects.find(x => x.id === st.proj);
      crumb.innerHTML = `<a href="#" data-cat="all">/home/mahdi/projects</a>${st.cat === "all" ? "" : `/<a href="#" data-cat="${st.cat}">${st.cat}</a>`}${p ? "/" + esc(p.id) : ""}`;
      if (p) return (sec.innerHTML = detail(p));
      const a = list();
      sec.innerHTML = a.length ? `<div class="files">${a.map(p => `<button class="file" data-id="${esc(p.id)}" title="${esc(p.summary)}">${SVG.doc(docColor(p))}<span>${esc(p.name)}</span>${badge(p)}</button>`).join("")}</div><p style="color:var(--mut);margin-top:14px;font-size:12px">${a.length} item${a.length > 1 ? "s" : ""} · ${MOBILE ? "tap" : "double-click or press Enter"} to open</p>` : "<p>No projects match.</p>";
    };
    const openProj = id => { st.proj = id; render(); sec.scrollTop = 0; };
    win.addEventListener("click", e => {
      const c = e.target.closest("[data-cat]"); if (c) { e.preventDefault(); st.cat = c.dataset.cat; st.proj = null; return render(); }
      if (e.target.closest("[data-act=up]")) { st.proj = null; return render(); }
      const f = e.target.closest(".file"); if (f) { if (MOBILE) return openProj(f.dataset.id); $$(".file", win).forEach(x => x.classList.remove("sel")); f.classList.add("sel"); }
      const cp = e.target.closest("[data-id]:not(.file)"); if (cp) openProj(cp.dataset.id);
    });
    win.addEventListener("dblclick", e => { const f = e.target.closest(".file"); if (f) openProj(f.dataset.id); });
    win.addEventListener("keydown", e => { const f = e.target.closest(".file"); if (f && e.key === "Enter") { e.preventDefault(); openProj(f.dataset.id); } if (e.key === "Backspace" && st.proj && !e.target.matches("input")) { st.proj = null; render(); } });
    $(".exq", win).addEventListener("input", e => { st.q = e.target.value.trim().toLowerCase(); st.proj = null; render(); });
    $(".exs", win).addEventListener("change", e => { st.sort = e.target.value; render(); });
    win._nav = id => openProj(id); render();
  }
  const section = (h, body) => body ? `<h3>${h}</h3>${body}` : `<h3>${h}</h3><p><em>To be added.</em></p>`;
  const ul = a => a && a.length ? `<ul>${a.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
  function detail(p) {
    const L = p.links || {};
    return `<h2>${esc(p.name)} ${badge(p)}</h2><p>${esc(p.summary)}</p>
      <div class="chips"><span>${esc(CATS[p.category] || p.category)}</span></div>
      ${section("Overview", (p.problem ? `<p><b>Problem.</b> ${esc(p.problem)}</p>` : "") + (p.solution ? `<p><b>Solution.</b> ${esc(p.solution)}</p>` : ""))}
      ${section("Architecture", p.architecture ? `<div class="flow">${p.architecture.map(x => `<b>${esc(x)}</b>`).join("<em>→</em>")}</div>` : "")}
      ${section("Technical stack", p.stack && p.stack.length ? `<dl class="kv">${p.stack.map(s => `<dt>${esc(s.name)}</dt><dd>${esc(s.role || "")}</dd>`).join("")}</dl>` : "")}
      ${section("Engineering decisions", ul(p.decisions))}${section("Evidence", ul(p.evidence))}${section("Results", ul(p.results))}
      ${L.demo ? `<h3>Links</h3><p><a class="go alt" href="${esc(L.demo)}" target="_blank" rel="noopener">Live demo ↗</a></p>` : ""}`;
  }

  /* ================= window manager ================= */
  const wins = {}; let z = 10, cascade = 0, booted = false, mode = "desk";
  const BODY = { about: aboutHTML, projects: explorerHTML, experience: experienceHTML, skills: skillsHTML, docs: docsHTML, contact: contactHTML, terminal: () => `<div class="term"></div>`, settings: settingsHTML, recycle: recycleHTML };
  const AFTER = { projects: explorerAfter, skills: skillsAfter, contact: contactAfter, terminal: terminalAfter, settings: settingsAfter };
  const scale = () => st.s || 1;
  const winClass = () => document.body.classList.toggle("has-win", Object.values(wins).some(w => !w.min));
  function focusWin(k) {
    winClass();
    Object.entries(wins).forEach(([id, w]) => { w.el.classList.toggle("active", id === k); w.task.classList.toggle("on", id === k && !w.min); });
    if (wins[k]) wins[k].el.style.zIndex = ++z;
  }
  function openApp(k, opts = {}) {
    closeMenus();
    let w = wins[k];
    if (w) { if (w.min) restore(k); focusWin(k); if (opts.project && w.el._nav) w.el._nav(opts.project); if (k === "skills" && opts.skill) { w.el.querySelector(".wb").innerHTML = skillsHTML(); skillsAfter(w.el, opts); } return; }
    const a = APPS[k], el = document.createElement("div"); el.className = "win"; el.dataset.k = k;
    el.style.cssText = `width:${a.w}px;height:${a.h}px;left:${236 + cascade * 30}px;top:${22 + cascade * 26}px`; cascade = (cascade + 1) % 6;
    el.setAttribute("role", "dialog"); el.setAttribute("aria-label", a.title);
    el.innerHTML = `<div class="tb"><button class="dot c" aria-label="Close"></button><button class="dot m" aria-label="Minimize"></button><button class="dot x" aria-label="Maximize"></button><span class="t">${a.title}</span></div><div class="wb"></div><div class="rz"></div>`;
    $("#windows").append(el);
    const body = $(".wb", el); body.innerHTML = BODY[k](); if (k === "projects" || k === "terminal") body.style.padding = "0";
    const task = document.createElement("button"); task.innerHTML = `${typeof SVG[a.ico] === "string" ? SVG[a.ico] : ""}<span>${a.title}</span>`; $("#tasks").append(task);
    wins[k] = { el, task, min: false, max: false };
    AFTER[k] && AFTER[k](el, opts);
    el.addEventListener("pointerdown", () => focusWin(k));
    $(".c", el).onclick = () => closeApp(k); $(".m", el).onclick = () => minimize(k); $(".x", el).onclick = () => toggleMax(k);
    $(".tb", el).addEventListener("dblclick", e => { if (!e.target.closest(".dot")) toggleMax(k); });
    task.onclick = () => (wins[k].min ? (restore(k), focusWin(k)) : el.classList.contains("active") ? minimize(k) : focusWin(k));
    drag(el, $(".tb", el), k); resize(el, $(".rz", el), k);
    focusWin(k);
    anime({ targets: el, scale: [.88, 1], opacity: [0, 1], duration: 320, easing: "easeOutBack" });
  }
  function closeApp(k) { const w = wins[k]; if (!w) return; delete wins[k]; winClass(); w.task.remove(); anime({ targets: w.el, scale: .92, opacity: 0, duration: 180, easing: "easeInQuad", complete: () => w.el.remove() }); }
  function minimize(k) { const w = wins[k]; w.min = true; winClass(); w.el.classList.remove("active"); w.task.classList.remove("on"); anime({ targets: w.el, translateY: 90, scale: .85, opacity: 0, duration: 220, easing: "easeInQuad", complete: () => (w.el.style.display = "none") }); }
  function restore(k) { const w = wins[k]; w.min = false; w.el.style.display = "flex"; anime({ targets: w.el, translateY: 0, scale: 1, opacity: 1, duration: 240, easing: "easeOutQuad" }); }
  function toggleMax(k) { const w = wins[k], e = w.el; if (!w.max) { w.prev = e.style.cssText; Object.assign(e.style, { left: "0", top: "0", width: W + "px", height: H - 44 + "px" }); } else e.style.cssText = w.prev; w.max = !w.max; e.style.zIndex = ++z; }
  function drag(el, handle, k) {
    handle.addEventListener("pointerdown", e => {
      if (MOBILE || e.target.closest(".dot") || wins[k].max) return;
      const sc = scale(), sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      handle.setPointerCapture(e.pointerId); handle.style.cursor = "grabbing";
      const mv = ev => { el.style.left = Math.max(-el.offsetWidth + 90, Math.min(W - 90, ox + (ev.clientX - sx) / sc)) + "px"; el.style.top = Math.max(0, Math.min(H - 110, oy + (ev.clientY - sy) / sc)) + "px"; };
      const up = () => { handle.style.cursor = ""; handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); };
      handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up);
    });
  }
  function resize(el, h, k) {
    h.addEventListener("pointerdown", e => {
      if (MOBILE || wins[k].max) return; e.stopPropagation(); focusWin(k);
      const sc = scale(), sx = e.clientX, sy = e.clientY, ow = el.offsetWidth, oh = el.offsetHeight;
      h.setPointerCapture(e.pointerId);
      const mv = ev => { el.style.width = Math.max(340, Math.min(W - el.offsetLeft, ow + (ev.clientX - sx) / sc)) + "px"; el.style.height = Math.max(220, Math.min(H - 44 - el.offsetTop, oh + (ev.clientY - sy) / sc)) + "px"; };
      const up = () => { h.removeEventListener("pointermove", mv); h.removeEventListener("pointerup", up); };
      h.addEventListener("pointermove", mv); h.addEventListener("pointerup", up);
    });
  }

  /* ================= desktop, widgets, taskbar ================= */
  const fire = k => openApp(k);
  function buildDesktop() {
    $("#icons").innerHTML = DESK.filter(k => k !== "recycle").map(k => `<div class="icon" role="listitem" tabindex="0" data-app="${k}" aria-label="${APPS[k].title} (double-click or press Enter)" title="${APPS[k].path}">${SVG[APPS[k].ico]}<span>${APPS[k].title}</span></div>`).join("")
      + `<div class="icon" role="listitem" tabindex="0" data-app="recycle" aria-label="Recycle Bin" title="/trash/">${SVG.recycle}<span>Recycle Bin</span></div>`;
    $("#icons").addEventListener("click", e => { const i = e.target.closest(".icon"); if (!i) return; if (MOBILE) return fire(i.dataset.app); $$(".icon").forEach(x => x.classList.remove("sel")); i.classList.add("sel"); });
    $("#icons").addEventListener("dblclick", e => { const i = e.target.closest(".icon"); if (i) fire(i.dataset.app); });
    $("#icons").addEventListener("keydown", e => { const i = e.target.closest(".icon"); if (i && e.key === "Enter") fire(i.dataset.app); });
    $("#os").addEventListener("pointerdown", e => { if (!e.target.closest(".icon,#start,#startbtn,#searchbtn,#panel,#wifi,#clockbtn")) { $$(".icon").forEach(x => x.classList.remove("sel")); closeMenus(); } });
    const wq = $("#wq"); wq.addEventListener("keydown", e => { if (e.key === "Enter" && wq.value.trim()) { const cmd = wq.value.trim(); wq.value = ""; openApp("terminal", { cmd }); } e.stopPropagation(); });
    const ws = $$("#wall circle,#wall path"); void ws;
  }
  function tick() {
    const d = new Date();
    $("#tclock").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    $("#wtime").textContent = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    $("#wdate").textContent = d.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
    if (S.tod === "auto") applySettings();
  }

  /* start menu + search */
  const INDEX = () => [
    ...DESK.map(k => ({ t: APPS[k].title, s: APPS[k].path, i: SVG[APPS[k].ico], go: () => openApp(k) })),
    ...C.projects.map(p => ({ t: p.name, s: "project", i: SVG.doc(docColor(p)), go: () => openApp("projects", { project: p.id }) })),
    ...C.skills.flatMap(sg => sg.items.map(it => ({ t: it, s: "skill · " + sg.group, i: SVG.skills, go: () => openApp("skills", { skill: it }) }))),
  ];
  let hiIdx = 0;
  function renderSearch() {
    const q = $("#sq").value.trim().toLowerCase(), all = INDEX();
    const res = (q ? all.filter(x => (x.t + " " + x.s).toLowerCase().includes(q)) : all.slice(0, DESK.length)).slice(0, 40);
    $("#sres").innerHTML = res.map((x, n) => `<button data-n="${n}" class="${n === hiIdx ? "hi" : ""}">${x.i}<span>${esc(x.t)}</span><small>${esc(x.s)}</small></button>`).join("") || "<p style='color:#9aa0b4;padding:8px'>No results.</p>";
    $("#sres")._res = res;
  }
  function toggleStart(force) {
    const el = $("#start"), show = force ?? el.hidden; closeMenus();
    el.hidden = !show; if (show) { $("#sq").value = ""; hiIdx = 0; renderSearch(); setTimeout(() => $("#sq").focus(), 30); anime({ targets: el, translateY: [14, 0], opacity: [0, 1], duration: 200, easing: "easeOutQuad" }); }
  }
  function closeMenus() { $("#start").hidden = true; $("#panel").hidden = true; }
  function panel(html) { const p = $("#panel"), was = !p.hidden && p.dataset.h === html; closeMenus(); if (was) return; p.dataset.h = html; p.innerHTML = html; p.hidden = false; anime({ targets: p, translateY: [14, 0], opacity: [0, 1], duration: 200, easing: "easeOutQuad" }); }
  function calendar() {
    const d = new Date(), y = d.getFullYear(), m = d.getMonth(), first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate();
    let cells = ["S", "M", "T", "W", "T", "F", "S"].map(x => `<b>${x}</b>`).join("") + "<span></span>".repeat(first);
    for (let i = 1; i <= days; i++) cells += `<span class="${i === d.getDate() ? "today" : ""}">${i}</span>`;
    panel(`<h4>${d.toLocaleDateString([], { month: "long", year: "numeric" })}</h4><div class="cal">${cells}</div>`);
  }
  function wifiPanel() {
    const c = navigator.connection || {}, on = navigator.onLine;
    panel(`<h4>Network</h4><p class="${on ? "ok" : "bad"}">● ${on ? "Connected (browser reports online)" : "Offline"}</p>${c.effectiveType ? `<p>Type: ${esc(c.effectiveType)}${c.downlink ? ` · ~${c.downlink} Mbps` : ""}</p>` : ""}<p style="font-size:12px;color:#9aa0b4">This is the visitor's browser connectivity. The portfolio can't see or change real Wi-Fi or system settings.</p>`);
  }
  function wifiIcon() { $("#wifi").style.color = navigator.onLine ? "" : "#ff8a8a"; }

  function buildChrome() {
    $("#startbtn").onclick = e => { e.stopPropagation(); toggleStart(); };
    $("#searchbtn").onclick = e => { e.stopPropagation(); toggleStart(true); };
    $("#clockbtn").onclick = e => { e.stopPropagation(); calendar(); };
    $("#wifi").onclick = e => { e.stopPropagation(); wifiPanel(); };
    $("#flatbtn").onclick = () => setFlat(true);
    $("#sq").addEventListener("input", () => { hiIdx = 0; renderSearch(); });
    $("#sq").addEventListener("keydown", e => {
      const n = ($("#sres")._res || []).length;
      if (e.key === "ArrowDown") { hiIdx = Math.min(n - 1, hiIdx + 1); renderSearch(); e.preventDefault(); }
      if (e.key === "ArrowUp") { hiIdx = Math.max(0, hiIdx - 1); renderSearch(); e.preventDefault(); }
      if (e.key === "Enter") { const r = $("#sres")._res[hiIdx]; if (r) { closeMenus(); r.go(); } }
    });
    $("#sres").addEventListener("click", e => { const b = e.target.closest("button[data-n]"); if (b) { const r = $("#sres")._res[+b.dataset.n]; closeMenus(); r && r.go(); } });
    addEventListener("online", wifiIcon); addEventListener("offline", wifiIcon); wifiIcon();
    document.addEventListener("keydown", e => {
      if (!booted) return;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); toggleStart(true); }
      else if (e.key === "Escape") { closeMenus(); }
      else if (e.altKey && e.key.toLowerCase() === "w") { const a = $(".win.active"); if (a) closeApp(a.dataset.k); }
    });
  }

  /* ================= 3D scene ================= */
  const rig = $("#rig"), stage = $("#stage"), st = { s: 1, rx: 0, ry: 0, tx: 0, ty: 0, mx: 0, my: 0, mouse: 0, px: 0 };
  let scaleDesk = 1, scaleFull = 1;
  const apply3 = () => {
    rig.style.transform = `translate3d(${st.tx}px,${st.ty}px,0) scale(${st.s}) rotateX(${st.rx + st.my}deg) rotateY(${st.ry + st.mx}deg)`;
    $("#mouse").style.transform = `translate(${st.mouse * 60}px,${st.mouse * -12}px) rotateX(78deg) rotateZ(${st.mouse * 10}deg)`;
  };
  const layout = () => {
    const vw = innerWidth, vh = innerHeight, mw = W + 60, mh = H + 76;
    scaleDesk = Math.min(vw * 0.6 / mw, vh * 0.5 / mh); scaleFull = Math.min(vw / W, vh / H);
    if (mode === "desk") { st.s = scaleDesk; st.ty = -30; } else { st.s = scaleFull; st.ty = 80 * scaleFull; }
    st.tx = 0; apply3();
  };
  function buildRoom() {
    let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
    let x = 0, b = ""; while (x < 2000) {
      const w = 40 + rnd() * 90, h = 120 + rnd() * 420, shade = 14 + Math.floor(rnd() * 14);
      b += `<rect x="${x}" y="${700 - h}" width="${w}" height="${h}" fill="rgb(${shade},${shade + 4},${shade + 18})"/>`;
      for (let wy = 700 - h + 14; wy < 690; wy += 22) for (let wx = x + 8; wx < x + w - 10; wx += 16) if (rnd() > .55) b += `<rect class="lit" x="${wx}" y="${wy}" width="7" height="10"/>`;
      x += w + 4 + rnd() * 10;
    }
    $("#city").innerHTML = b;
    $("#stars").innerHTML = Array.from({ length: 110 }, () => `<i style="left:${rnd() * 100}%;top:${rnd() * 55}%;animation-delay:${rnd() * 3}s"></i>`).join("");
    const ws = $("#wstars"); for (let i = 0; i < 70; i++) ws.insertAdjacentHTML("beforeend", `<circle cx="${Math.random() * 1280}" cy="${Math.random() * 300}" r="${Math.random() * 1.3 + .3}" opacity="${Math.random() * .8}"/>`);
  }
  function focusIn() { mode = "full"; $("#hint").style.opacity = 0; anime({ targets: st, s: scaleFull, rx: 0, ry: 0, mx: 0, my: 0, tx: 0, ty: 80 * scaleFull, duration: 1400, easing: "easeInOutCubic", update: apply3 }); }
  function focusOut() { mode = "desk"; $("#hint").style.opacity = 1; $("#hint").textContent = "Click the screen to zoom back in"; anime({ targets: st, s: scaleDesk, rx: 3, ty: -30, duration: 1200, easing: "easeInOutCubic", update: apply3 }); }
  function boot() {
    $("#off").hidden = true; $("#boot").hidden = false; $("#led").classList.add("on"); $("#glow").classList.add("on");
    anime({ targets: "#boot .logo", scale: [.7, 1], opacity: [0, 1], duration: 900, easing: "easeOutBack" });
    anime({ targets: "#boot .bar i", width: "100%", duration: 1700, delay: 300, easing: "easeInOutQuad", complete: () => {
      anime({ targets: "#boot", opacity: 0, duration: 400, easing: "linear", complete: () => {
        $("#boot").hidden = true; $("#os").hidden = false; booted = true; applySettings();
        anime({ targets: "#icons .icon", translateY: [-14, 0], opacity: [0, 1], delay: anime.stagger(60), duration: 500, easing: "easeOutCubic" });
        anime({ targets: ".wg", translateX: [30, 0], opacity: [0, 1], delay: anime.stagger(120), duration: 600, easing: "easeOutCubic" });
        setTimeout(() => { focusIn(); openApp("about"); }, 600);
      } });
    } });
  }
  function initScene() {
    buildRoom(); layout(); addEventListener("resize", layout);
    st.ry = -14; st.rx = 6; st.s = scaleDesk * .6; apply3();
    anime({ targets: st, s: scaleDesk, ry: 0, rx: 3, duration: 1600, easing: "easeOutExpo", update: apply3 });
    stage.addEventListener("pointermove", e => { if (mode !== "desk") return; const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
      anime({ targets: st, mx: nx * 16, my: -ny * 8, mouse: nx, duration: 500, easing: "easeOutQuad", update: apply3 }); });
    $("#zoombtn").onclick = e => { e.stopPropagation(); mode === "full" ? focusOut() : focusIn(); };
    $("#screen").addEventListener("click", () => { if (booted && mode === "desk") focusIn(); });
    $("#power").onclick = e => { e.stopPropagation(); boot(); };
    $("#power").focus && setTimeout(() => $("#power").focus({ preventScroll: true }), 1700);
  }

  function initMobile() {
    $("#off").hidden = true; $("#boot").hidden = true; $("#os").hidden = false; booted = true; applySettings();
    anime({ targets: "#icons .icon", translateY: [18, 0], opacity: [0, 1], delay: anime.stagger(50), duration: 450, easing: "easeOutCubic" });
    anime({ targets: ".wg", opacity: [0, 1], translateY: [-10, 0], duration: 500, easing: "easeOutCubic" });
  }
  const startUI = () => { sceneReady = true; document.body.classList.toggle("mobile", MOBILE); MOBILE ? initMobile() : initScene(); applySettings(); };

  /* ================= conventional (flat) view ================= */
  function renderFlat() {
    const p = C.profile, f = $("#flat");
    f.innerHTML = `<div class="wrap"><header><strong>mehdimasbah.me</strong><nav><a href="#f-projects">Projects</a><a href="#f-exp">Experience</a><a href="#f-skills">Skills</a><a href="#f-contact">Contact</a> <button class="btn" id="to3d">Open 3D desktop</button></nav></header>
      <img class="me" src="assets/me.jpg" alt="Portrait of ${esc(p.name)}" width="120" height="120"><h1>${esc(p.name)}</h1><p style="font-size:1.15rem">${esc(p.title)} · ${esc(p.location)}</p><p>${esc(p.summary)}</p><div class="chips">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
      <h2 id="f-projects">Projects</h2>${C.projects.map(x => `<div class="card"><h3>${esc(x.name)} <span class="badge">${esc(x.status)}</span>${x.verified ? "" : ' <span class="badge">Draft</span>'}</h3><p>${esc(x.summary)}</p><div class="chips">${(x.stack || []).map(s => `<span>${esc(s.name)}</span>`).join("")}</div>${x.links && x.links.demo ? `<a href="${esc(x.links.demo)}" target="_blank" rel="noopener">Demo ↗</a>` : ""}</div>`).join("")}
      <h2 id="f-exp">Experience</h2>${C.experience.map(e => `<div class="card"><h3>${esc(e.role)} — ${esc(e.org)}</h3><p>${esc(e.period)}</p><ul>${e.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul></div>`).join("")}
      <h2>Education & languages</h2>${p.education.map(e => `<p><b>${esc(e.school)}</b> (${esc(e.years)}) — ${esc(e.degree)}</p>`).join("")}<p>${p.languages.map(esc).join(" · ")}</p>
      <h2 id="f-skills">Skills</h2>${C.skills.map(s => `<p><b>${esc(s.group)}</b></p><div class="chips">${s.items.map(i => `<span>${esc(i)}</span>`).join("")}</div>`).join("")}
      <h2 id="f-contact">Contact</h2><p><a href="${C.links.linkedin}" target="_blank" rel="noopener">LinkedIn</a> · <a href="${C.links.github}" target="_blank" rel="noopener">GitHub</a> · <a href="${C.links.instagram}" target="_blank" rel="noopener">Instagram</a>${C.links.email ? ` · <a href="mailto:${esc(C.links.email)}">E-mail</a>` : ""}</p></div>`;
    $("#to3d", f).onclick = () => setFlat(false);
  }
  function setFlat(on) {
    S.flat = on; save(); document.body.classList.toggle("flat-on", on); $("#flat").hidden = !on;
    if (on) { renderFlat(); scrollTo(0, 0); } else if (!sceneReady) startUI();
  }
  let sceneReady = false;

  /* ================= start ================= */
  $("#wpname").textContent = C.profile.name; $("#wprole").textContent = C.profile.title; $("#wpimg").alt = "Portrait of " + C.profile.name;
  buildDesktop(); buildChrome(); tick(); setInterval(tick, 20000);
  $("#quick").onclick = () => setFlat(true); $("#tqv").onclick = () => setFlat(true);
  let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { if (isMobile() !== MOBILE && !S.flat) location.reload(); }, 250); });
  if (S.flat === true) { document.body.classList.add("flat-on"); $("#flat").hidden = false; renderFlat(); }
  else startUI();
  applySettings();
  const done = () => setTimeout(() => $("#loader").classList.add("done"), 250);
  document.readyState === "complete" ? done() : addEventListener("load", done);
})();
