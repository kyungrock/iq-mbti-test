// InsightIQ CAT (Computerized Adaptive Testing) 세션

const INSIGHTIQ_DOMAINS = {
  VCI: { code: 'VCI', name: '언어이해', fullName: '언어이해 (VCI)', desc: '어휘·개념·사회적 판단' },
  VSI: { code: 'VSI', name: '시공간추론', fullName: '시공간추론 (VSI)', desc: '공간 회전·시각 패턴·구성' },
  FRI: { code: 'FRI', name: '유동추론', fullName: '유동추론 (FRI)', desc: '규칙 발견·논리·유추' },
  WMI: { code: 'WMI', name: '작업기억', fullName: '작업기억 (WMI)', desc: '정보 유지·조작·순서 처리' },
  PSI: { code: 'PSI', name: '처리속도', fullName: '처리속도 (PSI)', desc: '신속한 시지각 처리·기호 변환' }
};

const INSIGHTIQ_DOMAIN_ORDER = ['VCI', 'VSI', 'FRI', 'WMI', 'PSI'];

function createInsightIQCATSession(config) {
  const cfg = {
    warmupItems: config?.warmupItems ?? 3,
    minItems: config?.catMinItems ?? 25,
    maxItems: config?.catMaxItems ?? 35,
    targetSE: config?.catTargetSE ?? 0.32,
    minPerDomain: config?.minPerDomain ?? 4,
    ...config
  };

  clearInsightIQBankCache();
  const { bank, seed } = getInsightIQQuestionBank(true);
  const rng = mulberry32(seed);
  const usedIds = new Set();

  let theta = 0;
  let itemIndex = 0;
  let boostDifficulty = 0;
  const responses = [];
  const administered = [];
  const domainCounts = { VCI: 0, VSI: 0, FRI: 0, WMI: 0, PSI: 0 };

  function availablePool(domain, minDiff, maxDiff) {
    return bank.filter(q =>
      !usedIds.has(q.id) &&
      q.index === domain &&
      q.difficulty >= minDiff &&
      q.difficulty <= maxDiff
    );
  }

  function markUsed(q) {
    usedIds.add(q.id);
    administered.push(q);
    domainCounts[q.index]++;
    itemIndex++;
  }

  function nextDomain() {
    const under = INSIGHTIQ_DOMAIN_ORDER.filter(d => domainCounts[d] < cfg.minPerDomain);
    if (under.length) return under.sort((a, b) => domainCounts[a] - domainCounts[b])[0];
    return INSIGHTIQ_DOMAIN_ORDER[itemIndex % INSIGHTIQ_DOMAIN_ORDER.length];
  }

  function getNextQuestion() {
    if (itemIndex < cfg.warmupItems) {
      const domain = INSIGHTIQ_DOMAIN_ORDER[itemIndex % INSIGHTIQ_DOMAIN_ORDER.length];
      const pool = availablePool(domain, 2, 4);
      let q = pool.length
        ? pool[Math.floor(rng() * pool.length)]
        : bank.find(x => x.index === domain && !usedIds.has(x.id));
      if (!q) q = generateInsightIQQuestionOnDemand(domain, 3, rng);
      if (!q) return null;
      markUsed(q);
      return shuffleQuestionOptions(q);
    }

    const domain = nextDomain();
    const targetB = difficultyToIrtB(5 + boostDifficulty);
    const targetTheta = theta + (boostDifficulty > 0 ? 0.25 : 0);

    let pool = availablePool(domain, 3, 10);
    if (!pool.length) {
      const fresh = generateInsightIQQuestionOnDemand(domain, irtBToDifficulty(targetB), rng);
      if (fresh) pool = [fresh];
    }

    pool.sort((a, b) => {
      const ia = itemInformation(targetTheta, a.discrimination, a.irtB);
      const ib = itemInformation(targetTheta, b.discrimination, b.irtB);
      return ib - ia;
    });

    const top = pool.slice(0, Math.min(8, pool.length));
    const q = top[Math.floor(rng() * top.length)] || pool[0];
    if (!q) return null;
    markUsed(q);
    boostDifficulty = 0;
    return shuffleQuestionOptions(q);
  }

  function recordResponse(question, answerIndex, timeMs) {
    const correct = answerIndex === question.answer;
    responses.push({
      question,
      correct,
      timeMs,
      a: question.discrimination,
      b: question.irtB
    });

    if (responses.length <= cfg.warmupItems && correct) {
      boostDifficulty = 1.5;
    } else if (correct) {
      boostDifficulty = 1.2;
      theta = estimateThetaMLE(responses.map(r => ({ a: r.a, b: r.b, correct: r.correct })), theta + 0.15);
    } else {
      boostDifficulty = -0.5;
      theta = estimateThetaMLE(responses.map(r => ({ a: r.a, b: r.b, correct: r.correct })), theta - 0.1);
    }
    theta = Math.max(-2.2, Math.min(4.0, theta));
  }

  function isComplete() {
    const se = estimateStandardError(theta, responses.map(r => ({ a: r.a, b: r.b, correct: r.correct })));
    const domainOk = INSIGHTIQ_DOMAIN_ORDER.every(d => domainCounts[d] >= cfg.minPerDomain);
    if (itemIndex < cfg.minItems) return false;
    if (itemIndex >= cfg.maxItems) return true;
    return domainOk && se <= cfg.targetSE;
  }

  function getProgressLabel() {
    return `${itemIndex} / ${cfg.maxItems}`;
  }

  function getDomainThetas() {
    const byDomain = {};
    INSIGHTIQ_DOMAIN_ORDER.forEach(d => { byDomain[d] = []; });
    responses.forEach(r => {
      if (byDomain[r.question.index]) {
        byDomain[r.question.index].push({ a: r.a, b: r.b, correct: r.correct });
      }
    });
    const scores = {};
    INSIGHTIQ_DOMAIN_ORDER.forEach(d => {
      const dr = byDomain[d];
      const t = dr.length ? estimateThetaMLE(dr, theta) : theta;
      scores[d] = {
        theta: t,
        score: thetaToIQ(t),
        correct: dr.filter(x => x.correct).length,
        total: dr.length,
        info: INSIGHTIQ_DOMAINS[d]
      };
    });
    return scores;
  }

  function getResults() {
    const se = estimateStandardError(theta, responses.map(r => ({ a: r.a, b: r.b, correct: r.correct })));
    const compositeIQ = thetaToIQ(theta);
    const domainScores = getDomainThetas();
    const coreIndex = Math.round((domainScores.VCI.score + domainScores.VSI.score + domainScores.FRI.score) / 3);

    return {
      theta,
      se,
      compositeIQ,
      coreIndex,
      domainScores,
      responses,
      administered,
      bankSize: bank.length,
      seed,
      itemCount: itemIndex
    };
  }

  return {
    config: cfg,
    bank,
    getNextQuestion,
    recordResponse,
    isComplete,
    getProgressLabel,
    getResults,
    get itemCount() { return itemIndex; },
    get maxItems() { return cfg.maxItems; }
  };
}

function isInsightIQCATLevel(levelId) {
  const cfg = getAllAgeLevels()[levelId];
  return levelId === 'insightiq' && cfg?.useCAT;
}
