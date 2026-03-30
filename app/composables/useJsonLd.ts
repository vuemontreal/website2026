type JsonLdValue = Record<string, unknown> | Array<Record<string, unknown>>

function trimTrailingSlash(url: string) {
  return url.replace(/\/+$/, '')
}

function stableId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, '_')
}

export function useJsonLd(input: { id: string; value: JsonLdValue | null | undefined }) {
  const runtimeConfig = useRuntimeConfig()
  const siteUrl = trimTrailingSlash(runtimeConfig.public.siteUrl || 'https://vuemontreal.ca')
  const domId = `jsonld-${stableId(input.id)}`

  useHead({
    script: () => {
      if (!input.value) return []
      return [
        {
          id: domId,
          type: 'application/ld+json',
          children: JSON.stringify(input.value),
        },
      ]
    },
  })

  return { siteUrl, domId }
}
