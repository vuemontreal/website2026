/**
 * Proxy vers TheMeetHub GET /api/public/speakers/:id — sans session, côté serveur uniquement.
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const query = getQuery(event)
  const locale = typeof query.locale === 'string' ? query.locale : undefined

  const data = await fetchThemeethub<any>(`/api/public/speakers/${id}`, {
    ...(locale ? { query: { locale } } : {}),
    cache: 'force-cache',
    fallback: null,
  })
  if (!data) throw createError({ statusCode: 404, message: 'Intervenant non trouvé' })
  return data
})
