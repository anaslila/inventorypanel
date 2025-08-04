/*  script.js  – main logic  */
let currentProperty = null;
let suggestionIndex = -1;

/* Init */
document.addEventListener('DOMContentLoaded', () => {
  const flatInput = document.getElementById('flatNumber');
  flatInput.addEventListener('input', () => { showSuggestions(flatInput.value); lookup(); });
  flatInput.addEventListener('keydown', handleSuggestionKeys);
  document.addEventListener('click', e => { if(!e.target.closest('.input-wrapper')) hideSuggestions(); });
  document.querySelector('.minimize-btn').onclick = () => document.body.style.display='none';
  document.querySelector('.close-btn').onclick = () => window.close();

  /* Restore last search */
  const last = localStorage.getItem('lastUnit');
  if (last && inventoryData[last]) { flatInput.value = last; lookup(); }
});

/* Lookup – fill the form */
function lookup() {
  const id = document.getElementById('flatNumber').value.trim().toUpperCase();
  if (!id) return clearForm();
  const item = inventoryData[id];
  if (!item) return showError(id);

  currentProperty = item;  // success
  localStorage.setItem('lastUnit', id);
  hideError();

  /* Quick helper */
  const set = (fld,val)=>document.getElementById(fld).value = val || '';

  set('band', item.band);
  set('facing', item.facing);
  set('carpet', item.carpetArea);
  set('typology', item.typology);
  set('agreementValue', money(item.price));
  set('stampDuty',       money(item.stampDuty));
  set('gst',             money(item.gst));
  set('regAmt',          money(item.registration));
  set('otherCharges',    money(item.otherCharges));
  set('allInclusive',    money(item.allInclusiveAmount));
  set('possessionCharges',money(item.possessionCharges));
  set('tower', item.tower);

  /* tower badge colour */
  const towerColor = towerColors[item.tower] || '#4a90e2';
  const towerInput = document.getElementById('tower');
  towerInput.style.background = towerColor;

  /* Payment plan */
  buildPlan(item);

  document.getElementById('emptyState').style.display='none';
}

/* Build payment-table */
function buildPlan(item){
  const sect = document.getElementById('paymentSection');
  const rows = document.getElementById('paymentBreakdown');
  rows.innerHTML='';
  const plan = paymentPlans[item.paymentPlan];
  if(!plan){ sect.style.display='none'; return; }
  document.getElementById('paymentPlanTitle').textContent=`Payment Plan (${item.paymentPlan})`;
  document.getElementById('towerName').textContent=item.tower;
  document.getElementById('towerName').style.background = towerColors[item.tower]||'#4a90e2';

  plan.forEach(p=>{
    const amt = Math.round(item.price * p.percentage / 100);
    rows.insertAdjacentHTML('beforeend',
      `<div class="payment-row">
         <div class="percentage">${p.percentage}%</div>
         <div class="amount">₹ ${indian(amt)}</div>
         <div class="milestone">${p.stage}</div>
       </div>`);
  });
  sect.style.display='block';
}

/* Suggestions dropdown */
function showSuggestions(txt){
  const box = document.getElementById('suggestions');
  if(txt.length===0){ hideSuggestions(); return; }
  const list = Object.keys(inventoryData)
               .filter(k=>k.toLowerCase().includes(txt.toLowerCase()))
               .slice(0,10);
  if(!list.length){ hideSuggestions(); return; }

  box.innerHTML = list.map(k=>{
    const d = inventoryData[k];
    return `<div class="suggestion-item" data-unit="${k}">
              <div class="unit-number">${k}</div>
              <div class="unit-details">${d.tower} • ${d.typology} • ${d.carpetArea}</div>
            </div>`;
  }).join('');
  box.classList.add('show');
  box.querySelectorAll('.suggestion-item').forEach(el=>{
    el.onclick = () => { document.getElementById('flatNumber').value=el.dataset.unit; hideSuggestions(); lookup(); };
  });
  suggestionIndex=-1;
}
function hideSuggestions(){ document.getElementById('suggestions').classList.remove('show'); }
function handleSuggestionKeys(e){
  const items=[...document.querySelectorAll('.suggestion-item')];
  if(!items.length) return;

  if(e.key==='ArrowDown'){ e.preventDefault(); suggestionIndex=Math.min(++suggestionIndex,items.length-1);}
  if(e.key==='ArrowUp')  { e.preventDefault(); suggestionIndex=Math.max(--suggestionIndex,0);}
  if(e.key==='Enter' && suggestionIndex>=0){
    e.preventDefault(); items[suggestionIndex].click();
  }
  items.forEach((it,i)=>it.style.background=i===suggestionIndex?'#e3f2fd':'' );
}

/* Helpers */
function indian(x){return x.toString().replace(/\\B(?=(\\d{2})+(?!\\d))/g,',');}
function money(n){return n?`₹ ${indian(n)}`:'';}

function clearForm(){
  ['band','facing','carpet','typology','agreementValue','stampDuty','gst',
   'regAmt','otherCharges','allInclusive','possessionCharges','tower']
  .forEach(id=>document.getElementById(id).value='');
  document.getElementById('paymentSection').style.display='none';
  document.getElementById('emptyState').style.display='block';
  hideError();
}
function showError(id){
  clearForm();
  document.getElementById('emptyState').style.display='none';
  if(!document.getElementById('err')){
    const div=document.createElement('div');
    div.id='err';div.className='empty-state';div.style.background='#ffebee';div.style.color='#c62828';
    div.innerHTML=`<h3>Property not found</h3><p>No entry for “${id}”. Check spelling.</p>`;
    document.querySelector('.content').appendChild(div);
    setTimeout(()=>div.remove(),4000);
  }
}
function hideError(){ const e=document.getElementById('err'); if(e) e.remove(); }
