// ACA 결과 분석 — IRT 추정 · AI Cognitive Index

function getACAClassification(score) {
  return ACA_CLASSIFICATIONS.find(c => score >= c.min) ||
    ACA_CLASSIFICATIONS[ACA_CLASSIFICATIONS.length - 1];
}

function buildACAReport(questions, answers, elapsed, levelConfig) {
  const responses = questions.map((q, i) => ({
    question: q,
    correct: answers[i] === q.answer,
    a: q.discrimination,
    b: q.irtB,
    domain: q.domain,
    tier: q.tier
  }));

  const theta = estimateThetaMLE(
    responses.map(r => ({ a: r.a, b: r.b, correct: r.correct })),
    0
  );
  const se = estimateStandardError(theta, responses.map(r => ({ a: r.a, b: r.b, correct: r.correct })));
  const cognitiveIndex = thetaToIQ(theta);
  const coreIndex = cognitiveIndex;
  const classification = getACAClassification(cognitiveIndex);
  const percentile = thetaToPercentile(theta);
  const correct = responses.filter(r => r.correct).length;
  const total = questions.length;
  const reliability = Math.max(0, Math.min(0.99, 1 - se * se));
  const seIQ = Math.round(se * 15);

  const domainStats = {};
  Object.keys(ACA_DOMAINS).forEach(k => {
    domainStats[k] = { correct: 0, total: 0, score: 100 };
  });
  responses.forEach(r => {
    const d = r.domain || 'matrix';
    if (!domainStats[d]) domainStats[d] = { correct: 0, total: 0, score: 100 };
    domainStats[d].total++;
    if (r.correct) domainStats[d].correct++;
  });

  const domainScores = {};
  Object.entries(domainStats).forEach(([key, s]) => {
    if (s.total === 0) return;
    const ratio = s.correct / s.total;
    const z = (ratio - 0.55) / 0.22;
    domainScores[key] = {
      ...s,
      ratio,
      score: Math.max(55, Math.min(145, Math.round(100 + 15 * z))),
      info: ACA_DOMAINS[key]
    };
  });

  const tierStats = {};
  ACA_TIERS.forEach(t => { tierStats[t.tier] = { correct: 0, total: 0, label: t.label }; });
  responses.forEach(r => {
    tierStats[r.tier].total++;
    if (r.correct) tierStats[r.tier].correct++;
  });

  const domainEntries = Object.entries(domainScores)
    .filter(([, s]) => s.total > 0)
    .map(([key, s]) => ({ key, score: s.score, name: s.info.name, total: s.total }))
    .sort((a, b) => b.score - a.score);

  const strengths = domainEntries.filter(e => e.score >= 110).slice(0, 3);
  const weaknesses = domainEntries.filter(e => e.score < 90 && e.total >= 2).slice(-2).reverse();

  const ageLabel = levelConfig.subLabel;
  const rankText = percentile >= 98 ? '상위 약 2%' :
    percentile >= 90 ? '상위 약 10%' :
      percentile >= 75 ? '상위 약 25%' :
        percentile >= 40 ? '중간권' :
          percentile >= 10 ? '하위권' : '하위 약 10%';

  return {
    isACA: true,
    cognitiveIndex,
    iq: cognitiveIndex,
    coreIndex,
    theta,
    se,
    seIQ,
    reliability,
    classification,
    percentile,
    correct,
    total,
    elapsed,
    domainScores,
    tierStats,
    strengths,
    weaknesses,
    rankText,
    summary: `<strong>AI Cognitive Index ${cognitiveIndex}</strong>점(θ=${theta.toFixed(2)}, 신뢰도 ${Math.round(reliability * 100)}%). ` +
      `<strong>${ageLabel}</strong> 연령 집단 내 백분위 <strong>${percentile}%</strong>(${rankText}). ` +
      `총 ${total}문항 중 ${correct}문항 정답. ` +
      `추정 범위 약 ${cognitiveIndex - seIQ}~${cognitiveIndex + seIQ}점. ` +
      `※ 공인 IQ 검사가 아닌 AI 기반 인지능력 평가입니다.`,
    strengthText: strengths.length
      ? strengths.map(s => `${s.name} (${s.score}점)`).join(', ') + '에서 강점이 보입니다.'
      : '영역별 수행이 고르게 나타났습니다.',
    weaknessText: weaknesses.length
      ? weaknesses.map(s => `${s.name} (${s.score}점)`).join(', ') + ' 영역 보완을 권장합니다.'
      : '특별히 취약한 영역이 관찰되지 않았습니다.',
    comparisonText: `동일 연령(${ageLabel}) 집단과 비교 시 AI Cognitive Index ${cognitiveIndex}점은 ` +
      `평균 100·표준편차 15 규준에서 백분위 ${percentile}%에 해당합니다. ` +
      `쉬움→보통→어려움→최상급 구조에서 후반 난이도 정답이 지수에 더 크게 반영됩니다.`,
    recommendations: buildACARecommendations(levelConfig.id, cognitiveIndex, weaknesses),
    cognitiveProfile: buildACACognitiveProfile(domainScores, tierStats, reliability, se)
  };
}

function buildACARecommendations(ageId, index, weaknesses) {
  const recs = [];
  if (index >= 115) {
    recs.push('복합 규칙 행렬·추상 퍼즐로 난이도를 유지하며 도전하세요.');
    recs.push('시간 제한 속에서 정확도를 유지하는 연습이 도움이 됩니다.');
  } else if (index >= 90) {
    recs.push('패턴·회전·대칭 규칙을 단계별로 분리해 풀어보는 연습을 권장합니다.');
    recs.push('틀린 문항에서 행 규칙과 열 규칙을 각각 적어 보세요.');
  } else {
    recs.push('2×2 간단 행렬부터 규칙 하나씩 찾는 연습을 시작하세요.');
    recs.push('도형의 색·개수·방향 변화만 먼저 관찰하는 전략을 써 보세요.');
  }
  weaknesses.forEach(w => {
    if (w.key === 'rotation') recs.push('도형 회전(90°·180°) 카드 게임으로 공간 변환 감각을 키우세요.');
    if (w.key === 'symmetry') recs.push('거울 대칭 그리기·접기 활동으로 대칭 규칙에 익숙해지세요.');
    if (w.key === 'abstract') recs.push('두 가지 규칙이 동시에 적용된 퍼즐을 천천히 분해해 풀어 보세요.');
  });
  return recs.slice(0, 4);
}

function buildACACognitiveProfile(domainScores, tierStats, reliability, se) {
  const parts = Object.entries(domainScores)
    .filter(([, s]) => s.total > 0)
    .map(([, s]) => `<strong>${s.info.name}</strong> (${s.correct}/${s.total}, ${s.score}점): ${s.info.desc}`);

  const tierLines = Object.values(tierStats)
    .filter(t => t.total > 0)
    .map(t => `${t.label} ${t.correct}/${t.total}정답`);

  parts.push(`<strong>난이도별 수행</strong>: ${tierLines.join(' → ')}`);
  parts.push(`<strong>측정 신뢰도</strong>: ${Math.round(reliability * 100)}% (SE≈${(se * 15).toFixed(1)} IQ)`);
  return parts;
}
