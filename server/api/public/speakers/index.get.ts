/**
 * Proxy vers TheMeetHub GET /api/public/speakers — sans session, côté serveur uniquement.
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  return fetchThemeethub<any[]>('/api/public/speakers', {
    ...(locale ? { query: { locale } } : {}),
    cache: 'force-cache',
    fallback: [],
  })
})
