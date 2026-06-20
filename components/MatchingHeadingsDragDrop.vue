<!--
  Matching Headings drag-and-drop component (right/questions panel).
  Renders the List of Headings as draggable chips and each paragraph
  question as a drop slot. Heading can also be dragged onto the passage
  paragraph labels on the left — that is handled by [id].vue.
-->
<template>
  <div class="mhdd">
    <p class="mhdd__instruction">
      Drag a heading from the list below onto a paragraph in the passage,
      or drop it into the slot next to the paragraph name.
      Click a placed heading to remove it.
    </p>

    <!-- Draggable heading chips -->
    <div class="mhdd__bank">
      <span class="mhdd__bank-label">List of Headings</span>
      <div class="mhdd__chips">
        <div
          v-for="h in headings"
          :key="h.id"
          class="mhdd-chip"
          :class="{ 'mhdd-chip--used': isUsed(h.id) }"
          draggable="true"
          @dragstart="startDrag($event, h.id)"
          @click="placeHeading(h.id)"
          :aria-label="`Heading ${h.id}: ${h.text}`"
        >
          <span class="mhdd-chip__badge">{{ h.id }}</span>
          <span class="mhdd-chip__text">{{ h.text }}</span>
        </div>
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

const headings = computed<{ id: string; text: string }[]>(() =>
  props.questions[0]?.data?.headings ?? []
)

function isUsed(id: string) {
  return Object.values(props.responses).some(v => v === id)
}

function startDrag(e: DragEvent, id: string) {
  e.dataTransfer?.setData('text/plain', id)
  e.dataTransfer?.setData('application/x-ielts-heading', id)
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move'
}

// Click a chip → place it in the first empty passage zone
function placeHeading(id: string) {
  if (isUsed(id)) return
  const empty = props.questions.find(q => !props.responses[q.id])
  if (empty) emit('update', empty.id, id)
}
</script>
