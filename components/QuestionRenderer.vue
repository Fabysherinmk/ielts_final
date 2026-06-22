<!--
  Universal question renderer — supports every IELTS question type.
  Dispatches on `question.type` and reads config from `question.data`.
  Emits 'update' with the user's response; the parent owns response state.
-->
<template>
  <div class="question">
    <span class="qnum">{{ displayNumber ?? (question.number ?? question.order_index + 1) }}</span>
    <span v-if="!question.data?.linked_to && !isInlineSentenceCompletion" class="q-prompt" v-html="question.prompt"></span>

    <!-- MULTIPLE CHOICE single ----------------------------------------------->
    <div v-if="type === 'mcq_single'" class="options">
      <label v-for="(opt, i) in question.data?.options || []" :key="i">
        <input type="radio" :name="`q-${question.id}`" :value="letter(i)"
               :checked="modelValue === letter(i)" @change="emit('update', letter(i))"/>
        <strong>{{ letter(i) }}.</strong> {{ opt }}
      </label>
    </div>

    <!-- MULTIPLE CHOICE multi ------------------------------------------------>
    <div v-else-if="type === 'mcq_multi' && question.data?.linked_to" class="linked-question-note">
      This answer is entered with Question {{ question.data.linked_to }}.
    </div>

    <div v-else-if="type === 'mcq_multi'" class="options">
      <small style="color:#555;">Choose {{ question.data?.choose ?? 2 }} answers.</small>
      <label v-for="(opt, i) in question.data?.options || []" :key="i"
             :class="{ disabled: !isMultiSelected(letter(i)) && multiAtMax }">
        <input type="checkbox" :value="letter(i)"
               :checked="isMultiSelected(letter(i))"
               :disabled="!isMultiSelected(letter(i)) && multiAtMax"
               @change="toggleMulti(letter(i), ($event.target as HTMLInputElement).checked)"/>
        <strong>{{ letter(i) }}.</strong> {{ opt }}
      </label>
    </div>

    <!-- TRUE/FALSE/NOT GIVEN -------------------------------------------------->
    <div v-else-if="type === 'tfng'" class="options">
      <label v-for="val in ['TRUE','FALSE','NOT GIVEN']" :key="val">
        <input type="radio" :name="`q-${question.id}`" :value="val"
               :checked="modelValue === val" @change="emit('update', val)"/> {{ val }}
      </label>
    </div>

    <!-- YES/NO/NOT GIVEN ------------------------------------------------------>
    <div v-else-if="type === 'ynng'" class="options">
      <label v-for="val in ['YES','NO','NOT GIVEN']" :key="val">
        <input type="radio" :name="`q-${question.id}`" :value="val"
               :checked="modelValue === val" @change="emit('update', val)"/> {{ val }}
      </label>
    </div>

    <!-- MATCHING HEADINGS ---------------------------------------------------->
    <div v-else-if="type === 'matching_headings'" class="select-answer">
      <select :value="modelValue || ''" @change="emit('update', ($event.target as HTMLSelectElement).value)"
              class="answer-select">
        <option value="">-- Select heading --</option>
        <option v-for="h in question.data?.headings || []" :key="h.id" :value="h.id">
          {{ h.id }}. {{ h.text }}
        </option>
      </select>
    </div>

    <!-- WORD BANK / DRAG-DROP STYLE ------------------------------------------>
    <div v-else-if="hasChoiceBank" class="choice-bank-question">
      <button
        type="button"
        class="drop-zone"
        :class="{ filled: !!modelValue }"
        @dragover.prevent
        @drop="dropChoice"
      >
        <span v-if="modelValue">{{ selectedChoiceLabel }}</span>
        <span v-else>Drop answer here</span>
      </button>
      <div class="choice-bank" aria-label="Answer choices">
        <button
          v-for="(choice, i) in choiceBank"
          :key="choiceId(choice, i)"
          type="button"
          class="choice-chip"
          draggable="true"
          :class="{ selected: modelValue === choiceValue(choice, i) }"
          @dragstart="dragChoice($event, choice, i)"
          @click="assignChoice(choice, i)"
        >
          <strong v-if="choiceLabelPrefix(choice, i)">{{ choiceLabelPrefix(choice, i) }}</strong>
          {{ choiceText(choice) }}
        </button>
      </div>
      <small class="choice-bank-hint">Drag a choice into the answer box, or click a choice to place it.</small>
    </div>

    <!-- MATCHING INFORMATION / FEATURES -------------------------------------->
    <div v-else-if="isMatchingSelect" class="select-answer">
      <select :value="modelValue || ''" @change="emit('update', ($event.target as HTMLSelectElement).value)"
              class="answer-select">
        <option value="">-- Select --</option>
        <option v-for="opt in question.data?.options || []" :key="opt.id" :value="opt.id">
          {{ opt.id }}. {{ opt.text }}
        </option>
      </select>
    </div>

    <!-- SENTENCE COMPLETION with blank replaced inline ----------------------->
    <template v-else-if="isInlineSentenceCompletion">
      <span class="q-prompt q-prompt-with-blank">
        <template v-for="(part, i) in promptParts" :key="i">
          <span v-html="part"></span>
          <input
            v-if="i < promptParts.length - 1"
            type="text"
            class="inline-blank-input"
            :value="modelValue || ''"
            @input="emit('update', ($event.target as HTMLInputElement).value)"
            :placeholder="String(displayNumber ?? question.number ?? '')"
          />
        </template>
      </span>
      <div v-if="question.data?.word_limit" class="inline-word-limit">
        Write <strong>{{ wordLimitInstruction(question.data.word_limit) }}</strong> for each answer.
      </div>
    </template>

    <!-- FILL IN THE BLANK types (completion + short answer) ------------------>
    <div v-else-if="isCompletion" class="options">
      <small v-if="question.data?.word_limit" style="color:#555; display:block; margin-bottom:4px;">
        Write <strong>{{ wordLimitInstruction(question.data.word_limit) }}</strong> for each answer.
      </small>
      <input type="text" :value="modelValue || ''" @input="emit('update', ($event.target as HTMLInputElement).value)"
             :placeholder="question.data?.placeholder || 'Your answer...'"/>
    </div>

    <!-- WRITING long response ------------------------------------------------>
    <div v-else-if="type === 'writing'" style="margin-top:10px;">
      <textarea class="writing-editor" :value="modelValue || ''"
                @input="emit('update', ($event.target as HTMLTextAreaElement).value)"
                :placeholder="'Write your response here (minimum ' + (question.data?.min_words || 150) + ' words)'"></textarea>
      <div class="word-count">Words: {{ wordCount(modelValue) }} / min {{ question.data?.min_words || 150 }}</div>
    </div>

    <!-- SPEAKING recording -------------------------------------------------->
    <div v-else-if="type === 'speaking'" style="margin-top:10px;">
      <p v-if="question.data?.cue_card" v-html="question.data.cue_card" style="font-style:italic;"></p>
      <SpeakingRecorder :question-id="question.id" :audio="modelValue" @update="emit('update', $event)" />
    </div>

    <!-- UNKNOWN fallback ---------------------------------------------------->
    <div v-else class="options">
      <input type="text" :value="modelValue || ''" @input="emit('update', ($event.target as HTMLInputElement).value)"/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ question: any; modelValue?: any; displayNumber?: string | number }>()
const emit = defineEmits<{ (e: 'update', v: any): void }>()

const type = computed<string>(() => {
  const t = props.question.type as string
  // strip the skill prefix (reading_, listening_) to get normalized type
  return t.replace(/^(reading|listening)_/, '')
    .replace(/^writing_.*/, 'writing')
    .replace(/^speaking_.*/, 'speaking')
})

const isCompletion = computed(() =>
  ['sentence_completion','summary_completion','note_completion','table_completion',
   'form_completion','flowchart_completion','short_answer','diagram_labelling',
   'map_labelling'].includes(type.value)
)
const hasBlanks = computed(() => /_{2,}/.test(props.question.prompt || ''))
const promptParts = computed(() => (props.question.prompt || '').split(/_{2,}/))
const isInlineSentenceCompletion = computed(() => isCompletion.value && hasBlanks.value)
const isMatchingSelect = computed(() =>
  ['matching_information','matching_features','matching','matching_sentence_endings'].includes(type.value)
)

const choiceBank = computed<any[]>(() => {
  const bank = props.question.data?.word_bank
  if (Array.isArray(bank) && bank.length) return bank
  const options = props.question.data?.options
  if (props.question.data?.interaction === 'drag_drop' && Array.isArray(options)) return options
  return []
})
const hasChoiceBank = computed(() => choiceBank.value.length > 0)
const selectedChoiceLabel = computed(() => {
  const selected = choiceBank.value.find((choice, i) => choiceValue(choice, i) === props.modelValue)
  if (!selected) return props.modelValue
  const prefix = choiceLabelPrefix(selected, choiceBank.value.indexOf(selected))
  return `${prefix ? `${prefix} ` : ''}${choiceText(selected)}`
})

function letter(i: number) { return String.fromCharCode(65 + i) }

function choiceValue(choice: any, i: number) {
  if (typeof choice === 'string') return choice
  return choice?.id ?? choice?.value ?? letter(i)
}
function choiceText(choice: any) {
  return typeof choice === 'string' ? choice : (choice?.text ?? choice?.label ?? choice?.value ?? '')
}
function choiceId(choice: any, i: number) {
  return `${choiceValue(choice, i)}-${i}`
}
function choiceLabelPrefix(choice: any, i: number) {
  if (typeof choice === 'string') return ''
  return choice?.id ? `${choice.id}.` : `${letter(i)}.`
}
function assignChoice(choice: any, i: number) {
  emit('update', choiceValue(choice, i))
}
function dragChoice(e: DragEvent, choice: any, i: number) {
  e.dataTransfer?.setData('text/plain', choiceValue(choice, i))
  e.dataTransfer?.setData('application/x-ielts-choice', choiceValue(choice, i))
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'copy'
}
function dropChoice(e: DragEvent) {
  const value = e.dataTransfer?.getData('application/x-ielts-choice') || e.dataTransfer?.getData('text/plain')
  if (value) emit('update', value)
}

const multiMax = computed(() => props.question.data?.choose ?? 2)
const multiSelected = computed<string[]>(() => Array.isArray(props.modelValue) ? props.modelValue : [])
const multiAtMax = computed(() => multiSelected.value.length >= multiMax.value)
function isMultiSelected(val: string) { return multiSelected.value.includes(val) }

function toggleMulti(val: string, checked: boolean) {
  const cur = [...multiSelected.value]
  const idx = cur.indexOf(val)
  if (checked && idx < 0) {
    if (cur.length >= multiMax.value) return
    cur.push(val)
  }
  if (!checked && idx >= 0) cur.splice(idx, 1)
  emit('update', cur.sort())
}

function wordCount(s: any) {
  if (!s) return 0
  return String(s).trim().split(/\s+/).filter(Boolean).length
}

function wordLimitInstruction(limit: any) {
  const n = Number(limit)
  if (n === 1) return 'NO MORE THAN 1 WORD'
  if (Number.isFinite(n) && n > 1) return `NO MORE THAN ${n} WORDS`
  return `NO MORE THAN ${limit} WORDS`
}
</script>
