export const listeningTest3 = {
  title: 'Cambridge-style IELTS Academic Listening — Mock Test 3',
  skill: 'listening',
  description: 'Four-part Cambridge-style listening test covering a library book enquiry, a heritage trail audio guide, a group project discussion, and an academic lecture on coral reef ecosystems.',
  duration_min: 40,
  extra: {
    modes: ['practice', 'test'],
    test_mode_audio: 'tts',
    practice_mode_audio: 'tts'
  },
  sections: [
    {
      title: 'Part 1: University library book loan enquiry',
      instructions: 'Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      audio_path: '/uploads/audio/mock-test-3-part-1.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 1 <span>Questions 1–10</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD AND/OR A NUMBER for each answer.</strong></p>
          <h3>Westfield University Library — Inter-library Loan Request</h3>
          <table class="ielts-table">
            <tr><td>Student's first name:</td><td><span class="sheet-gap"><span class="gap-number">1</span></span></td></tr>
            <tr><td>Student ID number:</td><td>WU<span class="sheet-gap sheet-gap--short"><span class="gap-number">2</span></span></td></tr>
            <tr><td>Department:</td><td><span class="sheet-gap"><span class="gap-number">3</span></span></td></tr>
            <tr><td>Book title requested:</td><td>The <span class="sheet-gap"><span class="gap-number">4</span></span> of Cities</td></tr>
            <tr><td>Author's surname:</td><td><span class="sheet-gap"><span class="gap-number">5</span></span></td></tr>
            <tr><td>Publication year:</td><td><span class="sheet-gap sheet-gap--short"><span class="gap-number">6</span></span></td></tr>
            <tr><td>Loan period requested:</td><td><span class="sheet-gap"><span class="gap-number">7</span></span> weeks</td></tr>
            <tr><td>Collection point:</td><td><span class="sheet-gap"><span class="gap-number">8</span></span> desk</td></tr>
            <tr><td>Estimated arrival:</td><td><span class="sheet-gap"><span class="gap-number">9</span></span> working days</td></tr>
            <tr><td>Notification method:</td><td><span class="sheet-gap"><span class="gap-number">10</span></span></td></tr>
          </table>
        </div>
      `,
      tts_script: `
        Westfield University Library, good afternoon, how can I help you?
        Hi, I'd like to request an inter-library loan please.
        Of course. Can I start with your first name?
        It's Bethany.
        And your student ID?
        It's WU then 48 29 17.
        Which department are you from, Bethany?
        Geography.
        And the book you need?
        It's called The Ecology of Cities — E-C-O-L-O-G-Y. The author is Professor Whitmore. W-H-I-T-M-O-R-E.
        Do you know the year of publication?
        Yes, it was published in 2019.
        How long do you need the loan for?
        Three weeks if possible.
        That's fine. You can collect it from the main desk when it arrives. It should take approximately five working days.
        How would you like to be notified when it's ready?
        By email please.
        Perfect. I've logged your request. You'll get an email confirmation shortly.
      `,
      questions: [
        { number: 1, type: 'listening_form_completion', prompt: "Student's first name:", data: { word_limit: 1 }, answer: { answer: 'Bethany' } },
        { number: 2, type: 'listening_form_completion', prompt: 'Student ID number: WU____', data: { word_limit: 1 }, answer: { answer: '482917' } },
        { number: 3, type: 'listening_form_completion', prompt: 'Department:', data: { word_limit: 1 }, answer: { answer: 'Geography' } },
        { number: 4, type: 'listening_form_completion', prompt: 'Book title: The ____ of Cities', data: { word_limit: 1 }, answer: { answer: 'Ecology' } },
        { number: 5, type: 'listening_form_completion', prompt: "Author's surname:", data: { word_limit: 1 }, answer: { answer: 'Whitmore' } },
        { number: 6, type: 'listening_form_completion', prompt: 'Publication year:', data: { word_limit: 1 }, answer: { answer: '2019' } },
        { number: 7, type: 'listening_form_completion', prompt: 'Loan period requested: ____ weeks', data: { word_limit: 1 }, answer: { answer: 'three' } },
        { number: 8, type: 'listening_form_completion', prompt: 'Collection point: ____ desk', data: { word_limit: 1 }, answer: { answer: 'main' } },
        { number: 9, type: 'listening_form_completion', prompt: 'Estimated arrival: ____ working days', data: { word_limit: 1 }, answer: { answer: 'five' } },
        { number: 10, type: 'listening_form_completion', prompt: 'Notification method:', data: { word_limit: 1 }, answer: { answer: 'email' } }
      ]
    },
    {
      title: 'Part 2: Heritage trail audio guide — Thornton Village',
      instructions: 'Questions 11–20. Choose the correct letter A, B or C for questions 11–15. Match the locations to the descriptions for questions 16–20.',
      audio_path: '/uploads/audio/mock-test-3-part-2.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 2 <span>Questions 11–20</span></h2>
          <h3>Thornton Village Heritage Trail</h3>
          <p><strong>Questions 11–15:</strong> Choose the correct letter, A, B or C.</p>
          <p><strong>Questions 16–20:</strong> Match each description with the correct location (A–G).</p>
        </div>
      `,
      tts_script: `
        Welcome to the Thornton Village Heritage Trail. This self-guided audio tour covers sixteen points of interest across the village and takes approximately two hours to complete at a leisurely pace.
        The trail was established in 2003 and has since been extended twice, most recently in 2019 when four new sites were added to the eastern section.
        Refreshments are available at the village tearoom, open daily except Mondays. Dogs are welcome on leads throughout the trail but must not enter the church or the mill interior.
        You are currently standing beside the old stone bridge, which dates from 1632. Notice how the central arch is slightly narrower than the two outer arches — this was a deliberate structural choice to direct the strongest current away from the foundations.
        Ahead of you is the old smithy, now converted into private residential accommodation. The original forge equipment is displayed in the window.
        To your right is the village hall, which was built as a school in 1881 and served that purpose until 1965.
        Continuing along the lane, the building with the blue gate is the former vicarage, now operating as a bed and breakfast.
        The water mill at the end of the path was operational until 1934 and has been restored for visitor tours on weekend afternoons.
        The oldest structure on the trail is the standing stone in the field beside the mill. It is believed to date from the Bronze Age and its original purpose remains unknown.
      `,
      questions: [
        { number: 11, type: 'listening_mcq_single', prompt: 'How long does the heritage trail take to complete?', data: { options: ['one hour', 'two hours', 'three hours'] }, answer: { answer: 'B' } },
        { number: 12, type: 'listening_mcq_single', prompt: 'When was the trail most recently extended?', data: { options: ['2003', '2009', '2019'] }, answer: { answer: 'C' } },
        { number: 13, type: 'listening_mcq_single', prompt: 'Where are visitors NOT allowed to take dogs?', data: { options: ['the churchyard', 'the church and mill interior', 'the village tearoom'] }, answer: { answer: 'B' } },
        { number: 14, type: 'listening_mcq_single', prompt: 'Why was the central arch of the old bridge made narrower?', data: { options: ['to allow larger boats to pass', 'to direct the strongest current away from the foundations', 'to support a pedestrian walkway above'] }, answer: { answer: 'B' } },
        { number: 15, type: 'listening_mcq_single', prompt: 'What was the village hall originally built as?', data: { options: ['a courthouse', 'a church hall', 'a school'] }, answer: { answer: 'C' } },
        { number: 16, type: 'listening_matching', prompt: 'now used as residential accommodation', data: { options: [{ id: 'A', text: 'old stone bridge' }, { id: 'B', text: 'old smithy' }, { id: 'C', text: 'village hall' }, { id: 'D', text: 'former vicarage' }, { id: 'E', text: 'water mill' }, { id: 'F', text: 'standing stone' }, { id: 'G', text: 'village tearoom' }] }, answer: { answer: 'B' } },
        { number: 17, type: 'listening_matching', prompt: 'originally built in 1881', data: { options: [{ id: 'A', text: 'old stone bridge' }, { id: 'B', text: 'old smithy' }, { id: 'C', text: 'village hall' }, { id: 'D', text: 'former vicarage' }, { id: 'E', text: 'water mill' }, { id: 'F', text: 'standing stone' }, { id: 'G', text: 'village tearoom' }] }, answer: { answer: 'C' } },
        { number: 18, type: 'listening_matching', prompt: 'now operating as a bed and breakfast', data: { options: [{ id: 'A', text: 'old stone bridge' }, { id: 'B', text: 'old smithy' }, { id: 'C', text: 'village hall' }, { id: 'D', text: 'former vicarage' }, { id: 'E', text: 'water mill' }, { id: 'F', text: 'standing stone' }, { id: 'G', text: 'village tearoom' }] }, answer: { answer: 'D' } },
        { number: 19, type: 'listening_matching', prompt: 'open for visitor tours on weekend afternoons', data: { options: [{ id: 'A', text: 'old stone bridge' }, { id: 'B', text: 'old smithy' }, { id: 'C', text: 'village hall' }, { id: 'D', text: 'former vicarage' }, { id: 'E', text: 'water mill' }, { id: 'F', text: 'standing stone' }, { id: 'G', text: 'village tearoom' }] }, answer: { answer: 'E' } },
        { number: 20, type: 'listening_matching', prompt: 'believed to date from the Bronze Age', data: { options: [{ id: 'A', text: 'old stone bridge' }, { id: 'B', text: 'old smithy' }, { id: 'C', text: 'village hall' }, { id: 'D', text: 'former vicarage' }, { id: 'E', text: 'water mill' }, { id: 'F', text: 'standing stone' }, { id: 'G', text: 'village tearoom' }] }, answer: { answer: 'F' } }
      ]
    },
    {
      title: 'Part 3: Group project discussion on renewable energy',
      instructions: 'Questions 21–30. Answer the multiple choice questions and complete the sentences.',
      audio_path: '/uploads/audio/mock-test-3-part-3.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 3 <span>Questions 21–30</span></h2>
          <h3>Group Project: Renewable Energy Transition</h3>
          <p><strong>Questions 21–22:</strong> Choose TWO letters.</p>
          <p><strong>Questions 23–24:</strong> Choose TWO letters.</p>
          <p><strong>Questions 25–30:</strong> Complete the sentences. Write ONE WORD ONLY.</p>
        </div>
      `,
      tts_script: `
        So, for our renewable energy project, what were the two main barriers to adoption that the research highlighted?
        From what I read, cost was the biggest one — upfront installation costs are still too high for many households.
        I'd add public resistance — especially for wind farms. People support renewable energy in principle but often object to projects near their homes.
        Right. And what did we find as the two most effective government policies for accelerating the transition?
        Feed-in tariffs were clearly the most impactful — paying households for energy they generate and return to the grid.
        And subsidies for manufacturers to drive down the cost of solar panels. That's had a measurable effect.
        Good. Now let's think about our case studies. The Danish example showed that community ownership of wind projects increases local acceptance considerably.
        The storage problem is still the biggest technical obstacle — we can generate renewable energy but not reliably store it yet.
        Battery technology is improving rapidly though. Costs have fallen by about eighty percent in the last decade.
        The report suggested that grid infrastructure needs significant investment to handle variable supply from renewables.
        One interesting finding was that employment in renewable energy now exceeds fossil fuel employment in several countries.
        And finally, the evidence suggested that energy efficiency improvements can actually reduce overall demand significantly before supply even needs to increase.
      `,
      questions: [
        { number: 21, type: 'listening_mcq_multi', prompt: 'Which TWO main barriers to renewable energy adoption did the research highlight?', data: { options: ['high upfront costs', 'lack of government support', 'public resistance', 'insufficient sunlight in northern regions', 'limited grid capacity'], choose: 2, display_numbers: '21-22' }, answer: { answer: ['A', 'C'] }, points: 2 },
        { number: 22, type: 'listening_mcq_multi', prompt: 'Question 22 shares the answer with Question 21.', data: { options: [], choose: 0, linked_to: 21 }, answer: { ignore: true }, points: 0 },
        { number: 23, type: 'listening_mcq_multi', prompt: 'Which TWO government policies were found most effective in accelerating the transition?', data: { options: ['feed-in tariffs', 'carbon taxes on fossil fuels', 'subsidies for manufacturers', 'banning new fossil fuel cars', 'mandatory green building standards'], choose: 2, display_numbers: '23-24' }, answer: { answer: ['A', 'C'] }, points: 2 },
        { number: 24, type: 'listening_mcq_multi', prompt: 'Question 24 shares the answer with Question 23.', data: { options: [], choose: 0, linked_to: 23 }, answer: { ignore: true }, points: 0 },
        { number: 25, type: 'listening_sentence_completion', prompt: 'Community ____ of wind projects increases local acceptance.', data: { word_limit: 1 }, answer: { answer: 'ownership' } },
        { number: 26, type: 'listening_sentence_completion', prompt: 'The biggest technical obstacle remains reliable energy ____', data: { word_limit: 1 }, answer: { answer: 'storage' } },
        { number: 27, type: 'listening_sentence_completion', prompt: 'Battery costs have fallen by about eighty percent in the last ____', data: { word_limit: 1 }, answer: { answer: 'decade' } },
        { number: 28, type: 'listening_sentence_completion', prompt: 'Grid ____ needs significant investment to handle variable supply.', data: { word_limit: 1 }, answer: { answer: 'infrastructure' } },
        { number: 29, type: 'listening_sentence_completion', prompt: 'Employment in renewables now exceeds fossil fuel employment in several ____', data: { word_limit: 1 }, answer: { answer: 'countries' } },
        { number: 30, type: 'listening_sentence_completion', prompt: 'Energy ____ improvements can reduce overall demand significantly.', data: { word_limit: 1 }, answer: { answer: 'efficiency' } }
      ]
    },
    {
      title: 'Part 4: Academic lecture on coral reef ecosystems',
      instructions: 'Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer.',
      audio_path: '/uploads/audio/mock-test-3-part-4.mp3',
      body: `
        <div class="ielts-sheet ielts-sheet--notes">
          <h2>PART 4 <span>Questions 31–40</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD ONLY for each answer.</strong></p>
          <div class="note-box">
            <h3>Coral Reef Ecosystems</h3>
            <p><strong>Basic structure</strong></p>
            <ul>
              <li>Reefs are built by tiny animals called <span class="sheet-gap"><span class="gap-number">31</span></span></li>
              <li>Each polyp secretes a hard <span class="sheet-gap"><span class="gap-number">32</span></span> skeleton</li>
              <li>Reefs occupy less than 1% of the ocean floor but support about 25% of all marine <span class="sheet-gap"><span class="gap-number">33</span></span></li>
            </ul>
            <p><strong>The bleaching process</strong></p>
            <ul>
              <li>Thermal stress causes corals to expel symbiotic <span class="sheet-gap"><span class="gap-number">34</span></span></li>
              <li>Without these, the coral loses its <span class="sheet-gap"><span class="gap-number">35</span></span> and appears white</li>
              <li>Bleached corals can recover if temperatures return to <span class="sheet-gap"><span class="gap-number">36</span></span> levels</li>
            </ul>
            <p><strong>Additional threats</strong></p>
            <ul>
              <li>Ocean <span class="sheet-gap"><span class="gap-number">37</span></span> makes seawater more acidic, weakening skeletons</li>
              <li>Agricultural <span class="sheet-gap"><span class="gap-number">38</span></span> causes algal blooms that smother reefs</li>
              <li>Destructive fishing methods such as <span class="sheet-gap"><span class="gap-number">39</span></span> cause direct physical damage</li>
            </ul>
            <p><strong>Conservation approaches</strong></p>
            <ul>
              <li>Marine protected areas restrict human <span class="sheet-gap"><span class="gap-number">40</span></span> near reefs</li>
            </ul>
          </div>
        </div>
      `,
      tts_script: `
        Today I want to talk about coral reef ecosystems — why they matter, why they are under threat, and what we might do to protect them.
        Coral reefs are built by tiny colonial animals called polyps. Each individual polyp secretes a hard calcium carbonate skeleton around itself, and over thousands of years these accumulate to form the complex three-dimensional structures we recognise as reefs.
        Despite covering less than one percent of the ocean floor, coral reefs support an extraordinary diversity of life — roughly twenty-five percent of all known marine species depend on reefs at some point in their life cycle.
        The most widely reported threat to coral reefs is thermal bleaching. When ocean temperatures rise even slightly above normal levels, corals experience stress that causes them to expel the symbiotic algae living within their tissues. These algae, known as zooxanthellae, provide the coral with most of its energy through photosynthesis. Without them, the coral loses its colour and appears white — hence the term bleaching.
        Bleached corals are not immediately dead. If temperatures return to normal levels quickly enough, the algae can recolonise and the coral can recover. However, if elevated temperatures persist, mortality follows.
        Beyond temperature, reefs face other serious threats. Ocean acidification, driven by increased carbon dioxide absorption, makes seawater progressively more acidic. This weakens the calcium carbonate skeletons that reefs are built from, making them more fragile and slower to grow.
        Agricultural runoff introduces excess nutrients into coastal waters, triggering blooms of algae that can smother reefs and block the sunlight that coral-dwelling algae require.
        Destructive fishing practices, particularly the use of explosives, cause direct and severe physical damage to reef structures that may take decades to recover.
        Conservation responses include the establishment of marine protected areas, which place legal restrictions on human activity within designated zones near reefs, giving ecosystems space to recover from damage.
      `,
      questions: [
        { number: 31, type: 'listening_note_completion', prompt: 'Reefs are built by tiny animals called ____', data: { word_limit: 1 }, answer: { answer: 'polyps' } },
        { number: 32, type: 'listening_note_completion', prompt: 'Each polyp secretes a hard ____ skeleton', data: { word_limit: 1 }, answer: { answer: 'calcium' } },
        { number: 33, type: 'listening_note_completion', prompt: 'Reefs support about 25% of all marine ____', data: { word_limit: 1 }, answer: { answer: 'species' } },
        { number: 34, type: 'listening_note_completion', prompt: 'Thermal stress causes corals to expel symbiotic ____', data: { word_limit: 1 }, answer: { answer: 'algae' } },
        { number: 35, type: 'listening_note_completion', prompt: 'Without these, the coral loses its ____', data: { word_limit: 1 }, answer: { answer: 'colour' } },
        { number: 36, type: 'listening_note_completion', prompt: 'Bleached corals can recover if temperatures return to ____ levels', data: { word_limit: 1 }, answer: { answer: 'normal' } },
        { number: 37, type: 'listening_note_completion', prompt: 'Ocean ____ makes seawater more acidic', data: { word_limit: 1 }, answer: { answer: 'acidification' } },
        { number: 38, type: 'listening_note_completion', prompt: 'Agricultural ____ causes algal blooms that smother reefs', data: { word_limit: 1 }, answer: { answer: 'runoff' } },
        { number: 39, type: 'listening_note_completion', prompt: 'Destructive fishing methods such as ____ cause direct physical damage', data: { word_limit: 1 }, answer: { answer: 'explosives' } },
        { number: 40, type: 'listening_note_completion', prompt: 'Marine protected areas restrict human ____ near reefs', data: { word_limit: 1 }, answer: { answer: 'activity' } }
      ]
    }
  ]
}
