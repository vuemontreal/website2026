export default defineNuxtConfig({
  compatibilityDate: "2026-11-15",
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
        { rel: 'icon', type: 'image/webp', href: '/favicon.webp' },
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
    preference: 'dark',
    fallback: 'dark',
    classSuffix: '',
    storageKey: 'nuxt-color-mode-v2',
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
    /**
     * URL du hub — clé privée (serveur seulement).
     * Surcharge runtime : NUXT_THEMEETHUB_API_URL (pas NUXT_PUBLIC_…).
     * Ne pas mettre dans `public` : Nuxt n’applique alors que NUXT_PUBLIC_THEMEETHUB_API_URL,
     * et le défaut localhost est figé en prod si .env n’est pas lu.
     */
    themeethubApiUrl: 'http://localhost:3000',
    /**
     * Configuration Resend (serveur uniquement — jamais exposé au client)
     */
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactToEmail: process.env.CONTACT_TO_EMAIL || '',
    contactFromEmail: process.env.CONTACT_FROM_EMAIL || 'Vue Montreal <onboarding@resend.dev>',
    public: {
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
      /** Feature flags */
      enableNewsletter: process.env.VITE_ENABLE_NEWSLETTER,
      enableDarkMode: process.env.VITE_ENABLE_DARK_MODE,
    },
  },
i18n: {
    locales: [
      { code: 'fr', name: 'Français', isDefault: true },
      { code: 'en', name: 'English' },
    ],
    defaultLocale: 'fr',
    bundle: { optimizeTranslationDirective: false },
    vueI18n: './i18n.config.ts',
  },
  nitro: {
    storage: {
      themeethub: {
        driver: 'memory'
      }
    }
  },
  vite: {
    server: {
      fs: {
        allow: ['.'],
      },
    },
    optimizeDeps: {
      include: ['marked', 'sanitize-html'],
    },
  },
})