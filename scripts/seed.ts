/**
 * Seed script — populates the database with one complete IELTS Academic mock test
 * for each skill (Reading, Listening, Writing, Speaking). Content is ORIGINAL,
 * Cambridge-style, modelled after the structure and question type distribution
 * of "Cambridge IELTS 20 Academic Test 4".
 *
 * Run with:  npm run seed
 */

import Database from 'better-sqlite3'
import { readFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import bcrypt from 'bcryptjs'
import { cambridge17ListeningTest1 } from './data/cambridge17ListeningTest1.ts'
import { cambridgeStyleReadingTest2 } from './data/cambridgeStyleReadingTest2.ts'
import { listeningTest2 } from './data/listeningTest2.ts'
import { listeningTest3 } from './data/listeningTest3.ts'

const dbPath = resolve(process.cwd(), process.env.DB_PATH || './data/ielts.sqlite')
if (!existsSync(dirname(dbPath))) mkdirSync(dirname(dbPath), { recursive: true })
const db = new Database(dbPath)
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')
db.exec(readFileSync(resolve(process.cwd(), 'server/db/schema.sql'), 'utf8'))

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const insTest = db.prepare('INSERT INTO tests (title, skill, description, duration_min, published) VALUES (?,?,?,?,?)')
const insSection = db.prepare(
  `INSERT INTO sections (test_id, order_index, title, instructions, body, audio_path, image_path, extra_json)
   VALUES (?,?,?,?,?,?,?,?)`
)
const insQuestion = db.prepare(
  `INSERT INTO questions (section_id, order_index, number, type, prompt, data_json, answer_json, points)
   VALUES (?,?,?,?,?,?,?,?)`
)

function createTest(title: string, skill: string, desc: string, mins: number, published = true) {
  return insTest.run(title, skill, desc, mins, published ? 1 : 0).lastInsertRowid as number
}
function createSection(testId: number, order: number, title: string, instructions: string, body: string, audio?: string, image?: string, extra?: any) {
  return insSection.run(testId, order, title, instructions, body, audio ?? null, image ?? null, extra ? JSON.stringify(extra) : null).lastInsertRowid as number
}
function createQ(sectionId: number, order: number, num: number | null, type: string, prompt: string, data: any, answer: any, points = 1) {
  return insQuestion.run(sectionId, order, num, type, prompt, data ? JSON.stringify(data) : null, answer !== undefined ? JSON.stringify(answer) : null, points)
}

function seedListeningSet(source: typeof cambridge17ListeningTest1) {
  const testId = createTest(source.title, source.skill, source.description, source.duration_min)
  source.sections.forEach((section, sectionIndex) => {
    const sectionId = createSection(
      testId,
      sectionIndex,
      section.title,
      section.instructions,
      section.body,
      section.audio_path,
      undefined,
      {
        ...(section.extra ?? {}),
        source_pdf: source.extra.source_pdf,
        source_question_page: source.extra.source_question_page,
        modes: source.extra.modes,
        test_mode_audio: source.extra.test_mode_audio,
        practice_mode_audio: source.extra.practice_mode_audio
      }
    )
    section.questions.forEach((question, questionIndex) => {
      createQ(
        sectionId,
        questionIndex,
        question.number,
        question.type,
        question.prompt,
        question.data ?? null,
        question.answer,
        question.points ?? 1
      )
    })
  })
}

function seedStructuredTest(source: any) {
  const testId = createTest(source.title, source.skill, source.description, source.duration_min, source.published ?? true)
  source.sections.forEach((section: any, sectionIndex: number) => {
    const sectionId = createSection(
      testId,
      sectionIndex,
      section.title,
      section.instructions,
      section.body,
      section.audio_path,
      section.image_path,
      section.extra
    )
    section.questions.forEach((question: any, questionIndex: number) => {
      createQ(
        sectionId,
        questionIndex,
        question.number,
        question.type,
        question.prompt,
        question.data ?? null,
        question.answer,
        question.points ?? 1
      )
    })
  })
}

// Clear existing seeded tests.
db.prepare(`DELETE FROM tests WHERE title LIKE 'Cambridge-style%' OR title = ?`).run(cambridge17ListeningTest1.title)

// Licensed Cambridge IELTS 17 content supplied by the trainer/user.
seedListeningSet(cambridge17ListeningTest1)

// Seed additional Cambridge-style listening mock tests (Tests 2 & 3) using TTS audio
function seedTtsListeningTest(source: typeof listeningTest2) {
  const testId = createTest(source.title, source.skill, source.description, source.duration_min, true)
  source.sections.forEach((section: any, sectionIndex: number) => {
    const sectionId = createSection(
      testId,
      sectionIndex,
      section.title,
      section.instructions,
      section.body,
      section.audio_path,
      undefined,
      {
        ...(section.extra ?? {}),
        tts_script: section.tts_script ?? null,
        modes: source.extra.modes,
        test_mode_audio: source.extra.test_mode_audio,
        practice_mode_audio: source.extra.practice_mode_audio
      }
    )
    section.questions.forEach((question: any, questionIndex: number) => {
      createQ(
        sectionId,
        questionIndex,
        question.number,
        question.type,
        question.prompt,
        question.data ?? null,
        question.answer,
        question.points ?? 1
      )
    })
  })
}

seedTtsListeningTest(listeningTest2)
seedTtsListeningTest(listeningTest3)

// ---------------------------------------------------------------------------
// 1) READING TEST (3 passages, 40 questions)
// ---------------------------------------------------------------------------
const readingId = createTest(
  'Cambridge-style IELTS Academic Reading — Mock Test 1',
  'reading',
  'Three academic passages modelled on Cambridge IELTS 20 Test 4. 40 questions. 60 minutes.',
  60
)

// ---------- PASSAGE 1: "The rise of the urban vegetable garden" ------------
const p1Body = `
<p><span class="para-label">A</span>Urban vegetable gardens, once a rarity in industrialised cities, have become a defining feature of twenty-first-century metropolitan life. From rooftops in Singapore to reclaimed railway sidings in Berlin, residents are increasingly turning unused spaces into productive plots. Historians trace the modern movement back to the "victory gardens" of the World Wars, when citizens were encouraged to grow food on any available patch of land. However, today's revival is driven by a different set of concerns: food miles, climate resilience, and a renewed appreciation for the social value of shared green spaces.</p>
<p><span class="para-label">B</span>A 2018 survey of twelve European capitals found that the number of registered community gardens had more than tripled between 2005 and 2017. Municipal planners in cities such as Paris and Copenhagen now routinely incorporate edible landscaping into new developments. The trend is driven in part by younger residents, many of whom lack access to private outdoor space, but it also reflects broader demographic shifts: an ageing population looking for low-impact outdoor activity and a growing immigrant population bringing diverse horticultural traditions.</p>
<p><span class="para-label">C</span>The environmental case is compelling. A single community plot of 100 square metres can, according to researchers at Delft University, absorb approximately 350 kilograms of carbon dioxide per year through photosynthesis, and substantially more when mature fruit trees are included. Soil sealed under concrete is "reactivated" when it is returned to cultivation, improving drainage and reducing the urban heat-island effect. A report from the Rockefeller Foundation in 2020 estimated that widespread urban agriculture could meet up to 15 per cent of the fresh vegetable demand in mid-sized cities — a modest but meaningful contribution.</p>
<p><span class="para-label">D</span>Economic benefits are harder to quantify. Few urban gardens aim to be commercially viable; most operate as not-for-profit cooperatives. Nonetheless, a study led by Dr Helen Markova at the London School of Economics concluded that the social return on investment (SROI) — a measure that assigns monetary value to wellbeing, community cohesion and skills-training — can be as high as £7 for every £1 invested. Markova cautions, however, that these figures are sensitive to the assumptions made about volunteer labour and should be treated as indicative rather than definitive.</p>
<p><span class="para-label">E</span>Not everyone shares the enthusiasm. Some urban economists argue that the opportunity cost of dedicating scarce central land to vegetables is too high in housing-stressed cities. Others point out that community gardens can gentrify neighbourhoods, pushing out the very low-income residents they are often designed to serve. A much-publicised 2019 dispute in Brooklyn, where a long-running garden was replaced by a mixed-income apartment block, became a touchstone in this debate.</p>
<p><span class="para-label">F</span>Technological innovation has also transformed what is possible. Hydroponic and aeroponic systems now allow vegetables to grow vertically in converted warehouses, producing yields per square metre many times greater than traditional farming. Critics observe that such high-tech installations consume significant electricity and are only sustainable where the power grid is itself decarbonising. Simpler innovations — water-efficient drip irrigation, mobile phone apps that coordinate watering rotas, shared tool libraries — may have a larger cumulative impact because they are affordable and widely adopted.</p>
<p><span class="para-label">G</span>What is perhaps most striking is the diversity of motivations reported by urban gardeners themselves. In a 2022 survey of 1,400 plot-holders across eight cities, researchers from Utrecht University found that "growing my own food" ranked only fourth, behind "spending time outdoors", "meeting neighbours" and "teaching my children where food comes from". The future of the movement, the authors argue, lies not in competing with rural agriculture but in reshaping the fabric of city life itself.</p>
`
const p1 = createSection(readingId, 0,
  'Reading Passage 1: The rise of the urban vegetable garden',
  'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
  p1Body)

// Q 1-7: Note completion
const p1Notes = [
  { prompt: 'The number of registered community gardens had more than ____ between 2005 and 2017.', ans: 'tripled' },
  { prompt: 'Municipal planners now include edible landscaping in new ____.', ans: 'developments' },
  { prompt: 'Many younger residents lack access to private ____ space.', ans: 'outdoor' },
  { prompt: 'Mature ____ can increase the carbon absorbed by community plots.', ans: ['fruit trees', 'trees'] },
  { prompt: 'Returning sealed soil to cultivation improves ____.', ans: 'drainage' },
  { prompt: 'Urban agriculture could meet 15 per cent of fresh ____ demand in mid-sized cities.', ans: 'vegetable' },
  { prompt: 'Affordable innovations include shared tool ____.', ans: 'libraries' }
]
p1Notes.forEach((q, i) =>
  createQ(p1, i, i + 1, 'reading_note_completion', q.prompt, { word_limit: 2 }, { answer: q.ans }))

// Q 8-13: True/False/Not Given
const tfng = [
  { prompt: 'Urban vegetable gardens were once unusual in industrialised cities.', ans: 'TRUE' },
  { prompt: 'Victory gardens were mainly funded by private food companies.', ans: 'NOT GIVEN' },
  { prompt: 'The number of registered community gardens doubled between 2005 and 2017.', ans: 'FALSE' },
  { prompt: 'Most urban gardens operate as commercial businesses.', ans: 'FALSE' },
  { prompt: 'High-tech urban farming installations may consume significant electricity.', ans: 'TRUE' },
  { prompt: 'In the Utrecht survey, growing food was the top motivation for plot-holders.', ans: 'FALSE' }
]
tfng.forEach((t, i) => createQ(p1, 7+i, 8+i, 'reading_tfng', t.prompt, null, { answer: t.ans }))

// Q 11-13: Summary completion (NO MORE THAN TWO WORDS)
const summary = [
  { prompt: 'According to Delft University, a 100 sq m plot absorbs about ____ of CO₂ per year.', ans: ['350 kilograms','350 kg'] },
  { prompt: 'Simpler innovations may be more impactful because they are ____ and widely adopted.', ans: 'affordable' },
  { prompt: 'In the Utrecht survey, "growing my own food" only ranked ____.', ans: 'fourth' }
]
summary.slice(0, 0).forEach((s, i) =>
  createQ(p1, 10+i, 11+i, 'reading_summary_completion', s.prompt, { word_limit: 2 }, { answer: s.ans }))

// ---------- PASSAGE 2: "The surprising intelligence of octopuses" ----------
const p2Body = `
<h3>The surprising intelligence of octopuses</h3>
<p><span class="para-label">A</span>For centuries the octopus has been regarded by sailors and scientists alike as a creature of brute instinct. Modern research, however, has comprehensively overturned this view. Octopuses routinely solve problems that would tax the capacities of many vertebrates: they open jars to retrieve food, navigate complex mazes, and — as demonstrated by a celebrated series of experiments at the Seattle Aquarium in the early 2010s — remember individual human keepers, behaving warmly towards those who feed them and squirting water at those who have annoyed them.</p>
<p><span class="para-label">B</span>Such cognitive performance is all the more remarkable given how differently the octopus brain is organised. Of the roughly 500 million neurons in a common octopus, only around one-third are located in the central brain. The remainder are distributed through the eight arms, each of which can independently taste, touch and to some extent decide. Neuroscientist Dr Binyamin Hochner, whose laboratory in Jerusalem has pioneered work in this area, describes the octopus as "a distributed cognition machine" whose arms possess a form of autonomy that has no direct parallel in mammals.</p>
<p><span class="para-label">C</span>The evolutionary history underlying this anatomy is extraordinary. Cephalopods and vertebrates diverged more than 500 million years ago, and their complex nervous systems evolved entirely independently. Yet both lineages converged on many of the same "advanced" behaviours: tool use, play, long-term memory, and personality differences between individuals. For biologists, the octopus therefore represents a natural experiment in what intelligence can look like when it evolves along an alternative path.</p>
<p><span class="para-label">D</span>One long-standing puzzle is why octopuses should be smart at all. Social learning is widely thought to drive the evolution of intelligence, and yet octopuses are largely solitary, living only one to three years and usually dying shortly after their first reproduction. Dr Jennifer Mather of the University of Lethbridge has argued that the relevant pressures in octopuses may be ecological rather than social: a life in complex reef environments full of shifting predators and prey would place a premium on flexibility and rapid learning.</p>
<p><span class="para-label">E</span>Evidence for tool use is particularly striking. Off the coast of Indonesia, the veined octopus (Amphioctopus marginatus) has been filmed gathering the two halves of discarded coconut shells, carrying them beneath its body across the seafloor, and later reassembling them to form a mobile shelter. Sceptics initially dismissed this as opportunism, but subsequent analyses have shown that the animals actively choose suitable shells and transport them significant distances — classic criteria for tool use as opposed to mere object manipulation.</p>
<p><span class="para-label">F</span>Captive studies have also revealed apparently playful behaviour. When given floating pill bottles in aquarium tanks, several octopuses have been observed blowing jets of water to push the bottles across the surface and waiting for the current to bring them back — a pattern repeated consistently and without any obvious reward. Mather and colleague Roland Anderson have taken this as evidence that octopuses, like parrots and dolphins, engage in "object play" that meets formal definitions of the term.</p>
<p><span class="para-label">G</span>These findings raise pressing ethical questions. In 2021 the United Kingdom formally recognised cephalopods as sentient beings under its Animal Welfare Act, a change prompted in part by a comprehensive review led by the London School of Economics. Proposed commercial octopus farms, particularly a large facility planned for the Canary Islands, have become a flashpoint for debate. Animal welfare groups argue that intensive confinement is incompatible with what is now known about octopus cognition; industry representatives counter that aquaculture could reduce pressure on wild stocks. The argument is unlikely to be settled soon.</p>
`
const p2 = createSection(readingId, 1,
  'Reading Passage 2: The surprising intelligence of octopuses',
  'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
  p2Body)

// Q 14-17: Matching information (which paragraph contains the following info?)
const matchingInfo = [
  { prompt: 'a description of how octopus neurons are distributed across the body', ans: 'B' },
  { prompt: 'a reference to a commercial development that has provoked controversy', ans: 'G' },
  { prompt: 'an alternative hypothesis for why octopus intelligence evolved', ans: 'D' },
  { prompt: 'an example of an octopus apparently engaging in play', ans: 'F' }
]
const paraOptions = ['A','B','C','D','E','F','G'].map(l => ({ id: l, text: `Paragraph ${l}` }))
matchingInfo.forEach((m, i) =>
  createQ(p2, i, 14+i, 'reading_matching_information', m.prompt, { options: paraOptions }, { answer: m.ans }))

// Q 19-22: Matching features (researchers ↔ findings)
const p2Sent = [
  { prompt: 'Cephalopods and vertebrates diverged over ____ million years ago.', ans: '500' },
  { prompt: 'Only around ____ of an octopus\'s neurons are in the central brain.', ans: ['one-third', 'one third'] },
  { prompt: 'The veined octopus uses discarded ____ shells as a portable shelter.', ans: 'coconut' },
  { prompt: 'The UK changed its ____ Welfare Act to include cephalopods as sentient.', ans: 'Animal' },
  { prompt: 'Octopuses typically die shortly after their first ____.', ans: 'reproduction' }
]
p2Sent.forEach((s, i) =>
  createQ(p2, 4+i, 18+i, 'reading_sentence_completion', s.prompt, { word_limit: 1 }, { answer: s.ans }))

const researchers = [
  { id: 'A', text: 'Binyamin Hochner' },
  { id: 'B', text: 'Jennifer Mather' },
  { id: 'C', text: 'Roland Anderson' },
  { id: 'D', text: 'Sailors and early observers' }
]
const features = [
  { prompt: 'viewed the octopus as driven purely by instinct', ans: 'D' },
  { prompt: 'characterised the octopus as a "distributed cognition machine"', ans: 'A' },
  { prompt: 'argued that octopus intelligence is ecological rather than social', ans: 'B' },
  { prompt: 'documented evidence of octopuses engaging in object play', ans: 'C' }
]
features.forEach((f, i) =>
  createQ(p2, 9+i, 23+i, 'reading_matching_features', f.prompt, { options: researchers }, { answer: f.ans }))

// Q 23-26: Sentence completion (one word)
const sent = [
  { prompt: 'Cephalopods and vertebrates diverged over ____ million years ago.', ans: '500' },
  { prompt: 'The veined octopus uses discarded ____ shells as a portable shelter.', ans: 'coconut' },
  { prompt: 'The UK changed its ____ Welfare Act to include cephalopods as sentient.', ans: 'Animal' },
  { prompt: 'Octopuses typically die shortly after their first ____.', ans: 'reproduction' }
]
sent.slice(0, 0).forEach((s, i) =>
  createQ(p2, 9+i, 23+i, 'reading_sentence_completion', s.prompt, { word_limit: 1 }, { answer: s.ans }))

// ---------- PASSAGE 3: "Why we remember what we forget" -------------------
const p3Body = `
<h3>Why we remember what we forget</h3>
<p><span class="para-label">A</span>Memory research has long been preoccupied with what people remember and how accurately. Over the last two decades, however, a growing body of work has turned its attention to the opposite question: what, and why, do we forget? The emerging consensus is surprising. Forgetting is not, as nineteenth-century psychologists often assumed, a simple decay or failure of the memory system. It is, increasingly, understood as an active, adaptive process whose proper functioning may be as important to cognition as remembering itself.</p>
<p><span class="para-label">B</span>Classical theories dating back to Ebbinghaus in 1885 modelled memory loss as a smooth "forgetting curve", with information fading predictably over time. Such models still dominate textbooks, but they fit laboratory data better than they do real life. Modern experiments using neuroimaging and carefully designed behavioural tasks have shown that forgetting is highly selective. Unhelpful, outdated or irrelevant information is preferentially discarded, while material that supports current goals is reinforced. Far from being a bug in the system, forgetting looks increasingly like a feature.</p>
<p><span class="para-label">C</span>One of the clearest demonstrations came from a 2017 study at the University of Toronto, in which participants learned two overlapping sets of vocabulary. When later asked to recall one set, they actively suppressed the other — an effect visible in fMRI scans as reduced activity in memory-associated regions. The lead researcher, Dr Priya Rajavelu, argues that the brain is constantly performing a form of cognitive housekeeping, pruning information that would otherwise interfere with ongoing tasks.</p>
<p><span class="para-label">D</span>The adaptive view has important clinical implications. People with Post-Traumatic Stress Disorder (PTSD) often suffer not because they cannot remember, but because they cannot forget: intrusive, vivid memories are repeatedly reactivated. New therapies based on "memory reconsolidation" aim to weaken such memories by reactivating them in controlled settings and then interrupting the biochemical processes that would normally re-store them. Early trials have been promising, though the long-term efficacy remains contested.</p>
<p><span class="para-label">E</span>There is also a striking connection to sleep. While awake, the brain is biased towards encoding; while asleep — especially during slow-wave sleep — it selectively prunes less useful connections. Experiments in mice, and increasingly in humans, show that synapses formed during the day shrink overnight in precisely the locations that are no longer relevant to learned behaviours. Researchers at the University of Wisconsin have described this as "synaptic homeostasis": sleep resets the brain so that it can absorb new material the following day without becoming saturated.</p>
<p><span class="para-label">F</span>Not all forgetting is benign, of course. The boundary between healthy pruning and pathological loss, as seen in dementia, is still poorly understood. What is clear is that the biological machinery is similar; the difference lies in its regulation. Drugs that enhance memory by preventing forgetting — so-called "nootropics" — have become popular in some student communities, but neuroscientists warn that tampering with the brain's forgetting machinery may have unintended consequences, such as impaired decision-making or heightened anxiety.</p>
<p><span class="para-label">G</span>Philosophers and ethicists have entered the debate too. If forgetting is an integral part of identity, should we pursue technologies that minimise it? In his 2020 book <em>The Art of Forgetting</em>, Professor Marcus Arneson argues that a life in which everything is remembered would be not richer but poorer, because the narrative coherence of a self depends on the selective retention of meaningful experience. He contends, provocatively, that the ability to forget is one of the foundations of being able to forgive.</p>
<p><span class="para-label">H</span>Whether or not one accepts Arneson's stronger claims, the science is clear: forgetting is not the enemy of memory. It is its necessary companion. As researchers continue to map the mechanisms of selective forgetting, what was once seen as a deficiency of the ageing brain is being reinterpreted as one of its most sophisticated achievements.</p>
`
const p3 = createSection(readingId, 2,
  'Reading Passage 3: Why we remember what we forget',
  'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
  p3Body)

const p3ParaOptions = ['A','B','C','D','E','F','G','H'].map(l => ({ id: l, text: `Paragraph ${l}` }))
const p3MatchingInfo = [
  { prompt: 'a contrast between older models and real-life forgetting', ans: 'B' },
  { prompt: 'evidence from brain scans of suppressed memories', ans: 'C' },
  { prompt: 'a therapeutic approach connected with traumatic memories', ans: 'D' },
  { prompt: 'a description of how sleep prunes less useful connections', ans: 'E' },
  { prompt: 'a warning about drugs designed to prevent forgetting', ans: 'F' }
]
p3MatchingInfo.forEach((m, i) =>
  createQ(p3, i, 27+i, 'reading_matching_information', m.prompt, { options: p3ParaOptions }, { answer: m.ans }))

const p3People = [
  { id: 'A', text: 'Dr Priya Rajavelu' },
  { id: 'B', text: 'University of Wisconsin researchers' },
  { id: 'C', text: 'Marcus Arneson' },
  { id: 'D', text: 'Nineteenth-century psychologists' },
  { id: 'E', text: 'Neuroscientists' }
]
const p3FeatureQuestions = [
  { prompt: 'treated forgetting mainly as decay or failure', ans: 'D' },
  { prompt: 'described the brain as doing cognitive housekeeping', ans: 'A' },
  { prompt: 'used the term synaptic homeostasis for overnight resetting', ans: 'B' },
  { prompt: 'argued that remembering everything would make life poorer', ans: 'C' },
  { prompt: 'warn that interfering with forgetting may damage decision-making', ans: 'E' }
]
p3FeatureQuestions.forEach((f, i) =>
  createQ(p3, 5+i, 32+i, 'reading_matching_features', f.prompt, { options: p3People }, { answer: f.ans }))

const p3SummaryBank = ['active', 'passive', 'selective', 'decay', 'coherence', 'regulation']
const p3Summary = [
  { prompt: 'Recent research treats forgetting as an ____ process.', ans: 'active' },
  { prompt: 'Modern studies show that forgetting can be highly ____.', ans: 'selective' },
  { prompt: 'Arneson links forgetting to the narrative ____ of the self.', ans: 'coherence' },
  { prompt: 'The difference between healthy pruning and pathological loss lies mainly in its ____.', ans: 'regulation' }
]
p3Summary.forEach((s, i) =>
  createQ(p3, 10+i, 37+i, 'reading_summary_completion', s.prompt, { word_limit: 1, word_bank: p3SummaryBank }, { answer: s.ans }))

// Q 27-30: Multiple choice (single)
const mcq = [
  { prompt: 'Which view of forgetting does the passage argue against?', opts:['Forgetting is an adaptive, selective process.','Forgetting happens uniformly over time.','Forgetting is essential for learning.','Forgetting is strongly affected by sleep.'], ans:'B' },
  { prompt: 'Dr Rajavelu\'s 2017 study showed that:', opts:['participants learned faster when given overlapping vocabularies.','sleep was required to consolidate new memories.','the brain actively suppresses interfering information.','fMRI scans cannot detect forgetting.'], ans:'C' },
  { prompt: 'Memory reconsolidation therapies aim to:', opts:['permanently erase traumatic memories.','restore memories people with PTSD have lost.','weaken vivid intrusive memories.','improve memory for positive events.'], ans:'C' },
  { prompt: 'According to the Wisconsin researchers, synaptic homeostasis:', opts:['causes new synapses to form during the day.','selectively shrinks irrelevant synapses during sleep.','strengthens every memory overnight.','is only observed in mice, not humans.'], ans:'B' }
]
mcq.slice(0, 0).forEach((m, i) =>
  createQ(p3, i, 27+i, 'reading_mcq_single', m.prompt, { options: m.opts }, { answer: m.ans }))

// Q 31-33: Yes/No/Not Given (views of the writer / Arneson)
const ynng = [
  { prompt: 'Arneson claims that remembering everything would produce a richer life.', ans: 'NO' },
  { prompt: 'The science of forgetting is now more established than it was twenty years ago.', ans: 'YES' },
  { prompt: 'Arneson\'s book has sold more copies than similar books on memory.', ans: 'NOT GIVEN' }
]
ynng.slice(0, 0).forEach((y, i) =>
  createQ(p3, 4+i, 31+i, 'reading_ynng', y.prompt, null, { answer: y.ans }))

// Q 34-36: MCQ multi
false && createQ(p3, 7, 34, 'reading_mcq_multi',
  'Which TWO of the following does the passage suggest about nootropic drugs?',
  { options: [
    'They are uniformly safe if used by healthy adults.',
    'They could impair decision-making.',
    'They are widely used by all student communities.',
    'They may increase anxiety as a side effect.',
    'They have been shown to cure dementia.'
  ], choose: 2 },
  { answer: ['B','D'] })

// Q 35-40: Summary completion w/ word bank
const bank = ['active','passive','selective','decay','encoding','consolidation','coherence','arbitrary']
const sc = [
  { prompt: 'Nineteenth-century psychologists often viewed forgetting as a ____ process.', ans: 'passive' },
  { prompt: 'Modern research suggests forgetting is ____ and adaptive.', ans: 'active' },
  { prompt: 'During slow-wave sleep the brain engages in ____ pruning.', ans: 'selective' },
  { prompt: 'Arneson argues forgetting underpins the narrative ____ of the self.', ans: 'coherence' },
  { prompt: 'Drugs that target the brain\'s forgetting machinery may disrupt ____.', ans: 'encoding' },
  { prompt: 'The mechanisms of pathological loss and healthy pruning differ mainly in their ____.', ans: ['regulation'] }
]
sc.slice(0, 0).forEach((s, i) =>
  createQ(p3, 8+i, 35+i, 'reading_summary_completion',
    s.prompt,
    { word_limit: 2, word_bank: bank },
    { answer: s.ans }))

seedStructuredTest(cambridgeStyleReadingTest2)

seedStructuredTest({
  ...cambridgeStyleReadingTest2,
  title: 'Cambridge-style IELTS Academic Reading — Mock Test 3',
  description: 'Three academic passages with Cambridge-style question types including completion, TFNG, matching and summary tasks.'
})

seedStructuredTest({
  ...cambridgeStyleReadingTest2,
  title: 'Cambridge-style IELTS Academic Reading — Mock Test 4',
  description: 'Full-length academic reading mock with mixed question types across three passages.'
})

// ---------------------------------------------------------------------------
// 2) LISTENING TEST (4 parts, 40 questions)
// ---------------------------------------------------------------------------
const listeningId = createTest(
  'Cambridge-style IELTS Academic Listening — Mock Test 1',
  'listening',
  'Four listening parts modelled on Cambridge IELTS 20 Test 4. 40 questions. ~30 minutes of audio + 10 min transfer.',
  40,
  true
)

// --- Part 1: Form completion (accommodation enquiry)
const l1 = createSection(listeningId, 0,
  'Part 1: Accommodation enquiry',
  'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
  `<strong>Transcript will appear on results page.</strong>
<p>A prospective tenant calls a letting agent about a furnished flat.</p>`,
  undefined, undefined,
  { transcript: 'A: Hello, Riverside Lettings. B: Hi, I saw an ad for a flat on Oak Street... [full script stored for admin].' })

const l1q = [
  { prompt: 'Caller\'s name: Samuel ____', ans: ['Ngata','Ngata.'] , num: 1 },
  { prompt: 'Phone number: 0207 ____', ans: '448291', num: 2 },
  { prompt: 'Monthly rent: £____', ans: ['1250','1,250'], num: 3 },
  { prompt: 'Deposit required: ____ weeks', ans: '6', num: 4 },
  { prompt: 'Earliest move-in date: ____ May', ans: '14', num: 5 },
  { prompt: 'Nearest underground station: ____', ans: 'Finsbury', num: 6 },
  { prompt: 'Floor number: ____', ans: '3rd', num: 7 },
  { prompt: 'Included with rent: water and ____', ans: 'internet', num: 8 },
  { prompt: 'Nearest primary school: ____ School', ans: 'Beechwood', num: 9 },
  { prompt: 'Lease length: ____ months minimum', ans: '12', num: 10 }
]
l1q.forEach((q, i) =>
  createQ(l1, i, q.num, 'listening_form_completion', q.prompt, { word_limit: 3 }, { answer: q.ans }))

// --- Part 2: Multiple choice + map labelling (museum tour)
const l2 = createSection(listeningId, 1,
  'Part 2: Riverside Industrial Museum tour',
  'Questions 11-15: Choose the correct letter, A, B or C. Questions 16-20: Label the plan of the museum.',
  `<p>A guide addresses visitors at the start of a tour of an industrial heritage museum.</p>`,
  undefined, undefined,
  { transcript: 'Welcome to Riverside Industrial Museum... [full script stored].' })

// MCQ single 11-15
const l2mcq = [
  { p: 'The museum was originally built as a:', o:['textile mill','grain warehouse','shipbuilding yard'], a:'B', n:11 },
  { p: 'Visitors should NOT miss:', o:['the 1850s steam engine','the audio-visual exhibit','the children\'s play area'], a:'A', n:12 },
  { p: 'The cafe is currently offering free:', o:['coffee refills','cake with every meal','soup with a sandwich'], a:'C', n:13 },
  { p: 'Photography is:', o:['prohibited entirely','allowed without flash','allowed only on the ground floor'], a:'B', n:14 },
  { p: 'At the end of the tour visitors will receive a:', o:['free poster','discount voucher for the shop','printed map'], a:'B', n:15 }
]
l2mcq.forEach((q, i) =>
  createQ(l2, i, q.n, 'listening_mcq_single', q.p, { options: q.o }, { answer: q.a }))

// Map labelling 16-20
const mapLocations = [
  { id:'A', text:'Ticket office' }, { id:'B', text:'Main gallery' }, { id:'C', text:'Engine hall' },
  { id:'D', text:'Cafe' }, { id:'E', text:'Gift shop' }, { id:'F', text:'Temporary exhibition' },
  { id:'G', text:'Outdoor yard' }
]
const mapAns = [
  { p:'Audio guide pick-up point', a:'A', n:16 },
  { p:'Children\'s discovery zone', a:'F', n:17 },
  { p:'Steam engine demonstration', a:'C', n:18 },
  { p:'Vintage tram ride meeting point', a:'G', n:19 },
  { p:'Meet the guide for the Q&amp;A session', a:'D', n:20 }
]
mapAns.forEach((q, i) =>
  createQ(l2, 5+i, q.n, 'listening_matching', q.p, { options: mapLocations }, { answer: q.a }))

// --- Part 3: MCQ multi + matching (student discussion)
const l3 = createSection(listeningId, 2,
  'Part 3: Research methods seminar',
  'Questions 21-22 choose TWO letters. Questions 23-26 match. Questions 27-30 complete sentences.',
  `<p>Two postgraduate students, Sian and Diego, discuss their research methods tutor\'s feedback with a supervisor.</p>`,
  undefined, undefined,
  { transcript: 'Sian: So our tutor said we need to... [full script].' })

// MCQ multi 21-22
createQ(l3, 0, 21, 'listening_mcq_multi',
  'Which TWO difficulties do Sian and Diego mention about their current research design?',
  { options: [
    'The sample size is too small.',
    'The interview questions are too open.',
    'They cannot access the target demographic.',
    'The timeline is unrealistic.',
    'Their ethics approval has expired.'
  ], choose: 2 },
  { answer: ['A','D'] }, 2)
// also a combined Q22 placeholder
createQ(l3, 1, 22, 'listening_mcq_multi',
  '(Same question as 21 — in real IELTS this is two separate boxes for the same pair; we store 2 points on Q21.)',
  { options: ['Placeholder — use Q21 answer.'] , choose: 1 }, { answer: [] }, 0)

// Matching 23-26 (researchers ↔ comments)
const commentOpts = [
  { id:'A', text:'should be reworded' }, { id:'B', text:'is too ambitious' },
  { id:'C', text:'matches the literature well' }, { id:'D', text:'needs more pilot data' },
  { id:'E', text:'is unclear to participants' }, { id:'F', text:'could be shortened' }
]
const commentQs = [
  { p:'Research question 1', a:'A', n:23 }, { p:'Research question 2', a:'E', n:24 },
  { p:'Research question 3', a:'C', n:25 }, { p:'Research question 4', a:'B', n:26 }
]
commentQs.forEach((q, i) =>
  createQ(l3, 2+i, q.n, 'listening_matching', q.p, { options: commentOpts }, { answer: q.a }))

// Sentence completion 27-30
const l3sc = [
  { p:'They plan to reduce the number of interviews to ____.', a:'twelve', n:27 },
  { p:'Diego will redesign the ____ survey by Friday.', a:'pilot', n:28 },
  { p:'Sian agreed to analyse the data using ____ software.', a:'NVivo', n:29 },
  { p:'The supervisor will send the revised ____ form today.', a:'consent', n:30 }
]
l3sc.forEach((q, i) =>
  createQ(l3, 6+i, q.n, 'listening_sentence_completion', q.p, { word_limit: 2 }, { answer: q.a }))

// --- Part 4: Academic lecture — note completion
const l4 = createSection(listeningId, 3,
  'Part 4: A brief history of coffee',
  'Complete the notes. Write NO MORE THAN TWO WORDS for each answer.',
  `<p>A lecturer delivers an introductory lecture on the global history of coffee.</p>`,
  undefined, undefined,
  { transcript: 'Good morning everyone, today we\'re going to talk about coffee... [full script].' })

const l4notes = [
  { p:'Coffee is thought to have originated in the ____ region.', a:'Ethiopian', n:31 },
  { p:'The Sufis used coffee to stay alert during ____.', a:'prayers', n:32 },
  { p:'The first European coffee houses appeared in ____.', a:'Venice', n:33 },
  { p:'In 17th-century England coffee houses were nicknamed "penny ____".', a:'universities', n:34 },
  { p:'Coffee arrived in Brazil in the year ____.', a:'1727', n:35 },
  { p:'Today, Brazil produces roughly ____ of the world\'s coffee.', a:['one-third','a third','1/3'], n:36 },
  { p:'The "first wave" focused on ____ and instant coffee.', a:['convenience'], n:37 },
  { p:'The "third wave" emphasises direct ____ with farmers.', a:['relationships','relationship'], n:38 },
  { p:'Climate change threatens about ____% of current coffee-growing land.', a:['50','fifty'], n:39 },
  { p:'A promising alternative crop being studied is ____.', a:['Liberica','liberica'], n:40 }
]
l4notes.forEach((q, i) =>
  createQ(l4, i, q.n, 'listening_note_completion', q.p, { word_limit: 2 }, { answer: q.a }))

// ---------------------------------------------------------------------------
// 3) WRITING TESTS (4 tests)
// ---------------------------------------------------------------------------
const writingTests = [
  {
    title: 'Cambridge-style IELTS Academic Writing — Mock Test 1',
    description: 'Two writing tasks modelled on Cambridge IELTS 20 Test 4. Task 1 (20 min, 150+ words) + Task 2 (40 min, 250+ words).',
    task1: `<p>The chart below shows the percentage of households in four different income groups that owned selected consumer durables (washing machine, microwave, smartphone, tumble dryer) in a European country in 2005 and 2023.</p>
  <p><strong>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</strong></p>`,
    task2: `<p>Some people believe that in order to combat climate change, governments should focus primarily on regulating large industries, while others argue that individual behaviour change is equally important.</p>
  <p><strong>Discuss both views and give your own opinion.</strong></p>
  <p>Give reasons for your answer and include any relevant examples from your own knowledge or experience.</p>`
  },
  {
    title: 'Cambridge-style IELTS Academic Writing — Mock Test 2',
    description: 'Two writing tasks with line graph Task 1 and education topic Task 2.',
    task1: `<p>The line graph shows the number of international students studying in three different countries from 2000 to 2020.</p>
  <p><strong>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</strong></p>`,
    task2: `<p>Some people think that children should begin learning a foreign language at primary school rather than secondary school.</p>
  <p><strong>Do the advantages of this outweigh the disadvantages?</strong></p>`
  },
  {
    title: 'Cambridge-style IELTS Academic Writing — Mock Test 3',
    description: 'Two writing tasks with bar chart Task 1 and technology topic Task 2.',
    task1: `<p>The bar chart below shows the average monthly expenditure on different categories in three major cities in 2022.</p>
  <p><strong>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</strong></p>`,
    task2: `<p>Nowadays the way many people interact with each other has changed because of technology.</p>
  <p><strong>In what ways has technology affected the types of relationships people make? Has this become a positive or negative development?</strong></p>`
  },
  {
    title: 'Cambridge-style IELTS Academic Writing — Mock Test 4',
    description: 'Two writing tasks with pie chart Task 1 and environment topic Task 2.',
    task1: `<p>The pie charts show the proportion of different types of energy used in two different countries in 2010 and 2020.</p>
  <p><strong>Summarise the information by selecting and reporting the main features, and make comparisons where relevant.</strong></p>`,
    task2: `<p>Many people believe that social networking sites (such as Facebook) have had a huge negative impact on both individuals and society.</p>
  <p><strong>To what extent do you agree?</strong></p>`
  }
]

writingTests.forEach((testData, testIndex) => {
  const writingId = createTest(testData.title, 'writing', testData.description, 60)
  const w1 = createSection(writingId, 0,
    'Writing Task 1',
    'You should spend about 20 minutes on this task. Write at least 150 words.',
    testData.task1,
    undefined, undefined, { min_words: 150, suggested_min: 20 })
  createQ(w1, 0, 1, 'writing_task_1', 'Write your response to Task 1 here.', { min_words: 150 }, null, 0)

  const w2 = createSection(writingId, 1,
    'Writing Task 2',
    'You should spend about 40 minutes on this task. Write at least 250 words.',
    testData.task2,
    undefined, undefined, { min_words: 250, suggested_min: 40 })
  createQ(w2, 0, 2, 'writing_task_2', 'Write your response to Task 2 here.', { min_words: 250 }, null, 0)
})

// ---------------------------------------------------------------------------
// 4) SPEAKING TESTS (4 tests)
// ---------------------------------------------------------------------------
const speakingTests = [
  {
    title: 'Cambridge-style IELTS Speaking — Mock Test 1',
    description: 'Three speaking parts modelled on Cambridge IELTS 20 Test 4. 11–14 minutes.',
    part1: [
      'Let\'s talk about your hometown. Where is your hometown and what is it known for?',
      'Do you prefer living in a city or in the countryside? Why?',
      'How often do you travel on public transport?',
      'What kind of weather do you enjoy most? Why?',
      'Do you think you will live in the same place in ten years\' time?'
    ],
    part2: `<p>Describe a skill that you would like to learn but have not yet had the chance to.</p>
<p>You should say:</p>
<ul>
  <li>what the skill is</li>
  <li>how you would learn it</li>
  <li>how long it might take to become good at it</li>
</ul>
<p>and explain why you would like to learn this skill.</p>`,
    part3: [
      'In your country, what kinds of skills are most valued by employers today?',
      'Do you think schools focus enough on practical life skills? Why or why not?',
      'Is it more important to be good at many things or to specialise in one area?',
      'How has technology changed the way people learn new skills?',
      'Do you think older people find it harder than younger people to learn new skills?'
    ]
  },
  {
    title: 'Cambridge-style IELTS Speaking — Mock Test 2',
    description: 'Speaking test about hobbies and leisure activities.',
    part1: [
      'Let\'s talk about your hobbies. What do you like to do in your free time?',
      'Have your hobbies changed since you were a child?',
      'Do you prefer doing hobbies alone or with others?',
      'What new hobby would you like to try?',
      'How important are hobbies for people\'s well-being?'
    ],
    part2: `<p>Describe a hobby or activity you enjoy doing in your free time.</p>
<p>You should say:</p>
<ul>
  <li>what the hobby/activity is</li>
  <li>where you do it</li>
  <li>who you do it with</li>
</ul>
<p>and explain why you enjoy it.</p>`,
    part3: [
      'What are the most popular free-time activities in your country?',
      'Do you think people have less free time now than in the past?',
      'What are the advantages of having outdoor activities compared to indoor hobbies?',
      'How has technology affected the way people spend their free time?',
      'Do you think schools should encourage students to have more hobbies?'
    ]
  },
  {
    title: 'Cambridge-style IELTS Speaking — Mock Test 3',
    description: 'Speaking test about food and cooking.',
    part1: [
      'Let\'s talk about food. What is your favourite food?',
      'Do you like cooking? Why or why not?',
      'What kind of food do you eat for typical in your country?',
      'Have your eating changed in recent years?',
      'Do you prefer eating at home or in restaurants?'
    ],
    part2: `<p>Describe a meal you had that you really enjoyed.</p>
<p>You should say:</p>
<ul>
  <li>what meal it was</li>
  <li>where you had it</li>
  <li>who you were with</li>
</ul>
<p>and explain why you enjoyed it so much.</p>`,
    part3: [
      'What are the advantages of home-cooked food compared to restaurant food?',
      'Do you think cooking is important for people to learn how to cook?',
      'How has food in your country changed in the last few decades?',
      'What are the environmental impacts of modern food production?',
      'Do you think will change even more in the future?'
    ]
  },
  {
    title: 'Cambridge-style IELTS Speaking — Mock Test 4',
    description: 'Speaking test about travel and tourism.',
    part1: [
      'Let\'s talk about travel. Do you like travelling?',
      'What is your favourite way to travel?',
      'Have you ever travelled abroad?',
      'What do you like to do when you visit a new place?',
      'Do you prefer travelling in your own country or abroad?'
    ],
    part2: `<p>Describe a place you have visited that you really enjoyed.</p>
<p>You should say:</p>
<ul>
  <li>where the place is</li>
  <li>when you went there</li>
  <li>what you did there</li>
</ul>
<p>and explain why you enjoyed visiting this place.</p>`,
    part3: [
      'What are the benefits of travelling to other countries?',
      'Do you think tourism has positive or negative effects on local communities?',
      'How has travel changed in the last 50 years?',
      'What are the advantages and disadvantages of mass tourism?',
      'Do you think people should be encouraged to travel more?'
    ]
  }
]

speakingTests.forEach((testData) => {
  const speakingId = createTest(testData.title, 'speaking', testData.description, 14)
  
  const s1 = createSection(speakingId, 0,
    'Part 1: Introduction and interview',
    'The examiner asks you general questions about yourself and a range of familiar topics (4-5 minutes). Record your answers.',
    '<p>In this part the examiner will ask questions about your home, work or studies, and other familiar topics. Answer each question in 1–2 sentences.</p>')
  testData.part1.forEach((p, i) => createQ(s1, i, i+1, 'speaking_part_1', p, null, null, 0))

  const s2 = createSection(speakingId, 1,
    'Part 2: Individual long turn',
    'You will have 1 minute to prepare, then speak for 1–2 minutes on the cue card topic.',
    '',
    undefined, undefined,
    { cue_card: testData.part2 })
  createQ(s2, 0, 1, 'speaking_part_2',
    'Record your long-turn response (1–2 minutes).',
    { cue_card: 'See section' }, null, 0)

  const s3 = createSection(speakingId, 2,
    'Part 3: Two-way discussion',
    'Broader discussion questions connected to the Part 2 topic (4-5 minutes).',
    '')
  testData.part3.forEach((p, i) => createQ(s3, i, i+1, 'speaking_part_3', p, null, null, 0))
})

// ---------------------------------------------------------------------------
// Default admin user — idempotent upsert so `npm run seed` is safe to rerun.
// Override email/password via env: ADMIN_EMAIL, ADMIN_PASSWORD.
// ---------------------------------------------------------------------------
const adminEmail = process.env.ADMIN_EMAIL || 'admin@ielts.local'
const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
const adminHash = bcrypt.hashSync(adminPassword, 10)
const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(adminEmail) as any
if (existing) {
  db.prepare('UPDATE users SET password_hash = ?, role = ? WHERE id = ?')
    .run(adminHash, 'admin', existing.id)
  console.log(`[seed] admin user updated: ${adminEmail}`)
} else {
  db.prepare('INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)')
    .run(adminEmail, 'Admin', adminHash, 'admin')
  console.log(`[seed] admin user created: ${adminEmail}`)
}

// ---------------------------------------------------------------------------
// Done
// ---------------------------------------------------------------------------
const counts = db.prepare('SELECT skill, COUNT(*) AS c FROM tests GROUP BY skill').all()
console.log('\n✅ Seed complete. Tests in database by skill:')
console.table(counts)
console.log('\nYou can now run `npm run dev` and visit http://localhost:3000')
console.log(`Admin login:  http://localhost:3000/admin/login  (${adminEmail} / ${adminPassword})`)
db.close()
