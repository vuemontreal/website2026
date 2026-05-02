/**
 * Proxy vers TheMeetHub GET /api/public/sponsors/:id — sans session, côté serveur uniquement.
 */

import { isUpstreamNotFound } from '../../../utils/themeethub'

export default defineCachedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  let data: any
  try {
    data = await fetchThemeethub<any>(`/api/public/sponsors/${id}`, {
      ...(locale ? { query: { locale } } : {}),
      cacheMaxAgeSec: 120,
    })
  } catch (e) {
    if (isUpstreamNotFound(e)) {
      throw createError({ statusCode: 404, message: 'Sponsor non trouvé' })
    }
    throw createError({
      statusCode: 503,
      message: 'TheMeetHub est temporairement indisponible. Réessaie dans un instant.',
    })
  }
  if (!data) throw createError({ statusCode: 404, message: 'Sponsor non trouvé' })
  return data
}, {
  maxAge: 120,
  swr: true,
  getKey: (event) => {
    const id = getRouterParam(event, 'id') || 'unknown'
    const query = getQuery(event)
    const locale = typeof query.locale === 'string' ? query.locale : 'default'
    return `public-sponsor:${id}:${locale}`
  },
})
