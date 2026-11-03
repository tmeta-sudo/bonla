/* ============================================================
   បន្លា · BONLA — app (no dependencies)
   Screens: home page + sheets (product, basket, orders, more)
   ============================================================ */
(() => {
  'use strict';
  const D = window.BONLA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const phone = matchMedia('(max-width: 760px)');
  const root = document.documentElement;

  /* ---------- storage (best effort) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('bonla:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('bonla:' + k, JSON.stringify(v)); } catch { /* ignore */ } }
  };

  const byId = Object.fromEntries(D.products.map(p => [p.id, p]));
  const state = {
    lang: store.get('lang', 'km') === 'en' ? 'en' : 'km',
    cart: store.get('cart', {}),
    orders: store.get('orders', []),
    filter: 'all',
    zone: store.get('zone', 'pp'),
    when: store.get('when', 'asap'),
    loc: null,
    product: null, pQty: 1,
    orderView: null
  };
  Object.keys(state.cart).forEach(id => { if (!byId[id] || !(state.cart[id] > 0)) delete state.cart[id]; });

  /* ---------- i18n + formatting ---------- */
  const KM_DIGITS = '០១២៣៤៥៦៧៨៩';
  const kmNum = s => String(s).replace(/\d/g, d => KM_DIGITS[d]);
  const num = s => state.lang === 'km' ? kmNum(s) : String(s);
  const t = (k, vars) => { let s = D.ui[state.lang][k] ?? k; if (vars) for (const v in vars) s = s.replace('{' + v + '}', vars[v]); return s; };
  const L = o => (o && (o[state.lang] ?? o.km)) || '';
  const riel = n => num(Math.round(n).toLocaleString('en-US')) + '៛';
  const usd = n => '≈ $' + (n / D.config.usdRate).toFixed(2);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = ts => {
    const d = new Date(ts);
    const date = `${d.getDate()} ${D.months[state.lang][d.getMonth()]} ${d.getFullYear()}`;
    const time = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    return { date: num(date), time: num(time) };
  };

  const km = { text: {}, aria: {}, alt: {}, ph: {} };
  $$('[data-i18n]').forEach(el => { km.text[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-aria]').forEach(el => { km.aria[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
  $$('[data-i18n-alt]').forEach(el => { km.alt[el.dataset.i18nAlt] = el.getAttribute('alt'); });
  $$('[data-i18n-ph]').forEach(el => { km.ph[el.dataset.i18nPh] = el.getAttribute('placeholder'); });

  /* ---------- order channels (hidden until configured) ---------- */
  const tg = String(D.config.telegram || '').trim().replace(/^@/, '');
  const ph = String(D.config.phone || '').trim();
  const channel = tg ? 'telegram' : ph ? 'sms' : null;
  const channelName = () => channel === 'telegram' ? 'Telegram' : channel === 'sms' ? t('sms') : '';

  function applyLang() {
    const lang = state.lang, en = lang === 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; el.innerHTML = en ? (D.en[k] ?? km.text[k]) : km.text[k]; });
    $$('[data-i18n-aria]').forEach(el => { const k = el.dataset.i18nAria; el.setAttribute('aria-label', en ? (D.en[k] ?? km.aria[k]) : km.aria[k]); });
    $$('[data-i18n-alt]').forEach(el => { const k = el.dataset.i18nAlt; el.setAttribute('alt', en ? (D.en[k] ?? km.alt[k]) : km.alt[k]); });
    $$('[data-i18n-ph]').forEach(el => { const k = el.dataset.i18nPh; el.setAttribute('placeholder', en ? (D.en[k] ?? km.ph[k]) : km.ph[k]); });
    $('#langLabel').textContent = en ? 'ខ្មែរ' : 'EN';
    $('#langBtn').setAttribute('lang', en ? 'km' : 'en');
    $('#langBtn').setAttribute('aria-label', en ? 'ប្តូរទៅភាសាខ្មែរ' : 'Switch to English');
    $('#moreLangV').textContent = en ? 'English' : 'ខ្មែរ';
    $$('.step__n').forEach((el, i) => { el.textContent = num(i + 1); });
    $('#heroFrom').textContent = riel(Math.min(...D.products.filter(p => p.unit === 'kg').map(p => p.price)));
    buildDial();
    renderGrid();
    renderFinder();
    renderSeason();
    renderOrderInfo();
    renderCredits();
    renderCart();
    renderLoc();
    if (state.product) renderProduct();
    renderOrders();
    paintTheme();
  }

  /* ---------- images ---------- */
  const photo = (p, sizes, eager) =>
    `<img src="assets/photos/${p.photo}-480.webp" srcset="assets/photos/${p.photo}-480.webp 480w, assets/photos/${p.photo}-900.webp ${p.ratio[0]}w" sizes="${sizes}" width="${p.ratio[0]}" height="${p.ratio[1]}" alt="${esc(L(p.name))}" ${eager ? '' : 'loading="lazy" '}decoding="async">`;

  /* ---------- season helpers ---------- */
  const month = new Date().getMonth();
  const inSeason = () => D.season[month] > 0;
  const stockOf = p => !p.seasonal ? { cls: 'is-ok', label: t('frozenOk') } : inSeason() ? { cls: 'is-ok', label: t('inStock') } : { cls: 'is-pre', label: t('preorder') };

  /* ---------- hero dial + motion ---------- */
  const f = n => n.toFixed(1);
  function buildDial() {
    let g = '<circle r="292" fill="none" stroke="rgba(245,238,219,.25)" stroke-width="1"/>';
    for (let i = 0; i < 120; i++) {
      const a = i / 120 * Math.PI * 2, major = i % 10 === 0;
      const r1 = major ? 258 : 272, r2 = 284;
      g += `<line x1="${f(Math.sin(a) * r1)}" y1="${f(-Math.cos(a) * r1)}" x2="${f(Math.sin(a) * r2)}" y2="${f(-Math.cos(a) * r2)}" stroke="rgba(245,238,219,${major ? .75 : .3})" stroke-width="${major ? 3 : 1.4}" stroke-linecap="round"/>`;
    }
    for (let h = 1; h <= 12; h++) {
      const a = h / 12 * Math.PI * 2;
      g += `<text x="${f(Math.sin(a) * 228)}" y="${f(-Math.cos(a) * 228)}" fill="#FFE291" font-size="24" font-weight="600" text-anchor="middle" dominant-baseline="central">${num(h)}</text>`;
    }
    $('#dial').innerHTML = g;
  }
  const stage = $('#heroStage'), hero = $('.hero'), nav = $('#nav');
  let ticking = false, lastY = scrollY;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle('is-scrolled', y > 30);
      if (phone.matches && Math.abs(y - lastY) > 6) { nav.classList.toggle('is-hidden', y > lastY && y > 160); lastY = y; }
      else if (!phone.matches) nav.classList.remove('is-hidden');
      if (!reduced && y < hero.offsetHeight * 1.2) hero.style.setProperty('--p', Math.min(1, y / hero.offsetHeight).toFixed(4));
      ticking = false;
    });
  }
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (!reduced && matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let raf = 0;
    hero.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = hero.getBoundingClientRect();
        stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 2 - 1).toFixed(3));
        stage.style.setProperty('--my', ((e.clientY - r.top) / r.height * 2 - 1).toFixed(3));
      });
    });
    hero.addEventListener('pointerleave', () => { stage.style.setProperty('--mx', 0); stage.style.setProperty('--my', 0); });
  }

  /* ---------- product grid ---------- */
  const segs = n => [1, 2, 3, 4, 5].map(i => `<span class="seg${i <= n ? ' on' : ''}"></span>`).join('');
  const meters = p => `<dt>${t('sweet')}</dt><dd class="sweet">${segs(p.sweet)}</dd><dt>${t('aroma')}</dt><dd class="aroma">${segs(p.aroma)}</dd><dt>${t('texture')}</dt><dd class="texture">${segs(p.texture)}</dd>`;
  const plusIc = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const addBtn = p => `<button type="button" class="add" data-add="${p.id}" aria-label="${esc(t('add') + ' ' + L(p.name))}">${plusIc}<span>${t('add')}</span></button>`;
  function renderGrid() {
    const list = D.products.filter(p => state.filter === 'all' || p.kind === state.filter);
    const alt = state.lang === 'km' ? 'en' : 'km';
    $('#productGrid').innerHTML = list.map((p, i) => {
      const st = stockOf(p);
      return `
      <article class="card" style="--i:${i}">
        <button type="button" class="card__art" data-open="${p.id}" aria-label="${esc(t('view') + ' · ' + L(p.name))}">
          ${photo(p, '(max-width: 700px) 46vw, 380px')}
          <span class="card__origin">${esc(L(p.origin))}</span>
          ${p.badge ? `<span class="badge">${esc(L(p.badge))}</span>` : ''}
        </button>
        <div class="card__body">
          <div class="card__title"><h3><button type="button" class="card__name" data-open="${p.id}">${esc(L(p.name))}</button></h3><span class="card__alt" lang="${alt}">${esc(p.name[alt])}</span></div>
          <p class="stock stock--sm ${st.cls}">${st.label}</p>
          <p class="card__desc">${esc(L(p.desc))}</p>
          <ul class="tags">${p.tags.map(k => `<li>${esc(L(D.tags[k]))}</li>`).join('')}</ul>
          <dl class="meters">${meters(p)}</dl>
          <div class="card__foot">
            <p class="price"><strong>${riel(p.price)}</strong><span>${t('per' + p.unit)}<span class="price__usd"> · ${usd(p.price)}</span></span></p>
            ${addBtn(p)}
          </div>
        </div>
      </article>`;
    }).join('');
  }
  $$('.filter').forEach(b => b.addEventListener('click', () => {
    state.filter = b.dataset.filter;
    $$('.filter').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    document.startViewTransition && !reduced ? document.startViewTransition(renderGrid) : renderGrid();
  }));

  /* ---------- flavor finder ---------- */
  const fIn = { sweet: $('#fSweet'), aroma: $('#fAroma'), texture: $('#fTexture') };
  const paintRange = el => el.style.setProperty('--fill', ((el.value - el.min) / (el.max - el.min) * 100) + '%');
  function renderFinder() {
    const want = { sweet: +fIn.sweet.value, aroma: +fIn.aroma.value, texture: +fIn.texture.value };
    const MAX = Math.sqrt(48);
    const scored = D.products.filter(p => p.kind === 'fruit').map(p => {
      const d = Math.hypot(p.sweet - want.sweet, p.aroma - want.aroma, p.texture - want.texture);
      return { p, pct: Math.round(100 * (1 - d / MAX)) };
    }).sort((a, b) => b.pct - a.pct);
    const best = scored[0], el = $('#finderResult');
    if (el.dataset.best === best.p.id && el.dataset.lang === state.lang) {
      $('.match__pct', el).textContent = num(best.pct) + '%';
    } else {
      el.innerHTML = `
        <div class="match">
          <button type="button" class="match__art" data-open="${best.p.id}" aria-label="${esc(t('view') + ' · ' + L(best.p.name))}">${photo(best.p, '(max-width: 560px) 80vw, 260px')}</button>
          <div class="match__info">
            <span class="match__label">${t('best')}</span>
            <div class="match__pct">${num(best.pct)}%</div>
            <h3>${esc(L(best.p.name))}</h3>
            <p>${esc(L(best.p.desc))}</p>
            ${addBtn(best.p)}
          </div>
        </div>
        <p class="rank__title">${t('also')}</p>
        <ul class="rank"></ul>`;
    }
    $('.rank', el).innerHTML = scored.slice(1).map(s => `<li><span>${esc(L(s.p.name))}</span><span class="rank__bar"><i style="width:${s.pct}%"></i></span><span class="rank__pct">${num(s.pct)}%</span></li>`).join('');
    el.dataset.best = best.p.id; el.dataset.lang = state.lang;
  }
  Object.values(fIn).forEach(el => { paintRange(el); el.addEventListener('input', () => { paintRange(el); renderFinder(); }); });

  /* ---------- season ---------- */
  function renderSeason() {
    $('#months').innerHTML = D.season.map((s, i) => `
      <li class="month${i === month ? ' is-now' : ''}" data-s="${s}">
        ${i === month ? `<span class="month__now">${t('now')}</span>` : ''}
        <span><span class="month__km" lang="km">${D.months.km[i]}</span><br><span class="month__en">${D.months.en[i]}</span></span>
        <span class="month__bar" aria-hidden="true"><i style="height:${[18, 55, 100][s]}%"></i></span>
      </li>`).join('');
    const s = D.season[month];
    const head = s === 2 ? t('inSeason') : s === 1 ? t('edgeSeason') : t('offSeason');
    $('#seasonNow').innerHTML = `<strong>${head}</strong><span>${t('monthPrefix')}${D.months[state.lang][month]} · ${s ? t('inSub') : t('offSub')}</span>`;
  }

  /* ---------- delivery info, contact, credits ---------- */
  function contactItems() {
    const out = [];
    if (tg) out.push(`<li>Telegram: <a href="https://t.me/${encodeURIComponent(tg)}" target="_blank" rel="noopener">@${esc(tg)}</a></li>`);
    if (ph) out.push(`<li>${t('phone')}: <a class="copyable" href="tel:${esc(ph.replace(/\s/g, ''))}">${esc(ph)}</a></li>`);
    return out.join('');
  }
  function renderOrderInfo() {
    $('#zones').innerHTML = D.zones.map(z => `<li><strong>${esc(L(z.name))}</strong><span class="fee">${z.fee ? riel(z.fee) : t('free')}</span><span class="eta">${esc(L(z.eta))}</span></li>`).join('');
    const c = contactItems();
    $('#contactBlock').hidden = !c;
    $('#contact').innerHTML = c;
    $('#moreContact').innerHTML = c ? `<h3 class="menu__h">${t('contact')}</h3><ul class="plain plain--menu">${c}</ul>` : '';
    const tgBtn = $('#tgBtn');
    tgBtn.hidden = !tg;
    if (tg) tgBtn.href = 'https://t.me/' + encodeURIComponent(tg);
    $('#zone').innerHTML = D.zones.map(z => `<option value="${z.id}"${z.id === state.zone ? ' selected' : ''}>${esc(L(z.name))} · ${z.fee ? riel(z.fee) : t('free')}</option>`).join('');
    $('#cWhen').innerHTML = D.when.map(w => `<option value="${w.id}"${w.id === state.when ? ' selected' : ''}>${esc(L(w))}</option>`).join('');
  }
  function renderCredits() {
    $('#credits').innerHTML = D.credits.map(c => `<li>${esc(c.use)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.artist)}</a> · ${esc(c.license)}</li>`).join('');
  }

  /* ============================================================
     Sheets (dialogs): product, cart, orders, more
     ============================================================ */
  const sheets = { product: $('#productSheet'), cart: $('#cart'), orders: $('#ordersSheet'), more: $('#moreSheet') };
  // Phones: sheets are app screens under the tab bar (non-modal, page scroll locked).
  // Larger screens: modal side panel with backdrop.
  let lastFocus = null;
  const anyOpen = () => Object.values(sheets).some(d => d.open);
  function syncRoot() {
    root.classList.toggle('sheet-open', anyOpen());
    root.classList.toggle('product-open', sheets.product.open);
  }
  function openSheet(name) {
    const dlg = sheets[name];
    if (!anyOpen()) lastFocus = document.activeElement;
    Object.entries(sheets).forEach(([n, d]) => { if (n !== name && d.open) { d.close(); d.classList.remove('is-closing'); } });
    if (!dlg.open) {
      dlg.classList.remove('is-closing');
      if (phone.matches) { dlg.show(); const f = $('[data-close], button', dlg); if (f) f.focus({ preventScroll: true }); }
      else dlg.showModal();
    }
    const scroller = $('.sheet__scroll, .sheet__body', dlg); if (scroller) scroller.scrollTop = 0;
    setTab(name === 'product' ? 'home' : name);
    syncRoot();
  }
  function closeSheet(dlg) {
    if (!dlg.open) return;
    const done = () => {
      dlg.close(); dlg.classList.remove('is-closing'); syncRoot();
      if (!anyOpen()) { setTab('home'); if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true }); }
    };
    if (reduced) return done();
    dlg.classList.add('is-closing');
    setTimeout(done, 260);
  }
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    const open = Object.values(sheets).find(d => d.open && !d.matches(':modal'));
    if (open) closeSheet(open);
  });
  Object.values(sheets).forEach(dlg => {
    dlg.addEventListener('cancel', e => { e.preventDefault(); closeSheet(dlg); });
    dlg.addEventListener('click', e => {
      if (e.target === dlg) return closeSheet(dlg);
      const c = e.target.closest('[data-close]');
      if (c) closeSheet(dlg);
    });
  });
  const setTab = name => $$('.tab').forEach(b => b.classList.toggle('is-active', b.dataset.tab === name));

  /* ---------- product sheet ---------- */
  const unitLabel = p => t('unit' + p.unit);
  function renderProduct() {
    const p = byId[state.product]; if (!p) return;
    const alt = state.lang === 'km' ? 'en' : 'km';
    const img = $('#pImg');
    img.src = `assets/photos/${p.photo}-900.webp`;
    img.srcset = `assets/photos/${p.photo}-480.webp 480w, assets/photos/${p.photo}-900.webp ${p.ratio[0]}w`;
    img.sizes = '(max-width: 560px) 100vw, 520px';
    img.width = p.ratio[0]; img.height = p.ratio[1];
    img.alt = L(p.name);
    const b = $('#pBadge'); b.hidden = !p.badge; b.textContent = p.badge ? L(p.badge) : '';
    $('#pTitle').textContent = L(p.name);
    $('#pAlt').textContent = `${p.name[alt]} · ${L(p.origin)}`;
    const st = stockOf(p); const s = $('#pStock'); s.className = 'stock ' + st.cls; s.textContent = st.label;
    $('#pQty').textContent = `${num(state.pQty)} ${unitLabel(p)}`;
    $('#pDesc').textContent = L(p.desc);
    $('#pTags').innerHTML = p.tags.map(k => `<li>${esc(L(D.tags[k]))}</li>`).join('');
    $('#pMeters').innerHTML = meters(p);
    $('#pKeep').textContent = L(p.keep);
    $('#pPrice').textContent = riel(p.price * state.pQty);
    $('#pUnit').textContent = state.pQty > 1 ? `${num(state.pQty)} × ${riel(p.price)}` : t('per' + p.unit);
    $('#pSimilar').innerHTML = D.products.filter(x => x.id !== p.id).sort((a, c) => (c.kind === p.kind) - (a.kind === p.kind)).slice(0, 4).map(x => `
      <button type="button" class="mini" data-open="${x.id}">
        <span class="mini__img">${photo(x, '140px')}</span>
        <span class="mini__name">${esc(L(x.name))}</span>
        <span class="mini__price">${riel(x.price)}</span>
      </button>`).join('');
  }
  function openProduct(id) {
    if (!byId[id]) return;
    const same = state.product === id && sheets.product.open;
    state.product = id; state.pQty = 1;
    renderProduct();
    if (!same) openSheet('product'); else $('.sheet__scroll', sheets.product).scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    if (sheets.product.open) $('.sheet__scroll', sheets.product).scrollTop = 0;
  }
  $('#pInc').addEventListener('click', () => { state.pQty = Math.min(20, state.pQty + 1); renderProduct(); });
  $('#pDec').addEventListener('click', () => { state.pQty = Math.max(1, state.pQty - 1); renderProduct(); });
  $('#pAdd').addEventListener('click', e => {
    addToCart(state.product, state.pQty, e.currentTarget);
    const btn = e.currentTarget, span = $('span', btn);
    btn.classList.add('is-added'); span.textContent = t('pdAdded');
    setTimeout(() => { btn.classList.remove('is-added'); span.innerHTML = state.lang === 'en' ? D.en['pd.add'] : km.text['pd.add']; }, 1400);
  });

  /* ---------- cart ---------- */
  const saveCart = () => store.set('cart', state.cart);
  const cartItems = () => Object.entries(state.cart).filter(([id, q]) => byId[id] && q > 0).map(([id, q]) => ({ p: byId[id], q }));
  const zoneObj = id => D.zones.find(z => z.id === (id || state.zone)) || D.zones[0];
  const whenObj = id => D.when.find(w => w.id === (id || state.when)) || D.when[0];
  function totals(items = cartItems(), zone) {
    const sub = items.reduce((s, { p, q }) => s + p.price * q, 0);
    const del = sub ? zoneObj(zone).fee : 0;
    return { sub, del, total: sub + del };
  }
  const trashIc = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 7h15M9.5 7V4.5h5V7M6.5 7l.8 12.2a1.6 1.6 0 0 0 1.6 1.3h6.2a1.6 1.6 0 0 0 1.6-1.3L17.5 7M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function renderCart() {
    const items = cartItems();
    const count = items.reduce((s, i) => s + i.q, 0);
    $('#cartCount').textContent = num(count);
    $('#tabCount').textContent = num(count);
    $('#tabCount').hidden = count === 0;
    $('#cartLines').innerHTML = items.map(({ p, q }) => `
      <li class="line">
        <button type="button" class="line__art" data-open="${p.id}" aria-label="${esc(t('view') + ' · ' + L(p.name))}">${photo(p, '72px')}</button>
        <div class="line__info">
          <div class="line__name">${esc(L(p.name))}</div>
          <div class="line__unit">${riel(p.price)} ${t('per' + p.unit)}</div>
          <div class="line__total">${riel(p.price * q)}</div>
        </div>
        <div class="line__right">
          <button type="button" class="line__del" data-del="${p.id}" aria-label="${esc(t('remove') + ' ' + L(p.name))}">${trashIc}</button>
          <span class="stepper">
            <button type="button" data-dec="${p.id}" aria-label="${esc(t('dec') + ' ' + L(p.name))}">−</button>
            <output aria-live="polite">${num(q)}</output>
            <button type="button" data-inc="${p.id}" aria-label="${esc(t('inc') + ' ' + L(p.name))}">+</button>
          </span>
        </div>
      </li>`).join('');
    const empty = items.length === 0;
    $('#cartEmpty').hidden = !empty;
    $('#checkout').hidden = empty;
    $('#cartFoot').hidden = empty;
    const { sub, del, total } = totals(items);
    $('#sumSub').textContent = riel(sub);
    $('#sumDel').textContent = del ? riel(del) : t('free');
    $('#sumTotal').textContent = riel(total);
    $('#checkoutBtn span').textContent = channel ? t('sendVia', { ch: channelName() }) : t('sendCopy');
    $('#cartNote').textContent = channel ? (state.lang === 'en' ? D.en['cart.note'] : km.text['cart.note']) : t('noChannel');
  }

  /* ---------- location ---------- */
  function renderLoc() {
    const b = $('#locBtn'), l = $('#locLabel');
    b.classList.toggle('is-on', !!state.loc);
    l.textContent = state.loc ? `${t('locAdded')} · ${num(state.loc.lat.toFixed(4))}, ${num(state.loc.lng.toFixed(4))}` : (state.lang === 'en' ? D.en['cart.loc'] : km.text['cart.loc']);
  }
  $('#locBtn').addEventListener('click', () => {
    if (state.loc) { state.loc = null; renderLoc(); return; }
    if (!navigator.geolocation) { toast(t('locFail')); return; }
    $('#locLabel').textContent = t('locAdding');
    navigator.geolocation.getCurrentPosition(
      pos => { state.loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }; renderLoc(); },
      () => { renderLoc(); toast(t('locFail')); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 }
    );
  });

  /* ---------- order message + checkout ---------- */
  function messageFor(o) {
    const items = o.items.map(i => ({ p: byId[i.id], q: i.q })).filter(i => i.p);
    const lines = [t('msgHello').replace('{shop}', L(D.config.shopName)), `${t('ordNo')}: ${o.id}`, ''];
    items.forEach(({ p, q }) => lines.push(`• ${L(p.name)} × ${num(q)} ${unitLabel(p)} = ${riel(p.price * q)}`));
    const { del, total } = totals(items, o.zone);
    lines.push('', `${t('msgDelivery')}: ${L(zoneObj(o.zone).name)} (${del ? riel(del) : t('free')})`, `${t('msgWhen')}: ${L(whenObj(o.when))}`, `${t('msgTotal')}: ${riel(total)}`, '');
    lines.push(`${t('msgName')}: ${o.name}`, `${t('msgPhone')}: ${o.phone}`);
    if (o.addr) lines.push(`${t('msgAddr')}: ${o.addr}`);
    if (o.loc) lines.push(`${t('msgMap')}: https://maps.google.com/?q=${o.loc.lat.toFixed(6)},${o.loc.lng.toFixed(6)}`);
    return lines.join('\n');
  }
  async function copyText(s) { try { await navigator.clipboard.writeText(s); return true; } catch { return false; } }
  function sendMessage(msg) {
    copyText(msg);
    if (channel === 'telegram') window.open(`https://t.me/${encodeURIComponent(tg)}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
    else if (channel === 'sms') location.href = `sms:${ph.replace(/\s/g, '')}?&body=${encodeURIComponent(msg)}`;
    else toast(t('copied'));
  }
  function validate() {
    const err = $('#formErr');
    const req = [$('#cName'), $('#cPhone')];
    const bad = req.filter(i => !i.value.trim() || (i.id === 'cPhone' && i.value.replace(/\D/g, '').length < 8));
    req.forEach(i => i.classList.toggle('is-bad', bad.includes(i)));
    if (bad.length) { err.textContent = t('needInfo'); err.hidden = false; bad[0].focus(); return false; }
    err.hidden = true; return true;
  }
  const newOrderId = () => {
    const d = new Date();
    return `BL-${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}-${Math.floor(1000 + Math.random() * 9000)}`;
  };
  $('#checkoutBtn').addEventListener('click', () => {
    if (!cartItems().length) { toast(t('emptyCart')); return; }
    if (!validate()) return;
    const order = {
      id: newOrderId(), at: Date.now(), ch: channel,
      items: cartItems().map(({ p, q }) => ({ id: p.id, q })),
      zone: state.zone, when: state.when,
      name: $('#cName').value.trim(), phone: $('#cPhone').value.trim(), addr: $('#cAddr').value.trim(),
      loc: state.loc
    };
    order.total = totals(undefined, order.zone).total;
    sendMessage(messageFor(order));
    state.orders.unshift(order); state.orders = state.orders.slice(0, 30); store.set('orders', state.orders);
    state.cart = {}; saveCart(); state.loc = null;
    renderCart(); renderLoc();
    state.orderView = order.id; renderOrders();
    openSheet('orders');
  });

  const draft = store.get('draft', {});
  ['cName', 'cPhone', 'cAddr'].forEach(id => {
    const el = $('#' + id);
    if (draft[id]) el.value = draft[id];
    el.addEventListener('input', () => { draft[id] = el.value; store.set('draft', draft); el.classList.remove('is-bad'); });
  });
  $('#zone').addEventListener('change', e => { state.zone = e.target.value; store.set('zone', state.zone); renderCart(); });
  $('#cWhen').addEventListener('change', e => { state.when = e.target.value; store.set('when', state.when); });

  /* ---------- orders sheet ---------- */
  const thumbs = o => o.items.slice(0, 3).map(i => byId[i.id] ? `<span class="o-thumb">${photo(byId[i.id], '44px')}</span>` : '').join('');
  const backIc = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const checkIc = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12.5l4 4 8-9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function renderOrders() {
    const v = $('#ordersView');
    const o = state.orders.find(x => x.id === state.orderView);
    $('#ordersTitle').textContent = o ? t('ordDetails') : (state.lang === 'en' ? D.en['orders.title'] : km.text['orders.title']);
    if (!o) {
      if (!state.orders.length) {
        v.innerHTML = `<div class="empty"><img class="empty__img" src="assets/photos/kampot-480.webp" width="480" height="320" alt="" loading="lazy" decoding="async"><p><strong>${t('ordEmpty')}</strong></p><p>${t('ordEmptySub')}</p><a class="btn btn--gold btn--sm" href="#varieties" data-close>${t('ordBrowse')}</a></div>`;
        return;
      }
      v.innerHTML = `<ul class="orders">${state.orders.map(x => {
        const d = fmtDate(x.at);
        const n = x.items.reduce((s, i) => s + i.q, 0);
        return `<li><button type="button" class="ocard" data-order="${x.id}">
          <span class="ocard__thumbs">${thumbs(x)}</span>
          <span class="ocard__info"><strong>${esc(x.id)}</strong><span>${d.date} · ${d.time}</span><span class="ocard__total">${riel(x.total)} · ${t('itemsN', { n: num(n) })}</span></span>
          <span class="pill ${x.ch ? 'pill--ok' : ''}">${x.ch ? t('ordSent') : t('ordSaved')}</span>
        </button></li>`;
      }).join('')}</ul>`;
      return;
    }
    const d = fmtDate(o.at);
    const z = zoneObj(o.zone);
    const steps = [
      { done: true, time: d.time, t: t('step1'), d: t('step1d', { id: o.id }) },
      { done: true, time: d.time, t: t('step2'), d: o.ch ? t('step2d', { ch: o.ch === 'telegram' ? 'Telegram' : t('sms') }) : t('step2copy') },
      { done: false, t: t('step3'), d: t('step3d') },
      { done: false, t: t('step4'), d: t('step4d', { zone: L(z.name), eta: L(z.eta) }) }
    ];
    const items = o.items.map(i => ({ p: byId[i.id], q: i.q })).filter(i => i.p);
    v.innerHTML = `
      <button type="button" class="link-back" data-orders-back>${backIc}<span>${t('ordAll')}</span></button>
      <div class="ohead"><span>${t('ordNo')}</span><strong>${esc(o.id)}</strong><span>${d.date}</span></div>
      <ol class="timeline">${steps.map(s => `
        <li class="${s.done ? 'is-done' : ''}">
          <span class="timeline__time">${s.time || ''}</span>
          <span class="timeline__dot">${s.done ? checkIc : ''}</span>
          <div><strong>${s.t}</strong><p>${s.d}</p></div>
        </li>`).join('')}
      </ol>
      <p class="sheet__note sheet__note--left">${t('stepNote')}</p>
      <ul class="lines lines--compact">${items.map(({ p, q }) => `
        <li class="line"><span class="line__art">${photo(p, '56px')}</span>
          <div class="line__info"><div class="line__name">${esc(L(p.name))}</div><div class="line__unit">${num(q)} ${unitLabel(p)} × ${riel(p.price)}</div></div>
          <div class="line__total">${riel(p.price * q)}</div></li>`).join('')}
      </ul>
      <p class="total-line"><span>${state.lang === 'en' ? D.en['cart.total'] : km.text['cart.total']}</span><strong>${riel(o.total)}</strong></p>
      <div class="obtns">
        <button type="button" class="btn btn--dark btn--block" data-resend="${o.id}">${channel ? t('sendVia', { ch: channelName() }) : t('sendCopy')}</button>
        <button type="button" class="btn btn--line btn--block" data-again="${o.id}">${t('ordAgain')}</button>
      </div>`;
  }
  $('#ordersView').addEventListener('click', e => {
    const card = e.target.closest('[data-order]'); if (card) { state.orderView = card.dataset.order; renderOrders(); $('.sheet__body', sheets.orders).scrollTop = 0; return; }
    if (e.target.closest('[data-orders-back]')) { state.orderView = null; renderOrders(); return; }
    const rs = e.target.closest('[data-resend]'); if (rs) { const o = state.orders.find(x => x.id === rs.dataset.resend); if (o) sendMessage(messageFor(o)); return; }
    const ag = e.target.closest('[data-again]');
    if (ag) {
      const o = state.orders.find(x => x.id === ag.dataset.again); if (!o) return;
      o.items.forEach(i => { if (byId[i.id]) state.cart[i.id] = (state.cart[i.id] || 0) + i.q; });
      saveCart(); renderCart(); openSheet('cart');
    }
  });

  /* ---------- add to cart + global clicks ---------- */
  function addToCart(id, qty = 1, from) {
    state.cart[id] = (state.cart[id] || 0) + qty;
    saveCart(); renderCart();
    const target = phone.matches ? $('#tabCart') : $('#cartOpen');
    target.classList.remove('bump'); void target.offsetWidth; target.classList.add('bump');
    toast(t('addedToast').replace('{n}', L(byId[id].name)));
    if (from && !reduced && !sheets.product.open) fly(from, target);
  }
  function fly(a, b) {
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const dot = document.createElement('span'); dot.className = 'fly';
    document.body.appendChild(dot);
    const x0 = ra.left + ra.width / 2 - 11, y0 = ra.top + ra.height / 2 - 11;
    const x1 = rb.left + rb.width / 2 - 11, y1 = rb.top + rb.height / 2 - 11;
    dot.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1)` },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 120}px) scale(1.3)`, offset: .5 },
      { transform: `translate(${x1}px, ${y1}px) scale(.4)`, opacity: .6 }
    ], { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => dot.remove();
  }
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]');
    if (add) {
      addToCart(add.dataset.add, 1, add);
      add.classList.add('is-added');
      const span = $('span', add); if (span) span.textContent = t('added');
      setTimeout(() => { add.classList.remove('is-added'); if (span) span.textContent = t('add'); }, 1400);
      return;
    }
    const open = e.target.closest('[data-open]'); if (open) { openProduct(open.dataset.open); return; }
    const inc = e.target.closest('[data-inc]'); if (inc) { state.cart[inc.dataset.inc]++; saveCart(); renderCart(); return; }
    const dec = e.target.closest('[data-dec]');
    if (dec) { const id = dec.dataset.dec; state.cart[id]--; if (state.cart[id] <= 0) delete state.cart[id]; saveCart(); renderCart(); return; }
    const del = e.target.closest('[data-del]'); if (del) { delete state.cart[del.dataset.del]; saveCart(); renderCart(); }
  });

  $('#cartOpen').addEventListener('click', () => openSheet('cart'));
  $('#orderOpen').addEventListener('click', () => openSheet('cart'));
  $$('.tab').forEach(b => b.addEventListener('click', e => {
    const tab = b.dataset.tab;
    if (tab === 'home') { Object.values(sheets).forEach(d => d.open && d.close()); syncRoot(); setTab('home'); return; }
    e.preventDefault();
    if (tab === 'orders') { state.orderView = null; renderOrders(); }
    openSheet(tab);
  }));

  /* ---------- toast ---------- */
  let toastT = 0;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('is-on'), 2400);
  }

  /* ---------- theme (system by default, remembered once chosen) ---------- */
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : darkMQ.matches;
  function paintTheme() {
    const dark = isDark();
    $('#themeBtn').setAttribute('aria-label', dark ? t('toLight') : t('toDark'));
    $('#themeBtn').setAttribute('aria-pressed', String(dark));
    $('#themeSwitch').classList.toggle('is-on', dark);
    $('#moreTheme').setAttribute('aria-pressed', String(dark));
  }
  function toggleTheme() {
    const next = isDark() ? 'light' : 'dark';
    const go = () => { root.dataset.theme = next; store.set('theme', next); paintTheme(); };
    document.startViewTransition && !reduced && !Object.values(sheets).some(d => d.open) ? document.startViewTransition(go) : go();
  }
  $('#themeBtn').addEventListener('click', toggleTheme);
  $('#moreTheme').addEventListener('click', toggleTheme);
  darkMQ.addEventListener?.('change', paintTheme);

  /* ---------- language ---------- */
  function toggleLang() {
    state.lang = state.lang === 'km' ? 'en' : 'km'; store.set('lang', state.lang);
    document.startViewTransition && !reduced && !Object.values(sheets).some(d => d.open) ? document.startViewTransition(applyLang) : applyLang();
  }
  $('#langBtn').addEventListener('click', toggleLang);
  $('#moreLang').addEventListener('click', toggleLang);

  /* ---------- active section in desktop header links ---------- */
  const secLinks = $$('.nav__links [data-sec]');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) secLinks.forEach(a => a.classList.toggle('is-active', a.dataset.sec === e.target.id)); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'varieties', 'finder', 'season', 'culture', 'order'].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  applyLang();
})();
