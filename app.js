const QUIZ_LENGTH = 10;
const MIN_AI_POSTS = 4;
const MAX_AI_POSTS = 6;
const QUESTION_TIME_LIMIT_SECONDS = 20;
const RESULT_HOLD_SECONDS = 5;

// Keep null for local-only mode. Point this to your compliant backend feed when ready.
const REMOTE_POSTS_URL = null;

const MIN_CONFIDENCE = 0.75;
const SEEN_STORAGE_KEY = "slop_cop_seen_ids_v1";
const POSTS_PER_LABEL = 140;

const correctFeedbackLines = [
  "Nailed it. Your radar is sharp.",
  "Bullseye. You caught that one fast.",
  "Great read. Detective energy unlocked.",
  "Clean pick. You are in the zone.",
  "Point for you. That was a sneaky one."
];

const wrongFeedbackLines = [
  "Plot twist. That one fooled a lot of people.",
  "Close call. This post had strong decoy vibes.",
  "Oof, tricky one. The style overlap is real.",
  "Sneaky miss. This round is keeping it spicy.",
  "Almost. This one was built to confuse."
];

const timeoutFeedbackLines = [
  "Time is up. The post escaped before you locked your guess.",
  "Clock hit zero. That one was slippery.",
  "No answer in time. This round moved fast."
];

const mockProfiles = [
  { name: "Maya Srinivasan", headline: "Senior Product Manager at NovaGrid | Ex-McKinsey" },
  { name: "Ethan Walker", headline: "Engineering Lead at FieldSpring | Building B2B SaaS" },
  { name: "Priya Khanna", headline: "People Operations Director | Scaling global teams" },
  { name: "Carlos Bennett", headline: "Founder at LedgerLoop | Fintech operator" },
  { name: "Nina Ghosh", headline: "Data Science Manager at Atrium HealthTech" },
  { name: "Jordan Miller", headline: "Customer Success Leader | Retention and expansion" },
  { name: "Arjun Mehta", headline: "VP Operations at Zephyr Labs | Systems thinker" },
  { name: "Olivia Chen", headline: "Brand Strategist | Storytelling for growth-stage teams" },
  { name: "Rhea Banerjee", headline: "Startup Advisor | Product and GTM alignment" },
  { name: "Daniel Brooks", headline: "Chief of Staff | Cross-functional execution" }
];

const humanTemplates = {
  openings: [
    "A year ago, I inherited a process everyone hated but nobody owned.",
    "Last quarter I made a decision that looked efficient on paper and painful in real life.",
    "In a team retro this week, one comment changed how I lead project reviews.",
    "I used to treat planning docs as admin work until one incident forced us to rewrite our approach.",
    "A customer call yesterday exposed a blind spot we had normalized internally.",
    "When I moved from IC to lead, I thought execution speed was the only metric that mattered.",
    "This month we ran an experiment that felt tiny but had a surprisingly broad impact.",
    "A junior teammate challenged my recommendation in public and improved the final outcome.",
    "I recently reviewed six postmortems and noticed the same pattern repeating.",
    "Three years into managing teams, I still relearn the same leadership lesson in new contexts."
  ],
  middleA: [
    "The issue was not effort, it was ambiguity. Different teams were making different assumptions about success, so even good work created collisions.",
    "We were over-indexed on internal consensus and under-indexed on direct evidence from users. That gap created rework we kept calling 'scope change.'",
    "People were escalating late because the social cost of asking early was too high. Once we named that, behavior shifted quickly.",
    "Our handoffs looked complete but lacked intent. Tasks were clear, tradeoffs were not, and that made quality inconsistent.",
    "Most status updates were descriptive, not decision-oriented. We had movement, but not alignment.",
    "The team was talented, but we confused familiarity with clarity. Everyone thought they understood priorities differently.",
    "We tracked lots of metrics without distinguishing leading indicators from comfort metrics.",
    "The problem looked technical at first, but it was mostly a communication design problem.",
    "Execution debt had accumulated in places nobody celebrated: docs, naming, ownership maps, and rollback criteria.",
    "We kept fixing symptoms because root-cause conversations were always deferred to 'next sprint.'"
  ],
  middleB: [
    "So we made two practical changes: a one-page decision memo before kickoff, and a weekly 'what changed and why' note visible to everyone.",
    "We replaced long update meetings with async briefs that required one recommendation and one explicit risk per project.",
    "We introduced a simple rule: if priority changes, state what gets deprioritized in the same message.",
    "We added one customer conversation to the start of every planning cycle instead of validating after implementation.",
    "We started writing assumptions in plain language and assigning owners to each one so uncertainty became trackable.",
    "We redesigned retrospectives around behavior changes, not storytelling, and followed up after two weeks.",
    "We asked every project lead to include a 'who might disagree' section and invite that feedback early.",
    "We moved from activity dashboards to outcome snapshots with 3 metrics and one narrative explanation.",
    "We set explicit review windows so people could challenge decisions without being seen as blockers.",
    "We separated urgent from important work in planning to avoid letting escalation channels define strategy."
  ],
  endings: [
    "The measurable outcome mattered, but the bigger win was trust. Fewer surprises, cleaner decisions, and less emotional drag across teams.",
    "Not everything improved immediately, but quality became more predictable and onboarding got easier for new teammates.",
    "The result: less rework, faster decision cycles, and calmer collaboration when plans changed.",
    "The interesting part is how small this felt operationally and how large it felt culturally.",
    "If you are leading change, design for repeatability before visibility. Repeatable behaviors scale faster than speeches.",
    "My takeaway: clarity is a product, not a byproduct. It requires deliberate design and maintenance.",
    "This reminded me that strong teams are built in boring details long before launch day.",
    "We still have gaps, but now they are visible and discussable, which is a real upgrade.",
    "Leadership has become less about having answers and more about reducing ambiguity for others.",
    "If this sounds familiar in your org, start with one ritual and make it non-negotiable for a month."
  ]
};

const aiTemplates = {
  openings: [
    "In today's rapidly evolving landscape, career growth belongs to those who operationalize clarity at scale.",
    "The highest performers in 2026 are not just working harder; they are architecting compounding execution systems.",
    "Modern leadership is shifting from title-based authority to signal-based influence across complex environments.",
    "If your strategy is static while your context is dynamic, your output will eventually decouple from impact.",
    "I have been refining a framework for adaptive performance that consistently improves directional execution.",
    "The market is rewarding professionals who combine narrative intelligence with measurable delivery loops.",
    "Teams that win repeatedly are not lucky; they are intentionally designed for high-velocity learning.",
    "The future of work will favor operators who can convert ambiguity into aligned action in real time.",
    "Most organizations are over-optimized for activity and under-optimized for strategic coherence.",
    "Execution quality is becoming the primary differentiator in a world where ideas are increasingly commoditized."
  ],
  middleA: [
    "The unlock is integrating intent, prioritization, and reflective feedback into one continuous momentum engine.",
    "When communication fidelity drops, decision latency rises and value creation becomes fragmented.",
    "High-performing systems treat focus as a portfolio allocation problem, not a motivation problem.",
    "Siloed optimization creates local wins and global drag, especially under volatility.",
    "Without explicit tradeoff architecture, teams default to urgency theater and reactive planning.",
    "Sustainable output depends on reducing cognitive context-switching across strategic workstreams.",
    "Operators who model assumptions transparently make faster, cleaner pivots under uncertainty.",
    "Clarity compounds because each aligned decision lowers the coordination cost of the next decision.",
    "Ambition without execution cadence tends to produce motion density, not directional progress.",
    "Professional leverage increases when individuals translate complexity into portable decision language."
  ],
  middleB: [
    "I now use a simple stack: one strategic north star, three execution commitments, and one structured review checkpoint.",
    "This quarter I mapped weekly actions to asymmetrical upside and reallocated high-energy blocks accordingly.",
    "We implemented a repeatable decision protocol with explicit constraints, risk framing, and next-action ownership.",
    "The team introduced a cadence where every initiative requires a measurable hypothesis and a learning objective.",
    "We shifted to narrative-first operating reviews to improve shared context before discussing metrics.",
    "A lightweight prioritization matrix helped us de-risk low-leverage work consuming premium bandwidth.",
    "By codifying decision rights, we reduced escalation noise and increased execution velocity.",
    "We replaced broad status rituals with precision updates anchored in directional signal quality.",
    "A transparent tradeoff ledger increased accountability while reducing alignment debt across functions.",
    "We operationalized retrospective loops so each sprint produced both output and capability growth."
  ],
  endings: [
    "The result was not just higher output, but higher relevance of output against long-term objectives.",
    "In short: less noise, more signal, and a stronger compounding trajectory over time.",
    "If your calendar is full but progress feels flat, your system likely needs architecture, not intensity.",
    "The organizations that master this will outperform through coherence, not chaos.",
    "Execution excellence is ultimately a rhythm discipline before it becomes a scale advantage.",
    "The next wave of differentiation will come from those who can learn and align faster than the environment shifts.",
    "This is why capability design is becoming more valuable than isolated tactical excellence.",
    "When strategic intent and operational behavior align, trust and throughput improve simultaneously.",
    "The key takeaway: build for repeatability first, then optimize for acceleration.",
    "In uncertain markets, principles and cadence outperform heroics and inspiration cycles."
  ]
};

const els = {
  introOverlay: document.getElementById("intro-overlay"),
  answerOverlay: document.getElementById("answer-overlay"),
  answerKicker: document.getElementById("answer-kicker"),
  answerIcon: document.getElementById("answer-icon"),
  answerTitle: document.getElementById("answer-title"),
  answerDetail: document.getElementById("answer-detail"),
  answerNextBtn: document.getElementById("answer-next-btn"),
  finalOverlay: document.getElementById("final-overlay"),
  finalOverlayScore: document.getElementById("final-overlay-score"),
  finalOverlayDetail: document.getElementById("final-overlay-detail"),
  shareLinkedInBtn: document.getElementById("share-linkedin-btn"),
  shareFacebookBtn: document.getElementById("share-facebook-btn"),
  shareWhatsAppBtn: document.getElementById("share-whatsapp-btn"),
  playAgainBtn: document.getElementById("play-again-btn"),
  shareStatus: document.getElementById("share-status"),
  startBtn: document.getElementById("start-btn"),
  quizCard: document.getElementById("quiz-card"),
  progress: document.getElementById("question-progress"),
  scorePreview: document.getElementById("score-preview"),
  timerDisplay: document.getElementById("timer-display"),
  timerTrack: document.querySelector(".timer-track"),
  timerFill: document.getElementById("timer-fill"),
  postBody: document.getElementById("post-body"),
  postAuthor: document.getElementById("post-author"),
  postHeadline: document.getElementById("post-headline"),
  postMeta: document.getElementById("post-meta"),
  postInitials: document.getElementById("post-initials"),
  humanBtn: document.getElementById("answer-human"),
  aiBtn: document.getElementById("answer-ai"),
  finalOverlayTitle: document.getElementById("final-overlay-title")
};

const state = {
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  userAnswers: [],
  questionTimer: null,
  resultHoldTimer: null,
  timerStartedAt: 0
};

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function pickRandom(items, count) {
  return shuffle(items).slice(0, count);
}

function pickMessage(lines) {
  return lines[randomInt(0, lines.length - 1)];
}

function pickProfile() {
  const profile = mockProfiles[randomInt(0, mockProfiles.length - 1)];
  return { ...profile };
}

function initialsFromName(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function renderLinkedInPost(question) {
  if (!question.profile) {
    question.profile = pickProfile();
  }

  els.postAuthor.textContent = question.profile.name;
  els.postHeadline.textContent = question.profile.headline;
  els.postMeta.textContent = "3h  •  Public";
  els.postInitials.textContent = initialsFromName(question.profile.name);
  els.postBody.textContent = question.text;
}

function setTimerBarVisible(isVisible) {
  els.timerTrack.classList.toggle("hidden", !isVisible);
}

function clearTimers() {
  if (state.questionTimer) {
    clearInterval(state.questionTimer);
    state.questionTimer = null;
  }

  if (state.resultHoldTimer) {
    clearInterval(state.resultHoldTimer);
    state.resultHoldTimer = null;
  }
}

function setTimerVisuals(secondsLeft, totalSeconds, prefix) {
  const safeSeconds = Math.max(0, secondsLeft);
  const displaySeconds = Math.ceil(safeSeconds);
  const ratio = totalSeconds > 0 ? safeSeconds / totalSeconds : 0;

  els.timerDisplay.textContent = `${prefix} ${displaySeconds}s`;
  els.timerFill.style.width = `${Math.max(0, Math.min(1, ratio)) * 100}%`;
}

function showAnswerOverlay(kicker, title, detail, outcome) {
  const isCorrect = outcome === "correct";
  const card = els.answerOverlay.querySelector(".answer-card");

  card.classList.remove("state-correct", "state-wrong");
  card.classList.add(isCorrect ? "state-correct" : "state-wrong");

  els.answerKicker.textContent = kicker;
  els.answerIcon.textContent = isCorrect ? "✓" : "✕";
  els.answerTitle.textContent = title;
  els.answerDetail.textContent = detail;
  els.answerOverlay.classList.remove("hidden");
}

function hideAnswerOverlay() {
  els.answerOverlay.classList.add("hidden");
}

function buildShareText() {
  const percentage = Math.round((state.score / QUIZ_LENGTH) * 100);
  return `I scored ${state.score}/${QUIZ_LENGTH} (${percentage}%) on LinkedIn Slop Cop. Can you beat me?`;
}

function openShareWindow(url) {
  window.open(url, "_blank", "noopener,noreferrer,width=760,height=620");
}

function shareToLinkedIn() {
  const text = `${buildShareText()} ${window.location.href}`;
  openShareWindow(`https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(text)}`);
  els.shareStatus.textContent = "Opened LinkedIn share.";
}

function shareToFacebook() {
  const pageUrl = window.location.href;
  const quote = buildShareText();
  openShareWindow(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(quote)}`);
  els.shareStatus.textContent = "Opened Facebook share.";
}

function shareToWhatsApp() {
  const text = `${buildShareText()} ${window.location.href}`;
  openShareWindow(`https://wa.me/?text=${encodeURIComponent(text)}`);
  els.shareStatus.textContent = "Opened WhatsApp share.";
}

function buildTemplatePool(label, templates, total) {
  const posts = [];
  for (let i = 0; i < total; i += 1) {
    const a = templates.openings[i % templates.openings.length];
    const b = templates.middleA[(i * 3) % templates.middleA.length];
    const c = templates.middleB[(i * 5) % templates.middleB.length];
    const d = templates.endings[(i * 7) % templates.endings.length];

    posts.push({
      id: `${label}-tmpl-${i + 1}`,
      label,
      confidence: 0.82,
      source: "local_template_bank",
      text: `${a}\n\n${b}\n\n${c}\n\n${d}`
    });
  }

  return posts;
}

function buildFallbackBank() {
  return {
    human: buildTemplatePool("human", humanTemplates, POSTS_PER_LABEL),
    ai: buildTemplatePool("ai", aiTemplates, POSTS_PER_LABEL)
  };
}

function normalizeRemotePosts(remote) {
  const normalized = { human: [], ai: [] };

  if (!Array.isArray(remote)) {
    return normalized;
  }

  remote.forEach((item, idx) => {
    if (!item || typeof item.text !== "string" || typeof item.label !== "string") {
      return;
    }

    const label = item.label.trim().toLowerCase();
    if (label !== "human" && label !== "ai") {
      return;
    }

    const confidence = typeof item.confidence === "number" ? item.confidence : 0.8;
    if (confidence < MIN_CONFIDENCE) {
      return;
    }

    normalized[label].push({
      id: item.id || `remote-${label}-${idx + 1}`,
      label,
      text: item.text.trim(),
      confidence,
      source: item.source || "remote_feed"
    });
  });

  return normalized;
}

function dedupeByText(posts) {
  const seen = new Set();
  return posts.filter((p) => {
    const key = p.text.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

async function loadPosts() {
  const fallbackBank = buildFallbackBank();

  if (!REMOTE_POSTS_URL) {
    return fallbackBank;
  }

  try {
    const response = await fetch(REMOTE_POSTS_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const remotePosts = await response.json();
    const normalized = normalizeRemotePosts(remotePosts);

    return {
      human: dedupeByText([...normalized.human, ...fallbackBank.human]),
      ai: dedupeByText([...normalized.ai, ...fallbackBank.ai])
    };
  } catch (error) {
    console.warn("Using local compliant fallback bank", error);
    return fallbackBank;
  }
}

function getSeenIds() {
  try {
    const raw = localStorage.getItem(SEEN_STORAGE_KEY);
    if (!raw) {
      return new Set();
    }

    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function saveSeenIds(set) {
  const arr = [...set];
  const bounded = arr.slice(Math.max(0, arr.length - 2000));
  localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(bounded));
}

function pickWithHistory(posts, count, seenSet) {
  const unseen = posts.filter((p) => !seenSet.has(p.id));
  const seen = posts.filter((p) => seenSet.has(p.id));

  const picks = [...pickRandom(unseen, Math.min(count, unseen.length))];

  if (picks.length < count) {
    picks.push(...pickRandom(seen, count - picks.length));
  }

  picks.forEach((p) => seenSet.add(p.id));
  return picks;
}

function buildQuizQuestions(postBank) {
  const aiCount = randomInt(MIN_AI_POSTS, MAX_AI_POSTS);
  const humanCount = QUIZ_LENGTH - aiCount;

  if (postBank.ai.length < aiCount || postBank.human.length < humanCount) {
    throw new Error("Post bank is too small to generate a new quiz.");
  }

  const seenSet = getSeenIds();
  const aiQuestions = pickWithHistory(postBank.ai, aiCount, seenSet).map((p) => ({ ...p, answer: "ai" }));
  const humanQuestions = pickWithHistory(postBank.human, humanCount, seenSet).map((p) => ({ ...p, answer: "human" }));

  saveSeenIds(seenSet);
  return shuffle([...aiQuestions, ...humanQuestions]);
}

function resetRoundState() {
  clearTimers();
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.userAnswers = [];
  els.answerOverlay.classList.add("hidden");
  els.finalOverlay.classList.add("hidden");
  els.shareStatus.textContent = "";
}

function updateMeta() {
  els.progress.textContent = `Question ${state.index + 1} of ${QUIZ_LENGTH}`;
  els.scorePreview.textContent = `Score: ${state.score}`;
}

function lockAnswerButtons() {
  els.humanBtn.disabled = true;
  els.aiBtn.disabled = true;
}

function unlockAnswerButtons() {
  els.humanBtn.disabled = false;
  els.aiBtn.disabled = false;
}

function finishQuizIfNeeded() {
  if (state.index >= QUIZ_LENGTH) {
    showResults();
    return true;
  }

  return false;
}

function advanceQuestion() {
  hideAnswerOverlay();
  state.index += 1;
  if (finishQuizIfNeeded()) {
    return;
  }

  renderCurrentQuestion();
}

function startResultHoldCountdown() {
  clearTimers();
  state.timerStartedAt = Date.now();

  setTimerBarVisible(false);
  setTimerVisuals(RESULT_HOLD_SECONDS, RESULT_HOLD_SECONDS, "Next in");

  state.resultHoldTimer = setInterval(() => {
    const elapsed = (Date.now() - state.timerStartedAt) / 1000;
    const remaining = RESULT_HOLD_SECONDS - elapsed;

    if (remaining <= 0) {
      clearTimers();
      advanceQuestion();
      return;
    }

    setTimerVisuals(remaining, RESULT_HOLD_SECONDS, "Next in");
  }, 100);
}

function skipAnswerOverlayWait() {
  if (els.answerOverlay.classList.contains("hidden")) {
    return;
  }

  clearTimers();
  advanceQuestion();
}

function handleTimeout() {
  if (state.answered) {
    return;
  }

  const q = state.questions[state.index];
  state.answered = true;

  state.userAnswers.push({
    questionIndex: state.index,
    choice: "none",
    correctAnswer: q.answer,
    isCorrect: false,
    timedOut: true
  });

  showAnswerOverlay(
    "Time Up",
    "No guess submitted",
    `${pickMessage(timeoutFeedbackLines)} Correct answer: ${q.answer.toUpperCase()}.`,
    "wrong"
  );

  lockAnswerButtons();
  startResultHoldCountdown();
}

function startQuestionCountdown() {
  clearTimers();
  state.timerStartedAt = Date.now();

  setTimerBarVisible(true);
  setTimerVisuals(QUESTION_TIME_LIMIT_SECONDS, QUESTION_TIME_LIMIT_SECONDS, "Time");

  state.questionTimer = setInterval(() => {
    const elapsed = (Date.now() - state.timerStartedAt) / 1000;
    const remaining = QUESTION_TIME_LIMIT_SECONDS - elapsed;

    if (remaining <= 0) {
      clearTimers();
      handleTimeout();
      return;
    }

    setTimerVisuals(remaining, QUESTION_TIME_LIMIT_SECONDS, "Time");
  }, 100);
}

function renderCurrentQuestion() {
  const q = state.questions[state.index];

  updateMeta();
  renderLinkedInPost(q);

  state.answered = false;
  unlockAnswerButtons();
  startQuestionCountdown();
}

function submitAnswer(choice) {
  if (state.answered) {
    return;
  }

  clearTimers();

  const q = state.questions[state.index];
  const isCorrect = q.answer === choice;

  state.answered = true;
  state.userAnswers.push({
    questionIndex: state.index,
    choice,
    correctAnswer: q.answer,
    isCorrect,
    timedOut: false
  });

  if (isCorrect) {
    state.score += 1;
    showAnswerOverlay("Correct", "Good call, detective.", pickMessage(correctFeedbackLines), "correct");
  } else {
    showAnswerOverlay(
      "Incorrect",
      "That one slipped past your radar.",
      `${pickMessage(wrongFeedbackLines)} Correct answer: ${q.answer.toUpperCase()}.`,
      "wrong"
    );
  }

  lockAnswerButtons();
  updateMeta();
  startResultHoldCountdown();
}

function showResults() {
  clearTimers();
  setTimerBarVisible(false);
  hideAnswerOverlay();

  els.quizCard.classList.add("hidden");
  els.finalOverlay.classList.remove("hidden");
  els.shareStatus.textContent = "";

  const percentage = Math.round((state.score / QUIZ_LENGTH) * 100);
  els.finalOverlayTitle.textContent = "Score Summary";
  els.finalOverlayScore.textContent = `You scored ${state.score} out of ${QUIZ_LENGTH} (${percentage}%).`;

  if (percentage >= 80) {
    els.finalOverlayDetail.textContent = "Absolute mind-reader mode. Your AI detector is elite.";
  } else if (percentage >= 60) {
    els.finalOverlayDetail.textContent = "Strong instincts. You caught most of the tricks.";
  } else {
    els.finalOverlayDetail.textContent = "Wild round. Run it back and sharpen that radar.";
  }
}

async function startGame() {
  clearTimers();

  const postBank = await loadPosts();
  state.questions = buildQuizQuestions(postBank);

  resetRoundState();
  els.finalOverlay.classList.add("hidden");
  els.quizCard.classList.remove("hidden");
  renderCurrentQuestion();
}

function startGameFromOverlay() {
  els.introOverlay.classList.add("hidden");
  startGame();
}

els.humanBtn.addEventListener("click", () => submitAnswer("human"));
els.aiBtn.addEventListener("click", () => submitAnswer("ai"));
els.startBtn.addEventListener("click", startGameFromOverlay);
els.playAgainBtn.addEventListener("click", startGame);
els.shareLinkedInBtn.addEventListener("click", shareToLinkedIn);
els.shareFacebookBtn.addEventListener("click", shareToFacebook);
els.shareWhatsAppBtn.addEventListener("click", shareToWhatsApp);
els.answerNextBtn.addEventListener("click", skipAnswerOverlayWait);

setTimerBarVisible(false);
