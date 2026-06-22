<template>
  <div
    v-if="test"
    class="reading-exam-shell"
    :class="[`text-size-${textSize}`, { 'high-contrast': highContrast }]"
  >
    <header class="reading-topbar">
      <div class="reading-logo">IELTS</div>
      <div class="reading-candidate">
        <strong>Test taker ID</strong>
        <span>{{ test.title }}</span>
      </div>
      <div class="reading-status">
        <span class="reading-timer" :class="{ low: remaining <= 300 }">
          <Icon name="clock" :size="14" />
          {{ timeDisplay }}
        </span>
        <button class="inspera-icon-btn" title="Messages"><Icon name="bell" :size="22" /></button>
        <button class="inspera-icon-btn" title="Options" @click="optionsOpen = true"><Icon name="menu" :size="24" /></button>
      </div>
    </header>

    <section class="reading-split">
      <div class="reading-panel reading-passage">
        <h2>{{ currentSection?.title }}</h2>
        <p class="reading-instructions">{{ currentSection?.instructions }}</p>
        <!-- Passage HTML is transformed to inject para drop-zones when matching headings are active -->
        <div
          v-html="processedPassageBody"
          @dragover="onPassageDragOver"
          @drop.prevent="onPassageDrop"
          @click="onPassageClick"
        ></div>
      </div>

      <div class="reading-panel reading-questions">
        <h2>Questions {{ sectionQuestionRange(currentSection) }}</h2>
        <template v-for="group in groupedQuestions(currentSection)" :key="group.type + group.from">
          <div class="qsection-title">
            Questions {{ group.from }}-{{ group.to }}: {{ groupTitle(group) }}
          </div>

          <!-- Matching headings: draggable chip bank + paragraph drop slots -->
          <MatchingHeadingsDragDrop
            v-if="group.type === 'reading_matching_headings'"
            :questions="group.items"
            :responses="responses"
            @update="(qid, val) => setResponse(qid, val)"
          />

          <!-- Word bank sentence completion: draggable chips -->
          <SummaryDragDropBlock
            v-else-if="hasSummaryDragDrop(group)"
            :questions="group.items"
            :responses="responses"
            @update="(qid, val) => setResponse(qid, val)"
          />

          <!-- Inline paragraph summary completion: text inputs embedded in prose -->
          <SummaryInlineBlock
            v-else-if="hasSummaryInline(group)"
            :questions="group.items"
            :responses="responses"
            @update="(qid, val) => setResponse(qid, val)"
          />

          <!-- All other question types -->
          <template v-else>
            <div v-if="group.items[0]?.data?.options && optionListTypes.has(group.type)" class="instructions reading-option-list">
              <strong>{{ optionListTitle(group.type) }}</strong>
              <ol style="list-style-type: upper-alpha;">
                <li v-for="opt in group.items[0]?.data?.options || []" :key="opt.id || opt">
                  {{ typeof opt === 'string' ? opt : opt.text }}
                </li>
              </ol>
            </div>
            <QuestionRenderer
              v-for="q in group.items.filter((q: any) => !q.data?.linked_to)"
              :key="q.id"
              :question="q"
              :display-number="linkedRangeLabel(group.items, q)"
              :model-value="responses[q.id]"
              @update="val => setResponse(q.id, val)"
            />
          </template>
        </template>
      </div>
    </section>

    <div v-if="optionsOpen" class="options-page">
      <header>
        <h1>Options</h1>
        <button class="inspera-icon-btn" title="Close options" @click="optionsOpen = false"><Icon name="x" :size="26" /></button>
      </header>
      <main>
        <button class="option-row primary" @click="optionsOpen = false; submit()">
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

    <footer class="reading-bottombar">
      <div v-for="(s, si) in test.sections" :key="s.id" class="nav-group">
        <span class="label">Part {{ si + 1 }}</span>
        <button
          v-for="q in s.questions"
          :key="q.id"
          class="nav-btn"
          :class="{ answered: !!responses[q.id], current: currentSectionIndex === si }"
          @click="goTo(si)"
        >
          {{ q.number }}
        </button>
      </div>
      <div class="reading-footer-actions">
        <button class="btn secondary sm" :disabled="currentSectionIndex === 0" @click="goTo(currentSectionIndex - 1)">
          <Icon name="chevron-left" :size="14" /> Prev passage
        </button>
        <button class="btn sm" v-if="currentSectionIndex < (test.sections.length - 1)" @click="goTo(currentSectionIndex + 1)">
          Next passage <Icon name="chevron-right" :size="14" />
        </button>
        <button class="btn cta sm" v-else @click="submit">
          <Icon name="check" :size="14" /> Finish
        </button>
      </div>
    </footer>
  </div>
  <div v-else class="container"><p>Loading test...</p></div>
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

// ----- Matching Headings: transform passage HTML to inject para drop zones -----

const matchingHeadingsQuestions = computed(() => {
  return (currentSection.value?.questions ?? []).filter((q: any) => q.type === 'reading_matching_headings')
})

const processedPassageBody = computed<string>(() => {
  const body: string = currentSection.value?.body ?? ''
  if (!matchingHeadingsQuestions.value.length) return body

  // Build maps for fast lookup
  const paraToQ = new Map<string, any>()
  for (const q of matchingHeadingsQuestions.value) {
    const m = (q.prompt as string).match(/Paragraph\s+([A-Z])/i)
    if (m) paraToQ.set(m[1].toUpperCase(), q)
  }
  const headingMap = new Map<string, string>()
  for (const h of (matchingHeadingsQuestions.value[0]?.data?.headings ?? [])) {
    headingMap.set(h.id, h.text)
  }

  // Inject a block drop zone BEFORE each paragraph; strip the para-label from the text
  return body.replace(/<p><span class="para-label">([A-G])<\/span>/g, (match, letter) => {
    const q = paraToQ.get(letter.toUpperCase())
    if (!q) return match
    const placed: string | null = responses[q.id] ?? null
    const zoneClass = placed ? 'phz phz--filled' : 'phz'
    const inner = placed
      ? `<span class="phz__qnum">${q.number}</span><span class="phz__badge">${placed}</span><span class="phz__text">${headingMap.get(placed) ?? placed}</span><button class="phz__clear" data-qid="${q.id}" title="Remove">×</button>`
      : `<span class="phz__qnum">${q.number}</span><span class="phz__hint">Drop heading here</span>`
    // Para-label span is intentionally omitted — the question number in the drop zone identifies the paragraph
    return `<div class="${zoneClass}" data-qid="${q.id}">${inner}</div><p>`
  })
})

function onPassageDragOver(e: DragEvent) {
  if ((e.target as HTMLElement).closest?.('.phz')) e.preventDefault()
}

function onPassageDrop(e: DragEvent) {
  const zone = (e.target as HTMLElement).closest?.('[data-qid]') as HTMLElement | null
  if (!zone) return
  const headingId =
    e.dataTransfer?.getData('application/x-ielts-heading') ||
    e.dataTransfer?.getData('text/plain')
  if (!headingId) return
  const qid = Number(zone.dataset.qid)
  if (qid) setResponse(qid, headingId)
}

function onPassageClick(e: MouseEvent) {
  const btn = (e.target as HTMLElement).closest?.('.phz__clear') as HTMLElement | null
  if (!btn) return
  e.preventDefault()
  const qid = Number(btn.dataset.qid)
  if (qid) setResponse(qid, null)
}
const optionsOpen = ref(false)
const highContrast = ref(false)
type TextSize = 'small' | 'medium' | 'large'
const textSize = ref<TextSize>('medium')
const textSizeChoices: Array<{ value: TextSize; mark: string; label: string }> = [
  { value: 'small', mark: 'A-', label: 'Lower' },
  { value: 'medium', mark: 'A', label: 'Middle' },
  { value: 'large', mark: 'A+', label: 'Higher' }
]
const textSizeLabel = computed(() => textSizeChoices.find(choice => choice.value === textSize.value)?.label || 'Middle')
const optionListTypes = new Set([
  'reading_matching_information',
  'reading_matching_features',
  'reading_matching_sentence_endings'
])

const duration = computed(() => (test.value?.duration_min || 60) * 60)
const remaining = ref(0)
let timer: ReturnType<typeof setInterval> | null = null
const timeDisplay = computed(() => {
  const s = Math.max(0, remaining.value)
  const m = Math.floor(s / 60), sec = s % 60
  return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`
})

onMounted(() => {
  const savedTextSize = typeof window !== 'undefined' ? window.localStorage.getItem('ielts-reading-text-size') : null
  if (savedTextSize === 'small' || savedTextSize === 'medium' || savedTextSize === 'large') {
    textSize.value = savedTextSize
  }
  remaining.value = duration.value
  timer = setInterval(() => {
    remaining.value--
    if (remaining.value <= 0) {
      if (timer) clearInterval(timer)
      submit()
    }
  }, 1000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

function setResponse(qid: number, v: any) { responses[qid] = v }
function setTextSize(size: TextSize) {
  textSize.value = size
  if (typeof window !== 'undefined') window.localStorage.setItem('ielts-reading-text-size', size)
}
function goTo(si: number) {
  if (!test.value?.sections?.[si]) return
  currentSectionIndex.value = si
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
    } else {
      cur.items.push(q); cur.to = q.number
    }
  }
  return groups
}

function linkedRangeLabel(items: any[], q: any): string {
  const linked = items.filter(item => item.data?.linked_to === q.number)
  if (!linked.length) return String(q.number ?? '')
  const nums = [q.number, ...linked.map((i: any) => i.number)].filter(Boolean).sort((a: number, b: number) => a - b)
  return `${nums[0]}-${nums[nums.length - 1]}`
}

function hasSummaryDragDrop(group: any) {
  return Array.isArray(group.items[0]?.data?.word_bank) && group.items[0].data.word_bank.length > 0
}

function hasSummaryInline(group: any) {
  return !!group.items[0]?.data?.summary_body
}

function groupTitle(group: any) {
  if (group.type === 'reading_matching_headings') return 'Choose the correct heading for each paragraph.'
  if (hasSummaryDragDrop(group)) return 'Complete each sentence. Choose the correct ending from the box below.'
  if (hasSummaryInline(group)) {
    const limit = group.items[0]?.data?.word_limit
    const limitText = limit === 1 ? 'ONE WORD ONLY' : limit ? `NO MORE THAN ${limit} WORDS` : 'ONE WORD ONLY'
    return `Complete the summary. Write ${limitText} from the text for each answer.`
  }
  return typeLabel(group.type)
}

function optionListTitle(type: string) {
  const map: Record<string, string> = {
    reading_matching_information: 'Reading passage sections',
    reading_matching_features: 'List of People',
    reading_matching_sentence_endings: 'List of Endings'
  }
  return map[type] || 'Options'
}

function typeLabel(t: string) {
  const map: Record<string,string> = {
    reading_matching_headings: 'Choose the correct heading for each paragraph.',
    reading_tfng: 'Do the statements agree with the information in the passage? TRUE / FALSE / NOT GIVEN.',
    reading_ynng: 'Do the statements agree with the views of the writer? YES / NO / NOT GIVEN.',
    reading_mcq_single: 'Choose the correct letter A, B, C or D.',
    reading_mcq_multi: 'Choose TWO letters.',
    reading_note_completion: 'Complete the notes below.',
    reading_table_completion: 'Complete the table below.',
    reading_flowchart_completion: 'Complete the flow-chart below.',
    reading_summary_completion: 'Complete the summary below.',
    reading_sentence_completion: 'Complete the sentences below.',
    reading_short_answer: 'Answer the questions below.',
    reading_matching_information: 'Which section contains the following information?',
    reading_matching_features: 'Match each statement with the correct option.',
    reading_matching_sentence_endings: 'Complete each sentence with the correct ending.',
    reading_diagram_labelling: 'Complete the labels on the diagram.'
  }
  return map[t] || t
}

const modal = useModal()
async function submit() {
  const answered = Object.keys(responses).length
  const totalQs = (test.value?.sections || []).reduce((n: number, s: any) => n + (s.questions?.length || 0), 0)
  const ok = await modal.confirm({
    title: 'Submit your answers?',
    message: `You have answered ${answered} of ${totalQs} questions. Once submitted, you cannot change your responses.`,
    confirmText: 'Submit reading',
    cancelText: 'Keep going',
    variant: 'info'
  })
  if (!ok) return
  const res: any = await $fetch('/api/attempts/submit', {
    method: 'POST',
    body: { test_id: testId, responses }
  })
  router.push(`/results/${res.attempt_id}`)
}
</script>
