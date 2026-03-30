type PublicEvent = {
  id?: string | number
  date?: string
  updatedAt?: string
}

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

function toIsoDate(value?: string) {
  if (!value) return new Date().toISOString()
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString()
}

function xmlEscape(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = trimTrailingSlash(config.public.siteUrl || 'https://vuemontreal.ca')
  const apiBaseUrl = trimTrailingSlash(config.public.themeethubApiUrl || '')

  const staticPaths = ['/', '/about', '/events', '/sponsors', '/contact']
  const urls = new Map<string, string>()

  for (const path of staticPaths) {
    urls.set(path, new Date().toISOString())
    urls.set(`/en${path === '/' ? '' : path}`, new Date().toISOString())
  }

  if (apiBaseUrl) {
    for (const locale of ['fr', 'en']) {
      try {
        const events = await $fetch<PublicEvent[]>(`${apiBaseUrl}/api/public/events`, {
          query: { locale },
        })

        for (const item of events || []) {
          if (!item?.id) continue
          const suffix = locale === 'en' ? '/en' : ''
          const path = `${suffix}/events/${item.id}`
          urls.set(path, toIsoDate(item.updatedAt || item.date))
        }
      }
      catch {
        // Keep sitemap available even if the upstream API fails.
      }
    }
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${[...urls.entries()].map(([path, lastmod]) => `  <url>
    <loc>${xmlEscape(`${siteUrl}${path}`)}</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return body
})
