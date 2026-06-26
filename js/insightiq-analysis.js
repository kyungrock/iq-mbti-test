function ratioToIndexScore(ratio, config) {
  const mean = config?.normMean ?? 0.62;
  const sd = config?.normSd ?? 0.17;
  const z = (ratio - mean) / sd;
  return Math.max(55, Math.min(145, Math.round(100 + 15 * z)));
}

function getInsightIQClassification(score) {
  return INSIGHTIQ_CLASSIFICATIONS.find(c => score >= c.min) ||
    INSIGHTIQ_CLASSIFICATIONS[INSIGHTIQ_CLASSIFICATIONS.length - 1];
}

function getIndexStats(questions, answers) {
  const stats = {};
  Object.keys(INSIGHTIQ_INDICES).forEach(k => {
    stats[k] = { correct: 0, total: 0, details: {} };
  });

  questions.forEach((q, i) => {
    const idx = q.index;
    if (!stats[idx]) return;
    stats[idx].total++;
    if (answers[i] === q.answer) stats[idx].correct++;

    if (!stats[idx].details[q.subtest]) {
      stats[idx].details[q.subtest] = { correct: 0, total: 0 };
    }
    stats[idx].details[q.subtest].total++;
    if (answers[i] === q.answer) stats[idx].details[q.subtest].correct++;
  });

  return stats;
}

function buildInsightIQReport(questions, answers, elapsed, config) {
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const total = questions.length;
  const indexStats = getIndexStats(questions, answers);

  const indexScores = {};
  Object.entries(indexStats).forEach(([key, s]) => {
    const ratio = s.total > 0 ? s.correct / s.total : 0;
    indexScores[key] = {
      score: ratioToIndexScore(ratio, config),
      correct: s.correct,
      total: s.total,
      ratio,
      details: s.details,
      info: INSIGHTIQ_INDICES[key]
    };
  });

  const compositeIQ = Math.round(
    (indexScores.VCI.score + indexScores.PRI.score + indexScores.WMI.score + indexScores.PSI.score) / 4
  );
  const coreIndex = Math.round((indexScores.VCI.score + indexScores.PRI.score) / 2);
  const classification = getInsightIQClassification(compositeIQ);
  const percentile = Math.round(normCdf((compositeIQ - 100) / 15) * 100);

  const detailStats = getDetailStats(questions, answers);
  const { strengths, weaknesses } = getInsightIQStrengthsWeaknesses(indexScores);
  const speedLevel = getSpeedScore(elapsed, config.timeLimit, correct, total);
  const recKey = config.recKey || 'adult';
  const performanceTier = compositeIQ >= 115 ? 'high' : compositeIQ >= 90 ? 'mid' : 'low';
  const recs = AGE_RECOMMENDATIONS[recKey] || AGE_RECOMMENDATIONS.adult;

  return {
    isInsightIQ: true,
    compositeIQ,
    coreIndex,
    iq: compositeIQ,
    indexScores,
    classification,
    percentile,
    correct,
    total,
    elapsed,
    detailStats,
    strengths,
    weaknesses,
    speedLevel,
    recommendations: recs[performanceTier],
    summary: buildInsightIQSummary(config, compositeIQ, coreIndex, classification, correct, total, percentile),
    indexAnalysis: buildIndexAnalysis(indexScores),
    detailAnalysis: buildDetailAnalysis(detailStats),
    strengthText: buildInsightIQStrengthText(strengths),
    weaknessText: buildInsightIQWeaknessText(weaknesses),
    comparisonText: buildInsightIQComparison(config, compositeIQ, coreIndex, percentile),
    cognitiveProfile: buildInsightIQProfile(indexScores, speedLevel)
  };
}

function getDetailStats(questions, answers) {
  const stats = {};
  questions.forEach((q, i) => {
    const key = q.subtest;
    if (!stats[key]) stats[key] = { correct: 0, total: 0, index: q.index };
    stats[key].total++;
    if (answers[i] === q.answer) stats[key].correct++;
  });
  return stats;
}

function getInsightIQStrengthsWeaknesses(indexScores) {
  const entries = Object.entries(indexScores).map(([key, s]) => ({
    key, score: s.score, name: s.info.name
  }));
  entries.sort((a, b) => b.score - a.score);
  return {
    strengths: entries.filter(e => e.score >= 110).slice(0, 2),
    weaknesses: entries.filter(e => e.score < 90).slice(-2).reverse()
  };
}

function buildInsightIQSummary(config, compositeIQ, coreIndex, cls, correct, total, percentile) {
  const exam = config.examName;
  const sub = config.subLabel ? ` (${config.subLabel} · ${config.ageRange})` : ` (${config.ageRange})`;
  return `<strong>${exam}</strong>${sub} 검사 결과, ` +
    `<strong>종합 IQ ${compositeIQ}</strong>점으로 「${cls.label}」에 해당합니다(백분위 ${percentile}%). ` +
    `핵심 능력 지수(언어·지각)는 <strong>${coreIndex}</strong>점입니다. ` +
    `총 ${total}문항 중 ${correct}문항 정답. ` +
    `※ 공인 임상 지능검사가 아니며 참고용입니다.`;
}

function buildIndexAnalysis(indexScores) {
  return Object.entries(indexScores).map(([key, s]) => {
    const pct = Math.round(s.ratio * 100);
    let interpretation;
    if (s.score >= 120) interpretation = `${s.info.name} 능력이 매우 우수합니다.`;
    else if (s.score >= 100) interpretation = `${s.info.name} 능력이 평균 이상입니다.`;
    else if (s.score >= 85) interpretation = `${s.info.name} 능력이 평균 범위입니다.`;
    else interpretation = `${s.info.name} 영역의 보완이 도움이 될 수 있습니다.`;
    return { key, s, pct, interpretation };
  });
}

function buildDetailAnalysis(detailStats) {
  return Object.entries(detailStats)
    .map(([name, s]) => ({
      name,
      label: INSIGHTIQ_DETAIL_LABELS[name] || name,
      index: s.index,
      correct: s.correct,
      total: s.total,
      pct: Math.round((s.correct / s.total) * 100)
    }))
    .sort((a, b) => b.pct - a.pct);
}

function buildInsightIQStrengthText(strengths) {
  if (!strengths.length) return '4개 영역이 고르게 나타났습니다.';
  return strengths.map(s => `${s.name} 영역 (${s.score}점)`).join(', ') + '에서 강점이 보입니다.';
}

function buildInsightIQWeaknessText(weaknesses) {
  if (!weaknesses.length) return '특별히 취약한 영역이 관찰되지 않았습니다.';
  return weaknesses.map(s => `${s.name} 영역 (${s.score}점)`).join(', ') + ' 보완을 권장합니다.';
}

function buildInsightIQComparison(config, compositeIQ, coreIndex, percentile) {
  const exam = config.examName;
  const age = config.ageRange;
  const coreDiff = coreIndex - compositeIQ;
  let coreNote = '';
  if (coreDiff >= 5) coreNote = ' 핵심 능력 지수가 종합 IQ보다 높아, 작업기억·처리속도 영향이 상대적으로 낮을 수 있습니다.';
  else if (coreDiff <= -5) coreNote = ' 종합 IQ가 핵심 능력 지수보다 높아, 작업기억·처리속도에서 추가 점수를 얻었을 수 있습니다.';

  if (compositeIQ >= 120) return `${exam} 연령 규준(${age}) 기준 상위권입니다.${coreNote}`;
  if (compositeIQ >= 90) return `${exam} 연령 규준(${age}) 기준 평균 범위에 해당합니다.${coreNote}`;
  return `${exam} 연령 규준(${age}) 기준 보완이 필요한 영역이 있을 수 있습니다. 전문가 상담을 권장합니다.${coreNote}`;
}

function buildInsightIQProfile(indexScores, speedLevel) {
  const parts = Object.entries(indexScores).map(([, s]) =>
    `<strong>${s.info.fullName}</strong> (${s.correct}/${s.total}, ${s.score}점): ${s.info.desc}`
  );
  parts.push(`<strong>처리속도 수행</strong>: ${DOMAIN_DESCRIPTIONS.speed[speedLevel]}`);
  return parts;
}

/** IRT·CAT 기반 InsightIQ 성인 리포트 */
function buildInsightIQCATReport(catResults, elapsed, config) {
  const { theta, se, compositeIQ, coreIndex, domainScores, responses, administered, bankSize } = catResults;
  const correct = responses.filter(r => r.correct).length;
  const total = responses.length;
  const classification = getInsightIQClassification(compositeIQ);
  const percentile = thetaToPercentile(theta);

  const indexScores = {};
  Object.entries(domainScores).forEach(([key, s]) => {
    indexScores[key] = {
      score: s.score,
      correct: s.correct,
      total: s.total,
      ratio: s.total > 0 ? s.correct / s.total : 0,
      theta: s.theta,
      info: s.info
    };
  });

  const entries = Object.values(indexScores).map(s => ({ score: s.score, name: s.info.name }));
  entries.sort((a, b) => b.score - a.score);
  const strengths = entries.filter(e => e.score >= 110).slice(0, 2);
  const weaknesses = entries.filter(e => e.score < 90).slice(-2).reverse();

  const detailStats = {};
  administered.forEach((q, i) => {
    const key = q.subtest;
    if (!detailStats[key]) detailStats[key] = { correct: 0, total: 0, index: q.index };
    detailStats[key].total++;
    if (responses[i]?.correct) detailStats[key].correct++;
  });

  const recKey = config.recKey || 'adult';
  const performanceTier = compositeIQ >= 115 ? 'high' : compositeIQ >= 90 ? 'mid' : 'low';
  const recs = AGE_RECOMMENDATIONS[recKey] || AGE_RECOMMENDATIONS.adult;
  const speedLevel = getSpeedScore(elapsed, config.timeLimit, correct, total);

  const seIQ = Math.round(se * 15);
  const exam = config.examName;

  return {
    isInsightIQ: true,
    isCAT: true,
    compositeIQ,
    coreIndex,
    iq: compositeIQ,
    theta,
    se,
    seIQ,
    indexScores,
    classification,
    percentile,
    correct,
    total,
    elapsed,
    bankSize,
    strengths,
    weaknesses,
    speedLevel,
    recommendations: recs[performanceTier],
    summary: `<strong>${exam}</strong> IRT·CAT 적응형 검사 결과, ` +
      `<strong>종합 IQ ${compositeIQ}</strong>점(θ=${theta.toFixed(2)}, SE≈${seIQ} IQ)으로 「${classification.label}」에 해당합니다(백분위 ${percentile}%). ` +
      `핵심 능력 지수(언어·시공간·유동) <strong>${coreIndex}</strong>점. ` +
      `총 ${total}문항(은행 ${bankSize}문항 중 적응 출제). ` +
      `※ 공인 임상 지능검사가 아니며 참고용.`,
    detailAnalysis: buildDetailAnalysis(detailStats),
    strengthText: strengths.length
      ? strengths.map(s => `${s.name} (${s.score}점)`).join(', ') + '에서 강점.'
      : '5개 영역이 고르게 나타났습니다.',
    weaknessText: weaknesses.length
      ? weaknesses.map(s => `${s.name} (${s.score}점)`).join(', ') + ' 보완 권장.'
      : '특별히 취약한 영역이 관찰되지 않았습니다.',
    comparisonText: buildInsightIQCATComparison(config, compositeIQ, coreIndex, percentile, seIQ),
    cognitiveProfile: buildInsightIQCATProfile(indexScores, speedLevel, se)
  };
}

function buildInsightIQCATComparison(config, compositeIQ, coreIndex, percentile, seIQ) {
  const range = `추정 범위 약 ${compositeIQ - seIQ}~${compositeIQ + seIQ}점`;
  let base = `IRT 적응형 추정 ${range}(95% 신뢰에 가까운 SE). `;
  if (compositeIQ >= 120) base += '성인 규준 상위권 수준입니다.';
  else if (compositeIQ >= 90) base += '성인 규준 평균 범위입니다.';
  else base += '일부 영역 보완이 도움이 될 수 있습니다.';
  if (coreIndex > compositeIQ + 5) base += ' 핵심 능력 지수가 종합 IQ보다 높아 작업기억·처리속도가 상대적으로 낮을 수 있습니다.';
  return base;
}

function buildInsightIQCATProfile(indexScores, speedLevel, se) {
  const parts = Object.entries(indexScores).map(([, s]) =>
    `<strong>${s.info.fullName}</strong> (${s.correct}/${s.total}, 추정 ${s.score}점): ${s.info.desc}`
  );
  parts.push(`<strong>IRT 측정정밀도</strong>: SE(θ)=${se.toFixed(2)} — 문항 수가 늘수록 정밀해집니다.`);
  parts.push(`<strong>처리속도 수행</strong>: ${DOMAIN_DESCRIPTIONS.speed[speedLevel]}`);
  return parts;
}
