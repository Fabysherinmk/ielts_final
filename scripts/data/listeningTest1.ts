export const listeningTest1 = {
  title: 'Cambridge-style IELTS Academic Listening — Mock Test 1',
  skill: 'listening',
  description: 'Four listening parts modelled on Cambridge IELTS 20 Test 4. 40 questions. ~30 minutes of audio + 10 min transfer.',
  duration_min: 40,
  extra: {
    modes: ['practice', 'test'],
    test_mode_audio: 'tts',
    practice_mode_audio: 'tts'
  },
  sections: [
    {
      title: 'Part 1: Accommodation enquiry',
      instructions: 'Complete the form below. Write ONE WORD AND/OR A NUMBER for each answer.',
      audio_path: '/uploads/audio/mock-test-1-part-1.mp3',
      body: `<strong>Transcript will appear on results page.</strong>
<p>A prospective tenant calls a letting agent about a furnished flat.</p>`,
      tts_script: `
        Hello, Riverside Lettings. How can I help you?
        Hi, I saw an ad for a flat on Oak Street. I'd like to ask a few questions about it.
        Sure, I can help you with that. Can I take your name first?
        Yes, it's Samuel Ngata. That's N-G-A-T-A.
        Thank you, Samuel. And what is your contact phone number?
        It's 0207 448291.
        Got it. Now, about the flat on Oak Street. What would you like to know?
        First, could you confirm the monthly rent?
        Yes, the rent is one thousand two hundred and fifty pounds per month.
        And what about the deposit?
        The landlord requires a deposit of six weeks rent.
        Okay, that's fine. What is the earliest move-in date?
        The flat is available from the fourteenth of May.
        Great. How is the public transport around there?
        It's very convenient. The nearest underground station is Finsbury, which is just a five-minute walk away.
        Excellent. And which floor is the flat on?
        It is on the third floor of the building.
        Does the rent include any utilities?
        Yes, water and internet are included with the rent. You only pay for electricity.
        That's perfect. I have a young child, so is there a school nearby?
        Yes, the nearest primary school is Beechwood School, which has a very good reputation.
        Briefly, what is the minimum lease length?
        The landlord is looking for a twelve months minimum lease.
        That suits us perfectly. Can we arrange a viewing?
      `,
      questions: [
        { number: 1, type: 'listening_form_completion', prompt: "Caller's name: Samuel ____", data: { word_limit: 3 }, answer: { answer: ['Ngata', 'Ngata.'] } },
        { number: 2, type: 'listening_form_completion', prompt: 'Phone number: 0207 ____', data: { word_limit: 3 }, answer: { answer: '448291' } },
        { number: 3, type: 'listening_form_completion', prompt: 'Monthly rent: £____', data: { word_limit: 3 }, answer: { answer: ['1250', '1,250'] } },
        { number: 4, type: 'listening_form_completion', prompt: 'Deposit required: ____ weeks', data: { word_limit: 3 }, answer: { answer: '6' } },
        { number: 5, type: 'listening_form_completion', prompt: 'Earliest move-in date: ____ May', data: { word_limit: 3 }, answer: { answer: '14' } },
        { number: 6, type: 'listening_form_completion', prompt: 'Nearest underground station: ____', data: { word_limit: 3 }, answer: { answer: 'Finsbury' } },
        { number: 7, type: 'listening_form_completion', prompt: 'Floor number: ____', data: { word_limit: 3 }, answer: { answer: '3rd' } },
        { number: 8, type: 'listening_form_completion', prompt: 'Included with rent: water and ____', data: { word_limit: 3 }, answer: { answer: 'internet' } },
        { number: 9, type: 'listening_form_completion', prompt: 'Nearest primary school: ____ School', data: { word_limit: 3 }, answer: { answer: 'Beechwood' } },
        { number: 10, type: 'listening_form_completion', prompt: 'Lease length: ____ months minimum', data: { word_limit: 3 }, answer: { answer: '12' } }
      ]
    },
    {
      title: 'Part 2: Riverside Industrial Museum tour',
      instructions: 'Questions 11-15: Choose the correct letter, A, B or C. Questions 16-20: Label the plan of the museum.',
      audio_path: '/uploads/audio/mock-test-1-part-2.mp3',
      body: `<p>A guide addresses visitors at the start of a tour of an industrial heritage museum.</p>`,
      tts_script: `
        Welcome to Riverside Industrial Museum. My name is Sarah, and I will be your guide today. Before we begin our tour, let me give you some background information about the museum itself. The building we are standing in today was originally built in the nineteenth century. While many people think it was a textile mill or a shipbuilding yard because of the nearby river, it was actually constructed as a grain warehouse, storing wheat transported along the canal.
        During your visit today, there is a lot to see. But if you are short on time, you should definitely not miss our star attraction, the eighteen fifties steam engine. It is fully restored and in pristine working order. We also have an audio-visual exhibit and a children's play area, but the steam engine is truly unique.
        After the tour, you might want to stop by our museum cafe. Today, they are running a special offer where you get a free bowl of soup with a sandwich. It's a great deal! Just a quick word on rules: photography is allowed without flash throughout the museum. Please do not use flash as it can damage the historical documents on display. Finally, at the end of the tour, as you exit, everyone will receive a discount voucher for the shop, where you can buy books, souvenirs, and local crafts.
        Now, let me draw your attention to the map of the museum layout. As you can see, we are starting here at the entrance. Directly to your right is the ticket office, which is also the audio guide pick-up point. If you continue straight ahead, you will find the main gallery, and to the left is the temporary exhibition hall, which is currently hosting the children's discovery zone. If you go through the main gallery, you will enter the engine hall, where the steam engine demonstration takes place. Through the back door of the engine hall, you will find the outdoor yard, which serves as the vintage tram ride meeting point. And if you need a rest, the museum cafe is located at the far end of the building, where you will also meet the guide for the Q&A session at the end.
      `,
      questions: [
        { number: 11, type: 'listening_mcq_single', prompt: 'The museum was originally built as a:', data: { options: ['textile mill', 'grain warehouse', 'shipbuilding yard'] }, answer: { answer: 'B' } },
        { number: 12, type: 'listening_mcq_single', prompt: 'Visitors should NOT miss:', data: { options: ['the 1850s steam engine', 'the audio-visual exhibit', 'the children\'s play area'] }, answer: { answer: 'A' } },
        { number: 13, type: 'listening_mcq_single', prompt: 'The cafe is currently offering free:', data: { options: ['coffee refills', 'cake with every meal', 'soup with a sandwich'] }, answer: { answer: 'C' } },
        { number: 14, type: 'listening_mcq_single', prompt: 'Photography is:', data: { options: ['prohibited entirely', 'allowed without flash', 'allowed only on the ground floor'] }, answer: { answer: 'B' } },
        { number: 15, type: 'listening_mcq_single', prompt: 'At the end of the tour visitors will receive a:', data: { options: ['free poster', 'discount voucher for the shop', 'printed map'] }, answer: { answer: 'B' } },
        { number: 16, type: 'listening_matching', prompt: 'Audio guide pick-up point', data: { options: [{ id: 'A', text: 'Ticket office' }, { id: 'B', text: 'Main gallery' }, { id: 'C', text: 'Engine hall' }, { id: 'D', text: 'Cafe' }, { id: 'E', text: 'Gift shop' }, { id: 'F', text: 'Temporary exhibition' }, { id: 'G', text: 'Outdoor yard' }] }, answer: { answer: 'A' } },
        { number: 17, type: 'listening_matching', prompt: 'Children\'s discovery zone', data: { options: [{ id: 'A', text: 'Ticket office' }, { id: 'B', text: 'Main gallery' }, { id: 'C', text: 'Engine hall' }, { id: 'D', text: 'Cafe' }, { id: 'E', text: 'Gift shop' }, { id: 'F', text: 'Temporary exhibition' }, { id: 'G', text: 'Outdoor yard' }] }, answer: { answer: 'F' } },
        { number: 18, type: 'listening_matching', prompt: 'Steam engine demonstration', data: { options: [{ id: 'A', text: 'Ticket office' }, { id: 'B', text: 'Main gallery' }, { id: 'C', text: 'Engine hall' }, { id: 'D', text: 'Cafe' }, { id: 'E', text: 'Gift shop' }, { id: 'F', text: 'Temporary exhibition' }, { id: 'G', text: 'Outdoor yard' }] }, answer: { answer: 'C' } },
        { number: 19, type: 'listening_matching', prompt: 'Vintage tram ride meeting point', data: { options: [{ id: 'A', text: 'Ticket office' }, { id: 'B', text: 'Main gallery' }, { id: 'C', text: 'Engine hall' }, { id: 'D', text: 'Cafe' }, { id: 'E', text: 'Gift shop' }, { id: 'F', text: 'Temporary exhibition' }, { id: 'G', text: 'Outdoor yard' }] }, answer: { answer: 'G' } },
        { number: 20, type: 'listening_matching', prompt: 'Meet the guide for the Q&amp;A session', data: { options: [{ id: 'A', text: 'Ticket office' }, { id: 'B', text: 'Main gallery' }, { id: 'C', text: 'Engine hall' }, { id: 'D', text: 'Cafe' }, { id: 'E', text: 'Gift shop' }, { id: 'F', text: 'Temporary exhibition' }, { id: 'G', text: 'Outdoor yard' }] }, answer: { answer: 'D' } }
      ]
    },
    {
      title: 'Part 3: Research methods seminar',
      instructions: 'Questions 21-22 choose TWO letters. Questions 23-26 match. Questions 27-30 complete sentences.',
      audio_path: '/uploads/audio/mock-test-1-part-3.mp3',
      body: `<p>Two postgraduate students, Sian and Diego, discuss their research methods tutor's feedback with a supervisor.</p>`,
      tts_script: `
        Supervisor: Sian, Diego, welcome. Let's discuss your research methods seminar presentation and how your project design is going. What are the main issues you are facing right now?
        Sian: Well, we've realized that our current research design has a couple of big hurdles. First of all, the sample size is too small. We only have three participants lined up, which won't give us reliable data.
        Diego: Yes, and on top of that, we looked at our schedule and the timeline is unrealistic. We only have two weeks left, and there's no way we can complete all the planned work in that time.
        Supervisor: I see. Well, let's look at your specific research questions. For Research question 1, I think it should be reworded to be more precise.
        Sian: That makes sense. What about Research question 2?
        Supervisor: Research question 2 is unclear to participants. They might not understand what you are asking.
        Diego: Okay, we will clarify it. How about Research question 3?
        Supervisor: Research question 3 is excellent. It matches the literature well and shows a deep understanding of previous studies.
        Sian: And Research question 4?
        Supervisor: I'm afraid Research question 4 is too ambitious for a short postgraduate study. You should focus on something narrower.
        Diego: That's very helpful advice.
        Supervisor: So, what are your next steps to fix these issues?
        Sian: We plan to reduce the number of interviews to twelve. That should make the timeline much more manageable.
        Diego: And I will redesign the pilot survey by Friday so we can start testing it next week.
        Sian: I've also agreed to analyse the data using NVivo software. I've used it before, so it should speed things up.
        Supervisor: Excellent. To help you get started, I will send the revised consent form today so you can get ethics approval squared away.
        Diego: Thank you so much!
      `,
      questions: [
        { number: 21, type: 'listening_mcq_multi', prompt: 'Which TWO difficulties do Sian and Diego mention about their current research design?', data: { options: ['The sample size is too small.', 'The interview questions are too open.', 'They cannot access the target demographic.', 'The timeline is unrealistic.', 'Their ethics approval has expired.'], choose: 2, display_numbers: '21-22' }, answer: { answer: ['A', 'D'] }, points: 2 },
        { number: 22, type: 'listening_mcq_multi', prompt: 'Question 22 shares the answer with Question 21.', data: { options: [], choose: 0, linked_to: 21 }, answer: { ignore: true }, points: 0 },
        { number: 23, type: 'listening_matching', prompt: 'Research question 1', data: { options: [{ id: 'A', text: 'should be reworded' }, { id: 'B', text: 'is too ambitious' }, { id: 'C', text: 'matches the literature well' }, { id: 'D', text: 'needs more pilot data' }, { id: 'E', text: 'is unclear to participants' }, { id: 'F', text: 'could be shortened' }] }, answer: { answer: 'A' } },
        { number: 24, type: 'listening_matching', prompt: 'Research question 2', data: { options: [{ id: 'A', text: 'should be reworded' }, { id: 'B', text: 'is too ambitious' }, { id: 'C', text: 'matches the literature well' }, { id: 'D', text: 'needs more pilot data' }, { id: 'E', text: 'is unclear to participants' }, { id: 'F', text: 'could be shortened' }] }, answer: { answer: 'E' } },
        { number: 25, type: 'listening_matching', prompt: 'Research question 3', data: { options: [{ id: 'A', text: 'should be reworded' }, { id: 'B', text: 'is too ambitious' }, { id: 'C', text: 'matches the literature well' }, { id: 'D', text: 'needs more pilot data' }, { id: 'E', text: 'is unclear to participants' }, { id: 'F', text: 'could be shortened' }] }, answer: { answer: 'C' } },
        { number: 26, type: 'listening_matching', prompt: 'Research question 4', data: { options: [{ id: 'A', text: 'should be reworded' }, { id: 'B', text: 'is too ambitious' }, { id: 'C', text: 'matches the literature well' }, { id: 'D', text: 'needs more pilot data' }, { id: 'E', text: 'is unclear to participants' }, { id: 'F', text: 'could be shortened' }] }, answer: { answer: 'B' } },
        { number: 27, type: 'listening_sentence_completion', prompt: 'They plan to reduce the number of interviews to ____.', data: { word_limit: 2 }, answer: { answer: 'twelve' } },
        { number: 28, type: 'listening_sentence_completion', prompt: 'Diego will redesign the ____ survey by Friday.', data: { word_limit: 2 }, answer: { answer: 'pilot' } },
        { number: 29, type: 'listening_sentence_completion', prompt: 'Sian agreed to analyse the data using ____ software.', data: { word_limit: 2 }, answer: { answer: 'NVivo' } },
        { number: 30, type: 'listening_sentence_completion', prompt: 'The supervisor will send the revised ____ form today.', data: { word_limit: 2 }, answer: { answer: 'consent' } }
      ]
    },
    {
      title: 'Part 4: A brief history of coffee',
      instructions: 'Complete the notes. Write NO MORE THAN TWO WORDS for each answer.',
      audio_path: '/uploads/audio/mock-test-1-part-4.mp3',
      body: `<p>A lecturer delivers an introductory lecture on the global history of coffee.</p>`,
      tts_script: `
        Good morning everyone. Today we're going to talk about coffee, one of the most widely consumed beverages in the world, and explore its rich history and future challenges.
        Coffee is thought to have originated in the Ethiopian region of Africa, where legend has it that a goat herder named Kaldi first noticed his goats becoming unusually energetic after eating berries from a certain shrub. From Ethiopia, coffee cultivation spread to the Arabian Peninsula. By the fifteenth century, coffee was being grown in Yemen. It became especially popular among Sufis, who used coffee to stay alert during their long nightly prayers.
        As trade expanded, coffee made its way to Europe. The first European coffee houses appeared in Venice in the mid-seventeenth century, and the drink quickly caught on. In seventeenth-century England, coffee houses became vibrant centers of social, political, and intellectual life. Because anyone could enter for the price of a penny and engage in deep debates with scholars and merchants, these establishments were nicknamed "penny universities".
        During the colonial era, European powers spread coffee cultivation across the globe. Coffee arrived in Brazil in the year 1727, smuggled in by a Portuguese diplomat. This marked a turning point in coffee history. Today, Brazil is the world's largest producer, growing roughly one-third of the world's coffee supply.
        Over the last century, coffee consumption has evolved through three distinct phases, often called "waves". The first wave, starting in the late nineteenth century, focused on convenience and instant coffee, making the beverage a staple in every household. The second wave saw the rise of specialty espresso drinks and chain coffee shops. Today, we are in the third wave, which emphasises direct relationships with farmers, highlighting the specific origins, roasting techniques, and flavor profiles of the beans.
        However, the future of coffee is under threat. Scientific models show that climate change threatens about fifty percent of current coffee-growing land, which could lead to severe shortages. To combat this, researchers are looking for hardier coffee species. A promising alternative crop currently being studied is Liberica coffee, which grows well in warmer climates and is much more resistant to pests than the common Arabica bean.
      `,
      questions: [
        { number: 31, type: 'listening_note_completion', prompt: 'Coffee is thought to have originated in the ____ region.', data: { word_limit: 2 }, answer: { answer: 'Ethiopian' } },
        { number: 32, type: 'listening_note_completion', prompt: 'The Sufis used coffee to stay alert during ____.', data: { word_limit: 2 }, answer: { answer: 'prayers' } },
        { number: 33, type: 'listening_note_completion', prompt: 'The first European coffee houses appeared in ____.', data: { word_limit: 2 }, answer: { answer: 'Venice' } },
        { number: 34, type: 'listening_note_completion', prompt: 'In 17th-century England coffee houses were nicknamed "penny ____".', data: { word_limit: 2 }, answer: { answer: 'universities' } },
        { number: 35, type: 'listening_note_completion', prompt: 'Coffee arrived in Brazil in the year ____.', data: { word_limit: 2 }, answer: { answer: '1727' } },
        { number: 36, type: 'listening_note_completion', prompt: 'Today, Brazil produces roughly ____ of the world\'s coffee.', data: { word_limit: 2 }, answer: { answer: ['one-third', 'a third', '1/3'] } },
        { number: 37, type: 'listening_note_completion', prompt: 'The "first wave" focused on ____ and instant coffee.', data: { word_limit: 2 }, answer: { answer: 'convenience' } },
        { number: 38, type: 'listening_note_completion', prompt: 'The "third wave" emphasises direct ____ with farmers.', data: { word_limit: 2 }, answer: { answer: ['relationships', 'relationship'] } },
        { number: 39, type: 'listening_note_completion', prompt: 'Climate change threatens about ____% of current coffee-growing land.', data: { word_limit: 2 }, answer: { answer: ['50', 'fifty'] } },
        { number: 40, type: 'listening_note_completion', prompt: 'A promising alternative crop being studied is ____.', data: { word_limit: 2 }, answer: { answer: ['Liberica', 'liberica'] } }
      ]
    }
  ]
}
