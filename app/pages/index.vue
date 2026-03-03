<template>
  <div class="mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6 lg:px-8">
    <!-- Hero split : texte + image (tendance event/meetup) -->
    <section class="overflow-hidden rounded-3xl border border-gray-200/80 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900/50">
      <div class="grid min-h-[420px] lg:grid-cols-2 lg:min-h-[500px]">
        <!-- Texte -->
        <div class="flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16">
          <p class="mb-4 text-sm font-semibold uppercase tracking-wider text-primary">
            {{ $t('home.subtitle') }}
          </p>
          <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
            {{ $t('home.title') }}
          </h1>
          <p class="mt-6 text-lg text-gray-600 dark:text-gray-300">
            {{ $t('home.heroDesc') }}
          </p>
          <div class="mt-10 flex flex-wrap gap-4">
            <NuxtLink
              to="/events"
              class="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              {{ $t('home.upcomingEvents') }}
              <UIcon name="i-heroicons-arrow-right" class="size-5" />
            </NuxtLink>
            <NuxtLink
              to="/contact"
              class="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3.5 font-semibold text-gray-700 transition hover:border-primary hover:text-primary dark:border-gray-700 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary"
            >
              {{ $t('nav.contact') }}
            </NuxtLink>
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
      <div class="flex flex-col justify-center px-8 py-12 sm:px-12 sm:py-16 lg:order-2">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
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
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ $t('home.upcomingEvents') }}
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ $t('home.eventsSubtitle') }}
          </p>
        </div>
        <NuxtLink
          to="/events"
          class="flex items-center gap-2 font-semibold text-primary transition hover:gap-3"
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
            <h3 class="text-lg font-bold text-gray-900 transition group-hover:text-primary dark:text-gray-100">
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
        <p class="mt-4 text-gray-500 dark:text-gray-400">
          {{ $t('events.noEvents') }}
        </p>
        <NuxtLink to="/contact#speaker" class="mt-4 inline-block font-medium text-primary hover:underline">
          {{ $t('contact.proposeSpeaker') }} →
        </NuxtLink>
      </div>
    </section>

    <!-- Newsletter -->
    <section class="rounded-3xl border border-gray-200/80 bg-primary/5 px-8 py-12 dark:border-gray-800 dark:bg-primary/10 sm:px-12 sm:py-16">
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
    <section class="rounded-3xl border border-gray-200/80 bg-white p-8 shadow-sm dark:border-gray-800 dark:bg-gray-900/30 sm:p-12">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h2 class="text-3xl font-bold tracking-tight sm:text-4xl">
            {{ $t('home.sponsors') }}
          </h2>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ $t('home.sponsorsDesc') }}
          </p>
        </div>
        <NuxtLink
          to="/contact#sponsoring"
          class="rounded-xl bg-primary px-6 py-3 font-semibold text-white shadow-lg transition hover:opacity-90"
        >
          {{ $t('home.becomeSponsor') }}
        </NuxtLink>
      </div>
      <div v-if="sponsorsPending" class="flex justify-center py-16">
        <UIcon name="i-heroicons-arrow-path" class="size-10 animate-spin text-primary" />
      </div>
      <div v-else-if="sponsors?.length" class="mt-12 flex flex-wrap items-center justify-center gap-12">
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

const { data: rawEvents, pending } = await useFetch<any[]>('/api/events', {
  key: `events-home-${locale.value}`,
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => [],
})

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

const { data: sponsors, pending: sponsorsPending } = await useFetch<any[]>('/api/sponsors', {
  key: 'sponsors-home',
  default: () => [],
})

const { getEventBannerUrl } = useEventImage()
function eventImageUrl(event: any): string | null {
  return getEventBannerUrl(event)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    dateStyle: 'medium',
  })
}
</script>
