/* ═══════════════════════════════════════════════
   main.js — Flutter Portfolio
   ═══════════════════════════════════════════════ */
'use strict';

let DATA = null;

/* ───────────────────────────────────────────────
   LOADER
─────────────────────────────────────────────── */
let _loaderPct = 0;
let _loaderIv  = null;

function startLoader() {
  const bar = document.querySelector('#loaderBar');
  if (!bar) return;
  _loaderIv = setInterval(() => {
    _loaderPct += Math.random() * 16 + 6;
    if (_loaderPct >= 92) { _loaderPct = 92; clearInterval(_loaderIv); }
    bar.style.width = _loaderPct + '%';
  }, 80);
}

function finishLoader() {
  clearInterval(_loaderIv);
  const bar = document.querySelector('#loaderBar');
  if (bar) bar.style.width = '100%';
  setTimeout(() => {
    const loader = document.querySelector('#loader');
    if (loader) loader.classList.add('gone');
  }, 300);
}

/* ───────────────────────────────────────────────
   BOOT
─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  startLoader();

  fetch('data.json')
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    })
    .then(data => {
      DATA = data;
      buildAll();
    })
    .catch(err => {
      console.error('[Portfolio] Failed to load data.json:', err);
      finishLoader();
      document.body.insertAdjacentHTML('beforeend',
        `<div style="position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:#0b0d1a;color:#e2e8f0;font-family:sans-serif;z-index:100;flex-direction:column;gap:12px">
          <p style="font-size:18px;font-weight:700">⚠️ Gagal memuat data</p>
          <p style="color:#8892a4;font-size:13px">Pastikan server berjalan: <code style="color:#818cf8">python -m http.server 8080</code></p>
          <p style="color:#4a5568;font-size:12px">${err.message}</p>
        </div>`);
    });
});

/* ───────────────────────────────────────────────
   BUILD ALL
─────────────────────────────────────────────── */
function buildAll() {
  try { buildSEO();          } catch(e) { console.warn('[buildSEO]', e); }
  try { buildNav();          } catch(e) { console.warn('[buildNav]', e); }
  try { buildHero();         } catch(e) { console.warn('[buildHero]', e); }
  try { buildAbout();        } catch(e) { console.warn('[buildAbout]', e); }
  try { buildSkills();       } catch(e) { console.warn('[buildSkills]', e); }
  try { buildProjects();     } catch(e) { console.warn('[buildProjects]', e); }
  try { buildExperience();   } catch(e) { console.warn('[buildExperience]', e); }
  try { buildContact();      } catch(e) { console.warn('[buildContact]', e); }
  try { buildFooter();       } catch(e) { console.warn('[buildFooter]', e); }
  try { lucide.createIcons(); } catch(e) { console.warn('[lucide]', e); }
  try { setupAll();          } catch(e) { console.warn('[setupAll]', e); }

  // ALWAYS finish loader last
  finishLoader();
}

/* ───────────────────────────────────────────────
   SEO
─────────────────────────────────────────────── */
function buildSEO() {
  const s = DATA.seo || {};
  if (s.title) document.title = s.title;
  setMeta('description', s.description || '');
  setMeta('keywords',    s.keywords    || '');
}
function setMeta(name, content) {
  let el = document.querySelector(`meta[name="${name}"]`);
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

/* ───────────────────────────────────────────────
   NAV
─────────────────────────────────────────────── */
function buildNav() {
  const p = DATA.profile;
  setText('navName', p.name.split(' ')[0]);
  setText('availText', p.availableText || 'Open to work');
  if (!p.available) qs('#availPill')?.remove();
}

/* ───────────────────────────────────────────────
   HERO
─────────────────────────────────────────────── */
function buildHero() {
  const p = DATA.profile;

  setText('heroName', p.name);
  setText('heroBio',  p.bio);
  setText('chipTxt',  p.availableText || 'Open to work');

  // Typing taglines
  typingLoop(p.taglines || [], 'typed');

  // Orbit tech pills
  const pills  = DATA.techStack || [];
  const wrap   = qs('#techPills');
  const count  = Math.min(pills.length, 8);
  const cx = 140, cy = 140, radius = 116;

  pills.slice(0, count).forEach((name, i) => {
    const angle = (i / count) * 360 - 90;
    const rad   = angle * Math.PI / 180;
    const x     = cx + radius * Math.cos(rad);
    const y     = cy + radius * Math.sin(rad);
    const el    = document.createElement('div');
    el.className  = 'tp';
    el.textContent = name;
    el.style.cssText = `left:${x}px;top:${y}px;transform:translate(-50%,-50%);animation-delay:${i * 0.45}s`;
    wrap.appendChild(el);
  });

  // Stat chips
  const iconMap = { calendar:'calendar', smartphone:'smartphone', download:'download', star:'star' };
  const vsWrap  = qs('#visStats');
  (DATA.stats || []).forEach(s => {
    const ico = iconMap[s.icon] || 'bar-chart-2';
    vsWrap.insertAdjacentHTML('beforeend',
      `<div class="vs-chip">
        <i data-lucide="${ico}"></i>
        <span class="vs-val">${s.value}</span>
        <span>${s.label}</span>
      </div>`);
  });

  // Socials
  renderSocials('heroSocials', DATA.social || [], 'hs-link');
}


/* ───────────────────────────────────────────────
   ABOUT
─────────────────────────────────────────────── */
function buildAbout() {
  const p = DATA.profile;

  // Avatar
  if (p.avatar) {
    const img = new Image();
    img.src = p.avatar;
    img.alt = p.name;
    img.onerror = () => { /* keep default icon */ };
    img.onload  = () => {
      const av = qs('#acAvatar');
      if (av) { av.innerHTML = ''; av.appendChild(img); }
    };
  }

  setText('acName', p.name);
  setText('acRole', p.title);
  setText('acLoc',  p.location);
  setText('acBio',  p.bio);

  // Stats grid
  const sg      = qs('#statsGrid');
  const icoMap  = { calendar:'calendar', smartphone:'smartphone', download:'download', star:'star' };
  sg.classList.add('stagger');
  (DATA.stats || []).forEach(s => {
    sg.insertAdjacentHTML('beforeend',
      `<div class="sc">
        <div class="sc-ico"><i data-lucide="${icoMap[s.icon] || 'activity'}"></i></div>
        <div class="sc-val">${s.value}</div>
        <div class="sc-lbl">${s.label}</div>
      </div>`);
  });

  // Info rows
  const infoEl = qs('#infoStack');
  const rows   = [
    { icon:'mail',    lbl:'Email',    val: p.email,    href: `mailto:${p.email}` },
    { icon:'phone',   lbl:'Phone',    val: p.phone,    href: `tel:${p.phone}` },
    { icon:'map-pin', lbl:'Location', val: p.location },
  ];
  rows.forEach(r => {
    const inner = r.href
      ? `<a href="${r.href}" style="color:inherit;text-decoration:none">${r.val}</a>`
      : r.val;
    infoEl.insertAdjacentHTML('beforeend',
      `<div class="ir">
        <i data-lucide="${r.icon}"></i>
        <span class="ir-lbl">${r.lbl}:</span>
        <span class="ir-val">${inner}</span>
      </div>`);
  });
}

/* ───────────────────────────────────────────────
   SKILLS
─────────────────────────────────────────────── */
function buildSkills() {
  const tabs   = qs('#skillTabs');
  const panels = qs('#skillPanels');
  (DATA.skills || []).forEach((cat, i) => {
    tabs.insertAdjacentHTML('beforeend',
      `<button class="stab${i === 0 ? ' on' : ''}" data-i="${i}">${cat.category}</button>`);

    panels.insertAdjacentHTML('beforeend',
      `<div class="skill-panel${i === 0 ? ' on' : ''}" id="sp${i}">
        <div class="sk-grid stagger">
          ${cat.items.map(sk => `
            <div class="sk-card">
              <span class="sk-em">${sk.icon}</span>
              <div class="sk-info">
                <div class="sk-row">
                  <span class="sk-name">${sk.name}</span>
                  <span class="sk-pct">${sk.level}%</span>
                </div>
                <div class="sk-bar">
                  <div class="sk-fill" data-lv="${sk.level}"></div>
                </div>
              </div>
            </div>`).join('')}
        </div>
      </div>`);
  });

  // Tab click
  tabs.addEventListener('click', e => {
    const btn = e.target.closest('.stab');
    if (!btn) return;
    qAll('.stab').forEach(b => b.classList.remove('on'));
    qAll('.skill-panel').forEach(p => p.classList.remove('on'));
    btn.classList.add('on');
    const panel = qs(`#sp${btn.dataset.i}`);
    panel.classList.add('on');
    animBars(panel);
    panel.querySelectorAll('.sk-card').forEach(c => c.classList.add('animated'));
  });

  // Animate initial panel bars after short delay
  setTimeout(() => animBars(qs('#sp0')), 500);
}

function animBars(panel) {
  if (!panel) return;
  panel.querySelectorAll('.sk-fill').forEach(f => {
    requestAnimationFrame(() => { f.style.width = (f.dataset.lv || 0) + '%'; });
  });
}

/* ───────────────────────────────────────────────
   PROJECTS
─────────────────────────────────────────────── */
const EMOJI_MAP = {
  Finance:'💰', Lifestyle:'🍕', Education:'📚',
  Utility:'🌤️', Productivity:'✅', Health:'💪', Social:'💬'
};

function buildProjects() {
  const projects = DATA.projects || [];

  // Filter buttons
  const cats = ['All', ...new Set(projects.map(p => p.category))];
  const filterRow = qs('#filterRow');
  cats.forEach(c => {
    filterRow.insertAdjacentHTML('beforeend',
      `<button class="filt${c === 'All' ? ' on' : ''}" data-cat="${c}">${c}</button>`);
  });
  filterRow.addEventListener('click', e => {
    const btn = e.target.closest('.filt');
    if (!btn) return;
    qAll('.filt').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
    const cat = btn.dataset.cat;
    renderGrid(cat === 'All' ? projects : projects.filter(p => p.category === cat));
  });

  renderGrid(projects);
}

function renderGrid(list) {
  const grid = qs('#projGrid');
  grid.innerHTML = '';
  list.forEach((proj, i) => {
    const emoji = proj.emoji || EMOJI_MAP[proj.category] || '📱';
    const stCls = proj.status === 'Published'   ? 's-pub'
                : proj.status === 'Open Source' ? 's-open' : 's-wip';
    const platforms = (proj.platform || []).map(pl => `<span class="pc-plat-tag">${pl}</span>`).join('');
    const tagHtml   = proj.tags.slice(0, 4).map(t => `<span class="pc-tag">${t}</span>`).join('');
    const hasMeta   = proj.downloads !== '—' || proj.rating !== '—';

    const hasCardImage = proj.images && proj.images.length > 0;

    grid.insertAdjacentHTML('beforeend',
      `<div class="proj-card ${hasCardImage ? 'has-thumb' : 'no-thumb'}" style="transition-delay:${i * 0.06}s" data-id="${proj.id}">
        ${proj.images && proj.images.length ? `
          <div class="pc-img" style="height: 160px; overflow: hidden; border-bottom: 1px solid var(--border); position: relative">
            <img src="${proj.images[0]}" alt="${proj.title} Screenshot" style="width: 100%; height: 100%; object-fit: cover; transition: transform var(--t) var(--ease)" class="pc-screenshot-img">
          </div>
        ` : ''}
        <div class="pc-head">
          <span class="pc-emoji">${emoji}</span>
          <span class="pc-status ${stCls}">${proj.status}</span>
        </div>
        <div class="pc-body">
          <div class="pc-plat">${platforms}</div>
          <h3 class="pc-title">${proj.title}</h3>
          <p class="pc-sub">${proj.subtitle || ''}</p>
          <div class="pc-tags">${tagHtml}</div>
          <p class="pc-desc">${proj.description}</p>
          ${hasMeta ? `<div class="pc-metrics">
            ${proj.downloads !== '—' ? `<span class="pc-m"><i data-lucide="download" style="width:12px;height:12px"></i>${proj.downloads}</span>` : ''}
            ${proj.rating   !== '—' ? `<span class="pc-m"><i data-lucide="star" style="width:12px;height:12px;color:#fbbf24"></i>${proj.rating}</span>` : ''}
          </div>` : ''}
          <div class="pc-foot">
            ${proj.githubUrl   ? `<a href="${proj.githubUrl}" target="_blank" class="pc-link" onclick="event.stopPropagation()"><i data-lucide="github"></i>Code</a>` : ''}
            ${proj.playStoreUrl ? `<a href="${proj.playStoreUrl}" target="_blank" class="pc-link" onclick="event.stopPropagation()"><i data-lucide="play"></i>Store</a>` : ''}
            <button class="pc-more">Details →</button>
          </div>
        </div>
      </div>`);
  });

  // Attach click listeners
  qs('#projGrid').querySelectorAll('.proj-card').forEach(card => {
    card.addEventListener('click', () => openModal(+card.dataset.id));
    card.querySelector('.pc-more')?.addEventListener('click', e => {
      e.stopPropagation();
      openModal(+card.dataset.id);
    });
  });

  lucide.createIcons();

  // Animate cards in
  requestAnimationFrame(() => {
    qAll('.proj-card').forEach((c, i) =>
      setTimeout(() => c.classList.add('animated'), i * 55));
  });
}

/* ───────────────────────────────────────────────
   MODAL
─────────────────────────────────────────────── */
function openModal(id) {
  const proj = (DATA.projects || []).find(x => x.id === id);
  if (!proj) return;
  const emoji    = proj.emoji || EMOJI_MAP[proj.category] || '📱';
  const color    = proj.color || '#6366f1';
  const platHtml = (proj.platform || []).map(pl => `<span class="m-plat-tag">${pl}</span>`).join('');
  const tagHtml  = (proj.tags || []).map(t => `<span class="m-tag">${t}</span>`).join('');
  const imgs     = proj.images || [];

  const hasImages = imgs.length > 0;

  qs('#modalBody').innerHTML = `
    <div class="m-accent" style="background:linear-gradient(90deg,${color},${color}55)"></div>
    <div class="m-top">
      <div class="m-emoji">${emoji}</div>
      <div>
        <h2 class="m-title">${proj.title}</h2>
        <p class="m-sub">${proj.subtitle || ''}</p>
      </div>
    </div>
    
    <div class="m-content-layout ${hasImages ? 'has-images' : 'no-images'}">
      ${hasImages ? `
        <!-- Visuals & Stats -->
        <div class="m-content-visual">
          <div class="m-slider" style="position: relative; margin: 0 0 20px 0; border-radius: var(--r); overflow: hidden; border: 1px solid var(--border); box-shadow: var(--sh)">
            <div class="m-slides" style="display: flex; transition: transform 0.4s var(--ease); width: ${imgs.length * 100}%">
              ${imgs.map(img => `
                <div class="m-slide" style="width: ${100 / imgs.length}%; height: auto;">
                  <img src="${img}" alt="${proj.title} Screenshot" style="width: 100%; height: auto; display: block;">
                </div>
              `).join('')}
            </div>
            ${imgs.length > 1 ? `
              <button class="m-slider-btn prev" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: rgba(11,13,26,0.8); color: var(--ink); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: none; transition: var(--t); z-index: 5">❮</button>
              <button class="m-slider-btn next" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 34px; height: 34px; border-radius: 50%; border: 1px solid var(--border); background: rgba(11,13,26,0.8); color: var(--ink); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: none; transition: var(--t); z-index: 5">❯</button>
              <div class="m-slider-dots" style="position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%); display: flex; gap: 6px; z-index: 5">
                ${imgs.map((_, idx) => `
                  <span class="m-slider-dot ${idx === 0 ? 'active' : ''}" data-idx="${idx}" style="width: 7px; height: 7px; border-radius: 50%; background: ${idx === 0 ? 'var(--p-l)' : 'rgba(255,255,255,0.3)'}; transition: var(--t); cursor: none"></span>
                `).join('')}
              </div>
            ` : ''}
          </div>
          
          <div class="m-stats">
            <span class="m-stat"><i data-lucide="download"></i>${proj.downloads}</span>
            <span class="m-stat"><i data-lucide="star" style="color:#fbbf24"></i>${proj.rating}</span>
            <span class="m-stat"><i data-lucide="info"></i>${proj.status}</span>
            <span class="m-stat"><i data-lucide="layers"></i>${proj.category}</span>
          </div>
        </div>
      ` : ''}
      
      <!-- Text & Links -->
      <div class="m-content-text">
        <div class="m-plat">${platHtml}</div>
        <div class="m-tags">${tagHtml}</div>
        
        ${!hasImages ? `
          <div class="m-stats" style="margin-bottom: 20px;">
            <span class="m-stat"><i data-lucide="download"></i>${proj.downloads}</span>
            <span class="m-stat"><i data-lucide="star" style="color:#fbbf24"></i>${proj.rating}</span>
            <span class="m-stat"><i data-lucide="info"></i>${proj.status}</span>
            <span class="m-stat"><i data-lucide="layers"></i>${proj.category}</span>
          </div>
        ` : ''}
        
        <p class="m-desc">${proj.longDescription || proj.description}</p>
        
        ${proj.tasks && proj.tasks.length ? `
          <div class="m-tasks-section" style="margin: 20px 0; padding: 16px; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: var(--r)">
            <h4 style="font-size: 13px; font-weight: 700; color: var(--p-l); margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px">Apa yang dikerjakan pada project ini:</h4>
            <ul style="list-style-type: none; padding-left: 0; display: flex; flex-direction: column; gap: 10px">
              ${proj.tasks.map(task => `
                <li style="font-size: 13px; color: var(--muted); display: flex; align-items: flex-start; gap: 8px; line-height: 1.5">
                  <span style="color: var(--p-l); margin-top: 2px">•</span>
                  <span>${task}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
        
        <div class="m-links">
          ${proj.playStoreUrl ? `<a href="${proj.playStoreUrl}" target="_blank" class="btn btn-p btn-sm"><i data-lucide="play"></i>Play Store</a>` : ''}
          ${proj.appStoreUrl  ? `<a href="${proj.appStoreUrl}"  target="_blank" class="btn btn-p btn-sm"><i data-lucide="apple"></i>App Store</a>` : ''}
          ${proj.githubUrl    ? `<a href="${proj.githubUrl}"    target="_blank" class="btn btn-o btn-sm"><i data-lucide="github"></i>Source Code</a>` : ''}
        </div>
      </div>
    </div>`;

  // Bind slider controls if multiple images exist
  if (imgs.length > 1) {
    const slides = qs('.m-slides');
    const dots = qAll('.m-slider-dot');
    let current = 0;

    const updateSlider = (idx) => {
      current = (idx + imgs.length) % imgs.length;
      slides.style.transform = `translateX(-${current * (100 / imgs.length)}%)`;
      dots.forEach((dot, dIdx) => {
        dot.classList.toggle('active', dIdx === current);
        dot.style.background = dIdx === current ? 'var(--p-l)' : 'rgba(255,255,255,0.3)';
        dot.style.transform = dIdx === current ? 'scale(1.2)' : 'none';
      });
    };

    qs('.m-slider-btn.prev')?.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlider(current - 1);
    });

    qs('.m-slider-btn.next')?.addEventListener('click', (e) => {
      e.stopPropagation();
      updateSlider(current + 1);
    });

    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        updateSlider(parseInt(dot.dataset.idx));
      });
    });
  }

  lucide.createIcons();
  qs('#modalBg').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  qs('#modalBg').classList.remove('open');
  document.body.style.overflow = '';
}

/* ───────────────────────────────────────────────
   EXPERIENCE / TIMELINE
─────────────────────────────────────────────── */
let _scrollObs = null;

function buildExperience() {
  renderTimeline('work');
}

function renderTimeline(type) {
  const items  = (DATA.experience || []).filter(e => e.type === type);
  const tlEl   = qs('#timeline');
  tlEl.innerHTML = '';

  if (!items.length) {
    tlEl.innerHTML = '<p style="text-align:center;color:var(--dim);padding:40px">No entries.</p>';
    return;
  }

  items.forEach((it, i) => {
    const techHtml = (it.tech || []).map(t => `<span class="tl-tech">${t}</span>`).join('');
    tlEl.insertAdjacentHTML('beforeend',
      `<div class="tl-item" style="transition-delay:${i * 0.1}s">
        <div class="tl-dot-col"><div class="tl-dot"></div></div>
        <div class="tl-card glass">
          <span class="tl-period">${it.period}</span>
          <div class="tl-title">${it.title}</div>
          <div class="tl-company">${it.company}</div>
          <div class="tl-loc"><i data-lucide="map-pin"></i>${it.location}</div>
          <p class="tl-desc">${it.description}</p>
          ${techHtml ? `<div class="tl-techs">${techHtml}</div>` : ''}
        </div>
      </div>`);
  });

  lucide.createIcons();

  // Re-observe new timeline items for scroll animation
  if (_scrollObs) {
    qAll('.tl-item').forEach(el => _scrollObs.observe(el));
  }
}

/* ───────────────────────────────────────────────
   CONTACT
─────────────────────────────────────────────── */
function buildContact() {
  const c = DATA.contact || {};
  const s = DATA.social   || [];

  const contactItems = [
    c.email    && `<a href="mailto:${c.email}" class="c-item"><div class="c-ico"><i data-lucide="mail"></i></div><div><div class="c-lbl">Email</div><div class="c-val">${c.email}</div></div></a>`,
    c.phone    && `<a href="tel:${c.phone}" class="c-item"><div class="c-ico"><i data-lucide="phone"></i></div><div><div class="c-lbl">Phone</div><div class="c-val">${c.phone}</div></div></a>`,
    c.whatsapp && `<a href="${c.whatsapp}" target="_blank" class="c-item"><div class="c-ico"><i data-lucide="message-circle"></i></div><div><div class="c-lbl">WhatsApp</div><div class="c-val">Chat Now</div></div></a>`,
    c.location && `<div class="c-item"><div class="c-ico"><i data-lucide="map-pin"></i></div><div><div class="c-lbl">Location</div><div class="c-val">${c.location}</div></div></div>`,
  ].filter(Boolean).join('');

  qs('#contactLeft').innerHTML = `
    <div class="glass c-blurb">
      <h3>Let's build something great!</h3>
      <p>Ada proyek Flutter menarik atau butuh developer cross-platform berpengalaman? Saya siap berdiskusi.</p>
    </div>
    <div class="c-items">${contactItems}</div>
    <div class="glass c-soc-row">
      <p class="c-soc-title">Find me on</p>
      <div class="c-soc-links" id="cSocLinks"></div>
    </div>`;

  renderSocials('cSocLinks', s, 'c-soc-link', true);
  lucide.createIcons();

  qs('#cForm').addEventListener('submit', e => {
    e.preventDefault();
    const name  = (qs('#cName')?.value    || '').trim();
    const email = (qs('#cEmail')?.value   || '').trim();
    const subj  = (qs('#cSubject')?.value || 'Portfolio Contact').trim();
    const msg   = (qs('#cMsg')?.value     || '').trim();
    const to    = c.email || '';
    window.location.href =
      `mailto:${to}?subject=${encodeURIComponent(subj + ' — from ' + name)}`
      + `&body=${encodeURIComponent(`Hi ${DATA.profile.name.split(' ')[0]},\n\n${msg}\n\nBest,\n${name}\n${email}`)}`;
    showToast('Email client opened! ✓');
    e.target.reset();
  });
}

/* ───────────────────────────────────────────────
   FOOTER
─────────────────────────────────────────────── */
function buildFooter() {
  setText('footName', DATA.profile.name.split(' ')[0]);
  setText('footCopy', `© ${new Date().getFullYear()} ${DATA.profile.name} · All rights reserved`);
  renderSocials('footSocs', DATA.social || [], 'fs-link');
}
/* ───────────────────────────────────────────────
   SETUP ALL BEHAVIORS
─────────────────────────────────────────────── */
function setupAll() {
  setupCursor();
  setupNavScroll();
  setupScrollObs();
  setupBurger();
  setupModal();
  setupTimelineTabs();
}

/* ── Cursor ───────────────────────────────────── */
function setupCursor() {
  const dot  = qs('#cur');
  const ring = qs('#curRing');
  if (!dot || !ring) return;
  let mx=0, my=0, rx=0, ry=0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function rafLoop() {
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(rafLoop);
  })();

  const hover = 'a,button,.proj-card,.glass,.sc,.tl-card,.stab,.filt,.tl-btn';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hover)) { dot.classList.add('hov'); ring.classList.add('hov'); }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hover)) { dot.classList.remove('hov'); ring.classList.remove('hov'); }
  });
}

/* ── Nav highlight on scroll ──────────────────── */
function setupNavScroll() {
  const nav      = qs('#navbar');
  const sections = qAll('section[id]');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    nav.classList.toggle('solid', y > 30);
    sections.forEach(sec => {
      const top = sec.offsetTop - 90;
      const bot = top + sec.offsetHeight;
      if (y >= top && y < bot) {
        qAll('.nl').forEach(l => l.classList.toggle('active', l.dataset.s === sec.id));
      }
    });
  }, { passive: true });
}

/* ── Intersection observer (scroll animations) ── */
function setupScrollObs() {
  _scrollObs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      const el = en.target;

      if (en.isIntersecting) {
        // Generic animated elements
        if (el.classList.contains('sa'))       el.classList.add('animated');
        if (el.classList.contains('sa'))       el.style.visibility = 'visible';
        if (el.classList.contains('sa'))       el.style.opacity = '1';
        if (el.classList.contains('tl-item'))  el.classList.add('animated');

        // Stagger grid children
        if (el.classList.contains('stagger')) {
          el.classList.add('animated');
          el.querySelectorAll(':scope > *').forEach((child, i) =>
            setTimeout(() => {
              if (el.classList.contains('animated')) child.classList.add('animated');
            }, i * 65));
        }

        // Skill bars
        const skillPanel = el.closest('.skill-panel.on');
        if (skillPanel) animBars(skillPanel);
      } else {
        // Scroll up / out: reverse animation
        if (el.classList.contains('sa'))       el.classList.remove('animated');
        if (el.classList.contains('sa'))       el.style.visibility = '';
        if (el.classList.contains('sa'))       el.style.opacity = '';
        if (el.classList.contains('tl-item'))  el.classList.remove('animated');

        if (el.classList.contains('stagger')) {
          el.classList.remove('animated');
          el.querySelectorAll(':scope > *').forEach(child => child.classList.remove('animated'));
        }

        // Reset skill bars
        const skillPanel = el.closest('.skill-panel.on');
        if (skillPanel) {
          skillPanel.querySelectorAll('.sk-fill').forEach(f => { f.style.width = '0%'; });
        }
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

  qAll('.sa, .stagger, .tl-item').forEach(el => _scrollObs.observe(el));

  // Hero elements: animate after loader hides
  setTimeout(() => {
    qAll('#hero .sa').forEach(el => el.classList.add('animated'));
  }, 900);
}

/* ── Burger / mobile nav ──────────────────────── */
function setupBurger() {
  const btn = qs('#burger');
  const nav = qs('#mobileNav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    nav.classList.toggle('open');
  });
  qAll('.mn-link').forEach(l => l.addEventListener('click', () => {
    btn.classList.remove('open');
    nav.classList.remove('open');
  }));
}

/* ── Modal ────────────────────────────────────── */
function setupModal() {
  qs('#modalClose')?.addEventListener('click', closeModal);
  qs('#modalBg')?.addEventListener('click', e => {
    if (e.target === qs('#modalBg')) closeModal();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

/* ── Timeline tabs ────────────────────────────── */
function setupTimelineTabs() {
  qs('#tlTabs')?.addEventListener('click', e => {
    const btn = e.target.closest('.tl-btn');
    if (!btn) return;
    qAll('.tl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTimeline(btn.dataset.type);
  });
}

/* ───────────────────────────────────────────────
   TYPING ANIMATION
─────────────────────────────────────────────── */
function typingLoop(texts, elId) {
  if (!texts.length) return;
  const el = qs('#' + elId);
  if (!el) return;
  let tIdx = 0, cIdx = 0, deleting = false;
  const SPEED_TYPE = 70, SPEED_DEL = 35, PAUSE = 2000;

  function tick() {
    const word = texts[tIdx];
    if (!deleting) {
      el.textContent = word.slice(0, ++cIdx);
      if (cIdx === word.length) { deleting = true; return setTimeout(tick, PAUSE); }
    } else {
      el.textContent = word.slice(0, --cIdx);
      if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % texts.length; return setTimeout(tick, 280); }
    }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 1100);
}

/* ───────────────────────────────────────────────
   SOCIALS RENDERER
─────────────────────────────────────────────── */
const ICON_MAP = {
  github:'github', linkedin:'linkedin', twitter:'twitter',
  instagram:'instagram', youtube:'youtube', facebook:'facebook',
  email:'mail', website:'globe', discord:'message-square',
  telegram:'send', play:'play-circle', playstore:'play-circle',
};

function renderSocials(containerId, socials, cls, withLabel = false) {
  const el = qs('#' + containerId);
  if (!el) return;
  el.innerHTML = socials.map(s => {
    const key = (s.icon || s.platform || '').toLowerCase().replace(/\s/g, '');
    const ico = ICON_MAP[key] || 'link';
    return `<a href="${s.url}" target="_blank" rel="noopener noreferrer" class="${cls}" title="${s.platform}">
      <i data-lucide="${ico}"></i>${withLabel ? `<span>${s.platform}</span>` : ''}
    </a>`;
  }).join('');
}

/* ───────────────────────────────────────────────
   TOAST
─────────────────────────────────────────────── */
function showToast(msg = 'Done!') {
  const el  = qs('#toast');
  const txt = qs('#toastTxt');
  if (!el || !txt) return;
  txt.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 3200);
}

/* ───────────────────────────────────────────────
   UTILS
─────────────────────────────────────────────── */
function qs(sel)    { return document.querySelector(sel); }
function qAll(sel)  { return document.querySelectorAll(sel); }
function setText(id, text) {
  const el = qs('#' + id);
  if (el) el.textContent = text;
}
