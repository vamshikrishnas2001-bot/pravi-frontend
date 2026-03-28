/* ═══════════════════════════════════════════════════════
   PRAVI ADMIN PANEL — FULL BACKEND INTEGRATION
   Every panel → reads from & saves to MongoDB via Render
   ═══════════════════════════════════════════════════════ */

const API = 'https://pravi-backend.onrender.com/api';

/* ─── Auth ─── */
const getToken = () => localStorage.getItem('token');
const authHeaders = () => ({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + getToken() });
function checkAuth() {
  if (!getToken()) { window.location.href = 'admin-login.html'; return false; }
  return true;
}

/* ─── Protect page on load ─── */
(async function protectPage() {
  const token = getToken();
  if (!token) {
    window.location.replace('admin-login.html');
    return;
  }
  try {
    const res = await fetch(API + '/auth/verify', {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    if (!res.ok) {
      localStorage.removeItem('token');
      window.location.replace('admin-login.html');
      return;
    }
  } catch (e) {
    console.warn('Could not verify token with server');
  }
  // ✅ Token is valid — show the page
  document.body.style.visibility = 'visible';
})();

/* ─── Toast ─── */
function showToast(msg, isErr = false) {
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.querySelector('i').style.color = isErr ? '#ff5757' : '#00c9a7';
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

/* ─── Loading state ─── */
function setLoading(btnEl, loading) {
  if (!btnEl) return;
  if (loading) { btnEl._orig = btnEl.innerHTML; btnEl.disabled = true; btnEl.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving…'; }
  else { btnEl.disabled = false; btnEl.innerHTML = btnEl._orig || btnEl.innerHTML; }
}

/* ─── Panel navigation ─── */
function showPanel(id, el) {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const panel = document.getElementById('panel-' + id);
  if (panel) panel.classList.add('active');
  if (el) el.classList.add('active');
  const titles = {
    dashboard: 'DASHBOARD', leads: 'LEADS & QUOTE REQUESTS', branding: 'BRANDING & SEO',
    hero: 'HERO SECTION', about: 'ABOUT SECTION', products: 'PRODUCTS',
    facility: 'FACILITY IMAGES', gallery: 'PROJECT GALLERY',
    'before-after': 'BEFORE & AFTER', clients: 'CLIENTS', testimonials: 'TESTIMONIALS',
    stats: 'STATS NUMBERS', map: 'MAP & LOCATION', contact: 'CONTACT INFO', whatsapp: 'WHATSAPP WIDGET'
  };
  document.getElementById('topbarTitle').textContent = titles[id] || id.toUpperCase();
  if (window.innerWidth <= 800) document.getElementById('sidebar').classList.remove('open');
  if (id === 'leads') renderLeads();
  if (id === 'dashboard') loadDashboard();
  if (id === 'branding')  loadSection('branding',  applyBranding);
  if (id === 'hero')      loadSection('hero',       applyHero);
  if (id === 'about')     loadSection('about',      applyAbout);
  if (id === 'contact')   loadSection('contact',    applyContact);
  if (id === 'stats')     loadSection('stats',      applyStats);
  if (id === 'whatsapp')  loadSection('whatsapp',   applyWhatsApp);
  if (id === 'map')       loadSection('map',        applyMapPanel);
  if (id === 'products')  loadSection('products',   applyProducts);
  if (id === 'clients')   loadSection('clients',    applyClients);
  if (id === 'testimonials') loadSection('testimonials', applyTestimonials);
  if (id === 'facility')  loadSection('facility',   applyFacility);
  if (id === 'gallery')   loadSection('gallery',    applyGallery);
  if (id === 'before-after') loadSection('beforeafter', applyBeforeAfter);
}
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('open'); }

/* ─── Modal helpers ─── */
function openModal(name) { document.getElementById('modal-' + name).classList.add('open'); }
function closeModal(name) { document.getElementById('modal-' + name).classList.remove('open'); }
/* modal-bg listeners added in init() */

/* ─── Remove items (UI) ─── */
function removeItem(el) {
  const item = el.closest('.list-item') || el;
  item.style.transition = 'all 0.2s';
  item.style.opacity = '0';
  item.style.transform = 'scale(0.95)';
  setTimeout(() => item.remove(), 200);
}

/* ─── Generic section loader ─── */
async function loadSection(section, applyFn) {
  try {
    const res = await fetch(`${API}/site/${section}`);
    if (res.ok) { const data = await res.json(); applyFn(data); }
  } catch (e) { console.warn('Load section failed:', section, e); }
}

/* ─── Generic section saver ─── */
async function saveSection(section, data, btn) {
  if (!checkAuth()) return false;
  setLoading(btn, true);
  try {
    const res = await fetch(`${API}/site/${section}`, {
      method: 'PUT', headers: authHeaders(), body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error();
    showToast('Saved successfully!');
    return true;
  } catch {
    showToast('Save failed — check connection.', true);
    return false;
  } finally {
    setLoading(btn, false);
  }
}

/* ─── Image upload helper (base64 → backend) ─── */
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = e => resolve(e.target.result);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}
async function uploadImage(file, section, key) {
  try {
    const image = await toBase64(file);
    const res = await fetch(`${API}/images/upload`, {
      method: 'POST', headers: authHeaders(),
      body: JSON.stringify({ section, key, image })
    });
    const data = await res.json();
    return data.url;
  } catch { return null; }
}

/* ──────────────────────────────────────────────────────
   PUBLISH
────────────────────────────────────────────────────── */
async function publishAll() {
  if (!checkAuth()) return;
  const btn = document.querySelector('.btn-publish');
  setLoading(btn, true);
  try {
    await fetch(`${API}/site/publish`, { method: 'POST', headers: authHeaders() });
    showToast('🚀 Site published! Live changes applied.');
  } catch { showToast('Publish failed.', true); }
  finally { setLoading(btn, false); }
}

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */
async function loadDashboard() {
  if (!checkAuth()) return;
  try {
    const [leadsRes, statsRes] = await Promise.all([
      fetch(`${API}/leads/stats`, { headers: authHeaders() }),
      fetch(`${API}/site`)
    ]);
    if (leadsRes.status === 401) { window.location.href = 'admin-login.html'; return; }

    if (leadsRes.ok) {
      const s = await leadsRes.json();
      const el = document.getElementById('dashLeadCount');
      if (el) el.textContent = s.total || 0;
    }
    if (statsRes.ok) {
      const site = await statsRes.json();
      const statP = document.getElementById('statProducts');
      const statG = document.getElementById('statGallery');
      if (statP && site.products) statP.textContent = (site.products.items || []).length;
      if (statG && site.gallery)  statG.textContent = (site.gallery.images || []).length;
    }
  } catch (e) { console.error('Dashboard:', e); }
}

/* ══════════════════════════════════════════════════════
   LEADS
══════════════════════════════════════════════════════ */
async function fetchLeads() {
  if (!checkAuth()) return [];
  const res = await fetch(`${API}/leads`, { headers: authHeaders() });
  if (res.status === 401) { window.location.href = 'admin-login.html'; return []; }
  const data = await res.json();
  // ✅ backend returns { leads, total, newCount }
  return Array.isArray(data) ? data : (data.leads || []);
}

function esc(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

async function renderLeads() {
  const tbody = document.getElementById('leadsTableBody');
  const empty = document.getElementById('leadsEmpty');
  if (!tbody) return;
  tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--muted)"><i class="fa-solid fa-spinner fa-spin"></i> Loading...</td></tr>`;

  try {
    const leads = await fetchLeads();
    const search  = (document.getElementById('leadsSearch') || {}).value || '';
    const statusF = (document.getElementById('leadsStatusFilter') || {}).value || '';

    let filtered = leads.filter(l => {
      const s = search.toLowerCase();
      const matchSearch = !s || (l.name || '').toLowerCase().includes(s) || (l.email || '').toLowerCase().includes(s) || (l.phone || '').includes(s);
      const matchStatus = !statusF || l.status === statusF;
      return matchSearch && matchStatus;
    });

    /* Update counts */
    const newCount = leads.filter(l => l.status === 'New').length;
    const countEl = document.getElementById('leadsCount');
    if (countEl) countEl.textContent = `(${leads.length} total, ${newCount} new)`;
    const badge = document.getElementById('leadsNavBadge');
    if (badge) { badge.textContent = leads.length; badge.style.display = leads.length ? 'inline' : 'none'; }
    const dash = document.getElementById('dashLeadCount');
    if (dash) dash.textContent = leads.length;

    if (!filtered.length) {
      tbody.innerHTML = '';
      if (empty) empty.style.display = 'block';
      return;
    }
    if (empty) empty.style.display = 'none';

    const cls = { New: 'new', Contacted: 'contacted', Closed: 'closed' };
    tbody.innerHTML = filtered.map((l, i) => `
      <tr>
        <td style="color:var(--muted)">${i + 1}</td>
        <td style="font-size:11px;color:var(--muted);white-space:nowrap">${esc(new Date(l.createdAt).toLocaleString('en-IN'))}</td>
        <td style="font-weight:500">${esc(l.name)}</td>
        <td>${esc(l.phone)}</td>
        <td style="color:var(--teal)">${esc(l.email)}</td>
        <td style="color:var(--muted)">${esc(l.project || '—')}</td>
        <td title="${esc(l.message)}" style="color:var(--muted);font-size:12px">${esc((l.message || '').substring(0, 40))}${(l.message || '').length > 40 ? '…' : ''}</td>
        <td><span class="lead-status ${cls[l.status] || 'new'}">${esc(l.status || 'New')}</span></td>
        <td>
          <div style="display:flex;gap:5px">
            <button class="icon-btn" onclick="editLead('${l._id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn del" onclick="deleteLead('${l._id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');
  } catch (e) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:30px;color:var(--danger)"><i class="fa-solid fa-triangle-exclamation"></i> Failed to load leads.</td></tr>`;
  }
}

function filterLeads() { renderLeads(); }

async function editLead(id) {
  try {
    const res = await fetch(`${API}/leads/${id}`, { headers: authHeaders() });
    const l = await res.json();
    document.getElementById('editLeadId').value    = l._id;
    document.getElementById('editLeadName').value  = l.name || '';
    document.getElementById('editLeadPhone').value = l.phone || '';
    document.getElementById('editLeadEmail').value = l.email || '';
    document.getElementById('editLeadProject').value = l.project || '';
    document.getElementById('editLeadMessage').value = l.message || '';
    document.getElementById('editLeadStatus').value  = l.status || 'New';
    openModal('lead');
  } catch { showToast('Could not load lead.', true); }
}

async function saveLeadEdit() {
  const id  = document.getElementById('editLeadId').value;
  const btn = document.querySelector('#modal-lead .btn-save');
  const body = {
    name:    document.getElementById('editLeadName').value,
    phone:   document.getElementById('editLeadPhone').value,
    email:   document.getElementById('editLeadEmail').value,
    project: document.getElementById('editLeadProject').value,
    message: document.getElementById('editLeadMessage').value,
    status:  document.getElementById('editLeadStatus').value,
  };
  setLoading(btn, true);
  try {
    const res = await fetch(`${API}/leads/${id}`, { method: 'PUT', headers: authHeaders(), body: JSON.stringify(body) });
    if (!res.ok) throw new Error();
    closeModal('lead');
    renderLeads();
    showToast('Lead updated!');
  } catch { showToast('Update failed.', true); }
  finally { setLoading(btn, false); }
}

async function deleteLead(id) {
  if (!confirm('Delete this lead? This cannot be undone.')) return;
  try {
    await fetch(`${API}/leads/${id}`, { method: 'DELETE', headers: authHeaders() });
    renderLeads();
    showToast('Lead deleted.');
  } catch { showToast('Delete failed.', true); }
}

async function clearAllLeads() {
  if (!confirm('Delete ALL leads? This cannot be undone.')) return;
  try {
    await fetch(`${API}/leads/all`, { method: 'DELETE', headers: authHeaders() });
    renderLeads();
    showToast('All leads cleared.');
  } catch { showToast('Failed to clear.', true); }
}

async function downloadLeadsCSV() {
  try {
    const leads = await fetchLeads();
    if (!leads.length) { showToast('No leads to export.'); return; }
    const headers = ['#', 'Date', 'Name', 'Phone', 'Email', 'Project', 'Message', 'Status'];
    const rows = leads.map((l, i) => [
      i + 1,
      `"${new Date(l.createdAt).toLocaleString('en-IN')}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.project || '').replace(/"/g, '""')}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`,
      `"${(l.status || '').replace(/"/g, '""')}"`
    ].join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'pravi_leads.csv';
    a.click();
    showToast('CSV downloaded!');
  } catch { showToast('Export failed.', true); }
}

/* ══════════════════════════════════════════════════════
   BRANDING & SEO
══════════════════════════════════════════════════════ */
function applyBranding(d) {
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('bCompanyName', d.companyName);
  set('bTagline',     d.tagline);
  set('bPageTitle',   d.pageTitle);
  set('bMetaDesc',    d.metaDesc);
  set('bKeywords',    d.keywords);
  set('bFooterTagline', d.footerTagline);
  const colorInput = document.getElementById('bColor');
  const colorText  = document.getElementById('bColorText');
  if (colorInput) colorInput.value = d.color || '#00c9a7';
  if (colorText)  colorText.value  = d.color || '#00c9a7';
  if (d.logo) {
    const zone = document.getElementById('logoZone');
    if (zone) { zone.style.backgroundImage = `url(${d.logo})`; zone.style.backgroundSize = 'cover'; }
  }
}

async function saveBranding() {
  const btn = document.querySelector('#panel-branding .btn-save');
  const logoFile = document.querySelector('#panel-branding input[type=file]')?.files[0];
  let logo = null;
  if (logoFile) logo = await uploadImage(logoFile, 'branding', 'logo');

  const data = {
    companyName:   document.getElementById('bCompanyName')?.value || '',
    tagline:       document.getElementById('bTagline')?.value || '',
    pageTitle:     document.getElementById('bPageTitle')?.value || '',
    metaDesc:      document.getElementById('bMetaDesc')?.value || '',
    keywords:      document.getElementById('bKeywords')?.value || '',
    footerTagline: document.getElementById('bFooterTagline')?.value || '',
    color:         document.getElementById('bColor')?.value || '#00c9a7',
  };
  if (logo) data.logo = logo;
  await saveSection('branding', data, btn);
}

/* ══════════════════════════════════════════════════════
   HERO SECTION
══════════════════════════════════════════════════════ */
function applyHero(d) {
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('hEyebrow',   d.eyebrow);
  set('hLine1',     d.titleLine1);
  set('hLine2',     d.titleLine2);
  set('hLine3',     d.titleLine3Accent);
  set('hDesc',      d.description);
  set('hBtnPrimary', d.btnPrimary);
  set('hBtnSecondary', d.btnSecondary);
  if (d.bgImage) {
    const zone = document.getElementById('heroImgZone');
    if (zone) { zone.style.backgroundImage = `url(${d.bgImage})`; zone.style.backgroundSize = 'cover'; zone.style.backgroundPosition = 'center'; }
  }
}

async function saveHero() {
  const btn = document.querySelector('#panel-hero .btn-save');
  const bgFile = document.querySelector('#heroImgZone input')?.files[0];
  let bgImage = null;
  if (bgFile) bgImage = await uploadImage(bgFile, 'hero', 'bgImage');

  const data = {
    eyebrow:       document.getElementById('hEyebrow')?.value || '',
    titleLine1:    document.getElementById('hLine1')?.value || '',
    titleLine2:    document.getElementById('hLine2')?.value || '',
    titleLine3Accent: document.getElementById('hLine3')?.value || '',
    description:   document.getElementById('hDesc')?.value || '',
    btnPrimary:    document.getElementById('hBtnPrimary')?.value || '',
    btnSecondary:  document.getElementById('hBtnSecondary')?.value || '',
  };
  if (bgImage) data.bgImage = bgImage;
  await saveSection('hero', data, btn);
}

async function removeHeroBg() {
  if (!confirm('Remove the hero background image? This cannot be undone.')) return;
  const btn = document.querySelector('#panel-hero .btn-save');

  // Clear the preview zone
  const zone = document.getElementById('heroImgZone');
  if (zone) {
    zone.style.backgroundImage = '';
    const icon   = zone.querySelector('i');
    const strong = zone.querySelector('strong');
    const p      = zone.querySelector('p');
    const input  = zone.querySelector('input[type=file]');
    if (icon)   icon.style.display = 'block';
    if (strong) strong.textContent = 'Upload Hero Image';
    if (p)      p.textContent = 'Recommended: 1920×1080px, JPG/WebP';
    if (input)  input.value = '';
  }

  // Save with bgImage set to empty string
  const data = {
    eyebrow:          document.getElementById('hEyebrow')?.value || '',
    titleLine1:       document.getElementById('hLine1')?.value || '',
    titleLine2:       document.getElementById('hLine2')?.value || '',
    titleLine3Accent: document.getElementById('hLine3')?.value || '',
    description:      document.getElementById('hDesc')?.value || '',
    btnPrimary:       document.getElementById('hBtnPrimary')?.value || '',
    btnSecondary:     document.getElementById('hBtnSecondary')?.value || '',
    bgImage: '',  // ← explicitly clear it
  };

  await saveSection('hero', data, btn);
}

function previewUpload(input, zoneId) {
  if (!input.files[0]) return;
  const r = new FileReader();
  r.onload = e => {
    const zone = document.getElementById(zoneId);
    if (!zone) return;
    zone.style.backgroundImage = `url(${e.target.result})`;
    zone.style.backgroundSize = 'cover';
    zone.style.backgroundPosition = 'center';
    const icon = zone.querySelector('i');
    const strong = zone.querySelector('strong');
    const p = zone.querySelector('p');
    if (icon) icon.style.display = 'none';
    if (strong) strong.textContent = 'Image selected ✓';
    if (p) p.textContent = input.files[0].name;
  };
  r.readAsDataURL(input.files[0]);
}

/* ══════════════════════════════════════════════════════
   ABOUT SECTION
══════════════════════════════════════════════════════ */
function applyAbout(d) {
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('aEyebrow', d.eyebrow);
  set('aTitle1',  d.titleLine1);
  set('aTitle2',  d.titleLine2Accent);
  set('aDesc',    d.description);
  if (d.features && Array.isArray(d.features)) {
    const list = document.getElementById('featureList');
    if (list) {
      list.innerHTML = d.features.map((f, i) => `
        <div class="list-item" data-idx="${i}">
          <i class="drag-handle fa-solid fa-grip-vertical"></i>
          <div class="list-item-content">
            <div class="lname">${esc(f.title)}</div>
            <div class="lsub">${esc(f.desc)}</div>
          </div>
          <div class="list-item-actions">
            <button class="icon-btn" onclick="editFeature(this,${i})"><i class="fa-solid fa-pen"></i></button>
            <button class="icon-btn del" onclick="removeItem(this)"><i class="fa-solid fa-trash"></i></button>
          </div>
        </div>`).join('');
    }
  }
}

async function saveAbout() {
  const btn = document.querySelector('#panel-about .btn-save');
  const features = [];
  document.querySelectorAll('#featureList .list-item').forEach(el => {
    features.push({ title: el.querySelector('.lname').textContent, desc: el.querySelector('.lsub').textContent });
  });
  const data = {
    eyebrow:      document.getElementById('aEyebrow')?.value || '',
    titleLine1:   document.getElementById('aTitle1')?.value || '',
    titleLine2Accent: document.getElementById('aTitle2')?.value || '',
    description:  document.getElementById('aDesc')?.value || '',
    features,
  };
  await saveSection('about', data, btn);
}

/* Feature modal */
let _editingFeatureEl = null;
function editFeature(el, idx) {
  _editingFeatureEl = el?.closest('.list-item');
  const titleEl = _editingFeatureEl?.querySelector('.lname');
  const descEl  = _editingFeatureEl?.querySelector('.lsub');
  document.getElementById('fTitle').value = titleEl?.textContent || '';
  document.getElementById('fDesc').value  = descEl?.textContent  || '';
  document.getElementById('fIcon').value  = _editingFeatureEl?.dataset?.icon || 'fa-bolt';
  openModal('feature');
}
function saveFeature() {
  const title = document.getElementById('fTitle').value;
  const desc  = document.getElementById('fDesc').value;
  const icon  = document.getElementById('fIcon').value;
  if (_editingFeatureEl) {
    _editingFeatureEl.querySelector('.lname').textContent = title;
    _editingFeatureEl.querySelector('.lsub').textContent  = desc;
    _editingFeatureEl.dataset.icon = icon;
  } else {
    const list = document.getElementById('featureList');
    const div  = document.createElement('div');
    div.className = 'list-item';
    div.dataset.icon = icon;
    div.innerHTML = `
      <i class="drag-handle fa-solid fa-grip-vertical"></i>
      <div class="list-item-content">
        <div class="lname">${esc(title)}</div>
        <div class="lsub">${esc(desc)}</div>
      </div>
      <div class="list-item-actions">
        <button class="icon-btn" onclick="editFeature(this)"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn del" onclick="removeItem(this)"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    list.appendChild(div);
  }
  closeModal('feature');
  _editingFeatureEl = null;
}

/* ══════════════════════════════════════════════════════
   PRODUCTS
══════════════════════════════════════════════════════ */
let _editingProductId = null;
function applyProducts(d) {
  if (!d || !d.items) return;
  const list = document.getElementById('productList');
  if (!list) return;
  list.innerHTML = d.items.map((p, i) => `
    <div class="list-item" data-idx="${i}">
      <i class="drag-handle fa-solid fa-grip-vertical"></i>
      <div class="img-thumb" style="width:44px;height:44px;flex-shrink:0;border-radius:6px;overflow:hidden;background:var(--surface3)">
        ${p.image ? `<img src="${p.image}" style="width:100%;height:100%;object-fit:cover"/>` : '<div class="img-thumb-placeholder"><i class="fa-solid fa-image"></i></div>'}
      </div>
      <div class="list-item-content">
        <div class="lname">${esc(p.name)}</div>
        <div class="lsub">${esc(p.category)}</div>
      </div>
      <div class="list-item-actions">
        <button class="icon-btn" onclick="openEditProduct(${i})"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn del" onclick="deleteProduct(${i})"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
  document.getElementById('statProducts').textContent = d.items.length;
}

function openEditProduct(idx) {
  _editingProductId = idx;
  loadSection('products', d => {
    if (!d || !d.items || idx === null) return;
    const p = d.items[idx];
    if (!p) return;
    document.getElementById('pName').value     = p.name || '';
    document.getElementById('pCategory').value = p.category || 'Architectural';
    document.getElementById('pDesc').value     = p.description || '';
    document.getElementById('pLink').value     = p.link || '#quote';
    openModal('product');
  });
}

async function saveProduct() {
  const btn = document.querySelector('#modal-product .btn-save');

  try {
    const imgFile = document.querySelector('#modal-product input[type=file]')?.files[0];
    let image = null;

    // ✅ Just convert to base64 locally — no separate upload call
    if (imgFile) {
      image = await toBase64(imgFile);
    }

    const newProduct = {
      name: document.getElementById('pName').value,
      category: document.getElementById('pCategory').value,
      description: document.getElementById('pDesc').value,
      link: document.getElementById('pLink').value || '#quote',
    };

    if (image) newProduct.image = image;

    let items = [];
    try {
      const r = await fetch(`${API}/site/products`);
      if (r.ok) {
        const d = await r.json();
        items = d.items || [];
      }
    } catch {}

    if (_editingProductId !== null && items[_editingProductId]) {
      items[_editingProductId] = { ...items[_editingProductId], ...newProduct };
    } else {
      items.push(newProduct);
    }

    // ✅ pass btn so saveSection handles the spinner
    const ok = await saveSection('products', { items }, btn);

    if (ok) {
      closeModal('product');
      loadSection('products', applyProducts);
      _editingProductId = null;
    }

  } catch (e) {
    setLoading(btn, false);
    showToast('Something went wrong.', true);
  }
}

async function saveProducts() {
  showToast("⚠️ Use the edit button on each product to save.");
}

async function deleteProduct(index) {
  if (!confirm("Delete this product?")) return;

  try {
    // get current data
    const res = await fetch(`${API}/site/products`);
    const data = await res.json();

    let items = data.items || [];

    // remove item
    items.splice(index, 1);

    // save updated list
    await fetch(`${API}/site/products`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ items })
    });

    showToast("Product deleted ✅");

    // reload UI
    loadSection('products', applyProducts);

  } catch {
    showToast("Delete failed ❌", true);
  }
}


/* ══════════════════════════════════════════════════════
   CLIENTS
══════════════════════════════════════════════════════ */
function applyClients(d) {
  if (!d || !d.items) return;
  const list = document.getElementById('clientList');
  if (!list) return;
  list.innerHTML = d.items.map((c, i) => `
    <div class="list-item" data-idx="${i}">
      <i class="drag-handle fa-solid fa-grip-vertical"></i>
      <div class="img-thumb" style="width:44px;height:44px;flex-shrink:0;background:var(--surface3);border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:var(--muted);overflow:hidden">
        ${c.logo ? `<img src="${c.logo}" style="width:100%;height:100%;object-fit:contain;padding:4px"/>` : 'LOGO'}
      </div>
      <div class="list-item-content">
        <div class="lname">${esc(c.name)}</div>
        <div class="lsub">${c.logo ? 'Has logo' : 'Text only'}</div>
      </div>
      <div class="list-item-actions">
        <button class="icon-btn del" onclick="removeItem(this)"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

async function saveClientModal() {
  const btn = document.querySelector('#modal-client .btn-save');
  setLoading(btn, true);
  try {
    const name    = document.getElementById('cName').value;
    const imgFile = document.querySelector('#modal-client input[type=file]')?.files[0];
    let logo = null;
    if (imgFile) logo = await uploadImage(imgFile, 'clients', 'logo_' + Date.now());

    let items = [];
    try {
      const r = await fetch(`${API}/site/clients`);
      if (r.ok) { const d = await r.json(); items = d.items || []; }
    } catch {}
    items.push({ name, logo });

    const ok = await saveSection('clients', { items }, null);
    if (ok) { closeModal('client'); loadSection('clients', applyClients); }
  } finally { setLoading(btn, false); }
}

async function saveClients() {
  const btn = document.querySelector('#panel-clients .btn-save');
  const items = [];
  document.querySelectorAll('#clientList .list-item').forEach(el => {
    items.push({ name: el.querySelector('.lname').textContent });
  });
  await saveSection('clients', { items }, btn);
}

/* ══════════════════════════════════════════════════════
   TESTIMONIALS
══════════════════════════════════════════════════════ */
function applyTestimonials(d) {
  if (!d || !d.items) return;
  const list = document.getElementById('testiList');
  if (!list) return;
  list.innerHTML = d.items.map((t, i) => `
    <div class="list-item" data-idx="${i}">
      <i class="drag-handle fa-solid fa-grip-vertical"></i>
      <div class="list-item-content">
        <div class="lname">${esc(t.name)} <span style="color:var(--warning)">${t.stars || '★★★★★'}</span></div>
        <div class="lsub">${esc(t.role)}</div>
      </div>
      <div class="list-item-actions">
        <button class="icon-btn" onclick="openEditTesti(${i})"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn del" onclick="removeItem(this)"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`).join('');
}

let _editingTestiIdx = null;
function openEditTesti(idx) {
  _editingTestiIdx = idx;
  loadSection('testimonials', d => {
    if (!d || !d.items) return;
    const t = d.items[idx];
    if (!t) return;
    document.getElementById('tName').value     = t.name || '';
    document.getElementById('tRole').value     = t.role || '';
    document.getElementById('tStars').value    = t.stars || '★★★★★';
    document.getElementById('tText').value     = t.text || '';
    document.getElementById('tInitials').value = t.initials || '';
    openModal('testi');
  });
}

async function saveTestiModal() {
  const btn = document.querySelector('#modal-testi .btn-save');
  setLoading(btn, true);
  try {
    const newT = {
      name:     document.getElementById('tName').value,
      role:     document.getElementById('tRole').value,
      stars:    document.getElementById('tStars').value,
      text:     document.getElementById('tText').value,
      initials: document.getElementById('tInitials').value,
    };

    let items = [];
    try {
      const r = await fetch(`${API}/site/testimonials`);
      if (r.ok) { const d = await r.json(); items = d.items || []; }
    } catch {}

    if (_editingTestiIdx !== null && items[_editingTestiIdx]) {
      items[_editingTestiIdx] = newT;
    } else {
      items.push(newT);
    }

    const ok = await saveSection('testimonials', { items }, null);
    if (ok) { closeModal('testi'); loadSection('testimonials', applyTestimonials); _editingTestiIdx = null; }
  } finally { setLoading(btn, false); }
}

async function saveTestimonials() {
  const items = [];
  document.querySelectorAll('#testiList .list-item').forEach(el => {
    items.push({ name: el.querySelector('.lname').textContent.replace(/★.*/,'').trim(), role: el.querySelector('.lsub').textContent });
  });
  await saveSection('testimonials', { items }, document.querySelector('#panel-testimonials .btn-save'));
}

/* ══════════════════════════════════════════════════════
   STATS
══════════════════════════════════════════════════════ */
function applyStats(d) {
  if (!d) return;
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  setVal('st1num', d.s1?.num); setVal('st1suf', d.s1?.suffix); setVal('st1lbl', d.s1?.label);
  setVal('st2num', d.s2?.num); setVal('st2suf', d.s2?.suffix); setVal('st2lbl', d.s2?.label);
  setVal('st3num', d.s3?.num); setVal('st3suf', d.s3?.suffix); setVal('st3lbl', d.s3?.label);
  setVal('st4num', d.s4?.num); setVal('st4suf', d.s4?.suffix); setVal('st4lbl', d.s4?.label);
}

async function saveStats() {
  const data = {
    s1: { num: document.getElementById('st1num')?.value, suffix: document.getElementById('st1suf')?.value, label: document.getElementById('st1lbl')?.value },
    s2: { num: document.getElementById('st2num')?.value, suffix: document.getElementById('st2suf')?.value, label: document.getElementById('st2lbl')?.value },
    s3: { num: document.getElementById('st3num')?.value, suffix: document.getElementById('st3suf')?.value, label: document.getElementById('st3lbl')?.value },
    s4: { num: document.getElementById('st4num')?.value, suffix: document.getElementById('st4suf')?.value, label: document.getElementById('st4lbl')?.value },
  };
  await saveSection('stats', data, document.querySelector('#panel-stats .btn-save'));
}

/* ══════════════════════════════════════════════════════
   MAP
══════════════════════════════════════════════════════ */
function applyMapPanel(d) {
  if (!d) return;
  const urlEl    = document.getElementById('mapUrl');
  const iframeEl = document.getElementById('mapIframe');
  if (urlEl)    urlEl.value    = d.embedUrl || '';
  if (iframeEl) iframeEl.value = d.embedCode || '';
  if (d.embedUrl || d.embedCode) previewMap();
}

function previewMap() {
  const url    = document.getElementById('mapUrl')?.value;
  const iframe = document.getElementById('mapIframe')?.value;
  const preview = document.querySelector('.map-preview');
  if (!preview) return;
  if (iframe) {
    preview.innerHTML = iframe;
    const el = preview.querySelector('iframe');
    if (el) { el.style.width = '100%'; el.style.height = '170px'; el.style.border = 'none'; }
  } else if (url) {
    preview.innerHTML = `<iframe src="${url}" width="100%" height="170" style="border:none" allowfullscreen loading="lazy"></iframe>`;
  }
}

async function saveMap() {
  const data = {
    embedUrl:  document.getElementById('mapUrl')?.value || '',
    embedCode: document.getElementById('mapIframe')?.value || '',
    show:      document.querySelector('#panel-map .toggle input')?.checked ?? true,
  };
  await saveSection('map', data, document.querySelector('#panel-map .btn-save'));
}

/* ══════════════════════════════════════════════════════
   CONTACT
══════════════════════════════════════════════════════ */
function applyContact(d) {
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('cPhone',     d.phone);
  set('cEmail',     d.email);
  set('cAddress',   d.address);
  set('cHours',     d.hours);
  set('cFacebook',  d.facebook);
  set('cInstagram', d.instagram);
  set('cLinkedin',  d.linkedin);
  set('cYoutube',   d.youtube);
}

async function saveContact() {
  const data = {
    phone:     document.getElementById('cPhone')?.value || '',
    email:     document.getElementById('cEmail')?.value || '',
    address:   document.getElementById('cAddress')?.value || '',
    hours:     document.getElementById('cHours')?.value || '',
    facebook:  document.getElementById('cFacebook')?.value || '',
    instagram: document.getElementById('cInstagram')?.value || '',
    linkedin:  document.getElementById('cLinkedin')?.value || '',
    youtube:   document.getElementById('cYoutube')?.value || '',
  };
  await saveSection('contact', data, document.querySelector('#panel-contact .btn-save'));
}

/* ══════════════════════════════════════════════════════
   WHATSAPP
══════════════════════════════════════════════════════ */
function applyWhatsApp(d) {
  if (!d) return;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val || ''; };
  set('waPhone',    d.phone);
  set('waMsg',      d.message);
  set('waTooltip',  d.tooltip);
  set('waPosition', d.position);
  const toggle = document.getElementById('waToggle');
  if (toggle) toggle.checked = d.enabled !== false;
  document.getElementById('waPhonePreview').textContent   = d.phone || '';
  document.getElementById('waTooltipPreview').textContent = d.tooltip || '';
}

async function saveWhatsApp() {
  const data = {
    phone:    document.getElementById('waPhone')?.value || '',
    message:  document.getElementById('waMsg')?.value   || '',
    tooltip:  document.getElementById('waTooltip')?.value || '',
    position: document.getElementById('waPosition')?.value || 'bottom-right',
    enabled:  document.getElementById('waToggle')?.checked ?? true,
  };
  document.getElementById('waPhonePreview').textContent   = data.phone;
  document.getElementById('waTooltipPreview').textContent = data.tooltip;
  await saveSection('whatsapp', data, document.querySelector('#panel-whatsapp .btn-save'));
}

/* waPhone/waTooltip listeners added in init() */

/* ══════════════════════════════════════════════════════
   FACILITY IMAGES
══════════════════════════════════════════════════════ */
function applyFacility(d) {
  if (!d || !d.images) return;
  const grid = document.getElementById('facilityImgGrid');
  if (!grid) return;
  // Show stored images
  const existing = grid.querySelectorAll('.img-thumb[data-stored]');
  existing.forEach(e => e.remove());
  d.images.forEach(src => {
    const div = document.createElement('div');
    div.className = 'img-thumb';
    div.dataset.stored = '1';
    div.innerHTML = `<img src="${src}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
    grid.insertBefore(div, grid.firstChild);
  });
}

function handleFacilityUpload(input) {
  const grid = document.getElementById('facilityImgGrid');
  Array.from(input.files).forEach(file => {
    const r = new FileReader();
    r.onload = e => {
      const div = document.createElement('div');
      div.className = 'img-thumb';
      div.innerHTML = `<img src="${e.target.result}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
      grid.appendChild(div);
    };
    r.readAsDataURL(file);
  });
  showToast(`${input.files.length} image(s) added`);
}

async function saveFacility() {
  const btn = document.querySelector('#panel-facility .btn-save');
  setLoading(btn, true);
  try {
    const images = [];
    document.querySelectorAll('#facilityImgGrid .img-thumb img').forEach(img => {
      images.push(img.src);
    });
    await saveSection('facility', { images }, null);
    showToast('Facility images saved!');
  } finally { setLoading(btn, false); }
}

/* ══════════════════════════════════════════════════════
   GALLERY IMAGES
══════════════════════════════════════════════════════ */
function applyGallery(d) {
  if (!d || !d.images) return;
  const grid = document.getElementById('galleryImgGrid');
  if (!grid) return;
  const existing = grid.querySelectorAll('.img-thumb[data-stored]');
  existing.forEach(e => e.remove());
  d.images.forEach(item => {
    const div = document.createElement('div');
    div.className = 'img-thumb';
    div.dataset.stored = '1';
    div.innerHTML = `<img src="${item.src || item}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
    grid.insertBefore(div, grid.firstChild);
  });
}

function handleGalleryUpload(input) {
  const grid = document.getElementById('galleryImgGrid');
  const cat  = document.querySelector('#panel-gallery select')?.value || 'residential';
  Array.from(input.files).forEach(file => {
    const r = new FileReader();
    r.onload = e => {
      const div = document.createElement('div');
      div.className = 'img-thumb';
      div.dataset.category = cat;
      div.innerHTML = `<img src="${e.target.result}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
      grid.appendChild(div);
    };
    r.readAsDataURL(file);
  });
  showToast(`${input.files.length} image(s) added`);
}

async function saveGallery() {
  const btn = document.querySelector('#panel-gallery .btn-save');
  setLoading(btn, true);
  try {
    const images = [];
    document.querySelectorAll('#galleryImgGrid .img-thumb img').forEach(img => {
      images.push({ src: img.src, category: img.closest('.img-thumb')?.dataset.category || 'all' });
    });
    await saveSection('gallery', { images }, null);
    document.getElementById('statGallery').textContent = images.length;
    showToast('Gallery saved!');
  } finally { setLoading(btn, false); }
}

function switchTab(el, filter) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/* ══════════════════════════════════════════════════════
   BEFORE & AFTER
══════════════════════════════════════════════════════ */
function applyBeforeAfter(d) {
  if (!d || !d.pairs) return;
  const list = document.getElementById('baPairList');
  if (!list) return;

  list.innerHTML = '';

  d.pairs.forEach((pair, i) => {
    const div = document.createElement('div');
    div.className = 'ba-pair';

    div.innerHTML = `
      <div>
        <div class="card-title" style="font-size:12px;margin-bottom:8px">
          <i class="fa-solid fa-circle" style="color:var(--muted)"></i> BEFORE ${i + 1}
        </div>
        <div class="upload-zone" style="${pair.before ? `background-image:url(${pair.before});background-size:cover;background-position:center` : ''}">
          <input type="file" accept="image/*"/>
          <i class="fa-solid fa-cloud-arrow-up" ${pair.before ? 'style="display:none"' : ''}></i>
          <strong>${pair.before ? 'Image set ✓' : 'Upload Before'}</strong>
          <p>${pair.before ? '' : 'Current state'}</p>
        </div>
      </div>

      <div class="arr"><i class="fa-solid fa-arrow-right"></i></div>

      <div>
        <div class="card-title" style="font-size:12px;margin-bottom:8px">
          <i class="fa-solid fa-circle" style="color:var(--teal)"></i> AFTER ${i + 1}
        </div>
        <div class="upload-zone" style="${pair.after ? `background-image:url(${pair.after});background-size:cover;background-position:center` : ''}">
          <input type="file" accept="image/*"/>
          <i class="fa-solid fa-cloud-arrow-up" ${pair.after ? 'style="display:none"' : ''}></i>
          <strong>${pair.after ? 'Image set ✓' : 'Upload After'}</strong>
          <p>${pair.after ? '' : 'Transformed result'}</p>
        </div>
      </div>

      <!-- 🔥 DELETE BUTTON -->
      <button onclick="deleteBeforeAfter(${i})"
        style="position:absolute;top:10px;right:10px;
        background:#ff5757;border:none;color:#fff;
        padding:6px 10px;border-radius:6px;cursor:pointer">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;

    div.style.position = "relative"; // needed for button position

    list.appendChild(div);
  });
}

async function deleteBeforeAfter(index) {
  if (!confirm("Delete this item?")) return;

  try {
    const res = await fetch(`${API}/site/beforeafter`);
    const data = await res.json();

    let pairs = data.pairs || [];

    pairs.splice(index, 1);

    await fetch(`${API}/site/beforeafter`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ pairs })
    });

    showToast("Deleted ✅");

    loadSection('beforeafter', applyBeforeAfter);

  } catch {
    showToast("Delete failed ❌", true);
  }
}

function addBAPair() {
  const list = document.getElementById('baPairList');
  const n = list.querySelectorAll('.ba-pair').length + 1;
  const div = document.createElement('div');
  div.className = 'ba-pair';
  div.innerHTML = `
    <div>
      <div class="card-title" style="font-size:12px;margin-bottom:8px"><i class="fa-solid fa-circle" style="color:var(--muted)"></i> BEFORE ${n}</div>
      <div class="upload-zone"><input type="file" accept="image/*"/><i class="fa-solid fa-cloud-arrow-up"></i><strong>Upload Before</strong><p>Current state</p></div>
    </div>
    <div class="arr"><i class="fa-solid fa-arrow-right"></i></div>
    <div>
      <div class="card-title" style="font-size:12px;margin-bottom:8px"><i class="fa-solid fa-circle" style="color:var(--teal)"></i> AFTER ${n}</div>
      <div class="upload-zone"><input type="file" accept="image/*"/><i class="fa-solid fa-cloud-arrow-up"></i><strong>Upload After</strong><p>Transformed result</p></div>
    </div>`;
  list.appendChild(div);
  showToast('New pair added!');
}

async function saveBeforeAfter() {
  const btn = document.querySelector('#panel-before-after .btn-save');
  setLoading(btn, true);
  try {
    const pairs = [];
    const pairEls = document.querySelectorAll('#baPairList .ba-pair');
    for (const pairEl of pairEls) {
      const zones    = pairEl.querySelectorAll('.upload-zone');
      const bImg = zones[0]?.style.backgroundImage?.match(/url\("?([^"]+)"?\)/)?.[1] || '';
      const aImg = zones[1]?.style.backgroundImage?.match(/url\("?([^"]+)"?\)/)?.[1] || '';
      const bFile = zones[0]?.querySelector('input[type=file]')?.files[0];
      const aFile = zones[1]?.querySelector('input[type=file]')?.files[0];
      let before = bImg, after = aImg;
      if (bFile) before = await uploadImage(bFile, 'beforeafter', 'b_' + Date.now());
      if (aFile) after  = await uploadImage(aFile, 'beforeafter', 'a_' + Date.now());
      pairs.push({ before, after });
    }
    await saveSection('beforeafter', { pairs }, null);
    showToast('Before & After saved!');
  } finally { setLoading(btn, false); }
}

/* ══════════════════════════════════════════════════════
   LOGOUT
══════════════════════════════════════════════════════ */
function logout() {
  localStorage.removeItem('token');
  window.location.href = 'admin-login.html';
}

/* ══════════════════════════════════════════════════════
   INIT
══════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', async function () {
  /* Modal close on background click */
  document.querySelectorAll('.modal-bg').forEach(m => {
    m.addEventListener('click', e => { if (e.target === m) m.classList.remove('open'); });
  });

  /* WhatsApp live preview */
  const waPhone   = document.getElementById('waPhone');
  const waTooltip = document.getElementById('waTooltip');
  if (waPhone)   waPhone.addEventListener('input',   function () { const el = document.getElementById('waPhonePreview');   if (el) el.textContent = this.value; });
  if (waTooltip) waTooltip.addEventListener('input', function () { const el = document.getElementById('waTooltipPreview'); if (el) el.textContent = this.value; });

  if (!checkAuth()) return;
  await loadDashboard();

  /* Load badge count */
  try {
    const r = await fetch(`${API}/leads/stats`, { headers: authHeaders() });
    if (r.ok) {
      const s = await r.json();
      const badge = document.getElementById('leadsNavBadge');
      if (badge) { badge.textContent = s.total; badge.style.display = s.total ? 'inline' : 'none'; }
    }
  } catch {}
});

/* ══════════════════════════════════════════════════════
   SESSION TIMEOUT — auto logout after 30 min inactivity
══════════════════════════════════════════════════════ */
(function sessionTimeout() {
  const TIMEOUT     = 30 * 60 * 1000;
  const WARN_BEFORE = 5  * 60 * 1000;
  let logoutTimer;
  let warnTimer;
  let warned = false; // ✅ ADD THIS

  function resetTimers() {
    clearTimeout(logoutTimer);
    clearTimeout(warnTimer);
    warned = false; // ✅ reset warning flag on activity

    warnTimer = setTimeout(() => {
      if (!warned) { // ✅ only show once
        warned = true;
        showToast('⚠️ You will be logged out in 5 minutes due to inactivity!', true);
      }
    }, TIMEOUT - WARN_BEFORE);

    logoutTimer = setTimeout(() => {
      showToast('🔒 Session expired. Logging out...', true);
      setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = 'admin-login.html';
      }, 2000);
    }, TIMEOUT);
  }

  ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart', 'click']
    .forEach(event => document.addEventListener(event, resetTimers));

  resetTimers();
})();
