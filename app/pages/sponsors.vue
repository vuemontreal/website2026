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

    <template v-else>
      <!-- Partenaires financiers -->
      <section v-if="groupedFinancialSponsors && Object.keys(groupedFinancialSponsors).length" class="space-y-8">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
          {{ $t('sponsors.financialTitle') }}
        </h2>
        <div
          v-for="(list, tier) in groupedFinancialSponsors"
          :key="tier"
          class="rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-8"
        >
          <h3 class="mb-4 text-base font-bold uppercase tracking-wider text-primary sm:mb-6 sm:text-lg">
            {{ $t(`sponsors.${tier}`) }}
          </h3>
          <div class="flex flex-wrap items-center justify-center gap-6 sm:justify-start sm:gap-8 md:gap-10">
            <a
              v-for="sponsor in list"
              :key="sponsor.id ?? sponsor.name ?? sponsor.companyName"
              :href="partnerHref(sponsor) || '#'"
              :target="partnerHref(sponsor) ? '_blank' : undefined"
              :rel="partnerHref(sponsor) ? 'noopener noreferrer' : undefined"
              class="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 dark:border-gray-800 dark:bg-gray-900/50"
            >
              <img
                v-if="partnerLogo(sponsor)"
                :src="partnerLogo(sponsor)!"
                :alt="partnerName(sponsor)"
                class="h-10 max-w-[140px] object-contain"
              />
              <span class="min-w-0 flex-1 truncate text-sm font-semibold text-gray-700 dark:text-gray-300">
                {{ partnerName(sponsor) }}
              </span>
              <span class="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90">
                {{ $t('sponsors.seeWebsite') }}
              </span>
            </a>
          </div>
        </div>
      </section>

      <!-- Partenaires communautaires -->
      <section v-if="communityPartners.length" class="space-y-6 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-8">
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
          {{ $t('sponsors.communityTitle') }}
        </h2>
        <div class="flex flex-wrap items-center justify-center gap-4 sm:justify-start sm:gap-6">
          <div
            v-for="partner in communityPartners"
            :key="partner.id ?? partner.name ?? partner.companyName"
            class="flex items-center gap-3 rounded-xl border border-gray-200/80 bg-white px-4 py-3 shadow-sm transition hover:border-primary/40 hover:bg-primary/5 dark:border-gray-800 dark:bg-gray-900/50"
          >
            <img
              v-if="partnerLogo(partner)"
              :src="partnerLogo(partner)!"
              :alt="partnerName(partner)"
              class="h-10 max-w-[140px] object-contain"
            />
            <span class="min-w-0 flex-1 truncate text-sm font-semibold text-gray-700 dark:text-gray-300">
              {{ partnerName(partner) }}
            </span>
            <a
              v-if="partnerHref(partner)"
              :href="partnerHref(partner)!"
              target="_blank"
              rel="noopener noreferrer"
              class="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              {{ $t('sponsors.seeWebsiteArrow') }}
            </a>
          </div>
        </div>
      </section>

      <section
        v-if="!hasVisibleSections"
        class="rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 px-4 py-12 text-center dark:border-gray-700 dark:bg-gray-900/30 sm:p-16"
      >
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
    </template>

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

type SponsorCategory = 'financial' | 'financial_event' | 'community' | 'unknown'

function getSponsorCategory(s: any): SponsorCategory {
  // Back-office: champ `Type` avec options "Financier", "Communautaire", "Financier par event"
  const rawType = s?.Type ?? s?.type
  const t = rawType == null ? '' : String(rawType).trim().toLowerCase()
  if (!t) return 'unknown'
  if (t.includes('event')) return 'financial_event'
  if (t.includes('commun')) return 'community'
  if (t.includes('finan')) return 'financial'
  return 'unknown'
}

function partnerLogo(p: any): string | null {
  return p?.logoUrl || p?.logo || p?.image || null
}

function partnerName(p: any): string {
  return p?.name || p?.companyName || p?.organisationName || p?.communityName || '—'
}

function partnerHref(p: any): string | null {
  return p?.websiteUrl || p?.url || p?.website || p?.link || null
}

const communityPartners = computed(() => {
  const list = sponsors.value ?? []
  const partners = list.filter((s) => getSponsorCategory(s) === 'community')
  partners.sort((a, b) => partnerName(a).localeCompare(partnerName(b)))
  return partners
})

const TIER_ORDER = ['platinum', 'gold', 'silver', 'bronze'] as const

const groupedFinancialSponsors = computed(() => {
  // Backward compat: si `Type` n'existe pas encore, on considère "financier".
  // Exclusion explicite des sponsors "financier par event" sur la page /sponsors.
  const list = (sponsors.value ?? []).filter((s) => {
    const category = getSponsorCategory(s)
    return category === 'financial' || category === 'unknown'
  })
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

const hasVisibleSections = computed(() => {
  const hasFinancial = !!(groupedFinancialSponsors.value && Object.keys(groupedFinancialSponsors.value).length)
  return hasFinancial || communityPartners.value.length > 0
})
</script>
