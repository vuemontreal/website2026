/**
 * Proxy vers TheMeetHub GET /api/public/calendar — sans session, côté serveur uniquement.
 */

import { defineEventHandler, getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  return fetchThemeethub<any>('/api/public/calendar', {
    ...(locale ? { query: { locale } } : {}),
    cacheMaxAgeSec: 120,
  })
})
