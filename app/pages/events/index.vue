<template>
  <div class="mx-auto max-w-6xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-10 lg:px-8">
    <section>
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {{ $t('events.title') }}
      </h1>
      <p class="mt-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
        {{ $t('home.heroDesc') }}
      </p>
    </section>

    <div v-if="pending" class="flex justify-center py-20">
      <UIcon name="i-heroicons-arrow-path" class="size-12 animate-spin text-primary" />
    </div>

    <template v-else>
      <!-- Section À venir -->
      <section>
        <h2 class="mb-6 text-2xl font-bold">
          {{ $t('events.upcoming') }}
        </h2>
        <div v-if="upcomingEvents.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="event in upcomingEvents"
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
        <div v-else class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-900/30">
          <UIcon name="i-heroicons-calendar-days" class="mx-auto size-12 text-gray-400" />
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

      <!-- Section Passés -->
      <section>
        <h2 class="mb-6 text-2xl font-bold">
          {{ $t('events.past') }}
        </h2>
        <div v-if="pastEvents.length" class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <NuxtLink
            v-for="event in pastEvents"
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
        <div v-else class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-900/30">
          <p class="text-gray-500 dark:text-gray-400">
            {{ $t('events.noPast') }}
          </p>
        </div>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: true })

const { locale } = useI18n()

const { data: rawEvents, pending } = await useFetch<any[]>('/api/public/events', {
  key: computed(() => `events-list-${locale.value}`),
  query: computed(() => ({ locale: locale.value })),
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => [],
})

const today = new Date()
today.setHours(0, 0, 0, 0)

const upcomingEvents = computed(() => {
  const list = rawEvents.value ?? []
  return list
    .filter((e) => {
      const d = e?.date
      if (!d) return false
      const eventDate = new Date(d)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate >= today
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
})

const pastEvents = computed(() => {
  const list = rawEvents.value ?? []
  return list
    .filter((e) => {
      const d = e?.date
      if (!d) return false
      const eventDate = new Date(d)
      eventDate.setHours(0, 0, 0, 0)
      return eventDate < today
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
