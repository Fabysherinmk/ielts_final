<template>
  <article class="idp-practice-card">
    <div class="idp-practice-card__top">
      <div class="idp-practice-card__doc" aria-hidden="true">
        <svg viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8 4h22l10 10v42H8V4z" fill="#fff" stroke="#D1D5DB" stroke-width="1.5"/>
          <path d="M30 4v10h10" fill="#F9FAFB" stroke="#D1D5DB" stroke-width="1.5"/>
          <path d="M14 22h20M14 28h20M14 34h14" stroke="#F59E0B" stroke-width="2" stroke-linecap="round"/>
          <path d="M8 4l10-2 2 10-12-8z" fill="#E11B2B"/>
        </svg>
      </div>
      <span class="idp-practice-card__badge">{{ format || 'Paper' }}</span>
    </div>

    <h3 class="idp-practice-card__title">{{ title }}</h3>

    <div class="idp-practice-card__actions">
      <NuxtLink :to="testModeUrl" class="idp-practice-card__btn idp-practice-card__btn--primary">
        Test Mode
      </NuxtLink>
      <NuxtLink :to="practiceModeUrl" class="idp-practice-card__btn idp-practice-card__btn--secondary">
        Practice Mode
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  accessTo: string
  answersTo?: string
  format?: string
}>()

const testModeUrl = computed(() => {
  const base = props.accessTo.split('?')[0]
  return `${base}?mode=test`
})

const practiceModeUrl = computed(() => {
  const base = props.accessTo.split('?')[0]
  return `${base}?mode=practice`
})
</script>
