<!--
  Inline summary completion block.
  Renders a paragraph with numbered text inputs embedded at [N] placeholders.
  First question carries summary_title and summary_body in its data.
-->
<template>
  <div class="sib">
    <p v-if="title" class="sib__title"><strong>{{ title }}</strong></p>
    <p class="sib__body">
      <template v-for="(seg, i) in segments" :key="i">
        <span v-if="seg.type === 'text'" v-html="seg.text"></span>
        <span v-else class="sib__gap">
          <input
            type="text"
            class="sib__input"
            :placeholder="String(seg.qnum)"
            :value="responses[seg.qid] || ''"
            @input="emit('update', seg.qid, ($event.target as HTMLInputElement).value)"
          />
        </span>
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  questions: any[]
  responses: Record<number, any>
}>()

const emit = defineEmits<{
  (e: 'update', qid: number, val: string): void
}>()

const title = computed(() => props.questions[0]?.data?.summary_title ?? '')
const body = computed(() => props.questions[0]?.data?.summary_body ?? '')

const segments = computed(() => {
  const result: Array<
    | { type: 'text'; text: string }
    | { type: 'gap'; qnum: number; qid: number }
  > = []
  const text = body.value
  const regex = /\[(\d+)\]/g
  let last = 0
  let match
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) result.push({ type: 'text', text: text.slice(last, match.index) })
    const num = Number(match[1])
    const q = props.questions.find((q: any) => q.number === num)
    result.push({ type: 'gap', qnum: num, qid: q?.id ?? num })
    last = match.index + match[0].length
  }
  if (last < text.length) result.push({ type: 'text', text: text.slice(last) })
  return result
})
</script>
