<template>
  <div class="mx-auto max-w-6xl space-y-16 px-4 py-8 sm:space-y-24 sm:px-6 sm:py-12 lg:px-8">
    <!-- Hero split : texte + image (tendance event/meetup) -->
    <section class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900/50">
      <div class="grid min-h-[360px] lg:grid-cols-2 lg:min-h-[500px]">
        <!-- Texte -->
        <div class="flex flex-col justify-center px-5 py-10 sm:px-12 sm:py-16">
        <NuxtImg src="logo.webp" :alt="$t('site.name')" class="h-auto w-44 max-w-full object-contain sm:w-60" />

          <p class="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            {{ $t('home.subtitle') }}
          </p>
          <h1 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl md:text-5xl">
            {{ $t('home.title') }}
          </h1>
          <p class="mt-6 text-base text-gray-600 dark:text-gray-300 sm:text-lg">
            {{ $t('home.heroDesc') }}
          </p>
          <div class="mt-10 w-full min-w-0">
            <div class="flex w-full min-w-0 flex-col gap-3 sm:flex-row sm:gap-4">
              <NuxtLink
                to="/events"
                class="inline-flex min-h-11 flex-2 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-center text-sm font-semibold text-white shadow-lg transition hover:opacity-90 sm:min-h-0 sm:px-6 sm:text-base"
              >
                {{ $t('home.upcomingEvents') }}
                <UIcon name="i-heroicons-arrow-right" class="size-5 shrink-0" />
              </NuxtLink>
              <NuxtLink
                to="/contact"
                class="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border-2 border-gray-200 px-5 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary sm:min-h-0 sm:px-6 sm:text-base"
              >
                {{ $t('nav.contact') }}
              </NuxtLink>
            </div>
            <a
              href="https://guild.host/vue-montreal"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 border-gray-200 px-5 py-3.5 text-center text-sm font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary sm:px-6 sm:text-base"
            >
              {{ $t('home.joinGuild') }}
            </a>
            <div class="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-gray-500 dark:text-gray-400">
              <span class="inline-flex items-baseline gap-1">
                <span class="font-semibold text-primary">980+</span>
                <span>membres</span>
              </span>
              <span class="text-gray-300 dark:text-gray-700">•</span>
              <span class="inline-flex items-baseline gap-1">
                <span class="font-semibold text-primary">{{ meetupsCount }}</span>
                <span>{{ $t('home.meetupsLabel', { count: meetupsCount }) }}</span>
              </span>
              <span class="text-gray-300 dark:text-gray-700">•</span>
              <span>Montréal</span>
            </div>
          </div>
        </div>
        <!-- Image -->
        <div class="relative min-h-[280px] sm:min-h-[320px] lg:min-h-0">
          <img
            :src="siteConfig.heroImageUrl"
            alt="Vue Montreal - communauté de développeurs"
            class="absolute inset-0 size-full object-cover"
            fetchpriority="high"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent lg:bg-gradient-to-l lg:from-transparent" />
        </div>
      </div>
    </section>

    <!-- Section Communauté (photo + texte) -->
    <section class="grid gap-8 rounded-3xl border border-gray-200/80 bg-white p-0 overflow-hidden shadow-sm dark:border-gray-800 dark:bg-gray-900/50 lg:grid-cols-2">
      <div class="relative order-2 min-h-[300px] lg:order-1 lg:min-h-[400px]">
        <img
          :src="siteConfig.communityImageUrl"
          alt="Communauté Vue Montreal"
          class="absolute inset-0 size-full object-cover"
        />
      </div>
      <div class="flex flex-col justify-center px-5 py-10 sm:px-12 sm:py-16 lg:order-2">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          {{ $t('home.communityTitle') }}
        </h2>
        <p class="mt-6 text-lg leading-relaxed text-gray-600 dark:text-gray-300">
          {{ $t('home.communityDesc') }}
        </p>
        <NuxtLink
          to="/events"
          class="mt-8 inline-flex items-center gap-2 font-semibold text-primary hover:underline"
        >
          {{ $t('home.communityCta') }}
          <UIcon name="i-heroicons-arrow-right" class="size-4" />
        </NuxtLink>
      </div>
    </section>

    <!-- Prochains événements -->
    <section>
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <div class="min-w-0">
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {{ $t('home.upcomingEvents') }}
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ $t('home.eventsSubtitle') }}
          </p>
        </div>
        <NuxtLink
          to="/events"
          class="flex shrink-0 items-center gap-2 self-start font-semibold text-primary transition hover:gap-3 sm:self-auto"
        >
          {{ $t('home.seeAllEvents') }}
          <UIcon name="i-heroicons-arrow-right" class="size-4" />
        </NuxtLink>
      </div>
      <div v-if="pending" class="flex justify-center py-20">
        <UIcon name="i-heroicons-arrow-path" class="size-12 animate-spin text-primary" />
      </div>
      <div v-else-if="events?.length" class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <NuxtLink
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.id}`"
          class="group block overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900/50"
        >
          <div class="relative aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
            <img
              v-if="eventImageUrl(event)"
              :src="eventImageUrl(event)"
              :alt="event.title"
              class="size-full object-cover transition group-hover:scale-105"
            />
            <div v-else class="flex size-full items-center justify-center">
              <UIcon name="i-heroicons-calendar-days" class="size-16 text-gray-300 dark:text-gray-600" />
            </div>
          </div>
          <div class="p-6">
            <h3 class="break-words text-lg font-bold text-gray-900 transition group-hover:text-primary dark:text-gray-100">
              {{ event.title }}
            </h3>
            <p v-if="event.date" class="mt-2 text-sm font-medium text-primary">
              {{ formatDate(event.date) }}
            </p>
            <p v-if="event.description" class="mt-4 line-clamp-2 text-gray-600 dark:text-gray-400">
              {{ event.description }}
            </p>
          </div>
        </NuxtLink>
      </div>
      <div v-else class="mt-10 rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50/50 py-16 text-center dark:border-gray-700 dark:bg-gray-900/30">
        <UIcon name="i-heroicons-calendar-days" class="mx-auto size-14 text-gray-400" />
        <h3 class="mt-4 text-xl font-semibold text-gray-800 dark:text-gray-100">
          {{ $t('events.emptyStateTitle') }}
        </h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400">
          {{ $t('events.emptyStateSubtitle') }}
        </p>
        <div class="mt-6 flex flex-col items-center gap-4">
          <a
            href="https://guild.host/vue-montreal"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center rounded-xl bg-green-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-green-700"
          >
            {{ $t('events.joinGuildCta') }}
          </a>
          <NuxtLink
            to="/contact#speaker"
            class="inline-flex items-center rounded-xl border-2 border-gray-200 bg-white/0 px-5 py-3 font-semibold text-gray-700 transition hover:border-green-600 hover:text-green-600 dark:border-gray-700 dark:text-gray-200 dark:hover:border-green-500 dark:hover:text-green-500"
          >
            {{ $t('contact.proposeSpeaker') }} →
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="rounded-3xl border border-gray-200/80 bg-primary/5 px-5 py-10 dark:border-gray-800 dark:bg-primary/10 sm:px-12 sm:py-16">
      <div class="mx-auto max-w-2xl text-center">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
          {{ $t('footer.newsletter') }}
        </h2>
        <p class="mt-3 text-gray-600 dark:text-gray-300">
          {{ $t('footer.newsletterDesc') }}
        </p>
        <form
          :action="siteConfig.newsletterUrl || undefined"
          method="post"
          target="_blank"
          class="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center"
          @submit="onNewsletterSubmit"
        >
          <UInput
            v-model="newsletterEmail"
            :name="siteConfig.newsletterEmailField"
            type="email"
            :placeholder="$t('footer.newsletterPlaceholder')"
            required
            class="min-w-0 flex-1 sm:max-w-md"
            size="lg"
          />
          <UButton type="submit" size="lg" class="shrink-0">
            {{ $t('footer.newsletterSubmit') }}
          </UButton>
        </form>
        <p v-if="!siteConfig.newsletterUrl" class="mt-3 text-sm text-gray-500">
          {{ $t('footer.newsletterSoon') }}
        </p>
      </div>
    </section>

    <!-- Sponsors -->
    <section class="rounded-3xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/30 sm:p-8 md:p-12">
      <div class="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between sm:gap-6">
        <div class="min-w-0">
          <h2 class="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl">
            {{ $t('home.sponsors') }}
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ $t('home.sponsorsDesc') }}
          </p>
        </div>
        <NuxtLink
          to="/contact#sponsoring"
          class="inline-flex w-full items-center justify-center rounded-xl bg-primary px-6 py-3 text-center font-semibold text-white shadow-lg transition hover:opacity-90 sm:w-auto"
        >
          {{ $t('home.becomeSponsor') }}
        </NuxtLink>
      </div>
      <div v-if="sponsorsPending" class="flex justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="size-10 animate-spin text-primary" />
      </div>
      <div v-else-if="sponsors?.length" class="mt-8 flex flex-wrap items-center justify-center gap-8 sm:mt-12 sm:gap-10 md:gap-12">
        <a
          v-for="sponsor in sponsors"
          :key="sponsor.id ?? sponsor.name ?? sponsor.companyName"
          :href="sponsor.websiteUrl || sponsor.url || '#'"
          :target="(sponsor.websiteUrl || sponsor.url) ? '_blank' : undefined"
          :rel="(sponsor.websiteUrl || sponsor.url) ? 'noopener noreferrer' : undefined"
          class="flex h-16 items-center transition hover:scale-110"
        >
          <img
            v-if="sponsor.logoUrl || sponsor.logo || sponsor.image"
            :src="sponsor.logoUrl || sponsor.logo || sponsor.image"
            :alt="sponsor.name || sponsor.companyName"
            class="max-h-14 max-w-[140px] object-contain opacity-90 transition hover:opacity-100"
          />
          <span v-else class="text-lg font-semibold text-gray-700 dark:text-gray-300">{{ sponsor.name || sponsor.companyName }}</span>
        </a>
      </div>
      <p v-else class="mt-12 text-center text-gray-500 dark:text-gray-400">
        {{ $t('home.noSponsors') }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: true,
})

const siteConfig = useSiteConfig()
const { locale } = useI18n()
const newsletterEmail = ref('')

function onNewsletterSubmit(e: Event) {
  if (!siteConfig.newsletterUrl) e.preventDefault()
}

const { data: rawEvents, pending } = await useFetch<any[]>('/api/public/events', {
  key: computed(() => `events-home-${locale.value}`),
  query: computed(() => ({ locale: locale.value })),
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => [],
})

const meetupsCount = computed(() => (rawEvents.value ?? []).length)

const events = computed(() => {
  const list = rawEvents.value ?? []
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return list.filter((e) => {
    const d = e?.date
    if (!d) return false
    const eventDate = new Date(d)
    eventDate.setHours(0, 0, 0, 0)
    return eventDate >= today
  })
})

const { data: sponsors, pending: sponsorsPending } = await useFetch<any[]>('/api/public/sponsors', {
  key: computed(() => `sponsors-home-${locale.value}`),
  query: computed(() => ({ locale: locale.value })),
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => [],
})

const { getEventBannerUrl } = useEventImage()
function eventImageUrl(event: any): string | undefined {
  return getEventBannerUrl(event) ?? undefined
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    dateStyle: 'medium',
  })
}
</script>
