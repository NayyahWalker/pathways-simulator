const pathways = {
  low: {
    label: "Low SES",
    slope: 0.241,
    resourceIndex: 48,
    supportEffects: { none: 0, moderate: 2.5, strong: 5 },
  },
  average: {
    label: "Average SES",
    slope: 0.201,
    resourceIndex: 53,
    supportEffects: { none: 0, moderate: 1.5, strong: 3 },
  },
  high: {
    label: "High SES",
    slope: 0.162,
    resourceIndex: 58,
    supportEffects: { none: 0, moderate: 0.75, strong: 1.5 },
  },
};

const supportLabels = {
  none: "No support",
  moderate: "Moderate support",
  strong: "Strong support",
};

const workingMemoryScale = 8;

const form = document.querySelector("#simulator-form");
const liveRegion = document.querySelector("#live-region");
const memoryInput = document.querySelector("#memory-score");
const memoryOutput = document.querySelector("#memory-output");
const memoryControl = document.querySelector("#memory-control");
const sesControl = document.querySelector("#ses-control");
const supportControl = document.querySelector("#support-control");
const scenarioCards = document.querySelectorAll(".scenario-card");
const activePreset = document.querySelector("#active-preset");
const audioToggle = document.querySelector("#audio-description-toggle");
const controlGroups = {
  ses: document.querySelector("#ses-group"),
  memory: document.querySelector("#memory-group"),
  support: document.querySelector("#support-group"),
};
const resetPathwayButton = document.querySelector("#reset-pathway");
const scenarioNotice = document.querySelector("#scenario-notice");
const activeScenarioLabel = document.querySelector("#active-scenario-label");
const predictedScore = document.querySelector("#predicted-score");
const scoreWrap = document.querySelector("#score-wrap");
const singleBarFill = document.querySelector("#single-bar-fill");
const mobileResultsDock = document.querySelector("#mobile-results-dock");
const mobileScore = document.querySelector("#mobile-score");
const mobileGrowthLabel = document.querySelector("#mobile-growth-label");
const changeLabel = document.querySelector("#change-label");
const supportDeltaBadge = document.querySelector("#support-delta-badge");
const growthLabel = document.querySelector("#growth-label");
const insightBox = document.querySelector(".interaction-insight");
const insightText = document.querySelector("#interaction-insight-text");
const pathwayContextBadge = document.querySelector("#pathway-context-badge");
const studentExampleText = document.querySelector("#student-example-text");
const storyBefore = document.querySelector("#storyBefore");
const storyAfter = document.querySelector("#storyAfter");
const storyChange = document.querySelector("#storyChange");
const storyWhy = document.querySelector("#storyWhy");
const mayaCaseStudy = document.querySelector("#maya-case-study");
const listenButtons = document.querySelectorAll(".listen-btn");
const storySections = {
  before: document.querySelector("#story-section-before"),
  after: document.querySelector("#story-section-after"),
  change: document.querySelector("#story-section-change"),
  why: document.querySelector("#story-section-why"),
};
const comparisonChart = document.querySelector("#comparison-chart");
const supportChart = document.querySelector("#support-chart");
const gapMini = document.querySelector("#gap-mini");
const supportComparisonGrid = document.querySelector("#support-comparison-grid");
const gapChart = document.querySelector("#gap-chart");
const tabButtons = document.querySelectorAll(".tab-button");
const tabPanels = document.querySelectorAll(".tab-panel");
const liveResults = document.querySelector("#live-results");
const contrastToggle = document.querySelector("#contrast-toggle");
const outcomeSummary = document.querySelector("#outcome-summary");
const comparisonChartDescription = document.querySelector("#comparison-chart-description");
const comparisonSummary = document.querySelector("#comparison-summary");
const supportChartDescription = document.querySelector("#support-chart-description");
const supportSummary = document.querySelector("#support-summary");
const gapChartDescription = document.querySelector("#gap-chart-description");
const gapSummary = document.querySelector("#gap-summary");
const fullSupportChartDescription = document.querySelector("#full-support-chart-description");
const fullSupportSummary = document.querySelector("#full-support-summary");
const fullGapChartDescription = document.querySelector("#full-gap-chart-description");
const fullGapSummary = document.querySelector("#full-gap-summary");
const detailPanels = document.querySelectorAll("details");
const supportContextText = document.querySelector("#support-context-text");
const supportRecommendationsList = document.querySelector("#support-recommendations");
const storyActionBridge = document.querySelector("#storyActionBridge");
const modeInputs = document.querySelectorAll('input[name="exploration-mode"]');
const guidedStepPanel = document.querySelector("#guided-step-panel");
const guidedProgress = document.querySelector("#guided-progress");
const guidedStepTitle = document.querySelector("#guided-step-title");
const guidedStepPrompt = document.querySelector("#guided-step-prompt");
const guidedTask = document.querySelector("#guided-task");
const guidedStepAction = document.querySelector("#guided-step-action");
const guidedStepNote = document.querySelector("#guided-step-note");
const guidedBack = document.querySelector("#guided-back");
const guidedNext = document.querySelector("#guided-next");
const guidedComplete = document.querySelector("#guided-complete");
const guidedExploreFree = document.querySelector("#guided-explore-free");
const guidedRestart = document.querySelector("#guided-restart");
const simulator = document.querySelector("#interactive-simulator");
const guidedFocusAnnouncement = document.querySelector("#guided-focus-announcement");
const tutorialFocusHeading = document.querySelector("#tutorial-focus-heading");
const guidedStickyNav = document.querySelector("#guided-sticky-nav");
const stickyGuidedProgress = document.querySelector("#sticky-guided-progress");
const stickyGuidedTitle = document.querySelector("#sticky-guided-title");
const stickyGuidedBack = document.querySelector("#sticky-guided-back");
const stickyGuidedAction = document.querySelector("#sticky-guided-action");
const stickyGuidedNext = document.querySelector("#sticky-guided-next");
const stickyGuidedActions = document.querySelector("#sticky-guided-actions");
const stickyGuidedComplete = document.querySelector("#sticky-guided-complete");
const stickyGuidedFree = document.querySelector("#sticky-guided-free");
const stickyGuidedRestart = document.querySelector("#sticky-guided-restart");
const tutorialCloseButtons = document.querySelectorAll(".tutorial-close");

const previousChartWidths = new Map();
const scenarioState = { environment: 0, support: 0, skills: 0 };
const scenarioNames = {
  environment: "Same skill, different environment",
  support: "Impact of support",
  skills: "Strong skills, different outcomes",
};

let previousInteractionState = null;
let pendingInsightTrigger = "initial";
let activeScenarioName = "Custom pathway";
let highlightTimer;
let noticeTimer;
let insightTimer;
let bridgeFlashTimer;
let guidedStepIndex = 0;
let guidedTutorialComplete = false;
let guidedStepApplied = [false, false, false];
let currentUtterance = null;
let currentButton = null;
window.audioEnabled = true;
window.audioDescriptionEnabled = audioToggle ? audioToggle.checked : true;
const tutorialClosedStorageKey = "tutorialClosed";
const contrastModes = ["default", "light", "dark"];
let contrastMode = localStorage.getItem("pathwaysContrastMode") || "default";

const guidedSteps = [
  {
    title: "Same skill, different environments",
    prompt: "Let's look at this together. Start with the same working memory level and compare how reading growth changes across SES contexts.",
    task: "Task: Keep working memory at 5. Change SES and notice how the outcome shifts.",
    actionLabel: "Try this step",
    note: "Notice how the same working memory level can appear differently across environments.",
    target: "ses",
    focusName: "Socioeconomic status controls",
  },
  {
    title: "Add support",
    prompt: "Now try adding support. What changes when the environment around reading becomes stronger?",
    task: "Task: Keep SES low. Add strong support and notice what changes.",
    actionLabel: "Try this step",
    note: "Notice how added support changes the reading growth estimate without changing the child's ability.",
    target: "support",
    focusName: "Resource support controls",
  },
  {
    title: "Compare outcomes",
    prompt: "What changed in the reading pathway? Now compare the same student pathway before and after support.",
    task: "Task: Compare before and after support. Look for how the gap changes.",
    actionLabel: "Try this step",
    note: "Notice how targeted supports may narrow outcome gaps.",
    target: "results",
    focusName: "Support Impact results",
  },
];

function scrollBehavior() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
}

function updateLiveRegion(text) {
  liveRegion.textContent = text;
  const audioLiveRegion = document.getElementById("audio-live-region");
  if (audioLiveRegion) {
    audioLiveRegion.textContent = text;
  }
}

function speak(text) {
  if (!window.audioEnabled || !window.audioDescriptionEnabled || !("speechSynthesis" in window)) return;

  stopCurrentAudio();
  const speech = new SpeechSynthesisUtterance(text);
  currentUtterance = speech;
  speech.onend = () => {
    currentUtterance = null;
  };
  speech.onerror = () => {
    currentUtterance = null;
  };
  window.speechSynthesis.speak(speech);
}

function getReadableText(section) {
  return section.innerText
    .replace(/🔊 Listen/g, "")
    .replace(/Listen to research question/g, "")
    .replace(/Listen to plain language summary/g, "")
    .replace(/Listen to simulator overview/g, "")
    .replace(/Listen to live results/g, "")
    .replace(/Listen to Maya's story/g, "")
    .replace(/Listen to real-life supports/g, "")
    .replace(/Listen to deeper context overview/g, "")
    .replace(/Listen to what SES means/g, "")
    .replace(/Listen to working memory explanation/g, "")
    .replace(/Listen to why early reading matters/g, "")
    .replace(/Listen to resource intervention/g, "")
    .replace(/Listen to project materials/g, "")
    .replace(/Listen to data source and disclaimer/g, "")
    .replace(/■ Stop/g, "")
    .replace(/Stop all audio/g, "")
    .trim();
}

function resetListenButtons() {
  document.querySelectorAll(".listen-btn").forEach((button) => {
    button.textContent = button.dataset.originalText || button.getAttribute("data-original-text") || "🔊 Listen";
    button.setAttribute("aria-pressed", "false");
    button.classList.remove("is-speaking");
  });
}

function stopCurrentAudio() {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.resume();
    window.speechSynthesis.cancel();
  }

  resetListenButtons();
  currentUtterance = null;
  currentButton = null;
}

function toggleAudio() {
  const stopButton = document.getElementById("stop-all-audio");
  const audioDescriptionToggle = document.getElementById("audio-description-toggle");
  const audioLiveRegion = document.getElementById("audio-live-region");

  if (window.audioEnabled) {
    stopCurrentAudio();

    if (audioDescriptionToggle) {
      audioDescriptionToggle.checked = false;
      audioDescriptionToggle.dispatchEvent(new Event("change"));
    }

    window.audioEnabled = false;
    window.audioDescriptionEnabled = false;

    if (stopButton) {
      stopButton.textContent = "Turn audio on";
      stopButton.setAttribute("aria-label", "Turn audio back on");
    }

    if (audioLiveRegion) {
      audioLiveRegion.textContent = "Audio turned off.";
    }
    return;
  }

  window.audioEnabled = true;
  window.audioDescriptionEnabled = true;

  if (audioDescriptionToggle) {
    audioDescriptionToggle.checked = true;
    audioDescriptionToggle.dispatchEvent(new Event("change"));
  }

  if (stopButton) {
    stopButton.textContent = "Stop all audio";
    stopButton.setAttribute("aria-label", "Stop all audio playback");
  }

  if (audioLiveRegion) {
    audioLiveRegion.textContent = "Audio turned on.";
  }
}

function stopSpeech() {
  stopCurrentAudio();
}

function applyContrastMode(mode) {
  contrastMode = mode;
  document.body.classList.toggle("high-contrast", mode === "light");
  document.body.classList.toggle("high-contrast-dark", mode === "dark");
  localStorage.setItem("pathwaysContrastMode", mode);

  const labels = {
    default: "Contrast: Default",
    light: "Contrast: Light",
    dark: "Contrast: Dark",
  };
  const messages = {
    default: "Default contrast mode enabled",
    light: "Light high contrast mode enabled",
    dark: "Dark high contrast mode enabled",
  };

  contrastToggle.textContent = labels[mode];
  contrastToggle.setAttribute("aria-label", "Change contrast mode");
  updateLiveRegion(messages[mode]);
}

function cycleContrastMode() {
  const currentIndex = contrastModes.indexOf(contrastMode);
  const nextMode = contrastModes[(currentIndex + 1) % contrastModes.length];
  applyContrastMode(nextMode);
}

function supportEffectFor(ses, level = "none") {
  return pathways[ses].supportEffects[level];
}

function scoreFor(ses, memory, supportLevel = "none") {
  const pathway = pathways[ses];
  return pathway.resourceIndex + pathway.slope * memory * workingMemoryScale + supportEffectFor(ses, supportLevel);
}

function selectedSes() {
  return new FormData(form).get("ses");
}

function selectedSupport() {
  return new FormData(form).get("support");
}

function selectedExplorationMode() {
  const selected = document.querySelector('input[name="exploration-mode"]:checked');
  return selected ? selected.value : "guided";
}

function formatScore(value) {
  return value.toFixed(2);
}

function memoryLevel(memory) {
  if (memory <= 3) return "low";
  if (memory <= 7) return "moderate";
  return "high";
}

function capitalizedMemoryLevel(memory) {
  const level = memoryLevel(memory);
  return `${level.charAt(0).toUpperCase()}${level.slice(1)}`;
}

function growthInterpretation(score) {
  if (score < 40) return "Lower expected reading growth in this context";
  if (score <= 70) return "Moderate expected reading growth";
  return "Stronger expected reading growth";
}

function supportContextFor(supportLevel) {
  const contexts = {
    none: "Limited support environment — these supports may not yet be consistently available",
    moderate: "Some supports are present — strengthening consistency may improve outcomes",
    strong: "Strong support environment — these strategies help maximize growth",
  };
  return contexts[supportLevel];
}

function supportIntroFor(supportLevel) {
  const intros = {
    none: "The suggestions below show supports that could strengthen the reading pathway if they become available.",
    moderate: "The suggestions below focus on making existing supports more consistent and easier to use.",
    strong: "The suggestions below show how a strong support environment can deepen reading growth.",
  };
  return intros[supportLevel];
}

function getSupportRecommendations(sesLevel, workingMemoryLevel, supportLevel) {
  let recommendations = [];

  if (sesLevel === "low") {
    if (workingMemoryLevel <= 4) {
      recommendations = [
        "Consistent access to books (school lending programs, classroom libraries)",
        "Structured daily reading time (10–20 minutes with guidance)",
        "Small-group or one-on-one literacy support",
        "Explicit instruction in decoding and comprehension strategies",
        "Caregiver-supported reading routines when possible",
      ];
    } else if (workingMemoryLevel <= 7) {
      recommendations = [
        "Regular access to books at home or school",
        "Guided reading groups to build confidence",
        "Chunking longer texts into manageable sections",
        "Vocabulary and comprehension scaffolds",
        "Opportunities for repeated reading practice",
      ];
    } else {
      recommendations = [
        "Expanded access to diverse and engaging texts",
        "Independent reading time with light structure",
        "Discussion-based comprehension activities",
        "Opportunities to explore topics of interest through reading",
        "Sustained reading routines to maintain growth",
      ];
    }
  }

  if (sesLevel === "average") {
    if (workingMemoryLevel <= 4) {
      recommendations = [
        "Targeted reading intervention or tutoring",
        "Structured reading routines at school and home",
        "Step-by-step reading strategies for complex tasks",
        "Frequent comprehension check-ins",
        "Use of visual aids and organizers",
      ];
    } else if (workingMemoryLevel <= 7) {
      recommendations = [
        "Consistent independent reading time",
        "Guided practice with increasingly complex texts",
        "Vocabulary-building activities",
        "Balanced mix of independent and supported reading",
        "Exposure to different genres",
      ];
    } else {
      recommendations = [
        "Access to advanced or challenging texts",
        "Cross-subject reading integration (science, history)",
        "Opportunities for discussion and analysis",
        "Writing activities connected to reading",
        "Enrichment programs or clubs",
      ];
    }
  }

  if (sesLevel === "high") {
    if (workingMemoryLevel <= 4) {
      recommendations = [
        "Targeted literacy intervention despite resource availability",
        "Structured reading routines with close monitoring",
        "Explicit instruction in comprehension strategies",
        "Breaking down complex tasks into steps",
        "Consistent feedback and support",
      ];
    } else if (workingMemoryLevel <= 7) {
      recommendations = [
        "Regular independent reading with guidance",
        "Gradual increase in text complexity",
        "Opportunities for reflection and discussion",
        "Vocabulary and comprehension expansion",
        "Balanced structured and independent tasks",
      ];
    } else {
      recommendations = [
        "Advanced reading materials and enrichment opportunities",
        "Independent research or project-based reading",
        "Critical thinking and analysis activities",
        "Integration of reading with writing and discussion",
        "Opportunities for leadership or peer mentoring",
      ];
    }
  }

  return [supportContextFor(supportLevel), ...recommendations].slice(0, 6);
}

function renderSupportRecommendations(sesLevel, workingMemoryLevel, supportLevel) {
  const recommendations = getSupportRecommendations(sesLevel, workingMemoryLevel, supportLevel);
  supportContextText.textContent = supportIntroFor(supportLevel);
  supportRecommendationsList.innerHTML = recommendations.map((recommendation, index) => `
    <li class="${index === 0 ? "context-item" : ""}">
      <span aria-hidden="true">${index === 0 ? "i" : "✓"}</span>
      <span>${recommendation}</span>
    </li>
  `).join("");
}

function updateStoryActionBridge(SES, supportLevel) {
  window.clearTimeout(bridgeFlashTimer);
  let text = "";

  if (supportLevel === "none") {
    text = "These are supports that are often missing or inconsistent in Maya's scenario.";
  }

  if (supportLevel === "moderate") {
    text = "These are supports Maya is beginning to experience.";
  }

  if (supportLevel === "strong") {
    text = "These supports are consistently available and help reinforce Maya's reading growth.";
  }

  if (SES === "low" && supportLevel === "strong") {
    text += " This kind of support can be especially impactful in contexts where resources were previously limited.";
  }

  storyActionBridge.textContent = text;
  storyActionBridge.classList.remove("flash");
  void storyActionBridge.offsetWidth;
  storyActionBridge.classList.add("flash");

  bridgeFlashTimer = window.setTimeout(() => {
    storyActionBridge.classList.remove("flash");
  }, 500);
}

function highlightedStoryPart(previousState, currentState) {
  if (!previousState) return "before";
  if (previousState.support !== currentState.support) return "after";
  if (previousState.ses !== currentState.ses || previousState.memory !== currentState.memory) return "before";
  return "change";
}

function updateStudentStory(memoryLevel, SES, supportLevel, previousState, currentState) {
  let before = "";
  let after = "";
  let change = "";
  let why = "";

  if (memoryLevel <= 4) {
    before = "Maya has difficulty keeping track of multi-step reading tasks and may lose focus when texts become longer.";
  } else if (memoryLevel <= 7) {
    before = "Maya understands instructions but may struggle to manage longer or more complex reading tasks independently.";
  } else {
    before = "Maya has strong working memory skills and can manage complex reading tasks with relative ease.";
  }

  if (SES === "low") {
    before += " Limited access to consistent resources makes it harder to build steady reading habits.";
  }

  if (SES === "high") {
    before += " Her environment provides more consistent access to books and learning supports.";
  }

  if (supportLevel === "none") {
    after = "Without additional support, these challenges may persist, making reading feel increasingly frustrating over time.";
    change = "Without structured support, effort does not consistently translate into progress.";
    why = "Effort alone is not always enough when reading support is inconsistent.";
  }

  if (supportLevel === "moderate") {
    after = "With some access to books and structured reading time, Maya begins to build more confidence and consistency in reading.";
    change = "Regular exposure and guidance help her turn effort into steady improvement.";
    why = "Some consistent support gives Maya more chances to practice, revisit ideas, and build confidence.";
  }

  if (supportLevel === "strong") {
    after = "With consistent access to books, structured reading routines, and targeted instruction, Maya becomes more confident and engaged with longer texts.";
    change = "Strong, consistent support helps her fully translate cognitive strengths into reading growth.";
    why = "Consistent access, guided practice, and structured reading routines help skills translate into growth.";
  }

  if (SES === "low" && supportLevel === "strong") {
    change += " This shift is especially meaningful in contexts where resources were previously limited.";
  }

  storyBefore.textContent = before;
  storyAfter.textContent = after;
  storyChange.textContent = change;
  storyWhy.textContent = why;

  Object.values(storySections).forEach((section) => section.classList.remove("story-section-updated"));
  const sectionKey = highlightedStoryPart(previousState, currentState);
  storySections[sectionKey].classList.add("story-section-updated");

  mayaCaseStudy.classList.remove("case-study-updated");
  void mayaCaseStudy.offsetWidth;
  mayaCaseStudy.classList.add("case-study-updated");
}

function pathwayContextFor(ses, support) {
  if (ses === "high" || support === "strong") {
    return {
      className: "resource-rich",
      label: "Resource-rich environment",
      title: "Consistent access to learning resources and support",
    };
  }

  if ((ses === "low" || ses === "average") && support === "moderate") {
    return {
      className: "moderate",
      label: "Moderate support scenario",
      title: "Some supports available, but variable",
    };
  }

  return {
    className: "limited",
    label: "Limited support scenario",
    title: "Fewer consistent resources available",
  };
}

function insightFor(previousState, currentState, trigger = "control") {
  if (trigger === "environment") return "SES context changed. Same skill, different environments can shift the reading pathway.";
  if (trigger === "support") return "Resource support changed. Supports can help early skills translate into reading growth.";
  if (trigger === "skills") return "Working memory level changed. Strong skills still develop within environments.";
  if (!previousState) return "Adjust the controls to explore how working memory, SES, and support shape reading growth.";
  if (previousState.memory !== currentState.memory) return "Working memory level changed.";
  if (previousState.ses !== currentState.ses) return "SES context changed.";
  if (previousState.support !== currentState.support) {
    const direction = supportEffectFor(currentState.ses, currentState.support) > supportEffectFor(currentState.ses, previousState.support)
      ? "increased"
      : "changed";
    return direction === "increased"
      ? "Resource support increased the reading growth estimate."
      : "Resource support changed the reading growth estimate.";
  }
  return "Pathway updated.";
}

function changeLabelFor(previousState, currentState, trigger = "control") {
  if (!previousState && trigger === "initial") return "Ready to explore";
  if (trigger === "environment" || previousState?.ses !== currentState.ses) return "SES context changed";
  if (trigger === "support" || previousState?.support !== currentState.support) return "Resource support changed";
  if (trigger === "skills" || previousState?.memory !== currentState.memory) return "Working memory level changed";
  return "Custom pathway updated";
}

function setChangeLabel(text) {
  changeLabel.textContent = text;
  changeLabel.classList.toggle("ready-label", text === "Ready to explore");
}

function barWidth(score, floor = 0, ceiling = 100) {
  return Math.max(Math.min(((score - floor) / (ceiling - floor)) * 100, 100), 5);
}

function setRadio(name, value) {
  const input = form.querySelector(`input[name="${name}"][value="${value}"]`);
  if (input) input.checked = true;
}

function selectedRadioLabel(name) {
  const input = form.querySelector(`input[name="${name}"]:checked`);
  return input ? input.closest("label") : null;
}

function setActiveScenario(type) {
  activeScenarioName = type ? `Active scenario: ${scenarioNames[type]}` : "Custom pathway";
  activeScenarioLabel.textContent = activeScenarioName;
  activePreset.classList.toggle("is-hidden", !type);
  activePreset.textContent = type ? `Preset applied: ${scenarioNames[type]}` : "";
  scenarioCards.forEach((card) => {
    card.classList.toggle("is-active", card.dataset.scenario === type);
  });
}

function highlightControlGroups(groups = Object.values(controlGroups)) {
  groups.forEach((group) => {
    if (!group) return;
    group.classList.remove("updated");
    void group.offsetWidth;
    group.classList.add("updated");
  });
}

function clearAnimations() {
  window.clearTimeout(highlightTimer);
  window.clearTimeout(noticeTimer);
  window.clearTimeout(insightTimer);
  document.querySelectorAll(".scenario-pulse, .score-glow, .story-updated, .updated").forEach((element) => {
    element.classList.remove("scenario-pulse", "score-glow", "story-updated", "updated");
  });
}

function clearScenarioPolish() {
  clearAnimations();
  scenarioNotice.classList.add("is-hidden");
  scenarioNotice.textContent = "";
}

function pulseElements(elements) {
  elements.forEach((element) => {
    if (element) element.classList.add("scenario-pulse");
  });

  highlightTimer = window.setTimeout(() => {
    document.querySelectorAll(".scenario-pulse").forEach((element) => element.classList.remove("scenario-pulse"));
  }, 850);
}

function guidedTargetElement(stepIndex = guidedStepIndex) {
  const target = guidedSteps[stepIndex].target;
  if (target === "ses") return sesControl;
  if (target === "support") return supportControl;
  return document.querySelector("#panel-support");
}

function guidedFocusLabel(stepIndex = guidedStepIndex) {
  return `Tutorial focus: ${guidedSteps[stepIndex].focusName}`;
}

function updateGuidedAttention() {
  const supportPanel = document.querySelector("#panel-support");
  [sesControl, supportControl, memoryControl, liveResults, supportPanel].forEach((element) => {
    element.classList.remove("guided-current", "guided-dim");
  });
  tutorialFocusHeading.classList.add("is-hidden");

  if (selectedExplorationMode() !== "guided") return;

  const current = guidedTargetElement();
  [sesControl, supportControl, memoryControl, liveResults].forEach((element) => {
    element.classList.toggle("guided-current", element === current);
    element.classList.toggle("guided-dim", element !== current);
  });
  if (guidedStepIndex === 2) {
    liveResults.classList.add("guided-current");
    liveResults.classList.remove("guided-dim");
  }
  current.classList.add("guided-current");
  tutorialFocusHeading.textContent = guidedFocusLabel();
  tutorialFocusHeading.classList.remove("is-hidden");
  current.parentNode.insertBefore(tutorialFocusHeading, current);
  guidedFocusAnnouncement.textContent = `Tutorial focus moved to ${guidedSteps[guidedStepIndex].focusName}.`;
}

function moveToGuidedTarget(shouldFocusHeading = true) {
  const target = guidedTargetElement();
  if (guidedStepIndex === 2) {
    setActiveTab("support");
  }
  target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  pulseElements([target]);
  if (shouldFocusHeading) {
    const focusTarget = guidedStepIndex === 2
      ? document.querySelector("#panel-support h3")
      : guidedStepTitle;
    window.setTimeout(() => focusTarget.focus({ preventScroll: true }), scrollBehavior() === "auto" ? 0 : 250);
  }
}

function scenarioNoticeFor(type) {
  const notices = {
    environment: "Notice: the same working memory level is now shown in a different SES context.",
    support: "Notice: resource support changed the estimated reading growth level.",
    skills: "Notice: strong skills still depend on the environment around them.",
  };
  return notices[type];
}

function showScenarioPolish(type) {
  clearScenarioPolish();
  scenarioNotice.textContent = scenarioNoticeFor(type);
  scenarioNotice.classList.remove("is-hidden");

  pulseElements([selectedRadioLabel("ses"), memoryControl, selectedRadioLabel("support"), scoreWrap, comparisonChart]);

  noticeTimer = window.setTimeout(() => {
    scenarioNotice.classList.add("is-hidden");
  }, 2600);
}

function renderGuidedStep(shouldFocus = false) {
  const step = guidedSteps[guidedStepIndex];
  const applied = guidedStepApplied[guidedStepIndex];
  guidedProgress.textContent = `Step ${guidedStepIndex + 1} of ${guidedSteps.length}`;
  stickyGuidedProgress.textContent = guidedProgress.textContent;
  guidedStepTitle.textContent = step.title;
  stickyGuidedTitle.textContent = step.title;
  guidedStepPrompt.textContent = step.prompt;
  guidedTask.textContent = step.task;
  guidedStepAction.textContent = applied ? "Step applied" : step.actionLabel;
  stickyGuidedAction.textContent = guidedStepAction.textContent;
  guidedStepNote.textContent = "";
  const backDisabled = guidedStepIndex === 0;
  guidedBack.disabled = backDisabled;
  stickyGuidedBack.disabled = backDisabled;
  guidedBack.setAttribute("aria-disabled", String(backDisabled));
  stickyGuidedBack.setAttribute("aria-disabled", String(backDisabled));
  guidedNext.disabled = false;
  guidedNext.textContent = guidedStepIndex === guidedSteps.length - 1 ? "Finish tutorial" : "Next";
  stickyGuidedNext.textContent = guidedNext.textContent;
  updateGuidedButtonStates(applied);
  guidedComplete.classList.add("is-hidden");
  stickyGuidedActions.classList.toggle("is-hidden", guidedTutorialComplete);
  stickyGuidedComplete.classList.toggle("is-hidden", !guidedTutorialComplete);
  updateGuidedAttention();

  if (shouldFocus) {
    guidedStepTitle.focus({ preventScroll: false });
    moveToGuidedTarget(false);
  }
}

function setButtonState(button, state) {
  button.classList.remove("btn-disabled", "btn-secondary", "btn-primary", "btn-recommended");
  button.classList.add(`btn-${state}`);
}

function setRecommendedLabel(button, label, recommended) {
  button.setAttribute("aria-label", recommended ? `Recommended next action: ${label}` : label);
}

function updateModeToggleState(mode) {
  modeInputs.forEach((input) => {
    const label = input.closest("label");
    const isActive = input.value === mode;
    if (!label) return;
    label.classList.add("toggle-btn", "mode-option");
    label.classList.toggle("active", isActive);
    label.setAttribute("aria-pressed", String(isActive));
  });
}

function updateGuidedButtonStates(applied = guidedStepApplied[guidedStepIndex]) {
  const backDisabled = guidedStepIndex === 0;
  [guidedBack, stickyGuidedBack].forEach((button) => {
    setButtonState(button, backDisabled ? "disabled" : "secondary");
    button.disabled = backDisabled;
    button.setAttribute("aria-disabled", String(backDisabled));
    button.setAttribute("aria-label", "Go to previous guided step");
  });

  [guidedStepAction, stickyGuidedAction].forEach((button) => {
    setButtonState(button, applied ? "secondary" : "recommended");
    setRecommendedLabel(button, "Try current guided step", !applied);
  });

  [guidedNext, stickyGuidedNext].forEach((button) => {
    setButtonState(button, applied ? "recommended" : "secondary");
    setRecommendedLabel(button, guidedStepIndex === guidedSteps.length - 1 ? "Finish tutorial" : "Go to next guided step", applied);
  });
}

function setExplorationMode(mode, shouldFocus = false) {
  updateModeToggleState(mode);
  if (mode === "guided") {
    localStorage.removeItem(tutorialClosedStorageKey);
    document.querySelectorAll(".tutorial-controls, .tutorial-action-bar").forEach((element) => {
      element.style.display = "";
    });
  }
  guidedStepPanel.classList.toggle("is-hidden", mode !== "guided");
  guidedStickyNav.classList.toggle("is-hidden", mode !== "guided");
  document.body.classList.toggle("guided-mode-on", mode === "guided");
  simulator.classList.toggle("guided-mode-active", mode === "guided");
  if (mode === "guided") {
    renderGuidedStep(shouldFocus);
  } else {
    guidedStepNote.textContent = "";
    guidedComplete.classList.add("is-hidden");
    setActiveScenario(null);
    [sesControl, supportControl, memoryControl, liveResults, document.querySelector("#panel-support")].forEach((element) => {
      element.classList.remove("guided-current", "guided-dim");
    });
    tutorialFocusHeading.classList.add("is-hidden");
  }
}

function applyGuidedStep() {
  clearScenarioPolish();
  setActiveScenario(null);
  guidedTutorialComplete = false;
  guidedStepApplied[guidedStepIndex] = true;
  const step = guidedSteps[guidedStepIndex];
  guidedStepNote.textContent = step.note;

  if (guidedStepIndex === 0) {
    memoryInput.value = 5;
    setRadio("support", "none");
    pendingInsightTrigger = "environment";
    updateSimulator();
    pulseElements([sesControl, memoryControl, comparisonChart, scoreWrap]);
    sesControl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  if (guidedStepIndex === 1) {
    memoryInput.value = 5;
    setRadio("ses", "low");
    setRadio("support", "strong");
    pendingInsightTrigger = "support";
    updateSimulator();
    pulseElements([supportControl, scoreWrap, singleBarFill]);
    supportControl.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  if (guidedStepIndex === 2) {
    setActiveTab("support");
    pendingInsightTrigger = "support";
    updateSimulator();
    pulseElements([supportChart, gapMini, supportSummary, gapSummary]);
    document.querySelector("#panel-support").scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  }

  const focusTarget = guidedStepIndex === 2 ? document.querySelector("#panel-support h3") : guidedStepTitle;
  focusTarget.focus({ preventScroll: true });
  renderGuidedStep();
}

function changeGuidedStep(direction) {
  guidedTutorialComplete = false;
  guidedStepIndex = Math.max(0, Math.min(guidedSteps.length - 1, guidedStepIndex + direction));
  renderGuidedStep(true);
}

function finishGuidedTutorial() {
  guidedTutorialComplete = true;
  guidedStepNote.textContent = "";
  guidedComplete.classList.remove("is-hidden");
  stickyGuidedActions.classList.add("is-hidden");
  stickyGuidedComplete.classList.remove("is-hidden");
  guidedComplete.scrollIntoView({ behavior: scrollBehavior(), block: "nearest" });
  guidedComplete.focus({ preventScroll: true });
}

function setModeRadio(mode) {
  const input = document.querySelector(`input[name="exploration-mode"][value="${mode}"]`);
  if (input) input.checked = true;
}

function exploreFreelyFromTutorial() {
  setModeRadio("free");
  setExplorationMode("free", true);
}

function closeTutorial() {
  document.querySelectorAll(".tutorial-controls, .tutorial-action-bar").forEach((element) => {
    element.style.display = "none";
  });
  localStorage.setItem(tutorialClosedStorageKey, "true");
  exploreFreelyFromTutorial();
}

function restartGuidedTutorial() {
  setModeRadio("guided");
  guidedTutorialComplete = false;
  guidedStepApplied = [false, false, false];
  guidedStepIndex = 0;
  setExplorationMode("guided", true);
}

function announceWorkingMemoryLevel() {
  const value = memoryInput.value;
  const message = `Working memory level set to ${value}.`;
  updateLiveRegion(message);
  speak(message);
}

function announceSES(level) {
  const message = `Socioeconomic context set to ${level}.`;
  updateLiveRegion(message);
  speak(message);
}

function announceSupport(level) {
  const messages = {
    none: "No additional support. Reading growth may rely more heavily on existing skills.",
    moderate: "Moderate support added. Some improvements in reading growth are expected.",
    strong: "Strong support added. This can significantly improve reading outcomes and reduce gaps.",
  };

  updateLiveRegion(messages[level]);
  speak(messages[level]);
}

function showInsightFlash(shouldShow) {
  window.clearTimeout(insightTimer);
  if (!shouldShow) return;
  insightBox.classList.remove("is-hidden");
  insightBox.classList.add("is-flashing");
  scoreWrap.classList.remove("score-glow");
  void scoreWrap.offsetWidth;
  scoreWrap.classList.add("score-glow");
  insightTimer = window.setTimeout(() => {
    insightBox.classList.remove("is-flashing");
    insightBox.classList.add("is-hidden");
    scoreWrap.classList.remove("score-glow");
  }, 4200);
}

function renderRows(container, rows, keyPrefix = "") {
  const scores = rows.map((row) => row.score);
  const floor = Math.min(...scores) - 2;
  const ceiling = Math.max(...scores) + 2;

  container.innerHTML = rows.map((row) => {
    const key = `${keyPrefix}${row.key}`;
    const width = barWidth(row.score, floor, ceiling);
    const previousWidth = previousChartWidths.has(key) ? previousChartWidths.get(key) : width;
    return `
      <div class="bar-row" data-ses="${row.key}">
        <span class="bar-label">${row.label}<small>${row.detail}</small></span>
        <span class="bar-track" aria-hidden="true">
          <span class="bar-fill" data-key="${key}" data-target-width="${width}" style="width: ${previousWidth}%"></span>
        </span>
        <span class="bar-value">${formatScore(row.score)}</span>
      </div>
    `;
  }).join("");

  requestAnimationFrame(() => {
    container.querySelectorAll(".bar-fill").forEach((fill) => {
      const width = Number(fill.dataset.targetWidth);
      fill.style.width = `${width}%`;
      previousChartWidths.set(fill.dataset.key, width);
    });
  });
}

function renderCharts(memory, ses, support) {
  const comparisonRows = ["low", "average", "high"].map((key) => ({
    key,
    label: pathways[key].label,
    detail: "same working memory level",
    score: scoreFor(key, memory, "none"),
  }));

  if (support !== "none") {
    comparisonRows.push({
      key: "selected-support",
      label: `${pathways[ses].label} + support`,
      detail: `${supportLabels[support].toLowerCase()} +${supportEffectFor(ses, support).toFixed(1)}`,
      score: scoreFor(ses, memory, support),
    });
  }

  renderRows(comparisonChart, comparisonRows, "compare-");
  const comparisonText = `For working memory level ${memory}, estimated reading growth is ${formatScore(scoreFor("low", memory, "none"))} for low SES, ${formatScore(scoreFor("average", memory, "none"))} for average SES, and ${formatScore(scoreFor("high", memory, "none"))} for high SES.`;
  comparisonChartDescription.textContent = comparisonText;
  comparisonSummary.textContent = comparisonText;

  const supportRows = ["none", "moderate", "strong"].map((level) => ({
    key: level,
    label: supportLabels[level],
    detail: level === "none" ? "baseline" : `+${supportEffectFor(ses, level).toFixed(1)} lift`,
    score: scoreFor(ses, memory, level),
  }));
  renderRows(supportChart, supportRows, "support-");
  const supportText = `For ${pathways[ses].label} and working memory level ${memory}, estimated reading growth is ${formatScore(scoreFor(ses, memory, "none"))} with no support, ${formatScore(scoreFor(ses, memory, "moderate"))} with moderate support, and ${formatScore(scoreFor(ses, memory, "strong"))} with strong support.`;
  supportChartDescription.textContent = supportText;
  supportSummary.textContent = supportText;

  const beforeLow = scoreFor("low", memory, "none");
  const beforeHigh = scoreFor("high", memory, "none");
  const afterLow = scoreFor("low", memory, "strong");
  const afterHigh = scoreFor("high", memory, "strong");
  const beforeGap = beforeHigh - beforeLow;
  const afterGap = afterHigh - afterLow;
  const gapText = `The estimated low-to-high SES difference is ${formatScore(beforeGap)} without support and ${formatScore(afterGap)} after strong resource support.`;
  gapChartDescription.textContent = gapText;
  gapSummary.textContent = gapText;
  fullGapChartDescription.textContent = gapText;
  fullGapSummary.textContent = gapText;
  const maxGap = Math.max(beforeGap, afterGap, 1);
  gapMini.innerHTML = `
    <div class="gap-row">
      <span class="gap-label">Gap without support</span>
      <span class="gap-track"><span class="gap-fill before" style="width: ${(beforeGap / maxGap) * 100}%"></span></span>
      <span class="gap-value">${formatScore(beforeGap)}</span>
    </div>
    <div class="gap-row">
      <span class="gap-label">Gap after support</span>
      <span class="gap-track"><span class="gap-fill after" style="width: ${(afterGap / maxGap) * 100}%"></span></span>
      <span class="gap-value">${formatScore(afterGap)}</span>
    </div>
  `;

  renderFullSupportGrid(memory);
  const fullSupportText = `Across SES levels at working memory level ${memory}, support raises estimated reading growth most in low SES, moderately in average SES, and least in high SES.`;
  fullSupportChartDescription.textContent = fullSupportText;
  fullSupportSummary.textContent = fullSupportText;
  gapChart.innerHTML = gapMini.innerHTML;
}

function renderFullSupportGrid(memory) {
  supportComparisonGrid.innerHTML = ["low", "average", "high"].map((ses) => {
    const rows = ["none", "moderate", "strong"].map((level) => {
      const score = scoreFor(ses, memory, level);
      return `
        <div class="support-row">
          <span class="support-label">${supportLabels[level]}<small>${level === "none" ? "baseline" : `+${supportEffectFor(ses, level).toFixed(1)} lift`}</small></span>
          <span class="support-track"><span class="support-fill" style="width:${barWidth(score, 45, 70)}%"></span></span>
          <span class="support-value">${formatScore(score)}</span>
        </div>
      `;
    }).join("");
    return `<article class="support-card" data-ses="${ses}"><h3>${pathways[ses].label}</h3>${rows}</article>`;
  }).join("");
}

function updateSimulator() {
  const memory = Number(memoryInput.value);
  const ses = selectedSes();
  const support = selectedSupport();
  const currentMemory = memory;
  const currentSES = ses;
  const currentSupport = support;
  const currentSupportLevel = currentSupport;
  const currentState = { memory, ses, support };
  const score = scoreFor(ses, memory, support);
  const currentLift = supportEffectFor(ses, support);
  const growthText = growthInterpretation(score);

  memoryOutput.value = memory;
  memoryInput.setAttribute("aria-valuenow", String(memory));
  memoryInput.setAttribute("aria-valuetext", `${capitalizedMemoryLevel(memory)} working memory level, ${memory} out of 10`);
  predictedScore.textContent = formatScore(score);
  mobileScore.textContent = formatScore(score);
  activeScenarioLabel.textContent = activeScenarioName;
  setChangeLabel(changeLabelFor(previousInteractionState, currentState, pendingInsightTrigger));
  supportDeltaBadge.textContent = `+${formatScore(currentLift)} from support`;
  supportDeltaBadge.classList.toggle("is-hidden", currentLift === 0);
  growthLabel.textContent = growthText;
  mobileGrowthLabel.textContent = growthText;
  singleBarFill.style.width = `${barWidth(score)}%`;
  outcomeSummary.textContent = `Current estimated reading growth level is ${formatScore(score)} out of 100 for ${pathways[ses].label}, working memory level ${memory}, and ${supportLabels[support].toLowerCase()}.`;
  insightText.textContent = insightFor(previousInteractionState, currentState, pendingInsightTrigger);
  showInsightFlash(previousInteractionState !== null || pendingInsightTrigger !== "initial");

  const context = pathwayContextFor(ses, support);
  pathwayContextBadge.className = `pathway-context-badge ${context.className}`;
  pathwayContextBadge.textContent = `Current scenario: ${context.label}`;
  pathwayContextBadge.title = context.title;

  studentExampleText.classList.remove("story-updated");
  void studentExampleText.offsetWidth;
  studentExampleText.classList.add("story-updated");
  updateStudentStory(currentMemory, currentSES, currentSupport, previousInteractionState, currentState);

  renderCharts(memory, ses, support);
  renderSupportRecommendations(ses, memory, support);
  updateStoryActionBridge(currentSES, currentSupportLevel);
  previousInteractionState = currentState;
  pendingInsightTrigger = "control";
}

function runScenario(type) {
  pendingInsightTrigger = type;
  setActiveScenario(type);

  if (type === "environment") {
    const ses = scenarioState.environment % 2 === 0 ? "low" : "high";
    memoryInput.value = 5;
    setRadio("ses", ses);
    setRadio("support", "none");
    scenarioState.environment += 1;
    highlightControlGroups();
  }

  if (type === "support") {
    const support = scenarioState.support % 2 === 0 ? "none" : "strong";
    memoryInput.value = 5;
    setRadio("ses", "low");
    setRadio("support", support);
    scenarioState.support += 1;
    highlightControlGroups();
  }

  if (type === "skills") {
    const sesLevels = ["low", "average", "high"];
    const ses = sesLevels[scenarioState.skills % sesLevels.length];
    memoryInput.value = 8;
    setRadio("ses", ses);
    setRadio("support", "none");
    scenarioState.skills += 1;
    highlightControlGroups();
  }

  updateSimulator();
  showScenarioPolish(type);
}

function resetPathway() {
  memoryInput.value = 5;
  setRadio("ses", "average");
  setRadio("support", "none");
  setActiveScenario(null);
  clearScenarioPolish();
  previousInteractionState = null;
  pendingInsightTrigger = "initial";
  scenarioState.environment = 0;
  scenarioState.support = 0;
  scenarioState.skills = 0;
  guidedStepApplied = [false, false, false];
  if (selectedExplorationMode() === "guided") {
    guidedStepIndex = 0;
    guidedTutorialComplete = false;
    renderGuidedStep();
  }
  updateSimulator();
  insightText.textContent = "Adjust the controls to explore how working memory, SES, and support shape reading growth.";
  insightBox.classList.remove("is-hidden", "is-flashing");
  scenarioNotice.textContent = "Pathway reset.";
  scenarioNotice.classList.remove("is-hidden");
  document.querySelector("#interactive-simulator").scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  noticeTimer = window.setTimeout(() => scenarioNotice.classList.add("is-hidden"), 2200);
}

function setActiveTab(tabName) {
  tabButtons.forEach((button) => {
    const active = button.dataset.tab === tabName;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
  });
  tabPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.id !== `panel-${tabName}`);
  });
}

form.addEventListener("input", () => {
  setActiveScenario(null);
  clearScenarioPolish();
  updateSimulator();
});

scenarioCards.forEach((card) => {
  card.addEventListener("click", () => runScenario(card.dataset.scenario));
});

tabButtons.forEach((button) => {
  button.addEventListener("click", () => setActiveTab(button.dataset.tab));
});

modeInputs.forEach((input) => {
  input.addEventListener("change", () => {
    setExplorationMode(input.value, true);
  });
});

guidedStepAction.addEventListener("click", applyGuidedStep);
stickyGuidedAction.addEventListener("click", applyGuidedStep);
guidedBack.addEventListener("click", () => changeGuidedStep(-1));
stickyGuidedBack.addEventListener("click", () => changeGuidedStep(-1));
guidedNext.addEventListener("click", () => {
  if (guidedStepIndex === guidedSteps.length - 1) {
    finishGuidedTutorial();
    return;
  }
  changeGuidedStep(1);
});
stickyGuidedNext.addEventListener("click", () => {
  if (guidedStepIndex === guidedSteps.length - 1) {
    finishGuidedTutorial();
    return;
  }
  changeGuidedStep(1);
});
guidedExploreFree.addEventListener("click", exploreFreelyFromTutorial);
guidedRestart.addEventListener("click", restartGuidedTutorial);
stickyGuidedFree.addEventListener("click", exploreFreelyFromTutorial);
stickyGuidedRestart.addEventListener("click", restartGuidedTutorial);
tutorialCloseButtons.forEach((button) => {
  button.addEventListener("click", closeTutorial);
});
listenButtons.forEach((button) => {
  button.dataset.originalText = button.textContent.trim();
  button.dataset.originalHtml = button.innerHTML;

  button.addEventListener("click", () => {
    if (!window.audioEnabled || !window.audioDescriptionEnabled) {
      updateLiveRegion("Audio descriptions are turned off.");
      return;
    }

    if (!("speechSynthesis" in window)) {
      updateLiveRegion("Audio descriptions are not supported in this browser.");
      return;
    }

    const targetId = button.getAttribute("data-read-target");
    const section = document.getElementById(targetId);
    if (!section) return;

    if (currentButton === button) {
      stopCurrentAudio();
      updateLiveRegion("Audio stopped.");
      return;
    }

    stopCurrentAudio();

    const text = getReadableText(section);
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1;

    currentUtterance = utterance;
    currentButton = button;
    button.textContent = "■ Stop";
    button.setAttribute("aria-pressed", "true");
    button.classList.add("is-speaking");
    updateLiveRegion(`Reading section: ${button.dataset.originalText}.`);

    utterance.onend = stopCurrentAudio;
    utterance.onerror = stopCurrentAudio;

    window.speechSynthesis.speak(utterance);
  });
});
function attachStopAllAudioButton() {
  const stopButton = document.getElementById("stop-all-audio");

  if (stopButton) {
    stopButton.addEventListener("click", toggleAudio);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", attachStopAllAudioButton);
} else {
  attachStopAllAudioButton();
}
window.addEventListener("beforeunload", stopCurrentAudio);
audioToggle.addEventListener("change", () => {
  window.audioDescriptionEnabled = audioToggle.checked;
  window.audioEnabled = audioToggle.checked;

  if (!audioToggle.checked) {
    stopCurrentAudio();
    const stopButton = document.getElementById("stop-all-audio");
    if (stopButton) {
      stopButton.textContent = "Turn audio on";
      stopButton.setAttribute("aria-label", "Turn audio back on");
    }
    updateLiveRegion("Audio descriptions turned off.");
  } else {
    const stopButton = document.getElementById("stop-all-audio");
    if (stopButton) {
      stopButton.textContent = "Stop all audio";
      stopButton.setAttribute("aria-label", "Stop all audio playback");
    }
    updateLiveRegion("Audio descriptions turned on.");
  }
});
memoryInput.addEventListener("input", announceWorkingMemoryLevel);
form.querySelectorAll('input[name="ses"]').forEach((input) => {
  input.addEventListener("change", () => announceSES(input.value));
});
form.querySelectorAll('input[name="support"]').forEach((input) => {
  input.addEventListener("change", () => announceSupport(input.value));
});
resetPathwayButton.addEventListener("click", resetPathway);
mobileResultsDock.addEventListener("click", () => {
  liveResults.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
});

contrastToggle.addEventListener("click", cycleContrastMode);

detailPanels.forEach((panel) => {
  const summary = panel.querySelector("summary");
  if (!summary) return;
  summary.setAttribute("aria-expanded", String(panel.open));
  panel.addEventListener("toggle", () => {
    summary.setAttribute("aria-expanded", String(panel.open));
  });
});

applyContrastMode(contrastMode);
if (localStorage.getItem(tutorialClosedStorageKey) === "true") {
  setModeRadio("free");
  document.querySelectorAll(".tutorial-controls, .tutorial-action-bar").forEach((element) => {
    element.style.display = "none";
  });
}
setExplorationMode(selectedExplorationMode());
updateSimulator();
