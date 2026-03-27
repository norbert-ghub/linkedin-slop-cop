const QUIZ_LENGTH = 10;
const MIN_AI_POSTS = 4;
const MAX_AI_POSTS = 6;
const QUESTION_TIME_LIMIT_SECONDS = 20;
const RESULT_HOLD_SECONDS = 5;
const REMOTE_POSTS_URL = null;

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

const fallbackPosts = {
  human: [
    {
      text: "Started my first role as an operations analyst 18 months ago. Today I presented our quarterly process review to leadership and used only one slide. The slide had three numbers and one quote from a support teammate. That was enough to make the room lean in.\n\nWhat changed was not the spreadsheet. What changed was the story around decision latency. We had teams waiting 4 to 5 business days for simple approvals because we were optimizing for audit cleanliness over operating speed.\n\nWe did two small things: introduced approval tiers for low-risk changes, and moved clarification questions to one shared thread instead of five private chats. Cycle time dropped 38% in one quarter.\n\nBig reminder for anyone early in their career: if your analysis does not change behavior, it is not done yet."
    },
    {
      text: "A candidate asked me why our interview process includes a writing sample. Fair question, especially for roles that are not 'content' roles.\n\nIn our team, writing is the medium through which decisions travel. Product specs, handoff notes, escalation summaries, customer debriefs, retrospective outcomes. The artifact stays long after the meeting ends.\n\nI have seen brilliant people struggle because they had great ideas but could not package tradeoffs clearly. That gap creates hidden cost for everyone else.\n\nSo we test writing because we care about thinking, not grammar perfection. Can you define the problem, frame options, make a recommendation, and explain what you are de-prioritizing?\n\nCommunication is not a soft skill when it affects operating speed and trust. It is core execution."
    },
    {
      text: "I used to think saying yes made me a supportive manager. In reality, it mostly made me a bottleneck.\n\nEvery time someone asked for a decision, I jumped in to protect quality. It felt responsible in the moment, but over time the team became slower and less confident.\n\nThis year I changed one line in my replies: 'What would you do if I were out for three days?'\n\nThe quality of proposals improved quickly. People came back with assumptions, options, risk notes, and a clear recommendation. My role shifted from decision-maker to quality amplifier.\n\nIf you are leading a team, ask yourself whether your involvement is raising capability or just lowering temporary anxiety."
    },
    {
      text: "Yesterday one of our interns found a bug that survived two releases, three demos, and one launch checklist.\n\nThe bug itself mattered, but the real win was cultural. She challenged a senior engineer in a public review thread with clear evidence and a test case.\n\nNo eye-rolls, no status games, no 'let us take this offline.' Just curiosity and fast collaboration.\n\nI shared this with the team today because psychological safety is not a poster value. It is visible in tiny moments where junior people disagree and still feel respected.\n\nTalent compounds where speaking up is rewarded before it is polished."
    },
    {
      text: "Quick note for founders hiring a first PM: if priorities shift every Monday, your PM will look inconsistent no matter how strong they are.\n\nI have been in that seat. You build one roadmap, then sales pressure changes everything, then a loud customer escalates, then an investor request lands. The PM appears slow, but the system is unstable.\n\nBefore evaluating PM performance, stabilize decision rights: who can move priority, under what conditions, and how tradeoffs are communicated to engineering and design.\n\nPlanning quality is an organizational output, not an individual personality trait.\n\nSet that foundation first, then hold the PM accountable for throughput and outcomes."
    },
    {
      text: "A teammate told me my feedback was accurate but hard to use. It stung, because I care about helping people grow. She was right.\n\nI used to write observations like 'needs stronger stakeholder management' and call it a day. Correct, but not actionable.\n\nNow every feedback note includes one explicit next behavior and one upcoming situation where they can practice it. Example: 'Before next planning sync, send a one-paragraph pre-read with recommendation + open risk. I can review it with you first.'\n\nPrecision makes development fair.\n\nIf you lead people, ask whether your feedback gives direction or just diagnosis."
    },
    {
      text: "We almost shipped a feature nobody wanted because every internal room said, 'This makes sense.'\n\nThen we ran three customer interviews and everything changed. Users did not want more configuration. They wanted fewer decisions and clearer defaults.\n\nWe removed half the settings, shipped simpler onboarding, and saw activation improve in two weeks.\n\nThe lesson keeps repeating: internal confidence is not external evidence.\n\nBefore your next build cycle, ask one uncomfortable question directly to a user and let that answer challenge your assumptions."
    },
    {
      text: "I keep a private document called 'decisions I regret.' Not to dwell, but to detect patterns.\n\nThe strongest one for me: I move too fast when a senior person sounds certain. I confuse conviction with correctness.\n\nNow, for high-impact decisions, I force a 24-hour delay and ask one person who was not in the original conversation to challenge the recommendation.\n\nIt slowed us down slightly at first and then prevented expensive rework.\n\nMaturity is not never being wrong. It is designing your process so your most predictable errors are harder to repeat."
    },
    {
      text: "My commute used to be my decompression ritual. Remote work removed that boundary, and I did not realize how much it mattered until my sleep got worse.\n\nI now run a 15-minute shutdown routine at 6:30 PM: close open loops, write tomorrow's first task, and send one final asynchronous update so nobody waits on me overnight.\n\nThe work quality did not drop. If anything, it improved because I start mornings with less cognitive residue.\n\nSustainable performance is often less about major life changes and more about repeatable transitions.\n\nIf your day keeps bleeding into your night, design a small ritual and protect it like any other commitment."
    },
    {
      text: "Last quarter we missed a top-line target, but retention still improved meaningfully. If we had reacted only to the headline KPI, we would have made the wrong cuts.\n\nWhen we dug deeper, we saw users were getting value later in the lifecycle than expected. The onboarding metric looked weak, but long-term behavior improved once people crossed a specific usage threshold.\n\nSo we changed our activation definition and invested in faster time-to-threshold instead of chasing vanity growth.\n\nMetrics are directional instruments, not moral judgments.\n\nLook at behavior underneath before you celebrate or panic."
    },
    {
      text: "We introduced a small line in decision docs: 'Who is likely to disagree with this?' It reduced rework more than any process template we launched this year.\n\nTeams now invite dissent earlier, especially from support and implementation folks who see edge cases first.\n\nThe output quality improved because objections arrived before code, not after rollout.\n\nHealthy disagreement is cheaper than late correction.\n\nIf your team repeatedly revisits decisions after launch, your issue might not be speed. It might be missing perspective at decision time."
    },
    {
      text: "Promotion advice I wish I ignored sooner: 'Do more things.' Better advice: own one painful, high-friction problem end-to-end and make it visibly better for everyone around you.\n\nThe projects that moved my career were rarely glamorous. They were broken handoffs, vague ownership, unclear metrics, and recurring fire drills.\n\nI stopped trying to look busy and started trying to reduce organizational drag.\n\nPeople noticed because their day got easier, not because I made more noise.\n\nImpact is often quieter than ambition, but it compounds faster."
    }
  ],
  ai: [
    {
      text: "In today's rapidly evolving digital economy, professionals who thrive are not merely reacting to change, they are engineering adaptive momentum. Over the last 90 days, I have been pressure-testing what I call the Precision Growth Loop: clarity of intent, consistency of execution, and compounding reflection.\n\nWhen teams align these three dimensions, performance stops being random. Effort becomes directional. Energy becomes transferable. Results become repeatable.\n\nThe real unlock is this: you do not need more hours, you need higher signal per hour. That means reducing cognitive fragmentation, operationalizing strategic priorities, and aggressively auditing low-leverage activity.\n\nIf your calendar is full but your trajectory feels flat, your system is likely optimized for motion, not momentum."
    },
    {
      text: "Leadership in 2026 is less about authority and more about orchestration. The most effective operators are integrating human judgment with machine-accelerated insight to make faster, cleaner decisions at scale.\n\nI have seen a repeated pattern across high-performing organizations: they treat communication, data fluency, and adaptive learning as one integrated capability stack.\n\nWhen these skills operate in silos, teams create delay. When they are synchronized, teams create strategic velocity.\n\nYour title may get you attention, but your ability to convert complexity into aligned action is what creates long-term influence."
    },
    {
      text: "I recently ran an experiment using AI-assisted prioritization across my weekly workflow. The outcome was not just higher output, it was significantly higher relevance of output.\n\nBy mapping tasks against impact potential, reversibility, and stakeholder dependency, I identified a major pattern: low-leverage tasks were occupying premium cognitive windows.\n\nAfter rebalancing, execution quality improved across every strategic objective. The key was not working harder. The key was sequencing better.\n\nMany professionals are not underperforming due to lack of ambition. They are underperforming because their attention allocation model is outdated."
    },
    {
      text: "Stop outsourcing your growth to motivation. Motivation is volatile by design. Systems are stable by design.\n\nIn uncertain environments, elite performers build infrastructure for consistency: predefined decision rules, non-negotiable deep-work blocks, and explicit review loops.\n\nThis creates emotional independence from daily mood variance and accelerates compounding progress.\n\nIf your performance depends on how inspired you feel each morning, you are scaling chaos, not capability."
    },
    {
      text: "The era of siloed excellence is over. Modern teams win by integrating speed, empathy, and precision into one execution rhythm that scales trust across functions.\n\nToo many organizations optimize for local efficiency and then wonder why strategic initiatives stall. The missing layer is cross-functional coherence.\n\nWhen product, operations, and go-to-market teams share a unified narrative, decisions move faster and handoffs lose less context.\n\nAlignment is not a meeting cadence. It is an operating discipline."
    },
    {
      text: "Your personal brand is not what you post in moments of inspiration. It is the cumulative reliability of what you ship, how you communicate tradeoffs, and how consistently your behavior reflects your stated values.\n\nNarrative coherence is a strategic asset in a high-noise environment. People trust what feels internally consistent.\n\nIf your ambitions and your habits are misaligned, your brand debt compounds silently.\n\nSustainable credibility is built through repeated evidence, not occasional visibility."
    },
    {
      text: "In a world increasingly shaped by automation, uniquely human capabilities become premium differentiators: judgment under ambiguity, empathic framing, and creative synthesis across disconnected domains.\n\nThe professionals who will outperform over the next decade are those who combine these human advantages with deliberate AI leverage.\n\nDo not frame this as replacement versus resistance. Frame it as capability architecture.\n\nThe question is no longer 'Will AI change my role?' The question is 'How fast can I redesign my role around higher-order value creation?'"
    },
    {
      text: "Career acceleration in 2026 requires learning agility over static expertise. The best operators are becoming perpetual students with a bias toward experimentation, reflection, and rapid calibration.\n\nKnowledge half-life is shrinking. Fixed playbooks decay quickly. Adaptive frameworks persist.\n\nIf your growth strategy assumes environmental stability, your strategy is already outdated.\n\nBuild meta-skills that travel: sense-making, communication under uncertainty, and decision quality under incomplete information."
    },
    {
      text: "When uncertainty rises, principles matter more than plans. Plans are perishable; principles are portable.\n\nIn volatile operating contexts, I return to four non-negotiables: clarity before scale, speed with accountability, explicit tradeoffs, and structured retrospection.\n\nThese principles create coherence even when conditions change faster than forecasts.\n\nIf your team feels directionless during change, the issue may not be planning rigor. It may be principle ambiguity."
    },
    {
      text: "Execution excellence is less about short bursts of intensity and more about sustainable rhythm. Consistent cadence outperforms occasional heroics in every durable operating system.\n\nI recommend a simple weekly architecture: one strategic focus, three measurable commitments, one reflection checkpoint.\n\nThis structure reduces noise while preserving adaptability.\n\nWhen professionals say they are overwhelmed, it is often not a volume problem. It is a sequencing problem without a governing cadence."
    },
    {
      text: "Innovation is not a department. Innovation is a behavior pattern repeated at team scale: curiosity, rapid feedback, disciplined iteration, and transparent learning loops.\n\nOrganizations that institutionalize this pattern do not just launch faster. They recover faster when assumptions break.\n\nResilience is not accidental. It is designed through operating habits that normalize learning speed.\n\nIf your team is afraid to run small experiments, you are paying hidden interest on certainty theater."
    },
    {
      text: "Communication is the highest-leverage force multiplier in modern organizations. The ability to transform complexity into clear, shared action can compress weeks of ambiguity into one aligned decision cycle.\n\nMost execution delays are not caused by low effort. They are caused by fragmented interpretation.\n\nWhen leaders clarify context, constraints, and desired outcomes with precision, teams stop guessing and start building.\n\nClarity is not simplification. Clarity is strategic compression."
    }
  ]
};

const els = {
  introOverlay: document.getElementById("intro-overlay"),
  startBtn: document.getElementById("start-btn"),
  quizCard: document.getElementById("quiz-card"),
  resultCard: document.getElementById("result-card"),
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
  feedback: document.getElementById("feedback"),
  finalScore: document.getElementById("final-score"),
  finalDetail: document.getElementById("final-detail"),
  restartBtn: document.getElementById("restart-btn")
};

const state = {
  questions: [],
  index: 0,
  score: 0,
  answered: false,
  userAnswers: [],
  questionTimer: null,
  resultHoldTimer: null,
  timerStartedAt: 0,
  timerDuration: 0
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

function normalizeRemotePosts(remote) {
  const normalized = { human: [], ai: [] };

  if (!Array.isArray(remote)) {
    return normalized;
  }

  remote.forEach((item) => {
    if (!item || typeof item.text !== "string" || typeof item.label !== "string") {
      return;
    }

    const label = item.label.trim().toLowerCase();
    if (label !== "human" && label !== "ai") {
      return;
    }

    normalized[label].push({ text: item.text.trim() });
  });

  return normalized;
}

async function loadPosts() {
  if (!REMOTE_POSTS_URL) {
    return fallbackPosts;
  }

  try {
    const response = await fetch(REMOTE_POSTS_URL, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch posts: ${response.status}`);
    }

    const remotePosts = await response.json();
    const normalized = normalizeRemotePosts(remotePosts);

    if (normalized.human.length >= QUIZ_LENGTH && normalized.ai.length >= QUIZ_LENGTH) {
      return normalized;
    }

    return {
      human: [...fallbackPosts.human, ...normalized.human],
      ai: [...fallbackPosts.ai, ...normalized.ai]
    };
  } catch (error) {
    console.warn("Using fallback post bank", error);
    return fallbackPosts;
  }
}

function buildQuizQuestions(postBank) {
  const aiCount = randomInt(MIN_AI_POSTS, MAX_AI_POSTS);
  const humanCount = QUIZ_LENGTH - aiCount;

  if (postBank.ai.length < aiCount || postBank.human.length < humanCount) {
    throw new Error("Post bank is too small to generate a new quiz.");
  }

  const aiQuestions = pickRandom(postBank.ai, aiCount).map((p) => ({
    text: p.text,
    answer: "ai"
  }));

  const humanQuestions = pickRandom(postBank.human, humanCount).map((p) => ({
    text: p.text,
    answer: "human"
  }));

  return shuffle([...aiQuestions, ...humanQuestions]);
}

function resetRoundState() {
  clearTimers();
  state.index = 0;
  state.score = 0;
  state.answered = false;
  state.userAnswers = [];
  els.feedback.textContent = "";
  els.feedback.className = "feedback";
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
  state.index += 1;
  if (finishQuizIfNeeded()) {
    return;
  }

  renderCurrentQuestion();
}

function startResultHoldCountdown() {
  clearTimers();
  state.timerStartedAt = Date.now();
  state.timerDuration = RESULT_HOLD_SECONDS;

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

  els.feedback.textContent = `${pickMessage(timeoutFeedbackLines)} Correct answer: ${q.answer.toUpperCase()}.`;
  els.feedback.className = "feedback bad";

  lockAnswerButtons();
  startResultHoldCountdown();
}

function startQuestionCountdown() {
  clearTimers();

  state.timerStartedAt = Date.now();
  state.timerDuration = QUESTION_TIME_LIMIT_SECONDS;

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
  els.feedback.textContent = "Pick your guess before the timer runs out.";
  els.feedback.className = "feedback";

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
    els.feedback.textContent = pickMessage(correctFeedbackLines);
    els.feedback.className = "feedback good";
  } else {
    els.feedback.textContent = `${pickMessage(wrongFeedbackLines)} Correct answer: ${q.answer.toUpperCase()}.`;
    els.feedback.className = "feedback bad";
  }

  lockAnswerButtons();
  updateMeta();
  startResultHoldCountdown();
}

function showResults() {
  clearTimers();
  setTimerBarVisible(false);

  els.quizCard.classList.add("hidden");
  els.resultCard.classList.remove("hidden");

  const percentage = Math.round((state.score / QUIZ_LENGTH) * 100);
  els.finalScore.textContent = `You scored ${state.score} out of ${QUIZ_LENGTH} (${percentage}%).`;

  if (percentage >= 80) {
    els.finalDetail.textContent = "Absolute mind-reader mode. Your AI detector is elite.";
  } else if (percentage >= 60) {
    els.finalDetail.textContent = "Strong instincts. You caught most of the tricks.";
  } else {
    els.finalDetail.textContent = "Wild round. Run it back and sharpen that radar.";
  }
}

async function startGame() {
  clearTimers();

  const postBank = await loadPosts();
  state.questions = buildQuizQuestions(postBank);

  resetRoundState();
  els.resultCard.classList.add("hidden");
  els.quizCard.classList.remove("hidden");
  renderCurrentQuestion();
}

function startGameFromOverlay() {
  els.introOverlay.classList.add("hidden");
  startGame();
}

els.humanBtn.addEventListener("click", () => submitAnswer("human"));
els.aiBtn.addEventListener("click", () => submitAnswer("ai"));
els.restartBtn.addEventListener("click", startGame);
els.startBtn.addEventListener("click", startGameFromOverlay);

setTimerBarVisible(false);
