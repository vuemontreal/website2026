<template>
  <div class="flex min-h-screen flex-col overflow-x-clip bg-gray-50 font-sans text-gray-900 dark:bg-gray-950 dark:text-gray-100">
    <!-- Header -->
    <header class="sticky top-0 z-50 border-b border-gray-200/60 bg-white/80 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/80">
      <div class="mx-auto flex h-16 max-w-7xl min-w-0 items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="flex min-w-0 shrink-0 items-center gap-2 text-xl font-bold text-primary transition hover:text-primary-600 dark:hover:text-primary-400">
          <NuxtImg src="logo.webp" :alt="$t('site.name')" class="h-9 w-auto max-w-20 object-contain sm:h-10" />
        </NuxtLink>

        <nav class="hidden min-w-0 items-center gap-1 sm:flex">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-md px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
          >
            {{ $t(item.label) }}
          </NuxtLink>
        </nav>

        <div class="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <ClientOnly>
            <UColorModeSwitch class="max-sm:scale-90 sm:mr-1" />
          </ClientOnly>
          <UButton
            variant="ghost"
            color="neutral"
            icon="i-heroicons-bars-3"
            class="sm:hidden"
            @click="mobileMenuOpen = true"
          />
          <UButton
            as="a"
            href="https://www.linkedin.com/company/vue-montreal/"
            variant="solid"
            color="primary"
            size="md"
            target="_blank"
            rel="noopener noreferrer"
            class="rounded shadow-lg"
          >
            {{ $t('nav.join') }}
          </UButton>
          <ClientOnly>
            <UDropdownMenu :items="localeItems">
              <UButton variant="ghost" color="neutral" size="sm" trailing-icon="i-heroicons-chevron-down" class="max-w-36 truncate sm:max-w-none">
                <span class="truncate">{{ currentLocale }}</span>
              </UButton>
            </UDropdownMenu>
          </ClientOnly>
        </div>
      </div>
    </header>

    <!-- Mobile menu -->
    <UDrawer v-model:open="mobileMenuOpen" direction="right" :handle="false">
      <template #body>
        <div class="flex flex-col gap-2 p-4">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="rounded-lg px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="mobileMenuOpen = false"
          >
            {{ $t(item.label) }}
          </NuxtLink>
        </div>
      </template>
    </UDrawer>

    <!-- Main -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-gray-200/80 bg-white dark:border-gray-800/80 dark:bg-gray-900/50">
      <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div class="grid gap-10 lg:grid-cols-4 lg:gap-8">
          <!-- Brand -->
          <div>
            <NuxtLink to="/" class="text-lg font-bold text-primary">
              {{ $t('site.name') }}
            </NuxtLink>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ $t('footer.tagline') }}
            </p>
          </div>

          <!-- Liens rapides -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              {{ $t('footer.quickLinks') }}
            </h4>
            <ul class="mt-4 space-y-2">
              <li><NuxtLink to="/events" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">{{ $t('nav.events') }}</NuxtLink></li>
              <li>
                <a
                  href="https://guild.host/vue-montreal"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-sm text-gray-600 hover:text-primary dark:text-gray-400"
                >
                  {{ $t('footer.guildCommunity') }}
                </a>
              </li>
              <li><NuxtLink to="/sponsors" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">{{ $t('nav.sponsors') }}</NuxtLink></li>
              <li><NuxtLink to="/contact" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">{{ $t('nav.contact') }}</NuxtLink></li>
            </ul>
          </div>

          <!-- Contact -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              {{ $t('footer.contact') }}
            </h4>
            <ul class="mt-4 space-y-2">
              <li>
                <a :href="`mailto:${siteConfig.contactEmail}`" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">
                  {{ siteConfig.contactEmail }}
                </a>
              </li>
              <li>
                <NuxtLink to="/contact#sponsoring" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">
                  {{ $t('contact.sponsoring') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact#speaker" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">
                  {{ $t('contact.proposeSpeaker') }}
                </NuxtLink>
              </li>
              <li>
                <NuxtLink to="/contact#host" class="text-sm text-gray-600 hover:text-primary dark:text-gray-400">
                  {{ $t('contact.proposeHost') }}
                </NuxtLink>
              </li>
            </ul>
          </div>

          <!-- Newsletter + Social -->
          <div>
            <h4 class="text-sm font-semibold uppercase tracking-wider text-gray-900 dark:text-gray-100">
              {{ $t('footer.newsletter') }}
            </h4>
            <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {{ $t('footer.newsletterDesc') }}
            </p>
            <form
              :action="siteConfig.newsletterUrl || undefined"
              method="post"
              target="_blank"
              class="mt-4 flex flex-col gap-2 sm:flex-row"
              @submit="onNewsletterSubmit"
            >
              <UInput
                v-model="newsletterEmail"
                :name="siteConfig.newsletterEmailField"
                type="email"
                :placeholder="$t('footer.newsletterPlaceholder')"
                required
                class="min-w-0 flex-1"
              />
              <UButton type="submit" size="md" class="shrink-0">
                {{ $t('footer.newsletterSubmit') }}
              </UButton>
            </form>
            <p v-if="!siteConfig.newsletterUrl" class="mt-2 text-xs text-gray-500">
              {{ $t('footer.newsletterSoon') }}
            </p>

            <div class="mt-6 flex gap-3">
              <a
                v-if="siteConfig.social.twitter"
                :href="siteConfig.social.twitter"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 transition hover:text-primary"
                aria-label="Twitter"
              >
                <UIcon name="i-simple-icons-x" class="size-5" />
              </a>
              <a
                v-if="siteConfig.social.github"
                :href="siteConfig.social.github"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 transition hover:text-primary"
                aria-label="GitHub"
              >
                <UIcon name="i-simple-icons-github" class="size-5" />
              </a>
              <a
                v-if="siteConfig.social.linkedin"
                :href="siteConfig.social.linkedin"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 transition hover:text-primary"
                aria-label="LinkedIn"
              >
                <UIcon name="i-simple-icons-linkedin" class="size-5" />
              </a>
              <a
                v-if="siteConfig.social.discord"
                :href="siteConfig.social.discord"
                target="_blank"
                rel="noopener noreferrer"
                class="text-gray-500 transition hover:text-primary"
                aria-label="Discord"
              >
                <UIcon name="i-simple-icons-discord" class="size-5" />
              </a>
            </div>
          </div>
        </div>

        <div class="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-8 dark:border-gray-800 sm:flex-row">
          <p class="text-sm text-gray-500">
            {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const mobileMenuOpen = ref(false)
const newsletterEmail = ref('')
const { locale, locales, setLocale } = useI18n()
const siteConfig = useSiteConfig()

function onNewsletterSubmit(e: Event) {
  if (!siteConfig.newsletterUrl) {
    e.preventDefault()
  }
}

const navItems = [
  { to: '/', label: 'nav.home' },
  { to: '/about', label: 'nav.about' },
  { to: '/events', label: 'nav.events' },
  { to: '/sponsors', label: 'nav.sponsors' },
  { to: '/contact', label: 'nav.contact' },
]

const currentLocale = computed(() => {
  const l = locales.value.find((loc: any) => loc.code === locale.value)
  return l?.name ?? locale.value
})

const localeItems = computed(() => [
  locales.value.map((loc: any) => ({
    label: loc.name,
    onClick: () => setLocale(loc.code),
  })),
])
</script>
