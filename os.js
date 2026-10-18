(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const W = 1280, H = 800, GH = "https://github.com/3310N";
  const LINKS = [
    { name: "GitHub", g: "🐙", url: GH },
    { name: "LinkedIn", g: "💼", url: "https://www.linkedin.com/in/el-mahdi-masbah/" },
    { name: "Instagram", g: "📷", url: "https://www.instagram.com/el_mahdi_masbah/" },
  ];
  const SKILLS = ["JavaScript", "TypeScript", "React", "Angular", "Vue", "Next.js", "Node.js", "Python", "Java / Spring", "C# / .NET", "PHP / Symfony", "Flutter", "Django", "FastAPI", "SQL", "MongoDB", "Docker", "Git", "Linux", "AI / RAG"];
  const projUrl = p => `${GH}/${encodeURIComponent(p.repo)}`;
  const open_ = u => window.open(u, "_blank", "noopener");

  /* ---------- 3D rig ---------- */
  const rig = $("#rig"), stage = $("#stage");
  const st = { s: 1, rx: 0, ry: 0, tx: 0, ty: 0, mx: 0, my: 0, mouse: 0 };
  let mode = "desk", scaleDesk = 1, scaleFull = 1, booted = false;
  const apply = () => {
    rig.style.transform = `translate3d(${st.tx}px,${st.ty}px,0) scale(${st.s}) rotateX(${st.rx + st.my}deg) rotateY(${st.ry + st.mx}deg)`;
    const m = $("#mouse");
    m.style.transform = `translate(${st.mouse * 60}px,${st.mouse * -12}px) rotateX(78deg) rotateZ(${st.mouse * 10}deg)`;
  };
  const resize = () => {
    const vw = innerWidth, vh = innerHeight, mw = W + 56, mh = H + 56;
    scaleDesk = Math.min(vw * 0.6 / mw, vh * 0.5 / mh);
    scaleFull = Math.min(vw / W, vh / H);
    if (mode === "desk") { st.s = scaleDesk; st.ty = -30; st.tx = 0; }
    else { st.s = scaleFull; st.ty = 80 * scaleFull; st.tx = 0; }
    apply();
  };
  addEventListener("resize", resize); resize();
  st.ry = -14; st.rx = 6; st.s = scaleDesk * 0.6; apply();
  anime({ targets: st, s: scaleDesk, ry: 0, rx: 3, duration: 1600, easing: "easeOutExpo", update: apply });

  stage.addEventListener("pointermove", e => {
    if (mode !== "desk") return;
    const nx = e.clientX / innerWidth - .5, ny = e.clientY / innerHeight - .5;
    anime({ targets: st, mx: nx * 16, my: -ny * 8, mouse: nx, duration: 500, easing: "easeOutQuad", update: apply });
  });

  const focusIn = () => {
    mode = "full";
    $("#hint").style.opacity = 0;
    $("#zoombtn").textContent = "⤢ Desk view";
    anime({ targets: st, s: scaleFull, rx: 0, ry: 0, mx: 0, my: 0, tx: 0, ty: 80 * scaleFull, duration: 1400, easing: "easeInOutCubic", update: apply });
  };
  const focusOut = () => {
    mode = "desk"; $("#hint").style.opacity = 1;
    $("#hint").textContent = "Click the screen to zoom back in";
    anime({ targets: st, s: scaleDesk, rx: 3, ty: -30, duration: 1200, easing: "easeInOutCubic", update: apply });
  };
  $("#zoombtn").onclick = e => { e.stopPropagation(); mode === "full" ? focusOut() : focusIn(); };
  $("#screen").addEventListener("click", () => { if (booted && mode === "desk") focusIn(); });

  /* ---------- power / boot ---------- */
  const boot = () => {
    $("#off").hidden = true; $("#boot").hidden = false; $("#led").classList.add("on"); $("#glow").classList.add("on");
    anime({ targets: "#boot .logo", scale: [.7, 1], opacity: [0, 1], duration: 900, easing: "easeOutBack" });
    anime({ targets: "#boot .bar i", width: "100%", duration: 1800, delay: 300, easing: "easeInOutQuad", complete: () => {
      anime({ targets: "#boot", opacity: 0, duration: 400, easing: "linear", complete: () => {
        $("#boot").hidden = true; $("#os").hidden = false; booted = true;
        anime({ targets: "#icons .icon", translateY: [-16, 0], opacity: [0, 1], delay: anime.stagger(80), duration: 600, easing: "easeOutCubic" });
        anime({ targets: "#wall b", translateX: () => anime.random(-60, 60), translateY: () => anime.random(-60, 60), duration: 7000, direction: "alternate", loop: true, easing: "easeInOutSine" });
        setTimeout(() => { focusIn(); openApp("about"); }, 700);
      }});
    }});
  };
  $("#power").onclick = e => { e.stopPropagation(); boot(); };

  /* ---------- icons ---------- */
  const SVG = {
    folder: `<svg viewBox="0 0 64 64"><defs><linearGradient id="fa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fc2ff"/><stop offset="1" stop-color="#1b7be0"/></linearGradient><linearGradient id="fb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a6dcff"/><stop offset="1" stop-color="#4aa3f0"/></linearGradient></defs><path d="M6 14a5 5 0 0 1 5-5h14l6 6h22a5 5 0 0 1 5 5v31a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#fa)"/><path d="M6 24a5 5 0 0 1 5-5h42a5 5 0 0 1 5 5v26a5 5 0 0 1-5 5H11a5 5 0 0 1-5-5z" fill="url(#fb)"/></svg>`,
    about: `<svg viewBox="0 0 64 64"><defs><linearGradient id="ga" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8e7bff"/><stop offset="1" stop-color="#3a2bb8"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="14" fill="url(#ga)"/><circle cx="32" cy="25" r="10" fill="#fff"/><path d="M13 52c2-11 10-15 19-15s17 4 19 15z" fill="#fff"/></svg>`,
    links: `<svg viewBox="0 0 64 64"><defs><linearGradient id="la" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5ee1b4"/><stop offset="1" stop-color="#0a9c78"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="14" fill="url(#la)"/><circle cx="32" cy="32" r="18" fill="none" stroke="#fff" stroke-width="3"/><ellipse cx="32" cy="32" rx="8" ry="18" fill="none" stroke="#fff" stroke-width="3"/><path d="M14 32h36M17 23h30M17 41h30" stroke="#fff" stroke-width="2.5" fill="none"/></svg>`,
    skills: `<svg viewBox="0 0 64 64"><defs><linearGradient id="sa" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffb347"/><stop offset="1" stop-color="#e8541e"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="14" fill="url(#sa)"/><rect x="20" y="20" width="24" height="24" rx="4" fill="#fff"/><path d="M26 14v6M32 14v6M38 14v6M26 44v6M32 44v6M38 44v6M14 26h6M14 32h6M14 38h6M44 26h6M44 32h6M44 38h6" stroke="#fff" stroke-width="3" stroke-linecap="round"/><rect x="26" y="26" width="12" height="12" rx="2" fill="#e8541e"/></svg>`,
    terminal: `<svg viewBox="0 0 64 64"><defs><linearGradient id="ta" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4d5a"/><stop offset="1" stop-color="#12131a"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="14" fill="url(#ta)" stroke="#8a8ea0" stroke-width="1.5"/><path d="M17 24l11 8-11 8" fill="none" stroke="#7dffa8" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M32 42h15" stroke="#7dffa8" stroke-width="4" stroke-linecap="round"/></svg>`,
    doc: c => `<svg viewBox="0 0 64 64"><path d="M14 4h25l13 13v39a4 4 0 0 1-4 4H14a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="#f4f5f9"/><path d="M39 4l13 13H43a4 4 0 0 1-4-4z" fill="#c7cad6"/><rect x="10" y="38" width="42" height="16" fill="${c}"/><rect x="17" y="21" width="22" height="3" rx="1.5" fill="#c3c7d4"/><rect x="17" y="28" width="28" height="3" rx="1.5" fill="#d6d9e3"/><path d="M10 54v2a4 4 0 0 0 4 4h34a4 4 0 0 0 4-4v-2z" fill="${c}"/></svg>`,
    gh: `<svg viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="14" fill="#1b1f27"/><path fill="#fff" d="M32 12a20 20 0 0 0-6.3 39c1 .2 1.4-.4 1.4-1v-3.5c-5.6 1.2-6.8-2.7-6.8-2.7-.9-2.300-2.200-2.900-2.200-2.900-1.800-1.200.1-1.200.1-1.200 2 .1 3.100 2 3.100 2 1.800 3 4.700 2.200 5.800 1.700.2-1.300.7-2.200 1.300-2.700-4.500-.5-9.200-2.200-9.200-9.900 0-2.200.8-4 2.100-5.400-.2-.5-.9-2.600.2-5.300 0 0 1.700-.5 5.500 2a19 19 0 0 1 10 0c3.800-2.500 5.500-2 5.500-2 1.100 2.700.4 4.800.2 5.300 1.300 1.400 2.100 3.200 2.100 5.400 0 7.700-4.700 9.400-9.200 9.900.7.600 1.400 1.800 1.400 3.700V50c0 .6.400 1.200 1.400 1A20 20 0 0 0 32 12z"/></svg>`,
    li: `<svg viewBox="0 0 64 64"><rect x="4" y="4" width="56" height="56" rx="14" fill="#0a66c2"/><path fill="#fff" d="M17 26h6v20h-6zM20 16.500a3.500 3.500 0 1 1 0 7 3.500 3.500 0 0 1 0-7zM27 26h5.700v2.800c.9-1.600 3-3.300 6.200-3.300C45 25.500 47 29 47 34v12h-6V35.500c0-2.600-.9-4.400-3.200-4.400-2.400 0-3.800 1.700-3.800 4.400V46h-6z"/></svg>`,
    ig: `<svg viewBox="0 0 64 64"><defs><linearGradient id="ia" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stop-color="#fdc468"/><stop offset=".4" stop-color="#e1306c"/><stop offset="1" stop-color="#5b51d8"/></linearGradient></defs><rect x="4" y="4" width="56" height="56" rx="14" fill="url(#ia)"/><rect x="17" y="17" width="30" height="30" rx="9" fill="none" stroke="#fff" stroke-width="3.500"/><circle cx="32" cy="32" r="7" fill="none" stroke="#fff" stroke-width="3.500"/><circle cx="41" cy="23" r="2.200" fill="#fff"/></svg>`,
  };
  const TAGCOL = { AI: "#8e5bff", React: "#18a8d8", Angular: "#d62b3a", Java: "#e8541e", Spring: "#2fa84f", "E-commerce": "#e8a21e", Finance: "#0a9c78", Mobile: "#3b6cf0" };
  const docColor = p => { const t = p.tags.find(t => TAGCOL[t]); return t ? TAGCOL[t] : "#5b6579"; };
  LINKS[0].svg = SVG.gh; LINKS[1].svg = SVG.li; LINKS[2].svg = SVG.ig;

  /* ---------- apps ---------- */
  const APPS = {
    about:    { title: "About me", g: "about", w: 520, h: 380, render: () => `<div class="hero"><div class="avatar">M</div><div><h2 style="margin:0">El Mahdi Masbah</h2><p style="margin:2px 0 0">Software engineer · Morocco 🇲🇦</p></div></div>
      <p>Software engineer from Morocco 🇲🇦 — building full-stack web &amp; mobile apps and AI-powered tools.</p>
      <p>✨ Creating bugs since 2020<br>📚 Currently learning Svelte.js<br>🎯 Goal: Be your own boss</p>
      <p>Double-click the folders on the desktop to explore my work, or open the Terminal and type <code>help</code>.</p>` },
    projects: { title: "Projects", g: "folder", w: 760, h: 480, render: win => {
      win.querySelector(".wb").style.padding = "0";
      return `<div class="files" style="padding:18px">${PROJECTS.map((p, i) => `<div class="file" data-i="${i}">${SVG.doc(docColor(p))}<span>${esc(p.name)}</span></div>`).join("")}</div>`; },
      after: (win) => {
        const body = win.querySelector(".wb"); const status = document.createElement("div"); status.className = "status";
        status.innerHTML = `<span>Select a project — double-click to open on GitHub</span>`; win.append(status);
        let sel = null;
        body.querySelectorAll(".file").forEach(f => {
          const p = PROJECTS[f.dataset.i];
          f.onclick = () => { body.querySelectorAll(".file").forEach(x => x.classList.remove("sel")); f.classList.add("sel"); sel = p;
            status.innerHTML = `<span><b>${esc(p.name)}</b> — ${esc(p.desc)} · ${p.tags.map(esc).join(", ")}</span><a href="${projUrl(p)}" target="_blank" rel="noopener">Open ↗</a>`; };
          f.ondblclick = () => open_(projUrl(p));
        });
      } },
    links:    { title: "Links", g: "links", w: 460, h: 300, render: () => `<div class="files">${LINKS.map(l => `<a class="file" style="color:inherit;text-decoration:none" href="${l.url}" target="_blank" rel="noopener">${l.svg}<span>${l.name}</span></a>`).join("")}</div>` },
    skills:   { title: "Skills", g: "skills", w: 560, h: 340, render: () => `<h2>Tech stack</h2><div class="chips">${SKILLS.map(s => `<span>${esc(s)}</span>`).join("")}</div>` },
    terminal: { title: "Terminal", g: "terminal", w: 640, h: 400, render: () => `<div class="term"></div>`, after: win => terminal(win.querySelector(".term")) },
  };
  const ORDER = ["about", "projects", "links", "skills", "terminal"];

  /* desktop icons + dock */
  $("#icons").innerHTML = ["projects", "links"].map(k => `<div class="icon" data-app="${k}">${SVG[APPS[k].g]}<span>${APPS[k].title}</span></div>`).join("");
  $("#icons").addEventListener("click", e => { const i = e.target.closest(".icon"); if (!i) return;
    document.querySelectorAll(".icon").forEach(x => x.classList.remove("sel")); i.classList.add("sel"); });
  $("#icons").addEventListener("dblclick", e => { const i = e.target.closest(".icon"); if (i) openApp(i.dataset.app); });
  const dock = $("#dock");
  dock.innerHTML = ORDER.map(k => `<div class="di" data-app="${k}"><em>${APPS[k].title}</em>${SVG[APPS[k].g]}</div>`).join("");
  dock.addEventListener("click", e => { const d = e.target.closest(".di"); if (!d) return; const k = d.dataset.app;
    anime({ targets: d, translateY: [0, -22, 0], duration: 500, easing: "easeOutQuad" });
    if (wins[k] && !wins[k].min && wins[k].el.classList.contains("active")) minimize(k); else openApp(k); });
  dock.addEventListener("pointermove", e => dock.querySelectorAll(".di").forEach(d => {
    const r = d.getBoundingClientRect(), c = r.left + r.width / 2, dist = Math.abs(e.clientX - c) / st.s;
    d.style.transform = `scale(${1 + Math.max(0, 1 - dist / 110) * 0.55})`; }));
  dock.addEventListener("pointerleave", () => dock.querySelectorAll(".di").forEach(d => (d.style.transform = "")));
  $("#os").addEventListener("pointerdown", e => { if (!e.target.closest("#dock")) $("#icons").querySelectorAll(".icon").forEach(x => e.target.closest(".icon") || x.classList.remove("sel")); });
  const stars = $("#stars"); for (let i = 0; i < 70; i++) stars.insertAdjacentHTML("beforeend", `<circle cx="${Math.random() * 1280}" cy="${Math.random() * 300}" r="${Math.random() * 1.3 + .3}" opacity="${Math.random() * .8}"/>`);

  /* ---------- window manager ---------- */
  const wins = {}; let z = 10, n = 0;
  const dockItem = k => dock.querySelector(`[data-app=${k}]`);
  const focusWin = k => { Object.entries(wins).forEach(([id, w]) => w.el.classList.toggle("active", id === k)); if (wins[k]) { wins[k].el.style.zIndex = ++z; $("#appname").textContent = APPS[k].title; } };
  function openApp(k) {
    const w = wins[k];
    if (w) { if (w.min) restore(k); focusWin(k); return; }
    const a = APPS[k], el = document.createElement("div"); el.className = "win";
    el.style.cssText = `width:${a.w}px;height:${a.h}px;left:${120 + n * 36}px;top:${30 + n * 30}px`; n = (n + 1) % 6;
    el.innerHTML = `<div class="tb"><button class="dot c" title="Close"></button><button class="dot m" title="Minimize"></button><button class="dot x" title="Maximize"></button><span class="t">${a.title}</span></div><div class="wb"></div>`;
    $("#windows").append(el);
    el.querySelector(".wb").innerHTML = a.render(el);
    wins[k] = { el, min: false, max: false }; dockItem(k).classList.add("run");
    a.after && a.after(el);
    el.addEventListener("pointerdown", () => focusWin(k));
    el.querySelector(".c").onclick = () => closeApp(k);
    el.querySelector(".m").onclick = () => minimize(k);
    el.querySelector(".x").onclick = () => toggleMax(k);
    drag(el, el.querySelector(".tb"), k);
    focusWin(k);
    anime({ targets: el, scale: [.85, 1], opacity: [0, 1], duration: 380, easing: "easeOutBack" });
  }
  function closeApp(k) { const w = wins[k]; anime({ targets: w.el, scale: .9, opacity: 0, duration: 200, easing: "easeInQuad", complete: () => { w.el.remove(); dockItem(k).classList.remove("run"); delete wins[k]; $("#appname").textContent = "Finder"; } }); }
  function minimize(k) { const w = wins[k]; w.min = true; w.el.classList.remove("active"); anime({ targets: w.el, translateY: 80, scale: .8, opacity: 0, duration: 250, easing: "easeInQuad", complete: () => (w.el.style.display = "none") }); }
  function restore(k) { const w = wins[k]; w.min = false; w.el.style.display = "flex"; anime({ targets: w.el, translateY: 0, scale: 1, opacity: 1, duration: 250, easing: "easeOutQuad" }); }
  function toggleMax(k) { const w = wins[k], e = w.el; if (!w.max) { w.prev = e.style.cssText; e.style.left = "0"; e.style.top = "0"; e.style.width = W + "px"; e.style.height = H - 28 + "px"; } else e.style.cssText = w.prev; w.max = !w.max; e.style.zIndex = ++z; }
  function drag(el, handle, k) {
    handle.addEventListener("pointerdown", e => {
      if (e.target.closest(".dot") || wins[k].max) return;
      const sc = st.s, sx = e.clientX, sy = e.clientY, ox = el.offsetLeft, oy = el.offsetTop;
      handle.setPointerCapture(e.pointerId); handle.style.cursor = "grabbing";
      const mv = ev => { el.style.left = Math.max(-el.offsetWidth + 80, Math.min(W - 80, ox + (ev.clientX - sx) / sc)) + "px"; el.style.top = Math.max(0, Math.min(H - 130, oy + (ev.clientY - sy) / sc)) + "px"; };
      const up = () => { handle.style.cursor = ""; handle.removeEventListener("pointermove", mv); handle.removeEventListener("pointerup", up); };
      handle.addEventListener("pointermove", mv); handle.addEventListener("pointerup", up);
    });
  }

  /* ---------- terminal ---------- */
  function terminal(t) {
    const out = (h) => { const d = document.createElement("div"); d.className = "ln"; d.innerHTML = h; t.insertBefore(d, row); t.scrollTop = t.scrollHeight; };
    const row = document.createElement("div"); row.className = "in"; row.innerHTML = `<span>mahdi@os:~$</span><input spellcheck="false" autocomplete="off">`; t.append(row);
    const inp = row.querySelector("input"); t.onclick = () => inp.focus();
    const hist = []; let hi = 0;
    out("Welcome to MahdiOS. Type <b>help</b> to see commands.");
    const cmds = {
      help: () => "Commands: help, about, ls, open &lt;project|app&gt;, links, skills, whoami, clear",
      about: () => "El Mahdi Masbah — software engineer from Morocco.",
      whoami: () => "visitor (welcome!)",
      ls: () => PROJECTS.map(p => p.repo).join("\n"),
      links: () => LINKS.map(l => `${l.name}: <a href="${l.url}" target="_blank" rel="noopener">${l.url}</a>`).join("\n"),
      skills: () => SKILLS.join(", "),
      clear: () => { t.querySelectorAll(".ln").forEach(x => x.remove()); return null; },
      open: a => { const q = (a || "").toLowerCase(); if (APPS[q]) { openApp(q); return `opening ${q}…`; }
        const p = PROJECTS.find(p => p.repo.toLowerCase() === q || p.name.toLowerCase() === q);
        if (p) { open_(projUrl(p)); return `opening ${esc(p.name)}…`; } return "usage: open &lt;project-repo|about|projects|links|skills&gt;"; },
    };
    inp.addEventListener("keydown", e => {
      if (e.key === "ArrowUp") { hi = Math.max(0, hi - 1); inp.value = hist[hi] || ""; }
      if (e.key !== "Enter") return;
      const line = inp.value.trim(); inp.value = ""; if (!line) return; hist.push(line); hi = hist.length;
      out(`<span style="color:#fff">mahdi@os:~$ ${esc(line)}</span>`);
      const [c, ...r] = line.split(/\s+/), f = cmds[c.toLowerCase()];
      const res = f ? f(r.join(" ")) : `command not found: ${esc(c)}`; if (res != null) out(res);
    });
    setTimeout(() => inp.focus(), 50);
  }

  /* ---------- clock + small-screen fallback ---------- */
  const tick = () => ($("#clock").textContent = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  tick(); setInterval(tick, 20000);
  if (innerWidth < 700) $("#hint").textContent = "Best viewed on a larger screen — tap Power on";
})();
