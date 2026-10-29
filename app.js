const K='kosmetyki-v1';let S=JSON.parse(localStorage.getItem(K)||'null');
if(!S){S={kategorie:SEED.kategorie,items:SEED.items,updatedAt:new Date().toISOString()};save()}
if(!S.twarz){S.twarz=[...SEED.twarz];save()}
let tab=S.kategorie[0],cur=null,ph={};const $=s=>document.querySelector(s);
function save(){S.updatedAt=new Date().toISOString();localStorage.setItem(K,JSON.stringify(S))}
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function tabs(){const t=[...S.kategorie,'Twarz ref.','Kopia'];$('#tabs').innerHTML=t.map(c=>`<button class="${c==tab?'on':''}" data-t="${esc(c)}">${esc(c)}</button>`).join('');
$('#count').textContent=`Razem: ${S.items.length} pozycji`;}
$('#tabs').onclick=e=>{if(e.target.dataset.t){tab=e.target.dataset.t;render()}};
function render(){tabs();const L=$('#list');$('#fab').style.display=S.kategorie.includes(tab)?'':'none';
if(tab=='Twarz ref.'){L.innerHTML='<p>Zdjęcia twarzy z każdej strony. Dotknij zdjęcia, żeby je wymienić.</p><div class="face">'+S.twarz.map((s,n)=>`<img src="${s}" onclick="faceSet(${n})"><button class="big del" onclick="faceDel(${n})">Usuń zdjęcie ${n+1}</button>`).join('')+'</div><button class="big" onclick="faceSet(S.twarz.length)">➕ Dodaj zdjęcie twarzy</button>';return}
if(tab=='Kopia'){L.innerHTML=`<p>Ostatnia zmiana: ${new Date(S.updatedAt).toLocaleString('pl-PL')}</p>
<button class="big" onclick="exp('backup')">💾 Kopia zapasowa (ze zdjęciami)</button>
<button class="big alt" onclick="exp('json')">🤖 Dla bota – JSON</button>
<button class="big alt" onclick="exp('md')">🤖 Dla bota – tekst (Markdown)</button>
<label class="big alt" style="text-align:center">📂 Wczytaj kopię<input type="file" accept=".json" style="display:none" onchange="imp(this.files[0])"></label>
<button class="big del" onclick="if(confirm('Przywrócić listę z arkusza? Twoje zmiany znikną.')){localStorage.removeItem(K);location.reload()}">Przywróć dane startowe</button>`;return}
const q=($('#search')?.value||'').toLowerCase();const its=S.items.filter(i=>i.kategoria==tab);
let h=`<input id="search" placeholder="🔍 Szukaj…" value="${esc(q)}" oninput="render();document.getElementById('search').focus()"><div class="sub">${its.length} szt.</div>`,sub=null;
for(const i of its){if(q&&!JSON.stringify([i.nazwa,i.kolor,i.uwagi,i.zastosowanie]).toLowerCase().includes(q))continue;
if(i.podgrupa!==sub&&i.podgrupa){h+=`<div class="sub">${esc(i.podgrupa)}</div>`}sub=i.podgrupa;
h+=`<div class="card" data-id="${i.id}"><div class="pics">${i.zdjecie?`<img src="${i.zdjecie}" data-f>`:''}${i.swatch?`<img src="${i.swatch}" data-f>`:''}</div>
<div><h3>${esc(i.nazwa)}</h3><div class="meta">${esc(i.zastosowanie)}${i.kolor&&i.kolor.length<40?' · '+esc(i.kolor):''}</div>
${i.kolor&&i.kolor.length>=40?`<div class="note">${esc(i.kolor)}</div>`:''}${i.uwagi?`<div class="note">📝 ${esc(i.uwagi)}</div>`:''}</div></div>`}
L.innerHTML=h;const s=$('#search');if(q){s.setSelectionRange(q.length,q.length)}}
$('#list').onclick=e=>{if(e.target.dataset.f!==undefined){$('#fullimg').src=e.target.src;$('#full').showModal();return}
const c=e.target.closest('.card');if(c)edit(S.items.find(i=>i.id==c.dataset.id))};
$('#fab').onclick=()=>edit(null);
function edit(i){cur=i;ph={};const f=$('#f');$('#fk').innerHTML=S.kategorie.map(c=>`<option>${esc(c)}</option>`).join('');
f.reset();const d=i||{kategoria:tab};for(const k of['kategoria','podgrupa','nazwa','zastosowanie','kolor','uwagi'])f[k].value=d[k]||'';
$('#v1').src=d.zdjecie||'';$('#v2').src=d.swatch||'';$('#del').style.display=i?'':'none';$('#edt').textContent=i?'Edytuj':'Nowy kosmetyk';$('#ed').showModal()}
function faceSet(n){const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=()=>rs(f.files[0],u=>{S.twarz[n]=u;save();render()},800);f.click()}
function faceDel(n){if(confirm('Usunąć zdjęcie twarzy '+(n+1)+'?')){S.twarz.splice(n,1);save();render()}}
function rs(file,cb,M){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const m=M||200,s=Math.min(1,m/Math.max(im.width,im.height));
const c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.7))};im.src=r.result};r.readAsDataURL(file)}
$('#p1').onchange=e=>rs(e.target.files[0],u=>{ph.zdjecie=u;$('#v1').src=u});$('#p2').onchange=e=>rs(e.target.files[0],u=>{ph.swatch=u;$('#v2').src=u});
$('#ed').onclose=()=>{if($('#ed').returnValue!='save')return;const f=$('#f');const o=cur||{id:'k'+Date.now(),zdjecie:'',swatch:'',swatchLabel:'Swatch'};
for(const k of['kategoria','podgrupa','nazwa','zastosowanie','kolor','uwagi'])o[k]=f[k].value.trim();Object.assign(o,ph);
if(!cur)S.items.push(o);save();tab=o.kategoria;render()};
$('#del').onclick=()=>{if(confirm('Usunąć „'+cur.nazwa+'”?')){S.items=S.items.filter(i=>i!==cur);save();$('#ed').close();render()}};
const TB='https://madziajakos-jpg.github.io/moje-kosmetyki/thumbs/';
function purl(i,k){const sd=SEED.items.find(x=>x.id==i.id);if(!i[k]||!sd||sd[k]!==i[k])return undefined;const m=i[k].match(/^data:image\/(\w+)/);return TB+i.id+(k=='swatch'?'-swatch':'')+'.'+(m&&m[1]=='png'?'png':'jpg')}
function furl(v,n){return v===SEED.twarz[n]?TB+'twarz-'+(n+1)+'.jpg':undefined}
function botData(){return{opis:'Lista kosmetyków Magdy. Źródło prawdy. Używaj tylko tych produktów. Pole "zastosowanie" = typ produktu. Zdjęcia: zdjecie/swatch to miniatury base64 (data URL, ~200px); zdjecie_url/swatch_url to te same pliki na GitHub Pages (brak URL = zdjęcie dodane/zmienione w apce, jest tylko base64).',aktualizacja:S.updatedAt,liczba:S.items.length,
twarz_referencja:S.twarz.map((v,n)=>({nr:n+1,url:furl(v,n),zdjecie:v})),
kategorie:S.kategorie.map(c=>({kategoria:c,produkty:S.items.filter(i=>i.kategoria==c).map(i=>({id:i.id,nazwa:i.nazwa,podgrupa:i.podgrupa||undefined,zastosowanie:i.zastosowanie,kolor:i.kolor||undefined,uwagi:i.uwagi||undefined,
zdjecie_url:purl(i,'zdjecie'),swatch_url:purl(i,'swatch'),swatch_opis:i.swatch?(i.swatchLabel||'Swatch'):undefined,zdjecie:i.zdjecie||undefined,swatch:i.swatch||undefined}))}))}}
function botMd(){let m=`# Kosmetyki Magdy (stan: ${S.updatedAt.slice(0,10)}, ${S.items.length} pozycji)\nŹródło prawdy dla bota. Nie wymyślaj innych produktów. Po myślniku: zastosowanie = typ produktu. Zdjęcia: linki do miniatur (te same co w kosmetyki-export-for-bot.json, tam też base64).\n`;
m+=`\n## Twarz – zdjęcia referencyjne\n`+S.twarz.map((v,n)=>{const u=furl(v,n);return u?`- ![Twarz ${n+1}](${u})\n`:`- Twarz ${n+1}: tylko w JSON (base64, twarz_referencja nr ${n+1})\n`}).join('');
for(const c of S.kategorie){m+=`\n## ${c}\n`;let sub=null;for(const i of S.items.filter(i=>i.kategoria==c)){if(i.podgrupa&&i.podgrupa!=sub)m+=`\n### ${i.podgrupa}\n`;sub=i.podgrupa;
const z=purl(i,'zdjecie'),w=purl(i,'swatch');
m+=`- **${i.nazwa}** (id: ${i.id})${i.zastosowanie?' – '+i.zastosowanie:''}${i.kolor?(i.kolor.includes('\n')?'\n  - '+i.kolor.split('\n').join('\n  - '):', '+i.kolor):''}${i.uwagi?'. Uwagi: '+i.uwagi:''}\n`;
if(z)m+=`  - Zdjęcie: ![${i.nazwa}](${z})\n`;else if(i.zdjecie)m+=`  - Zdjęcie: tylko w JSON (base64, id ${i.id})\n`;
if(w)m+=`  - ${i.swatchLabel||'Swatch'}: ![swatch ${i.nazwa}](${w})\n`;else if(i.swatch)m+=`  - Swatch: tylko w JSON (base64, id ${i.id})\n`}}return m}
async function exp(t){const d=new Date().toISOString().slice(0,10);let name,txt,type='application/json';
if(t=='backup'){name=`kosmetyki-kopia-${d}.json`;txt=JSON.stringify({app:'moje-kosmetyki',...S})}
else if(t=='json'){name='kosmetyki-export-for-bot.json';txt=JSON.stringify(botData(),null,1)}else{name='kosmetyki-export-for-bot.md';txt=botMd();type='text/markdown'}
const file=new File([txt],name,{type});
if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});return}catch(e){if(e.name=='AbortError')return}}
const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=name;a.click()}
function imp(f){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.items)throw 0;if(confirm(`Wczytać ${d.items.length} pozycji? Obecne dane zostaną zastąpione.`)){S={kategorie:d.kategorie,items:d.items,twarz:d.twarz||[...SEED.twarz]};save();render()}}catch(e){alert('To nie jest kopia z tej apki.')}};r.readAsText(f)}
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');render();
