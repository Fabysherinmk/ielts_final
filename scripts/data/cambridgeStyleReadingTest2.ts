export const cambridgeStyleReadingTest2 = {
  title: 'Cambridge-style IELTS Academic Reading - Mock Test 2',
  skill: 'reading',
  description: 'Three academic passages with a wider Cambridge-style question mix: completion, TFNG, headings, features, endings, MCQ and summary tasks.',
  duration_min: 60,
  sections: [
    {
      title: 'Reading Passage 1: Restoring the night sky',
      instructions: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
      body: `
<p><span class="para-label">A</span>For most of human history, the night sky was both a clock and a calendar. The rising of particular constellations helped farmers decide when to sow crops, while sailors used stars to steer across oceans. In many cities today, however, that shared reference point has almost disappeared. Artificial light scatters through the atmosphere and forms a pale dome over urban areas, a phenomenon usually called skyglow. Astronomers were the first group to campaign against it, but they are no longer the only ones concerned.</p>
<p><span class="para-label">B</span>Ecologists now argue that excessive night lighting changes the behaviour of many species. Migrating birds can become disoriented by brightly lit towers, hatchling turtles may crawl inland towards hotels instead of towards the moonlit sea, and insects are drawn away from feeding and breeding sites. In some regions, researchers have linked lighting near rivers with reduced activity among bats that normally hunt along the water. The problem is not simply the amount of light but also its colour: blue-rich white LEDs scatter widely and can interfere with circadian rhythms.</p>
<p><span class="para-label">C</span>Public safety is often cited as the reason for brighter streets, yet the evidence is more complicated than many people assume. A review by the University of Bristol found that well-designed lighting can reduce some types of night-time accidents, especially at complex junctions, but glare and uneven illumination may make pedestrians less visible. Lighting specialists therefore distinguish between more light and better light. Shielded lamps, lower mounting heights and warmer colour temperatures can improve visibility while reducing skyglow.</p>
<p><span class="para-label">D</span>Several towns have begun to treat darkness as a resource worth protecting. The island of Sark in the English Channel was named the world's first Dark Sky Island in 2011, while communities in New Zealand, Chile and the American Southwest have adopted ordinances limiting upward light. These rules rarely require a return to darkness everywhere. Instead, they ask businesses and households to place light only where it is needed, when it is needed, and at the lowest useful intensity.</p>
<p><span class="para-label">E</span>The economic case for reform is strong. Light directed into the sky does not make streets safer or shops more inviting; it is simply wasted energy. The International Dark-Sky Association estimates that poorly aimed outdoor lighting costs billions of dollars in electricity each year. Municipal retrofits can therefore pay for themselves surprisingly quickly, especially where old high-pressure sodium lamps are replaced by carefully controlled LEDs. The challenge is to avoid replacing one problem with another by installing lights that are efficient but too bright.</p>
<p><span class="para-label">F</span>Advocates stress that reducing light pollution is not a rejection of modern life. Rather, it is an argument for precision. A city can keep its hospitals, stations and major roads well lit while allowing parks, river corridors and residential streets to become darker after midnight. Some councils have introduced adaptive systems that dim automatically when sensors detect little movement. Early trials suggest that residents often accept dimming once they see that it is gradual and reversible.</p>
<p><span class="para-label">G</span>Perhaps the most unexpected benefit is cultural. Dark-sky tourism has grown rapidly, with visitors travelling to remote areas for meteor showers, astrophotography workshops and guided stargazing. For rural communities with few other industries, the night sky can become an economic asset. More importantly, campaigners argue, access to stars gives people a sense of scale that no screen can reproduce. The goal is not to turn every city into a wilderness, but to recover some part of a common inheritance.</p>`,
      questions: [
        { number: 1, type: 'reading_sentence_completion', prompt: 'For most of history, stars helped farmers decide when to ____ crops.', data: { word_limit: 1 }, answer: { answer: 'sow' } },
        { number: 2, type: 'reading_sentence_completion', prompt: 'Artificial light scattered in the atmosphere produces a pale dome called ____.', data: { word_limit: 1 }, answer: { answer: 'skyglow' } },
        { number: 3, type: 'reading_sentence_completion', prompt: 'Blue-rich white LEDs can interfere with human and animal ____ rhythms.', data: { word_limit: 2 }, answer: { answer: ['circadian', 'circadian rhythms'] } },
        { number: 4, type: 'reading_sentence_completion', prompt: 'Lighting specialists prefer better light rather than simply ____ light.', data: { word_limit: 1 }, answer: { answer: 'more' } },
        { number: 5, type: 'reading_sentence_completion', prompt: 'Some councils use adaptive systems that dim when ____ detect little movement.', data: { word_limit: 1 }, answer: { answer: 'sensors' } },
        { number: 6, type: 'reading_table_completion', prompt: 'Migrating birds may be disoriented by brightly lit ____.', data: { word_limit: 1 }, answer: { answer: 'towers' } },
        { number: 7, type: 'reading_table_completion', prompt: 'Hatchling turtles may crawl towards ____ instead of the sea.', data: { word_limit: 1 }, answer: { answer: 'hotels' } },
        { number: 8, type: 'reading_table_completion', prompt: 'Bats near ____ may show reduced activity.', data: { word_limit: 1 }, answer: { answer: 'rivers' } },
        { number: 9, type: 'reading_table_completion', prompt: 'The island of ____ was named the first Dark Sky Island.', data: { word_limit: 1 }, answer: { answer: 'Sark' } },
        { number: 10, type: 'reading_table_completion', prompt: 'Dark-sky tourism includes guided ____ sessions.', data: { word_limit: 1 }, answer: { answer: 'stargazing' } },
        { number: 11, type: 'reading_tfng', prompt: 'Astronomers were the first people to raise concerns about skyglow.', data: null, answer: { answer: 'TRUE' } },
        { number: 12, type: 'reading_tfng', prompt: 'The passage says brighter street lighting always reduces crime.', data: null, answer: { answer: 'NOT GIVEN' } },
        { number: 13, type: 'reading_tfng', prompt: 'Dark-sky rules normally require towns to remove all outdoor lighting.', data: null, answer: { answer: 'FALSE' } }
      ]
    },
    {
      title: 'Reading Passage 2: Why play matters in learning',
      instructions: 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.',
      body: `
<p><span class="para-label">A</span>Adults often treat children's play as a break from learning, but developmental psychologists increasingly see it as one of the main ways learning happens. When children build towers, negotiate imaginary rules or chase one another across uneven ground, they are testing predictions about objects, bodies and other people. The learning is rarely tidy, but it is rich in feedback.</p>
<p><span class="para-label">B</span>Physical play develops more than muscles. Climbing, balancing and jumping help children calibrate distance, speed and risk. Studies in Scandinavian preschool settings have found that children who regularly experience manageable physical challenges tend to become better at judging what they can safely attempt. Educators there often distinguish danger, which should be removed, from risk, which can be assessed and learned from.</p>
<p><span class="para-label">C</span>Constructive play, such as block building, appears to support spatial thinking. Research led by Professor Nora Kim at Eastbridge University found that four-year-olds who frequently built complex structures performed better on mental rotation tasks two years later. The link remained even after the researchers controlled for vocabulary and parental education. Kim argues that the effect comes from repeatedly translating between a plan, a physical object and a mental image.</p>
<p><span class="para-label">D</span>Pretend play has attracted more debate. Some researchers claim it directly improves empathy because children practise taking another person's perspective. Others, including Dr Peter Valdes, argue that the relationship is indirect: children who already have stronger language and social skills may simply be more likely to enjoy elaborate pretend games. Even sceptics accept that pretend play gives adults a valuable window into children's concerns and interpretations of daily life.</p>
<p><span class="para-label">E</span>Play is also shaped by culture. In some communities, children are expected to join adult work early and learn through observation rather than through separate play materials. Anthropologist Lena Ortiz has documented Mayan children turning household tasks into playful contests without adults labelling the activity as play. This challenges the assumption that educational toys are universal requirements for healthy development.</p>
<p><span class="para-label">F</span>Digital play complicates the picture further. Well-designed puzzle games can encourage planning and persistence, but many apps marketed as educational offer little more than rapid rewards for tapping the screen. Dr Samuel Greer recommends that parents judge digital play by the kind of thinking it asks for: Does the child make choices, test ideas and recover from mistakes, or merely follow prompts?</p>
<p><span class="para-label">G</span>For schools, the policy implications are practical. Removing play to make more time for formal instruction may backfire, especially for younger children. Short periods of child-led activity can improve attention and cooperation afterwards. The most effective settings, however, do not leave everything to chance. Teachers observe play, extend vocabulary, introduce new materials and help children reflect on what happened. In that sense, play is not the opposite of teaching; it is one of teaching's most flexible tools.</p>`,
      questions: [
        { number: 14, type: 'reading_matching_headings', prompt: 'Paragraph A', data: { headings: [
          { id: 'i', text: 'Learning hidden inside ordinary activity' },
          { id: 'ii', text: 'The social limits of pretend games' },
          { id: 'iii', text: 'Managing risk through movement' },
          { id: 'iv', text: 'Digital games and quality of thought' },
          { id: 'v', text: 'Cultural differences in play' },
          { id: 'vi', text: 'Play as a teaching tool' },
          { id: 'vii', text: 'Spatial gains from building' }
        ] }, answer: { answer: 'i' } },
        { number: 15, type: 'reading_matching_headings', prompt: 'Paragraph B', data: { headings: [
          { id: 'i', text: 'Learning hidden inside ordinary activity' },
          { id: 'ii', text: 'The social limits of pretend games' },
          { id: 'iii', text: 'Managing risk through movement' },
          { id: 'iv', text: 'Digital games and quality of thought' },
          { id: 'v', text: 'Cultural differences in play' },
          { id: 'vi', text: 'Play as a teaching tool' },
          { id: 'vii', text: 'Spatial gains from building' }
        ] }, answer: { answer: 'iii' } },
        { number: 16, type: 'reading_matching_headings', prompt: 'Paragraph C', data: { headings: [
          { id: 'i', text: 'Learning hidden inside ordinary activity' },
          { id: 'ii', text: 'The social limits of pretend games' },
          { id: 'iii', text: 'Managing risk through movement' },
          { id: 'iv', text: 'Digital games and quality of thought' },
          { id: 'v', text: 'Cultural differences in play' },
          { id: 'vi', text: 'Play as a teaching tool' },
          { id: 'vii', text: 'Spatial gains from building' }
        ] }, answer: { answer: 'vii' } },
        { number: 17, type: 'reading_matching_headings', prompt: 'Paragraph D', data: { headings: [
          { id: 'i', text: 'Learning hidden inside ordinary activity' },
          { id: 'ii', text: 'The social limits of pretend games' },
          { id: 'iii', text: 'Managing risk through movement' },
          { id: 'iv', text: 'Digital games and quality of thought' },
          { id: 'v', text: 'Cultural differences in play' },
          { id: 'vi', text: 'Play as a teaching tool' },
          { id: 'vii', text: 'Spatial gains from building' }
        ] }, answer: { answer: 'ii' } },
        { number: 18, type: 'reading_matching_headings', prompt: 'Paragraph E', data: { headings: [
          { id: 'i', text: 'Learning hidden inside ordinary activity' },
          { id: 'ii', text: 'The social limits of pretend games' },
          { id: 'iii', text: 'Managing risk through movement' },
          { id: 'iv', text: 'Digital games and quality of thought' },
          { id: 'v', text: 'Cultural differences in play' },
          { id: 'vi', text: 'Play as a teaching tool' },
          { id: 'vii', text: 'Spatial gains from building' }
        ] }, answer: { answer: 'v' } },
        { number: 19, type: 'reading_matching_headings', prompt: 'Paragraph F', data: { headings: [
          { id: 'i', text: 'Learning hidden inside ordinary activity' },
          { id: 'ii', text: 'The social limits of pretend games' },
          { id: 'iii', text: 'Managing risk through movement' },
          { id: 'iv', text: 'Digital games and quality of thought' },
          { id: 'v', text: 'Cultural differences in play' },
          { id: 'vi', text: 'Play as a teaching tool' },
          { id: 'vii', text: 'Spatial gains from building' }
        ] }, answer: { answer: 'iv' } },
        { number: 20, type: 'reading_mcq_multi', prompt: 'Which TWO statements describe research findings about constructive play mentioned in the passage?', data: { choose: 2, options: [
          'It helps children develop better balance and coordination.',
          'It is linked to improved mental rotation performance two years later.',
          'Its benefits disappear when researchers control for vocabulary.',
          'It helps children translate between a plan and a mental image.',
          'It has the same effect regardless of cultural background.'
        ] }, answer: { answer: ['B', 'D'] } },
        { number: 21, type: 'reading_mcq_multi', prompt: 'Which TWO statements describe research findings about constructive play mentioned in the passage?', data: { linked_to: 20 }, answer: { answer: ['B', 'D'] } },
        { number: 22, type: 'reading_mcq_multi', prompt: 'Which TWO points are made about digital play in the passage?', data: { choose: 2, options: [
          'Well-designed puzzle games can develop planning and persistence.',
          'Most educational apps offer mainly rapid rewards for simple actions.',
          'Screen time should always be supervised by adults.',
          'Digital play is more effective than physical play for older children.',
          'Parents are advised to ban apps that lack clear learning goals.'
        ] }, answer: { answer: ['A', 'B'] } },
        { number: 23, type: 'reading_mcq_multi', prompt: 'Which TWO points are made about digital play in the passage?', data: { linked_to: 22 }, answer: { answer: ['A', 'B'] } },
        { number: 24, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1, summary_title: 'Play, learning and child development', summary_body: 'Research shows that different forms of play support distinct aspects of children\'s development. In Scandinavian preschools, educators draw a distinction between danger and [24], encouraging children to take manageable risks as part of learning. Studies led by Professor Kim found that regular block-building improved children\'s [25] thinking by helping them translate between plans and physical objects. Meanwhile, Dr Greer advises parents to judge digital play by whether it requires genuine thinking, warning that many apps mainly offer [26] for tapping the screen.' }, answer: { answer: 'risk' } },
        { number: 25, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1 }, answer: { answer: 'spatial' } },
        { number: 26, type: 'reading_summary_completion', prompt: '', data: { word_limit: 1 }, answer: { answer: 'rewards' } }
      ]
    },
    {
      title: 'Reading Passage 3: The new science of ancient dyes',
      instructions: 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.',
      body: `
<p><span class="para-label">A</span>Archaeological textiles are fragile survivors. A scrap of wool or linen may be too faded to interest a casual observer, yet to chemists it can contain a detailed record of trade, technology and taste. Until recently, the study of ancient dyes required removing visible fibres from an artefact, a method many museums were unwilling to permit. New analytical techniques are changing that balance between conservation and knowledge.</p>
<p><span class="para-label">B</span>One method, high-performance liquid chromatography, separates the chemical components of a tiny sample and compares them with reference materials. It can identify compounds from madder root, weld, indigo and many insect-based reds. The sample required is now so small that it may be taken from a broken edge or loose fibre. Even so, the method is still minimally destructive, so curators reserve it for cases where the likely research gain is high.</p>
<p><span class="para-label">C</span>Non-invasive imaging has opened a different route. Multispectral cameras photograph an object under several wavelengths of light, revealing patterns invisible to the naked eye. On one Egyptian tunic, imaging showed alternating bands that had looked uniformly brown. Later testing suggested that the original design combined indigo blue with madder red, producing a purple effect that would have signalled status.</p>
<p><span class="para-label">D</span>Dye analysis can also revise historical assumptions about trade. In Viking-age textiles from northern Europe, researchers expected mostly local plant dyes. Instead, some fragments contained compounds associated with imported dyestuffs from much further south. Such findings do not prove direct long-distance trade by the textile owners, but they do suggest that colour materials moved through wider exchange networks than previously assumed.</p>
<p><span class="para-label">E</span>Experimental archaeology provides a necessary check. Dye recipes recorded in medieval manuscripts are often vague, using phrases such as "heat until it looks right". By recreating these processes, researchers learn how temperature, water quality and mordants affect the final colour. Dr Amira Shah has shown that small changes in alum concentration can shift a fabric from bright red to orange-brown, which helps explain why archaeological colours are difficult to classify from appearance alone.</p>
<p><span class="para-label">F</span>The field has practical consequences for museums. If a dye is especially sensitive to light, exhibitions can reduce exposure or rotate objects more frequently. Conservation scientist Miguel Laurent argues that chemical identification should guide display policy rather than rely on broad rules for all textiles. In some cases, analysis has even allowed conservators to choose storage materials that do not react with residual dye compounds.</p>
<p><span class="para-label">G</span>There are limits to what dye science can reveal. A chemical signature may identify a plant or insect source, but it cannot always tell whether a colour was fashionable, sacred or simply cheap. Interpretation still depends on archaeology, written records and comparison with other objects. The most productive projects therefore combine laboratory data with historical questions, treating molecules not as answers in themselves but as clues.</p>`,
      questions: [
        { number: 27, type: 'reading_tfng', prompt: 'Early methods of dye analysis required the removal of fibres that were visible in artefacts.', data: null, answer: { answer: 'TRUE' } },
        { number: 28, type: 'reading_tfng', prompt: 'High-performance liquid chromatography requires no physical sample to be taken from a textile.', data: null, answer: { answer: 'FALSE' } },
        { number: 29, type: 'reading_tfng', prompt: 'Multispectral imaging revealed that an Egyptian tunic originally had a two-colour design.', data: null, answer: { answer: 'TRUE' } },
        { number: 30, type: 'reading_tfng', prompt: 'Dye analysis is more expensive than other methods of studying ancient textiles.', data: null, answer: { answer: 'NOT GIVEN' } },
        { number: 31, type: 'reading_tfng', prompt: 'Analysis of Viking textiles proved that the textile owners had traded directly with distant southern regions.', data: null, answer: { answer: 'FALSE' } },
        { number: 32, type: 'reading_tfng', prompt: 'Small changes in alum concentration can significantly alter the colour produced in a dyed fabric.', data: null, answer: { answer: 'TRUE' } },
        { number: 33, type: 'reading_tfng', prompt: 'Miguel Laurent has collaborated with the researchers who originally developed HPLC analysis.', data: null, answer: { answer: 'NOT GIVEN' } },
        { number: 34, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2, summary_title: 'The science and limits of ancient dye analysis', summary_body: 'Researchers studying Viking-age textiles found that some fragments contained [34] from distant regions, challenging assumptions about the scale of ancient exchange networks. Experimental archaeology has also yielded useful information. Dr Amira Shah demonstrated that varying the concentration of [35] could shift a fabric\'s colour from bright red to orange-brown, which helps explain why it is difficult to classify ancient dyes from their [36] alone.\n\nChemical analysis has direct consequences for museums. When a dye is found to be sensitive to [37], curators can reduce exposure or rotate objects more frequently. Analysis has also allowed conservators to select [38] materials that do not interact with residual dye compounds. However, there are limits to what the science can reveal: a chemical [39] can identify a plant or insect source, but cannot determine whether a colour was fashionable or simply [40].' }, answer: { answer: 'imported dyestuffs' } },
        { number: 35, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'alum' } },
        { number: 36, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'appearance' } },
        { number: 37, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'light' } },
        { number: 38, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'storage' } },
        { number: 39, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'signature' } },
        { number: 40, type: 'reading_summary_completion', prompt: '', data: { word_limit: 2 }, answer: { answer: 'cheap' } }
      ]
    }
  ]
}
