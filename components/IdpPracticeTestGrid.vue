<template>
  <div class="idp-practice-grid-wrap">
    <div v-if="showNav" class="idp-practice-grid__nav">
      <button type="button" class="idp-practice-grid__nav-btn" aria-label="Previous tests" :disabled="start === 0" @click="prev">
        <Icon name="chevron-left" :size="18" />
      </button>
      <button type="button" class="idp-practice-grid__nav-btn" aria-label="Next tests" :disabled="start + perView >= tests.length" @click="next">
        <Icon name="chevron-right" :size="18" />
      </button>
    </div>

    <div class="idp-practice-grid">
      <IdpPracticeTestCard
        v-for="(t, idx) in visibleTests"
        :key="t.id"
        :title="cardTitle(t, idx)"
        :access-to="accessLink(t)"
        :answers-to="answersLink(t)"
        :format="cardFormat(skill, idx)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { idpCardFormat, idpCardTitle, idpTestAccessLink, idpTestAnswersLink } from '~/utils/idpTestCards'

const props = withDefaults(defineProps<{
  tests: any[]
  skill: 'reading' | 'listening' | 'writing' | 'speaking'
  max?: number
  showNav?: boolean
}>(), {
  max: 4,
  showNav: true
})

const perView = 4
const start = ref(0)

const visibleTests = computed(() => {
  const list = props.tests.slice(0, props.max)
  if (!props.showNav) return list
  return list.slice(start.value, start.value + perView)
})

function prev() {
  start.value = Math.max(0, start.value - perView)
}

function next() {
  start.value = Math.min(Math.max(0, props.tests.length - perView), start.value + perView)
}

function cardTitle(test: any, idx: number) {
  return idpCardTitle(test, props.skill, idx)
}

function cardFormat(_test: any, idx: number) {
  return idpCardFormat(props.skill, idx)
}

function accessLink(test: any) {
  return idpTestAccessLink(test, props.skill)
}

function answersLink(test: any) {
  return idpTestAnswersLink(test, props.skill)
}
</script>
