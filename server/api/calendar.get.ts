/**
 * Proxy vers TheMeetHub /api/calendar — exécuté côté serveur uniquement.
 */

export default defineEventHandler(async () => {
  return fetchThemeethub<any>('/api/calendar', {
    cache: 'force-cache',
    fallback: [],
  })
})
