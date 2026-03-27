/* ═══════════════════════════════════════════════════════
   PRAVI TECHNOLOGIES — FRONTEND
   All content loaded from MongoDB via Render backend API
   ═══════════════════════════════════════════════════════ */

const API = 'https://pravi-backend.onrender.com/api';

/* ──────────────────────────────────────────────────────
   LOADING OVERLAY — shown while backend wakes up
────────────────────────────────────────────────────── */
function showLoader() {
  if (document.getElementById('_praviLoader')) return;
  const loader = document.createElement('div');
  loader.id = '_praviLoader';
  loader.innerHTML = `
    <style>
      #_praviLoader {
        position: fixed; inset: 0; z-index: 99999;
        background: #080c10;
        display: flex; flex-direction: column;
        align-items: center; justify-content: center;
        gap: 1.5rem;
        transition: opacity 0.5s ease;
      }
      #_praviLoader img { height: 60px; width: auto; object-fit: contain; animation: _pl-pulse 1.6s ease-in-out infinite; }
      @keyframes _pl-pulse { 0%,100%{opacity:.5;transform:scale(0.97)} 50%{opacity:1;transform:scale(1.03)} }
      #_praviLoader ._bar {
        width: 180px; height: 2px; background: rgba(0,201,167,0.15); overflow: hidden;
      }
      #_praviLoader ._bar span {
        display: block; height: 100%; width: 40%;
        background: #00c9a7;
        animation: _pl-slide 1.2s ease-in-out infinite;
      }
      @keyframes _pl-slide { 0%{transform:translateX(-100%)} 100%{transform:translateX(350%)} }
      #_praviLoader p { font-family:'Rajdhani',sans-serif; font-size:.75rem; letter-spacing:.25em; text-transform:uppercase; color:rgba(0,201,167,0.5); }
    </style>
    <img src="logo.jpeg" alt="Pravi Technologies"/>
    <div class="_bar"><span></span></div>
    <p id="_praviLoaderMsg">Connecting...</p>
  `;
  document.body.appendChild(loader);
}

function hideLoader() {
  const loader = document.getElementById('_praviLoader');
  if (!loader) return;
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 500);
}

function setLoaderMsg(msg) {
  const el = document.getElementById('_praviLoaderMsg');
  if (el) el.textContent = msg;
}

/* ──────────────────────────────────────────────────────
   FETCH WITH RETRY — handles Render.com cold starts
────────────────────────────────────────────────────── */
async function fetchWithRetry(url, retries, delayMs) {
  retries = retries || 3;
  delayMs = delayMs || 4000;
  for (var attempt = 1; attempt <= retries; attempt++) {
    try {
      var controller = new AbortController();
      var timeout = setTimeout(function() { controller.abort(); }, 12000);
      var res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeout);
      if (res.ok) return res;
    } catch (e) {
      if (attempt < retries) {
        setLoaderMsg('Retrying... (' + attempt + '/' + retries + ')');
        await new Promise(function(r) { setTimeout(r, delayMs); });
      }
    }
  }
  return null;
}

/* ──────────────────────────────────────────────────────
   BOOT — fetch all site data, apply, then init UI
────────────────────────────────────────────────────── */
async function bootSite() {
  showLoader();
  try {
    setLoaderMsg('Connecting...');
    const res = await fetchWithRetry(API + '/site');
    if (res) {
      const site = await res.json();
      applyAll(site);
    } else {
      console.warn('Backend unreachable after retries — running with defaults.');
      applyAll({});
    }
  } catch (e) {
    console.warn('Boot error — running with defaults.', e);
    applyAll({});
  }
  initUI();
  hideLoader();
}

/* ──────────────────────────────────────────────────────
   APPLY ALL SECTIONS
────────────────────────────────────────────────────── */
function applyAll(site) {
  applyBranding(site.branding || {});
  applyHero(site.hero || {});
  applyAbout(site.about || {});
  applyStats(site.stats || {});
  applyContact(site.contact || {});
  applyMap(site.map || {});
  applyWhatsApp(site.whatsapp || {});
  applyClients(site.clients || {});
  applyTestimonials(site.testimonials || {});
  applyProducts(site.products || {});
  applyFacility(site.facility || {});
  applyGallery(site.gallery || {});
  applyBeforeAfter(site.beforeafter || {});
}

/* ──────────────────────────────────────────────────────
   BRANDING
────────────────────────────────────────────────────── */
function applyBranding(d) {
  setText('brandName',       d.companyName   || 'PRAVI');
  setText('footerBrandName', d.companyName   || 'PRAVI');
  setText('brandSub',        d.tagline       || 'Technologies');
  setText('footerTagline',   d.footerTagline || 'Innovative lighting solutions trusted across India since 2012. Your space, brilliantly lit.');

  if (d.pageTitle)    document.getElementById('siteTitle').textContent   = d.pageTitle;
  if (d.metaDesc)     document.getElementById('siteDesc') && document.getElementById('siteDesc').setAttribute('content', d.metaDesc);
  if (d.keywords)     document.getElementById('siteKeys') && document.getElementById('siteKeys').setAttribute('content', d.keywords);
  if (d.color)        document.documentElement.style.setProperty('--accent', d.color);
  if (d.logo) {
    document.querySelectorAll('.pravi-logo svg').forEach(function(svg) {
      var img = document.createElement('img');
      img.src = d.logo; img.height = 38; img.alt = 'Logo';
      svg.replaceWith(img);
    });
  }
}

/* ──────────────────────────────────────────────────────
   HERO
────────────────────────────────────────────────────── */
function applyHero(d) {
  setText('heroEyebrow',      d.eyebrow        || 'Premium Lighting');
  setText('heroBtnPrimary',   d.btnPrimary     || 'Explore Products');
  setText('heroBtnSecondary', d.btnSecondary   || 'Get a Quote');
  setText('heroDesc',         d.description    || 'Transforming spaces with cutting-edge lighting design.');

  const title = document.getElementById('heroTitle');
  if (title) {
    title.innerHTML = (d.titleLine1 || 'INNOVATIVE') + '<br>' + (d.titleLine2 || 'LIGHTING') + '<br><span id="heroTitleAccent">' + (d.titleLine3Accent || 'SOLUTIONS') + '</span>';
  }

  if (d.bgImage) {
    const hero = document.getElementById('hero');
    if (hero) {
      hero.style.backgroundImage = 'url(' + d.bgImage + ')';
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    }
  } else if (d.bgImage === '') {
    const hero = document.getElementById('hero');
    if (hero) hero.style.backgroundImage = '';
  }
}

/* ──────────────────────────────────────────────────────
   ABOUT
────────────────────────────────────────────────────── */
function applyAbout(d) {
  setText('aboutEyebrow', d.eyebrow     || 'Why Choose Us');
  setText('aboutDesc',    d.description || '');

  const titleEl = document.getElementById('aboutTitle');
  if (titleEl) {
    titleEl.innerHTML = (d.titleLine1 || 'ILLUMINATE') + '<br><span id="aboutTitleAccent">' + (d.titleLine2Accent || 'YOUR SPACES') + '</span>';
  }

  if (d.features && d.features.length) {
    const iconMap = { 0: 'fa-bolt', 1: 'fa-palette', 2: 'fa-shield-halved', 3: 'fa-headset' };
    const grid = document.getElementById('featuresGrid');
    if (grid) {
      grid.innerHTML = d.features.map(function(f, i) {
        return '<div class="feature-item"><i class="fa-solid ' + (f.icon || iconMap[i] || 'fa-star') + '"></i><div><h4>' + esc(f.title) + '</h4><p>' + esc(f.desc) + '</p></div></div>';
      }).join('');
    }
  }
}

/* ──────────────────────────────────────────────────────
   COUNTER ANIMATION
────────────────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  el.textContent = '0';
  const start = performance.now();
  const update = function(now) {
    const progress = Math.min((now - start) / 1800, 1);
    const eased    = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

/* ──────────────────────────────────────────────────────
   STATS
────────────────────────────────────────────────────── */
function applyStats(d) {
  const s1 = d.s1 || { num: 500, suffix: '+',   label: 'Projects Done' };
  const s2 = d.s2 || { num: 50,  suffix: '+',   label: 'Industry Partners' };
  const s3 = d.s3 || { num: 12,  suffix: 'yrs', label: 'In Business' };
  const s4 = d.s4 || { num: 80,  suffix: '%',   label: 'Client Retention' };

  const statP  = document.getElementById('statProjects');
  const statPa = document.getElementById('statPartners');
  const statY  = document.getElementById('statYears');
  if (statP)  statP.dataset.target  = s1.num;
  if (statPa) statPa.dataset.target = s2.num;
  if (statY)  { statY.dataset.target = s3.num; setText('statYearsSuffix', s3.suffix); }
  setText('statProjectsLabel', s1.label);
  setText('statPartnersLabel', s2.label);
  setText('statYearsLabel',    s3.label);

  const sb1 = document.getElementById('sb1');
  const sb2 = document.getElementById('sb2');
  const sb3 = document.getElementById('sb3');
  const sb4 = document.getElementById('sb4');
  if (sb1) sb1.dataset.target = s1.num;
  if (sb2) sb2.dataset.target = s2.num;
  if (sb3) sb3.dataset.target = s3.num;
  if (sb4) sb4.dataset.target = s4.num;
  setText('sb1s', s1.suffix); setText('sb1l', s1.label);
  setText('sb2s', s2.suffix); setText('sb2l', s2.label);
  setText('sb3s', s3.suffix); setText('sb3l', s3.label);
  setText('sb4s', s4.suffix); setText('sb4l', s4.label);

  setTimeout(function() {
    document.querySelectorAll('[data-target]').forEach(animateCounter);
  }, 300);
}

/* ──────────────────────────────────────────────────────
   CONTACT
────────────────────────────────────────────────────── */
function applyContact(d) {
  const phone   = d.phone   || '+91 98765 43210';
  const email   = d.email   || 'info@pravitechnologies.com';
  const address = d.address || 'No. 45, 2nd Floor, Hosur Road, Electronic City, Bengaluru - 560100';
  const hours   = d.hours   || 'Mon - Sat: 9:00 AM - 6:00 PM';

  setText('contactAddress', address);
  setText('contactPhone',   phone);
  setText('contactHours',   hours);
  setText('mapAddress',     address);
  setText('mapPhone',       phone);
  setText('mapHours',       hours);
  setText('footerPhone',    phone);

  const emailEl  = document.getElementById('contactEmail');
  if (emailEl)  { emailEl.textContent  = email; emailEl.href  = 'mailto:' + email; }
  const fEmailEl = document.getElementById('footerEmail');
  if (fEmailEl) { fEmailEl.textContent = email; fEmailEl.href = 'mailto:' + email; }

  const socials = { socialFb: d.facebook, socialIg: d.instagram, socialLi: d.linkedin, socialYt: d.youtube };
  Object.entries(socials).forEach(function(entry) {
    var el = document.getElementById(entry[0]);
    if (el && entry[1] && entry[1] !== '#') { el.href = entry[1]; el.style.display = 'flex'; }
  });
  const fSocials = { footerFb: d.facebook, footerIg: d.instagram, footerLi: d.linkedin };
  Object.entries(fSocials).forEach(function(entry) {
    var el = document.getElementById(entry[0]);
    if (el && entry[1] && entry[1] !== '#') el.href = entry[1];
  });
}

/* ──────────────────────────────────────────────────────
   MAP
────────────────────────────────────────────────────── */
function applyMap(d) {
  if (d.show === false) {
    const sec = document.getElementById('map-section');
    if (sec) sec.style.display = 'none';
    return;
  }
  const placeholder = document.getElementById('mapPlaceholder');
  const container   = document.getElementById('mapIframeContainer');
  if (!container) return;

  if (d.embedCode) {
    if (placeholder) placeholder.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = d.embedCode;
    const iframe = container.querySelector('iframe');
    if (iframe) { iframe.style.width = '100%'; iframe.style.height = d.height || '420px'; iframe.style.border = 'none'; }
  } else if (d.embedUrl) {
    if (placeholder) placeholder.style.display = 'none';
    container.style.display = 'block';
    container.innerHTML = '<iframe src="' + d.embedUrl + '" style="width:100%;height:' + (d.height || '420px') + ';border:none;display:block;filter:grayscale(0.3)" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>';
  }
}

/* ──────────────────────────────────────────────────────
   WHATSAPP
────────────────────────────────────────────────────── */
function applyWhatsApp(d) {
  const float = document.getElementById('wa-float');
  if (!float) return;
  if (d.enabled === false) { float.style.display = 'none'; return; }
  float.style.display = 'flex';
  if (d.position === 'bottom-left') float.classList.add('wa-left');
  const tooltip = document.getElementById('wa-tooltip-bubble');
  if (tooltip) tooltip.textContent = d.tooltip || 'Chat with us on WhatsApp!';
}

function openWhatsApp() {
  fetch(API + '/site/whatsapp').then(function(r) { return r.json(); }).then(function(d) {
    var phone = (d.phone || '+919876543210').replace(/[^0-9]/g, '');
    var msg   = encodeURIComponent(d.message || "Hello Pravi Technologies! I'm interested in your lighting solutions.");
    window.open('https://wa.me/' + phone + '?text=' + msg, '_blank');
  }).catch(function() {
    window.open('https://wa.me/919876543210', '_blank');
  });
}

/* ──────────────────────────────────────────────────────
   CLIENTS MARQUEE
────────────────────────────────────────────────────── */
function applyClients(d) {
  const marquee = document.getElementById('clientsMarquee');
  if (!marquee || !d.items || !d.items.length) return;
  const all = d.items.concat(d.items);
  marquee.innerHTML = all.map(function(c) {
    if (c.logo) return '<div class="client-logo"><img src="' + c.logo + '" alt="' + esc(c.name) + '" style="height:32px;width:auto;filter:grayscale(1) brightness(0.6);transition:filter 0.3s"/></div>';
    return '<div class="client-logo">' + esc(c.name) + '</div>';
  }).join('');
}

/* ──────────────────────────────────────────────────────
   TESTIMONIALS CAROUSEL
────────────────────────────────────────────────────── */
var _testimonials = [
  { stars: '★★★★★', text: '"Pravi Technologies transformed our office lighting completely."', initials: 'RK', name: 'Rajesh Kumar', role: 'Facilities Head, Infosys' },
  { stars: '★★★★★', text: '"Exceptional quality and service from Pravi Technologies."', initials: 'PS', name: 'Priya Sharma', role: 'GM Operations, Prestige Hotels' },
  { stars: '★★★★☆', text: '"Professional team, on-time delivery, highly recommended!"', initials: 'AM', name: 'Amit Mehta', role: 'Project Head, Brigade Group' },
];
var _tCurrent = 0;

function applyTestimonials(d) {
  if (d.items && d.items.length) _testimonials = d.items;
  buildTestiDots();
  setTestimonial(0);
}

function buildTestiDots() {
  const dotsEl = document.getElementById('testiDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  _testimonials.forEach(function(_, i) {
    var dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', function() { setTestimonial(i); });
    dotsEl.appendChild(dot);
  });
}

function setTestimonial(index) {
  _tCurrent = (index + _testimonials.length) % _testimonials.length;
  const t    = _testimonials[_tCurrent];
  const card = document.getElementById('tCard');
  if (!card) return;
  card.style.opacity = '0'; card.style.transform = 'translateY(10px)';
  setTimeout(function() {
    card.innerHTML =
      '<div class="stars">' + (t.stars || '★★★★★') + '</div>' +
      '<p class="testi-text">' + esc(t.text) + '</p>' +
      '<div class="testi-author">' +
        '<div class="author-avatar">' + esc(t.initials || (t.name ? t.name.slice(0,2) : 'AB')) + '</div>' +
        '<div><h4>' + esc(t.name) + '</h4><p>' + esc(t.role) + '</p></div>' +
      '</div>';
    card.style.transition = 'opacity 0.4s, transform 0.4s';
    card.style.opacity = '1'; card.style.transform = 'translateY(0)';
    document.querySelectorAll('#testiDots .dot').forEach(function(d, i) { d.classList.toggle('active', i === _tCurrent); });
  }, 200);
}

/* ──────────────────────────────────────────────────────
   PRODUCTS
────────────────────────────────────────────────────── */
function applyProducts(d) {
  if (!d.items || !d.items.length) return;
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = d.items.map(function(p) {
    return '<div class="product-card" data-category="' + esc((p.category || '').toLowerCase()) + '">' +
      '<div class="product-img" style="' + (p.image ? 'background-image:url(' + p.image + ');background-size:cover;background-position:center' : 'background:linear-gradient(135deg,#1a2a2a,#0d1f1f)') + '"></div>' +
      '<div class="product-info"><h3>' + esc(p.name) + '</h3><p>' + esc(p.category) + '</p>' +
      '<a href="' + esc(p.link || '#quote') + '" class="product-link">Enquire <i class="fa-solid fa-arrow-right"></i></a></div></div>';
  }).join('');
}

/* ──────────────────────────────────────────────────────
   FACILITY
────────────────────────────────────────────────────── */
function applyFacility(d) {
  if (!d.images || !d.images.length) return;
  const slider = document.getElementById('facilitySlider');
  if (!slider) return;
  slider.innerHTML = d.images.map(function(src) {
    return '<div class="facility-slide" style="background-image:url(' + src + ');background-size:cover;background-position:center"></div>';
  }).join('');
  initFacilitySlider();
}

/* ──────────────────────────────────────────────────────
   GALLERY
────────────────────────────────────────────────────── */
function applyGallery(d) {
  if (!d.images || !d.images.length) return;
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;
  const sizeClasses = ['tall', '', '', 'wide', '', 'tall', '', ''];
  grid.innerHTML = d.images.map(function(item, i) {
    var src = item.src || item;
    var cat = item.category || 'all';
    var cls = sizeClasses[i % sizeClasses.length];
    return '<div class="gallery-item ' + cls + '" data-cat="' + esc(cat) + '" style="background-image:url(' + src + ');background-size:cover;background-position:center"></div>';
  }).join('');
}

/* ──────────────────────────────────────────────────────
   BEFORE & AFTER
────────────────────────────────────────────────────── */
function applyBeforeAfter(d) {
  if (!d.pairs || !d.pairs.length) return;
  const container = document.querySelector('#before-after .container');
  if (!container) return;
  const header = container.querySelector('.section-header');
  container.innerHTML = '';
  if (header) container.appendChild(header);

  d.pairs.forEach(function(pair, i) {
    var div = document.createElement('div');
    div.className = 'ba-set';
    div.innerHTML =
      '<p class="ba-set-title">Project ' + (i + 1) + '</p>' +
      '<div class="ba-grid">' +
        '<div class="ba-card"><div class="ba-img before" style="' + (pair.before ? 'background-image:url(' + pair.before + ');background-size:cover;background-position:center' : '') + '"></div><div class="ba-label">Before</div></div>' +
        '<div class="ba-arrow"><i class="fa-solid fa-arrow-right"></i></div>' +
        '<div class="ba-card"><div class="ba-img after" style="' + (pair.after ? 'background-image:url(' + pair.after + ');background-size:cover;background-position:center' : '') + '"></div><div class="ba-label teal">After</div></div>' +
      '</div>';
    container.appendChild(div);
  });
}

/* ══════════════════════════════════════════════════════
   QUOTE FORM
══════════════════════════════════════════════════════ */
async function submitForm() {
  const name    = document.getElementById('fName')    && document.getElementById('fName').value.trim();
  const phone   = document.getElementById('fPhone')   && document.getElementById('fPhone').value.trim();
  const email   = document.getElementById('fEmail')   && document.getElementById('fEmail').value.trim();
  const project = document.getElementById('fProject') && document.getElementById('fProject').value;
  const message = document.getElementById('fMessage') && document.getElementById('fMessage').value.trim();

  if (!name || !phone || !email) { alert('Please fill in all required fields.'); return; }
  if (!email.includes('@'))       { alert('Please enter a valid email address.'); return; }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    const res = await fetch(API + '/leads', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name: name, phone: phone, email: email, project: project, message: message }),
    });

    if (res.ok) {
      try {
        await emailjs.send('service_a94ptrg', 'template_slycisr', {
          name: name, email: email, phone: phone,
          project: project || 'Not specified', message: message || 'No message',
        });
        await emailjs.send('service_a94ptrg', 'template_tb95gbc', {
          name: name, to_email: email, phone: phone,
          project: project || 'Not specified', message: message || 'No message',
        });
      } catch (emailErr) {
        console.warn('Email failed:', emailErr);
      }

      btn.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) success.classList.add('visible');
      ['fName','fPhone','fEmail','fProject','fMessage'].forEach(function(id) {
        var el = document.getElementById(id); if (el) el.value = '';
      });
    } else {
      btn.disabled = false;
      btn.innerHTML = 'Send Request <i class="fa-solid fa-paper-plane"></i>';
      alert('Failed to send. Please try again.');
    }
  } catch (err) {
    btn.disabled = false;
    btn.innerHTML = 'Send Request <i class="fa-solid fa-paper-plane"></i>';
    alert('Network error. Please check your connection and try again.');
  }
}

/* ══════════════════════════════════════════════════════
   UI INIT
══════════════════════════════════════════════════════ */
function initUI() {
  const navbar       = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', function() {
    if (navbar)       navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', function() {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(function(a) {
      a.addEventListener('click', function() {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  if (scrollTopBtn) scrollTopBtn.addEventListener('click', function() { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  window._counterObserver = new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) window._counterObserver.observe(statsBar);

  initFacilitySlider();

  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (prevBtn) prevBtn.addEventListener('click', function() { setTestimonial(_tCurrent - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { setTestimonial(_tCurrent + 1); });
  setInterval(function() { setTestimonial(_tCurrent + 1); }, 5000);

  const revealObs = new IntersectionObserver(function(entries, obs) {
    entries.forEach(function(e) { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  ['.split-layout', '.product-card', '.stat-block', '.gallery-item', '.ba-card',
   '.cert-item', '.testimonial-card', '.quote-form-wrapper', '.footer-col',
   '.footer-brand', '.legal-content', '#map-section .map-embed-wrapper', '#map-section .map-info-strip']
    .forEach(function(sel) {
      document.querySelectorAll(sel).forEach(function(el, i) {
        el.classList.add('reveal');
        el.style.transitionDelay = (i * 0.08) + 's';
        revealObs.observe(el);
      });
    });

  const navLinks = document.querySelectorAll('.nav-links a');
  new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var id = e.target.getAttribute('id');
        navLinks.forEach(function(link) { link.classList.toggle('active-link', link.getAttribute('href') === '#' + id); });
      }
    });
  }, { threshold: 0.4 }).observe(document.querySelectorAll('section[id]'));

  window.addEventListener('scroll', function() {
    var heroLeft = document.querySelector('.hero-left');
    if (heroLeft && window.scrollY < window.innerHeight) {
      heroLeft.style.transform = 'translateY(' + (window.scrollY * 0.15) + 'px)';
    }
  });
}

/* ──────────────────────────────────────────────────────
   FACILITY SLIDER
────────────────────────────────────────────────────── */
function initFacilitySlider() {
  const slider = document.getElementById('facilitySlider');
  if (!slider) return;
  const slides = slider.querySelectorAll('.facility-slide');
  if (!slides.length) return;
  const dotsContainer = document.getElementById('facilityDots');
  var current = 0;
  var autoplay;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach(function(_, i) {
      var dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', function() { goTo(i); });
      dotsContainer.appendChild(dot);
    });
  }

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slider.style.transform = 'translateX(-' + (current * 100) + '%)';
    if (dotsContainer) dotsContainer.querySelectorAll('.dot').forEach(function(d, i) { d.classList.toggle('active', i === current); });
  }

  const prevBtn = document.getElementById('facilityPrev');
  const nextBtn = document.getElementById('facilityNext');
  if (prevBtn) prevBtn.onclick = function() { goTo(current - 1); clearInterval(autoplay); autoplay = setInterval(function() { goTo(current + 1); }, 4000); };
  if (nextBtn) nextBtn.onclick = function() { goTo(current + 1); clearInterval(autoplay); autoplay = setInterval(function() { goTo(current + 1); }, 4000); };
  autoplay = setInterval(function() { goTo(current + 1); }, 4000);
}

/* ──────────────────────────────────────────────────────
   GALLERY LIGHTBOX
────────────────────────────────────────────────────── */
function openGalleryLightbox() {
  const lb   = document.getElementById('galleryLightbox');
  const grid = document.getElementById('lightboxGrid');
  if (!lb || !grid) return;
  grid.innerHTML = '';
  document.querySelectorAll('#galleryGrid .gallery-item').forEach(function(item) {
    var clone = document.createElement('div');
    clone.style.cssText = 'aspect-ratio:1;background:' + getComputedStyle(item).background + ';background-size:cover;background-position:center;cursor:pointer;transition:transform 0.2s';
    clone.addEventListener('mouseenter', function() { clone.style.transform = 'scale(1.02)'; });
    clone.addEventListener('mouseleave', function() { clone.style.transform = 'scale(1)'; });
    grid.appendChild(clone);
  });
  lb.style.display = 'block';
  document.body.style.overflow = 'hidden';
}

function closeGalleryLightbox() {
  const lb = document.getElementById('galleryLightbox');
  if (lb) lb.style.display = 'none';
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeGalleryLightbox(); });

/* ──────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────── */
function setText(id, val) {
  var el = document.getElementById(id);
  if (el) el.textContent = val;
}
function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ──────────────────────────────────────────────────────
   BOOT
────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', bootSite);
