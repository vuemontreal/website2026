/**
 * Utilitaires serveur pour l'API TheMeetHub.
 * Toutes les requêtes partent du serveur Nuxt — pas de CORS.
 */

function resolveRuntimeConfig() {
  try {
    return useRuntimeConfig(useEvent())
  } catch {
    return useRuntimeConfig()
  }
}

function getThemeethubBaseUrl(): string {
  const config = resolveRuntimeConfig()
  const base = String(config.themeethubApiUrl || '').trim()
  if (!base || (process.env.VERCEL && /localhost|127\.0\.0\.1/i.test(base))) {
    console.error('[themeethub] URL hub invalide en prod. Définis NUXT_THEMEETHUB_API_URL sur Vercel (Production + Preview), puis redéploie.', {
      themeethubApiUrl: base || '(vide)',
      vercel: Boolean(process.env.VERCEL),
    })
  }
  return base
}

export function getThemeethubUrl(path: string): string {
  const base = getThemeethubBaseUrl()
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

/** Statut HTTP renvoyé par TheMeetHub dans une erreur $fetch/ofetch. */
export function getUpstreamHttpStatus(e: unknown): number | undefined {
  if (!e || typeof e !== 'object') return undefined
  const o = e as Record<string, unknown>
  if (typeof o.statusCode === 'number') return o.statusCode
  if (typeof o.status === 'number') return o.status
  const resp = o.response as { status?: number } | undefined
  if (resp && typeof resp.status === 'number') return resp.status
  return undefined
}

export function isUpstreamNotFound(e: unknown): boolean {
  return getUpstreamHttpStatus(e) === 404
}

function defaultThemeethubTimeoutMs(): number {
  try {
    const n = Number(resolveRuntimeConfig().themeethubFetchTimeoutMs)
    return Number.isFinite(n) && n >= 1000 ? n : 8000
  } catch {
    return 8000
  }
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
  const resolvedTimeoutMs = timeoutMs ?? defaultThemeethubTimeoutMs()
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
      timeout: resolvedTimeoutMs,
      credentials: 'omit',
    })
    if (cacheKey) {
      // 1. Utilisez le namespace 'themeethub' ou 'memory'
      const storage = useStorage('themeethub')

      // 2. Évitez la collision fichier/dossier en forçant une extension .json
      const safeCacheKey = cacheKey.replace(/\/?$/, '.json')

      await storage.setItem(safeCacheKey, {
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
      timeoutMs: resolvedTimeoutMs,
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
