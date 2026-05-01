/**
 * Utilitaires serveur pour l'API TheMeetHub.
 * Toutes les requêtes partent du serveur Nuxt — pas de CORS.
 */

export function getThemeethubUrl(path: string): string {
  const config = useRuntimeConfig()
  const base = config.public.themeethubApiUrl as string
  return `${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`
}

type ThemeethubCacheEntry<T> = {
  expiresAt: number
  data: T
}

function getQueryCacheSegment(query?: Record<string, string>) {
  if (!query) return ''
  const entries = Object.entries(query).sort(([a], [b]) => a.localeCompare(b))
  return entries.map(([k, v]) => `${k}=${v}`).join('&')
}

export async function fetchThemeethub<T>(
  path: string,
  options?: {
    query?: Record<string, string>
    cache?: RequestCache
    /** Timeout (ms) pour éviter de bloquer le SSR si le hub est down */
    timeoutMs?: number
    /** Active un cache mémoire Nitro (TTL en secondes) */
    cacheMaxAgeSec?: number
    /** Valeur retournée si TheMeetHub est indisponible (ex. ECONNREFUSED) */
    fallback?: T
  },
): Promise<T> {
  const url = getThemeethubUrl(path)
  const { fallback, query, cache, timeoutMs, cacheMaxAgeSec } = options ?? {}
  const requestStartedAt = Date.now()
  const cacheTtlMs = (cacheMaxAgeSec ?? 0) * 1000
  const cacheKey = cacheTtlMs > 0
    ? `themeethub:${url}?${getQueryCacheSegment(query)}`
    : null

  if (cacheKey) {
    const storage = useStorage('cache')
    const cached = await storage.getItem<ThemeethubCacheEntry<T>>(cacheKey)
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data
    }
  }

  try {
    const data = await $fetch<T>(url, {
      query,
      cache,
      timeout: timeoutMs ?? 2500,
      credentials: 'omit',
    })
    if (cacheKey) {
      const storage = useStorage('cache')
      await storage.setItem(cacheKey, {
        expiresAt: Date.now() + cacheTtlMs,
        data,
      } satisfies ThemeethubCacheEntry<T>)
    }
    return data
  } catch (e) {
    const elapsedMs = Date.now() - requestStartedAt
    console.error('[themeethub] request failed', {
      url,
      query,
      timeoutMs: timeoutMs ?? 2500,
      elapsedMs,
      error: e instanceof Error ? e.message : String(e),
    })

    // Si le hub est indisponible et qu'on a une valeur expirée en cache, on renvoie quand meme
    // cette valeur stale pour proteger le SSR.
    if (cacheKey) {
      const storage = useStorage('cache')
      const cached = await storage.getItem<ThemeethubCacheEntry<T>>(cacheKey)
      if (cached) {
        console.warn('[themeethub] serving stale cache after upstream failure', { url, query })
        return cached.data
      }
    }
    if (fallback !== undefined) {
      console.warn('[themeethub] serving explicit fallback after upstream failure', { url, query })
      return fallback
    }
    throw e
  }
}
