<template>
  <div class="mx-auto max-w-4xl space-y-12 px-4 py-8 sm:space-y-16 sm:px-6 sm:py-10 lg:px-8">
    <section class="text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {{ $t('sponsors.title') }}
      </h1>
      <p class="mt-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
        {{ $t('home.sponsorsDesc') }}
      </p>
      <NuxtLink
        to="/contact#sponsoring"
        class="mt-8 inline-flex w-full max-w-sm items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl sm:w-auto sm:max-w-none sm:px-8 sm:py-4 sm:text-base sm:hover:scale-105"
      >
        {{ $t('home.becomeSponsor') }}
        <UIcon name="i-heroicons-arrow-right" class="size-5" />
      </NuxtLink>
    </section>

    <section v-if="pending" class="flex justify-center py-16">
      <UIcon name="i-heroicons-arrow-path" class="size-10 animate-spin text-primary" />
    </section>

    <section v-else-if="groupedSponsors && Object.keys(groupedSponsors).length" class="space-y-8">
      <div
        v-for="(list, tier) in groupedSponsors"
        :key="tier"
        class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-8"
      >
        <h2 class="mb-4 text-base font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-lg">
          {{ $t(`sponsors.${tier}`) }}
        </h2>
        <div class="flex flex-wrap items-center justify-center gap-6 sm:justify-start sm:gap-8 md:gap-10">
          <a
            v-for="sponsor in list"
            :key="sponsor.id ?? sponsor.name ?? sponsor.companyName"
            :href="sponsor.websiteUrl || sponsor.url || '#'"
            :target="(sponsor.websiteUrl || sponsor.url) ? '_blank' : undefined"
            :rel="(sponsor.websiteUrl || sponsor.url) ? 'noopener noreferrer' : undefined"
            class="flex items-center transition hover:opacity-80"
          >
            <img
              v-if="sponsor.logoUrl || sponsor.logo || sponsor.image"
              :src="sponsor.logoUrl || sponsor.logo || sponsor.image"
              :alt="sponsor.name || sponsor.companyName"
              class="h-12 max-w-[140px] object-contain"
            />
            <span v-else class="font-semibold text-gray-700 dark:text-gray-300">{{ sponsor.name || sponsor.companyName }}</span>
          </a>
        </div>
      </div>
    </section>

    <section v-else class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-900/30 sm:p-16">
      <p class="text-gray-600 dark:text-gray-400">
        {{ $t('home.noSponsors') }}
      </p>
      <NuxtLink
        to="/contact#sponsoring"
        class="mt-6 inline-block font-semibold text-primary hover:underline"
      >
        {{ $t('home.becomeSponsor') }} →
      </NuxtLink>
    </section>

    <!-- Niveaux -->
    <section class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-8 md:p-10">
      <h2 class="mb-6 text-2xl font-bold">
        {{ $t('contact.sponsoring') }}
      </h2>
      <p class="mb-8 text-gray-600 dark:text-gray-400">
        {{ $t('contact.sponsoringDesc') }}
      </p>
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl border border-gray-200/80 p-5 dark:border-gray-700">
          <span class="font-bold text-amber-600 dark:text-amber-500">{{ $t('sponsors.platinum') }}</span>
          <p class="mt-1 text-xs font-medium text-green-700 dark:text-green-400">{{ $t('sponsors.tierAudience.platinum') }}</p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ $t('sponsors.levels.platinum') }}</p>
        </div>
        <div class="rounded-xl border border-gray-200/80 p-5 dark:border-gray-700">
          <span class="font-bold text-yellow-600 dark:text-yellow-500">{{ $t('sponsors.gold') }}</span>
          <p class="mt-1 text-xs font-medium text-green-700 dark:text-green-400">{{ $t('sponsors.tierAudience.gold') }}</p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ $t('sponsors.levels.gold') }}</p>
        </div>
        <div class="rounded-xl border border-gray-200/80 p-5 dark:border-gray-700">
          <span class="font-bold text-gray-500">{{ $t('sponsors.silver') }}</span>
          <p class="mt-1 text-xs font-medium text-green-700 dark:text-green-400">{{ $t('sponsors.tierAudience.silver') }}</p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ $t('sponsors.levels.silver') }}</p>
        </div>
        <div class="rounded-xl border border-gray-200/80 p-5 dark:border-gray-700">
          <span class="font-bold text-amber-700 dark:text-amber-800">{{ $t('sponsors.bronze') }}</span>
          <p class="mt-1 text-xs font-medium text-green-700 dark:text-green-400">{{ $t('sponsors.tierAudience.bronze') }}</p>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">{{ $t('sponsors.levels.bronze') }}</p>
        </div>
      </div>
      <NuxtLink
        to="/contact#sponsoring"
        class="mt-8 inline-flex font-semibold text-primary hover:underline"
      >
        {{ $t('contact.sponsoringCta') }} →
      </NuxtLink>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: true })

const { locale } = useI18n()

const { data: sponsors, pending } = await useFetch<any[]>('/api/public/sponsors', {
  key: computed(() => `sponsors-page-${locale.value}`),
  query: computed(() => ({ locale: locale.value })),
  getCachedData: (key) => useNuxtData(key).data.value,
  default: () => [],
})

const TIER_ORDER = ['platinum', 'gold', 'silver', 'bronze'] as const

const groupedSponsors = computed(() => {
  const list = sponsors.value ?? []
  if (!list.length) return null
  const byTier: Record<string, any[]> = {}
  for (const s of list) {
    const tier = (s.tier ?? s.level ?? 'bronze').toLowerCase()
    const key = TIER_ORDER.includes(tier) ? tier : 'bronze'
    if (!byTier[key]) byTier[key] = []
    byTier[key].push(s)
  }
  for (const t of TIER_ORDER) {
    if (byTier[t]) byTier[t].sort((a, b) => (a.name ?? a.companyName ?? '').localeCompare(b.name ?? b.companyName ?? ''))
  }
  return Object.fromEntries(TIER_ORDER.filter(t => byTier[t]).map(t => [t, byTier[t]]))
})
</script>
