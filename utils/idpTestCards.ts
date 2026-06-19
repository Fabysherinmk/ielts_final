const LISTENING_LABELS = [
  'Familiarisation test',
  'Short-answer questions',
  'Sentence completion',
  'Plan/map/diagram labelling',
]

const READING_LABELS = [
  'Familiarisation test',
  'Summary Completion',
  'Table completion',
  'Matching Headings',
]

const WRITING_LABELS = [
  'Task 1: Chart & Task 2: Essay',
  'Task 1: Graph & Task 2: Opinion',
  'Task 1: Bar Chart & Task 2: Discussion',
  'Task 1: Pie Chart & Task 2: Advantages',
]

const SPEAKING_LABELS = [
  'Part 1: Hometown & Part 2: Skill',
  'Part 1: Hobbies & Part 2: Activity',
  'Part 1: Food & Part 2: Meal',
  'Part 1: Travel & Part 2: Place',
]

export function idpCardTitle(test: { title?: string }, skill: 'reading' | 'listening' | 'writing' | 'speaking', index: number) {
  let labels: string[]
  let prefix: string
  
  switch (skill) {
    case 'listening':
      labels = LISTENING_LABELS
      prefix = 'IELTS Listening'
      break
    case 'reading':
      labels = READING_LABELS
      prefix = 'IELTS Academic Reading'
      break
    case 'writing':
      labels = WRITING_LABELS
      prefix = 'IELTS Academic Writing'
      break
    case 'speaking':
      labels = SPEAKING_LABELS
      prefix = 'IELTS Speaking'
      break
  }
  
  const label = labels[index] ?? labels[labels.length - 1]
  return `${prefix} : ${label}`
}

export function idpCardFormat(skill: 'reading' | 'listening' | 'writing' | 'speaking', index: number) {
  if (skill === 'reading' && index === 0) return 'Computer'
  return 'Paper'
}

export function idpTestAccessLink(test: { id: number }, skill: 'reading' | 'listening' | 'writing' | 'speaking') {
  switch (skill) {
    case 'listening':
      return `/tests/listening/${test.id}?mode=test`
    case 'reading':
      return `/tests/reading/${test.id}`
    case 'writing':
      return `/tests/writing/${test.id}`
    case 'speaking':
      return `/tests/speaking/${test.id}`
  }
}

export function idpTestAnswersLink(test: { id: number }, skill: 'reading' | 'listening' | 'writing' | 'speaking') {
  switch (skill) {
    case 'listening':
      return `/tests/listening/${test.id}/answers`
    case 'reading':
      return `/tests/reading/${test.id}/answers`
    case 'writing':
      return `/tests/writing/${test.id}/answers`
    case 'speaking':
      return `/tests/speaking/${test.id}/answers`
  }
}
