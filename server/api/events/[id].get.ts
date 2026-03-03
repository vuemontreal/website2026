/**
 * Proxy vers TheMeetHub /api/events/:id — exécuté côté serveur uniquement.
 * Enrichit la réponse en remplaçant les IDs speakers/sponsors par les objets complets.
 */

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) throw createError({ statusCode: 400, message: 'ID manquant' })

  const data = await fetchThemeethub<any>(`/api/events/${id}`, {
    cache: 'force-cache',
    fallback: null,
  })
  if (!data) throw createError({ statusCode: 404, message: 'Événement non trouvé' })

  // TheMeetHub renvoie speakers: ["spk_001"] et sponsors: ["spo_001"] — on enrichit avec les objets complets
  const speakerIds = Array.isArray(data.speakers) ? data.speakers.filter((s: unknown) => typeof s === 'string') : []
  const sponsorIds = Array.isArray(data.sponsors) ? data.sponsors.filter((s: unknown) => typeof s === 'string') : []

  const [speakersResolved, sponsorsResolved] = await Promise.all([
    Promise.all(speakerIds.map((sid: string) =>
      fetchThemeethub<any>(`/api/speakers/${sid}`, { cache: 'force-cache', fallback: null }),
    )).then((list) => list.filter(Boolean)),
    Promise.all(sponsorIds.map((sid: string) =>
      fetchThemeethub<any>(`/api/sponsors/${sid}`, { cache: 'force-cache', fallback: null }),
    )).then((list) => list.filter(Boolean)),
  ])

  return {
    ...data,
    speakers: speakersResolved,
    sponsors: sponsorsResolved.map((s: { companyName?: string; name?: string }) => ({
      ...s,
      name: s.companyName ?? s.name,
    })),
  }
})
