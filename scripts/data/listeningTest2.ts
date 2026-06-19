export const listeningTest2 = {
  title: 'Cambridge-style IELTS Academic Listening — Mock Test 2',
  skill: 'listening',
  description: 'Four-part Cambridge-style listening test covering a community sports enquiry, a guided town walk, a seminar on urban planning, and an academic lecture on migration patterns.',
  duration_min: 40,
  extra: {
    modes: ['practice', 'test'],
    test_mode_audio: 'tts',
    practice_mode_audio: 'tts'
  },
  sections: [
    {
      title: 'Part 1: Community Sports Centre enquiry',
      instructions: 'Questions 1–10. Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      audio_path: '/uploads/audio/mock-test-2-part-1.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 1 <span>Questions 1–10</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD AND/OR A NUMBER for each answer.</strong></p>
          <h3>Greenfield Community Sports Centre — Membership Enquiry</h3>
          <table class="ielts-table">
            <tr><td>Caller's surname:</td><td><span class="sheet-gap"><span class="gap-number">1</span></span></td></tr>
            <tr><td>Mobile number:</td><td>07881 <span class="sheet-gap sheet-gap--short"><span class="gap-number">2</span></span></td></tr>
            <tr><td>Membership type requested:</td><td><span class="sheet-gap"><span class="gap-number">3</span></span> membership</td></tr>
            <tr><td>Monthly fee:</td><td>£<span class="sheet-gap sheet-gap--short"><span class="gap-number">4</span></span></td></tr>
            <tr><td>Main activity interested in:</td><td><span class="sheet-gap"><span class="gap-number">5</span></span></td></tr>
            <tr><td>Preferred session day:</td><td><span class="sheet-gap"><span class="gap-number">6</span></span></td></tr>
            <tr><td>Session start time:</td><td><span class="sheet-gap"><span class="gap-number">7</span></span> a.m.</td></tr>
            <tr><td>Locker number assigned:</td><td><span class="sheet-gap sheet-gap--short"><span class="gap-number">8</span></span></td></tr>
            <tr><td>Car park permit needed:</td><td><span class="sheet-gap"><span class="gap-number">9</span></span></td></tr>
            <tr><td>Trial session booked for:</td><td><span class="sheet-gap"><span class="gap-number">10</span></span> of next month</td></tr>
          </table>
        </div>
      `,
      tts_script: `
        Good morning, Greenfield Community Sports Centre, how can I help you?
        Hello, I'd like to enquire about joining as a member.
        Of course! Can I take your name first?
        Yes, my surname is Hargreaves. H-A-R-G-R-E-A-V-E-S.
        Thank you, Ms Hargreaves. And a contact number?
        My mobile is 07881 followed by 334 652.
        Great. Now, we have three membership types: individual, family, and student. Which would suit you?
        I'd like a family membership please.
        That's £48 per month for up to four family members.
        That sounds fine. I'm mainly interested in swimming — is the pool available most days?
        Yes, absolutely. Which day works best for regular sessions?
        I think Wednesday would work well for us.
        We have an early morning slot starting at seven a.m. on Wednesdays. Would that suit?
        Perfect, yes.
        Wonderful. I'll assign you a locker — number 214 is free. Do you need a car park permit?
        Yes please, that would be helpful.
        I'll add that to the membership. Would you like to book a free trial session? Perhaps the fifteenth of next month?
        The fifteenth works well, thank you so much.
      `,
      questions: [
        { number: 1, type: 'listening_form_completion', prompt: "Caller's surname:", data: { word_limit: 1 }, answer: { answer: 'Hargreaves' } },
        { number: 2, type: 'listening_form_completion', prompt: 'Mobile number: 07881 ____', data: { word_limit: 1 }, answer: { answer: '334652' } },
        { number: 3, type: 'listening_form_completion', prompt: 'Membership type requested: ____ membership', data: { word_limit: 1 }, answer: { answer: 'family' } },
        { number: 4, type: 'listening_form_completion', prompt: 'Monthly fee: £____', data: { word_limit: 1 }, answer: { answer: '48' } },
        { number: 5, type: 'listening_form_completion', prompt: 'Main activity interested in:', data: { word_limit: 1 }, answer: { answer: 'swimming' } },
        { number: 6, type: 'listening_form_completion', prompt: 'Preferred session day:', data: { word_limit: 1 }, answer: { answer: 'Wednesday' } },
        { number: 7, type: 'listening_form_completion', prompt: 'Session start time: ____ a.m.', data: { word_limit: 1 }, answer: { answer: 'seven' } },
        { number: 8, type: 'listening_form_completion', prompt: 'Locker number assigned:', data: { word_limit: 1 }, answer: { answer: '214' } },
        { number: 9, type: 'listening_form_completion', prompt: 'Car park permit needed:', data: { word_limit: 1 }, answer: { answer: 'yes' } },
        { number: 10, type: 'listening_form_completion', prompt: 'Trial session booked for: ____ of next month', data: { word_limit: 1 }, answer: { answer: 'fifteenth' } }
      ]
    },
    {
      title: 'Part 2: Guided walk around Merton Old Town',
      instructions: 'Questions 11–20. Choose the correct letter A, B or C for questions 11–15. For questions 16–20, label the map.',
      audio_path: '/uploads/audio/mock-test-2-part-2.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 2 <span>Questions 11–20</span></h2>
          <h3>Guided Walk — Merton Old Town</h3>
          <p><strong>Questions 11–15:</strong> Choose the correct letter, A, B or C.</p>
          <p><strong>Questions 16–20:</strong> Label the map of Merton Old Town below.</p>
          <p>Write the correct letter, A–G, next to questions 16–20.</p>
        </div>
      `,
      tts_script: `
        Welcome everyone to the Merton Old Town walking tour. My name is James and I'll be your guide today.
        Our walk will last approximately ninety minutes and covers just under two kilometres.
        The town was originally founded in the twelfth century as a market settlement.
        The oldest surviving building, dating from 1287, is the Merchant's Hall on Bridge Street.
        Photography is welcome throughout the tour. We only ask that you avoid using flash inside the chapel.
        At the end of the walk, each of you will receive a printed map of the town to take home.
        Our first stop is the old town gate, which you can see directly ahead. It was completely restored in 1998 using original stone.
        To the left of the gate is the former customs house, now used as an art gallery.
        Moving along, the building with the red door is the old post office, which operated until 1972.
        Opposite the post office is the town museum — well worth a visit after our tour.
        The café at the end of the lane was once a coaching inn in the eighteenth century.
      `,
      questions: [
        { number: 11, type: 'listening_mcq_single', prompt: 'How long does the walking tour last?', data: { options: ['sixty minutes', 'ninety minutes', 'two hours'] }, answer: { answer: 'B' } },
        { number: 12, type: 'listening_mcq_single', prompt: 'When was Merton Old Town originally founded?', data: { options: ['in the tenth century', 'in the eleventh century', 'in the twelfth century'] }, answer: { answer: 'C' } },
        { number: 13, type: 'listening_mcq_single', prompt: 'What are visitors asked NOT to do inside the chapel?', data: { options: ['use flash photography', 'make phone calls', 'touch the exhibits'] }, answer: { answer: 'A' } },
        { number: 14, type: 'listening_mcq_single', prompt: 'What do visitors receive at the end of the tour?', data: { options: ['a free guidebook', 'a printed map', 'a discount voucher'] }, answer: { answer: 'B' } },
        { number: 15, type: 'listening_mcq_single', prompt: 'When was the old town gate restored?', data: { options: ['in 1978', 'in 1988', 'in 1998'] }, answer: { answer: 'C' } },
        { number: 16, type: 'listening_matching', prompt: 'former customs house', data: { options: [{ id: 'A', text: 'art gallery' }, { id: 'B', text: 'old post office' }, { id: 'C', text: 'town museum' }, { id: 'D', text: 'coaching inn / café' }, { id: 'E', text: 'old town gate' }, { id: 'F', text: "Merchant's Hall" }, { id: 'G', text: 'customs house' }] }, answer: { answer: 'A' } },
        { number: 17, type: 'listening_matching', prompt: 'old post office (closed 1972)', data: { options: [{ id: 'A', text: 'art gallery' }, { id: 'B', text: 'old post office' }, { id: 'C', text: 'town museum' }, { id: 'D', text: 'coaching inn / café' }, { id: 'E', text: 'old town gate' }, { id: 'F', text: "Merchant's Hall" }, { id: 'G', text: 'customs house' }] }, answer: { answer: 'B' } },
        { number: 18, type: 'listening_matching', prompt: 'town museum', data: { options: [{ id: 'A', text: 'art gallery' }, { id: 'B', text: 'old post office' }, { id: 'C', text: 'town museum' }, { id: 'D', text: 'coaching inn / café' }, { id: 'E', text: 'old town gate' }, { id: 'F', text: "Merchant's Hall" }, { id: 'G', text: 'customs house' }] }, answer: { answer: 'C' } },
        { number: 19, type: 'listening_matching', prompt: 'former eighteenth-century coaching inn', data: { options: [{ id: 'A', text: 'art gallery' }, { id: 'B', text: 'old post office' }, { id: 'C', text: 'town museum' }, { id: 'D', text: 'coaching inn / café' }, { id: 'E', text: 'old town gate' }, { id: 'F', text: "Merchant's Hall" }, { id: 'G', text: 'customs house' }] }, answer: { answer: 'D' } },
        { number: 20, type: 'listening_matching', prompt: "Oldest surviving building (Merchant's Hall, 1287)", data: { options: [{ id: 'A', text: 'art gallery' }, { id: 'B', text: 'old post office' }, { id: 'C', text: 'town museum' }, { id: 'D', text: 'coaching inn / café' }, { id: 'E', text: 'old town gate' }, { id: 'F', text: "Merchant's Hall" }, { id: 'G', text: 'customs house' }] }, answer: { answer: 'F' } }
      ]
    },
    {
      title: 'Part 3: Urban planning seminar discussion',
      instructions: 'Questions 21–30. Choose the correct letter or complete the sentences.',
      audio_path: '/uploads/audio/mock-test-2-part-3.mp3',
      body: `
        <div class="ielts-sheet">
          <h2>PART 3 <span>Questions 21–30</span></h2>
          <h3>Seminar: Challenges of Urban Growth</h3>
          <p><strong>Questions 21–24:</strong> Choose TWO letters for questions 21–22 and 23–24.</p>
          <p><strong>Questions 25–30:</strong> Complete the sentences below. Write ONE WORD ONLY.</p>
        </div>
      `,
      tts_script: `
        So for today's seminar, Priya and Marcus, you've both been looking at urban growth challenges. What were the two biggest obstacles you identified in the literature?
        Well, for me it was definitely the lack of affordable housing and inadequate public transport. Those two came up again and again.
        I'd agree about housing, but I also found that waste management was equally significant — especially in rapidly expanding cities.
        Right. And which aspects of urban renewal did you both find most promising?
        Personally I found green corridor projects really exciting — the idea of linking parks and green spaces through a city.
        For me it was community land trusts. They allow residents to retain ownership of land even as areas gentrify.
        Interesting. Now, regarding your case study of the Riverside district — what did you find about density?
        The key finding was that compact neighbourhoods significantly reduce car dependency.
        And the relationship between green space and mental wellbeing was striking — residents in areas with more parks reported lower levels of anxiety.
        The planners also found that mixed-use zoning was essential — combining residential and commercial in the same area.
        One surprising result was that noise levels actually fell when traffic was redirected through the new ring road.
        And finally, the study showed that community consultation improved satisfaction among residents considerably.
      `,
      questions: [
        { number: 21, type: 'listening_mcq_multi', prompt: 'Which TWO obstacles in urban growth did Priya identify?', data: { options: ['lack of affordable housing', 'inadequate public transport', 'waste management', 'air pollution', 'lack of green space'], choose: 2, display_numbers: '21-22' }, answer: { answer: ['A', 'B'] }, points: 2 },
        { number: 22, type: 'listening_mcq_multi', prompt: 'Question 22 shares the answer with Question 21.', data: { options: [], choose: 0, linked_to: 21 }, answer: { ignore: true }, points: 0 },
        { number: 23, type: 'listening_mcq_multi', prompt: 'Which TWO urban renewal approaches did the students find most promising?', data: { options: ['green corridor projects', 'community land trusts', 'high-rise construction', 'road expansion', 'industrial rezoning'], choose: 2, display_numbers: '23-24' }, answer: { answer: ['A', 'B'] }, points: 2 },
        { number: 24, type: 'listening_mcq_multi', prompt: 'Question 24 shares the answer with Question 23.', data: { options: [], choose: 0, linked_to: 23 }, answer: { ignore: true }, points: 0 },
        { number: 25, type: 'listening_sentence_completion', prompt: 'Compact neighbourhoods significantly reduce car ____', data: { word_limit: 1 }, answer: { answer: 'dependency' } },
        { number: 26, type: 'listening_sentence_completion', prompt: 'Residents in areas with more parks reported lower levels of ____', data: { word_limit: 1 }, answer: { answer: 'anxiety' } },
        { number: 27, type: 'listening_sentence_completion', prompt: 'Planners found that mixed-use ____ was essential.', data: { word_limit: 1 }, answer: { answer: 'zoning' } },
        { number: 28, type: 'listening_sentence_completion', prompt: 'Noise levels fell when traffic was redirected through the new ring ____', data: { word_limit: 1 }, answer: { answer: 'road' } },
        { number: 29, type: 'listening_sentence_completion', prompt: 'Community ____ improved satisfaction among residents.', data: { word_limit: 1 }, answer: { answer: 'consultation' } },
        { number: 30, type: 'listening_sentence_completion', prompt: 'Green corridor projects link parks and green ____ through a city.', data: { word_limit: 1 }, answer: { answer: 'spaces' } }
      ]
    },
    {
      title: 'Part 4: Academic lecture on bird migration',
      instructions: 'Questions 31–40. Complete the notes below. Write ONE WORD ONLY for each answer.',
      audio_path: '/uploads/audio/mock-test-2-part-4.mp3',
      body: `
        <div class="ielts-sheet ielts-sheet--notes">
          <h2>PART 4 <span>Questions 31–40</span></h2>
          <p>Complete the notes below.</p>
          <p><strong>Write ONE WORD ONLY for each answer.</strong></p>
          <div class="note-box">
            <h3>Bird Migration — Key Mechanisms</h3>
            <p><strong>Navigation methods</strong></p>
            <ul>
              <li>Birds use the position of the <span class="sheet-gap"><span class="gap-number">31</span></span> to navigate during the day</li>
              <li>At night, they rely on <span class="sheet-gap"><span class="gap-number">32</span></span> patterns</li>
              <li>Some species detect the Earth's <span class="sheet-gap"><span class="gap-number">33</span></span> field</li>
            </ul>
            <p><strong>Physiological changes before migration</strong></p>
            <ul>
              <li>Birds build up fat as a form of <span class="sheet-gap"><span class="gap-number">34</span></span></li>
              <li>The liver increases in <span class="sheet-gap"><span class="gap-number">35</span></span> to process extra fuel</li>
              <li>Certain organs temporarily <span class="sheet-gap"><span class="gap-number">36</span></span> in size to reduce weight</li>
            </ul>
            <p><strong>Threats to migration</strong></p>
            <ul>
              <li>Light <span class="sheet-gap"><span class="gap-number">37</span></span> disorients nocturnal migrants</li>
              <li>Changes in <span class="sheet-gap"><span class="gap-number">38</span></span> affect the timing of food sources</li>
              <li>New <span class="sheet-gap"><span class="gap-number">39</span></span> along migration routes reduce resting sites</li>
              <li>Collisions with <span class="sheet-gap"><span class="gap-number">40</span></span> cause significant mortality</li>
            </ul>
          </div>
        </div>
      `,
      tts_script: `
        Good morning. Today's lecture focuses on the extraordinary phenomenon of bird migration — specifically the mechanisms that allow birds to navigate thousands of kilometres with remarkable precision.
        First, let's consider how birds navigate. During daylight hours, many species orient themselves using the position of the sun. This requires an internal biological clock to compensate for the sun's movement across the sky.
        At night, birds that migrate after dark — and many do — rely instead on star patterns. Research has shown that birds learn the night sky shortly after hatching and use it as a celestial compass throughout their lives.
        Perhaps most remarkably, certain species, including the European robin, appear able to detect the Earth's magnetic field. Specialised proteins in the eye allow them to literally see magnetism as a visual overlay.
        Before migration begins, birds undergo significant physiological changes. They accumulate fat at a rapid rate, building up stores that serve as their primary fuel source for long journeys.
        The liver also increases in size to process this extra fuel efficiently. Interestingly, organs that are not needed during flight — including parts of the digestive system — temporarily shrink to reduce the bird's overall weight.
        Migration faces growing threats. Light pollution in cities disorients birds that navigate by stars, causing them to circle illuminated buildings until they collapse from exhaustion.
        Climate change is altering the timing of seasonal food sources, meaning that birds may arrive at staging posts before insects have hatched or berries have ripened.
        The expansion of buildings along traditional migration routes has eliminated many resting and feeding sites that birds depend on mid-journey.
        Finally, collisions with structures such as glass windows and wind turbines cause significant mortality among migratory species each year. Conservation efforts increasingly focus on these preventable deaths.
      `,
      questions: [
        { number: 31, type: 'listening_note_completion', prompt: 'Birds use the position of the ____ to navigate during the day', data: { word_limit: 1 }, answer: { answer: 'sun' } },
        { number: 32, type: 'listening_note_completion', prompt: 'At night, they rely on ____ patterns', data: { word_limit: 1 }, answer: { answer: 'star' } },
        { number: 33, type: 'listening_note_completion', prompt: "Some species detect the Earth's ____ field", data: { word_limit: 1 }, answer: { answer: 'magnetic' } },
        { number: 34, type: 'listening_note_completion', prompt: 'Birds build up fat as a form of ____', data: { word_limit: 1 }, answer: { answer: 'fuel' } },
        { number: 35, type: 'listening_note_completion', prompt: 'The liver increases in ____ to process extra fuel', data: { word_limit: 1 }, answer: { answer: 'size' } },
        { number: 36, type: 'listening_note_completion', prompt: 'Certain organs temporarily ____ in size to reduce weight', data: { word_limit: 1 }, answer: { answer: 'shrink' } },
        { number: 37, type: 'listening_note_completion', prompt: 'Light ____ disorients nocturnal migrants', data: { word_limit: 1 }, answer: { answer: 'pollution' } },
        { number: 38, type: 'listening_note_completion', prompt: 'Changes in ____ affect the timing of food sources', data: { word_limit: 1 }, answer: { answer: 'climate' } },
        { number: 39, type: 'listening_note_completion', prompt: 'New ____ along migration routes reduce resting sites', data: { word_limit: 1 }, answer: { answer: 'buildings' } },
        { number: 40, type: 'listening_note_completion', prompt: 'Collisions with ____ cause significant mortality', data: { word_limit: 1 }, answer: { answer: 'structures' } }
      ]
    }
  ]
}
