<!--
  Inspera-style summary completion with shared word bank.
  Renders a group of reading_summary_completion questions that share
  a word_bank as a single interactive block:
    – Word bank at the top (draggable chips labelled A, B, C…)
    – Each question is a sentence with an inline drop zone replacing ____
    – Chip dims when placed; × button on a filled blank returns the word
-->
<template>
  <div class="sdd">
    <!-- Instruction -->
    <p class="sdd__instruction">
      Drag an answer from the box into each gap, or click an answer to place it in the next empty gap.
      There are more answers than you need.
    </p>

    <!-- Word bank -->
    <div class="sdd__bank">
      <span class="sdd__bank-label">Word List</span>
      <div class="sdd__chips">
        <button
          v-for="(word, i) in wordBank"
          :key="i"
          type="button"
          class="sdd-chip"
          :class="{ 'sdd-chip--used': isUsed(word) }"
          :disabled="isUsed(word)"
          draggable="true"
          @dragstart="startDrag($event, word)"
          @click="placeWord(word)"
          :aria-label="`Choice ${letter(i)}: ${word}`"
        >
          <span class="sdd-chip__badge">{{ letter(i) }}</span>
          <span class="sdd-chip__text">{{ word }}</span>
        </button>
      </div>
    </div>

    <!-- Sentences with inline blanks -->
    <div class="sdd__sentences">
      <div
        v-for="q in questions"
        :key="q.id"
        class="sdd-row"
      >
        <span class="sdd-row__num">{{ q.number }}</span>
        <span class="sdd-row__body">
          <template v-for="(part, pi) in parsed[q.id]" :key="pi">
            <span v-if="part.type === 'text'" v-html="part.text" class="sdd-row__text"></span>
            <span
              v-else
              class="sdd-blank"
              :class="{
                'sdd-blank--filled': !!responses[q.id],
                'sdd-blank--over': dropTarget === q.id
              }"
              @dragover.prevent="dropTarget = q.id"
              @dragleave="dropTarget = null"
              @drop.prevent="onDrop($event, q.id)"
            >
              <template v-if="responses[q.id]">
                <span class="sdd-blank__word">{{ responses[q.id] }}</span>
                <button
                  type="button"
                  class="sdd-blank__clear"
                  @click.stop="clearBlank(q.id)"
                  title="Remove answer"
                >×</button>
              </template>
              <span v-else class="sdd-blank__hint">{{ q.number }}</span>
            </span>
          </template>
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  questions: any[]
  responses: Record<number, any>
}>()

const emit = defineEmits<{
  (e: 'update', qid: number, val: string | null): void
}>()

const dropTarget = ref<number | null>(null)

const wordBank = computed<string[]>(() =>
  props.questions[0]?.data?.word_bank ?? []
)

function letter(i: number) {
  return String.fromCharCode(65 + i)
}

function isUsed(word: string) {
  return Object.values(props.responses).some(v => v === word)
}

// Split each question prompt on ____ (3+ underscores) into text/blank parts.
// If no blank marker is found, the blank is appended at the end.
const parsed = computed(() => {
  const out: Record<number, Array<{ type: 'text' | 'blank'; text?: string }>> = {}
  for (const q of props.questions) {
    const segments: string[] = (q.prompt as string).split(/_{3,}/)
    const parts: Array<{ type: 'text' | 'blank'; text?: string }> = []
    if (segments.length === 1) {
      parts.push({ type: 'text', text: segments[0] })
      parts.push({ type: 'blank' })
    } else {
      segments.forEach((seg, i) => {
        if (seg) parts.push({ type: 'text', text: seg })
        if (i < segments.length - 1) parts.push({ type: 'blank' })
      })
    }
    out[q.id] = parts
  }
  return out
})

function startDrag(e: DragEvent, word: string) {
  e.dataTransfer?.setData('text/plain', word)
  e.dataTransfer?.setData('application/x-ielts-word', word)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

function onDrop(e: DragEvent, qid: number) {
  dropTarget.value = null
  const word =
    e.dataTransfer?.getData('application/x-ielts-word') ||
    e.dataTransfer?.getData('text/plain')
  if (!word || !wordBank.value.includes(word)) return
  emit('update', qid, word)
}

// Click a chip → place it in the first empty blank
function placeWord(word: string) {
  if (isUsed(word)) return
  const empty = props.questions.find(q => !props.responses[q.id])
  if (empty) emit('update', empty.id, word)
}

function clearBlank(qid: number) {
  emit('update', qid, null)
}
</script>
