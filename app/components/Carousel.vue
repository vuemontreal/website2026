<template>
  <UCarousel v-slot="{ item }" arrows dots :items="items" :ui="{ item: 'basis-1/3' }">
    <NuxtLink :to="item.fullUrl" external target="_blank">
        <NuxtImg :src="item.thumbUrl" width="320" height="320" class="rounded-lg" loading="lazy" />
    </NuxtLink>
  </UCarousel>
</template>

<script setup lang="ts">

const props = defineProps({
    items: []
})
</script>

