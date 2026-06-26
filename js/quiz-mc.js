// 상식퀴즈 — 4지선다 보기 생성

const NATURE_BIO_CATEGORIES = [
  '곤충', '벌레', '동물', '조류', '어류', '해산물', '채소', '과일', '식물', '나무', '버섯'
];

function uniqueAnswers(answers, exclude) {
  const seen = new Set();
  const out = [];
  answers.forEach(a => {
    if (a === exclude || seen.has(a)) return;
    seen.add(a);
    out.push(a);
  });
  return out;
}

function padDistractors(list, count, fallback) {
  const result = list.slice(0, count);
  let i = 0;
  while (result.length < count && fallback.length) {
    const v = fallback[i % fallback.length];
    if (!result.includes(v)) result.push(v);
    i++;
  }
  return result;
}

function formatQuestionText(item, categoryId) {
  const q = item.q.trim();
  if (q.includes('?') || q.includes('？')) return q;
  switch (categoryId) {
    case 'capitals': return `${q}의 수도는?`;
    case 'flags': return `${q}은(는) 어느 대륙에 있나요?`;
    case 'english': return `"${q}"의 뜻은?`;
    case 'slang': return `「${q}」의 뜻은?`;
    case 'nature_bio': return `「${q}」은(는) 무엇에 속할까요?`;
    default: return `${q}`;
  }
}

function buildNatureBioOptions(item) {
  const pool = uniqueAnswers(NATURE_BIO_CATEGORIES, item.a);
  const distractors = padDistractors(shuffleArray(pool), 3, NATURE_BIO_CATEGORIES);
  return shuffleArray([item.a, distractors[0], distractors[1], distractors[2]]);
}

function buildLoveMbtiQuestion(item) {
  const choices = shuffleArray(item.opts.slice());
  const options = choices.map(c => c.t);
  const mbtiMap = choices.map(c => c.m);
  return {
    q: item.q,
    options,
    mbtiMap,
    answer: -1,
    explain: '',
    noGrade: true,
    mbtiMode: true
  };
}

function buildMCQuestion(item, allItems, categoryId) {
  const questionText = formatQuestionText(item, categoryId);

  if (categoryId === 'love_mbti') {
    return buildLoveMbtiQuestion(item);
  }

  if (categoryId === 'balance') {
    return {
      q: questionText,
      options: [],
      answer: -1,
      explain: item.a,
      noGrade: true,
      instantReveal: true
    };
  }

  if (categoryId === 'slang') {
    return {
      q: questionText,
      options: [],
      answer: -1,
      explain: item.a,
      noGrade: true,
      instantReveal: false
    };
  }

  if (categoryId === 'nature_bio') {
    const options = buildNatureBioOptions(item);
    return {
      q: questionText,
      options,
      answer: options.indexOf(item.a),
      explain: item.a,
      noGrade: false
    };
  }

  const pool = uniqueAnswers(allItems.map(x => x.a), item.a);
  const distractors = padDistractors(shuffleArray(pool), 3, ['해당 없음', '모름', '기타']);
  const options = shuffleArray([item.a, distractors[0], distractors[1], distractors[2]]);

  return {
    q: questionText,
    options,
    answer: options.indexOf(item.a),
    explain: item.a,
    noGrade: false
  };
}

function prepareMCQuiz(rawItems, categoryId) {
  return rawItems.map(item => {
    const catId = item.__cat || categoryId;
    const pool = rawItems.filter(x => (x.__cat || categoryId) === catId);
    return buildMCQuestion(item, pool, catId);
  });
}

function prepareMCQuizShuffled(rawItems, categoryId) {
  const shuffled = shuffleArray(rawItems.slice());
  return prepareMCQuiz(shuffled, categoryId);
}
