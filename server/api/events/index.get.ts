/**
 * Proxy vers TheMeetHub /api/events — exécuté côté serveur uniquement.
 */

export default defineEventHandler(async () => {
  return fetchThemeethub<any[]>('/api/events', {
    cache: 'force-cache',
    fallback: [],
  })
})
