# Vue Montreal

Site vitrine de la communauté Vue.js de Montreal. Consomme les données de **TheMeetHub** (plateforme de gestion de meetups).

## Stack

- **Nuxt 5** (compatibilityVersion) + Nuxt UI + i18n (fr/en)

## Configuration

1. Copier `.env.example` vers `.env`
2. Définir `NUXT_THEMEETHUB_API_URL` (URL de base du hub TheMeetHub, sans path) :
   - **Dev** : ex. `http://localhost:3000` (par defaut, la vitrine Nuxt tourne sur `3001` et le hub sur `3000`)
   - **Prod** : URL publique de l’API TheMeetHub

## Développement

```bash
npm install
npm run dev
```

Le site tourne sur http://localhost:3001 (ou le port suivant si occupé).

## Structure (Nuxt 4)

```
├── app/                 # Frontend (srcDir)
│   ├── app.vue
│   ├── app.config.ts
│   ├── layouts/
│   └── pages/
├── server/              # API Nitro, proxy TheMeetHub
├── i18n/locales/        # Traductions (fr, en)
└── nuxt.config.ts
```

## Architecture

- **SSR** : Tout le contenu public est récupéré côté serveur (SEO)
- **Proxy API** : Les routes `/api/public/*` (événements, intervenants, sponsors, calendrier) proxy vers les endpoints publics du hub — pas de session Better Auth
- **Pas de CORS** : Les requêtes partent du serveur Nuxt vers l'API
- **Cache** : Données publiques mises en cache pour limiter les appels

## Optimisations recentes (performance)

- **Images critiques optimisées** :
  - Home : passage de certaines images vers `NuxtImg` avec `width`/`height`, `sizes`, `preload`/`fetchpriority` pour la hero.
  - Objectif : réduire CLS et améliorer LCP.

- **Google Fonts non bloquantes** :
  - Feuille de style chargée en mode non-bloquant (`preload` + `media="print"` puis `onload`).
  - Objectif : réduire les ressources render-blocking.

- **DevTools uniquement hors production** :
  - `devtools.enabled` activé seulement en environnement non-prod.

- **Cache Nitro sur routes publiques** :
  - Les routes `server/api/public/*` utilisent `defineCachedEventHandler` avec `maxAge` + `swr`.
  - Clés de cache différenciées par `locale` et/ou `id`.

- **Cache + resilience au niveau fetch hub** (`server/utils/themeethub.ts`) :
  - Cache mémoire (`useStorage('cache')`) avec TTL (`cacheMaxAgeSec`).
  - Timeout court par défaut pour protéger le SSR.
  - Retour d'une valeur stale (cache expiré) si le hub échoue.
  - Fallback final (`[]` / `null`) selon la route.

## Compromis assumé

La stratégie actuelle privilégie la rapidité et la stabilité SSR :
- en cas de hub lent/indisponible, certaines réponses peuvent revenir avec des données partielles ou vides,
- mais la page continue de rendre rapidement.

Ce compromis est volontaire pour préserver UX + SEO sous dégradation API.
