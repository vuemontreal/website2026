/**
 * Proxy vers TheMeetHub GET /api/public/calendar — sans session, côté serveur uniquement.
 */

export default defineCachedEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  return fetchThemeethub<any>('/api/public/calendar', {
    ...(locale ? { query: { locale } } : {}),
    timeoutMs: 2500,
    cacheMaxAgeSec: 120,
  })
}, {
  maxAge: 120,
  swr: true,
  getKey: (event) => {
    const query = getQuery(event)
    const locale = typeof query.locale === 'string' ? query.locale : 'default'
    return `public-calendar:${locale}`
  },
})
