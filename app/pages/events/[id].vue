<template>
  <div v-if="pending" class="flex min-h-[50vh] items-center justify-center">
    <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-primary" />
  </div>

  <article v-else-if="event" class="pb-16">
    <!-- Hero banner -->
    <header class="relative aspect-[16/9] min-h-[200px] overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-800 dark:from-violet-950 dark:to-indigo-950 sm:min-h-[220px] sm:aspect-[21/9] lg:aspect-[3/1]">
      <img
        v-if="bannerUrl"
        :src="bannerUrl"
        :alt="event.title"
        class="size-full object-cover"
        fetchpriority="high"
      >
      <div
        class="absolute inset-0 flex flex-col bg-gradient-to-t from-black/80 via-black/40 to-transparent"
        :class="bannerUrl ? 'justify-end' : ''"
      >
        <!-- Placeholder quand pas d'image de bannière -->
        <div
          v-if="!bannerUrl"
          class="flex flex-1 flex-col items-center justify-center gap-4 text-white/60"
        >
          <UIcon name="i-heroicons-photo" class="size-20" />
          <span class="text-lg font-medium">{{ $t('event.bannerPlaceholder') }}</span>
        </div>
        <div class="w-full max-w-7xl min-w-0 px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
          <div class="flex min-w-0 items-start justify-between gap-3 sm:gap-4">
            <div class="min-w-0 flex-1">
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-heroicons-arrow-left"
                :to="'/events'"
                class="-ml-2 max-w-full text-white hover:bg-white/10 hover:text-white"
              >
                <span class="truncate">{{ $t('nav.events') }}</span>
              </UButton>
              <h1 class="mt-3 break-words text-2xl font-bold text-white drop-shadow-lg sm:mt-4 sm:text-3xl md:text-4xl lg:text-5xl">
                {{ event.title }}
              </h1>
              <div class="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-white/90 sm:gap-4 sm:text-sm">
                <span v-if="event.date" class="inline-flex items-center gap-1.5">
                  <UIcon name="i-heroicons-calendar-days" class="size-4" />
                  {{ formatDate(event.date) }}
                </span>
                <span v-if="event.time" class="inline-flex items-center gap-1.5">
                  <UIcon name="i-heroicons-clock" class="size-4" />
                  {{ event.time }}
                </span>
                <span v-if="eventFormatLabel" class="inline-flex items-center gap-1.5">
                  <UIcon :name="eventFormatIcon" class="size-4" />
                  {{ eventFormatLabel }}
                </span>
                <span v-if="physicalLocationSummary" class="inline-flex items-center gap-1.5">
                  <UIcon name="i-heroicons-map-pin" class="size-4" />
                  {{ physicalLocationSummary }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="mx-auto max-w-7xl min-w-0 px-4 sm:px-6 lg:px-8">
      <div class="mt-8 grid gap-10 sm:mt-12 sm:gap-12 lg:grid-cols-3">
        <!-- Main content -->
        <div class="lg:col-span-2">
          <!-- Description -->
          <section v-if="eventDescriptionHtml" class="mb-12">
            <h2 class="mb-4 text-xl font-semibold">
              {{ $t('event.about') }}
            </h2>
            <div
              class="prose prose-neutral dark:prose-invert max-w-none break-words prose-p:leading-relaxed prose-img:max-w-full prose-pre:max-w-full prose-pre:overflow-x-auto prose-a:text-primary prose-a:break-words prose-a:no-underline hover:prose-a:underline"
              v-html="eventDescriptionHtml"
            />
          </section>
          <section v-else class="mb-12">
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('events.noDescription') }}
            </p>
          </section>

          <!-- Replays (événements passés uniquement) -->
          <section v-if="showReplaysSection" class="mb-12">
            <template v-if="replayEmbedItems.length">
              <h2 class="mb-6 text-xl font-semibold">
                {{ $t('event.replays') }}
              </h2>
              <div class="space-y-10">
                <div v-for="(item, idx) in replayEmbedItems" :key="`${item.embedSrc}-${idx}`">
                  <h3 class="mb-3 text-base font-medium text-gray-700 dark:text-gray-300">
                    {{ item.title }}
                  </h3>
                  <div class="relative aspect-video w-full overflow-hidden rounded-xl border border-gray-200/80 bg-black dark:border-gray-800">
                    <iframe
                      :src="item.embedSrc"
                      class="absolute inset-0 size-full"
                      :title="item.title"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen
                      loading="lazy"
                      referrerpolicy="strict-origin-when-cross-origin"
                    />
                  </div>
                </div>
              </div>
            </template>
            <p v-else class="text-sm text-gray-600 dark:text-gray-400">
              <a
                href="https://www.youtube.com/@VueMontrealOrg"
                target="_blank"
                rel="noopener noreferrer"
                class="text-primary underline-offset-2 hover:underline"
              >
                {{ $t('event.replaysYoutubeChannel') }}
              </a>
            </p>
          </section>

          <!-- Speakers -->
          <section class="mb-12">
            <h2 class="mb-6 text-xl font-semibold">
              {{ $t('event.speakers') }}
            </h2>
            <div v-if="speakers?.length" class="grid gap-6 sm:grid-cols-2">
              <div
                v-for="(speaker, i) in speakers"
                :key="i"
                class="flex min-w-0 flex-col items-center gap-4 rounded-xl border border-gray-200/80 bg-white p-4 dark:border-gray-800 dark:bg-gray-900/50 sm:flex-row sm:items-start sm:p-5"
              >
                <UAvatar
                  :src="speaker.avatar || speaker.photo || speaker.image"
                  :alt="speaker.name"
                  size="lg"
                  class="shrink-0"
                />
                <div class="min-w-0 flex-1 text-center sm:text-left">
                  <p class="font-semibold">
                    {{ speaker.name || speaker.title }}
                  </p>
                  <p v-if="speaker.role || speaker.title" class="text-sm text-gray-500 dark:text-gray-400">
                    {{ speaker.role || speaker.title }}
                  </p>
                  <p v-if="speaker.bio" class="mt-2 text-sm">
                    {{ speaker.bio }}
                  </p>
                  <!-- Liens sociaux: LinkedIn, X, site web -->
                  <div v-if="speakerSocials(speaker).length" class="mt-3 flex flex-wrap gap-3">
                    <a
                      v-for="link in speakerSocials(speaker)"
                      :key="link.href"
                      :href="link.href"
                      target="_blank"
                      rel="noopener"
                      class="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
                      :aria-label="link.label"
                    >
                      <UIcon :name="link.icon" class="size-4" />
                      {{ link.label }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <p v-else class="rounded-xl border border-gray-200/80 bg-gray-50/80 p-6 text-gray-500 dark:border-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
              {{ $t('event.noSpeakers') }}
            </p>
          </section>

          <!-- Sponsors / Partenaires -->
          <section v-if="displaySponsors.length">
            <h2 class="mb-6 text-xl font-semibold">
              {{ $t('event.sponsors') }}
            </h2>
            <div class="flex flex-wrap items-center justify-center gap-6 rounded-xl border border-gray-200/80 bg-gray-50/80 p-4 dark:border-gray-800 dark:bg-gray-800/30 sm:justify-start sm:gap-8 sm:p-6 md:p-8">
              <template v-for="(sponsor, i) in displaySponsors" :key="i">
                <a
                  v-if="sponsorWebsite(sponsor)"
                  :href="sponsorWebsite(sponsor)!"
                  target="_blank"
                  rel="noopener"
                  class="flex items-center gap-3 transition opacity-80 hover:opacity-100"
                >
                  <img
                    v-if="sponsorLogo(sponsor)"
                    :src="sponsorLogo(sponsor)!"
                    :alt="sponsorName(sponsor)"
                    class="h-12 max-w-[180px] object-contain"
                  >
                  <div class="min-w-0">
                    <span class="block font-semibold text-primary">{{ sponsorName(sponsor) }}</span>
                    <p v-if="sponsor.isOfficial" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ $t('event.officialSponsorLabel') }}
                    </p>
                  </div>
                </a>
                <span v-else class="flex items-center gap-3">
                  <img
                    v-if="sponsorLogo(sponsor)"
                    :src="sponsorLogo(sponsor)!"
                    :alt="sponsorName(sponsor)"
                    class="h-12 max-w-[180px] object-contain"
                  >
                  <div class="min-w-0">
                    <span class="block font-semibold text-primary">{{ sponsorName(sponsor) }}</span>
                    <p v-if="sponsor.isOfficial" class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {{ $t('event.officialSponsorLabel') }}
                    </p>
                  </div>
                </span>
              </template>
            </div>
          </section>
        </div>

        <!-- Sidebar: infos pratiques -->
        <aside class="min-w-0 lg:col-span-1">
          <div class="lg:sticky lg:top-24">
            <div class="rounded-2xl border border-gray-200/80 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-6">
              <h3 class="mb-4 font-bold">
                {{ $t('event.details') }}
              </h3>
              <dl class="space-y-4">
                <div v-if="event.date">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-calendar-days" class="size-4" />
                    {{ $t('event.date') }}
                  </dt>
                  <dd class="mt-1">
                    {{ formatDate(event.date) }}
                  </dd>
                </div>
                <div v-if="event.time">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-clock" class="size-4" />
                    {{ $t('event.time') }}
                  </dt>
                  <dd class="mt-1">
                    {{ event.time }}
                  </dd>
                </div>
                <div v-if="eventFormatLabel">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon :name="eventFormatIcon" class="size-4" />
                    {{ $t('event.type') }}
                  </dt>
                  <dd class="mt-1">
                    {{ eventFormatLabel }}
                  </dd>
                </div>
                <div v-if="physicalLocationSummary">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-map-pin" class="size-4" />
                    {{ $t('event.locationShort') }}
                  </dt>
                  <dd class="mt-1">
                    {{ physicalLocationSummary }}
                  </dd>
                </div>
                <div v-if="event.venue">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-map-pin" class="size-4" />
                    {{ $t('event.venue') }}
                  </dt>
                  <dd class="mt-1 break-words text-sm sm:text-base">
                    <b>{{ event.venue.name }}</b>
                    <br>
                    {{ event.venue.address }}
                    <br>
                    {{ event.venue.city }}
                    <br>
                    {{ event.venue.state }}
                    <br>
                    {{ event.venue.country }}

                    <div v-if="googleMapsEmbedUrl" class="mt-4 max-w-full overflow-hidden rounded-xl border border-gray-200/80 dark:border-gray-800">
                      <iframe
                        :src="googleMapsEmbedUrl"
                        class="h-44 w-full max-w-full sm:h-48"
                        loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade"
                        :title="`Google Maps - ${event.venue.name || 'Venue'}`"
                      />
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </article>

  <!-- Not found -->
  <div v-else class="mx-auto max-w-2xl px-4 py-16">
    <div class="rounded-2xl border border-gray-200/80 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
    <h2 class="text-xl font-bold">
        {{ $t('events.notFound') }}
      </h2>
      <p class="mt-4 text-gray-500 dark:text-gray-400">
        {{ $t('events.noEvents') }}
      </p>
      <NuxtLink to="/events" class="mt-6 inline-block rounded-xl bg-primary px-6 py-3 font-semibold text-white transition hover:opacity-90">
        {{ $t('nav.events') }}
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: true })

const route = useRoute()
const { locale, t } = useI18n()
const { toSanitizedRichHtml, toPlainTextExcerpt } = useRichText()

const eventDescriptionHtml = computed(() => toSanitizedRichHtml(event.value?.description))
const id = computed(() => route.params.id as string)

const { data: event, pending } = await useFetch<any>(() => `/api/public/events/${id.value}`, {
  key: () => `event-${id.value}-${locale.value}`,
  query: computed(() => ({ locale: locale.value })),
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => null,
})

const { data: allSponsors } = await useFetch<any[]>('/api/public/sponsors', {
  key: computed(() => `event-global-sponsors-${locale.value}`),
  query: computed(() => ({ locale: locale.value })),
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => [],
})

const { getEventBannerUrl } = useEventImage()
const bannerUrl = computed(() => getEventBannerUrl(event.value))

/** Valeurs connues TheMeetHub / API (snake_case, tirets ou synonymes). */
function normalizeEventFormatKey(raw: string): 'in_person' | 'online' | 'hybrid' | null {
  const v = raw.trim().toLowerCase().replace(/-/g, '_')
  if (v === 'in_person') return 'in_person'
  if (v === 'online' || v === 'virtual' || v === 'remote') return 'online'
  if (v === 'hybrid') return 'hybrid'
  return null
}

function getEventFormatRaw(e: Record<string, unknown> | null | undefined): string | null {
  if (!e) return null
  for (const key of ['type', 'format', 'eventType', 'event_type'] as const) {
    const v = e[key]
    if (typeof v === 'string' && v.trim()) return v
  }
  if (typeof e.location === 'string' && e.location.trim()) {
    if (normalizeEventFormatKey(e.location)) return e.location
  }
  return null
}

const eventFormatKey = computed(() => {
  const raw = getEventFormatRaw(event.value)
  return raw ? normalizeEventFormatKey(raw) : null
})

/** Aligné sur la liste événements : jour calendaire en timezone locale. */
const isPastEvent = computed(() => {
  const e = event.value
  if (!e?.date) return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const eventDate = new Date(e.date)
  eventDate.setHours(0, 0, 0, 0)
  return eventDate < today
})

function youtubeVideoIdFromString(s: string): string | null {
  const trimmed = s.trim()
  if (!trimmed) return null
  const fromUrl =
    /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/.exec(trimmed)
  const id = fromUrl?.[1]
  if (id) return id
  return /^[a-zA-Z0-9_-]{11}$/.test(trimmed) ? trimmed : null
}

function normalizeReplayVideoEntry(
  v: Record<string, unknown> | string,
  titleFallback: string,
): { title: string; embedSrc: string } | null {
  if (typeof v === 'string') {
    const id = youtubeVideoIdFromString(v)
    if (!id) return null
    return { title: titleFallback, embedSrc: `https://www.youtube.com/embed/${id}` }
  }
  const idField = v.youtubeId ?? v.videoId ?? v.youtube_id ?? v.video_id
  const urlField = v.youtube_url ?? v.url ?? v.youtubeUrl ?? v.link ?? v.href
  const id =
    (typeof idField === 'string' ? youtubeVideoIdFromString(idField) : null)
    ?? (typeof urlField === 'string' ? youtubeVideoIdFromString(urlField) : null)
  if (!id) return null
  const title =
    (typeof v.title === 'string' && v.title.trim())
    || (typeof v.name === 'string' && v.name.trim())
    || titleFallback
  return { title, embedSrc: `https://www.youtube.com/embed/${id}` }
}

const replayEmbedItems = computed(() => {
  const e = event.value
  const raw = e?.videos ?? e?.Videos
  if (!Array.isArray(raw)) return []
  const fallback = t('event.replayVideoTitleFallback')
  return raw
    .map((x) =>
      x != null && (typeof x === 'object' || typeof x === 'string')
        ? normalizeReplayVideoEntry(x as Record<string, unknown> | string, fallback)
        : null,
    )
    .filter((item): item is { title: string; embedSrc: string } => item != null)
})

const showReplaysSection = computed(() => isPastEvent.value)

const eventFormatLabel = computed(() => {
  const raw = getEventFormatRaw(event.value)
  if (!raw) return null
  const key = normalizeEventFormatKey(raw)
  if (key) return t(`event.format.${key}`)
  return raw.replace(/_/g, ' ')
})

const eventFormatIcon = computed(() => {
  switch (eventFormatKey.value) {
    case 'online':
      return 'i-heroicons-computer-desktop'
    case 'hybrid':
      return 'i-heroicons-arrows-right-left'
    default:
      return 'i-heroicons-building-office-2'
  }
})

/** Adresse / lieu court (pas le mode in_person / online / hybrid stocké dans location). */
const physicalLocationSummary = computed(() => {
  const e = event.value
  if (!e?.location) return null
  if (typeof e.location === 'string') {
    if (normalizeEventFormatKey(e.location)) return null
    return e.location
  }
  const parts = [e.location.name, e.location.address, e.location.city].filter(Boolean)
  return parts.join(', ') || null
})

const speakers = computed(() => {
  const e = event.value
  let arr = e?.speakers ?? e?.Speakers ?? e?.intervenants ?? e?.Intervenants
  if (!Array.isArray(arr)) {
    // Speakers peuvent être dans Talks (ex: talks[].Speaker)
    const talks = e?.talks ?? e?.Talks ?? []
    arr = Array.isArray(talks)
      ? talks.map((t) => t?.speaker ?? t?.Speaker).filter(Boolean)
      : []
  }
  // Dédupliquer et filtrer les entrées vides ou sans nom
  const seen = new Set<string>()
  return arr.filter((s: any) => {
    if (!s || (!s.name && !s.title && !s.bio)) return false
    const key = (s.name || s.id || s.title || '').toString()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

type SponsorCategory = 'financial' | 'financial_event' | 'community' | 'unknown'

function sponsorTypeRaw(s: any): string {
  const raw = s?.Type ?? s?.type ?? ''
  return String(raw).trim().toLowerCase()
}

function sponsorCategory(s: any): SponsorCategory {
  const type = sponsorTypeRaw(s)
  if (!type) return 'unknown'
  if (type.includes('commun')) return 'community'
  if (type.includes('event') && type.includes('finan')) return 'financial_event'
  if (type.includes('finan')) return 'financial'
  return 'unknown'
}

const eventSponsors = computed(() => {
  const e = event.value
  const list = e?.sponsors ?? e?.Sponsors ?? e?.partners ?? e?.Partners
  const arr = Array.isArray(list) ? list : []
  return arr.filter((s: any) => s && (s.name || s.companyName || s.logoUrl || s.logo || s.image))
})

const displaySponsors = computed(() => {
  const eventFinancial = eventSponsors.value.filter((s: any) => sponsorCategory(s) === 'financial_event')
  const globalFinancial = (allSponsors.value ?? []).filter((s: any) => sponsorCategory(s) === 'financial')

  const merged = [
    ...eventFinancial.map((s: any) => ({ ...s, isOfficial: false })),
    ...globalFinancial.map((s: any) => ({ ...s, isOfficial: true })),
  ]

  const seen = new Set<string>()
  return merged.filter((s: any) => {
    const key = String(s.id ?? `${sponsorName(s)}::${sponsorWebsite(s) ?? ''}`).toLowerCase()
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
})

const googleMapsEmbedUrl = computed<string | null>(() => {
  const v = event.value?.venue
  if (!v) return null

  const placeId = v?.placeId ?? v?.googlePlaceId ?? v?.google_place_id

  // TheMeetHub renvoie parfois lat/lng directement, parfois dans un objet/coordonnées.
  const lat =
    v?.latitude ??
    v?.lat ??
    v?.Latitude ??
    v?.Lat ??
    v?.geo?.latitude ??
    v?.geo?.lat ??
    v?.coordinates?.latitude ??
    v?.coordinates?.lat

  const lng =
    v?.longitude ??
    v?.lng ??
    v?.Longitude ??
    v?.Lng ??
    v?.geo?.longitude ??
    v?.geo?.lng ??
    v?.coordinates?.longitude ??
    v?.coordinates?.lng

  // Variante: coordonnées en tableau [lat, lng]
  const coordArr = v?.coordinates ?? v?.geo?.coordinates ?? null
  const latFromArr = Array.isArray(coordArr) ? coordArr[0] : null
  const lngFromArr = Array.isArray(coordArr) ? coordArr[1] : null

  const latFinal = lat ?? latFromArr
  const lngFinal = lng ?? lngFromArr

  // Priorité: pointer vers l'adresse affichée (street + ville + région + pays).
  // On évite d'inclure le nom de la venue si l'adresse existe, pour limiter les ambiguïtés.
  const addressParts = [v?.address, v?.city, v?.state, v?.country].filter(Boolean)
  const addressQuery = addressParts.join(', ') || [v?.name, v?.address].filter(Boolean).join(', ')

  let q: string | null = null
  if (addressQuery) q = addressQuery
  else if (placeId) q = `place_id:${placeId}`
  else if (latFinal != null && lngFinal != null) q = `${latFinal},${lngFinal}`

  if (!q) return null
  return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`
})

// Helpers pour les nouveaux champs backend
function speakerSocials(speaker: { socials?: Record<string, string> }) {
  const s = speaker?.socials ?? {}
  const links: { href: string; label: string; icon: string }[] = []
  if (s.linkedin) links.push({ href: s.linkedin, label: 'LinkedIn', icon: 'i-heroicons-arrow-top-right-on-square' })
  if (s.x || s.twitter) links.push({ href: s.x || s.twitter!, label: 'X', icon: 'i-heroicons-arrow-top-right-on-square' })
  if (s.website) links.push({ href: s.website, label: 'Site web', icon: 'i-heroicons-globe-alt' })
  return links
}

function sponsorLogo(sponsor: { logoUrl?: string; logo?: string; image?: string }) {
  return sponsor?.logoUrl ?? sponsor?.logo ?? sponsor?.image ?? null
}

function sponsorWebsite(sponsor: { websiteUrl?: string; url?: string }) {
  return sponsor?.websiteUrl ?? sponsor?.url ?? null
}

function sponsorName(sponsor: { name?: string; companyName?: string }) {
  return sponsor?.name ?? sponsor?.companyName ?? ''
}

useHead({
  title: () => event.value?.title ? `${event.value.title} — Vue Montreal` : 'Événement — Vue Montreal',
  meta: [
    {
      name: 'description',
      content: () =>
        toPlainTextExcerpt(event.value?.description, 160)
        || `${event.value?.title ?? ''} — Vue Montreal`,
    },
  ],
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    dateStyle: 'long',
  })
}
</script>
