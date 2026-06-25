<template>
  <div class="whatsapp-player">
    <!-- Play/Pause Button -->
    <button
      type="button"
      class="play-btn"
      :title="isPlaying ? 'Pause' : 'Play'"
      @click="toggle"
    >
      <Icon :name="isPlaying ? 'pause' : 'play'" :size="18" />
    </button>

    <!-- Avatar / Microphone Status Circle -->
    <div 
      class="avatar-container" 
      :style="{ backgroundColor: progressPercent > 0 ? '#53bdeb' : '#00a884' }"
    >
      <Icon name="mic" :size="13" style="color: #fff;" />
    </div>

    <!-- Main Player Body -->
    <div class="player-main">
      <!-- Simulated Waveform Slider -->
      <div class="waveform-container" @click="handleWaveformClick">
        <span
          v-for="(h, idx) in waveformHeights"
          :key="idx"
          class="waveform-bar"
          :style="{ height: h + 'px' }"
          :class="{ played: idx / waveformHeights.length <= progressPercent }"
        />
      </div>

      <!-- Time and Metadata Info -->
      <div class="meta-info">
        <span>{{ formatTime(currentTime) }}</span>
        <span v-if="hasTts" style="font-size: 9px; text-transform: uppercase; font-weight: 700; color: #a6b6c0;">TTS</span>
      </div>
    </div>

    <!-- Playback Speed Badge -->
    <button 
      type="button" 
      class="speed-badge" 
      @click="toggleSpeed"
    >
      {{ speed }}x
    </button>

    <!-- HTML5 Audio Element for MP3 files -->
    <audio
      v-if="!hasTts && audioPath"
      ref="audioElement"
      :src="audioPath"
      preload="metadata"
      @timeupdate="onAudioTimeUpdate"
      @loadedmetadata="onAudioLoadedMetadata"
      @ended="onAudioEnded"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onBeforeUnmount, watch } from 'vue'

const props = defineProps<{
  audioPath?: string
  ttsScript?: string
  hasTts: boolean
}>()

// Player State
const speed = ref(1) // 1, 1.5, 2
const progressPercent = ref(0)

// MP3 State & References
const audioElement = ref<HTMLAudioElement | null>(null)
const audioPlaying = ref(false)
const audioDuration = ref(0)
const audioCurrentTime = ref(0)

// TTS State
const ttsPlaying = ref(false)
const spokenCharIndex = ref(0)
let utter: SpeechSynthesisUtterance | null = null

// Waveform Heights Pattern (25 bars)
const waveformHeights = [
  12, 18, 8, 22, 14, 16, 10, 20, 6, 12, 
  18, 14, 22, 16, 8, 12, 14, 10, 18, 20, 
  12, 8, 16, 14, 10
]

const isPlaying = computed(() => {
  return props.hasTts ? ttsPlaying.value : audioPlaying.value
})

const estimatedTtsDuration = computed(() => {
  if (!props.ttsScript) return 0
  const words = props.ttsScript.split(/\s+/).length
  return words / (150 / 60) // approx 150 words per minute
})

const currentTime = computed(() => {
  if (props.hasTts) {
    return progressPercent.value * estimatedTtsDuration.value
  }
  return audioCurrentTime.value
})

// Formatting helper: seconds to M:SS
function formatTime(s: number) {
  if (isNaN(s) || s === Infinity) return '0:00'
  const min = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${min}:${String(sec).padStart(2, '0')}`
}

function toggle() {
  if (props.hasTts) {
    ttsToggle()
  } else {
    audioToggle()
  }
}

// ── MP3 Playback Logic ──
function audioToggle() {
  if (!audioElement.value) return
  if (audioPlaying.value) {
    audioElement.value.pause()
    audioPlaying.value = false
  } else {
    audioElement.value.play()
    audioPlaying.value = true
  }
}

function onAudioTimeUpdate() {
  if (audioElement.value) {
    audioCurrentTime.value = audioElement.value.currentTime
    progressPercent.value = audioElement.value.duration 
      ? audioElement.value.currentTime / audioElement.value.duration 
      : 0
  }
}

function onAudioLoadedMetadata() {
  if (audioElement.value) {
    audioDuration.value = audioElement.value.duration
  }
}

function onAudioEnded() {
  audioPlaying.value = false
  progressPercent.value = 1.0
}

// ── TTS (SpeechSynthesis) Logic ──
function ttsSpeak(startCharIndex = 0) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return
  window.speechSynthesis.cancel()

  const text = props.ttsScript
  if (!text) return

  const subsetText = text.substring(startCharIndex)
  utter = new SpeechSynthesisUtterance(subsetText)
  utter.rate = speed.value * 0.92
  utter.pitch = 1.0
  utter.lang = 'en-GB'

  utter.onstart = () => {
    ttsPlaying.value = true
  }
  utter.onend = () => {
    ttsPlaying.value = false
    if (progressPercent.value < 0.95) {
      progressPercent.value = 1.0
    }
  }
  utter.onerror = () => {
    ttsPlaying.value = false
  }
  utter.onboundary = (e) => {
    if (e.name === 'word') {
      const globalIndex = startCharIndex + e.charIndex
      spokenCharIndex.value = globalIndex
      progressPercent.value = globalIndex / text.length
    }
  }

  window.speechSynthesis.speak(utter)
}

function ttsToggle() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return

  if (ttsPlaying.value) {
    window.speechSynthesis.pause()
    ttsPlaying.value = false
  } else {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      ttsPlaying.value = true
    } else {
      // Speak from last spoken index or start over if at end
      const startPos = progressPercent.value >= 0.98 ? 0 : spokenCharIndex.value
      ttsSpeak(startPos)
    }
  }
}

// ── Seeking Logic ──
function handleWaveformClick(e: MouseEvent) {
  const container = e.currentTarget as HTMLElement
  const rect = container.getBoundingClientRect()
  const clickX = e.clientX - rect.left
  const percent = Math.max(0, Math.min(1, clickX / rect.width))
  seekToPercent(percent)
}

function seekToPercent(percent: number) {
  progressPercent.value = percent

  if (props.hasTts) {
    const text = props.ttsScript || ''
    const charIndex = Math.floor(percent * text.length)
    
    // Align with nearest word boundary to keep speech natural
    const remainingText = text.substring(charIndex)
    const nextSpace = remainingText.search(/\s/)
    const startFrom = charIndex + (nextSpace !== -1 ? nextSpace : 0)

    spokenCharIndex.value = startFrom
    
    if (isPlaying.value) {
      // If currently playing, restart immediately at the new seek point
      ttsSpeak(startFrom)
    } else {
      // Just update progress values without starting playback
      progressPercent.value = startFrom / text.length
    }
  } else {
    if (audioElement.value && audioDuration.value) {
      audioElement.value.currentTime = percent * audioDuration.value
      audioCurrentTime.value = audioElement.value.currentTime
    }
  }
}

// ── Speed Control Logic ──
function toggleSpeed() {
  if (speed.value === 1) speed.value = 1.5
  else if (speed.value === 1.5) speed.value = 2
  else speed.value = 1

  // Apply speed change to active audio playbacks
  if (props.hasTts && isPlaying.value) {
    // Restart speaking at current position to apply new rate
    ttsSpeak(spokenCharIndex.value)
  } else if (audioElement.value) {
    audioElement.value.playbackRate = speed.value
  }
}

// Watchers and Cleanups
watch(() => props.audioPath, () => {
  progressPercent.value = 0
  audioCurrentTime.value = 0
  spokenCharIndex.value = 0
})

onBeforeUnmount(() => {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
})
</script>

<style scoped>
.whatsapp-player {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #efeae2; /* Classic WhatsApp gray-green chat background */
  border-radius: 24px;
  padding: 6px 14px;
  width: 290px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.12);
  user-select: none;
  border: 1px solid rgba(0,0,0,0.04);
}

.play-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: transparent;
  color: #00a884; /* WhatsApp green */
  cursor: pointer;
  padding: 0;
  transition: transform 0.1s ease, background-color 0.2s;
  flex-shrink: 0;
}
.play-btn:hover {
  background-color: rgba(0, 0, 0, 0.04);
}
.play-btn:active {
  transform: scale(0.9);
}

.avatar-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  flex-shrink: 0;
  transition: background-color 0.3s;
}

.player-main {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 3px;
  overflow: hidden;
}

.waveform-container {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 24px;
  cursor: pointer;
}

.waveform-bar {
  width: 3px;
  border-radius: 1.5px;
  background: #b6c5cc; /* Gray unplayed wave */
  transition: background 0.15s ease, height 0.15s ease;
  height: 10px; /* fallback */
  flex-shrink: 0;
}

.waveform-bar.played {
  background: #53bdeb; /* WhatsApp played blue */
}

.meta-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #667781; /* WhatsApp dark-grey metadata text */
  font-family: ui-sans-serif, system-ui, sans-serif;
  line-height: 1;
}

.speed-badge {
  background: #fff;
  border: 1px solid #d1d7db;
  border-radius: 12px;
  padding: 3px 8px;
  font-size: 11px;
  font-weight: 700;
  color: #54656f;
  cursor: pointer;
  text-align: center;
  min-width: 38px;
  transition: background 0.1s ease, border-color 0.1s;
  flex-shrink: 0;
}
.speed-badge:hover {
  background: #f8fafc;
  border-color: #b6c5cc;
}
</style>
