/* ============================================================
   បន្លា · BONLA — app (no dependencies)
   ============================================================ */
(() => {
  'use strict';
  const D = window.BONLA;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- storage (best effort) ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem('bonla:' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem('bonla:' + k, JSON.stringify(v)); } catch { /* ignore */ } }
  };

  const byId = Object.fromEntries(D.products.map(p => [p.id, p]));
  const state = {
    lang: store.get('lang', 'km') === 'en' ? 'en' : 'km',
    cart: store.get('cart', {}),
    filter: 'all',
    zone: store.get('zone', 'pp'),
    when: store.get('when', 'asap')
  };
  Object.keys(state.cart).forEach(id => { if (!byId[id] || !(state.cart[id] > 0)) delete state.cart[id]; });

  /* ---------- i18n ---------- */
  const KM_DIGITS = '០១២៣៤៥៦៧៨៩';
  const kmNum = s => String(s).replace(/\d/g, d => KM_DIGITS[d]);
  const num = s => state.lang === 'km' ? kmNum(s) : String(s);
  const t = k => D.ui[state.lang][k] ?? k;
  const L = o => (o && (o[state.lang] ?? o.km)) || '';
  const riel = n => num(Math.round(n).toLocaleString('en-US')) + '៛';
  const usd = n => '≈ $' + (n / D.config.usdRate).toFixed(2);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const km = { text: {}, aria: {}, alt: {} };
  $$('[data-i18n]').forEach(el => { km.text[el.dataset.i18n] = el.innerHTML; });
  $$('[data-i18n-aria]').forEach(el => { km.aria[el.dataset.i18nAria] = el.getAttribute('aria-label'); });
  $$('[data-i18n-alt]').forEach(el => { km.alt[el.dataset.i18nAlt] = el.getAttribute('alt'); });

  function applyLang() {
    const lang = state.lang, en = lang === 'en';
    document.documentElement.lang = lang;
    $$('[data-i18n]').forEach(el => { const k = el.dataset.i18n; el.innerHTML = en ? (D.en[k] ?? km.text[k]) : km.text[k]; });
    $$('[data-i18n-aria]').forEach(el => { const k = el.dataset.i18nAria; el.setAttribute('aria-label', en ? (D.en[k] ?? km.aria[k]) : km.aria[k]); });
    $$('[data-i18n-alt]').forEach(el => { const k = el.dataset.i18nAlt; el.setAttribute('alt', en ? (D.en[k] ?? km.alt[k]) : km.alt[k]); });
    const lb = $('#langBtn');
    $('#langLabel').textContent = en ? 'ខ្មែរ' : 'EN';
    lb.setAttribute('lang', en ? 'km' : 'en');
    lb.setAttribute('aria-label', en ? 'ប្តូរទៅភាសាខ្មែរ' : 'Switch to English');
    $('#tgBtn').href = 'https://t.me/' + encodeURIComponent(tgHandle());
    $$('.step__n').forEach((el, i) => { el.textContent = num(i + 1); });
    const from = Math.min(...D.products.filter(p => p.unit === 'kg').map(p => p.price));
    $('#heroFrom').textContent = riel(from);
    buildDial();
    renderGrid();
    renderFinder();
    renderSeason();
    renderOrderInfo();
    renderCredits();
    renderCart();
    if ($('#themeBtn')) paintThemeBtn();
  }

  /* ---------- images ---------- */
  const photo = (p, sizes, eager) =>
    `<img src="assets/photos/${p.photo}-480.webp" srcset="assets/photos/${p.photo}-480.webp 480w, assets/photos/${p.photo}-900.webp ${p.ratio[0]}w" sizes="${sizes}" width="${p.ratio[0]}" height="${p.ratio[1]}" alt="${esc(L(p.name))}" ${eager ? '' : 'loading="lazy" '}decoding="async">`;

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
  const phone = matchMedia('(max-width: 760px)');
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      nav.classList.toggle('is-scrolled', y > 30);
      // phones: hide the header while scrolling down, bring it back on the way up
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
  const meter = (n, cls) => `<dd class="${cls}">${[1, 2, 3, 4, 5].map(i => `<span class="seg${i <= n ? ' on' : ''}"></span>`).join('')}</dd>`;
  const plusIc = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>';
  const addBtn = p => `<button type="button" class="add" data-add="${p.id}" aria-label="${esc(t('add') + ' ' + L(p.name))}">${plusIc}<span>${t('add')}</span></button>`;
  function renderGrid() {
    const list = D.products.filter(p => state.filter === 'all' || p.kind === state.filter);
    const alt = state.lang === 'km' ? 'en' : 'km';
    $('#productGrid').innerHTML = list.map((p, i) => `
      <article class="card" style="--i:${i}">
        <div class="card__art">
          ${photo(p, '(max-width: 700px) 92vw, 380px')}
          <span class="card__origin">${esc(L(p.origin))}</span>
          ${p.badge ? `<span class="badge">${esc(L(p.badge))}</span>` : ''}
        </div>
        <div class="card__body">
          <div class="card__title"><h3>${esc(L(p.name))}</h3><span class="card__alt" lang="${alt}">${esc(p.name[alt])}</span></div>
          <p class="card__desc">${esc(L(p.desc))}</p>
          <ul class="tags">${p.tags.map(k => `<li>${esc(L(D.tags[k]))}</li>`).join('')}</ul>
          <dl class="meters">
            <dt>${t('sweet')}</dt>${meter(p.sweet, 'sweet')}
            <dt>${t('aroma')}</dt>${meter(p.aroma, 'aroma')}
            <dt>${t('texture')}</dt>${meter(p.texture, 'texture')}
          </dl>
          <div class="card__foot">
            <p class="price"><strong>${riel(p.price)}</strong><span>${t('per' + p.unit)} · ${usd(p.price)}</span></p>
            ${addBtn(p)}
          </div>
        </div>
      </article>`).join('');
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
    const same = el.dataset.best === best.p.id && el.dataset.lang === state.lang;
    if (same) {
      $('.match__pct', el).textContent = num(best.pct) + '%';
    } else {
      el.innerHTML = `
        <div class="match">
          <div class="match__art">${photo(best.p, '(max-width: 560px) 80vw, 260px')}</div>
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
  Object.values(fIn).forEach(el => {
    paintRange(el);
    el.addEventListener('input', () => { paintRange(el); renderFinder(); });
  });

  /* ---------- season ---------- */
  function renderSeason() {
    const now = new Date().getMonth();
    $('#months').innerHTML = D.season.map((s, i) => `
      <li class="month${i === now ? ' is-now' : ''}" data-s="${s}">
        ${i === now ? `<span class="month__now">${t('now')}</span>` : ''}
        <span><span class="month__km" lang="km">${D.months.km[i]}</span><br><span class="month__en">${D.months.en[i]}</span></span>
        <span class="month__bar" aria-hidden="true"><i style="height:${[18, 55, 100][s]}%"></i></span>
      </li>`).join('');
    const s = D.season[now];
    const head = s === 2 ? t('inSeason') : s === 1 ? t('edgeSeason') : t('offSeason');
    $('#seasonNow').innerHTML = `<strong>${head}</strong><span>${t('monthPrefix')}${D.months[state.lang][now]} · ${s ? t('inSub') : t('offSub')}</span>`;
  }

  /* ---------- order info + credits ---------- */
  const tgHandle = () => String(D.config.telegram || '').replace(/^@/, '');
  function renderOrderInfo() {
    $('#zones').innerHTML = D.zones.map(z => `<li><strong>${esc(L(z.name))}</strong><span class="fee">${z.fee ? riel(z.fee) : t('free')}</span><span class="eta">${esc(L(z.eta))}</span></li>`).join('');
    $('#contact').innerHTML = `
      <li>${t('tg')}: <a href="https://t.me/${encodeURIComponent(tgHandle())}" target="_blank" rel="noopener">@${esc(tgHandle())}</a></li>
      <li>${t('phone')}: <a class="copyable" href="tel:${esc(D.config.phone.replace(/\s/g, ''))}">${esc(D.config.phone)}</a></li>`;
    $('#zone').innerHTML = D.zones.map(z => `<option value="${z.id}"${z.id === state.zone ? ' selected' : ''}>${esc(L(z.name))} · ${z.fee ? riel(z.fee) : t('free')}</option>`).join('');
    $('#cWhen').innerHTML = D.when.map(w => `<option value="${w.id}"${w.id === state.when ? ' selected' : ''}>${esc(L(w))}</option>`).join('');
  }
  function renderCredits() {
    $('#credits').innerHTML = D.credits.map(c => `<li>${esc(c.use)}: <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.artist)}</a> · ${esc(c.license)}</li>`).join('');
  }

  /* ---------- cart ---------- */
  const dlg = $('#cart');
  const saveCart = () => store.set('cart', state.cart);
  const cartItems = () => Object.entries(state.cart).filter(([id, q]) => byId[id] && q > 0).map(([id, q]) => ({ p: byId[id], q }));
  const zoneObj = () => D.zones.find(z => z.id === state.zone) || D.zones[0];
  const whenObj = () => D.when.find(w => w.id === state.when) || D.when[0];
  function totals() {
    const sub = cartItems().reduce((s, { p, q }) => s + p.price * q, 0);
    const del = sub ? zoneObj().fee : 0;
    return { sub, del, total: sub + del };
  }
  function renderCart() {
    const items = cartItems();
    const count = items.reduce((s, i) => s + i.q, 0);
    $('#cartCount').textContent = num(count);
    $('#tabCount').textContent = num(count);
    $('#tabCount').hidden = count === 0;
    $('#cartLines').innerHTML = items.map(({ p, q }) => `
      <li class="line">
        <div class="line__art">${photo(p, '64px')}</div>
        <div><div class="line__name">${esc(L(p.name))}</div><div class="line__unit">${riel(p.price)} ${t('per' + p.unit)}</div></div>
        <div class="line__right">
          <span class="line__total">${riel(p.price * q)}</span>
          <span class="qty">
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
    const { sub, del, total } = totals();
    $('#sumSub').textContent = riel(sub);
    $('#sumDel').textContent = del ? riel(del) : t('free');
    $('#sumTotal').textContent = riel(total);
    updateTelegramLink();
  }

  function orderMessage() {
    const lines = [t('msgHello').replace('{shop}', L(D.config.shopName))];
    cartItems().forEach(({ p, q }) => lines.push(`• ${L(p.name)} × ${num(q)} ${t('unit' + p.unit)} = ${riel(p.price * q)}`));
    const { del, total } = totals();
    lines.push('', `${t('msgDelivery')}: ${L(zoneObj().name)} (${del ? riel(del) : t('free')})`, `${t('msgWhen')}: ${L(whenObj())}`, `${t('msgTotal')}: ${riel(total)}`, '');
    lines.push(`${t('msgName')}: ${$('#cName').value.trim()}`, `${t('msgPhone')}: ${$('#cPhone').value.trim()}`);
    const a = $('#cAddr').value.trim(); if (a) lines.push(`${t('msgAddr')}: ${a}`);
    return lines.join('\n');
  }
  function updateTelegramLink() {
    $('#sendTelegram').href = `https://t.me/${encodeURIComponent(tgHandle())}?text=${encodeURIComponent(orderMessage())}`;
  }
  function validate() {
    const err = $('#formErr');
    if (!cartItems().length) { err.textContent = t('emptyCart'); err.hidden = false; return false; }
    const req = [$('#cName'), $('#cPhone')];
    const bad = req.filter(i => !i.value.trim() || (i.id === 'cPhone' && i.value.replace(/\D/g, '').length < 8));
    req.forEach(i => i.classList.toggle('is-bad', bad.includes(i)));
    if (bad.length) { err.textContent = t('needInfo'); err.hidden = false; bad[0].focus(); return false; }
    err.hidden = true; return true;
  }
  async function copyText(s) {
    try { await navigator.clipboard.writeText(s); return true; } catch { return false; }
  }
  const draft = store.get('draft', {});
  ['cName', 'cPhone', 'cAddr'].forEach(id => {
    const el = $('#' + id);
    if (draft[id]) el.value = draft[id];
    el.addEventListener('input', () => { draft[id] = el.value; store.set('draft', draft); el.classList.remove('is-bad'); updateTelegramLink(); });
  });
  $('#zone').addEventListener('change', e => { state.zone = e.target.value; store.set('zone', state.zone); renderCart(); });
  $('#cWhen').addEventListener('change', e => { state.when = e.target.value; store.set('when', state.when); updateTelegramLink(); });
  $('#sendTelegram').addEventListener('click', e => {
    if (!validate()) { e.preventDefault(); return; }
    updateTelegramLink();
    copyText(orderMessage()); // also on the clipboard, in case the Telegram app ignores the prefilled text
  });
  $('#copyOrder').addEventListener('click', async () => {
    if (!validate()) return;
    toast(await copyText(orderMessage()) ? t('copied') : t('copyFail'));
  });

  function openCart() {
    if (dlg.open) return;
    renderCart();
    dlg.classList.remove('is-closing');
    dlg.showModal();
  }
  function closeCart() {
    if (!dlg.open) return;
    if (reduced) { dlg.close(); return; }
    dlg.classList.add('is-closing');
    setTimeout(() => { dlg.close(); dlg.classList.remove('is-closing'); }, 280);
  }
  $('#cartOpen').addEventListener('click', openCart);
  $('#tabCart').addEventListener('click', openCart);
  $('#orderOpen').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#emptyBrowse').addEventListener('click', closeCart);
  dlg.addEventListener('cancel', e => { e.preventDefault(); closeCart(); });
  dlg.addEventListener('click', e => { if (e.target === dlg) closeCart(); });

  function addToCart(id, from) {
    state.cart[id] = (state.cart[id] || 0) + 1;
    saveCart(); renderCart();
    const btn = phone.matches ? $('#tabCart') : $('#cartOpen');
    btn.classList.remove('bump'); void btn.offsetWidth; btn.classList.add('bump');
    toast(t('addedToast').replace('{n}', L(byId[id].name)));
    if (from) {
      from.classList.add('is-added');
      const span = from.querySelector('span'); if (span) span.textContent = t('added');
      setTimeout(() => { from.classList.remove('is-added'); if (span) span.textContent = t('add'); }, 1400);
      if (!reduced) fly(from, btn);
    }
  }
  function fly(a, b) {
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const dot = document.createElement('span'); dot.className = 'fly';
    document.body.appendChild(dot);
    const x0 = ra.left + ra.width / 2 - 11, y0 = ra.top + ra.height / 2 - 11;
    const x1 = rb.left + rb.width - 26, y1 = rb.top + rb.height / 2 - 11;
    dot.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1)` },
      { transform: `translate(${(x0 + x1) / 2}px, ${Math.min(y0, y1) - 120}px) scale(1.3)`, offset: .5 },
      { transform: `translate(${x1}px, ${y1}px) scale(.4)`, opacity: .6 }
    ], { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = () => dot.remove();
  }
  document.addEventListener('click', e => {
    const add = e.target.closest('[data-add]'); if (add) { addToCart(add.dataset.add, add); return; }
    const inc = e.target.closest('[data-inc]'); if (inc) { state.cart[inc.dataset.inc]++; saveCart(); renderCart(); return; }
    const dec = e.target.closest('[data-dec]');
    if (dec) { const id = dec.dataset.dec; state.cart[id]--; if (state.cart[id] <= 0) delete state.cart[id]; saveCart(); renderCart(); }
  });

  /* ---------- toast ---------- */
  let toastT = 0;
  function toast(msg) {
    const el = $('#toast'); el.textContent = msg; el.classList.add('is-on');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('is-on'), 2400);
  }

  /* ---------- theme (system by default, remembered once chosen) ---------- */
  const darkMQ = matchMedia('(prefers-color-scheme: dark)');
  const root = document.documentElement;
  const isDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : darkMQ.matches;
  function paintThemeBtn() {
    const b = $('#themeBtn');
    b.setAttribute('aria-label', isDark() ? t('toLight') : t('toDark'));
    b.setAttribute('aria-pressed', String(isDark()));
  }
  $('#themeBtn').addEventListener('click', () => {
    const next = isDark() ? 'light' : 'dark';
    const go = () => { root.dataset.theme = next; store.set('theme', next); paintThemeBtn(); };
    document.startViewTransition && !reduced ? document.startViewTransition(go) : go();
  });
  darkMQ.addEventListener?.('change', paintThemeBtn);

  /* ---------- language ---------- */
  $('#langBtn').addEventListener('click', () => {
    state.lang = state.lang === 'km' ? 'en' : 'km'; store.set('lang', state.lang);
    document.startViewTransition && !reduced ? document.startViewTransition(applyLang) : applyLang();
  });

  /* ---------- active section in header links + tab bar ---------- */
  const secLinks = $$('[data-sec]');
  const setActive = id => secLinks.forEach(a => a.classList.toggle('is-active', a.dataset.sec === id));
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['top', 'varieties', 'finder', 'season', 'culture', 'order'].forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
  }

  applyLang();
})();
