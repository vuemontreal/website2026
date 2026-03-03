export default defineNuxtConfig({
  srcDir: 'app',
  future: {
    compatibilityVersion: 5,
  },
  modules: ['@nuxt/ui', '@nuxtjs/i18n'],
  css: ['~/assets/css/main.css'],
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap' },
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
    public: {
      themeethubApiUrl: process.env.NUXT_THEMEETHUB_API_URL || 'http://localhost:3000',
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://vuemontreal.ca',
      contactEmail: process.env.NUXT_CONTACT_EMAIL || 'contact@vuemontreal.ca',
      /** Hero image (split layout). Ex: https://images.unsplash.com/photo-xxx */
      heroImageUrl: process.env.NUXT_HERO_IMAGE_URL || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80',
      /** Community/about section image */
      communityImageUrl: process.env.NUXT_COMMUNITY_IMAGE_URL || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
      social: {
        twitter: process.env.NUXT_SOCIAL_TWITTER || 'https://twitter.com/vuemontreal',
        github: process.env.NUXT_SOCIAL_GITHUB || 'https://github.com/vuemontreal',
        linkedin: process.env.NUXT_SOCIAL_LINKEDIN || '',
        discord: process.env.NUXT_SOCIAL_DISCORD || '',
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
