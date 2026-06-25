function shuffleArray(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function shuffleQuestionOptions(question) {
  const indices = question.options.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  return {
    ...question,
    options: shuffled.map(i => question.options[i]),
    answer: shuffled.indexOf(question.answer)
  };
}

function pickBalanced(pool, count, groupKey) {
  const groups = {};
  pool.forEach(item => {
    const key = item[groupKey];
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });

  const keys = shuffleArray(Object.keys(groups));
  const perGroup = Math.max(1, Math.floor(count / keys.length));
  const picked = [];
  const used = new Set();

  keys.forEach(key => {
    const items = shuffleArray(groups[key]);
    items.slice(0, perGroup).forEach(q => {
      if (picked.length < count && !used.has(q)) {
        picked.push(q);
        used.add(q);
      }
    });
  });

  if (picked.length < count) {
    shuffleArray(pool.filter(q => !used.has(q))).forEach(q => {
      if (picked.length < count) {
        picked.push(q);
        used.add(q);
      }
    });
  }

  return shuffleArray(picked.slice(0, count));
}

function prepareTestQuestions(pool, count, groupKey) {
  return pickBalanced(pool, count, groupKey).map(shuffleQuestionOptions);
}

function pickFromPool(pool, count) {
  return shuffleArray(pool).slice(0, Math.min(count, pool.length));
}
