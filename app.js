const K='kosmetyki-v1';let S=JSON.parse(localStorage.getItem(K)||'null');
if(!S){S={kategorie:SEED.kategorie,items:SEED.items,updatedAt:new Date().toISOString()};save()}
if(!S.typyV){const m=Object.fromEntries(SEED.items.map(i=>[i.id,i.typ]));S.items.forEach(i=>{if(i.typ===undefined)i.typ=m[i.id]||''});S.typyV=1;save()}
let tab=S.kategorie[0],cur=null,ph={};const $=s=>document.querySelector(s);
function save(){S.updatedAt=new Date().toISOString();localStorage.setItem(K,JSON.stringify(S))}
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function tabs(){const t=[...S.kategorie,'Twarz ref.','Kopia'];$('#tabs').innerHTML=t.map(c=>`<button class="${c==tab?'on':''}" data-t="${esc(c)}">${esc(c)}</button>`).join('');
$('#count').textContent=`Razem: ${S.items.length} pozycji`;}
$('#tabs').onclick=e=>{if(e.target.dataset.t){tab=e.target.dataset.t;render()}};
function render(){tabs();const L=$('#list');$('#fab').style.display=S.kategorie.includes(tab)?'':'none';
if(tab=='Twarz ref.'){L.innerHTML='<p>Zdjęcia twarzy z każdej strony</p><div class="face">'+SEED.twarz.map(s=>`<img src="${s}">`).join('')+'</div>';return}
if(tab=='Kopia'){L.innerHTML=`<p>Ostatnia zmiana: ${new Date(S.updatedAt).toLocaleString('pl-PL')}</p>
<button class="big" onclick="exp('backup')">💾 Kopia zapasowa (ze zdjęciami)</button>
<button class="big alt" onclick="exp('json')">🤖 Dla bota – JSON</button>
<button class="big alt" onclick="exp('md')">🤖 Dla bota – tekst (Markdown)</button>
<label class="big alt" style="text-align:center">📂 Wczytaj kopię<input type="file" accept=".json" style="display:none" onchange="imp(this.files[0])"></label>
<button class="big del" onclick="if(confirm('Przywrócić listę z arkusza? Twoje zmiany znikną.')){localStorage.removeItem(K);location.reload()}">Przywróć dane startowe</button>`;return}
const q=($('#search')?.value||'').toLowerCase();const its=S.items.filter(i=>i.kategoria==tab);
let h=`<input id="search" placeholder="🔍 Szukaj…" value="${esc(q)}" oninput="render();document.getElementById('search').focus()"><div class="sub">${its.length} szt.</div>`,sub=null;
for(const i of its){if(q&&!JSON.stringify([i.nazwa,i.typ,i.kolor,i.uwagi,i.zastosowanie]).toLowerCase().includes(q))continue;
if(i.podgrupa!==sub&&i.podgrupa){h+=`<div class="sub">${esc(i.podgrupa)}</div>`}sub=i.podgrupa;
h+=`<div class="card" data-id="${i.id}"><div class="pics">${i.zdjecie?`<img src="${i.zdjecie}" data-f>`:''}${i.swatch?`<img src="${i.swatch}" data-f>`:''}</div>
<div><h3>${esc(i.nazwa)}</h3>${i.typ?`<div class="typ">${esc(i.typ)}</div>`:''}<div class="meta">${esc(i.zastosowanie)}${i.kolor&&i.kolor.length<40?' · '+esc(i.kolor):''}</div>
${i.kolor&&i.kolor.length>=40?`<div class="note">${esc(i.kolor)}</div>`:''}${i.uwagi?`<div class="note">📝 ${esc(i.uwagi)}</div>`:''}</div></div>`}
L.innerHTML=h;const s=$('#search');if(q){s.setSelectionRange(q.length,q.length)}}
$('#list').onclick=e=>{if(e.target.dataset.f!==undefined){$('#fullimg').src=e.target.src;$('#full').showModal();return}
const c=e.target.closest('.card');if(c)edit(S.items.find(i=>i.id==c.dataset.id))};
$('#fab').onclick=()=>edit(null);
function edit(i){$('#typy').innerHTML=[...new Set(S.items.map(x=>x.typ).filter(Boolean))].sort().map(t=>`<option value="${esc(t)}">`).join('');cur=i;ph={};const f=$('#f');$('#fk').innerHTML=S.kategorie.map(c=>`<option>${esc(c)}</option>`).join('');
f.reset();const d=i||{kategoria:tab};for(const k of['kategoria','podgrupa','nazwa','typ','zastosowanie','kolor','uwagi'])f[k].value=d[k]||'';
$('#v1').src=d.zdjecie||'';$('#v2').src=d.swatch||'';$('#del').style.display=i?'':'none';$('#edt').textContent=i?'Edytuj':'Nowy kosmetyk';$('#ed').showModal()}
function rs(file,cb){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const m=200,s=Math.min(1,m/Math.max(im.width,im.height));
const c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.7))};im.src=r.result};r.readAsDataURL(file)}
$('#p1').onchange=e=>rs(e.target.files[0],u=>{ph.zdjecie=u;$('#v1').src=u});$('#p2').onchange=e=>rs(e.target.files[0],u=>{ph.swatch=u;$('#v2').src=u});
$('#ed').onclose=()=>{if($('#ed').returnValue!='save')return;const f=$('#f');const o=cur||{id:'k'+Date.now(),zdjecie:'',swatch:'',swatchLabel:'Swatch'};
for(const k of['kategoria','podgrupa','nazwa','typ','zastosowanie','kolor','uwagi'])o[k]=f[k].value.trim();Object.assign(o,ph);
if(!cur)S.items.push(o);save();tab=o.kategoria;render()};
$('#del').onclick=()=>{if(confirm('Usunąć „'+cur.nazwa+'”?')){S.items=S.items.filter(i=>i!==cur);save();$('#ed').close();render()}};
function botData(){return{opis:'Lista kosmetyków Magdy. Źródło prawdy. Używaj tylko tych produktów.',aktualizacja:S.updatedAt,liczba:S.items.length,
kategorie:S.kategorie.map(c=>({kategoria:c,produkty:S.items.filter(i=>i.kategoria==c).map(i=>({nazwa:i.nazwa,typ:i.typ||undefined,podgrupa:i.podgrupa||undefined,zastosowanie:i.zastosowanie,kolor:i.kolor||undefined,uwagi:i.uwagi||undefined}))}))}}
function botMd(){let m=`# Kosmetyki Magdy (stan: ${S.updatedAt.slice(0,10)}, ${S.items.length} pozycji)\nŹródło prawdy dla bota. Nie wymyślaj innych produktów.\n`;
for(const c of S.kategorie){m+=`\n## ${c}\n`;let sub=null;for(const i of S.items.filter(i=>i.kategoria==c)){if(i.podgrupa&&i.podgrupa!=sub)m+=`\n### ${i.podgrupa}\n`;sub=i.podgrupa;
m+=`- **${i.nazwa}**${i.typ?' ['+i.typ+']':''}${i.zastosowanie?' – '+i.zastosowanie:''}${i.kolor?(i.kolor.includes('\n')?'\n  - '+i.kolor.split('\n').join('\n  - '):', '+i.kolor):''}${i.uwagi?'. Uwagi: '+i.uwagi:''}\n`}}return m}
async function exp(t){const d=new Date().toISOString().slice(0,10);let name,txt,type='application/json';
if(t=='backup'){name=`kosmetyki-kopia-${d}.json`;txt=JSON.stringify({app:'moje-kosmetyki',...S})}
else if(t=='json'){name='kosmetyki-export-for-bot.json';txt=JSON.stringify(botData(),null,1)}else{name='kosmetyki-export-for-bot.md';txt=botMd();type='text/markdown'}
const file=new File([txt],name,{type});
if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});return}catch(e){if(e.name=='AbortError')return}}
const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=name;a.click()}
function imp(f){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.items)throw 0;if(confirm(`Wczytać ${d.items.length} pozycji? Obecne dane zostaną zastąpione.`)){S={kategorie:d.kategorie,items:d.items,typyV:d.typyV};save();render()}}catch(e){alert('To nie jest kopia z tej apki.')}};r.readAsText(f)}
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');render();
