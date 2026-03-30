type UsePageSeoOptions = {
  title: string
  description: string
  image?: string
  type?: 'website' | 'article'
  noindex?: boolean
}

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

export function usePageSeo(seo: UsePageSeoOptions) {
  const route = useRoute()
  const runtimeConfig = useRuntimeConfig()
  const { locale, locales } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const siteName = 'Vue Montreal'
  const siteUrl = trimTrailingSlash(runtimeConfig.public.siteUrl || 'https://vuemontreal.ca')
  const canonicalPath = computed(() => route.path || '/')
  const canonicalUrl = computed(() => `${siteUrl}${canonicalPath.value}`)

  const fallbackImage = `${siteUrl}/logo.webp`
  const ogImage = computed(() => seo.image || fallbackImage)
  const robots = computed(() => seo.noindex ? 'noindex, nofollow' : 'index, follow')

  useSeoMeta({
    title: seo.title,
    description: seo.description,
    ogTitle: seo.title,
    ogDescription: seo.description,
    ogType: seo.type || 'website',
    ogSiteName: siteName,
    ogUrl: canonicalUrl,
    ogImage: ogImage,
    twitterCard: 'summary_large_image',
    twitterTitle: seo.title,
    twitterDescription: seo.description,
    twitterImage: ogImage,
    robots,
  })

  useHead({
    link: () => {
      const localeLinks = (locales.value as Array<{ code: string }>)
        .map((entry) => {
          const path = switchLocalePath(entry.code)
          if (!path) return null
          return {
            rel: 'alternate',
            hreflang: entry.code,
            href: `${siteUrl}${path}`,
          }
        })
        .filter(Boolean) as Array<{ rel: string; hreflang: string; href: string }>

      return [
        { rel: 'canonical', href: canonicalUrl.value },
        ...localeLinks,
        { rel: 'alternate', hreflang: 'x-default', href: `${siteUrl}${switchLocalePath(locale.value) || canonicalPath.value}` },
      ]
    },
  })
}
