/* ==================================================
     ADMIN DATA — this object is what the admin panel
     saves to. On a real backend, this would be fetched
     from the server (JSON API / localStorage for demo).
  ================================================== */
  const SITE_DATA = {
    branding: {
      companyName: 'PRAVI',
      tagline: 'Technologies',
      footerTagline: 'Innovative lighting solutions trusted across India since 2012. Your space, brilliantly lit.'
    },
    hero: {
      eyebrow: 'Premium Lighting',
      titleLine1: 'INNOVATIVE',
      titleLine2: 'LIGHTING',
      titleLine3Accent: 'SOLUTIONS',
      description: 'Transforming spaces with cutting-edge lighting design. From architectural to decorative — we illuminate your world.',
      btnPrimary: 'Explore Products',
      btnSecondary: 'Get a Quote',
      bgImage: null
    },
    stats: {
      s1: { num: 500, suffix: '+', label: 'Projects Done' },
      s2: { num: 50,  suffix: '+', label: 'Industry Partners' },
      s3: { num: 12,  suffix: 'yrs', label: 'In Business' },
      s4: { num: 80,  suffix: '%', label: 'Client Retention' },
    },
    contact: {
      phone: '+91 98765 43210',
      email: 'info@pravitechnologies.com',
      address: 'No. 45, 2nd Floor, Hosur Road, Electronic City, Bengaluru – 560100',
      hours: 'Mon – Sat: 9:00 AM – 6:00 PM',
      facebook: '#', instagram: '#', linkedin: '#', youtube: '#'
    },
    map: {
      embedUrl: '',
      embedCode: '',
      show: true,
      height: '420px'
    },
    whatsapp: {
      enabled: true,
      phone: '+919876543210',
      message: "Hello Pravi Technologies! I'm interested in your lighting solutions. Could you please share more details?",
      tooltip: 'Chat with us on WhatsApp!',
      position: 'bottom-right'
    },
    testimonials: [
      { stars: '★★★★★', text: '"Pravi Technologies transformed our office lighting completely. The custom LED solutions boosted productivity and the team\'s morale noticeably improved."', initials: 'RK', name: 'Rajesh Kumar', role: 'Facilities Head, Infosys' },
      { stars: '★★★★★', text: '"Exceptional quality and service from Pravi Technologies. Our hotel lobby looks stunning with the custom lighting designs they created for us."', initials: 'PS', name: 'Priya Sharma', role: 'GM Operations, Prestige Hotels' },
      { stars: '★★★★☆', text: '"Professional team, on-time delivery, and the LED systems have cut our electricity bills significantly. Pravi Technologies is highly recommended!"', initials: 'AM', name: 'Amit Mehta', role: 'Project Head, Brigade Group' }
    ],
    clients: [
      { name: 'INFOSYS', logo: null },
      { name: 'WIPRO', logo: null },
      { name: 'TATA GROUP', logo: null },
      { name: 'PRESTIGE', logo: null },
      { name: 'BRIGADE', logo: null },
      { name: 'SOBHA', logo: null },
      { name: 'L&T', logo: null },
      { name: 'GODREJ', logo: null }
    ]
  };

  /* ==================================================
     APPLY DATA TO PAGE
  ================================================== */
  function applyData() {
    const d = SITE_DATA;

    // Branding
    document.getElementById('brandName').textContent = d.branding.companyName;
    document.getElementById('footerBrandName').textContent = d.branding.companyName;
    document.getElementById('brandSub').textContent = d.branding.tagline;
    document.getElementById('footerTagline').textContent = d.branding.footerTagline;

    // Hero
    document.getElementById('heroEyebrow').textContent = d.hero.eyebrow;
    document.getElementById('heroTitle').innerHTML = `${d.hero.titleLine1}<br>${d.hero.titleLine2}<br><span id="heroTitleAccent">${d.hero.titleLine3Accent}</span>`;
    document.getElementById('heroDesc').textContent = d.hero.description;
    document.getElementById('heroBtnPrimary').textContent = d.hero.btnPrimary;
    document.getElementById('heroBtnSecondary').textContent = d.hero.btnSecondary;
    if (d.hero.bgImage) {
      document.getElementById('hero').style.backgroundImage = `url(${d.hero.bgImage})`;
      document.getElementById('hero').style.backgroundSize = 'cover';
      document.getElementById('hero').style.backgroundPosition = 'center';
    }

    // Stats
    applyStats();

    // Contact
    const c = d.contact;
    document.getElementById('contactAddress').textContent = c.address;
    document.getElementById('contactPhone').textContent = c.phone;
    document.getElementById('contactEmail').textContent = c.email;
    document.getElementById('contactEmail').href = 'mailto:' + c.email;
    document.getElementById('contactHours').textContent = c.hours;
    document.getElementById('footerPhone').textContent = c.phone;
    document.getElementById('footerEmail').textContent = c.email;
    document.getElementById('footerEmail').href = 'mailto:' + c.email;
    document.getElementById('mapAddress').textContent = c.address;
    document.getElementById('mapPhone').textContent = c.phone;
    document.getElementById('mapHours').textContent = c.hours;
    if (c.facebook !== '#') document.getElementById('socialFb').href = c.facebook;
    if (c.instagram !== '#') document.getElementById('socialIg').href = c.instagram;
    if (c.linkedin !== '#') document.getElementById('socialLi').href = c.linkedin;
    if (c.youtube !== '#') document.getElementById('socialYt').href = c.youtube;

    // Map
    applyMap();

    // WhatsApp
    applyWhatsApp();

    // Clients marquee
    applyClients();
  }

  function applyStats() {
    const s = SITE_DATA.stats;
    // Hero stats use data-target via counter animation already
    // Update stats bar labels & suffixes from data
    document.getElementById('sb1s').textContent = s.s1.suffix;
    document.getElementById('sb1l').textContent = s.s1.label;
    document.getElementById('sb2s').textContent = s.s2.suffix;
    document.getElementById('sb2l').textContent = s.s2.label;
    document.getElementById('sb3s').textContent = s.s3.suffix;
    document.getElementById('sb3l').textContent = s.s3.label;
    document.getElementById('sb4s').textContent = s.s4.suffix;
    document.getElementById('sb4l').textContent = s.s4.label;
    // Update data-target values
    document.getElementById('sb1').dataset.target = s.s1.num;
    document.getElementById('sb2').dataset.target = s.s2.num;
    document.getElementById('sb3').dataset.target = s.s3.num;
    document.getElementById('sb4').dataset.target = s.s4.num;
  }

  function applyMap() {
    const m = SITE_DATA.map;
    if (!m.show) {
      document.getElementById('map-section').style.display = 'none';
      return;
    }
    if (m.embedCode) {
      // Paste raw iframe code
      document.getElementById('mapPlaceholder').style.display = 'none';
      const c = document.getElementById('mapIframeContainer');
      c.style.display = 'block';
      c.innerHTML = m.embedCode;
      const iframe = c.querySelector('iframe');
      if (iframe) {
        iframe.style.width = '100%';
        iframe.style.height = m.height || '420px';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        iframe.style.filter = 'grayscale(0.3)';
      }
    } else if (m.embedUrl) {
      document.getElementById('mapPlaceholder').style.display = 'none';
      const c = document.getElementById('mapIframeContainer');
      c.style.display = 'block';
      c.innerHTML = `<iframe src="${m.embedUrl}" style="width:100%;height:${m.height||'420px'};border:none;display:block;filter:grayscale(0.3)" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
    }
  }

  function applyWhatsApp() {
    const w = SITE_DATA.whatsapp;
    const floatEl = document.getElementById('wa-float');
    if (!w.enabled) { floatEl.style.display = 'none'; return; }
    floatEl.style.display = 'flex';
    if (w.position === 'bottom-left') floatEl.classList.add('wa-left');
    document.getElementById('wa-tooltip-bubble').textContent = w.tooltip;
  }

  function openWhatsApp() {
    const w = SITE_DATA.whatsapp;
    const phone = w.phone.replace(/[^0-9]/g, '');
    const msg = encodeURIComponent(w.message);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  }

  function applyClients() {
    const clients = SITE_DATA.clients;
    const marquee = document.getElementById('clientsMarquee');
    if (!clients || clients.length === 0) return;
    // Build marquee (doubled for infinite)
    let html = '';
    const all = [...clients, ...clients];
    all.forEach(cl => {
      if (cl.logo) {
        html += `<div class="client-logo"><img src="${cl.logo}" alt="${cl.name}"/></div>`;
      } else {
        html += `<div class="client-logo">${cl.name}</div>`;
      }
    });
    marquee.innerHTML = html;
  }

  /* ==================================================
     NAVBAR SCROLL
  ================================================== */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);
  });

  /* ==================================================
     HAMBURGER MENU
  ================================================== */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
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

  /* ==================================================
     SCROLL TO TOP
  ================================================== */
  document.getElementById('scrollTop').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ==================================================
     COUNTER ANIMATION
  ================================================== */
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.target);
    if (isNaN(target)) return;
    const duration = 1800;
    const start = performance.now();
    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target;
    };
    requestAnimationFrame(update);
  };

  const countersObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('[data-target]').forEach(animateCounter);
        countersObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hero-stats, .stats-bar').forEach(el => {
    countersObserver.observe(el);
  });

  /* ==================================================
     SCROLL REVEAL
  ================================================== */
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  const revealSelectors = [
    '#about .split-layout', '.product-card', '.stat-block',
    '.gallery-item', '.ba-card', '.cert-item', '.testimonial-card',
    '.quote-form-wrapper', '.footer-col', '.footer-brand', '.legal-content',
    '#map-section .map-embed-wrapper', '#map-section .map-info-strip',
  ];
  revealSelectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${i * 0.08}s`;
      revealObserver.observe(el);
    });
  });

  /* ==================================================
     FACILITY SLIDER
  ================================================== */
  const slider = document.getElementById('facilitySlider');
  const slides = slider.querySelectorAll('.facility-slide');
  const dotsContainer = document.getElementById('facilityDots');
  let current = 0;
  let autoplay;

  slides.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  const goTo = (index) => {
    current = (index + slides.length) % slides.length;
    slider.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  };

  document.getElementById('facilityPrev').addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  document.getElementById('facilityNext').addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });

  const startAutoplay = () => { autoplay = setInterval(() => goTo(current + 1), 4000); };
  const resetAutoplay = () => { clearInterval(autoplay); startAutoplay(); };
  startAutoplay();

  /* ==================================================
     GALLERY LIGHTBOX
  ================================================== */
  // no filter buttons needed

  /* ==================================================
     TESTIMONIALS CAROUSEL (driven by SITE_DATA)
  ================================================== */
  const card = document.getElementById('tCard');
  const testiDotsEl = document.getElementById('testiDots');
  let tCurrent = 0;

  function buildTestiDots() {
    testiDotsEl.innerHTML = '';
    SITE_DATA.testimonials.forEach((_, i) => {
      const d = document.createElement('div');
      d.className = 'dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => setTestimonial(i));
      testiDotsEl.appendChild(d);
    });
  }

  const setTestimonial = (index) => {
    const testimonials = SITE_DATA.testimonials;
    tCurrent = (index + testimonials.length) % testimonials.length;
    const t = testimonials[tCurrent];
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    setTimeout(() => {
      card.innerHTML = `
        <div class="stars">${t.stars}</div>
        <p class="testi-text">${t.text}</p>
        <div class="testi-author">
          <div class="author-avatar">${t.initials}</div>
          <div><h4>${t.name}</h4><p>${t.role}</p></div>
        </div>`;
      card.style.transition = 'opacity 0.4s, transform 0.4s';
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
      testiDotsEl.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === tCurrent);
      });
    }, 200);
  };

  document.getElementById('testiPrev').addEventListener('click', () => setTestimonial(tCurrent - 1));
  document.getElementById('testiNext').addEventListener('click', () => setTestimonial(tCurrent + 1));
  setInterval(() => setTestimonial(tCurrent + 1), 5000);

  /* ==================================================
     ACTIVE NAV LINK ON SCROLL
  ================================================== */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active-link', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => activeObserver.observe(s));

  /* ==================================================
     HERO PARALLAX
  ================================================== */
  window.addEventListener('scroll', () => {
    const hero = document.getElementById('hero');
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      const heroLeft = hero.querySelector('.hero-left');
      if (heroLeft) heroLeft.style.transform = `translateY(${scrolled * 0.15}px)`;
    }
  });

  /* ==================================================
     FORM SUBMIT — stores lead to localStorage
  ================================================== */
  function submitForm() {
    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const email = document.getElementById('fEmail').value.trim();
    const project = document.getElementById('fProject').value;
    const message = document.getElementById('fMessage').value.trim();
    if (!name || !phone || !email) { alert('Please fill in all required fields.'); return; }
    if (!email.includes('@')) { alert('Please enter a valid email address.'); return; }
    const btn = document.getElementById('submitBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

    // Save lead to localStorage
    const leads = JSON.parse(localStorage.getItem('pravi_leads') || '[]');
    leads.unshift({
      id: Date.now(),
      name, phone, email, project, message,
      date: new Date().toLocaleString('en-IN'),
      status: 'New'
    });
    localStorage.setItem('pravi_leads', JSON.stringify(leads));

    setTimeout(() => {
      btn.style.display = 'none';
      document.getElementById('formSuccess').classList.add('visible');
      ['fName','fPhone','fEmail','fProject','fMessage'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 1500);
  }

/* ==================================================
   GALLERY LIGHTBOX OPEN / CLOSE
================================================== */
function openGalleryLightbox() {
  const lb = document.getElementById('galleryLightbox');
  const grid = document.getElementById('lightboxGrid');
  // Clone all gallery items into lightbox grid
  grid.innerHTML = '';
  document.querySelectorAll('#galleryGrid .gallery-item').forEach(item => {
    const clone = document.createElement('div');
    clone.style.cssText = `
      aspect-ratio:1;
      background:${getComputedStyle(item).background};
      background-size:cover;
      background-position:center;
      cursor:pointer;
      transition:transform 0.2s;
    `;
    // Copy computed background
    clone.style.background = getComputedStyle(item).background;
    clone.addEventListener('mouseenter', () => clone.style.transform = 'scale(1.02)');
    clone.addEventListener('mouseleave', () => clone.style.transform = 'scale(1)');
    grid.appendChild(clone);
  });
  lb.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeGalleryLightbox() {
  document.getElementById('galleryLightbox').style.display = 'none';
  document.body.style.overflow = '';
}
// Close on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeGalleryLightbox();
});
