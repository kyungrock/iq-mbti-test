(function () {
  const OPTION_LABELS = ['A', 'B', 'C', 'D'];

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
    progressFill: document.getElementById('progress-fill'),
    progressText: document.getElementById('progress-text'),
    timer: document.getElementById('timer'),
    timerValue: document.getElementById('timer-value'),
    categoryBadge: document.getElementById('category-badge'),
    questionText: document.getElementById('question-text'),
    questionVisual: document.getElementById('question-visual'),
    options: document.getElementById('options'),
    resultAgeBadge: document.getElementById('result-age-badge'),
    resultIqLabel: document.getElementById('result-iq-label'),
    iqScore: document.getElementById('iq-score'),
    gaiScore: document.getElementById('gai-score'),
    gaiValue: document.getElementById('gai-value'),
    iqLevel: document.getElementById('iq-level'),
    iqClassificationDesc: document.getElementById('iq-classification-desc'),
    statCorrect: document.getElementById('stat-correct'),
    statTotal: document.getElementById('stat-total'),
    statTime: document.getElementById('stat-time'),
    statPercentile: document.getElementById('stat-percentile'),
    resultSummary: document.getElementById('result-summary'),
    kwaisIndexSection: document.getElementById('kwais-index-section'),
    kwaisIndexBars: document.getElementById('kwais-index-bars'),
    profileSectionTitle: document.getElementById('profile-section-title'),
    domainBars: document.getElementById('domain-bars'),
    cognitiveProfile: document.getElementById('cognitive-profile'),
    categorySection: document.getElementById('category-section'),
    categorySectionTitle: document.getElementById('category-section-title'),
    categoryBars: document.getElementById('category-bars'),
    kwaisSubtestSection: document.getElementById('kwais-subtest-section'),
    kwaisSubtestBars: document.getElementById('kwais-subtest-bars'),
    strengthText: document.getElementById('strength-text'),
    weaknessText: document.getElementById('weakness-text'),
    comparisonText: document.getElementById('comparison-text'),
    recommendationsList: document.getElementById('recommendations-list')
  };

  let selectedLevel = null;
  let questions = [];
  let levelConfig = null;
  let totalTime = 0;
  let catSession = null;
  let questionStartTime = null;
  let isCATMode = false;

  let state = {
    currentIndex: 0,
    answers: [],
    timeLeft: 0,
    timerId: null,
    startTime: null
  };

  function initAgeSelector() {
    const levels = getAllAgeLevels();
    Object.values(levels).forEach(level => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'age-level-card' + (level.isWechsler ? ' kwais-card' : '');
      card.dataset.level = level.id;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      const displayLabel = level.subLabel
        ? `${level.label} · ${level.subLabel}`
        : level.label;
      const meta = level.isWechsler
        ? (level.useCAT
          ? `CAT 적응형 · 최대 ${level.catMaxItems}문항 · IRT`
          : `${level.questionCount}문항 · ${level.timeLimit}분 · 종합 IQ`)
        : `${level.questionCount}문항 · ${level.timeLimit}분`;
      card.innerHTML = `
        <span class="age-level-icon">${level.icon}</span>
        <span class="age-level-label">${displayLabel}</span>
        <span class="age-level-age">${level.ageRange}</span>
        <span class="age-level-desc">${level.description}</span>
        <span class="age-level-meta">${meta}</span>
      `;
      card.addEventListener('click', () => selectLevel(level.id));
      els.ageLevels.appendChild(card);
    });
  }

  function selectLevel(levelId) {
    selectedLevel = levelId;
    levelConfig = getAllAgeLevels()[levelId];
    totalTime = levelConfig.timeLimit * 60;

    els.ageLevels.querySelectorAll('.age-level-card').forEach(card => {
      const isSelected = card.dataset.level === levelId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected);
    });

    els.btnStart.disabled = false;
    els.btnStart.textContent = levelConfig.isWechsler
      ? `${levelConfig.examName} 검사 시작`
      : '테스트 시작';
  }

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function formatTime(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startTimer() {
    clearInterval(state.timerId);
    state.timeLeft = totalTime;
    state.startTime = Date.now();
    updateTimerDisplay();

    state.timerId = setInterval(() => {
      state.timeLeft--;
      updateTimerDisplay();
      if (state.timeLeft <= 0) finishTest();
    }, 1000);
  }

  function updateTimerDisplay() {
    els.timerValue.textContent = formatTime(state.timeLeft);
    els.timer.classList.remove('warning', 'danger');
    if (state.timeLeft <= 60) els.timer.classList.add('danger');
    else if (state.timeLeft <= 300) els.timer.classList.add('warning');
  }

  function getQuestionBadge(q) {
    if (q.index && q.subtest) {
      const domainMap = isCATMode && typeof INSIGHTIQ_DOMAINS !== 'undefined'
        ? INSIGHTIQ_DOMAINS
        : WECHSLER_INDICES;
      const idxName = domainMap[q.index]?.name || q.index;
      const diffTag = q.difficulty ? ` · Lv${q.difficulty}` : '';
      return `${q.subtest} · ${idxName}${diffTag}`;
    }
    return CATEGORY_LABELS[q.category] || q.category;
  }

  function renderQuestion() {
    const q = questions[state.currentIndex];
    const progressDenom = isCATMode && catSession ? catSession.maxItems : questions.length;
    const progressNum = isCATMode && catSession ? catSession.itemCount : state.currentIndex + 1;
    const progress = (progressNum / progressDenom) * 100;

    els.progressFill.style.width = `${progress}%`;
    els.progressText.textContent = isCATMode && catSession
      ? catSession.getProgressLabel()
      : `${state.currentIndex + 1} / ${questions.length}`;
    els.categoryBadge.textContent = getQuestionBadge(q);
    if (levelConfig.isWechsler) els.categoryBadge.classList.add('kwais-badge');
    else els.categoryBadge.classList.remove('kwais-badge');
    els.questionText.textContent = q.text;

    if (q.visual) {
      els.questionVisual.hidden = false;
      els.questionVisual.textContent = q.visual;
    } else {
      els.questionVisual.hidden = true;
    }

    els.options.innerHTML = '';
    q.options.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'option' + (state.answers[state.currentIndex] === i ? ' selected' : '');
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', state.answers[state.currentIndex] === i);
      btn.innerHTML = `
        <span class="option-marker">${OPTION_LABELS[i]}</span>
        <span class="option-text">${opt}</span>
      `;
      btn.addEventListener('click', () => selectOption(i));
      els.options.appendChild(btn);
    });

    els.btnPrev.disabled = isCATMode || state.currentIndex === 0;
    const isLast = !isCATMode && state.currentIndex === questions.length - 1;
    els.btnNext.textContent = isLast ? '결과 보기' : '다음';
  }

  function advanceCAT() {
    const q = questions[state.currentIndex];
    if (state.answers[state.currentIndex] === null) return;

    const timeMs = questionStartTime ? Date.now() - questionStartTime : (q.timeLimitSec || 30) * 1000;
    catSession.recordResponse(q, state.answers[state.currentIndex], timeMs);

    if (catSession.isComplete()) {
      finishTest();
      return;
    }

    const next = catSession.getNextQuestion();
    if (!next) {
      finishTest();
      return;
    }

    questions.push(next);
    state.answers.push(null);
    state.currentIndex++;
    questionStartTime = Date.now();
    renderQuestion();
  }

  function selectOption(index) {
    state.answers[state.currentIndex] = index;
    els.options.querySelectorAll('.option').forEach((el, i) => {
      el.classList.toggle('selected', i === index);
      el.setAttribute('aria-checked', i === index);
    });
  }

  function renderBarChart(container, entries, labelFn, showScore) {
    container.innerHTML = '';
    entries.forEach(([key, stats]) => {
      const pct = Math.round((stats.correct / stats.total) * 100);
      const row = document.createElement('div');
      row.className = 'category-bar-row';
      const scoreText = showScore && stats.score != null ? ` · 지표 ${stats.score}점` : '';
      row.innerHTML = `
        <div class="category-bar-header">
          <span>${labelFn(key, stats)}</span>
          <span>${stats.correct}/${stats.total} (${pct}%)${scoreText}</span>
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

  function showStandardResults(report) {
    els.resultIqLabel.innerHTML = '추정 IQ <span class="result-norm">(연령 규준)</span>';
    els.gaiScore.hidden = true;
    els.kwaisIndexSection.hidden = true;
    els.kwaisSubtestSection.hidden = true;
    els.categorySection.hidden = false;
    els.profileSectionTitle.textContent = '인지 영역 프로필 (CHC)';
    els.categorySectionTitle.textContent = '세부 영역별 성적';

    els.iqScore.textContent = report.iq;
    els.iqLevel.textContent = report.classification.label;
    els.iqClassificationDesc.textContent = report.classification.desc;

    renderBarChart(els.domainBars, Object.entries(report.domainStats), key =>
      DOMAIN_LABELS[key] || key
    );

    renderBarChart(els.categoryBars, Object.entries(report.categoryStats), key =>
      CATEGORY_LABELS[key] || key
    );
  }

  function showWechslerResults(report, config) {
    const exam = config.examName;
    els.resultIqLabel.innerHTML = report.isCAT
      ? `종합 IQ <span class="result-norm">(IRT·CAT 추정 · ${exam})</span>`
      : `종합 IQ <span class="result-norm">(${exam})</span>`;
    els.gaiScore.hidden = false;
    els.gaiValue.textContent = report.gai;
    els.kwaisIndexSection.hidden = false;
    els.kwaisSubtestSection.hidden = false;
    els.categorySection.hidden = true;
    els.profileSectionTitle.textContent = report.isCAT
      ? `${exam} 5영역 프로필 (IRT)`
      : `${exam} 4지표 프로필`;
    document.querySelector('#kwais-index-section h3').textContent = report.isCAT
      ? `${exam} 5영역 점수`
      : `${exam} 4지표 점수`;
    document.querySelector('#kwais-subtest-section h3').textContent = `${exam} 소검사별 성적`;

    els.iqScore.textContent = report.fsiq;
    els.iqLevel.textContent = report.classification.label;
    els.iqClassificationDesc.textContent = report.classification.desc;

    const indexEntries = Object.entries(report.indexScores).map(([key, s]) => [
      key, { correct: s.correct, total: s.total, score: s.score, info: s.info }
    ]);
    renderBarChart(
      els.kwaisIndexBars,
      indexEntries,
      (key, stats) => stats.info.fullName,
      true
    );

    renderBarChart(
      els.domainBars,
      indexEntries,
      (key, stats) => `${stats.info.name} (${stats.info.desc.split(',')[0]})`,
      true
    );

    els.kwaisSubtestBars.innerHTML = '';
    report.subtestAnalysis.forEach(st => {
      const row = document.createElement('div');
      row.className = 'category-bar-row';
      row.innerHTML = `
        <div class="category-bar-header">
          <span>${st.label}</span>
          <span>${st.correct}/${st.total} (${st.pct}%)</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill kwais-fill" style="width: ${st.pct}%"></div>
        </div>
      `;
      els.kwaisSubtestBars.appendChild(row);
    });
  }

  function showResults() {
    const elapsed = Math.round((Date.now() - state.startTime) / 1000);
    const isWechsler = levelConfig.isWechsler;
    let report;

    if (isWechsler && isCATMode && catSession) {
      report = buildKwaisCATReport(catSession.getResults(), elapsed, levelConfig);
    } else if (isWechsler) {
      report = buildWechslerReport(questions, state.answers, elapsed, levelConfig);
    } else {
      report = buildProfessionalReport(selectedLevel, questions, state.answers, elapsed, levelConfig);
    }

    const badgeLabel = levelConfig.subLabel
      ? `${levelConfig.label} · ${levelConfig.subLabel}`
      : levelConfig.label;
    els.resultAgeBadge.innerHTML = `${levelConfig.icon} ${badgeLabel} · ${levelConfig.ageRange}`;
    els.statCorrect.textContent = report.correct;
    els.statTotal.textContent = report.total;
    els.statTime.textContent = formatTime(elapsed);
    els.statPercentile.textContent = `${report.percentile}%`;
    els.resultSummary.innerHTML = report.summary;

    if (isWechsler) showWechslerResults(report, levelConfig);
    else showStandardResults(report);

    els.cognitiveProfile.innerHTML = report.cognitiveProfile
      .map(p => `<p class="profile-item">${p}</p>`)
      .join('');

    els.strengthText.textContent = report.strengthText;
    els.weaknessText.textContent = report.weaknessText;
    els.comparisonText.textContent = report.comparisonText;

    els.recommendationsList.innerHTML = '';
    report.recommendations.forEach(rec => {
      const li = document.createElement('li');
      li.textContent = rec;
      els.recommendationsList.appendChild(li);
    });

    showScreen('result');
  }

  function finishTest() {
    clearInterval(state.timerId);
    showResults();
  }

  function startTest() {
    if (!selectedLevel) return;

    isCATMode = isKwaisCATLevel(selectedLevel);
    catSession = null;

    if (isCATMode) {
      catSession = createKwaisCATSession(levelConfig);
      const first = catSession.getNextQuestion();
      questions = first ? [first] : [];
    } else {
      questions = buildIqTest(selectedLevel, levelConfig.questionCount);
    }

    state = {
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      timeLeft: totalTime,
      timerId: null,
      startTime: null
    };

    questionStartTime = Date.now();

    els.testLevelChip.textContent = levelConfig.subLabel
      ? `${levelConfig.icon} ${levelConfig.label} · ${levelConfig.subLabel}`
      : `${levelConfig.icon} ${levelConfig.label}`;
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

    if (isCATMode) {
      advanceCAT();
      return;
    }

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
    catSession = null;
    isCATMode = false;
    clearKwaisBankCache();
    els.btnStart.disabled = true;
    els.btnStart.textContent = '테스트 시작';
    els.ageLevels.querySelectorAll('.age-level-card').forEach(card => {
      card.classList.remove('selected');
      card.setAttribute('aria-checked', 'false');
    });
    showScreen('start');
  });

  els.btnShare.addEventListener('click', async () => {
    const score = els.iqScore.textContent;
    const level = levelConfig ? levelConfig.label : '';
    const label = levelConfig?.isWechsler ? '종합 IQ' : '추정 IQ';
    const text = `[${level}] InsightIQ 결과: ${label} ${score}점. 당신도 도전해 보세요!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'InsightIQ 결과', text });
      } else {
        await navigator.clipboard.writeText(text);
        els.btnShare.textContent = '복사됨!';
        setTimeout(() => { els.btnShare.textContent = '결과 공유'; }, 2000);
      }
    } catch (_) {}
  });
})();
