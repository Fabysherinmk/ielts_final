export interface SeedQuestion {
  number: number
  type: string
  prompt: string
  data?: Record<string, any>
  answer?: any
  points?: number
}

export interface SeedSection {
  title: string
  instructions: string
  body: string
  audio_path: string
  extra?: Record<string, any>
  questions: SeedQuestion[]
}

const boatFeatureOptions = [
  'why it was built',
  'who built it',
  'how long it took to build',
  'who staffed it',
  'what it was built with'
]

const wildlifeOptions = [
  'sea eagles',
  'fur seals',
  'dolphins',
  'whales',
  'penguins'
]

const caveOptions = [
  'Only large tourist boats can visit them.',
  'The entrances to them are often blocked.',
  'It is too dangerous for individuals to go near them.',
  'Someone will explain what is inside them.',
  'They cannot be reached on foot.'
]

const moduleOptions = [
  { id: 'A', text: 'Tim found this easier than expected.' },
  { id: 'B', text: 'Tim thought this was not very clearly organised.' },
  { id: 'C', text: 'Diana may do some further study on this.' },
  { id: 'D', text: 'They both found the reading required for this was difficult.' },
  { id: 'E', text: 'Tim was shocked at something he learned on this module.' },
  { id: 'F', text: 'They were both surprised how little is known about some aspects of this.' }
]

export const cambridge17ListeningTest1 = {
  title: 'Cambridge IELTS 17 Academic Listening Test 1',
  skill: 'listening',
  description: 'Official Cambridge IELTS 17 Academic Listening Test 1 practice set with four audio parts.',
  duration_min: 40,
  extra: {
    source_pdf: 'D:/anime/Cambridge 17_text.pdf',
    source_question_page: 'https://engnovate.com/ielts-listening-tests/cambridge-ielts-17-academic-listening-test-1/',
    modes: ['practice', 'test'],
    test_mode_audio: 'one-play-per-part',
    practice_mode_audio: 'replayable'
  },
  sections: [
    {
      title: 'Part 1: Buckworth Conservation Group',
      instructions: 'Questions 1-10. Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      audio_path: 'https://pub-14064a4af44e450d8aa584606b77ceb4.r2.dev/audio/cambridge-17-test-1-part-1.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 1 <span>Questions 1-10</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD AND/OR A NUMBER for each answer.</strong></p>
          <h3>Buckworth Conservation Group</h3>
          <p><strong>Regular activities</strong></p>
          <ul>
            <li>Beach
              <ul>
                <li>making sure the beach does not have <span class="sheet-gap"><span class="gap-number">1</span></span> on it</li>
                <li>no <span class="sheet-gap"><span class="gap-number">2</span></span></li>
              </ul>
            </li>
            <li>Nature reserve
              <ul>
                <li>taking action to attract <span class="sheet-gap"><span class="gap-number">3</span></span> to the place</li>
                <li>identifying types of <span class="sheet-gap"><span class="gap-number">4</span></span></li>
                <li>building a new <span class="sheet-gap"><span class="gap-number">5</span></span></li>
              </ul>
            </li>
          </ul>
          <p><strong>Forthcoming activities</strong></p>
          <ul>
            <li>Saturday
              <ul>
                <li>walk across the sands and reach the <span class="sheet-gap"><span class="gap-number">6</span></span></li>
                <li>wear appropriate <span class="sheet-gap"><span class="gap-number">7</span></span></li>
              </ul>
            </li>
            <li>Woodwork session
              <ul>
                <li>suitable for <span class="sheet-gap"><span class="gap-number">8</span></span> to participate in</li>
                <li>making <span class="sheet-gap"><span class="gap-number">9</span></span> out of wood</li>
                <li>cost of session: &pound;<span class="sheet-gap sheet-gap--short"><span class="gap-number">10</span></span></li>
              </ul>
            </li>
          </ul>
        </div>
      `,
      questions: [
        { number: 1, type: 'listening_note_completion', prompt: 'Beach: making sure the beach does not have ____ on it', data: { word_limit: 1 }, answer: { answer: 'litter' } },
        { number: 2, type: 'listening_note_completion', prompt: 'Beach: no ____', data: { word_limit: 1 }, answer: { answer: 'dogs' } },
        { number: 3, type: 'listening_note_completion', prompt: 'Nature reserve: taking action to attract ____ to the place', data: { word_limit: 1 }, answer: { answer: 'insects' } },
        { number: 4, type: 'listening_note_completion', prompt: 'Nature reserve: identifying types of ____', data: { word_limit: 1 }, answer: { answer: 'butterflies' } },
        { number: 5, type: 'listening_note_completion', prompt: 'Nature reserve: building a new ____', data: { word_limit: 1 }, answer: { answer: 'wall' } },
        { number: 6, type: 'listening_note_completion', prompt: 'Saturday: walk across the sands and reach the ____', data: { word_limit: 1 }, answer: { answer: 'island' } },
        { number: 7, type: 'listening_note_completion', prompt: 'Saturday: wear appropriate ____', data: { word_limit: 1 }, answer: { answer: 'boots' } },
        { number: 8, type: 'listening_note_completion', prompt: 'Woodwork session: suitable for ____ to participate in', data: { word_limit: 1 }, answer: { answer: 'beginners' } },
        { number: 9, type: 'listening_note_completion', prompt: 'Woodwork session: making ____ out of wood', data: { word_limit: 1 }, answer: { answer: 'spoons' } },
        { number: 10, type: 'listening_note_completion', prompt: 'Woodwork session: cost of session, no camping: &pound;____', data: { word_limit: 2 }, answer: { answer: ['35', 'thirty five', 'thirty-five'] } }
      ]
    },
    {
      title: 'Part 2: Boat trip round Tasmania',
      instructions: 'Questions 11-20. Choose the correct letter, A, B or C. For paired questions, choose TWO letters.',
      audio_path: 'https://pub-14064a4af44e450d8aa584606b77ceb4.r2.dev/audio/cambridge-17-test-1-part-2.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 2 <span>Questions 11-20</span></h2>
          <h3>Boat trip round Tasmania</h3>
          <p>Questions 11-14: Choose the correct letter, A, B or C.</p>
          <p>Questions 15-20: Choose TWO letters.</p>
        </div>
      `,
      questions: [
        { number: 11, type: 'listening_mcq_single', prompt: 'What is the maximum number of people who can stand on each side of the boat?', data: { options: ['9', '15', '18'] }, answer: { answer: 'A' } },
        { number: 12, type: 'listening_mcq_single', prompt: 'What colour are the tour boats?', data: { options: ['dark red', 'jet black', 'light green'] }, answer: { answer: 'C' } },
        { number: 13, type: 'listening_mcq_single', prompt: 'Which lunchbox is suitable for someone who does not eat meat or fish?', data: { options: ['Lunchbox 1', 'Lunchbox 2', 'Lunchbox 3'] }, answer: { answer: 'B' } },
        { number: 14, type: 'listening_mcq_single', prompt: 'What should people do with their litter?', data: { options: ['take it home', 'hand it to a member of staff', 'put it in the bins provided on the boat'] }, answer: { answer: 'B' } },
        { number: 15, type: 'listening_mcq_multi', prompt: 'Which TWO features of the lighthouse does Lou mention?', data: { options: boatFeatureOptions, choose: 2, display_numbers: '15-16' }, answer: { answer: ['A', 'D'] }, points: 2 },
        { number: 16, type: 'listening_mcq_multi', prompt: 'Question 16 is included in the two-letter answer for Question 15.', data: { options: [], choose: 0, linked_to: 15 }, answer: { ignore: true }, points: 0 },
        { number: 17, type: 'listening_mcq_multi', prompt: 'Which TWO types of creature might come close to the boat?', data: { options: wildlifeOptions, choose: 2, display_numbers: '17-18' }, answer: { answer: ['B', 'C'] }, points: 2 },
        { number: 18, type: 'listening_mcq_multi', prompt: 'Question 18 is included in the two-letter answer for Question 17.', data: { options: [], choose: 0, linked_to: 17 }, answer: { ignore: true }, points: 0 },
        { number: 19, type: 'listening_mcq_multi', prompt: 'Which TWO points does Lou make about the caves?', data: { options: caveOptions, choose: 2, display_numbers: '19-20' }, answer: { answer: ['D', 'E'] }, points: 2 },
        { number: 20, type: 'listening_mcq_multi', prompt: 'Question 20 is included in the two-letter answer for Question 19.', data: { options: [], choose: 0, linked_to: 19 }, answer: { ignore: true }, points: 0 }
      ]
    },
    {
      title: 'Part 3: Work experience for veterinary science students',
      instructions: 'Questions 21-30. Choose the correct letter, A, B or C. Then match each module with the correct comment.',
      audio_path: 'https://pub-14064a4af44e450d8aa584606b77ceb4.r2.dev/audio/cambridge-17-test-1-part-3.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 3 <span>Questions 21-30</span></h2>
          <h3>Work experience for veterinary science students</h3>
          <p>Questions 21-26: Choose the correct letter, A, B or C.</p>
          <p>Questions 27-30: What opinion do the students give about each of the following modules?</p>
        </div>
      `,
      questions: [
        { number: 21, type: 'listening_mcq_single', prompt: 'What problem did both Diana and Tim have when arranging their work experience?', data: { options: ['making initial contact with suitable farms', 'organising transport to and from the farm', 'finding a placement for the required length of time'] }, answer: { answer: 'A' } },
        { number: 22, type: 'listening_mcq_single', prompt: 'Tim was pleased to be able to help ____', data: { options: ['a lamb that had a broken leg', 'a sheep that was having difficulty giving birth', 'a newly born lamb that was having trouble feeding'] }, answer: { answer: 'B' } },
        { number: 23, type: 'listening_mcq_single', prompt: 'Diana says the sheep on her farm ____', data: { options: ['were of various different varieties', 'were mainly reared for their meat', 'had better quality wool than sheep on the hills'] }, answer: { answer: 'B' } },
        { number: 24, type: 'listening_mcq_single', prompt: 'What did the students learn about adding supplements to chicken feed?', data: { options: ['These should only be given if specially needed.', 'It is worth paying extra for the most effective ones.', 'The amount given at one time should be limited.'] }, answer: { answer: 'A' } },
        { number: 25, type: 'listening_mcq_single', prompt: 'What happened when Diana was working with dairy cows?', data: { options: ['She identified some cows incorrectly.', 'She accidentally threw some milk away.', 'She made a mistake when storing milk.'] }, answer: { answer: 'C' } },
        { number: 26, type: 'listening_mcq_single', prompt: 'What did both farmers mention about vets and farming?', data: { options: ['Vets are failing to cope with some aspects of animal health.', 'There needs to be a fundamental change in the training of vets.', 'Some jobs could be done by the farmer rather than by a vet.'] }, answer: { answer: 'C' } },
        { number: 27, type: 'listening_matching', prompt: 'Medical terminology', data: { options: moduleOptions, interaction: 'drag_drop' }, answer: { answer: 'A' } },
        { number: 28, type: 'listening_matching', prompt: 'Diet and nutrition', data: { options: moduleOptions, interaction: 'drag_drop' }, answer: { answer: 'E' } },
        { number: 29, type: 'listening_matching', prompt: 'Animal disease', data: { options: moduleOptions, interaction: 'drag_drop' }, answer: { answer: 'F' } },
        { number: 30, type: 'listening_matching', prompt: 'Wildlife medication', data: { options: moduleOptions, interaction: 'drag_drop' }, answer: { answer: 'C' } }
      ]
    },
    {
      title: 'Part 4: Labyrinths',
      instructions: 'Questions 31-40. Complete the notes below. Write ONE WORD ONLY for each answer.',
      audio_path: 'https://pub-14064a4af44e450d8aa584606b77ceb4.r2.dev/audio/cambridge-17-test-1-part-4.mp3',
      body: `
        <div class="ielts-sheet ielts-sheet--notes">
          <h2>PART 4 <span>Questions 31-40</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD ONLY for each answer.</strong></p>
          <div class="note-box">
            <h3>Labyrinths</h3>
            <p><strong>Definition</strong></p>
            <ul>
              <li>a winding spiral path leading to a central area</li>
            </ul>
            <p><strong>Labyrinths compared with mazes</strong></p>
            <ul>
              <li>Mazes are a type of <span class="sheet-gap"><span class="gap-number">31</span></span></li>
              <li><span class="sheet-gap"><span class="gap-number">32</span></span> is needed to navigate through a maze</li>
              <li>the word 'maze' is derived from a word meaning a feeling of <span class="sheet-gap"><span class="gap-number">33</span></span></li>
              <li>Labyrinths represent a journey through life
                <ul>
                  <li>they have frequently been used in <span class="sheet-gap"><span class="gap-number">34</span></span> and prayer</li>
                </ul>
              </li>
            </ul>
            <p><strong>Early examples of the labyrinth spiral</strong></p>
            <ul>
              <li>found carved into <span class="sheet-gap"><span class="gap-number">35</span></span> in many cultures</li>
              <li>used by Ancient Greeks on <span class="sheet-gap"><span class="gap-number">36</span></span></li>
              <li>the largest surviving turf labyrinth once had a big <span class="sheet-gap"><span class="gap-number">37</span></span> at the centre</li>
            </ul>
            <p><strong>Labyrinths nowadays</strong></p>
            <ul>
              <li>walking a labyrinth can slow a person's <span class="sheet-gap"><span class="gap-number">38</span></span> rate</li>
              <li>finger labyrinths can be made from <span class="sheet-gap"><span class="gap-number">39</span></span></li>
              <li>Alzheimer's patients may experience less <span class="sheet-gap"><span class="gap-number">40</span></span></li>
            </ul>
          </div>
       </div>
      `,
      questions: [
        { number: 31, type: 'listening_note_completion', prompt: 'Mazes are a type of ____', data: { word_limit: 1 }, answer: { answer: 'puzzle' } },
        { number: 32, type: 'listening_note_completion', prompt: '____ is needed to navigate through a maze.', data: { word_limit: 1 }, answer: { answer: 'logic' } },
        { number: 33, type: 'listening_note_completion', prompt: "The word 'maze' is derived from a word meaning a feeling of ____", data: { word_limit: 1 }, answer: { answer: 'confusion' } },
        { number: 34, type: 'listening_note_completion', prompt: 'Labyrinths have frequently been used in ____ and prayer.', data: { word_limit: 1 }, answer: { answer: 'meditation' } },
        { number: 35, type: 'listening_note_completion', prompt: 'Early examples of the labyrinth spiral have been found carved into ____', data: { word_limit: 1 }, answer: { answer: 'stone' } },
        { number: 36, type: 'listening_note_completion', prompt: 'Ancient Greeks used the labyrinth spiral on ____', data: { word_limit: 1 }, answer: { answer: 'coins' } },
        { number: 37, type: 'listening_note_completion', prompt: 'The largest surviving turf labyrinth used to have a big ____ at the centre.', data: { word_limit: 1 }, answer: { answer: 'tree' } },
        { number: 38, type: 'listening_note_completion', prompt: "Walking a labyrinth can slow a person's ____ rate.", data: { word_limit: 1 }, answer: { answer: 'breathing' } },
        { number: 39, type: 'listening_note_completion', prompt: 'Finger labyrinths can be made from ____', data: { word_limit: 1 }, answer: { answer: 'paper' } },
        { number: 40, type: 'listening_note_completion', prompt: "Alzheimer's patients may experience less ____", data: { word_limit: 1 }, answer: { answer: 'anxiety' } }
      ]
    }
  ]
} satisfies {
  title: string
  skill: string
  description: string
  duration_min: number
  extra: Record<string, any>
  sections: SeedSection[]
}
