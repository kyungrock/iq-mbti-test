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
    statLearned: document.getElementById('stat-learned'),
    statRemaining: document.getElementById('stat-remaining'),
    quizCard: document.getElementById('quiz-card'),
    cardLabel: document.getElementById('card-label'),
    cardText: document.getElementById('card-text'),
    cardHint: document.getElementById('card-hint'),
    btnPrev: document.getElementById('btn-prev'),
    btnNext: document.getElementById('btn-next'),
    btnShuffle: document.getElementById('btn-shuffle'),
    doneMessage: document.getElementById('done-message'),
    doneTotal: document.getElementById('done-total'),
    btnReplay: document.getElementById('btn-replay'),
    btnHome: document.getElementById('btn-home')
  };

  let category = null;
  let items = [];
  let index = 0;
  let revealed = false;
  let learned = new Set();

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
      group.categories.forEach(cat => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'quiz-category-card';
        btn.style.borderColor = `${cat.color}33`;
        btn.innerHTML = `
          <span class="cat-icon">${cat.icon}</span>
          <span class="cat-title">${cat.title}</span>
          <span class="cat-count">${cat.items.length}문항</span>
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
    items = shuffleArray(category.items.slice());
    index = 0;
    revealed = false;
    learned = new Set();

    els.playIcon.textContent = category.icon;
    els.playTitle.textContent = category.title;
    els.quizCard.style.borderColor = `${category.color}44`;

    showScreen('play');
    renderCard();
    updateStats();
  }

  function currentItem() {
    return items[index];
  }

  function renderCard() {
    const item = currentItem();
    if (!item) return;

    els.playProgress.textContent = `${index + 1} / ${items.length}`;
    els.btnPrev.disabled = index === 0;

    const isBalance = category.id === 'balance';

    if (!revealed) {
      els.quizCard.classList.remove('revealed');
      els.cardLabel.textContent = category.promptLabel;
      els.cardText.textContent = item.q;
      els.cardHint.textContent = isBalance ? '클릭하면 토론 포인트' : '클릭하면 정답이 나옵니다';
    } else {
      els.quizCard.classList.add('revealed');
      els.cardLabel.textContent = category.answerLabel;
      els.cardText.textContent = item.a;
      els.cardHint.textContent = isBalance ? '클릭하면 다음 선택' : '클릭하면 다음 문제';
    }
  }

  function updateStats() {
    els.statLearned.textContent = learned.size;
    els.statRemaining.textContent = items.length - index - (revealed ? 0 : 1);
  }

  function revealAnswer() {
    if (revealed) return;
    revealed = true;
    learned.add(index);
    renderCard();
    updateStats();
  }

  function goNext() {
    if (index < items.length - 1) {
      index++;
      revealed = false;
      renderCard();
      updateStats();
    } else {
      finishRound();
    }
  }

  function goPrev() {
    if (index > 0) {
      index--;
      revealed = false;
      renderCard();
      updateStats();
    }
  }

  function onCardClick() {
    if (!revealed) {
      revealAnswer();
    } else {
      goNext();
    }
  }

  function finishRound() {
    const suffix = category.id === 'balance'
      ? ' 서로 선택을 말해보세요!'
      : category.id === 'love_mbti'
        ? ' "너라면 어떻게 할 건데?" 대화해보세요!'
        : '';
    els.doneMessage.textContent = `「${category.title}」 ${items.length}문항 완료!${suffix}`;
    els.doneTotal.textContent = items.length;
    showScreen('done');
  }

  function reshuffle() {
    const current = currentItem();
    items = shuffleArray(items);
    if (current) {
      const newIdx = items.findIndex(x => x.q === current.q && x.a === current.a);
      if (newIdx >= 0) index = newIdx;
    }
    revealed = false;
    renderCard();
    updateStats();
  }

  els.quizCard.addEventListener('click', onCardClick);
  els.btnBack.addEventListener('click', () => showScreen('categories'));
  els.btnPrev.addEventListener('click', goPrev);
  els.btnNext.addEventListener('click', () => {
    if (!revealed) revealAnswer();
    else goNext();
  });
  els.btnShuffle.addEventListener('click', reshuffle);
  els.btnReplay.addEventListener('click', () => startCategory(category.id));
  els.btnHome.addEventListener('click', () => showScreen('categories'));

  initCategories();
})();
