<template>
  <div class="tests-page">
    <div class="container tests-body">
      <section v-for="skill in skills" :key="skill.key" class="skill-section">
        <div class="skill-section__head">
          <div :class="['skill-icon', `skill-icon--${skill.key}`]">
            <Icon :name="skill.icon" :size="20" />
          </div>
          <div class="skill-section__meta">
            <h2>{{ skill.title }}</h2>
            <p>{{ skill.summary }}</p>
          </div>
        </div>

        <!-- All skills: IDP-style practice test cards -->
        <div class="idp-section">
          <IdpPracticeTestGrid
            v-if="(byskill[skill.key] || []).length"
            :tests="byskill[skill.key]"
            :skill="skill.key"
            :max="4"
            :show-nav="(byskill[skill.key] || []).length > 4"
          />
          <div v-else class="empty-state">
            <Icon name="file-text" :size="32" />
            <p>No {{ skill.title.toLowerCase() }} tests yet. An admin can add one from the dashboard.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data: tests } = await useFetch<any[]>('/api/tests')

const skills = [
  { key: 'reading' as const, title: 'Reading', icon: 'book-open', summary: '3 passages · 60 min · 40 auto-graded questions', questionInfo: '40 Qs' },
  { key: 'listening' as const, title: 'Listening', icon: 'headphones', summary: '4 parts · 40 min · 40 auto-graded questions', questionInfo: '40 Qs' },
  { key: 'writing' as const, title: 'Writing', icon: 'pen-tool', summary: '2 tasks · 60 min · timed with word count', questionInfo: '2 tasks' },
  { key: 'speaking' as const, title: 'Speaking', icon: 'mic', summary: '3 parts · 11–14 min · in-browser recorder', questionInfo: '3 parts' }
]
const byskill = computed(() => {
  const m: Record<string, any[]> = {}
  for (const t of tests.value ?? []) {
    (m[t.skill] ||= []).push(t)
  }
  return m
})

useHead({ title: 'IELTS Practice — Cambridge-style mock tests' })
</script>

<style scoped>
.tests-body {
  padding: 32px 0 64px;
}

.skill-section {
  margin-bottom: 48px;
  padding-bottom: 48px;
  border-bottom: 1px solid #e9edf2;
}
.skill-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
}

.skill-section__head {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 24px;
}

.skill-icon {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}
.skill-icon--reading { background: linear-gradient(135deg, #3b82f6, #1d4ed8); }
.skill-icon--listening { background: linear-gradient(135deg, #e11b2b, #9b1a25); }
.skill-icon--writing { background: linear-gradient(135deg, #10b981, #059669); }
.skill-icon--speaking { background: linear-gradient(135deg, #f59e0b, #d97706); }

.skill-section__meta h2 {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin: 0 0 2px;
}
.skill-section__meta p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.idp-section {
  margin-top: 4px;
}

.empty-state {
  background: #f9fafb;
  border: 1.5px dashed #d1d5db;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  color: #9ca3af;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
