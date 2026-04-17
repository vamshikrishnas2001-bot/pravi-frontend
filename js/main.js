/* ═══════════════════════════════════════════════════════
   PRAVI TECHNOLOGIES — FRONTEND
   All content loaded from MongoDB via Render backend API
   ═══════════════════════════════════════════════════════ */

const API = 'https://pravi-backend.onrender.com/api';

/* ──────────────────────────────────────────────────────
   BOOT — fetch all site data, apply, then init UI
────────────────────────────────────────────────────── */
async function bootSite() {
  try {
    const res = await fetch(`${API}/site`);
    const site = res.ok ? await res.json() : {};
    applyAll(site);
  } catch (e) {
    console.warn('Could not reach backend — running with defaults.', e);
    applyAll({});
  }
  initUI(); // always run UI init regardless
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
  if (d.metaDesc)     document.getElementById('siteDesc')?.setAttribute('content', d.metaDesc);
  if (d.keywords)     document.getElementById('siteKeys')?.setAttribute('content', d.keywords);
  if (d.color)        document.documentElement.style.setProperty('--accent', d.color);
  if (d.logo) {
    // Replace SVG logo with image if provided
    document.querySelectorAll('.pravi-logo svg').forEach(svg => {
      const img = document.createElement('img');
      img.src = d.logo; img.height = 38; img.alt = 'Logo';
      svg.replaceWith(img);
    });
  }
}

/* ──────────────────────────────────────────────────────
   HERO
────────────────────────────────────────────────────── */
function applyHero(d) {
  setText('heroEyebrow',    d.eyebrow       || 'Premium Lighting');
  setText('heroBtnPrimary', d.btnPrimary    || 'Explore Products');
  setText('heroBtnSecondary', d.btnSecondary || 'Get a Quote');
  setText('heroDesc',       d.description   || 'Transforming spaces with cutting-edge lighting design.');

  const title = document.getElementById('heroTitle');
  if (title) {
    title.innerHTML = `${d.titleLine1 || 'INNOVATIVE'}<br>${d.titleLine2 || 'LIGHTING'}<br><span id="heroTitleAccent">${d.titleLine3Accent || 'SOLUTIONS'}</span>`;
  }

  if (d.bgImage !== undefined) {
    const hero = document.getElementById('hero');
    if (hero) {
      if (d.bgImage) {
        hero.style.backgroundImage = `url(${d.bgImage})`;
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center';
      } else {
        hero.style.backgroundImage = '';
      }
    }
  } else if (d.bgImage) {
    const hero = document.getElementById('hero');
    if (hero) {
      hero.style.backgroundImage = `url(${d.bgImage})`;
      hero.style.backgroundSize = 'cover';
      hero.style.backgroundPosition = 'center';
    }
  }
}

/* ──────────────────────────────────────────────────────
   ABOUT
────────────────────────────────────────────────────── */
function applyAbout(d) {
  setText('aboutEyebrow', d.eyebrow || 'Why Choose Us');
  setText('aboutDesc',    d.description || '');

  const titleEl = document.getElementById('aboutTitle');
  if (titleEl) {
    titleEl.innerHTML = `${d.titleLine1 || 'ILLUMINATE'}<br><span id="aboutTitleAccent">${d.titleLine2Accent || 'YOUR SPACES'}</span>`;
  }

  if (d.features && d.features.length) {
    const iconMap = { 0: 'fa-bolt', 1: 'fa-palette', 2: 'fa-shield-halved', 3: 'fa-headset' };
    const grid = document.getElementById('featuresGrid');
    if (grid) {
      grid.innerHTML = d.features.map((f, i) => `
        <div class="feature-item">
          <i class="fa-solid ${f.icon || iconMap[i] || 'fa-star'}"></i>
          <div><h4>${esc(f.title)}</h4><p>${esc(f.desc)}</p></div>
        </div>`).join('');
    }
  }
}

/* ──────────────────────────────────────────────────────
   COUNTER ANIMATION (top-level so applyStats can call it)
────────────────────────────────────────────────────── */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  if (isNaN(target)) return;
  el.textContent = '0';
  const start = performance.now();
  const update = now => {
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
  const s1 = d.s1 || { num: 500, suffix: '+', label: 'Projects Done' };
  const s2 = d.s2 || { num: 50,  suffix: '+', label: 'Industry Partners' };
  const s3 = d.s3 || { num: 12,  suffix: 'yrs', label: 'In Business' };
  const s4 = d.s4 || { num: 80,  suffix: '%',  label: 'Client Retention' };

  // Hero stats
  const statP = document.getElementById('statProjects');
  const statPa = document.getElementById('statPartners');
  const statY  = document.getElementById('statYears');
  if (statP)  statP.dataset.target  = s1.num;
  if (statPa) statPa.dataset.target = s2.num;
  if (statY)  { statY.dataset.target = s3.num; setText('statYearsSuffix', s3.suffix); }
  setText('statProjectsLabel', s1.label);
  setText('statPartnersLabel', s2.label);
  setText('statYearsLabel',    s3.label);

  // Facility stats bar
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

  // Re-trigger counter animations now that data-target values are set
  setTimeout(() => {
    document.querySelectorAll('[data-target]').forEach(animateCounter);
  }, 300);
}

/* ──────────────────────────────────────────────────────
   CONTACT
────────────────────────────────────────────────────── */
function applyContact(d) {
  const phone   = d.phone   || '+91 98765 43210';
  const email   = d.email   || 'info@pravitechnologies.com';
  const address = d.address || 'No. 45, 2nd Floor, Hosur Road, Electronic City, Bengaluru – 560100';
  const hours   = d.hours   || 'Mon – Sat: 9:00 AM – 6:00 PM';

  setText('contactAddress', address);
  setText('contactPhone',   phone);
  setText('contactHours',   hours);
  setText('mapAddress',     address);
  setText('mapPhone',       phone);
  setText('mapHours',       hours);
  setText('footerPhone',    phone);

  const emailEl = document.getElementById('contactEmail');
  if (emailEl) { emailEl.textContent = email; emailEl.href = 'mailto:' + email; }
  const fEmailEl = document.getElementById('footerEmail');
  if (fEmailEl) { fEmailEl.textContent = email; fEmailEl.href = 'mailto:' + email; }

  // Social links
  const socials = { socialFb: d.facebook, socialIg: d.instagram, socialLi: d.linkedin, socialYt: d.youtube };
  Object.entries(socials).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el && url && url !== '#') { el.href = url; el.style.display = 'flex'; }
  });
  // Footer socials
  const fSocials = { footerFb: d.facebook, footerIg: d.instagram, footerLi: d.linkedin };
  Object.entries(fSocials).forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (el && url && url !== '#') el.href = url;
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
    container.innerHTML = `<iframe src="${d.embedUrl}" style="width:100%;height:${d.height || '420px'};border:none;display:block;filter:grayscale(0.3)" allowfullscreen loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
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
  // Re-fetch from site or use last known data
  fetch(`${API}/site/whatsapp`).then(r => r.json()).then(d => {
    const phone = (d.phone || '+919876543210').replace(/[^0-9]/g, '');
    const msg   = encodeURIComponent(d.message || "Hello Pravi Technologies! I'm interested in your lighting solutions.");
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }).catch(() => {
    window.open('https://wa.me/919876543210', '_blank');
  });
}

/* ──────────────────────────────────────────────────────
   CLIENTS MARQUEE
────────────────────────────────────────────────────── */
function applyClients(d) {
  const marquee = document.getElementById('clientsMarquee');
  if (!marquee || !d.items || !d.items.length) return;

  const items = d.items;

  // Ensure enough copies to always fill the screen with no gaps.
  // We need at least enough items so one full "set" is wider than viewport.
  // Minimum 3 sets, but if items are few we add more copies.
  const minSets = Math.max(3, Math.ceil(20 / items.length));
  // Build one "set" of HTML
  const setHTML = items.map(c => {
    if (c.displayAs === 'image' && c.logo)
      return `<div class="client-logo"><img src="${c.logo}" alt="${esc(c.name)}" loading="lazy"/></div>`;
    return `<div class="client-logo">${esc(c.name)}</div>`;
  }).join('');

  // Render minSets + 1 extra set (the +1 is the "reset" set for seamless loop)
  marquee.innerHTML = Array(minSets + 1).fill(setHTML).join('');

  // Wrap all items in two groups: [group A] [group B]
  // We animate group A out and reset — standard seamless marquee technique
  // Instead, use the CSS keyframe approach: animate exactly -(100% / (minSets+1))
  // so the reset is imperceptible.
  const pct = (100 / (minSets + 1)).toFixed(4);
  
  // Inject a scoped style for this specific animation
  let styleTag = document.getElementById('marquee-dynamic-style');
  if (!styleTag) {
    styleTag = document.createElement('style');
    styleTag.id = 'marquee-dynamic-style';
    document.head.appendChild(styleTag);
  }

  // Speed: base speed per item is ~3s, min 12s, max 40s total
  const speed = Math.min(40, Math.max(12, items.length * 3));

  styleTag.textContent = `
    @keyframes marquee-dynamic {
      from { transform: translateX(0); }
      to   { transform: translateX(-${pct}%); }
    }
    #clientsMarquee {
      animation: marquee-dynamic ${speed}s linear infinite !important;
    }
  `;
}

/* ──────────────────────────────────────────────────────
   TESTIMONIALS CAROUSEL
────────────────────────────────────────────────────── */
let _testimonials = [
  { stars: '★★★★★', text: '"Pravi Technologies transformed our office lighting completely."', initials: 'RK', name: 'Rajesh Kumar', role: 'Facilities Head, Infosys' },
  { stars: '★★★★★', text: '"Exceptional quality and service from Pravi Technologies."', initials: 'PS', name: 'Priya Sharma', role: 'GM Operations, Prestige Hotels' },
  { stars: '★★★★☆', text: '"Professional team, on-time delivery, highly recommended!"', initials: 'AM', name: 'Amit Mehta', role: 'Project Head, Brigade Group' },
];
let _tCurrent = 0;

function applyTestimonials(d) {
  if (d.items && d.items.length) _testimonials = d.items;
  buildTestiDots();
  setTestimonial(0);
}

function buildTestiDots() {
  const dotsEl = document.getElementById('testiDots');
  if (!dotsEl) return;
  dotsEl.innerHTML = '';
  _testimonials.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => setTestimonial(i));
    dotsEl.appendChild(dot);
  });
}

function setTestimonial(index) {
  _tCurrent = (index + _testimonials.length) % _testimonials.length;
  const t    = _testimonials[_tCurrent];
  const card = document.getElementById('tCard');
  if (!card) return;
  card.style.opacity = '0'; card.style.transform = 'translateY(10px)';
  setTimeout(() => {
    card.innerHTML = `
      <div class="stars">${t.stars || '★★★★★'}</div>
      <p class="testi-text">${esc(t.text)}</p>
      <div class="testi-author">
        <div class="author-avatar">${esc(t.initials || t.name?.slice(0,2) || 'AB')}</div>
        <div><h4>${esc(t.name)}</h4><p>${esc(t.role)}</p></div>
      </div>`;
    card.style.transition = 'opacity 0.4s, transform 0.4s';
    card.style.opacity = '1'; card.style.transform = 'translateY(0)';
    document.querySelectorAll('#testiDots .dot').forEach((d, i) => d.classList.toggle('active', i === _tCurrent));
  }, 200);
}

/* ──────────────────────────────────────────────────────
   PRODUCTS
────────────────────────────────────────────────────── */
function applyProducts(d) {
  if (!d.items || !d.items.length) return;
  const grid = document.getElementById('productsGrid');
  if (!grid) return;

  grid.innerHTML = d.items.map(p => `
    <div class="product-card" data-category="${esc(p.category || '').toLowerCase()}">
      <div class="product-img">
        ${p.image ? `<img src="${p.image}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : ''}
      </div>
      <div class="product-info">
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.category)}</p>
        <a href="${esc(p.link || '#quote')}" class="product-link">Enquire <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('');
}

/* ──────────────────────────────────────────────────────
   FACILITY SLIDER
────────────────────────────────────────────────────── */
function applyFacility(d) {
  if (!d.images || !d.images.length) return;
  const slider = document.getElementById('facilitySlider');
  if (!slider) return;

  slider.innerHTML = d.images.map(src =>
    `<div class="facility-slide">
      <img src="${src}" loading="lazy" style="width:100%;height:100%;object-fit:cover">
    </div>`
  ).join('');

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

  grid.innerHTML = d.images.map((item, i) => {
    const src = item.src || item;
    const cat = item.category || 'all';
    const cls = sizeClasses[i % sizeClasses.length];

    return `
    <div class="gallery-item ${cls}" data-cat="${esc(cat)}">
      <img src="${src}" loading="lazy" style="width:100%;height:100%;object-fit:cover">
    </div>`;
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

  d.pairs.forEach((pair, i) => {
    const div = document.createElement('div');
    div.className = 'ba-set';

    div.innerHTML = `
      <p class="ba-set-title">Project ${i + 1}</p>
      <div class="ba-grid">
        <div class="ba-card">
          <div class="ba-img before">
            ${pair.before ? `<img src="${pair.before}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : ''}
          </div>
          <div class="ba-label">Before</div>
        </div>

        <div class="ba-arrow"><i class="fa-solid fa-arrow-right"></i></div>

        <div class="ba-card">
          <div class="ba-img after">
            ${pair.after ? `<img src="${pair.after}" loading="lazy" style="width:100%;height:100%;object-fit:cover">` : ''}
          </div>
          <div class="ba-label teal">After</div>
        </div>
      </div>
    `;

    container.appendChild(div);
  });
}
/* ══════════════════════════════════════════════════════
   QUOTE FORM — sends lead to backend
══════════════════════════════════════════════════════ */
async function submitForm() {
  const name    = document.getElementById('fName')?.value.trim();
  const phone   = document.getElementById('fPhone')?.value.trim();
  const email   = document.getElementById('fEmail')?.value.trim();
  const project = document.getElementById('fProject')?.value;
  const message = document.getElementById('fMessage')?.value.trim();

  if (!name || !phone || !email) { alert('Please fill in all required fields.'); return; }
  if (!email.includes('@'))       { alert('Please enter a valid email address.'); return; }

  const btn = document.getElementById('submitBtn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

  try {
    // 1. Save lead to backend
    const res = await fetch(`${API}/leads`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ name, phone, email, project, message }),
    });

    if (res.ok) {
      // 2. Send emails via EmailJS
      try {
        // Admin notification
        await emailjs.send('service_a94ptrg', 'template_slycisr', {
          name:    name,
          email:   email,
          phone:   phone,
          project: project || 'Not specified',
          message: message || 'No message',
        });

        // User thank-you
        await emailjs.send('service_a94ptrg', 'template_tb95gbc', {
          name:     name,
          to_email: email,
          phone:    phone,
          project:  project || 'Not specified',
          message:  message || 'No message',
        });
      } catch (emailErr) {
        console.warn('Email failed:', emailErr);
      }

      // 3. Show success
      btn.style.display = 'none';
      const success = document.getElementById('formSuccess');
      if (success) success.classList.add('visible');
      ['fName','fPhone','fEmail','fProject','fMessage'].forEach(id => {
        const el = document.getElementById(id); if (el) el.value = '';
      });

    } else {
      btn.disabled = false;
      btn.innerHTML = 'Send Request <i class="fa-solid fa-paper-plane"></i>';
      alert('Failed to send. Please try again.');
    }

  } catch {
    btn.disabled = false;
    btn.innerHTML = 'Send Request <i class="fa-solid fa-paper-plane"></i>';
    alert('Network error. Please check your connection and try again.');
  }
}

/* ══════════════════════════════════════════════════════
   UI INIT — navbar, slider, counters, scroll, etc.
══════════════════════════════════════════════════════ */
function initUI() {
  /* Navbar scroll */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  /* Hamburger */
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* Scroll to top */
  if (scrollTopBtn) scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* Counter animation — uses top-level animateCounter() */
  window._counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('[data-target]').forEach(animateCounter);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  const statsBar = document.querySelector('.stats-bar');
  if (statsBar) window._counterObserver.observe(statsBar);

  /* Facility slider */
  initFacilitySlider();

  /* Testimonials auto-rotate */
  const prevBtn = document.getElementById('testiPrev');
  const nextBtn = document.getElementById('testiNext');
  if (prevBtn) prevBtn.addEventListener('click', () => setTestimonial(_tCurrent - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setTestimonial(_tCurrent + 1));
  setInterval(() => setTestimonial(_tCurrent + 1), 5000);

  /* Scroll reveal */
  const revealObs = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  ['.split-layout', '.product-card', '.stat-block', '.gallery-item', '.ba-card',
   '.cert-item', '.testimonial-card', '.quote-form-wrapper', '.footer-col',
   '.footer-brand', '.legal-content', '#map-section .map-embed-wrapper', '#map-section .map-info-strip']
    .forEach(sel => document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
      revealObs.observe(el);
    }));

  /* Active nav on scroll */
  const navLinks = document.querySelectorAll('.nav-links a');
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(link => link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.4 }).observe(document.querySelectorAll('section[id]'));

  /* Hero parallax */
  window.addEventListener('scroll', () => {
    const heroLeft = document.querySelector('.hero-left');
    if (heroLeft && window.scrollY < window.innerHeight) {
      heroLeft.style.transform = `translateY(${window.scrollY * 0.15}px)`;
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
  let current = 0;
  let autoplay;

  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, i) => {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });
  }

  const goTo = index => {
    current = (index + slides.length) % slides.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    if (dotsContainer) dotsContainer.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('active', i === current));
  };

  const prevBtn = document.getElementById('facilityPrev');
  const nextBtn = document.getElementById('facilityNext');
  if (prevBtn) prevBtn.onclick = () => { goTo(current - 1); clearInterval(autoplay); autoplay = setInterval(() => goTo(current + 1), 4000); };
  if (nextBtn) nextBtn.onclick = () => { goTo(current + 1); clearInterval(autoplay); autoplay = setInterval(() => goTo(current + 1), 4000); };
  autoplay = setInterval(() => goTo(current + 1), 4000);
}

/* ──────────────────────────────────────────────────────
   GALLERY LIGHTBOX
────────────────────────────────────────────────────── */
function openGalleryLightbox() {
  const lb   = document.getElementById('galleryLightbox');
  const grid = document.getElementById('lightboxGrid');
  if (!lb || !grid) return;

  grid.innerHTML = '';

  document.querySelectorAll('#galleryGrid .gallery-item img').forEach(img => {

    const clone = document.createElement('img');
    clone.src = img.src;
    clone.loading = "lazy";

    clone.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      aspect-ratio: 1;
      cursor: pointer;
      transition: transform 0.2s;
    `;

    clone.addEventListener('mouseenter', () => {
      clone.style.transform = 'scale(1.02)';
    });

    clone.addEventListener('mouseleave', () => {
      clone.style.transform = 'scale(1)';
    });

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

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeGalleryLightbox(); });

/* ──────────────────────────────────────────────────────
   UTILITIES
────────────────────────────────────────────────────── */
function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}
function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/* ──────────────────────────────────────────────────────
   BOOT
────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', bootSite);

// 🔥 PREMIUM PAGE LOADER
document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {

    const href = this.getAttribute('href');

    if (!href || href.startsWith('#')) return;

    e.preventDefault();

    const loader = document.getElementById('pageLoader');
    loader.classList.add('active');
    document.body.classList.add('loading');

    setTimeout(() => {
      window.location.href = href;
    }, 2000);
  });
});
// ✅ PAGE LOAD LOADER (FINAL FIX)
window.addEventListener("load", function () {
  const loader = document.getElementById("pageLoader");

  if (!loader) return;

  setTimeout(() => {
    loader.style.opacity = "0";

    setTimeout(() => {
      loader.style.display = "none";
    }, 400);

  }, 2000);
});
document.querySelectorAll('.social-links a').forEach(link => {
  link.setAttribute('target', '_blank');
  link.setAttribute('rel', 'noopener noreferrer');
});
