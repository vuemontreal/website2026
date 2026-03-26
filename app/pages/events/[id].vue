<template>
  <div v-if="pending" class="flex min-h-[50vh] items-center justify-center">
    <UIcon name="i-heroicons-arrow-path" class="size-8 animate-spin text-primary" />
  </div>

  <article v-else-if="event" class="pb-16">
    <!-- Hero banner -->
    <header class="relative aspect-[21/9] min-h-[220px] overflow-hidden bg-gradient-to-br from-violet-700 to-indigo-800 dark:from-violet-950 dark:to-indigo-950 sm:aspect-[3/1]">
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
        <div class="w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div class="flex items-start justify-between gap-4">
            <div>
              <UButton
                variant="ghost"
                color="neutral"
                icon="i-heroicons-arrow-left"
                :to="'/events'"
                class="-ml-2 text-white hover:bg-white/10 hover:text-white"
              >
                {{ $t('nav.events') }}
              </UButton>
              <h1 class="mt-4 text-3xl font-bold text-white drop-shadow-lg sm:text-4xl lg:text-5xl">
                {{ event.title }}
              </h1>
              <div class="mt-3 flex flex-wrap gap-4 text-sm text-white/90">
                <span v-if="event.date" class="inline-flex items-center gap-1.5">
                  <UIcon name="i-heroicons-calendar-days" class="size-4" />
                  {{ formatDate(event.date) }}
                </span>
                <span v-if="event.time" class="inline-flex items-center gap-1.5">
                  <UIcon name="i-heroicons-clock" class="size-4" />
                  {{ event.time }}
                </span>
                <span v-if="eventLocation" class="inline-flex items-center gap-1.5">
                  <UIcon name="i-heroicons-map-pin" class="size-4" />
                  {{ eventLocation }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Content -->
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mt-12 grid gap-12 lg:grid-cols-3">
        <!-- Main content -->
        <div class="lg:col-span-2">
          <!-- Description -->
          <section v-if="event.description" class="mb-12">
            <h2 class="mb-4 text-xl font-semibold">
              {{ $t('event.about') }}
            </h2>
            <div class="prose prose-neutral dark:prose-invert max-w-none prose-p:leading-relaxed">
              {{ event.description }}
            </div>
          </section>
          <section v-else class="mb-12">
            <p class="text-gray-500 dark:text-gray-400">
              {{ $t('events.noDescription') }}
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
                class="flex items-start gap-4 rounded-xl border border-gray-200/80 bg-white p-5 dark:border-gray-800 dark:bg-gray-900/50"
              >
                <UAvatar
                  :src="speaker.avatar || speaker.photo || speaker.image"
                  :alt="speaker.name"
                  size="lg"
                  class="shrink-0"
                />
                <div class="min-w-0 flex-1">
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
          <section>
            <h2 class="mb-6 text-xl font-semibold">
              {{ $t('event.sponsors') }}
            </h2>
            <div v-if="sponsors?.length" class="flex flex-wrap items-center gap-8 rounded-xl border border-gray-200/80 bg-gray-50/80 p-8 dark:border-gray-800 dark:bg-gray-800/30">
              <template v-for="(sponsor, i) in sponsors" :key="i">
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
                    :alt="sponsor.name"
                    class="h-12 max-w-[180px] object-contain"
                  >
                  <span v-else class="font-semibold text-primary">{{ sponsor.name }}</span>
                </a>
                <span v-else class="flex items-center gap-3">
                  <img
                    v-if="sponsorLogo(sponsor)"
                    :src="sponsorLogo(sponsor)!"
                    :alt="sponsor.name"
                    class="h-12 max-w-[180px] object-contain"
                  >
                  <span v-else class="font-semibold text-primary">{{ sponsor.name }}</span>
                </span>
              </template>
            </div>
            <p v-else class="rounded-xl border border-gray-200/80 bg-gray-50/80 p-6 text-gray-500 dark:border-gray-800 dark:bg-gray-800/30 dark:text-gray-400">
              {{ $t('event.noSponsors') }}
            </p>
          </section>
        </div>

        <!-- Sidebar: infos pratiques -->
        <aside class="lg:col-span-1">
          <div class="sticky top-24">
            <div class="rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
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
                <div v-if="eventLocation">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-building-office-2" class="size-4" />
                    {{ $t('event.type') }}
                  </dt>
                  <dd class="mt-1">
                    {{ eventLocation }}
                  </dd>
                </div>
                <div v-if="event.venue">
                  <dt class="flex items-center gap-2 text-sm font-medium text-gray-500 dark:text-gray-400">
                    <UIcon name="i-heroicons-map-pin" class="size-4" />
                    {{ $t('event.venue') }}
                  </dt>
                  <dd class="mt-1">
                    {{ event.venue.name }}
                    <br>
                    {{ event.venue.address }}
                    <br>
                    {{ event.venue.city }}
                    <br>
                    {{ event.venue.state }}
                    <br>
                    {{ event.venue.country }}

                    <div v-if="googleMapsEmbedUrl" class="mt-4 overflow-hidden rounded-xl border border-gray-200/80 dark:border-gray-800">
                      <iframe
                        :src="googleMapsEmbedUrl"
                        class="h-48 w-full"
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
const { locale } = useI18n()
const id = computed(() => route.params.id as string)

const { data: event, pending } = await useFetch<any>(() => `/api/events/${id.value}`, {
  key: () => `event-${id.value}-${locale.value}`,
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => null,
})

const { getEventBannerUrl } = useEventImage()
const bannerUrl = computed(() => getEventBannerUrl(event.value))

const eventLocation = computed(() => {
  const e = event.value
  if (!e?.location) return null
  if (typeof e.location === 'string') return e.location
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

const sponsors = computed(() => {
  const e = event.value
  const list = e?.sponsors ?? e?.Sponsors ?? e?.partners ?? e?.Partners
  const arr = Array.isArray(list) ? list : []
  return arr.filter((s: any) => s && (s.name || s.companyName || s.logoUrl || s.logo || s.image))
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

useHead({
  title: () => event.value?.title ? `${event.value.title} — Vue Montreal` : 'Événement — Vue Montreal',
  meta: [
    {
      name: 'description',
      content: () => event.value?.description?.slice(0, 160) || `${event.value?.title ?? ''} — Vue Montreal`,
    },
  ],
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    dateStyle: 'long',
  })
}
</script>
