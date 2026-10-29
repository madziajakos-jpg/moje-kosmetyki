const K='kosmetyki-v1';let S=JSON.parse(localStorage.getItem(K)||'null');
if(!S){S={kategorie:SEED.kategorie,items:SEED.items,updatedAt:new Date().toISOString()};save()}
if(!S.twarz){S.twarz=[...SEED.twarz];save()}
for(const i of S.items){const m=/^rzę-(\d+)$/.exec(i.id);if(m&&i.kategoria=='Rzęsy'&&!i.podgrupa)i.podgrupa=+m[1]<=5?'Kępki':'Kleje'}
const INF=[['1','Infografika 1'],['2','Infografika 2'],['3','Infografika 3'],['4','Infografika 4'],['5','Infografika 5'],['6','Infografika 6'],['7','Infografika 7'],['schema-twarz','Schemat twarzy']];
let tab=S.kategorie[0],cur=null,ph={};const $=s=>document.querySelector(s);
function save(){S.updatedAt=new Date().toISOString();localStorage.setItem(K,JSON.stringify(S))}
const esc=s=>(s||'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function tabs(){const t=[...S.kategorie,'Twarz ref.','Infografiki','Kopia'];$('#tabs').innerHTML=t.map(c=>`<button class="${c==tab?'on':''}" data-t="${esc(c)}">${esc(c)}</button>`).join('');
$('#count').textContent=`Razem: ${S.items.length} pozycji`;}
$('#tabs').onclick=e=>{if(e.target.dataset.t){tab=e.target.dataset.t;render()}};
function render(){tabs();const L=$('#list');$('#fab').style.display=S.kategorie.includes(tab)?'':'none';
if(tab=='Infografiki'){L.innerHTML='<p>Przykłady makijażu i instrukcje. Dotknij, żeby powiększyć.</p><div class="face">'+INF.map(([f,t])=>`<div class="sub">${t}</div><img src="infografiki/${f}.jpg" data-f loading="lazy">`).join('')+'</div>';return}
if(tab=='Twarz ref.'){L.innerHTML='<p>Zdjęcia twarzy z każdej strony (idą do eksportu JSON). Dotknij zdjęcia, żeby powiększyć.</p><div class="face">'+S.twarz.map((s,n)=>`<div class="sub">Twarz ${n+1}</div><img src="${loc(furl(s,n))||s}" data-f><button class="big alt" onclick="faceSet(${n})">🔄 Wymień zdjęcie ${n+1}</button><button class="big del" onclick="faceDel(${n})">Usuń zdjęcie ${n+1}</button>`).join('')+'</div><button class="big" onclick="faceSet(S.twarz.length)">➕ Dodaj zdjęcie twarzy</button>';return}
if(tab=='Kopia'){L.innerHTML=`<p>Ostatnia zmiana: ${new Date(S.updatedAt).toLocaleString('pl-PL')}</p>
<button class="big" onclick="exp('backup')">💾 Kopia zapasowa (ze zdjęciami)</button>
<button class="big" onclick="exp('json')">📤 Eksport JSON dla Stylisty (produkty + twarz)</button>
<p class="meta">Jeden plik JSON: wszystkie produkty z arkusza, duże zdjęcia, zdjęcia twarzy i opis struktury dla narzędzia do makijażu. Przygotowanie może chwilę potrwać.</p>
<label class="big alt" style="text-align:center">📂 Wczytaj kopię<input type="file" accept=".json" style="display:none" onchange="imp(this.files[0])"></label>
<button class="big del" onclick="if(confirm('Przywrócić listę z arkusza? Twoje zmiany znikną.')){localStorage.removeItem(K);location.reload()}">Przywróć dane startowe</button>`;return}
const q=($('#search')?.value||'').toLowerCase();const its=S.items.filter(i=>i.kategoria==tab);
let h=`<input id="search" placeholder="🔍 Szukaj…" value="${esc(q)}" oninput="render();document.getElementById('search').focus()"><div class="sub">${its.length} szt.</div>`,sub=null;
for(const i of its){if(q&&!JSON.stringify([i.nazwa,i.kolor,i.uwagi,i.zastosowanie]).toLowerCase().includes(q))continue;
if(i.podgrupa!==sub&&i.podgrupa){h+=`<div class="sub">${esc(i.podgrupa)}</div>`}sub=i.podgrupa;
h+=`<div class="card" data-id="${i.id}"><div class="pics">${i.zdjecie?`<img src="${loc(purl(i,'zdjecie'))||i.zdjecie}" data-f loading="lazy">`:''}${i.swatch?`<img src="${loc(purl(i,'swatch'))||i.swatch}" data-f loading="lazy" title="${esc(i.swatchLabel||'Swatch')}">`:''}</div>
<div class="txt"><h3>${lp(i)?lp(i)+'. ':''}${esc(i.nazwa)}</h3><div class="meta">${esc(i.zastosowanie)}${i.kolor&&i.kolor.length<40?' · '+esc(i.kolor):''}</div>
${i.kolor&&i.kolor.length>=40?`<div class="note">${esc(i.kolor)}</div>`:''}${i.uwagi?`<div class="note">📝 ${esc(i.uwagi)}</div>`:''}</div></div>`}
L.innerHTML=h;const s=$('#search');if(q){s.setSelectionRange(q.length,q.length)}}
$('#list').onclick=e=>{if(e.target.dataset.f!==undefined){$('#fullimg').src=e.target.src;$('#full').showModal();return}
const c=e.target.closest('.card');if(c)edit(S.items.find(i=>i.id==c.dataset.id))};
$('#fab').onclick=()=>edit(null);
function edit(i){cur=i;ph={};const f=$('#f');$('#fk').innerHTML=S.kategorie.map(c=>`<option>${esc(c)}</option>`).join('');
f.reset();const d=i||{kategoria:tab};for(const k of['kategoria','podgrupa','nazwa','zastosowanie','kolor','uwagi'])f[k].value=d[k]||'';
$('#v1').src=d.zdjecie?(loc(purl(d,'zdjecie'))||d.zdjecie):'';$('#v2').src=d.swatch?(loc(purl(d,'swatch'))||d.swatch):'';$('#l2').textContent=(d.swatchLabel||(d.kategoria=='Tusze'?'Szczoteczka':'Swatch'))+' – wybierz nowe, żeby wymienić';$('#del').style.display=i?'':'none';$('#edt').textContent=i?'Edytuj':'Nowy kosmetyk';$('#ed').showModal()}
function faceSet(n){const f=document.createElement('input');f.type='file';f.accept='image/*';f.onchange=()=>rs(f.files[0],u=>{S.twarz[n]=u;save();render()},1200);f.click()}
function faceDel(n){if(confirm('Usunąć zdjęcie twarzy '+(n+1)+'?')){S.twarz.splice(n,1);save();render()}}
function rs(file,cb,M){const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const m=M||200,s=Math.min(1,m/Math.max(im.width,im.height));
const c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',m>200?.85:.7))};im.src=r.result};r.readAsDataURL(file)}
$('#p1').onchange=e=>rs(e.target.files[0],u=>{ph.zdjecie=u;$('#v1').src=u},1200);$('#p2').onchange=e=>rs(e.target.files[0],u=>{ph.swatch=u;$('#v2').src=u},1200);
$('#ed').onclose=()=>{if($('#ed').returnValue!='save')return;const f=$('#f');const o=cur||{id:'k'+Date.now(),zdjecie:'',swatch:'',swatchLabel:f.kategoria.value=='Tusze'?'Szczoteczka':'Swatch'};
for(const k of['kategoria','podgrupa','nazwa','zastosowanie','kolor','uwagi'])o[k]=f[k].value.trim();Object.assign(o,ph);
if(!cur)S.items.push(o);save();tab=o.kategoria;render()};
$('#del').onclick=()=>{if(confirm('Usunąć „'+cur.nazwa+'”?')){S.items=S.items.filter(i=>i!==cur);save();$('#ed').close();render()}};
const lp=i=>{const m=/-(\d+)$/.exec(i.id||'');return m&&SEED.items.some(x=>x.id==i.id)?+m[1]:undefined};
const loc=u=>u&&u.replace(TB,'thumbs/');
const TB='https://madziajakos-jpg.github.io/moje-kosmetyki/thumbs/';
function purl(i,k){if(!i||!i.id)return undefined;const sd=SEED.items.find(x=>x.id==i.id);if(!i[k]||!sd||sd[k]!==i[k])return undefined;const m=i[k].match(/^data:image\/(\w+)/);return TB+i.id+(k=='swatch'?'-swatch':'')+'.'+(m&&m[1]=='png'?'png':'jpg')}
function furl(v,n){return v===SEED.twarz[n]?TB+'twarz-'+(n+1)+'.jpg':undefined}
const b2d=b=>new Promise(o=>{const r=new FileReader();r.onload=()=>o(r.result);r.readAsDataURL(b)});
async function big(u,v){if(!u)return v;try{const r=await fetch(u,{cache:'no-store'});if(!r.ok)throw 0;return await b2d(await r.blob())}catch(e){return v}}
async function botBig(){const d=botData();const P=[];for(const t of d.twarz_referencja)P.push(big(t.url,t.zdjecie).then(x=>t.zdjecie=x));
for(const c of d.kategorie)for(const p of c.produkty){P.push(big(p.zdjecie_url,p.zdjecie).then(x=>p.zdjecie=x));P.push(big(p.swatch_url,p.swatch).then(x=>p.swatch=x))}await Promise.all(P);return d}
const OPIS={
 cel:'Kosmetyki Magdy – źródło prawdy dla narzędzia do makijażu (Stylista). Używaj WYŁĄCZNIE tych produktów; nie wymyślaj innych.',
 zrodlo:'Arkusz Google „Kosmetyki” (1UeKuwrdLAHj-s0mkmaZx57hBV55W-SgbywiuzHIHuWk) + zmiany zrobione w apce Moje kosmetyki.',
 struktura:{
  twarz_referencja:'Lista zdjęć twarzy Magdy (różne strony/kąty). Pole zdjecie = JPEG base64 (data URL, do ~1200px). url = ten sam plik online (brak = zdjęcie podmienione w apce).',
  kategorie:'Lista kategorii = zakładki arkusza w tej kolejności: Twarz, Cienie, Pozostałe, Tusze, Akcesoria, Rzęsy. Każda ma listę produkty.',
  'produkty[]':{
   id:'Unikalny identyfikator: prefiks kategorii + numer Lp z arkusza (np. twa-1 = Twarz Lp 1, cie-3 = Cienie Lp 3, rzę-6 = Rzęsy Lp 6). Id zaczynające się od „k” = produkt dodany w apce (brak w arkuszu).',
   lp:'Kolumna Lp z arkusza (numer wiersza w zakładce).',
   kategoria:'Zakładka arkusza.',
   podgrupa:'Podgrupa w zakładce – w Rzęsy: „Kępki” (kępki rzęs) i „Kleje” (kleje do rzęs).',
   nazwa:'Kolumna Nazwa.',
   zastosowanie:'Kolumna Zastosowanie = typ produktu / do czego służy.',
   kolor:'Kolumna Kolor – odcień/numer; może mieć kilka linii (np. paleta cieni).',
   uwagi:'Kolumna Uwagi – notatki Magdy (np. „trochę za różowy”).',
   zdjecie:'Kolumna Zdjęcie – zdjęcie OPAKOWANIA produktu, JPEG base64 (data URL, do ~1200px).',
   zdjecie_url:'To samo zdjęcie online (tylko jeśli niezmienione względem arkusza).',
   swatch:'Kolumna Swatch – zdjęcie KOLORU na skórze / próbka (base64). W kategorii Tusze ta kolumna to „Szczoteczka” – zdjęcie szczoteczki tuszu, nie koloru.',
   swatch_typ:'„Swatch” albo „Szczoteczka” – mówi, co pokazuje pole swatch.',
   swatch_url:'To samo zdjęcie swatcha/szczoteczki online (tylko jeśli niezmienione).'
  },
  jak_czytac:'Do doboru odcieni patrz na swatch (kolor na skórze) i porównuj z twarz_referencja. Zdjecie służy do rozpoznania produktu. Brak pola = puste w arkuszu.'
 }};
function botData(){return{opis:OPIS,aktualizacja:S.updatedAt,liczba_produktow:S.items.length,liczba_zdjec_twarzy:S.twarz.length,
twarz_referencja:S.twarz.map((v,n)=>({nr:n+1,opis:'Twarz Magdy – zdjęcie referencyjne '+(n+1),url:furl(v,n),zdjecie:v})),
kategorie:S.kategorie.map(c=>{const p=S.items.filter(i=>i.kategoria==c);return{kategoria:c,podgrupy:[...new Set(p.map(i=>i.podgrupa).filter(Boolean))],liczba:p.length,produkty:p.map(i=>({id:i.id,lp:lp(i),kategoria:i.kategoria,podgrupa:i.podgrupa||undefined,nazwa:i.nazwa,zastosowanie:i.zastosowanie||undefined,kolor:i.kolor||undefined,uwagi:i.uwagi||undefined,
zdjecie_url:purl(i,'zdjecie'),swatch_typ:i.swatch?(i.swatchLabel||'Swatch'):undefined,swatch_url:purl(i,'swatch'),zdjecie:i.zdjecie||undefined,swatch:i.swatch||undefined}))}})}}
async function exp(t){const d=new Date().toISOString().slice(0,10);let name,txt,type='application/json';
if(t=='backup'){name=`kosmetyki-kopia-${d}.json`;txt=JSON.stringify({app:'moje-kosmetyki',...S})}
else{name=`kosmetyki-stylista-${d}.json`;txt=JSON.stringify(await botBig(),null,1)}
const file=new File([txt],name,{type});
if(navigator.canShare&&navigator.canShare({files:[file]})){try{await navigator.share({files:[file],title:name});return}catch(e){if(e.name=='AbortError')return}}
const a=document.createElement('a');a.href=URL.createObjectURL(file);a.download=name;a.click()}
function imp(f){const r=new FileReader();r.onload=()=>{try{const d=JSON.parse(r.result);if(!d.items)throw 0;if(confirm(`Wczytać ${d.items.length} pozycji? Obecne dane zostaną zastąpione.`)){S={kategorie:d.kategorie,items:d.items,twarz:d.twarz||[...SEED.twarz]};save();render()}}catch(e){alert('To nie jest kopia z tej apki.')}};r.readAsText(f)}
if('serviceWorker'in navigator)navigator.serviceWorker.register('sw.js');render();
