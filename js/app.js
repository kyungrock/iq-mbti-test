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
    iqScore: document.getElementById('iq-score'),
    iqLevel: document.getElementById('iq-level'),
    iqClassificationDesc: document.getElementById('iq-classification-desc'),
    statCorrect: document.getElementById('stat-correct'),
    statTotal: document.getElementById('stat-total'),
    statTime: document.getElementById('stat-time'),
    statPercentile: document.getElementById('stat-percentile'),
    resultSummary: document.getElementById('result-summary'),
    domainBars: document.getElementById('domain-bars'),
    cognitiveProfile: document.getElementById('cognitive-profile'),
    categoryBars: document.getElementById('category-bars'),
    strengthText: document.getElementById('strength-text'),
    weaknessText: document.getElementById('weakness-text'),
    comparisonText: document.getElementById('comparison-text'),
    recommendationsList: document.getElementById('recommendations-list')
  };

  let selectedLevel = null;
  let questions = [];
  let levelConfig = null;
  let totalTime = 0;

  let state = {
    currentIndex: 0,
    answers: [],
    timeLeft: 0,
    timerId: null,
    startTime: null
  };

  function initAgeSelector() {
    Object.values(AGE_LEVELS).forEach(level => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'age-level-card';
      card.dataset.level = level.id;
      card.setAttribute('role', 'radio');
      card.setAttribute('aria-checked', 'false');
      card.innerHTML = `
        <span class="age-level-icon">${level.icon}</span>
        <span class="age-level-label">${level.label}</span>
        <span class="age-level-age">${level.ageRange}</span>
        <span class="age-level-desc">${level.description}</span>
        <span class="age-level-meta">${level.questionCount}문항 · ${level.timeLimit}분</span>
      `;
      card.addEventListener('click', () => selectLevel(level.id));
      els.ageLevels.appendChild(card);
    });
  }

  function selectLevel(levelId) {
    selectedLevel = levelId;
    levelConfig = AGE_LEVELS[levelId];
    questions = QUESTION_BANK[levelId];
    totalTime = levelConfig.timeLimit * 60;

    els.ageLevels.querySelectorAll('.age-level-card').forEach(card => {
      const isSelected = card.dataset.level === levelId;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected);
    });

    els.btnStart.disabled = false;
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

  function renderQuestion() {
    const q = questions[state.currentIndex];
    const progress = ((state.currentIndex + 1) / questions.length) * 100;

    els.progressFill.style.width = `${progress}%`;
    els.progressText.textContent = `${state.currentIndex + 1} / ${questions.length}`;
    els.categoryBadge.textContent = CATEGORY_LABELS[q.category] || q.category;
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

    els.btnPrev.disabled = state.currentIndex === 0;
    els.btnNext.textContent = state.currentIndex === questions.length - 1 ? '결과 보기' : '다음';
  }

  function selectOption(index) {
    state.answers[state.currentIndex] = index;
    els.options.querySelectorAll('.option').forEach((el, i) => {
      el.classList.toggle('selected', i === index);
      el.setAttribute('aria-checked', i === index);
    });
  }

  function renderBarChart(container, entries, labelFn) {
    container.innerHTML = '';
    entries.forEach(([key, stats]) => {
      const pct = Math.round((stats.correct / stats.total) * 100);
      const row = document.createElement('div');
      row.className = 'category-bar-row';
      row.innerHTML = `
        <div class="category-bar-header">
          <span>${labelFn(key)}</span>
          <span>${stats.correct}/${stats.total} (${pct}%)</span>
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
    const report = buildProfessionalReport(
      selectedLevel, questions, state.answers, elapsed, levelConfig
    );

    els.resultAgeBadge.innerHTML = `${levelConfig.icon} ${levelConfig.label} · ${levelConfig.ageRange}`;
    els.iqScore.textContent = report.iq;
    els.iqLevel.textContent = report.classification.label;
    els.iqClassificationDesc.textContent = report.classification.desc;
    els.statCorrect.textContent = report.correct;
    els.statTotal.textContent = report.total;
    els.statTime.textContent = formatTime(elapsed);
    els.statPercentile.textContent = `${report.percentile}%`;

    els.resultSummary.innerHTML = report.summary;

    renderBarChart(els.domainBars, Object.entries(report.domainStats), key =>
      DOMAIN_LABELS[key] || key
    );

    els.cognitiveProfile.innerHTML = report.cognitiveProfile
      .map(p => `<p class="profile-item">${p}</p>`)
      .join('');

    renderBarChart(els.categoryBars, Object.entries(report.categoryStats), key =>
      CATEGORY_LABELS[key] || key
    );

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

    state = {
      currentIndex: 0,
      answers: new Array(questions.length).fill(null),
      timeLeft: totalTime,
      timerId: null,
      startTime: null
    };

    els.testLevelChip.textContent = `${levelConfig.icon} ${levelConfig.label}`;
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
    const iq = els.iqScore.textContent;
    const level = levelConfig ? levelConfig.label : '';
    const text = `[${level}] IQ 테스트 결과: 추정 IQ ${iq}점 (연령 규준). 당신도 도전해 보세요!`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'IQ 테스트 결과', text });
      } else {
        await navigator.clipboard.writeText(text);
        els.btnShare.textContent = '복사됨!';
        setTimeout(() => { els.btnShare.textContent = '결과 공유'; }, 2000);
      }
    } catch (_) { /* 사용자 취소 */ }
  });
})();
