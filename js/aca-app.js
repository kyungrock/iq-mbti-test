(function () {
  const OPTION_LABELS = 'ABCDEF'.split('');

  const screens = {
    start: document.getElementById('screen-start'),
    test: document.getElementById('screen-test'),
    result: document.getElementById('screen-result')
  };

  const els = {
    ageLevels: document.getElementById('age-levels'),
    btnStart: document.getElementById('btn-start'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnRetry: document.getElementById('btn-retry'),
    btnShare: document.getElementById('btn-share'),
    testLevelChip: document.getElementById('test-level-chip'),
    tierChip: document.getElementById('tier-chip'),
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    timer: document.getElementById('timer'),
    timerValue: document.getElementById('timer-value'),
    questionText: document.getElementById('question-text'),
    matrixWrap: document.getElementById('matrix-wrap'),
    options: document.getElementById('options'),
    resultAgeBadge: document.getElementById('result-age-badge'),
    iqScore: document.getElementById('iq-score'),
    reliabilityValue: document.getElementById('reliability-value'),
    iqLevel: document.getElementById('iq-level'),
    iqClassificationDesc: document.getElementById('iq-classification-desc'),
    statCorrect: document.getElementById('stat-correct'),
    statTotal: document.getElementById('stat-total'),
    statTime: document.getElementById('stat-time'),
    statPercentile: document.getElementById('stat-percentile'),
    resultSummary: document.getElementById('result-summary'),
    domainBars: document.getElementById('domain-bars'),
    tierBars: document.getElementById('tier-bars'),
    strengthText: document.getElementById('strength-text'),
    weaknessText: document.getElementById('weakness-text'),
    comparisonText: document.getElementById('comparison-text'),
    recommendationsList: document.getElementById('recommendations-list'),
    cognitiveProfile: document.getElementById('cognitive-profile')
  };

  let selectedLevel = null;
  let levelConfig = null;
  let questions = [];
  let sessionSeed = null;
  let totalTime = 0;

  let state = {
    currentIndex: 0,
    answers: [],
    timeLeft: 0,
    timerId: null,
    startTime: null
  };

  function initAgeSelector() {
    Object.values(getACALevels()).forEach(level => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'age-level-card aca-card';
      card.dataset.level = level.id;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      const total = getACAQuestionCount(level.id);
      card.innerHTML = `
        <span class="age-level-icon">${level.icon}</span>
        <span class="age-level-label">${level.subLabel}</span>
        <span class="age-level-age">${level.ageRange}</span>
        <span class="age-level-desc">${level.description}</span>
        <span class="age-level-meta">${total}문항 · ${level.timeLimit}분 · 4단계 난이도</span>
      `;
      card.addEventListener('click', () => selectLevel(level.id));
      els.ageLevels.appendChild(card);
    });
  }

  function selectLevel(levelId) {
    selectedLevel = levelId;
    levelConfig = ACA_LEVELS[levelId];
    totalTime = levelConfig.timeLimit * 60;

    els.ageLevels.querySelectorAll('.age-level-card').forEach(card => {
      const on = card.dataset.level === levelId;
      card.classList.toggle('selected', on);
      card.setAttribute('aria-checked', on);
    });
    els.btnStart.disabled = false;
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startTimer() {
    clearInterval(state.timerId);
    state.timeLeft = totalTime;
    state.startTime = Date.now();
    updateTimer();

    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateTimer();
      if (state.timeLeft <= 0) finishTest();
    }, 1000);
  }

  function updateTimer() {
    els.timerValue.textContent = formatTime(state.timeLeft);
    els.timer.classList.remove('warning', 'danger');
    if (state.timeLeft <= 60) els.timer.classList.add('danger');
    else if (state.timeLeft <= 300) els.timer.classList.add('warning');
  }

  function updateTierChip() {
    const prog = getACATierProgress(state.currentIndex, selectedLevel);
    els.tierChip.textContent = `${prog.label} · ${prog.indexInTier}/${prog.perTier}`;
    els.tierChip.className = `tier-chip tier-${prog.tier}`;
  }

  function renderQuestion() {
    const q = questions[state.currentIndex];
    const n = state.currentIndex + 1;
    const progress = (n / questions.length) * 100;

    els.progressFill.style.width = `${progress}%`;
    els.progressText.textContent = `${n} / ${questions.length}`;
    els.questionText.textContent = q.text;
    els.matrixWrap.innerHTML = q.matrixSvg;
    updateTierChip();

    els.options.innerHTML = '';
    q.options.forEach((optSvg, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'aca-option' + (state.answers[state.currentIndex] === i ? ' selected' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', state.answers[state.currentIndex] === i);
      btn.innerHTML = `
        <span class="aca-option-marker">${OPTION_LABELS[i]}</span>
        ${optSvg}
      `;
      btn.addEventListener('click', () => selectOption(i));
      els.options.appendChild(btn);
    });

    els.btnPrev.disabled = state.currentIndex === 0;
    els.btnNext.textContent = state.currentIndex === questions.length - 1 ? '결과 보기' : '다음';
  }

  function selectOption(index) {
    state.answers[state.currentIndex] = index;
    els.options.querySelectorAll('.aca-option').forEach((el, i) => {
      el.classList.toggle('selected', i === index);
      el.setAttribute('aria-checked', i === index);
    });
  }

  function renderBars(container, entries, labelFn) {
    container.innerHTML = '';
    entries.forEach(([key, stats]) => {
      const pct = stats.total ? Math.round((stats.correct / stats.total) * 100) : 0;
      const row = document.createElement('div');
      row.className = 'category-bar-row';
      row.innerHTML = `
        <div class="category-bar-header">
          <span>${labelFn(key, stats)}</span>
          <span>${stats.correct}/${stats.total} (${pct}%)${stats.score != null ? ` · ${stats.score}점` : ''}</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill" style="width: 0%" data-width="${pct}%"></div>
        </div>
      `;
      container.appendChild(row);
    });
    requestAnimationFrame(() => {
      container.querySelectorAll('.category-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width;
      });
    });
  }

  function showResults() {
    const elapsed = Math.round((Date.now() - state.startTime) / 1000);
    const report = buildACAReport(questions, state.answers, elapsed, levelConfig);

    els.resultAgeBadge.innerHTML = `${levelConfig.icon} ${levelConfig.subLabel} · ${levelConfig.ageRange}`;
    els.iqScore.textContent = report.cognitiveIndex;
    els.reliabilityValue.textContent = `${Math.round(report.reliability * 100)}% (±${report.seIQ} IQ)`;
    els.iqLevel.textContent = report.classification.label;
    els.iqClassificationDesc.textContent = report.classification.desc;
    els.statCorrect.textContent = report.correct;
    els.statTotal.textContent = report.total;
    els.statTime.textContent = formatTime(elapsed);
    els.statPercentile.textContent = `${report.percentile}%`;
    els.resultSummary.innerHTML = report.summary;
    els.strengthText.textContent = report.strengthText;
    els.weaknessText.textContent = report.weaknessText;
    els.comparisonText.textContent = report.comparisonText;

    const domainEntries = Object.entries(report.domainScores).filter(([, s]) => s.total > 0);
    renderBars(els.domainBars, domainEntries, (key, s) => s.info?.name || key);

    const tierEntries = Object.entries(report.tierStats).filter(([, s]) => s.total > 0);
    renderBars(els.tierBars, tierEntries, (key, s) => s.label);

    els.recommendationsList.innerHTML = '';
    report.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      els.recommendationsList.appendChild(li);
    });

    els.cognitiveProfile.innerHTML = report.cognitiveProfile
      .map(p => `<p class="profile-item">${p}</p>`)
      .join('');

    showScreen('result');
  }

  function finishTest() {
    clearInterval(state.timerId);
    showResults();
  }

  function startTest() {
    if (!selectedLevel) return;
    sessionSeed = acaSessionSeed();
    questions = prepareACATest(selectedLevel, sessionSeed);
    state = {
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      timeLeft: totalTime,
      timerId: null,
      startTime: null
    };

    els.testLevelChip.textContent = `${levelConfig.icon} ${levelConfig.subLabel}`;
    showScreen('test');
    startTimer();
    renderQuestion();
  }

  initAgeSelector();
  els.btnStart.addEventListener('click', startTest);

  els.btnPrev.addEventListener('click', () => {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      renderQuestion();
    }
  });

  els.btnNext.addEventListener('click', () => {
    if (state.answers[state.currentIndex] === null) return;
    if (state.currentIndex < questions.length - 1) {
      state.currentIndex++;
      renderQuestion();
    } else {
      finishTest();
    }
  });

  els.btnRetry.addEventListener('click', () => {
    selectedLevel = null;
    levelConfig = null;
    questions = [];
    els.btnStart.disabled = true;
    els.ageLevels.querySelectorAll('.age-level-card').forEach(card => {
      card.classList.remove('selected');
      card.setAttribute('aria-checked', 'false');
    });
    showScreen('start');
  });

  els.btnShare.addEventListener('click', async () => {
    const score = els.iqScore.textContent;
    const text = `[${levelConfig?.subLabel || 'ACA'}] AI Cognitive Index ${score}점. 진행행렬 검사에 도전해 보세요!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'ACA 결과', text });
      } else {
        await navigator.clipboard.writeText(text);
        els.btnShare.textContent = '복사됨!';
        setTimeout(() => { els.btnShare.textContent = '결과 공유'; }, 2000);
      }
    } catch (_) {}
  });
})();
