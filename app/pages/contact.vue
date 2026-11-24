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

    <!-- 4 Cartes de contact -->
    <div class="space-y-6">
      <section
        v-for="section in contactSections"
        :id="section.id"
        :key="section.id"
        :class="[
          'scroll-mt-20 rounded-2xl border bg-white p-5 shadow-sm transition dark:bg-gray-900/50 sm:scroll-mt-24 sm:p-8',
          form.motif === section.id
            ? 'border-primary ring-2 ring-primary/20 dark:border-primary/80'
            : 'border-gray-200/80 dark:border-gray-800'
        ]"
      >
        <!-- Ancre de compatibilité pour #questions -->
        <span v-if="section.altId" :id="section.altId" class="sr-only"></span>

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
            <button
              type="button"
              @click="selectMotifAndScroll(section.id)"
              class="mt-4 inline-flex max-w-full items-center justify-center gap-2 break-all text-sm font-semibold text-primary transition hover:underline sm:inline-flex sm:justify-start sm:break-normal sm:text-base cursor-pointer"
            >
              <span>{{ $t(section.ctaKey) }}</span>
              <UIcon name="i-heroicons-arrow-down" class="size-4" />
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Formulaire de contact intégré -->
    <section
      id="contact-form"
      class="scroll-mt-20 rounded-3xl border border-gray-200/80 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900/50 sm:scroll-mt-24 sm:p-10"
    >
      <div class="mb-8">
        <div class="inline-flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-primary/20 mb-3">
          <UIcon name="i-heroicons-chat-bubble-left-right" class="size-6" />
        </div>
        <h2 class="text-2xl font-bold tracking-tight sm:text-3xl">
          {{ $t('contact.formTitle') }}
        </h2>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
          {{ $t('contact.formSubtitle') }}
        </p>
      </div>

      <!-- État Succès -->
      <div
        v-if="status === 'success'"
        class="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 text-center dark:border-emerald-900/60 dark:bg-emerald-950/20 sm:p-8"
      >
        <div class="mx-auto flex size-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400">
          <UIcon name="i-heroicons-check-circle" class="size-8" />
        </div>
        <h3 class="mt-4 text-xl font-bold text-gray-900 dark:text-gray-100">
          {{ $t('contact.successTitle') }}
        </h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400 sm:text-base max-w-md mx-auto">
          {{ $t('contact.successMessage') }}
        </p>
        <button
          type="button"
          @click="resetForm"
          class="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 cursor-pointer"
        >
          <UIcon name="i-heroicons-arrow-path" class="size-4" />
          {{ $t('contact.sendAnother') }}
        </button>
      </div>

      <!-- Formulaire -->
      <form v-else @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Champ Honeypot masqué pour la protection anti-spam -->
        <div
          style="opacity: 0; position: absolute; top: 0; left: 0; height: 0; width: 0; z-index: -1; overflow: hidden;"
          aria-hidden="true"
        >
          <label for="website-honeypot">Ne pas remplir</label>
          <input
            id="website-honeypot"
            v-model="form.website"
            type="text"
            name="website"
            tabindex="-1"
            autocomplete="off"
          />
        </div>

        <!-- Motif de contact -->
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-900 dark:text-gray-200">
            {{ $t('contact.motif') }} <span class="text-primary">*</span>
          </label>
          <div class="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            <button
              v-for="opt in motifOptions"
              :key="opt.id"
              type="button"
              @click="form.motif = opt.id"
              :class="[
                'flex items-center gap-2.5 rounded-xl border p-3.5 text-left text-sm font-medium transition cursor-pointer',
                form.motif === opt.id
                  ? 'border-primary bg-primary/10 text-primary font-semibold ring-2 ring-primary/30 dark:bg-primary/20'
                  : 'border-gray-200 bg-gray-50/50 text-gray-700 hover:border-gray-300 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900/40 dark:text-gray-300 dark:hover:border-gray-700 dark:hover:bg-gray-800/60'
              ]"
            >
              <UIcon
                :name="opt.icon"
                class="size-5 shrink-0"
                :class="form.motif === opt.id ? 'text-primary' : 'text-gray-400'"
              />
              <span class="truncate">{{ $t(opt.labelKey) }}</span>
            </button>
          </div>
        </div>

        <!-- Nom complet & Email -->
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="contact-name" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
              {{ $t('contact.name') }} <span class="text-primary">*</span>
            </label>
            <input
              id="contact-name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              :placeholder="$t('contact.namePlaceholder')"
              class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label for="contact-email" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
              {{ $t('contact.email') }} <span class="text-primary">*</span>
            </label>
            <input
              id="contact-email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              :placeholder="$t('contact.emailPlaceholder')"
              class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <!-- Champs conditionnels : Devenir partenaire ou Proposer un lieu -->
        <div v-if="form.motif === 'sponsoring' || form.motif === 'host'" class="grid grid-cols-1 gap-5" :class="form.motif === 'host' ? 'sm:grid-cols-2' : ''">
          <div>
            <label for="contact-company" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
              {{ $t('contact.company') }}
            </label>
            <input
              id="contact-company"
              v-model="form.company"
              type="text"
              :placeholder="$t('contact.companyPlaceholder')"
              class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <!-- Si proposer un lieu : Capacité d'accueil -->
          <div v-if="form.motif === 'host'">
            <label for="contact-capacity" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
              {{ $t('contact.capacity') }}
            </label>
            <input
              id="contact-capacity"
              v-model="form.capacity"
              type="text"
              :placeholder="$t('contact.capacityPlaceholder')"
              class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>
        </div>

        <!-- Champs conditionnels : Proposer un talk -->
        <div v-if="form.motif === 'speaker'" class="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label for="contact-talk-title" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
              {{ $t('contact.talkTitle') }}
            </label>
            <input
              id="contact-talk-title"
              v-model="form.talkTitle"
              type="text"
              :placeholder="$t('contact.talkTitlePlaceholder')"
              class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
            />
          </div>

          <div>
            <label for="contact-talk-format" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
              {{ $t('contact.talkFormat') }}
            </label>
            <select
              id="contact-talk-format"
              v-model="form.talkFormat"
              class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
            >
              <option value="">-- {{ $t('contact.talkFormat') }} --</option>
              <option value="full">{{ $t('contact.talkFormatFull') }}</option>
              <option value="lightning">{{ $t('contact.talkFormatLightning') }}</option>
              <option value="other">{{ $t('contact.talkFormatOther') }}</option>
            </select>
          </div>
        </div>

        <!-- Message -->
        <div>
          <label for="contact-message" class="block text-sm font-medium text-gray-900 dark:text-gray-200">
            {{ $t('contact.message') }} <span class="text-primary">*</span>
          </label>
          <textarea
            id="contact-message"
            v-model="form.message"
            required
            rows="5"
            :placeholder="$t('contact.messagePlaceholder')"
            class="mt-1.5 block w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100 dark:placeholder:text-gray-500"
          ></textarea>
        </div>

        <!-- Message d'erreur -->
        <div
          v-if="status === 'error'"
          class="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-400"
        >
          <UIcon name="i-heroicons-exclamation-triangle" class="size-5 shrink-0 mt-0.5" />
          <div class="flex-1">{{ errorMessage }}</div>
        </div>

        <!-- Bouton Soumettre -->
        <div class="pt-2">
          <button
            type="submit"
            :disabled="isSubmitting"
            class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-50 sm:w-auto cursor-pointer"
          >
            <UIcon v-if="isSubmitting" name="i-heroicons-arrow-path" class="size-5 animate-spin" />
            <UIcon v-else name="i-heroicons-paper-airplane" class="size-5" />
            <span>{{ isSubmitting ? $t('contact.sending') : $t('contact.submit') }}</span>
          </button>
        </div>
      </form>
    </section>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ ssr: true })
const siteConfig = useSiteConfig()
const { t } = useI18n()
const route = useRoute()

usePageSeo({
  title: t('seo.contact.title'),
  description: t('seo.contact.description'),
})

useJsonLd({
  id: 'breadcrumbs-contact',
  value: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Vue Montreal', item: siteConfig.siteUrl },
      { '@type': 'ListItem', position: 2, name: t('nav.contact'), item: `${siteConfig.siteUrl.replace(/\/+$/, '')}/contact` },
    ],
  },
})

// Les 4 cartes de contact
const contactSections = computed(() => [
  {
    id: 'general',
    altId: 'questions',
    icon: 'i-heroicons-envelope',
    titleKey: 'contact.questions',
    descKey: 'contact.questionsDesc',
    ctaKey: 'contact.questionsCta',
  },
  {
    id: 'sponsoring',
    altId: null,
    icon: 'i-heroicons-heart',
    titleKey: 'contact.sponsoring',
    descKey: 'contact.sponsoringDesc',
    ctaKey: 'contact.sponsoringCta',
  },
  {
    id: 'speaker',
    altId: null,
    icon: 'i-heroicons-microphone',
    titleKey: 'contact.proposeSpeaker',
    descKey: 'contact.speakerDesc',
    ctaKey: 'contact.speakerCta',
  },
  {
    id: 'host',
    altId: null,
    icon: 'i-heroicons-building-office-2',
    titleKey: 'contact.proposeHost',
    descKey: 'contact.hostDesc',
    ctaKey: 'contact.hostCta',
  },
])

// Options de motif pour le sélecteur du formulaire
const motifOptions = computed(() => [
  { id: 'general', icon: 'i-heroicons-envelope', labelKey: 'contact.questions' },
  { id: 'sponsoring', icon: 'i-heroicons-heart', labelKey: 'contact.sponsoring' },
  { id: 'speaker', icon: 'i-heroicons-microphone', labelKey: 'contact.proposeSpeaker' },
  { id: 'host', icon: 'i-heroicons-building-office-2', labelKey: 'contact.proposeHost' },
])

// État du formulaire
const form = reactive({
  motif: 'general',
  name: '',
  email: '',
  company: '',
  capacity: '',
  talkTitle: '',
  talkFormat: '',
  message: '',
  website: '', // Honeypot anti-spam
})

const isSubmitting = ref(false)
const status = ref<'idle' | 'success' | 'error'>('idle')
const errorMessage = ref('')

const HASH_MAP: Record<string, string> = {
  '#questions': 'general',
  '#general': 'general',
  '#sponsoring': 'sponsoring',
  '#speaker': 'speaker',
  '#host': 'host',
}

function selectMotifAndScroll(motifId: string, smooth = true) {
  form.motif = motifId
  nextTick(() => {
    const el = document.getElementById('contact-form')
    if (el) {
      el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' })
    }
  })
}

function handleHash(hash: string) {
  if (!hash) return
  const normalized = hash.toLowerCase()
  const motif = HASH_MAP[normalized]
  if (motif) {
    selectMotifAndScroll(motif, true)
  }
}

onMounted(() => {
  if (route.hash) {
    // Petit délai pour laisser le rendu initial s'établir
    setTimeout(() => {
      handleHash(route.hash)
    }, 100)
  }
})

watch(() => route.hash, (newHash) => {
  if (newHash) {
    handleHash(newHash)
  }
})

function resetForm() {
  form.name = ''
  form.email = ''
  form.company = ''
  form.capacity = ''
  form.talkTitle = ''
  form.talkFormat = ''
  form.message = ''
  form.website = ''
  status.value = 'idle'
  errorMessage.value = ''
}

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
    status.value = 'error'
    errorMessage.value = t('contact.errorRequired')
    return
  }

  isSubmitting.value = true
  status.value = 'idle'

  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        motif: form.motif,
        name: form.name.trim(),
        email: form.email.trim(),
        company: form.company.trim(),
        capacity: form.capacity.trim(),
        talkTitle: form.talkTitle.trim(),
        talkFormat: form.talkFormat.trim(),
        message: form.message.trim(),
        website: form.website, // Honeypot
      },
    })

    status.value = 'success'
  } catch (err: any) {
    console.error('Contact submission error:', err)
    status.value = 'error'
    const msg = err?.data?.statusMessage || err?.statusMessage || err?.message
    errorMessage.value = msg || t('contact.errorGeneric')
  } finally {
    isSubmitting.value = false
  }
}
</script>
