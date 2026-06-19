<template>
  <div class="idp-page">
    <NuxtLink to="/tests" class="idp-page__back">
      <Icon name="chevron-left" :size="14" />
      Back to tests
    </NuxtLink>
    <div class="idp-page__head">
      <h1 class="idp-page__title">{{ test?.title || 'Speaking Test Answers' }}</h1>
      <p class="idp-page__subtitle">Guidance and sample answers for this speaking test</p>
    </div>
    <main v-if="test">
      <div v-for="(s, si) in test.sections" :key="s.id" class="idp-section">
        <h2 class="idp-section__title">{{ s.title }}</h2>
        <div v-if="s.instructions" class="idp-section__instructions" v-html="s.instructions"></div>
        <div v-if="s.body" class="idp-passage" v-html="s.body"></div>
        <div class="idp-speaking-guide">
          <h4 style="margin: 0 0 10px; font-size: 18px; font-weight: 600; color: #141414;">Sample Guidance</h4>
          <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.7;">These are sample ideas to help you prepare. In a real test, you would give your own answers based on your own experiences.</p>
          <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.7;"><strong>Part 1:</strong> Keep your answers clear and natural, 1-2 sentences per question is usually perfect.</p>
          <p style="margin: 0 0 8px; font-size: 16px; line-height: 1.7;"><strong>Part 2:</strong> Speak for 1-2 minutes, using the cue card points to structure your talk.</p>
          <p style="margin: 0; font-size: 16px; line-height: 1.7;"><strong>Part 3:</strong> Give extended answers with reasons and examples, this is your chance to show your English skills!</p>
        </div>
        <div v-if="s.questions">
          <div v-for="q in s.questions" :key="q.id" class="idp-question">
            <div class="idp-question__number">Question {{ q.number }}</div>
            <div class="idp-question__text">{{ q.prompt }}</div>
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

useHead({ title: test.value?.title ? `${test.value.title} — Answers` : 'Speaking test answers' })
</script>
