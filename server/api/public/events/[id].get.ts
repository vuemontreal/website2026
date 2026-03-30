/**
 * Proxy vers TheMeetHub GET /api/public/events/:id — sans session, côté serveur uniquement.
 * Enrichit la réponse en remplaçant les IDs speakers/sponsors par les objets complets (routes publiques hub).
 */

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined
  const hubQuery = locale ? { locale } : undefined

  const data = await fetchThemeethub<any>(`/api/public/events/${id}`, {
    ...(hubQuery ? { query: hubQuery } : {}),
    cache: 'force-cache',
    timeoutMs: 1200,
    cacheMaxAgeSec: 300,
    fallback: null,
  })
  if (!data) throw createError({ statusCode: 404, message: 'Événement non trouvé' })

  const speakerIds = Array.isArray(data.speakers) ? data.speakers.filter((s: unknown) => typeof s === 'string') : []
  const sponsorIds = Array.isArray(data.sponsors) ? data.sponsors.filter((s: unknown) => typeof s === 'string') : []

  const [speakersResolved, sponsorsResolved] = await Promise.all([
    Promise.all(speakerIds.map((sid: string) =>
      fetchThemeethub<any>(`/api/public/speakers/${sid}`, {
        ...(hubQuery ? { query: hubQuery } : {}),
        cache: 'force-cache',
        timeoutMs: 1000,
        cacheMaxAgeSec: 300,
        fallback: null,
      }),
    )).then((list) => list.filter(Boolean)),
    Promise.all(sponsorIds.map((sid: string) =>
      fetchThemeethub<any>(`/api/public/sponsors/${sid}`, {
        ...(hubQuery ? { query: hubQuery } : {}),
        cache: 'force-cache',
        timeoutMs: 1000,
        cacheMaxAgeSec: 300,
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
  maxAge: 300,
  swr: true,
  getKey: (event) => {
    const id = getRouterParam(event, 'id') || 'unknown'
    const query = getQuery(event)
    const locale = typeof query.locale === 'string' ? query.locale : 'default'
    return `public-event:${id}:${locale}`
  },
})
