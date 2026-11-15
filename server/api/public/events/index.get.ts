/**
 * Proxy vers TheMeetHub GET /api/public/events — sans session, côté serveur uniquement.
 */
import { defineEventHandler, getQuery } from 'h3'

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

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  const raw = await fetchThemeethub<unknown>('/api/public/events', {
    ...(locale ? { query: { locale } } : {}),
    cacheMaxAgeSec: 120,
  })
  return normalizePublicEventsList(raw)
})
