<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const siteConfig = useSiteConfig()

useHead({
  htmlAttrs: {
    lang: () => locale.value,
  },
})

useJsonLd({
  id: 'site',
  value: {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${siteConfig.siteUrl.replace(/\/+$/, '')}/#organization`,
        name: 'Vue Montreal',
        url: siteConfig.siteUrl,
        email: siteConfig.contactEmail,
        sameAs: [
          siteConfig.social.github,
          siteConfig.social.linkedin,
          siteConfig.social.discord,
        ].filter(Boolean),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteConfig.siteUrl.replace(/\/+$/, '')}/#website`,
        url: siteConfig.siteUrl,
        name: 'Vue Montreal',
        inLanguage: locale.value,
        publisher: { '@id': `${siteConfig.siteUrl.replace(/\/+$/, '')}/#organization` },
      },
    ],
  },
})
</script>
