export default defineNuxtConfig({
  srcDir: 'app',
  future: {
    compatibilityVersion: 5,
  },
  modules: ['@nuxt/ui', '@nuxtjs/i18n', '@nuxt/image'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: process.env.NODE_ENV !== 'production' },
  app: {
    head: {
      titleTemplate: '%s',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
          media: 'print',
          onload: "this.media='all'",
        },
      ],
    },
  },
  appConfig: {
    ui: {
      primary: 'violet',
      gray: 'zinc',
    },
  },
  colorMode: {
    preference: 'system',
    fallback: 'dark',
    classSuffix: '',
  },
  devServer: {
    port: 3001, // 3000 utilisé par TheMeetHub
  },
  runtimeConfig: {
    /**
     * Timeout (ms) pour les appels serveur → TheMeetHub.
     * 2,5 s était trop court en prod (latence / cold start) et provoquait des faux « non trouvé ».
     * Surcharge : NUXT_THEMEETHUB_FETCH_TIMEOUT_MS (ex. 12000).
     */
    themeethubFetchTimeoutMs: (() => {
      const raw = process.env.NUXT_THEMEETHUB_FETCH_TIMEOUT_MS
      if (raw !== undefined && raw !== '') {
        const n = Number(raw)
        if (Number.isFinite(n) && n >= 1000) return n
      }
      return 8000
    })(),
    public: {
      // En dev, le site tourne sur 3001 (voir devServer) et le hub sur 3000.
      themeethubApiUrl: process.env.NUXT_THEMEETHUB_API_URL || 'http://localhost:3000',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://vuemontreal.ca',
      contactEmail: process.env.NUXT_CONTACT_EMAIL || 'contact@vuemontreal.org',
      /** Hero image (split layout). Ex: https://images.unsplash.com/photo-xxx */
      heroImageUrl: process.env.NUXT_HERO_IMAGE_URL || 'photo-2.webp',
      /** Community/about section image */
      communityImageUrl: process.env.NUXT_COMMUNITY_IMAGE_URL || 'photo-1.webp',
      social: {
        github: process.env.NUXT_SOCIAL_GITHUB || 'https://github.com/vuemontreal',
        linkedin: process.env.NUXT_SOCIAL_LINKEDIN || 'https://www.linkedin.com/company/vue-montreal/',
        discord: process.env.NUXT_SOCIAL_DISCORD || 'https://discord.gg/ARWgnpp3',
      },
      newsletterUrl: process.env.NUXT_NEWSLETTER_URL || '',
      /** Champ email pour newsletter (Mailchimp=EMAIL, Formspree/Buttondown=email) */
      newsletterEmailField: process.env.NUXT_NEWSLETTER_EMAIL_FIELD || 'email',
    },
  },
  i18n: {
    locales: [
      { code: 'fr', name: 'Français', file: 'fr.json', isDefault: true },
      { code: 'en', name: 'English', file: 'en.json' },
    ],
    defaultLocale: 'fr',
    lazy: true,
    langDir: 'locales',
    bundle: { optimizeTranslationDirective: false },
  },
})