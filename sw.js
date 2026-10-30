// Réseau d'abord (pour avoir les mises à jour), copie locale si hors connexion.
// shortcut: sans délai d'attente, une connexion très lente bloque l'affichage ; ajouter un timeout si ça gêne.
const CACHE = "grossesse";
const FICHIERS = ["./", "index.html", "manifest.json", "icon.png", "garcons.txt", "filles.txt"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FICHIERS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request)
      .then(r => {
        const copie = r.clone();
        caches.open(CACHE).then(c => c.put(e.request, copie));
        return r;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
