/**
 * Proxy vers TheMeetHub /api/sponsors — exécuté côté serveur uniquement.
 */

export default defineEventHandler(async () => {
  return fetchThemeethub<any[]>('/api/sponsors', {
    cache: 'force-cache',
    fallback: [],
  })
})
