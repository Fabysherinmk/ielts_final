<template>
  <div v-if="test" class="inspera-shell" :class="[`inspera-shell--${mode}`, `text-size-${textSize}`, { 'high-contrast': highContrast }]">
    <header class="inspera-topbar">
      <div class="inspera-logo">IELTS</div>
      <div class="inspera-candidate">
        <strong>Test taker ID</strong>
        <span v-if="mode === 'test' && audioPlaying"><Icon name="volume-2" :size="12" /> Audio is Playing</span>
        <span v-else-if="mode === 'test' && currentSectionStarted"><Icon name="volume-x" :size="12" /> Audio played once</span>
        <span v-else-if="mode === 'practice'"><Icon name="rotate-ccw" :size="12" /> Practice mode</span>
      </div>
      <div class="inspera-status">
        <span class="connection"><Icon name="wifi" :size="21" /></span>
        <button class="inspera-icon-btn" title="Messages"><Icon name="bell" :size="22" /></button>
        <button class="inspera-icon-btn" title="Options" @click="optionsOpen = true"><Icon name="menu" :size="24" /></button>
      </div>
    </header>

    <div v-if="mode === 'practice'" class="practice-strip">
      <strong>Practice mode</strong>
      <span>Audio can be paused, replayed, and reviewed. Switch to test mode for real exam rules.</span>
      <NuxtLink :to="`/tests/listening/${testId}?mode=test`">Start test mode</NuxtLink>
    </div>

    <main v-if="!reviewOpen" class="inspera-main">
      <aside class="inspera-part-panel">
        <h2>Part {{ currentSectionIndex + 1 }}</h2>
        <p>{{ currentSection?.instructions || `Listen and answer questions ${sectionQuestionRange(currentSection)}.` }}</p>
        <div class="part-meta">
          <span>Questions {{ sectionQuestionRange(currentSection) }}</span>
          <span v-if="mode === 'test'">{{ timeDisplay }}</span>
        </div>

        <!-- Practice mode: TTS player or real audio -->
        <div v-if="mode === 'practice'" class="practice-audio-wrap">
          <div v-if="hasTts" class="tts-player">
            <div class="tts-player__label">
              <Icon name="volume-2" :size="15" /> AI Narrator — practice mode
            </div>
            <div class="tts-player__controls">
              <button class="tts-btn tts-btn--play" @click="ttsToggle" :title="ttsPlaying ? 'Pause' : 'Play'">
                <Icon :name="ttsPlaying ? 'pause-circle' : 'play-circle'" :size="32" />
              </button>
              <button class="tts-btn" @click="ttsStop" title="Stop & reset">
                <Icon name="square" :size="22" />
              </button>
              <button class="tts-btn" @click="ttsReplay" title="Replay from start">
                <Icon name="rotate-ccw" :size="20" />
              </button>
            </div>
            <p class="tts-player__hint">You can replay the audio as many times as needed in practice mode.</p>
          </div>
          <div v-else-if="currentSection?.audio_path">
            <audio :src="currentSection.audio_path" controls preload="metadata"></audio>
          </div>
          <div v-else class="banner warn">
            <Icon name="alert-triangle" :size="18" />
            <span>No audio attached to this part.</span>
          </div>
        </div>

        <!-- Test mode: TTS status or MP3 status -->
        <div v-else-if="mode === 'test'">
          <div v-if="hasTts || currentSection?.audio_path" class="test-audio-status">
            <Icon :name="audioPlaying ? 'volume-2' : currentSectionStarted ? 'volume-x' : 'headphones'" :size="18" />
            <span>{{ audioStatusText }}</span>
          </div>
          <div v-else class="banner warn" style="margin-top:12px;">
            <Icon name="alert-triangle" :size="18" />
            <span>No audio is attached to this part yet.</span>
          </div>
        </div>

        <img v-if="currentSection?.image_path" :src="currentSection.image_path" alt="Question diagram" class="part-image" />
      </aside>

      <section class="inspera-question-surface">
        <div class="question-paper-head">
          <h3>Questions {{ sectionQuestionRange(currentSection) }}</h3>
          <p>{{ sectionPrompt }}</p>
        </div>
        <div v-if="currentSection?.body" class="question-sheet" v-html="currentSection.body"></div>

        <template v-for="group in groupedQuestions(currentSection)" :key="group.type + group.from">
          <div class="qsection-title">
            Questions {{ group.from }}-{{ group.to }}: {{ typeLabel(group.type) }}
          </div>
          <QuestionRenderer
            v-for="q in group.items"
            :key="q.id"
            :question="q"
            :model-value="responses[q.id]"
            @update="val => setResponse(q.id, val)"
          />
        </template>
      </section>
    </main>

    <main v-else class="inspera-submit-page">
      <div class="submit-panel">
        <p>Click submit to finish, or select a question number below to review your answers.</p>
        <button class="submit-next-btn" @click="submit">
          <Icon name="send" :size="16" /> Submit
        </button>
      </div>
      <h2>Table of contents</h2>
      <div class="toc-parts">
        <button
          v-for="(s, si) in test.sections"
          :key="s.id"
          type="button"
          class="toc-part"
          @click="goTo(si)"
        >
          <strong>Part {{ si + 1 }}</strong>
          <span>{{ answeredInSection(s) }} of {{ s.questions?.length || 0 }} questions attempted</span>
        </button>
      </div>
    </main>

    <!-- Real MP3 audio element (only for non-TTS tests in test mode) -->
    <audio
      v-if="mode === 'test' && currentSection?.audio_path && !hasTts"
      ref="testAudio"
      :key="currentSection.id"
      :src="currentSection.audio_path"
      preload="metadata"
      @play="audioPlaying = true"
      @pause="audioPlaying = false"
      @ended="markAudioEnded"
    />

    <!-- Audio start overlay (test mode, not yet started) -->
    <div v-if="showAudioOverlay" class="audio-start-overlay" role="dialog" aria-modal="true">
      <div class="audio-start-dialog">
        <Icon name="headphones" :size="86" />
        <p>You will be listening to an audio clip during this test. You will not be permitted to pause or rewind the audio while answering the questions.</p>
        <p>To continue, click Play.</p>
        <button class="audio-play-btn" @click="startTestAudio"><Icon name="play-circle" :size="22" /> Play</button>
      </div>
    </div>

    <!-- Options panel -->
    <div v-if="optionsOpen" class="options-page">
      <header>
        <h1>Options</h1>
        <button class="inspera-icon-btn" title="Close options" @click="optionsOpen = false"><Icon name="x" :size="26" /></button>
      </header>
      <main>
        <button class="option-row primary" @click="reviewOpen = true; optionsOpen = false">
          <Icon name="send" :size="22" /> Go to submission page <Icon name="chevron-right" :size="22" />
        </button>
        <button class="option-row" @click="highContrast = !highContrast">
          <Icon name="contrast" :size="20" /> Contrast <strong>{{ highContrast ? 'On' : 'Off' }}</strong>
        </button>
        <div class="option-row option-row--stacked">
          <span class="option-row__label">
            <Icon name="zoom-in" :size="20" /> Text size <strong>{{ textSizeLabel }}</strong>
          </span>
          <div class="text-size-control" role="group" aria-label="Text size">
            <button
              v-for="choice in textSizeChoices"
              :key="choice.value"
              type="button"
              class="text-size-choice"
              :class="{ active: textSize === choice.value }"
              :aria-pressed="textSize === choice.value"
              @click="setTextSize(choice.value)"
            >
              <strong>{{ choice.mark }}</strong>
              <span>{{ choice.label }}</span>
            </button>
          </div>
        </div>
      </main>
    </div>

    <footer class="inspera-bottombar">
      <nav class="floating-arrows" aria-label="Previous / next question">
        <button :disabled="currentSectionIndex === 0" @click="goTo(currentSectionIndex - 1)" title="Previous"><Icon name="arrow-left" :size="30" /></button>
        <button :disabled="currentSectionIndex >= test.sections.length - 1" @click="goTo(currentSectionIndex + 1)" title="Next"><Icon name="arrow-right" :size="30" /></button>
      </nav>
      <nav class="inspera-question-nav" aria-label="Questions">
        <span class="part-tab">Part {{ currentSectionIndex + 1 }}</span>
        <button
          v-for="q in currentSection?.questions || []"
          :key="q.id"
          class="inspera-qnav-btn"
          :class="{ attempted: isAnswered(q.id), active: activeQuestionNumber === q.number }"
          @click="activeQuestionNumber = q.number; reviewOpen = false"
        >
          <span>{{ q.number }}</span>
        </button>
        <button class="review-btn" title="Review your answers" @click="reviewOpen = true">
          <Icon name="check" :size="24" />
        </button>
      </nav>
    </footer>
  </div>

  <!-- Fallback / loading -->
  <div v-else class="container">
    <p v-if="testError">This listening test is not available.</p>
    <p v-else>Loading test...</p>
    <NuxtLink to="/tests" class="btn sm" style="margin-top:12px;">Back to tests</NuxtLink>
  </div>
</template>

<script setup lang="ts">
import { normalizeListeningMode, usesExamTiming } from '~/utils/listeningMode'

definePageMeta({ layout: 'test', key: route => route.fullPath })
const route = useRoute()
const router = useRouter()
const testId = Number(route.params.id)

const { data: test, error: testError } = await useFetch<any>(`/api/tests/${testId}`)
const responses = reactive<Record<number, any>>({})
const currentSectionIndex = ref(0)
const activeQuestionNumber = ref<number | null>(null)
const reviewOpen = ref(false)
const optionsOpen = ref(false)
const highContrast = ref(false)
type TextSize = 'small' | 'medium' | 'large'
const textSize = ref<TextSize>('medium')
const audioPlaying = ref(false)
const audioEnded = reactive<Record<number, boolean>>({})
const audioStarted = reactive<Record<number, boolean>>({})
const testAudio = ref<HTMLAudioElement | null>(null)
let timer: ReturnType<typeof setInterval> | null = null

// ── TTS state ──
const ttsPlaying = ref(false)
let ttsUtterance: SpeechSynthesisUtterance | null = null

const mode = computed(() => normalizeListeningMode(route.query.mode))
const currentSection = computed(() => test.value?.sections?.[currentSectionIndex.value])

// True when this section uses TTS (audio_path is a placeholder for TTS)
const hasTts = computed(() => {
  const path: string = currentSection.value?.audio_path || ''
  const script: string = currentSection.value?.extra?.tts_script || ''
  return !!script || path.includes('mock-test-')
})

const ttsScript = computed(() => currentSection.value?.extra?.tts_script || '')

const textSizeChoices: Array<{ value: TextSize; mark: string; label: string }> = [
  { value: 'small', mark: 'A-', label: 'Lower' },
  { value: 'medium', mark: 'A', label: 'Middle' },
  { value: 'large', mark: 'A+', label: 'Higher' }
]
const textSizeLabel = computed(() => textSizeChoices.find(c => c.value === textSize.value)?.label || 'Middle')
const currentSectionStarted = computed(() => currentSection.value ? !!audioStarted[currentSection.value.id] : false)
const showAudioOverlay = computed(() =>
  mode.value === 'test' &&
  (hasTts.value || !!currentSection.value?.audio_path) &&
  !currentSectionStarted.value
)
const audioStatusText = computed(() => {
  if (audioPlaying.value || ttsPlaying.value) return 'Audio is playing. Pause, rewind, and replay are disabled in test mode.'
  if (currentSection.value && audioEnded[currentSection.value.id]) return 'Audio ended for this part.'
  if (currentSectionStarted.value) return 'Audio has already been started for this part.'
  return 'Press Play when you are ready. The audio can be played once only.'
})
const sectionPrompt = computed(() =>
  currentSection.value?.extra?.prompt ||
  (mode.value === 'test' ? 'Answer the questions while the audio plays.' : 'Use the player to listen, pause, and replay as needed.')
)

const duration = computed(() => (test.value?.duration_min || 40) * 60)
const remaining = ref(0)
const timeDisplay = computed(() => {
  if (!usesExamTiming(mode.value)) return 'Practice'
  const s = Math.max(0, remaining.value)
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

onMounted(() => {
  const savedTextSize = typeof window !== 'undefined' ? window.localStorage.getItem('ielts-listening-text-size') : null
  if (savedTextSize === 'small' || savedTextSize === 'medium' || savedTextSize === 'large') {
    textSize.value = savedTextSize
  }
  remaining.value = duration.value
  activeQuestionNumber.value = currentSection.value?.questions?.[0]?.number ?? null
  if (usesExamTiming(mode.value)) {
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
  ttsStopAll()
})

watch(currentSectionIndex, () => {
  stopTestAudio()
  ttsStopAll()
  audioPlaying.value = false
  ttsPlaying.value = false
  activeQuestionNumber.value = currentSection.value?.questions?.[0]?.number ?? null
})

// ── TTS helpers ──
function ttsStopAll() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
  ttsPlaying.value = false
  ttsUtterance = null
}

function ttsSpeak(script: string, onEnd?: () => void) {
  if (!script || typeof window === 'undefined' || !window.speechSynthesis) return
  ttsStopAll()
  const utter = new SpeechSynthesisUtterance(script)
  utter.rate = 0.92
  utter.pitch = 1.0
  utter.lang = 'en-GB'
  utter.onstart = () => { ttsPlaying.value = true; audioPlaying.value = true }
  utter.onend = () => {
    ttsPlaying.value = false
    audioPlaying.value = false
    if (currentSection.value) audioEnded[currentSection.value.id] = true
    onEnd?.()
  }
  utter.onerror = () => { ttsPlaying.value = false; audioPlaying.value = false }
  ttsUtterance = utter
  window.speechSynthesis.speak(utter)
}

function ttsToggle() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  if (ttsPlaying.value) {
    window.speechSynthesis.pause()
    ttsPlaying.value = false
    audioPlaying.value = false
  } else if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
    ttsPlaying.value = true
    audioPlaying.value = true
  } else {
    ttsSpeak(ttsScript.value)
  }
}

function ttsStop() {
  ttsStopAll()
}

function ttsReplay() {
  ttsStopAll()
  ttsSpeak(ttsScript.value)
}

// ── Audio helpers ──
function isAnswered(qid: number) {
  const value = responses[qid]
  return Array.isArray(value) ? value.length > 0 : !!value
}

function setResponse(qid: number, v: any) { responses[qid] = v }

function setTextSize(size: TextSize) {
  textSize.value = size
  if (typeof window !== 'undefined') window.localStorage.setItem('ielts-listening-text-size', size)
}

function goTo(si: number) {
  if (!test.value?.sections?.[si]) return
  reviewOpen.value = false
  currentSectionIndex.value = si
}

function stopTestAudio() {
  if (testAudio.value) {
    testAudio.value.pause()
    testAudio.value.currentTime = 0
  }
  audioPlaying.value = false
}

async function startTestAudio() {
  if (!currentSection.value) return
  audioStarted[currentSection.value.id] = true

  if (hasTts.value) {
    // TTS mode
    ttsSpeak(ttsScript.value, () => {
      if (currentSection.value) audioEnded[currentSection.value.id] = true
    })
  } else {
    // Real MP3 mode
    await nextTick()
    if (!testAudio.value) return
    testAudio.value.controls = false
    testAudio.value.currentTime = 0
    await testAudio.value.play()
  }
}

function markAudioEnded() {
  audioPlaying.value = false
  if (currentSection.value) audioEnded[currentSection.value.id] = true
}

function sectionQuestionRange(s: any) {
  if (!s?.questions?.length) return ''
  const nums = s.questions.map((q: any) => q.number).filter((n: any) => n != null)
  return nums.length ? `${Math.min(...nums)}-${Math.max(...nums)}` : ''
}

function groupedQuestions(s: any) {
  if (!s?.questions) return []
  const groups: any[] = []
  let cur: any = null
  for (const q of s.questions) {
    if (!cur || cur.type !== q.type || q.data?.group_break) {
      cur = { type: q.type, from: q.number, to: q.number, items: [q] }
      groups.push(cur)
    } else { cur.items.push(q); cur.to = q.number }
  }
  return groups
}

function answeredInSection(s: any) {
  return (s?.questions || []).filter((q: any) => isAnswered(q.id)).length
}

function typeLabel(t: string) {
  const map: Record<string,string> = {
    listening_form_completion: 'Complete the form below.',
    listening_note_completion: 'Complete the notes below.',
    listening_table_completion: 'Complete the table.',
    listening_flowchart_completion: 'Complete the flow-chart.',
    listening_summary_completion: 'Complete the summary.',
    listening_sentence_completion: 'Complete the sentences.',
    listening_mcq_single: 'Choose the correct letter A, B or C.',
    listening_mcq_multi: 'Choose TWO letters.',
    listening_matching: 'Choose from the option box and move the correct answer into the gap.',
    listening_map_labelling: 'Label the map/plan below.',
    listening_short_answer: 'Answer the questions.'
  }
  return map[t] || t
}

const modal = useModal()
async function submit() {
  stopTestAudio()
  ttsStopAll()
  const answered = Object.keys(responses).filter((id) => isAnswered(Number(id))).length
  const totalQs = (test.value?.sections || []).reduce((n: number, s: any) => n + (s.questions?.length || 0), 0)
  const ok = await modal.confirm({
    title: 'Submit your answers?',
    message: `You have answered ${answered} of ${totalQs} questions. Once submitted, you cannot change your responses.`,
    confirmText: 'Submit listening',
    cancelText: 'Keep going',
    variant: 'info'
  })
  if (!ok) return
  const res: any = await $fetch('/api/attempts/submit', {
    method: 'POST', body: { test_id: testId, responses }
  })
  router.push(`/results/${res.attempt_id}`)
}
</script>

<style scoped>
/* TTS player styles */
.practice-audio-wrap { margin-top: 14px; }

.tts-player {
  background: linear-gradient(135deg, #1a1f3a, #2d3561);
  border-radius: 14px;
  padding: 18px 20px;
  color: #fff;
}
.tts-player__label {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: #93c5fd;
  margin-bottom: 14px;
}
.tts-player__controls {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}
.tts-btn {
  background: rgba(255,255,255,0.12);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #fff;
  transition: background 0.15s, transform 0.15s;
}
.tts-btn:hover { background: rgba(255,255,255,0.24); transform: scale(1.07); }
.tts-btn--play {
  width: 56px;
  height: 56px;
  background: #e11b2b;
}
.tts-btn--play:hover { background: #b91c1c; }
.tts-player__hint {
  font-size: 11px;
  color: rgba(255,255,255,0.55);
  margin: 0;
  line-height: 1.5;
}
</style>
