/**
 * Proxy vers TheMeetHub GET /api/public/events — sans session, côté serveur uniquement.
 */

function normalizePublicEventsList(raw: unknown): unknown[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const o = raw as Record<string, unknown>
    if (Array.isArray(o.events)) return o.events
    if (Array.isArray(o.data)) return o.data
    if (Array.isArray(o.items)) return o.items
    if (Array.isArray(o.results)) return o.results
  }
  return []
}

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  const raw = await fetchThemeethub<unknown>('/api/public/events', {
    ...(locale ? { query: { locale } } : {}),
    cacheMaxAgeSec: 120,
  })
  return normalizePublicEventsList(raw)
}, {
  maxAge: 120,
  swr: true,
  getKey: (event) => {
    const query = getQuery(event)
    const locale = typeof query.locale === 'string' ? query.locale : 'default'
    return `public-events:${locale}`
  },
})
