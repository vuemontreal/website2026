/**
 * Proxy vers TheMeetHub GET /api/public/sponsors/:id — sans session, côté serveur uniquement.
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  const data = await fetchThemeethub<any>(`/api/public/sponsors/${id}`, {
    ...(locale ? { query: { locale } } : {}),
    cache: 'force-cache',
    fallback: null,
  })
  if (!data) throw createError({ statusCode: 404, message: 'Sponsor non trouvé' })
  return data
})
