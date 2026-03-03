<template>
  <div class="mx-auto max-w-3xl space-y-12 px-4 py-10 sm:px-6 lg:px-8">
    <section class="text-center">
      <h1 class="text-4xl font-bold tracking-tight sm:text-5xl">
        {{ $t('contact.title') }}
      </h1>
      <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
        {{ $t('contact.subtitle') }}
      </p>
    </section>

    <div class="space-y-6">
      <section
        v-for="section in contactSections"
        :id="section.id"
        :key="section.id"
        class="scroll-mt-24 rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:p-8"
      >
        <div class="flex items-start gap-4">
          <div class="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20">
            <UIcon :name="section.icon" class="size-6 text-primary" />
          </div>
          <div class="min-w-0 flex-1">
            <h2 class="text-xl font-bold">
              {{ $t(section.titleKey) }}
            </h2>
            <p class="mt-2 text-gray-600 dark:text-gray-400">
              {{ $t(section.descKey) }}
            </p>
            <a
              :href="section.href"
              class="mt-4 inline-flex items-center gap-2 font-semibold text-primary transition hover:underline"
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
