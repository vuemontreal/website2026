<template>
  <div class="mx-auto max-w-6xl space-y-16 px-4 py-10 sm:px-6 lg:px-8">
    <section>
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
        {{ $t('events.title') }}
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
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
        <div v-else class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 py-12 text-center dark:border-gray-700 dark:bg-gray-900/30">
          <UIcon name="i-heroicons-calendar-days" class="mx-auto size-12 text-gray-400" />
          <p class="mt-4 text-gray-500 dark:text-gray-400">
            {{ $t('events.noUpcoming') }}
          </p>
          <NuxtLink to="/contact#speaker" class="mt-4 inline-block font-semibold text-primary hover:underline">
            {{ $t('contact.proposeSpeaker') }} →
          </NuxtLink>
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

const { data: rawEvents, pending } = await useFetch<any[]>('/api/events', {
  key: `events-list-${locale.value}`,
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
function eventImageUrl(event: any): string | null {
  return getEventBannerUrl(event)
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString(locale.value, {
    dateStyle: 'medium',
  })
}
</script>
