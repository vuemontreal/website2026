/**
 * Helper pour récupérer l'URL de l'image de bannière d'un événement.
 * Champ backend: bannerImageUrl (Prisma)
 */

export function useEventImage() {
  function getEventBannerUrl(event: Record<string, unknown> | null | undefined): string | null {
    if (!event) return null
    const url = event.bannerImageUrl ?? event.banner ?? event.bannerImage ?? event.image ?? event.coverImage
    if (typeof url === 'string') return url
    if (url && typeof url === 'object' && 'url' in url) {
      return (url as { url?: string }).url ?? null
    }
    return null
  }

  return { getEventBannerUrl }
}
