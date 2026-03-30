# Vue Montreal

Site vitrine de la communauté Vue.js de Montreal. Consomme les données de **TheMeetHub** (plateforme de gestion de meetups).

## Stack

- **Nuxt 5** (compatibilityVersion) + Nuxt UI + i18n (fr/en)

## Configuration

1. Copier `.env.example` vers `.env`
2. Définir `NUXT_THEMEETHUB_API_URL` (URL de base du hub TheMeetHub, sans path) :
   - **Dev** : ex. `http://localhost:3001` si l’API tourne sur ce port (la vitrine Nuxt est souvent sur un autre port)
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
