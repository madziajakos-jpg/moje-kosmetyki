const C='kosmetyki-v6',F=['./','index.html','app.js','seed.js','manifest.json','icon-192.png','icon-512.png','infografiki/1.jpg','infografiki/2.jpg','infografiki/3.jpg','infografiki/4.jpg','infografiki/5.jpg','infografiki/6.jpg','infografiki/7.jpg','infografiki/schema-twarz.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request))));
