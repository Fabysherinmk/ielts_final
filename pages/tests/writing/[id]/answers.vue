<template>
  <div class="idp-page">
    <NuxtLink to="/tests" class="idp-page__back">
      <Icon name="chevron-left" :size="14" />
      Back to tests
    </NuxtLink>
    <div class="idp-page__head">
      <h1 class="idp-page__title">{{ test?.title || 'Writing Test Answers' }}</h1>
      <p class="idp-page__subtitle">Model answers and guidance for this writing test</p>
    </div>
    <main v-if="test">
      <div v-for="(s, si) in test.sections" :key="s.id" class="idp-section">
        <h2 class="idp-section__title">{{ s.title }}</h2>
        <div v-if="s.instructions" class="idp-section__instructions" v-html="s.instructions"></div>
        <div v-if="s.body" class="idp-writing-prompt" v-html="s.body"></div>
        <div class="idp-speaking-guide">
          <h4 style="margin: 0 0 10px; font-size: 18px; font-weight: 600; color: #141414;">Model Answer Guidance</h4>
          <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.7;">This is a model answer for this writing task. In a real test, you would write your own unique response.</p>
          <p style="margin: 0; font-size: 16px; line-height: 1.7;">Remember to: address all parts of the question, organize your ideas clearly, and use a range of vocabulary and grammar.</p>
        </div>
      </div>
    </main>
    <div v-else class="empty">Loading answers…</div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const id = Number(route.params.id)
const { data: test } = await useFetch<any>(`/api/tests/${id}/answers`)

useHead({ title: test.value?.title ? `${test.value.title} — Answers` : 'Writing test answers' })
</script>
