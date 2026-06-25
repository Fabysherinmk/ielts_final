<template>
  <div v-if="test">
    <header class="ielts-topbar">
      <div class="brand">
        <span class="dot"><Icon name="mic" :size="14" /></span>
        IELTS Speaking
      </div>
      <div class="meta">
        <span class="candidate"><Icon name="user" :size="14" /> Candidate · {{ test.title }}</span>
        <span v-if="mode === 'test'" class="timer" :class="{ low: remaining <= 180 }">
          <Icon name="clock" :size="14" /> {{ timeDisplay }}
        </span>
        <button class="topbtn" @click="submit"><Icon name="check" :size="13" /> Submit</button>
      </div>
    </header>

    <div v-if="mode === 'practice'" class="practice-strip">
      <strong>Practice mode</strong>
      <span>Timer is hidden. Switch to test mode for real exam rules.</span>
      <NuxtLink :to="`/tests/speaking/${testId}?mode=test`">Start test mode</NuxtLink>
    </div>

    <section class="container">
      <div class="card">
        <h2>Part {{ currentSectionIndex + 1 }}: {{ currentSection?.title }}</h2>
        <p style="color:#555;">{{ currentSection?.instructions }}</p>
        <div v-if="currentSection?.body" v-html="currentSection.body"></div>

        <!-- Part 2 cue card styling -->
        <div v-if="currentSection?.extra?.cue_card" class="speaking-card">
          <strong>Cue Card</strong>
          <div v-html="currentSection.extra.cue_card"></div>
          <small>You have 1 minute to prepare. You can make notes. You will then speak for 1–2 minutes.</small>
        </div>

        <div v-for="q in currentSection?.questions || []" :key="q.id" class="question">
          <span class="qnum">{{ q.order_index + 1 }}</span>
          <span class="q-prompt" v-html="q.prompt"></span>
          <SpeakingRecorder :question-id="q.id" :audio="responses[q.id]" :is-test-mode="mode === 'test'" @update="val => setResponse(q.id, val)" />
        </div>
      </div>
    </section>

    <footer class="ielts-bottombar">
      <div v-for="(s, si) in test.sections" :key="s.id" class="nav-group">
        <span class="label">Part {{ si + 1 }}</span>
        <button class="nav-btn" :class="{ current: currentSectionIndex === si }" @click="currentSectionIndex = si">{{ si + 1 }}</button>
      </div>
      <div style="margin-left:auto; display:flex; gap:8px; padding-right:8px;">
        <button class="btn secondary sm" :disabled="currentSectionIndex === 0" @click="currentSectionIndex--">
          <Icon name="chevron-left" :size="14" /> Prev
        </button>
        <button class="btn sm" v-if="currentSectionIndex < (test.sections.length - 1)" @click="currentSectionIndex++">
          Next <Icon name="chevron-right" :size="14" />
        </button>
        <button class="btn cta sm" v-else @click="submit">
          <Icon name="check" :size="14" /> Finish
        </button>
      </div>
    </footer>
  </div>
  <div v-else class="container"><p>Loading...</p></div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'test' })
const route = useRoute()
const router = useRouter()
const testId = Number(route.params.id)
const { data: test } = await useFetch<any>(`/api/tests/${testId}`)
const responses = reactive<Record<number, any>>({})
const currentSectionIndex = ref(0)
const currentSection = computed(() => test.value?.sections?.[currentSectionIndex.value])

const mode = computed(() => route.query.mode === 'practice' ? 'practice' : 'test')

const duration = computed(() => (test.value?.duration_min || 14) * 60)
const remaining = ref(0)
const timeDisplay = computed(() => {
  const s = remaining.value
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

let timer: ReturnType<typeof setInterval> | null = null
onMounted(() => {
  remaining.value = duration.value
  if (mode.value === 'test') {
    timer = setInterval(() => {
      remaining.value--
      if (remaining.value <= 0) {
        if (timer) clearInterval(timer)
        submit()
      }
    }, 1000)
  }
})

onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function setResponse(qid: number, v: any) { responses[qid] = v }
const modal = useModal()
async function submit() {
  const ok = await modal.confirm({
    title: 'Submit your recordings?',
    message: 'Your audio recordings will be locked for review. You will not be able to re-record after submitting.',
    confirmText: 'Submit speaking',
    cancelText: 'Keep practising',
    variant: 'info'
  })
  if (!ok) return
  const res: any = await $fetch('/api/attempts/submit', {
    method: 'POST', body: { test_id: testId, responses }
  })
  router.push(`/results/${res.attempt_id}`)
}
</script>
