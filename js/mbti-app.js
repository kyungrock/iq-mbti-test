(function () {
  const screens = {
    start: document.getElementById('screen-start'),
    phase1: document.getElementById('screen-phase1'),
    bridge: document.getElementById('screen-bridge'),
    phase2: document.getElementById('screen-phase2'),
    result: document.getElementById('screen-result')
  };

  const els = {
    btnStart: document.getElementById('btn-start'),
    btnPhase2: document.getElementById('btn-phase2'),
    btnRetry: document.getElementById('btn-retry'),
    btnShare: document.getElementById('btn-share'),
    p1ProgressFill: document.getElementById('p1-progress-fill'),
    p1ProgressText: document.getElementById('p1-progress-text'),
    p1QuestionText: document.getElementById('p1-question-text'),
    p1Likert: document.getElementById('p1-likert'),
    p1Prev: document.getElementById('p1-prev'),
    p1Next: document.getElementById('p1-next'),
    bridgeType: document.getElementById('bridge-type'),
    bridgeTypeName: document.getElementById('bridge-type-name'),
    bridgeDesc: document.getElementById('bridge-desc'),
    bridgeDims: document.getElementById('bridge-dims'),
    p2ProgressFill: document.getElementById('p2-progress-fill'),
    p2ProgressText: document.getElementById('p2-progress-text'),
    p2TypeTag: document.getElementById('p2-type-tag'),
    p2QuestionText: document.getElementById('p2-question-text'),
    p2Likert: document.getElementById('p2-likert'),
    p2Prev: document.getElementById('p2-prev'),
    p2Next: document.getElementById('p2-next'),
    resultTypeHeader: document.getElementById('result-type-header'),
    fitPercent: document.getElementById('fit-percent'),
    fitLevel: document.getElementById('fit-level'),
    fitDesc: document.getElementById('fit-desc'),
    statPhase1: document.getElementById('stat-phase1'),
    statPhase2: document.getElementById('stat-phase2'),
    statClarity: document.getElementById('stat-clarity'),
    statTotal: document.getElementById('stat-total'),
    resultSummary: document.getElementById('result-summary'),
    dimensionBars: document.getElementById('dimension-bars'),
    cognitiveStack: document.getElementById('cognitive-stack'),
    secondarySection: document.getElementById('secondary-section'),
    secondaryTypes: document.getElementById('secondary-types'),
    fitBreakdown: document.getElementById('fit-breakdown')
  };

  let state = {
    p1Index: 0,
    p1Answers: [],
    p1Questions: [],
    p2Index: 0,
    p2Answers: [],
    mbtiType: null,
    phase2Questions: [],
    phase1Result: null
  };

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function buildLikert(container, selected, onSelect) {
    container.innerHTML = '';
    LIKERT_LABELS.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'likert-btn' + (selected === item.value ? ' selected' : '');
      btn.innerHTML = `<span class="likert-value">${item.value}</span><span class="likert-label">${item.label}</span>`;
      btn.addEventListener('click', () => onSelect(item.value));
      container.appendChild(btn);
    });
  }

  function startPhase1() {
    state.p1Questions = buildPhase1Questions();
    state.p1Answers = new Array(state.p1Questions.length).fill(null);
    state.p1Index = 0;
    showScreen('phase1');
    renderPhase1();
  }

  function renderPhase1() {
    const total = state.p1Questions.length;
    const q = state.p1Questions[state.p1Index];
    const progress = ((state.p1Index + 1) / total) * 100;

    els.p1ProgressFill.style.width = `${progress}%`;
    els.p1ProgressText.textContent = `${state.p1Index + 1} / ${total}`;
    els.p1QuestionText.textContent = q.text;

    buildLikert(els.p1Likert, state.p1Answers[state.p1Index], val => {
      state.p1Answers[state.p1Index] = val;
      renderPhase1();
    });

    els.p1Prev.disabled = state.p1Index === 0;
    els.p1Next.textContent = state.p1Index === total - 1 ? '1차 완료' : '다음';
  }

  function finishPhase1() {
    state.phase1Result = scorePhase1(state.p1Answers, state.p1Questions);
    state.mbtiType = state.phase1Result.mbtiType;
    const info = MBTI_TYPES[state.mbtiType];

    els.bridgeType.textContent = state.mbtiType;
    els.bridgeTypeName.textContent = `${info.emoji} ${info.name}`;
    els.bridgeDesc.textContent = info.desc;

    els.bridgeDims.innerHTML = Object.entries(state.phase1Result.dimensions)
      .map(([, d]) => `<span class="dim-chip">${d.label} ${d.clarity}%</span>`)
      .join('');

    showScreen('bridge');
  }

  function startPhase2() {
    state.phase2Questions = getPhase2Questions(state.mbtiType);
    state.p2Answers = new Array(state.phase2Questions.length).fill(null);
    state.p2Index = 0;

    els.p2TypeTag.textContent = `${state.mbtiType} · ${MBTI_TYPES[state.mbtiType].name}`;
    showScreen('phase2');
    renderPhase2();
  }

  function renderPhase2() {
    const q = state.phase2Questions[state.p2Index];
    const total = state.phase2Questions.length;
    const progress = ((state.p2Index + 1) / total) * 100;

    els.p2ProgressFill.style.width = `${progress}%`;
    els.p2ProgressText.textContent = `${state.p2Index + 1} / ${total}`;
    els.p2QuestionText.textContent = q.text;

    buildLikert(els.p2Likert, state.p2Answers[state.p2Index], val => {
      state.p2Answers[state.p2Index] = val;
      renderPhase2();
    });

    els.p2Prev.disabled = state.p2Index === 0;
    els.p2Next.textContent = state.p2Index === total - 1 ? '결과 보기' : '다음';
  }

  function showResults() {
    const report = buildMbtiReport(
      state.p1Answers, state.p2Answers, state.mbtiType, state.p1Questions
    );
    const info = report.typeInfo;
    const groupColor = GROUP_COLORS[info.group] || 'var(--primary)';

    els.resultTypeHeader.innerHTML = `
      <span class="mbti-group" style="color:${groupColor}">${info.group}</span>
      <div class="mbti-type-code">${report.type}</div>
      <div class="mbti-type-name">${info.emoji} ${info.name}</div>
      <p class="mbti-type-desc">${info.desc}</p>
    `;

    els.fitPercent.textContent = `${report.phase2.matchPercent}%`;
    els.fitPercent.style.setProperty('--fit-color', getFitColor(report.phase2.matchPercent));
    els.fitLevel.textContent = report.phase2.fitLevel.label;
    els.fitDesc.textContent = report.phase2.fitLevel.desc;

    els.statPhase1.textContent = state.p1Questions.length;
    els.statPhase2.textContent = state.phase2Questions.length;
    els.statClarity.textContent = `${report.phase1.avgClarity}%`;
    els.statTotal.textContent = report.totalQuestions;

    els.resultSummary.innerHTML = report.summary;

    els.dimensionBars.innerHTML = '';
    report.dimensionAnalysis.forEach(da => {
      const row = document.createElement('div');
      row.className = 'dim-analysis-row';
      const [a, b] = da.dim.split('');
      row.innerHTML = `
        <div class="category-bar-header">
          <span>${da.info.label}</span>
          <span>${da.d.label} (${da.d.clarity}%)</span>
        </div>
        <div class="dim-dual-bar">
          <div class="dim-bar-a" style="width:${da.pctA}%">${da.info.poles[a]} ${da.pctA}%</div>
          <div class="dim-bar-b" style="width:${da.pctB}%">${da.info.poles[b]} ${da.pctB}%</div>
        </div>
        <p class="dim-interpretation">${da.interpretation}</p>
      `;
      els.dimensionBars.appendChild(row);
    });

    els.cognitiveStack.innerHTML = report.cognitiveStack.map((fn, i) => `
      <div class="stack-item ${i === 0 ? 'stack-primary' : ''}">
        <span class="stack-func">${fn.func}</span>
        <div class="stack-info">
          <span class="stack-name">${fn.name}</span>
          <span class="stack-role">${fn.role}</span>
        </div>
      </div>
    `).join('');

    if (report.secondary.length > 0) {
      els.secondarySection.hidden = false;
      els.secondaryTypes.textContent =
        `일부 차원이 경계형에 가까워, ${report.secondary.join(', ')} 유형의 특성도 함께 가질 수 있습니다.`;
    } else {
      els.secondarySection.hidden = true;
    }

    els.fitBreakdown.innerHTML = '';
    report.phase2.breakdown.forEach(item => {
      const row = document.createElement('div');
      row.className = 'fit-item';
      row.innerHTML = `
        <div class="fit-item-header">
          <span class="fit-item-text">${item.text}</span>
          <span class="fit-item-pct">${item.percent}%</span>
        </div>
        <div class="category-bar-track">
          <div class="category-bar-fill mbti-fill" style="width:${item.percent}%"></div>
        </div>
      `;
      els.fitBreakdown.appendChild(row);
    });

    showScreen('result');
  }

  function getFitColor(pct) {
    if (pct >= 85) return '#4ade80';
    if (pct >= 70) return '#6c8cff';
    if (pct >= 55) return '#fbbf24';
    return '#f87171';
  }

  function reset() {
    state = {
      p1Index: 0,
      p1Answers: [],
      p1Questions: [],
      p2Index: 0,
      p2Answers: [],
      mbtiType: null,
      phase2Questions: [],
      phase1Result: null
    };
    showScreen('start');
  }

  els.btnStart.addEventListener('click', startPhase1);

  els.p1Prev.addEventListener('click', () => {
    if (state.p1Index > 0) { state.p1Index--; renderPhase1(); }
  });

  els.p1Next.addEventListener('click', () => {
    if (state.p1Index < state.p1Questions.length - 1) {
      state.p1Index++;
      renderPhase1();
    } else {
      finishPhase1();
    }
  });

  els.btnPhase2.addEventListener('click', startPhase2);

  els.p2Prev.addEventListener('click', () => {
    if (state.p2Index > 0) { state.p2Index--; renderPhase2(); }
  });

  els.p2Next.addEventListener('click', () => {
    if (state.p2Index < state.phase2Questions.length - 1) {
      state.p2Index++;
      renderPhase2();
    } else {
      showResults();
    }
  });

  els.btnRetry.addEventListener('click', reset);

  els.btnShare.addEventListener('click', async () => {
    const type = state.mbtiType;
    const pct = els.fitPercent.textContent;
    const name = MBTI_TYPES[type]?.name || '';
    const text = `MBTI 검사 결과: ${type} (${name}), 유형 적합도 ${pct}! 당신도 도전해 보세요.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'MBTI 검사 결과', text });
      } else {
        await navigator.clipboard.writeText(text);
        els.btnShare.textContent = '복사됨!';
        setTimeout(() => { els.btnShare.textContent = '결과 공유'; }, 2000);
      }
    } catch (_) {}
  });
})();
