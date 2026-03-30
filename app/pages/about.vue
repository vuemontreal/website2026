<template>
  <div class="mx-auto max-w-6xl space-y-16 px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
    <!-- En-tête -->
    <header class="space-y-3 pt-10">
      <h1 class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
        {{ $t('nav.about') }}
      </h1>
      <p class="text-base leading-relaxed text-gray-600 dark:text-gray-300 sm:text-lg">
        {{ $t('about.headerSubtitle') }}
      </p>
    </header>

    <!-- Notre histoire -->
    <section class="grid gap-8 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 lg:grid-cols-2 lg:p-8">
      <div class="flex flex-col justify-center">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {{ $t('about.historyTitle') }}
        </h2>
        <p class="mt-5 text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {{ $t('about.historyText') }}
        </p>
      </div>

      <!-- Placeholder image -->
      <div class="relative flex items-center justify-center rounded-2xl border border-gray-200/80 bg-gray-50 p-6 dark:border-gray-800 dark:bg-gray-900/30">
        <div class="text-center">
          <div
            class="mx-auto flex size-20 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-950 dark:ring-gray-800"
          >
            <UIcon name="i-heroicons-photo" class="size-8 text-primary" />
          </div>
          <p class="mt-4 text-sm font-medium text-gray-700 dark:text-gray-200">
            Image à venir
          </p>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Placeholder (illustration)
          </p>
        </div>
      </div>
    </section>

    <!-- Ce qu'on fait -->
    <section class="space-y-8">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          {{ $t('about.whatTitle') }}
        </h2>
      </div>

      <div class="grid gap-6 md:grid-cols-3">
        <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('about.whatCard1Title') }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ $t('about.whatCard1Desc') }}
          </p>
        </article>

        <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('about.whatCard2Title') }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ $t('about.whatCard2Desc') }}
          </p>
        </article>

        <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('about.whatCard3Title') }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ $t('about.whatCard3Desc') }}
          </p>
        </article>
      </div>
    </section>

    <!-- Nos valeurs -->
    <section class="rounded-3xl border border-gray-200/80 bg-gray-50/50 p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/20 sm:p-10">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl md:text-4xl">
          {{ $t('about.valuesTitle') }}
        </h2>
      </div>

      <div class="mt-10 grid gap-6 md:grid-cols-3">
        <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('home.whyJoinCard1Title') }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ $t('home.whyJoinCard1Desc') }}
          </p>
        </article>

        <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('home.whyJoinCard2Title') }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ $t('home.whyJoinCard2Desc') }}
          </p>
        </article>

        <article class="flex flex-col rounded-2xl border border-gray-200/80 bg-white/60 p-6 backdrop-blur dark:border-gray-800 dark:bg-gray-900/30">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {{ $t('home.whyJoinCard3Title') }}
          </h3>
          <p class="mt-3 text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {{ $t('home.whyJoinCard3Desc') }}
          </p>
        </article>
      </div>
    </section>

    <!-- Rejoindre la communauté -->
    <section class="rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-10">
      <div class="mx-auto max-w-3xl text-center">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
          {{ $t('about.joinTitle') }}
        </h2>
        <p class="mt-4 text-base leading-relaxed text-gray-600 dark:text-gray-300">
          {{ $t('about.joinDesc') }}
        </p>
      </div>

      <div class="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:gap-4">
        <UButton
          as="a"
          :href="siteConfig.social.linkedin"
          target="_blank"
          rel="noopener noreferrer"
          variant="solid"
          color="primary"
          class="w-full sm:w-auto"
        >
          {{ $t('about.joinLinkedIn') }}
        </UButton>

        <UButton
          as="a"
          href="https://guild.host/vue-montreal"
          target="_blank"
          rel="noopener noreferrer"
          variant="solid"
          color="primary"
          class="w-full sm:w-auto"
        >
          {{ $t('about.joinGuild') }}
        </UButton>

        <UButton
          as="a"
          :href="siteConfig.social.discord"
          target="_blank"
          rel="noopener noreferrer"
          variant="solid"
          color="primary"
          class="w-full sm:w-auto"
        >
          {{ $t('about.joinDiscord') }}
        </UButton>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  ssr: true,
})

const siteConfig = useSiteConfig()
</script>

