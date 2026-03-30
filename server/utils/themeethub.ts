/**
 * Utilitaires serveur pour l'API TheMeetHub.
 * Toutes les requêtes partent du serveur Nuxt — pas de CORS.
 */

export function getThemeethubUrl(path: string): string {
  const config = useRuntimeConfig()
  const base = config.public.themeethubApiUrl as string
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

export async function fetchThemeethub<T>(
  path: string,
  options?: {
    query?: Record<string, string>
    cache?: RequestCache
    /** Valeur retournée si TheMeetHub est indisponible (ex. ECONNREFUSED) */
    fallback?: T
  },
): Promise<T> {
  const url = getThemeethubUrl(path)
  const { fallback, query, cache } = options ?? {}
  try {
    return await $fetch<T>(url, {
      query,
      cache,
      credentials: 'omit',
    })
  } catch (e) {
    if (fallback !== undefined) return fallback
    throw e
  }
}
