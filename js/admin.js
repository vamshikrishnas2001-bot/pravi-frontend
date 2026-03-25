function showPanel(id,el){
  document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n=>n.classList.remove('active'));
  document.getElementById('panel-'+id).classList.add('active');
  if(el){el.classList.add('active')}
  const titles={
    dashboard:'DASHBOARD',leads:'LEADS & QUOTE REQUESTS',branding:'BRANDING & SEO',hero:'HERO SECTION',about:'ABOUT SECTION',
    products:'PRODUCTS',facility:'FACILITY IMAGES',gallery:'PROJECT GALLERY',
    'before-after':'BEFORE & AFTER',clients:'CLIENTS',testimonials:'TESTIMONIALS',
    stats:'STATS NUMBERS',map:'MAP & LOCATION',contact:'CONTACT INFO',whatsapp:'WHATSAPP WIDGET'
  };
  document.getElementById('topbarTitle').textContent=titles[id]||id.toUpperCase();
  if(window.innerWidth<=800) document.getElementById('sidebar').classList.remove('open');
  if(id==='leads') renderLeads();
}
function toggleSidebar(){document.getElementById('sidebar').classList.toggle('open')}
function save(){showToast('Changes saved successfully!')}
function publishAll(){showToast('Site published! Live changes applied.');document.querySelector('.topbar-badge').style.borderColor='var(--teal)'}
function showToast(msg){
  const t=document.getElementById('toast');
  document.getElementById('toastMsg').textContent=msg;
  t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3000)
}
function openModal(name){document.getElementById('modal-'+name).classList.add('open')}
function closeModal(name){document.getElementById('modal-'+name).classList.remove('open')}
function removeItem(el){const item=el.closest('.list-item')||el;item.style.opacity='0';item.style.transform='scale(0.95)';item.style.transition='all 0.2s';setTimeout(()=>item.remove(),200)}
function switchTab(el,filter){
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  el.classList.add('active');
}
function editFeature(el){openModal('feature')}
function addBAPair(){
  const list=document.getElementById('baPairList');
  const n=document.createElement('div');n.className='ba-pair';
  n.innerHTML=`<div><div class="card-title" style="font-size:12px;margin-bottom:8px"><i class="fa-solid fa-circle" style="color:var(--muted)"></i> BEFORE Image</div><div class="upload-zone"><input type="file" accept="image/*"/><i class="fa-solid fa-cloud-arrow-up"></i><strong>Upload Before</strong><p>Current state</p></div></div><div class="arr"><i class="fa-solid fa-arrow-right"></i></div><div><div class="card-title" style="font-size:12px;margin-bottom:8px"><i class="fa-solid fa-circle" style="color:var(--teal)"></i> AFTER Image</div><div class="upload-zone"><input type="file" accept="image/*"/><i class="fa-solid fa-cloud-arrow-up"></i><strong>Upload After</strong><p>Transformed result</p></div></div>`;
  list.appendChild(n);showToast('New pair added!')
}
function handleFacilityUpload(input){
  const grid=document.getElementById('facilityImgGrid');
  Array.from(input.files).forEach(file=>{
    const r=new FileReader();
    r.onload=e=>{
      const div=document.createElement('div');div.className='img-thumb';
      div.innerHTML=`<img src="${e.target.result}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
      grid.appendChild(div);
    };r.readAsDataURL(file);
  });
  showToast(`${input.files.length} image(s) added`);
}
function handleGalleryUpload(input){
  const grid=document.getElementById('galleryImgGrid');
  Array.from(input.files).forEach(file=>{
    const r=new FileReader();
    r.onload=e=>{
      const div=document.createElement('div');div.className='img-thumb';
      div.innerHTML=`<img src="${e.target.result}" alt=""/><button class="img-remove" onclick="removeItem(this.parentNode)"><i class="fa-solid fa-xmark"></i></button>`;
      grid.appendChild(div);
    };r.readAsDataURL(file);
  });
  showToast(`${input.files.length} image(s) added`);
}
function previewUpload(input,zoneId){
  const r=new FileReader();
  r.onload=e=>{
    const zone=document.getElementById(zoneId);
    zone.style.backgroundImage=`url(${e.target.result})`;
    zone.style.backgroundSize='cover';
    zone.style.backgroundPosition='center';
    zone.querySelector('i').style.display='none';
    zone.querySelector('strong').textContent='Image selected ✓';
    zone.querySelector('p').textContent=input.files[0].name;
  };
  if(input.files[0]) r.readAsDataURL(input.files[0]);
}
function saveWhatsApp(){
  const phone=document.getElementById('waPhone').value;
  const tooltip=document.getElementById('waTooltip').value;
  document.getElementById('waPhonePreview').textContent=phone;
  document.getElementById('waTooltipPreview').textContent=tooltip;
  showToast('WhatsApp settings saved!');
}
document.querySelectorAll('.modal-bg').forEach(m=>{m.addEventListener('click',e=>{if(e.target===m)m.classList.remove('open')})});
document.getElementById('waPhone').addEventListener('input',function(){document.getElementById('waPhonePreview').textContent=this.value});
document.getElementById('waTooltip').addEventListener('input',function(){document.getElementById('waTooltipPreview').textContent=this.value});

/* ===================================================
   LEADS MANAGEMENT
=================================================== */
function getLeads(){
  return JSON.parse(localStorage.getItem('pravi_leads')||'[]');
}
function saveLeads(leads){
  localStorage.setItem('pravi_leads',JSON.stringify(leads));
}
function updateLeadsBadge(){
  const leads=getLeads();
  const newCount=leads.filter(l=>l.status==='New').length;
  const badge=document.getElementById('leadsNavBadge');
  const dashCount=document.getElementById('dashLeadCount');
  if(badge){badge.textContent=leads.length;badge.style.display=leads.length?'inline':'none'}
  if(dashCount) dashCount.textContent=leads.length;
  const countEl=document.getElementById('leadsCount');
  if(countEl) countEl.textContent=`(${leads.length} total, ${newCount} new)`;
}
function renderLeads(){
  updateLeadsBadge();
  const leads=getLeads();
  const search=(document.getElementById('leadsSearch')||{}).value||'';
  const statusF=(document.getElementById('leadsStatusFilter')||{}).value||'';
  const tbody=document.getElementById('leadsTableBody');
  const empty=document.getElementById('leadsEmpty');
  if(!tbody) return;

  let filtered=leads.filter(l=>{
    const s=search.toLowerCase();
    const matchSearch=!s||(l.name||'').toLowerCase().includes(s)||(l.email||'').toLowerCase().includes(s)||(l.phone||'').includes(s);
    const matchStatus=!statusF||l.status===statusF;
    return matchSearch&&matchStatus;
  });

  if(filtered.length===0){
    tbody.innerHTML='';
    empty.style.display='block';
    return;
  }
  empty.style.display='none';

  const statusClass={New:'new',Contacted:'contacted',Closed:'closed'};
  tbody.innerHTML=filtered.map((l,i)=>`
    <tr>
      <td style="color:var(--muted)">${i+1}</td>
      <td style="font-size:11px;color:var(--muted);white-space:nowrap">${l.date||''}</td>
      <td style="font-weight:500">${esc(l.name)}</td>
      <td>${esc(l.phone)}</td>
      <td style="color:var(--teal)">${esc(l.email)}</td>
      <td style="color:var(--muted)">${esc(l.project||'—')}</td>
      <td title="${esc(l.message||'')}" style="color:var(--muted);font-size:12px">${esc((l.message||'').substring(0,40))}${(l.message||'').length>40?'…':''}</td>
      <td><span class="lead-status ${statusClass[l.status]||'new'}">${l.status||'New'}</span></td>
      <td>
        <div style="display:flex;gap:5px">
          <button class="icon-btn" title="Edit" onclick="editLead(${l.id})"><i class="fa-solid fa-pen"></i></button>
          <button class="icon-btn del" title="Delete" onclick="deleteLead(${l.id})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`).join('');
}
function esc(str){
  return String(str||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function filterLeads(){renderLeads()}
function editLead(id){
  const leads=getLeads();
  const l=leads.find(x=>x.id===id);
  if(!l) return;
  document.getElementById('editLeadId').value=id;
  document.getElementById('editLeadName').value=l.name||'';
  document.getElementById('editLeadPhone').value=l.phone||'';
  document.getElementById('editLeadEmail').value=l.email||'';
  document.getElementById('editLeadProject').value=l.project||'';
  document.getElementById('editLeadMessage').value=l.message||'';
  document.getElementById('editLeadStatus').value=l.status||'New';
  openModal('lead');
}
function saveLeadEdit(){
  const id=parseInt(document.getElementById('editLeadId').value);
  const leads=getLeads();
  const idx=leads.findIndex(x=>x.id===id);
  if(idx===-1) return;
  leads[idx].name=document.getElementById('editLeadName').value;
  leads[idx].phone=document.getElementById('editLeadPhone').value;
  leads[idx].email=document.getElementById('editLeadEmail').value;
  leads[idx].project=document.getElementById('editLeadProject').value;
  leads[idx].message=document.getElementById('editLeadMessage').value;
  leads[idx].status=document.getElementById('editLeadStatus').value;
  saveLeads(leads);
  closeModal('lead');
  renderLeads();
  showToast('Lead updated!');
}
function deleteLead(id){
  if(!confirm('Delete this lead? This cannot be undone.')) return;
  const leads=getLeads().filter(x=>x.id!==id);
  saveLeads(leads);
  renderLeads();
  showToast('Lead deleted.');
}
function clearAllLeads(){
  if(!confirm('Delete ALL leads? This cannot be undone.')) return;
  localStorage.removeItem('pravi_leads');
  renderLeads();
  showToast('All leads cleared.');
}
function downloadLeadsCSV(){
  const leads=getLeads();
  if(!leads.length){showToast('No leads to export.');return;}
  const headers=['#','Date','Name','Phone','Email','Project','Message','Status'];
  const rows=leads.map((l,i)=>[
    i+1,
    `"${(l.date||'').replace(/"/g,'""')}"`,
    `"${(l.name||'').replace(/"/g,'""')}"`,
    `"${(l.phone||'').replace(/"/g,'""')}"`,
    `"${(l.email||'').replace(/"/g,'""')}"`,
    `"${(l.project||'').replace(/"/g,'""')}"`,
    `"${(l.message||'').replace(/"/g,'""')}"`,
    `"${(l.status||'').replace(/"/g,'""')}"`
  ].join(','));
  const csv=[headers.join(','),...rows].join('\n');
  const blob=new Blob([csv],{type:'text/csv'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;a.download='pravi_leads.csv';a.click();
  URL.revokeObjectURL(url);
  showToast('CSV downloaded!');
}
// Init badge on load
updateLeadsBadge();