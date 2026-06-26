function ratioToIndexScore(ratio, config) {
  const mean = config?.normMean ?? 0.62;
  const sd = config?.normSd ?? 0.17;
  const z = (ratio - mean) / sd;
  return Math.max(55, Math.min(145, Math.round(100 + 15 * z)));
}

function getWechslerClassification(score) {
  return WECHSLER_CLASSIFICATIONS.find(c => score >= c.min) ||
    WECHSLER_CLASSIFICATIONS[WECHSLER_CLASSIFICATIONS.length - 1];
}

function getIndexStats(questions, answers) {
  const stats = {};
  Object.keys(WECHSLER_INDICES).forEach(k => {
    stats[k] = { correct: 0, total: 0, subtests: {} };
  });

  questions.forEach((q, i) => {
    const idx = q.index;
    if (!stats[idx]) return;
    stats[idx].total++;
    if (answers[i] === q.answer) stats[idx].correct++;

    if (!stats[idx].subtests[q.subtest]) {
      stats[idx].subtests[q.subtest] = { correct: 0, total: 0 };
    }
    stats[idx].subtests[q.subtest].total++;
    if (answers[i] === q.answer) stats[idx].subtests[q.subtest].correct++;
  });

  return stats;
}

function buildWechslerReport(questions, answers, elapsed, config) {
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
      subtests: s.subtests,
      info: WECHSLER_INDICES[key]
    };
  });

  const fsiq = Math.round(
    (indexScores.VCI.score + indexScores.PRI.score + indexScores.WMI.score + indexScores.PSI.score) / 4
  );
  const gai = Math.round((indexScores.VCI.score + indexScores.PRI.score) / 2);
  const classification = getWechslerClassification(fsiq);
  const percentile = Math.round(normCdf((fsiq - 100) / 15) * 100);

  const subtestStats = getSubtestStats(questions, answers);
  const { strengths, weaknesses } = getWechslerStrengthsWeaknesses(indexScores);
  const speedLevel = getSpeedScore(elapsed, config.timeLimit, correct, total);
  const recKey = config.recKey || 'adult';
  const performanceTier = fsiq >= 115 ? 'high' : fsiq >= 90 ? 'mid' : 'low';
  const recs = AGE_RECOMMENDATIONS[recKey] || AGE_RECOMMENDATIONS.adult;

  return {
    isWechsler: true,
    fsiq,
    gai,
    iq: fsiq,
    indexScores,
    classification,
    percentile,
    correct,
    total,
    elapsed,
    subtestStats,
    strengths,
    weaknesses,
    speedLevel,
    recommendations: recs[performanceTier],
    summary: buildWechslerSummary(config, fsiq, gai, classification, correct, total, percentile),
    indexAnalysis: buildIndexAnalysis(indexScores),
    subtestAnalysis: buildSubtestAnalysis(subtestStats),
    strengthText: buildWechslerStrengthText(strengths),
    weaknessText: buildWechslerWeaknessText(weaknesses),
    comparisonText: buildWechslerComparison(config, fsiq, gai, percentile),
    cognitiveProfile: buildWechslerProfile(indexScores, speedLevel)
  };
}

// 하위 호환
function buildKwaisReport(questions, answers, elapsed, config) {
  return buildWechslerReport(questions, answers, elapsed, config);
}

function getSubtestStats(questions, answers) {
  const stats = {};
  questions.forEach((q, i) => {
    const key = q.subtest;
    if (!stats[key]) stats[key] = { correct: 0, total: 0, index: q.index };
    stats[key].total++;
    if (answers[i] === q.answer) stats[key].correct++;
  });
  return stats;
}

function getWechslerStrengthsWeaknesses(indexScores) {
  const entries = Object.entries(indexScores).map(([key, s]) => ({
    key, score: s.score, name: s.info.name
  }));
  entries.sort((a, b) => b.score - a.score);
  return {
    strengths: entries.filter(e => e.score >= 110).slice(0, 2),
    weaknesses: entries.filter(e => e.score < 90).slice(-2).reverse()
  };
}

function buildWechslerSummary(config, fsiq, gai, cls, correct, total, percentile) {
  const exam = config.examName;
  const sub = config.subLabel ? ` (${config.subLabel} · ${config.ageRange})` : ` (${config.ageRange})`;
  return `<strong>${exam}</strong>${sub} 검사 결과, ` +
    `<strong>종합 IQ ${fsiq}</strong>점으로 「${cls.label}」에 해당합니다(백분위 ${percentile}%). ` +
    `핵심 능력 지수(언어·지각)는 <strong>${gai}</strong>점입니다. ` +
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

function buildSubtestAnalysis(subtestStats) {
  return Object.entries(subtestStats)
    .map(([name, s]) => ({
      name,
      label: WECHSLER_SUBTEST_LABELS[name] || name,
      index: s.index,
      correct: s.correct,
      total: s.total,
      pct: Math.round((s.correct / s.total) * 100)
    }))
    .sort((a, b) => b.pct - a.pct);
}

function buildWechslerStrengthText(strengths) {
  if (!strengths.length) return '4개 지표가 고르게 나타났습니다.';
  return strengths.map(s => `${s.name} 지표 (${s.score}점)`).join(', ') + '에서 강점이 보입니다.';
}

function buildWechslerWeaknessText(weaknesses) {
  if (!weaknesses.length) return '특별히 취약한 지표가 관찰되지 않았습니다.';
  return weaknesses.map(s => `${s.name} 지표 (${s.score}점)`).join(', ') + ' 영역 보완을 권장합니다.';
}

function buildWechslerComparison(config, fsiq, gai, percentile) {
  const exam = config.examName;
  const age = config.ageRange;
  const gaiDiff = gai - fsiq;
  let gaiNote = '';
  if (gaiDiff >= 5) gaiNote = ' 핵심 능력 지수가 종합 IQ보다 높아, 작업기억·처리속도 영향이 상대적으로 낮을 수 있습니다.';
  else if (gaiDiff <= -5) gaiNote = ' 종합 IQ가 핵심 능력 지수보다 높아, 작업기억·처리속도에서 추가 점수를 얻었을 수 있습니다.';

  if (fsiq >= 120) return `${exam} 연령 규준(${age}) 기준 상위권입니다.${gaiNote}`;
  if (fsiq >= 90) return `${exam} 연령 규준(${age}) 기준 평균 범위에 해당합니다.${gaiNote}`;
  return `${exam} 연령 규준(${age}) 기준 보완이 필요한 영역이 있을 수 있습니다. 전문가 실시를 권장합니다.${gaiNote}`;
}

function buildWechslerProfile(indexScores, speedLevel) {
  const parts = Object.entries(indexScores).map(([, s]) =>
    `<strong>${s.info.fullName}</strong> (${s.correct}/${s.total}, 지표 ${s.score}점): ${s.info.desc}`
  );
  parts.push(`<strong>처리속도 수행</strong>: ${DOMAIN_DESCRIPTIONS.speed[speedLevel]}`);
  return parts;
}

function getKwaisClassification(score) { return getWechslerClassification(score); }

/** IRT·CAT 기반 InsightIQ 성인 리포트 */
function buildKwaisCATReport(catResults, elapsed, config) {
  const { theta, se, fsiq, gai, domainScores, responses, administered, bankSize } = catResults;
  const correct = responses.filter(r => r.correct).length;
  const total = responses.length;
  const classification = getWechslerClassification(fsiq);
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

  const subtestStats = {};
  administered.forEach((q, i) => {
    const key = q.subtest;
    if (!subtestStats[key]) subtestStats[key] = { correct: 0, total: 0, index: q.index };
    subtestStats[key].total++;
    if (responses[i]?.correct) subtestStats[key].correct++;
  });

  const recKey = config.recKey || 'adult';
  const performanceTier = fsiq >= 115 ? 'high' : fsiq >= 90 ? 'mid' : 'low';
  const recs = AGE_RECOMMENDATIONS[recKey] || AGE_RECOMMENDATIONS.adult;
  const speedLevel = getSpeedScore(elapsed, config.timeLimit, correct, total);

  const seIQ = Math.round(se * 15);
  const exam = config.examName;

  return {
    isWechsler: true,
    isCAT: true,
    fsiq,
    gai,
    iq: fsiq,
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
      `<strong>종합 IQ ${fsiq}</strong>점(θ=${theta.toFixed(2)}, SE≈${seIQ} IQ)으로 「${classification.label}」에 해당합니다(백분위 ${percentile}%). ` +
      `핵심 능력 지수(언어·시공간·유동) <strong>${gai}</strong>점. ` +
      `총 ${total}문항(은행 ${bankSize}문항 중 적응 출제). ` +
      `※ 공인 임상 지능검사가 아니며 참고용.`,
    subtestAnalysis: buildSubtestAnalysis(subtestStats),
    strengthText: strengths.length
      ? strengths.map(s => `${s.name} (${s.score}점)`).join(', ') + '에서 강점.'
      : '5개 영역이 고르게 나타났습니다.',
    weaknessText: weaknesses.length
      ? weaknesses.map(s => `${s.name} (${s.score}점)`).join(', ') + ' 보완 권장.'
      : '특별히 취약한 영역이 관찰되지 않았습니다.',
    comparisonText: buildKwaisCATComparison(config, fsiq, gai, percentile, seIQ),
    cognitiveProfile: buildKwaisCATProfile(indexScores, speedLevel, se)
  };
}

function buildKwaisCATComparison(config, fsiq, gai, percentile, seIQ) {
  const range = `추정 범위 약 ${fsiq - seIQ}~${fsiq + seIQ}점`;
  let base = `IRT 적응형 추정 ${range}(95% 신뢰에 가까운 SE). `;
  if (fsiq >= 120) base += '성인 규준 상위권 수준입니다.';
  else if (fsiq >= 90) base += '성인 규준 평균 범위입니다.';
  else base += '일부 영역 보완이 도움이 될 수 있습니다.';
  if (gai > fsiq + 5) base += ' 핵심 능력 지수가 종합 IQ보다 높아 작업기억·처리속도가 상대적으로 낮을 수 있습니다.';
  return base;
}

function buildKwaisCATProfile(indexScores, speedLevel, se) {
  const parts = Object.entries(indexScores).map(([, s]) =>
    `<strong>${s.info.fullName}</strong> (${s.correct}/${s.total}, 추정 ${s.score}점): ${s.info.desc}`
  );
  parts.push(`<strong>IRT 측정정밀도</strong>: SE(θ)=${se.toFixed(2)} — 문항 수가 늘수록 정밀해집니다.`);
  parts.push(`<strong>처리속도 수행</strong>: ${DOMAIN_DESCRIPTIONS.speed[speedLevel]}`);
  return parts;
}

