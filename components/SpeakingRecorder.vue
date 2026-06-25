<template>
  <div class="recorder">
    <button
      type="button"
      class="record-btn"
      :class="{ recording: isRecording }"
      :disabled="uploading || (isTestMode && !!audio)"
      :aria-label="isRecording ? 'Stop recording' : (audio ? (isTestMode ? 'Recorded' : 'Re-record') : 'Start recording')"
      @click="toggle"
    >
      <Icon :name="isRecording ? 'pause' : 'mic'" :size="22" />
      <small class="record-btn__timer">{{ timer }}</small>
    </button>

    <div class="recorder__body">
      <div v-if="isRecording" class="recorder__status recording">
        <span class="dot" /> Recording… {{ timer }}
      </div>
      <div v-else-if="uploading" class="recorder__status">
        <Icon name="upload" :size="14" /> Uploading…
      </div>
      <div v-else-if="audio" class="recorder__status ok">
        <Icon name="check-circle" :size="14" /> {{ isTestMode ? 'Response saved (submitted)' : 'Response saved' }}
      </div>
      <div v-else class="recorder__status muted">
        <Icon name="info" :size="14" /> Tap the microphone to record your answer
      </div>

      <audio v-if="audio && !isRecording" :src="audio" controls style="width:100%; margin-top:6px; max-width:420px;" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  questionId: number
  audio?: string
  isTestMode?: boolean
}>(), {
  isTestMode: false
})
const emit = defineEmits<{ (e: 'update', url: string): void }>()
const modal = useModal()
const toast = useToast()

const isRecording = ref(false)
const uploading = ref(false)
const timer = ref('00:00')
let mediaRecorder: MediaRecorder | null = null
let chunks: Blob[] = []
let startAt = 0
let tickInterval: any = null

async function toggle() {
  if (!isRecording.value) await start()
  else await stop()
}

async function start() {
  try {
    if (!navigator.mediaDevices) {
      await modal.alert({
        title: 'Recording not supported',
        message: 'Your browser does not support microphone recording. Please try the latest Chrome, Firefox or Edge.',
        variant: 'warn'
      })
      return
    }
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    chunks = []
    mediaRecorder = new MediaRecorder(stream)
    mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data) }
    mediaRecorder.onstop = async () => {
      const blob = new Blob(chunks, { type: 'audio/webm' })
      stream.getTracks().forEach(t => t.stop())
      uploading.value = true
      try {
        const fd = new FormData()
        fd.append('kind', 'audio')
        fd.append('file', blob, `response-${props.questionId}-${Date.now()}.webm`)
        const res: any = await $fetch('/api/upload', { method: 'POST', body: fd }).catch(() => null)
        if (res?.path) {
          emit('update', res.path)
          toast.success('Recording saved')
        } else {
          toast.error('Could not upload recording. Please try again.')
        }
      } finally { uploading.value = false }
    }
    mediaRecorder.start()
    isRecording.value = true
    startAt = Date.now()
    tickInterval = setInterval(() => {
      const s = Math.floor((Date.now() - startAt) / 1000)
      timer.value = `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
    }, 250)
  } catch (e: any) {
    await modal.alert({
      title: 'Microphone unavailable',
      message: `We couldn't access your microphone: ${e?.message || e}. Please grant permission and try again.`,
      variant: 'danger'
    })
  }
}

async function stop() {
  mediaRecorder?.stop()
  isRecording.value = false
  if (tickInterval) { clearInterval(tickInterval); tickInterval = null }
}
</script>

<style scoped>
.recorder {
  display: flex; align-items: center; gap: 18px; margin-top: 10px;
  flex-wrap: wrap;
}
.record-btn__timer {
  font-family: ui-monospace, monospace;
  font-size: 11px; font-weight: 600; opacity: 0.95;
}
.recorder__body { flex: 1; min-width: 200px; }
.recorder__status {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600;
  padding: 5px 10px; border-radius: 999px;
  background: var(--surface-2); color: var(--muted);
}
.recorder__status.recording {
  background: #FEE2E2; color: #991B1B;
}
.recorder__status.recording .dot {
  width: 8px; height: 8px; border-radius: 999px;
  background: var(--err); display: inline-block;
  animation: blink 1.1s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1;} 50% { opacity: 0.3; } }
.recorder__status.ok { background: #D1FAE5; color: #065F46; }
.recorder__status.muted { background: var(--primary-50); color: var(--primary-700); }
</style>
