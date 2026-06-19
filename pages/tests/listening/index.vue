<template>
  <div class="listening-selection container">
    <header class="selection-head">
      <div class="selection-title">
        <Icon name="headphones" :size="34" />
        <div>
          <h1>IELTS Practice tests</h1>
          <p class="text-muted">Listening practice tests — choose a paper to begin</p>
        </div>
      </div>
    </header>

    <section class="cards">
      <div class="cards-head">
        <h2>IELTS Practice tests</h2>
      </div>

      <IdpPracticeTestGrid
        v-if="listeningAll.length"
        :tests="listeningAll"
        skill="listening"
        :show-nav="listeningAll.length > 4"
      />
      <div v-else class="empty-state">No listening tests available yet.</div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { data: tests } = await useFetch<any[]>('/api/tests')
const listeningAll = computed(() => (tests.value || []).filter(t => t.skill === 'listening'))

useHead({ title: 'Listening practice tests' })
</script>

<style scoped>
.selection-head { margin: 18px 0 14px; }
.selection-title { display: flex; gap: 14px; align-items: center; }
.selection-title h1 { margin: 0; font-size: 34px; }
.cards-head { margin-bottom: 12px; }
.cards-head h2 { margin: 0; font-size: 28px; }
.empty-state {
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  border: 1.5px dashed #d1d5db;
  border-radius: 12px;
}
</style>
