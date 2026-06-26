(function () {
  const screens = {
    categories: document.getElementById('screen-categories'),
    play: document.getElementById('screen-play'),
    done: document.getElementById('screen-done')
  };

  const els = {
    categoryGrid: document.getElementById('category-grid'),
    btnBack: document.getElementById('btn-back'),
    playIcon: document.getElementById('play-icon'),
    playTitle: document.getElementById('play-title'),
    playProgress: document.getElementById('play-progress'),
    statCorrect: document.getElementById('stat-correct'),
    statWrong: document.getElementById('stat-wrong'),
    statRemaining: document.getElementById('stat-remaining'),
    questionText: document.getElementById('question-text'),
    optionsLabel: document.getElementById('quiz-options-label'),
    options: document.getElementById('quiz-options'),
    scoreBar: document.getElementById('quiz-score-bar'),
    feedback: document.getElementById('quiz-feedback'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnShuffle: document.getElementById('btn-shuffle'),
    doneMessage: document.getElementById('done-message'),
    doneCorrect: document.getElementById('done-correct'),
    doneTotal: document.getElementById('done-total'),
    donePercent: document.getElementById('done-percent'),
    btnReplay: document.getElementById('btn-replay'),
    btnHome: document.getElementById('btn-home')
  };

  let category = null;
  let rawItems = [];
  let questions = [];
  let index = 0;
  let selected = null;
  let answered = false;
  let correctCount = 0;
  let wrongCount = 0;

  function showScreen(name) {
    Object.values(screens).forEach(s => s.classList.remove('active'));
    screens[name].classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function initCategories() {
    els.categoryGrid.innerHTML = '';
    getQuizCategoriesByGroup().forEach(group => {
      const section = document.createElement('div');
      section.className = 'quiz-group-section';
      section.innerHTML = `<h3 class="quiz-group-title">${group.label}</h3>`;
      const grid = document.createElement('div');
      grid.className = 'quiz-category-grid';
      const sorted = group.categories.slice().sort((a, b) => {
        if (a.id === 'mix_200') return -1;
        if (b.id === 'mix_200') return 1;
        return 0;
      });
      sorted.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-category-card' + (cat.id === 'mix_200' ? ' quiz-category-featured' : '');
        btn.style.borderColor = `${cat.color}33`;
        btn.innerHTML = `
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-title">${cat.title}</span>
          <span class="cat-count">${categoryCountLabel(cat)}</span>
        `;
        btn.addEventListener('click', () => startCategory(cat.id));
        grid.appendChild(btn);
      });
      section.appendChild(grid);
      els.categoryGrid.appendChild(section);
    });
  }

  function startCategory(id) {
    category = getQuizCategory(id);
    if (!category) return;
    rawItems = pickQuizRoundItems(category);
    questions = prepareMCQuiz(rawItems, category.id);
    index = 0;
    selected = null;
    answered = false;
    correctCount = 0;
    wrongCount = 0;

    els.playIcon.textContent = category.icon;
    els.playTitle.textContent = category.title;

    showScreen('play');
    renderQuestion();
    updateStats();
  }

  function currentQ() {
    return questions[index];
  }

  function categoryModeLabel(id) {
    if (id === 'mix_200') return '종합';
    if (id === 'balance') return '토론형';
    if (id === 'slang') return '뜻 맞히기';
    if (id === 'love_mbti') return 'MBTI 유형';
    return '4지선다';
  }

  function categoryCountLabel(cat) {
    return `200문항 · ${categoryModeLabel(cat.id)}`;
  }

  function isNoScoreCategory() {
    return category?.id === 'balance' || category?.id === 'slang' || category?.id === 'love_mbti';
  }

  function formatMbtiBadge(type) {
    const info = (typeof MBTI_TYPES !== 'undefined' && MBTI_TYPES[type]) || null;
    if (!info) return type;
    return `${type} ${info.emoji}`;
  }

  function formatMbtiFeedback(type) {
    const info = (typeof MBTI_TYPES !== 'undefined' && MBTI_TYPES[type]) || null;
    if (!info) return `💕 <strong>${type}</strong> 성향의 선택이에요`;
    return `💕 <strong>${type} · ${info.emoji} ${info.name}</strong> (${info.group})<br><span class="quiz-mbti-desc">${info.desc}</span>`;
  }

  function showAnswer(q, prefix) {
    els.feedback.className = 'quiz-feedback quiz-feedback-neutral';
    els.feedback.textContent = `${prefix} ${q.explain}`;
    els.feedback.hidden = false;
    answered = true;
    els.btnNext.disabled = false;
  }

  function renderQuestion() {
    const q = currentQ();
    if (!q) return;

    selected = null;
    answered = false;

    els.playProgress.textContent = `${index + 1} / ${questions.length}`;
    els.questionText.textContent = q.q;
    els.feedback.hidden = true;
    els.feedback.textContent = '';
    els.feedback.className = 'quiz-feedback';
    els.btnPrev.disabled = index === 0;
    els.btnNext.disabled = true;
    els.btnNext.textContent = index === questions.length - 1 ? '결과 보기' : '다음';

    const isNoOptions = !q.options || q.options.length === 0;

    if (isNoOptions) {
      els.optionsLabel.hidden = true;
      els.scoreBar.hidden = true;
      els.options.hidden = false;
      els.options.innerHTML = '';

      if (q.instantReveal) {
        showAnswer(q, '💬');
      } else {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'btn btn-primary quiz-reveal-btn';
        btn.textContent = '정답 보기';
        btn.addEventListener('click', () => {
          btn.disabled = true;
          btn.classList.add('quiz-reveal-done');
          showAnswer(q, '💡');
        });
        els.options.appendChild(btn);
      }
    } else {
      els.optionsLabel.hidden = false;
      els.options.hidden = false;
      els.scoreBar.hidden = q.mbtiMode || false;
      els.optionsLabel.textContent = q.mbtiMode
        ? '나라면? — 선택하면 전체 유형이 나와요'
        : '보기 — 하나를 선택하세요';
      els.options.innerHTML = '';
      q.options.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-option';
        btn.dataset.index = i;
        const mbtiTag = q.mbtiMode
          ? `<span class="quiz-mbti-tag" hidden aria-hidden="true"></span>`
          : '';
        btn.innerHTML = `
          <span class="quiz-option-num">${i + 1}</span>
          <span class="quiz-option-text">${opt}</span>
          ${mbtiTag}
        `;
        btn.addEventListener('click', () => selectOption(i));
        els.options.appendChild(btn);
      });
    }

    updateStats();
  }

  function updateStats() {
    if (isNoScoreCategory()) return;
    const remaining = questions.length - index - (answered ? 0 : 1);
    els.statCorrect.textContent = correctCount;
    els.statWrong.textContent = wrongCount;
    els.statRemaining.textContent = Math.max(0, remaining);
  }

  function selectOption(i) {
    if (answered) return;
    const q = currentQ();
    answered = true;
    selected = i;

    const isBalance = q.noGrade && !q.mbtiMode;
    const isMbti = q.mbtiMode;
    const isCorrect = !q.noGrade && i === q.answer;

    if (isMbti) {
      const type = q.mbtiMap[i];
      els.feedback.className = 'quiz-feedback quiz-feedback-mbti';
      els.feedback.innerHTML = formatMbtiFeedback(type);
    } else if (isBalance) {
      els.feedback.className = 'quiz-feedback quiz-feedback-neutral';
      els.feedback.textContent = `💬 ${q.explain}`;
    } else if (isCorrect) {
      correctCount++;
      els.feedback.className = 'quiz-feedback quiz-feedback-correct';
      els.feedback.textContent = `✅ 정답! ${q.explain}`;
    } else {
      wrongCount++;
      els.feedback.className = 'quiz-feedback quiz-feedback-wrong';
      els.feedback.textContent = `❌ 오답 — 정답: ${q.options[q.answer]}`;
    }

    els.feedback.hidden = false;

    els.options.querySelectorAll('.quiz-option').forEach((btn, idx) => {
      btn.disabled = true;
      btn.classList.remove('selected', 'correct', 'wrong', 'mbti-pick');
      if (isMbti && q.mbtiMap) {
        const tag = btn.querySelector('.quiz-mbti-tag');
        if (tag) {
          tag.textContent = formatMbtiBadge(q.mbtiMap[idx]);
          tag.hidden = false;
          tag.removeAttribute('aria-hidden');
        }
      }
      if (!isMbti && !isBalance && idx === q.answer) {
        btn.classList.add('correct');
      }
      if (idx === i && !isBalance && !isMbti && !isCorrect) {
        btn.classList.add('wrong');
      }
      if (idx === i && (isCorrect || isBalance || isMbti)) {
        btn.classList.add(isMbti ? 'mbti-pick' : 'selected');
      }
    });

    els.btnNext.disabled = false;
    updateStats();
  }

  function goNext() {
    if (!answered) return;
    if (index < questions.length - 1) {
      index++;
      renderQuestion();
    } else {
      finishRound();
    }
  }

  function goPrev() {
    if (index > 0) {
      index--;
      renderQuestion();
    }
  }

  function finishRound() {
    const graded = questions.filter(q => !q.noGrade).length;
    const pct = graded > 0 ? Math.round((correctCount / graded) * 100) : null;

    let suffix = '';
    if (category.id === 'balance') suffix = ' 서로 선택을 말해보세요!';
    else if (category.id === 'slang') suffix = ' 몇 개 맞혔는지 세어보세요!';
    else if (category.id === 'love_mbti') suffix = ' 친구와 선택을 비교해보세요!';

    els.doneMessage.textContent = `「${category.title}」 ${questions.length}문항 완료!${suffix}`;
    els.doneCorrect.textContent = isNoScoreCategory() ? '—' : correctCount;
    els.doneTotal.textContent = questions.length;
    els.donePercent.textContent = pct != null ? `${pct}%` : (
      category.id === 'slang' ? '자가 채점' :
      category.id === 'love_mbti' ? 'MBTI 유형' : '토론형'
    );
    showScreen('done');
  }

  function reshuffle() {
    const q = currentQ();
    const oldStem = q?.q;
    rawItems = pickQuizRoundItems(category);
    questions = prepareMCQuiz(rawItems, category.id);
    if (oldStem) {
      const ni = questions.findIndex(x => x.q === oldStem);
      if (ni >= 0) index = ni;
    }
    correctCount = 0;
    wrongCount = 0;
    renderQuestion();
  }

  els.btnBack.addEventListener('click', () => showScreen('categories'));
  els.btnPrev.addEventListener('click', goPrev);
  els.btnNext.addEventListener('click', goNext);
  els.btnShuffle.addEventListener('click', reshuffle);
  els.btnReplay.addEventListener('click', () => startCategory(category.id));
  els.btnHome.addEventListener('click', () => showScreen('categories'));

  const heroBadge = document.getElementById('quiz-hero-badge');
  if (heroBadge && typeof getQuizTotalItemCount === 'function') {
    const n = getQuizTotalItemCount();
    heroBadge.textContent = `카테고리별 200문항 · 21종 · 풀 ${n}+`;
  }

  initCategories();
})();
