<template>
  <div class="container" v-if="attempt">
    <header class="section-head" style="text-align:left; max-width:none;">
      <span class="eyebrow"><Icon name="award" :size="14" /> Attempt results</span>
      <h1 style="margin:14px 0 4px;">Your results</h1>
      <p class="text-muted">Automatic scoring for Reading &amp; Listening. Writing and Speaking responses are stored for human review.</p>
    </header>

    <div class="grid-cards" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));">
      <div class="stat">
        <span class="label">Raw score</span>
        <span class="value">{{ attempt.score }} <span class="text-subtle" style="font-size:18px;">/ {{ attempt.total }}</span></span>
      </div>
      <div class="stat" v-if="attempt.band !== null">
        <span class="label">Estimated band</span>
        <span class="value" style="color:var(--accent-600);">{{ attempt.band }}</span>
        <span class="trend">IELTS 40-Q conversion</span>
      </div>
      <div class="stat" v-else>
        <span class="label">Scoring</span>
        <span class="value" style="font-size:17px; line-height:1.3;">Manual review</span>
        <span class="trend">Writing &amp; Speaking require human or AI evaluation</span>
      </div>
    </div>

    <h2 style="margin-top:32px;">Question review</h2>
    <table class="admin-table">
      <thead>
        <tr><th>#</th><th>Type</th><th>Your response</th><th>Correct answer</th><th>Result</th></tr>
      </thead>
      <tbody>
        <tr v-for="fb in attempt.feedback" :key="fb.question_id">
          <td>{{ fb.number }}</td>
          <td><span style="font-size:13px; font-weight:500; color:var(--text-muted);">{{ formatType(fb.type) }}</span></td>
          <td><pre style="margin:0; white-space:pre-wrap; font-family:inherit; font-weight:600;">{{ fmt(fb.response) }}</pre></td>
          <td><pre style="margin:0; white-space:pre-wrap; font-family:inherit; font-weight:600; color:var(--primary-600);">{{ fmt(fb.expected) }}</pre></td>
          <td>
            <span v-if="fb.correct === true" class="badge" style="background:#D1FAE5; color:#065F46;">
              <Icon name="check" :size="12" /> Correct
            </span>
            <span v-else-if="fb.correct === false" class="badge" style="background:#FEE2E2; color:#991B1B;">
              <Icon name="x" :size="12" /> Wrong
            </span>
            <span v-else class="badge" style="background:#FEF3C7; color:#92400E;">
              <Icon name="edit" :size="12" /> Manual
            </span>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="row mt-4">
      <NuxtLink to="/tests" class="btn">
        <Icon name="arrow-right" :size="14" style="transform: rotate(180deg);" /> Back to tests
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const { data: attempt } = await useFetch<any>(`/api/attempts/${route.params.id}`)

function formatType(t: string): string {
  if (!t) return ''
  const map: Record<string, string> = {
    reading_matching_headings: 'Matching Headings',
    reading_tfng: 'True / False / Not Given',
    reading_ynng: 'Yes / No / Not Given',
    reading_mcq_single: 'Multiple Choice (Single)',
    reading_mcq_multi: 'Multiple Choice (Multiple)',
    reading_summary_completion: 'Summary Completion',
    reading_sentence_completion: 'Sentence Completion',
    reading_short_answer: 'Short Answer',
    reading_matching_information: 'Matching Information',
    reading_matching_features: 'Matching Features',
    reading_diagram_labelling: 'Diagram Labelling',
    reading_note_completion: 'Note Completion',
    reading_table_completion: 'Table Completion',
    reading_flowchart_completion: 'Flowchart Completion',
    listening_form_completion: 'Form Completion',
    listening_note_completion: 'Note Completion',
    listening_table_completion: 'Table Completion',
    listening_flowchart_completion: 'Flowchart Completion',
    listening_summary_completion: 'Summary Completion',
    listening_sentence_completion: 'Sentence Completion',
    listening_mcq_single: 'Multiple Choice (Single)',
    listening_mcq_multi: 'Multiple Choice (Multiple)',
    listening_matching: 'Matching',
    listening_map_labelling: 'Map Labelling',
    listening_short_answer: 'Short Answer',
    writing_task_1: 'Writing Task 1',
    writing_task_2: 'Writing Task 2',
    speaking_part_1: 'Speaking Part 1',
    speaking_part_2: 'Speaking Part 2',
    speaking_part_3: 'Speaking Part 3'
  }
  return map[t] || t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function fmt(v: any) {
  if (v == null) return '—'
  if (Array.isArray(v)) return v.join(' / ')
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
</script>
