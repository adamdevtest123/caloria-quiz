import confetti from 'canvas-confetti';
import './style.css';

const QUESTIONS = [
  {
    id: 'gender',
    title: "What's your gender?",
    subtitle: "We'll personalize your plan.",
    options: [
      { emoji: '👨', label: 'Male',   value: 'male' },
      { emoji: '👩', label: 'Female', value: 'female' },
      { emoji: '🧑', label: 'Other',  value: 'other' },
    ],
  },
  {
    id: 'age',
    title: 'How old are you?',
    subtitle: 'Just a rough range.',
    options: [
      { emoji: '🧒', label: 'Under 18', value: 'u18' },
      { emoji: '🧑', label: '18 – 29',  value: '18-29' },
      { emoji: '👨', label: '30 – 44',  value: '30-44' },
      { emoji: '👴', label: '45+',      value: '45+' },
    ],
  },
  {
    id: 'goal',
    title: "What's your main goal?",
    subtitle: 'Pick the one that fits best.',
    options: [
      { emoji: '🔥', label: 'Lose weight',   value: 'lose' },
      { emoji: '💪', label: 'Build muscle',  value: 'muscle' },
      { emoji: '⚖️', label: 'Maintain',      value: 'maintain' },
      { emoji: '🥗', label: 'Eat healthier', value: 'healthy' },
    ],
  },
  {
    id: 'tracking',
    title: 'How often do you track meals?',
    options: [
      { emoji: '📅', label: 'Every day', value: 'daily' },
      { emoji: '📆', label: 'Sometimes', value: 'sometimes' },
      { emoji: '❌', label: 'Never',     value: 'never' },
    ],
  },
  {
    id: 'struggle',
    title: "What's your biggest struggle?",
    options: [
      { emoji: '🤔', label: 'Knowing calories',  value: 'calories' },
      { emoji: '⏱️', label: 'Not enough time',   value: 'time' },
      { emoji: '📓', label: 'Logging is tedious', value: 'tedious' },
      { emoji: '🍔', label: 'Cravings',          value: 'cravings' },
    ],
  },
  {
    id: 'logging',
    title: 'How do you log food today?',
    options: [
      { emoji: '✍️', label: 'Manually type it', value: 'manual' },
      { emoji: '📷', label: 'Take photos',      value: 'photo' },
      { emoji: '🧠', label: 'Just guess',       value: 'guess' },
      { emoji: '🙅', label: "I don't",          value: 'none' },
    ],
  },
  {
    id: 'scan',
    title: 'Would scanning food with your camera help?',
    subtitle: 'Point, snap, see calories instantly.',
    options: [
      { emoji: '📸', label: 'Yes, that sounds great!', value: 'yes' },
      { emoji: '🤔', label: 'Maybe',                   value: 'maybe' },
      { emoji: '🙅', label: 'Not really',              value: 'no' },
    ],
  },
  {
    id: 'commit',
    title: 'How committed are you?',
    subtitle: 'Be honest — there are no wrong answers.',
    options: [
      { emoji: '🚀', label: "All in — let's go",     value: 'high' },
      { emoji: '🙂', label: 'Steady and consistent', value: 'mid' },
      { emoji: '🐢', label: 'Slow and easy',         value: 'low' },
    ],
  },
];

const state = { step: 0, phase: 'quiz', answers: {} };

const $main = document.getElementById('main');
const $progressFill = document.getElementById('progressFill');
const $progressText = document.getElementById('progressText');
const $backBtn = document.getElementById('backBtn');

$backBtn.addEventListener('click', () => {
  if (state.phase !== 'quiz') return;
  if (state.step > 0) {
    state.step--;
    render();
  }
});

function updateProgress() {
  const total = QUESTIONS.length;
  const pct = state.phase === 'quiz' ? (state.step / total) * 100 : 100;
  $progressFill.style.width = pct + '%';
  $progressText.textContent =
    state.phase === 'quiz' ? `${state.step}/${total}` : `${total}/${total}`;
  $backBtn.style.visibility =
    state.phase === 'quiz' && state.step > 0 ? 'visible' : 'hidden';
}

function render() {
  updateProgress();
  if (state.phase === 'quiz') return renderQuestion();
  if (state.phase === 'calc') return renderCalculating();
  if (state.phase === 'result') return renderResult();
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function renderQuestion() {
  const q = QUESTIONS[state.step];
  const selected = state.answers[q.id];

  $main.innerHTML = `
    <div class="step">
      <h1 class="text-2xl font-extrabold leading-tight mb-2">${escapeHtml(q.title)}</h1>
      ${q.subtitle ? `<p class="text-gray-500 mb-6">${escapeHtml(q.subtitle)}</p>` : '<div class="mb-6"></div>'}
      <div class="flex flex-col gap-3">
        ${q.options.map(opt => `
          <button class="opt ${selected === opt.value ? 'selected' : ''}" data-value="${escapeHtml(opt.value)}">
            <span class="emoji">${opt.emoji}</span>
            <span>${escapeHtml(opt.label)}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `;

  $main.querySelectorAll('.opt').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value;
      state.answers[q.id] = value;
      btn.classList.add('selected');
      setTimeout(() => {
        if (state.step < QUESTIONS.length - 1) {
          state.step++;
          render();
        } else {
          state.phase = 'calc';
          render();
        }
      }, 220);
    });
  });
}

function renderCalculating() {
  const labels = [
    '🎯 Matching your goals…',
    '🧠 Checking your habits…',
    '🍎 Reviewing nutrition needs…',
    '✨ Personalizing your plan…',
  ];
  $main.innerHTML = `
    <div class="step flex-1 flex flex-col items-center justify-center text-center px-2">
      <div class="text-6xl mb-6 pop">🧮</div>
      <h1 class="text-2xl font-extrabold mb-2">Analyzing your answers</h1>
      <p class="text-gray-500 mb-8" id="calcLabel">${labels[0]}</p>
      <div class="calc-bar-track w-full max-w-sm">
        <div class="calc-bar-fill" id="calcFill"></div>
      </div>
      <p class="mt-4 text-sm font-bold text-gray-400 tabular-nums" id="calcPct">0%</p>
    </div>
  `;

  const $fill = document.getElementById('calcFill');
  const $pct = document.getElementById('calcPct');
  const $label = document.getElementById('calcLabel');
  const duration = 2400;
  const start = performance.now();

  function tick(now) {
    const t = Math.min(1, (now - start) / duration);
    const pct = Math.round(t * 100);
    $fill.style.width = pct + '%';
    $pct.textContent = pct + '%';
    const labelIdx = Math.min(labels.length - 1, Math.floor(t * labels.length));
    if ($label.dataset.idx != labelIdx) {
      $label.dataset.idx = labelIdx;
      $label.textContent = labels[labelIdx];
    }
    if (t < 1) requestAnimationFrame(tick);
    else setTimeout(() => { state.phase = 'result'; render(); }, 220);
  }
  requestAnimationFrame(tick);
}

function computeScoreAndReasons(a) {
  let score = 70;
  if (a.scan === 'yes') score += 12;
  else if (a.scan === 'maybe') score += 6;
  if (a.commit === 'high') score += 10;
  else if (a.commit === 'mid') score += 6;
  else score += 3;
  if (a.tracking === 'never' || a.tracking === 'sometimes') score += 5;
  if (a.struggle === 'tedious' || a.struggle === 'time' || a.struggle === 'calories') score += 5;
  if (a.goal) score += 3;
  score = Math.min(98, Math.max(86, score));

  const reasons = [];
  const goalReason = {
    lose:     { e: '🔥', t: 'Built for your weight-loss goal', s: 'Caloria nails the calorie counts that drive a deficit.' },
    muscle:   { e: '💪', t: 'Tracks protein for muscle gains',  s: 'See macros instantly so you hit your protein target.' },
    maintain: { e: '⚖️', t: 'Keeps you in your sweet spot',     s: 'Quick scans make maintenance effortless.' },
    healthy:  { e: '🥗', t: 'Better choices, automatically',    s: 'Spot the nutrition wins and gaps in seconds.' },
  }[a.goal];
  if (goalReason) reasons.push(goalReason);

  if (a.struggle === 'tedious' || a.logging === 'manual' || a.logging === 'none') {
    reasons.push({ e: '⚡', t: 'No more tedious logging', s: 'Snap a photo — Caloria does the typing for you.' });
  } else if (a.struggle === 'time') {
    reasons.push({ e: '⏱️', t: 'Made for busy schedules', s: 'A meal logged in under 3 seconds.' });
  } else if (a.struggle === 'calories' || a.logging === 'guess') {
    reasons.push({ e: '🎯', t: 'Real numbers, not guesses', s: 'Accurate calorie data on every meal — instantly.' });
  } else if (a.struggle === 'cravings') {
    reasons.push({ e: '🧠', t: 'Awareness beats cravings', s: 'Seeing the numbers builds better habits, fast.' });
  } else {
    reasons.push({ e: '⚡', t: 'Fast, simple tracking', s: 'Snap a photo and you’re done.' });
  }

  if (a.scan === 'yes') {
    reasons.push({ e: '📸', t: 'Camera scanning is your superpower', s: 'Exactly the workflow you said you wanted.' });
  } else if (a.commit === 'high') {
    reasons.push({ e: '🚀', t: 'Matches your motivation', s: 'You’re ready to go — Caloria keeps the momentum.' });
  } else {
    reasons.push({ e: '🌱', t: 'Easy to stick with', s: 'Low-effort tracking that grows into a habit.' });
  }

  return { score, reasons: reasons.slice(0, 3) };
}

function renderResult() {
  const { score, reasons } = computeScoreAndReasons(state.answers);
  $main.innerHTML = `
    <div class="step flex-1 flex flex-col">
      <div class="text-center pt-2 pb-6">
        <div class="text-6xl mb-3 pop">🎉</div>
        <div class="badge-score pop mb-4"><span>✨</span><span>${score}% match</span></div>
        <h1 class="text-3xl font-extrabold leading-tight mb-2">Caloria is perfect for you!</h1>
        <p class="text-gray-500">Here's why we think you'll love it:</p>
      </div>
      <div class="flex flex-col gap-3 mb-6">
        ${reasons.map((r, i) => `
          <div class="reason" style="animation: slideIn 360ms ${i * 90}ms both cubic-bezier(.2,.8,.2,1);">
            <div class="text-2xl">${r.e}</div>
            <div>
              <div class="font-extrabold text-[15px] leading-tight">${escapeHtml(r.t)}</div>
              <div class="text-sm text-gray-600 mt-0.5">${escapeHtml(r.s)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      <div class="mt-auto">
        <a href="https://getcaloria.com" class="cta">Get Caloria →</a>
        <p class="text-center text-xs text-gray-400 mt-3">
          <span class="pulse-dot"></span> Trusted by thousands of food scanners
        </p>
      </div>
    </div>
  `;
  fireConfetti();
}

function fireConfetti() {
  const colors = ['#58CC02', '#89E219', '#FFC800', '#46A302'];
  const end = Date.now() + 900;
  (function frame() {
    confetti({ particleCount: 4, angle: 60,  spread: 70, origin: { x: 0, y: 0.7 }, colors, gravity: 0.9, scalar: 0.9 });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1, y: 0.7 }, colors, gravity: 0.9, scalar: 0.9 });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 90, spread: 100, origin: { y: 0.4 }, colors, scalar: 1.1 });
}

render();
