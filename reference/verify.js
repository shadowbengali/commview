const { chromium } = require('playwright');

const PAGES = ['index.html', 'blog.html', 'article.html', 'category.html'];
const WIDTHS = [360, 390, 430, 768, 900, 1024, 1280, 1440, 1920];

(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  let fails = 0;

  for (const file of PAGES) {
    for (const w of WIDTHS) {
      const p = await b.newPage({ viewport: { width: w, height: 900 } });
      const errs = [];
      p.on('pageerror', e => errs.push(String(e)));
      await p.goto('file:///mnt/user-data/outputs/' + file);
      await p.waitForTimeout(500);
      const r = await p.evaluate(() => {
        const d = document.documentElement;
        const over = [];
        document.querySelectorAll('body *').forEach(el => {
          const b = el.getBoundingClientRect();
          if (b.width && (b.right > d.clientWidth + 1)) {
            const cs = getComputedStyle(el);
            // ignore elements clipped by an ancestor
            let a = el.parentElement, clipped = false;
            while (a) { if (getComputedStyle(a).overflowX !== 'visible') { clipped = true; break; } a = a.parentElement; }
            if (!clipped && cs.position !== 'fixed') over.push(el.tagName + '.' + (typeof el.className === 'string' ? el.className : '') + ' R' + Math.round(b.right));
          }
        });
        return { sw: d.scrollWidth, cw: d.clientWidth, over: over.slice(0, 6) };
      });
      const bad = r.sw > r.cw + 1;
      if (bad || errs.length) {
        fails++;
        console.log('FAIL', file, w, 'scroll', r.sw, 'client', r.cw, errs.join('|'), r.over.join(' | '));
      }
      await p.close();
    }
  }

  // JSON-LD validity + structural assertions
  for (const file of PAGES) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto('file:///mnt/user-data/outputs/' + file);
    await p.waitForTimeout(400);
    const r = await p.evaluate(() => {
      const out = { ld: [], h1: document.querySelectorAll('h1').length, title: document.title, lang: document.documentElement.lang };
      document.querySelectorAll('script[type="application/ld+json"]').forEach(s => {
        try { const j = JSON.parse(s.textContent); out.ld.push((j['@graph'] || [j]).map(n => n['@type']).join(', ')); }
        catch (e) { out.ld.push('PARSE ERROR: ' + e.message); }
      });
      // heading order
      const hs = [...document.querySelectorAll('h1,h2,h3,h4')].map(h => +h.tagName[1]);
      let jump = null;
      for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 1) jump = hs[i - 1] + '->' + hs[i];
      out.headingJump = jump;
      out.imgNoAlt = [...document.querySelectorAll('img')].filter(i => !i.hasAttribute('alt')).length;
      out.links = document.querySelectorAll('a[href]').length;
      out.hashLinks = [...document.querySelectorAll('a[href="#"]')].length;
      return out;
    });
    console.log('\n' + file);
    console.log('  title  :', r.title);
    console.log('  lang   :', r.lang, '| h1 count:', r.h1, '| heading jump:', r.headingJump || 'none');
    console.log('  json-ld:', r.ld.join(' || '));
    console.log('  links  :', r.links, '| placeholder "#" links:', r.hashLinks, '| img missing alt:', r.imgNoAlt);
    if (r.h1 !== 1) { console.log('  FAIL h1 count'); fails++; }
    if (r.ld.some(x => x.includes('PARSE ERROR'))) { console.log('  FAIL json-ld'); fails++; }
    await p.close();
  }

  // interaction checks on the article
  {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto('file:///mnt/user-data/outputs/article.html');
    await p.waitForTimeout(400);
    const start = await p.evaluate(() => document.getElementById('prog').style.width);
    await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await p.waitForTimeout(400);
    const end = await p.evaluate(() => ({
      w: document.getElementById('prog').style.width,
      active: document.querySelectorAll('#toc a[data-on]').length,
    }));
    console.log('\ninteraction: progress', start || '0%', '->', end.w, '| active TOC items at foot:', end.active);
    if (parseFloat(end.w) <= parseFloat(start || '0')) { console.log('  FAIL progress bar'); fails++; }

    // FAQ toggles
    await p.evaluate(() => document.querySelector('.faq summary').click());
    await p.waitForTimeout(200);
    const open = await p.evaluate(() => document.querySelector('.faq details').open);
    console.log('faq toggles:', open);
    if (!open) fails++;
    await p.close();
  }

  // mobile menu on every page
  for (const file of PAGES) {
    const p = await b.newPage({ viewport: { width: 390, height: 844 } });
    await p.goto('file:///mnt/user-data/outputs/' + file);
    await p.waitForTimeout(300);
    await p.click('.burger');
    await p.waitForTimeout(200);
    const vis = await p.evaluate(() => {
      const n = document.getElementById('nav');
      return { open: n.getAttribute('data-open'), h: Math.round(n.getBoundingClientRect().height) };
    });
    console.log('mobile menu', file, vis.open, vis.h + 'px');
    if (vis.open !== 'true' || vis.h < 100) fails++;
    await p.close();
  }

  console.log('\n' + (fails ? fails + ' FAILURES' : 'all checks passed'));
  await b.close();
})();
