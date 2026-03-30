/**
 * Proxy vers TheMeetHub GET /api/public/sponsors — sans session, côté serveur uniquement.
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  return fetchThemeethub<any[]>('/api/public/sponsors', {
    ...(locale ? { query: { locale } } : {}),
    cache: 'force-cache',
    fallback: [],
  })
})
