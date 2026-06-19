<template>
  <div class="idp-page">
    <NuxtLink to="/tests" class="idp-page__back">
      <Icon name="chevron-left" :size="14" />
      Back to tests
    </NuxtLink>
    <div class="idp-page__head">
      <h1 class="idp-page__title">{{ test?.title || 'Listening Test Answers' }}</h1>
      <p class="idp-page__subtitle">Correct answers for this listening test</p>
    </div>
    <main v-if="test">
      <div v-for="(s, si) in test.sections" :key="s.id" class="idp-section">
        <h2 class="idp-section__title">Part {{ si + 1 }}: {{ s.title }}</h2>
        <div v-if="s.instructions" class="idp-section__instructions" v-html="s.instructions"></div>
        <div v-if="s.body" class="idp-passage" v-html="s.body"></div>
        <div v-if="s.questions">
          <div v-for="q in s.questions" :key="q.id" class="idp-question">
            <div class="idp-question__number">Question {{ q.number }}</div>
            <div v-if="q.prompt" class="idp-question__text" v-html="q.prompt"></div>
            <div class="idp-answer">
              <div class="idp-answer__label">Correct Answer</div>
              <div class="idp-answer__content">
                <span class="idp-answer__correct">{{ renderAnswer(q.answer) }}</span>
              </div>
            </div>
          </div>
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

useHead({ title: test.value?.title ? `${test.value.title} — Answers` : 'Listening test answers' })

function renderAnswer(ans: any) {
  if (!ans) return '—'
  if (ans.answer !== undefined) return Array.isArray(ans.answer) ? ans.answer.join(', ') : String(ans.answer)
  return JSON.stringify(ans)
}
</script>
