// ACA 검사 세션 생성 — 고정 난이도 구조 (쉬움→보통→어려움→최상급)

function acaSessionSeed() {
  return Date.now() ^ (Math.random() * 0xffffffff) | 0;
}

function buildACATest(ageId, seed) {
  const cfg = ACA_LEVELS[ageId];
  if (!cfg) return [];

  const baseSeed = seed ?? acaSessionSeed();
  const questions = [];
  let seq = 0;

  ACA_TIERS.forEach(tierInfo => {
    for (let i = 0; i < cfg.perTier; i++) {
      questions.push(acaGenerateMatrixQuestion(ageId, tierInfo.tier, seq++, baseSeed));
    }
  });

  return questions;
}

function shuffleACAOptions(question) {
  const indices = question.options.map((_, i) => i);
  const shuffled = shuffleArray(indices);
  return {
    ...question,
    options: shuffled.map(i => question.options[i]),
    answer: shuffled.indexOf(question.answer)
  };
}

function prepareACATest(ageId, seed) {
  return buildACATest(ageId, seed).map(shuffleACAOptions);
}

function getACATierProgress(questionIndex, ageId) {
  const perTier = ACA_LEVELS[ageId].perTier;
  const tierIdx = Math.floor(questionIndex / perTier);
  const tier = ACA_TIERS[Math.min(tierIdx, ACA_TIERS.length - 1)];
  return {
    tier: tier.tier,
    label: tier.label,
    indexInTier: questionIndex % perTier + 1,
    perTier
  };
}
