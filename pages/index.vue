<template>
  <div class="landing">
    <section class="hero">
      <div class="hero__inner container">
        <div class="hero__content">
          <span class="eyebrow">
            <Icon name="sparkles" :size="14" />
            Cambridge-style Academic practice
          </span>
          <h1 class="hero__title">
            Train for the real IELTS exam in the exam's own interface.
          </h1>
          <p class="hero__lead">
            Full-length, timed mock tests for <strong>Reading</strong>, <strong>Listening</strong>, <strong>Writing</strong> and <strong>Speaking</strong> — rendered in the same computer-delivered layout you'll see on test day, with automatic scoring and a 9-band estimate.
          </p>
          <div class="hero__cta">
            <NuxtLink to="/tests" class="btn cta">
              <Icon name="play" :size="16" />
              Start a mock test
            </NuxtLink>
            <a href="#how-it-works" class="btn ghost">
              <Icon name="info" :size="16" />
              How it works
            </a>
          </div>
          <ul class="trust-row" aria-label="Platform highlights">
            <li><Icon name="check-circle" :size="16" /> 40-question auto-graded Reading &amp; Listening</li>
            <li><Icon name="check-circle" :size="16" /> Real exam topbar &amp; question navigator</li>
            <li><Icon name="check-circle" :size="16" /> In-browser speaking recorder</li>
          </ul>
        </div>
        <aside class="hero__panel" aria-hidden="true">
          <div class="mock-topbar">
            <div class="mock-topbar__id">Candidate 000001 · Test 4</div>
            <div class="mock-topbar__timer"><Icon name="clock" :size="14" /> 59:42 remaining</div>
          </div>
          <div class="mock-body">
            <div class="mock-passage">
              <p class="mock-heading">Passage 1 · The history of the tomato</p>
              <p>The tomato, though ubiquitous in modern cuisines, travelled a surprisingly long road from the Andes to European dinner tables…</p>
            </div>
            <div class="mock-questions">
              <p class="mock-q">1. The tomato was first cultivated in&nbsp;<span class="mock-blank">________</span></p>
              <p class="mock-q">2. Europeans initially feared the tomato was&nbsp;<span class="mock-blank">________</span></p>
              <p class="mock-q">3. <label><input type="checkbox" disabled /> True</label> &nbsp; <label><input type="checkbox" disabled checked /> False</label> &nbsp; <label><input type="checkbox" disabled /> Not Given</label></p>
            </div>
          </div>
          <div class="mock-navbar">
            <span class="qn done">1</span>
            <span class="qn done">2</span>
            <span class="qn current">3</span>
            <span class="qn">4</span>
            <span class="qn">5</span>
            <span class="qn">6</span>
            <span class="qn">7</span>
            <span class="qn">8</span>
            <span class="qn">9</span>
            <span class="qn">10</span>
          </div>
        </aside>
      </div>
    </section>

    <section class="container section">
      <header class="section-head">
        <span class="eyebrow"><Icon name="award" :size="14" /> Four skills, one interface</span>
        <h2>Practice every skill end-to-end</h2>
        <p>Every module on this platform mirrors Cambridge Academic IELTS — timings, question mix, audio structure and scoring bands.</p>
      </header>
      <div class="feature-grid">
        <NuxtLink to="/tests" class="feature-card feature-card--reading">
          <div class="feature-card__icon"><Icon name="book-open" :size="22" /></div>
          <div class="feature-card__body">
            <h3>Reading</h3>
            <p class="feature-card__meta">60 min · 3 passages · 40 Qs</p>
            <p>Matching headings, True/False/Not Given, MCQ single &amp; multi, summary &amp; sentence completion, matching information and diagram labelling.</p>
          </div>
          <span class="feature-card__cta">Open reading tests <Icon name="arrow-right" :size="14" /></span>
        </NuxtLink>

        <NuxtLink to="/tests" class="feature-card feature-card--listening">
          <div class="feature-card__icon"><Icon name="headphones" :size="22" /></div>
          <div class="feature-card__body">
            <h3>Listening</h3>
            <p class="feature-card__meta">30 min · 4 parts · 40 Qs</p>
            <p>Form, note, table, flow-chart completion, MCQs, matching and map labelling — played once, just like the real exam.</p>
          </div>
          <span class="feature-card__cta">Open listening tests <Icon name="arrow-right" :size="14" /></span>
        </NuxtLink>

        <NuxtLink to="/tests" class="feature-card feature-card--writing">
          <div class="feature-card__icon"><Icon name="pen-tool" :size="22" /></div>
          <div class="feature-card__body">
            <h3>Writing</h3>
            <p class="feature-card__meta">60 min · 2 tasks</p>
            <p>Task 1 describes a chart, diagram or process in 150+ words. Task 2 is a 250+ word argumentative essay with live word-count.</p>
          </div>
          <span class="feature-card__cta">Open writing tests <Icon name="arrow-right" :size="14" /></span>
        </NuxtLink>

        <NuxtLink to="/tests" class="feature-card feature-card--speaking">
          <div class="feature-card__icon"><Icon name="mic" :size="22" /></div>
          <div class="feature-card__body">
            <h3>Speaking</h3>
            <p class="feature-card__meta">11–14 min · 3 parts</p>
            <p>Interview, cue-card long turn and two-way discussion. Record your answers directly in the browser and submit for review.</p>
          </div>
          <span class="feature-card__cta">Open speaking tests <Icon name="arrow-right" :size="14" /></span>
        </NuxtLink>
      </div>
    </section>

    <section id="how-it-works" class="container section">
      <div class="how-it-works">
        <header class="section-head">
          <span class="eyebrow"><Icon name="zap" :size="14" /> How it works</span>
          <h2>Three steps to your band score</h2>
        </header>
        <ol class="steps">
          <li class="step">
            <div class="step__num">1</div>
            <h3><Icon name="list" :size="16" /> Pick a mock test</h3>
            <p>Choose a Reading, Listening, Writing or Speaking test from the library. Each test is a full-length test with the exact IELTS question mix.</p>
          </li>
          <li class="step">
            <div class="step__num">2</div>
            <h3><Icon name="clock" :size="16" /> Sit the test</h3>
            <p>The exam renders with the real IELTS topbar, split passage/question layout, question navigator and countdown timer — just like test day.</p>
          </li>
          <li class="step">
            <div class="step__num">3</div>
            <h3><Icon name="award" :size="16" /> Review your band</h3>
            <p>Reading &amp; Listening are auto-graded with a Cambridge band estimate. Writing &amp; Speaking are stored for you or a tutor to review.</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="container section">
      <div class="cta-panel">
        <div class="cta-panel__text">
          <h2>Ready to sit your first mock?</h2>
          <p>No signup required for anonymous attempts. Your progress is saved as soon as you start.</p>
        </div>
        <NuxtLink to="/tests" class="btn cta">
          Browse tests <Icon name="arrow-right" :size="16" />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'IELTS Practice — Full-length Academic mock tests',
  meta: [
    { name: 'description', content: 'Cambridge-style full-length mock IELTS tests for Reading, Listening, Writing and Speaking — in the real computer-delivered exam interface.' }
  ]
})
</script>
