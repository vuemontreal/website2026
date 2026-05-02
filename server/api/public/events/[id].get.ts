/**
 * Proxy vers TheMeetHub GET /api/public/events/:id — sans session, côté serveur uniquement.
 * Enrichit la réponse en remplaçant les IDs speakers/sponsors par les objets complets (routes publiques hub).
 */

import { isUpstreamNotFound } from '../../../utils/themeethub'

function normalizePublicEventDetail(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null
  if (typeof raw === 'object' && !Array.isArray(raw)) {
    const o = raw as Record<string, unknown>
    if (o.event && typeof o.event === 'object' && !Array.isArray(o.event))
      return o.event as Record<string, unknown>
    if (o.data && typeof o.data === 'object' && !Array.isArray(o.data))
      return o.data as Record<string, unknown>
    return o
  }
  return null
}

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined
  const hubQuery = locale ? { locale } : undefined

  let data: any
  try {
    // Pas de fallback: un timeout ne doit pas être confondu avec un 404 (contenu pourtant en base).
    data = await fetchThemeethub<any>(`/api/public/events/${id}`, {
      ...(hubQuery ? { query: hubQuery } : {}),
      cacheMaxAgeSec: 120,
    })
  } catch (e) {
    if (isUpstreamNotFound(e)) {
      throw createError({ statusCode: 404, message: 'Événement non trouvé' })
    }
    throw createError({
      statusCode: 503,
      message: 'TheMeetHub est temporairement indisponible. Réessaie dans un instant.',
    })
  }

  const normalized = normalizePublicEventDetail(data)
  if (!normalized) throw createError({ statusCode: 404, message: 'Événement non trouvé' })
  data = normalized

  const speakerIds = Array.isArray(data.speakers) ? data.speakers.filter((s: unknown) => typeof s === 'string') : []
  const sponsorIds = Array.isArray(data.sponsors) ? data.sponsors.filter((s: unknown) => typeof s === 'string') : []

  const [speakersResolved, sponsorsResolved] = await Promise.all([
    Promise.all(speakerIds.map((sid: string) =>
      fetchThemeethub<any>(`/api/public/speakers/${sid}`, {
        ...(hubQuery ? { query: hubQuery } : {}),
        cacheMaxAgeSec: 120,
        fallback: null,
      }),
    )).then((list) => list.filter(Boolean)),
    Promise.all(sponsorIds.map((sid: string) =>
      fetchThemeethub<any>(`/api/public/sponsors/${sid}`, {
        ...(hubQuery ? { query: hubQuery } : {}),
        cacheMaxAgeSec: 120,
        fallback: null,
      }),
    )).then((list) => list.filter(Boolean)),
  ])

  return {
    ...data,
    speakers: speakersResolved,
    sponsors: sponsorsResolved.map((s: { companyName?: string; name?: string }) => ({
      ...s,
      name: s.companyName ?? s.name,
    })),
  }
}, {
  maxAge: 120,
  swr: true,
  getKey: (event) => {
    const id = getRouterParam(event, 'id') || 'unknown'
    const query = getQuery(event)
    const locale = typeof query.locale === 'string' ? query.locale : 'default'
    return `public-event:${id}:${locale}`
  },
})
