<template>
  <div class="mx-auto max-w-3xl space-y-10 px-4 py-8 sm:space-y-12 sm:px-6 sm:py-10 lg:px-8">
    <section class="text-center">
      <h1 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
        {{ $t('contact.title') }}
      </h1>
      <p class="mt-4 text-base text-gray-600 dark:text-gray-400 sm:text-lg">
        {{ $t('contact.subtitle') }}
      </p>
    </section>

    <div class="space-y-6">
      <section
        v-for="section in contactSections"
        :id="section.id"
        :key="section.id"
        class="scroll-mt-20 rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:scroll-mt-24 sm:p-8"
      >
        <div class="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
            <UIcon :name="section.icon" class="size-6 text-primary" />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="text-lg font-bold sm:text-xl">
              {{ $t(section.titleKey) }}
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              {{ $t(section.descKey) }}
            </p>
            <a
              :href="section.href"
              class="mt-4 inline-flex max-w-full items-center justify-center gap-2 break-all text-sm font-semibold text-primary transition hover:underline sm:inline-flex sm:justify-start sm:break-normal sm:text-base"
            >
              {{ $t(section.ctaKey) }}
              <UIcon name="i-heroicons-arrow-top-right-on-square" class="size-4" />
            </a>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: true })
const siteConfig = useSiteConfig()
const { t } = useI18n()

const contactSections = computed(() => [
  {
    id: 'questions',
    icon: 'i-heroicons-envelope',
    titleKey: 'contact.questions',
    descKey: 'contact.questionsDesc',
    ctaKey: 'contact.questions',
    href: `mailto:${siteConfig.contactEmail}`,
  },
  {
    id: 'sponsoring',
    icon: 'i-heroicons-heart',
    titleKey: 'contact.sponsoring',
    descKey: 'contact.sponsoringDesc',
    ctaKey: 'contact.sponsoringCta',
    href: `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(t('contact.sponsoringSubject'))}`,
  },
  {
    id: 'speaker',
    icon: 'i-heroicons-microphone',
    titleKey: 'contact.proposeSpeaker',
    descKey: 'contact.speakerDesc',
    ctaKey: 'contact.speakerCta',
    href: `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(t('contact.speakerSubject'))}`,
  },
  {
    id: 'host',
    icon: 'i-heroicons-building-office-2',
    titleKey: 'contact.proposeHost',
    descKey: 'contact.hostDesc',
    ctaKey: 'contact.hostCta',
    href: `mailto:${siteConfig.contactEmail}?subject=${encodeURIComponent(t('contact.hostSubject'))}`,
  },
])
</script>
