<template>
  <div v-if="test">
    <header class="ielts-topbar">
      <div class="brand">
        <span class="dot"><Icon name="pen-tool" :size="14" /></span>
        IELTS Writing
      </div>
      <div class="meta">
        <span class="candidate"><Icon name="user" :size="14" /> Candidate · {{ test.title }}</span>
        <span v-if="mode === 'test'" class="timer" :class="{ low: remaining <= 300 }">
          <Icon name="clock" :size="14" /> {{ timeDisplay }}
        </span>
        <button class="topbtn" @click="submit"><Icon name="check" :size="13" /> Submit</button>
      </div>
    </header>

    <div v-if="mode === 'practice'" class="practice-strip">
      <strong>Practice mode</strong>
      <span>Timer is hidden. Switch to test mode for real exam rules.</span>
      <NuxtLink :to="`/tests/writing/${testId}?mode=test`">Start test mode</NuxtLink>
    </div>

    <section class="split">
      <div class="panel">
        <h2>{{ currentSection?.title }}</h2>
        <p style="color:#555;">{{ currentSection?.instructions }}</p>
        <div class="writing-prompt" v-html="currentSection?.body"></div>
        <div v-if="currentSection?.image_path" style="margin-top:16px;">
          <img :src="currentSection.image_path" alt="task visual" style="max-width:100%; border:1px solid #ccc; border-radius:4px;"/>
        </div>
        <p v-if="currentSection?.extra?.min_words" style="margin-top:12px; color:#555;">
          Write <strong>at least {{ currentSection.extra.min_words }} words</strong>.
          You should spend about <strong>{{ currentSection.extra.suggested_min || 20 }} minutes</strong> on this task.
        </p>
      </div>
      <div class="panel" style="background:#fafcff;">
        <h2>Your response — Task {{ currentSectionIndex + 1 }}</h2>
        <QuestionRenderer
          v-if="currentSection?.questions?.length"
          :question="currentSection.questions[0]"
          :model-value="responses[currentSection.questions[0].id]"
          @update="val => setResponse(currentSection.questions[0].id, val)"
        />
      </div>
    </section>

    <footer class="ielts-bottombar">
      <div v-for="(s, si) in test.sections" :key="s.id" class="nav-group">
        <span class="label">Task {{ si + 1 }}</span>
        <button class="nav-btn" :class="{ current: currentSectionIndex === si, answered: hasResponse(s) }"
                @click="currentSectionIndex = si">{{ si + 1 }}</button>
      </div>
      <div style="margin-left:auto; display:flex; gap:8px; padding-right:8px;">
        <button class="btn secondary sm" :disabled="currentSectionIndex === 0" @click="currentSectionIndex--">
          <Icon name="chevron-left" :size="14" /> Prev task
        </button>
        <button class="btn sm" v-if="currentSectionIndex < (test.sections.length - 1)" @click="currentSectionIndex++">
          Next task <Icon name="chevron-right" :size="14" />
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

const duration = computed(() => (test.value?.duration_min || 60) * 60)
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
function hasResponse(s: any) { return s.questions?.length && !!responses[s.questions[0].id] }

const modal = useModal()
async function submit() {
  const ok = await modal.confirm({
    title: 'Submit your writing?',
    message: 'Your essays will be locked and sent for review. You will not be able to edit them afterwards.',
    confirmText: 'Submit writing',
    cancelText: 'Keep writing',
    variant: 'info'
  })
  if (!ok) return
  const res: any = await $fetch('/api/attempts/submit', {
    method: 'POST', body: { test_id: testId, responses }
  })
  router.push(`/results/${res.attempt_id}`)
}
</script>
