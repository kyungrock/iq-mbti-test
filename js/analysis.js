const IQ_CLASSIFICATIONS = [
  { min: 145, label: '최우수 (Very Superior)', percentile: '99.9%', desc: '인구 상위 0.1% 수준의 인지 능력' },
  { min: 130, label: '매우 우수 (Superior)', percentile: '상위 2%', desc: '학문·연구 분야에서 두각을 나타낼 잠재력' },
  { min: 120, label: '우수 (High Average+)', percentile: '상위 10%', desc: '복잡한 추론과 문제 해결에서 강점' },
  { min: 110, label: '평균 상 (High Average)', percentile: '상위 25%', desc: '일상·학업에서 안정적인 인지 수행' },
  { min: 90, label: '평균 (Average)', percentile: '중간 50%', desc: '또래 대비 표준적인 인지 발달 수준' },
  { min: 80, label: '평균 하 (Low Average)', percentile: '하위 25%', desc: '기초 학습과 반복 연습으로 향상 여지 큼' },
  { min: 70, label: '경계선 (Borderline)', percentile: '하위 10%', desc: '개별화된 학습 지원이 도움이 될 수 있음' },
  { min: 0, label: '저하 (Below Average)', percentile: '하위 5% 미만', desc: '전문가 상담을 통한 세밀한 평가 권장' }
];

const DOMAIN_DESCRIPTIONS = {
  fluid: {
    name: '유동적 추론 (Gf)',
    desc: '새로운 문제를 분석하고 논리적으로 해결하는 능력',
    high: '추상적 사고와 복합 문제 해결력이 뛰어납니다.',
    mid: '일반적인 논리 문제를 적절히 처리할 수 있습니다.',
    low: '단계별 풀이 연습과 논리 퍼즐로 강화가 필요합니다.'
  },
  crystallized: {
    name: '결정적 지능 (Gc)',
    desc: '언어, 지식, 경험을 활용한 이해·표현 능력',
    high: '어휘력과 개념 이해력이 우수합니다.',
    mid: '기본적인 언어·개념 처리가 가능합니다.',
    low: '독서와 어휘 학습으로 지식 기반을 넓혀 보세요.'
  },
  visual: {
    name: '시공간 처리 (Gv)',
    desc: '패턴, 도형, 공간 관계를 파악하는 능력',
    high: '시각적 패턴 인식과 공간 추론이 뛰어납니다.',
    mid: '기본적인 패턴·도형 문제를 해결할 수 있습니다.',
    low: '블록 쌓기, 퍼즐, 도형 놀이로 훈련해 보세요.'
  },
  memory: {
    name: '작업 기억 (Gwm)',
    desc: '정보를 머릿속에 유지하며 처리하는 능력',
    high: '여러 정보를 동시에 기억·처리하는 데 강합니다.',
    mid: '일상 수준의 기억 처리가 가능합니다.',
    low: '짧은 과제 나누기와 반복 연습이 효과적입니다.'
  },
  speed: {
    name: '처리 속도 (Gs)',
    desc: '인지 과제를 빠르고 정확하게 수행하는 능력',
    high: '시간 압박 하에서도 정확하게 수행합니다.',
    mid: '적정 속도로 과제를 완료합니다.',
    low: '시간 여유를 두고 정확도 위주로 연습하세요.'
  }
};

const AGE_RECOMMENDATIONS = {
  kindergarten: {
    high: ['블록·퍼즐 놀이로 창의력 확장', '그림책 읽기로 어휘·상상력 발달', '자유 놀이를 통한 탐색 학습'],
    mid: ['색깔·모양 분류 놀이', '숫자 세기와 간단한 보드게임', '역할 놀이로 사회성·언어 발달'],
    low: ['짧은 시간 집중 활동 반복', '그림 카드로 개념 익히기', '보호자와 함께하는 학습 놀이']
  },
  elementary: {
    high: ['수학 올림피아드·독서 토론 추천', '코딩·과학 실험 등 탐구 활동', '다양한 분야 독서로 지식 확장'],
    mid: ['교과 기본기 꾸준히 다지기', '논리 퍼즐·체스 등 사고 게임', '일기 쓰기로 언어 표현력 향상'],
    low: ['기초 연산·독해 매일 20분', '학습 내용을 작은 단위로 나누기', '성취 경험을 자주 만들어 주기']
  },
  middle: {
    high: ['심화 수학·과학·논술 도전', '프로젝트 기반 학습 참여', '비판적 사고 토론 활동'],
    mid: ['약점 과목 집중 보완', '개념 지도 위주의 학습', '시간 관리·학습 계획 수립'],
    low: ['기초 개념부터 체계적 복습', '학습 코칭·과외 검토', '강점 영역에서 자신감 회복']
  },
  high: {
    high: ['수능·내신 심화, 자율 학습 설계', '연구·탐구 보고서 작성', '진로 관련 심화 독서'],
    mid: ['약점 영역 집중 보완', '모의고사 기반 시간 관리', '효율적 오답 노트 정리'],
    low: ['기초 개념 완전 정복 우선', '학습 전략 재설계', '진로 상담과 학습 병행']
  },
  adult: {
    high: ['전문 분야 심화·리더십 역할', '복잡한 프로젝트·전략 기획', '지속적 자기 계발·학습'],
    mid: ['업무·생활에서 논리적 의사결정', '새로운 기술·지식 습득', '독서·퍼즐로 인지 유지'],
    low: ['기초 스킬부터 단계적 향상', '온라인 강의·자격증 도전', '규칙적 두뇌 훈련 습관화']
  }
};

function normCdf(x) {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp(-x * x / 2);
  const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
}

function calculateIQ(correct, total, levelConfig) {
  const ratio = correct / total;
  const z = (ratio - levelConfig.normMean) / levelConfig.normSd;
  const iq = Math.round(100 + 15 * z);
  return Math.max(55, Math.min(145, iq));
}

function getIqClassification(iq) {
  return IQ_CLASSIFICATIONS.find(c => iq >= c.min) || IQ_CLASSIFICATIONS[IQ_CLASSIFICATIONS.length - 1];
}

function getDomainStats(questions, answers) {
  const domains = {};

  questions.forEach((q, i) => {
    const domain = q.domain || CATEGORY_TO_DOMAIN[q.category] || 'fluid';
    if (!domains[domain]) domains[domain] = { correct: 0, total: 0 };
    domains[domain].total++;
    if (answers[i] === q.answer) domains[domain].correct++;
  });

  return domains;
}

function getCategoryStats(questions, answers) {
  const stats = {};
  questions.forEach((q, i) => {
    if (!stats[q.category]) stats[q.category] = { correct: 0, total: 0 };
    stats[q.category].total++;
    if (answers[i] === q.answer) stats[q.category].correct++;
  });
  return stats;
}

function getStrengthsWeaknesses(domainStats) {
  const entries = Object.entries(domainStats).map(([key, s]) => ({
    domain: key,
    pct: s.total > 0 ? s.correct / s.total : 0,
    correct: s.correct,
    total: s.total
  }));

  entries.sort((a, b) => b.pct - a.pct);
  const strengths = entries.filter(e => e.pct >= 0.67).slice(0, 2);
  const weaknesses = entries.filter(e => e.pct < 0.5).sort((a, b) => a.pct - b.pct).slice(0, 2);

  return { strengths, weaknesses, all: entries };
}

function getSpeedScore(elapsed, timeLimit, correct, total) {
  const timeRatio = elapsed / (timeLimit * 60);
  const accuracy = correct / total;
  if (timeRatio <= 0.5 && accuracy >= 0.7) return 'high';
  if (timeRatio <= 0.8 || accuracy >= 0.5) return 'mid';
  return 'low';
}

function buildProfessionalReport(levelId, questions, answers, elapsed, levelConfig) {
  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const total = questions.length;
  const iq = calculateIQ(correct, total, levelConfig);
  const classification = getIqClassification(iq);
  const percentile = Math.round(normCdf((iq - 100) / 15) * 100);
  const categoryStats = getCategoryStats(questions, answers);
  const domainStats = getDomainStats(questions, answers);
  const { strengths, weaknesses } = getStrengthsWeaknesses(domainStats);
  const speedLevel = getSpeedScore(elapsed, levelConfig.timeLimit, correct, total);

  const performanceTier = iq >= 115 ? 'high' : iq >= 90 ? 'mid' : 'low';
  const recommendations = AGE_RECOMMENDATIONS[levelId][performanceTier];

  const summary = buildSummary(levelConfig, iq, classification, correct, total, percentile);
  const cognitiveProfile = buildCognitiveNarrative(domainStats, speedLevel);
  const strengthText = buildStrengthText(strengths);
  const weaknessText = buildWeaknessText(weaknesses);
  const comparisonText = buildAgeComparison(levelConfig, iq, percentile);

  return {
    iq,
    classification,
    percentile,
    correct,
    total,
    elapsed,
    categoryStats,
    domainStats,
    speedLevel,
    strengths,
    weaknesses,
    recommendations,
    summary,
    cognitiveProfile,
    strengthText,
    weaknessText,
    comparisonText
  };
}

function buildSummary(level, iq, cls, correct, total, percentile) {
  return `${level.label}(${level.ageRange}) 연령 규준에 따른 추정 IQ는 <strong>${iq}</strong>점으로, ` +
    `「${cls.label}」 범위에 해당합니다(백분위 ${percentile}%). ` +
    `총 ${total}문항 중 ${correct}문항을 정답 처리하였으며, ` +
    `이는 동 연령대 참여자 분포를 기준으로 산출된 참고 지표입니다.`;
}

function buildCognitiveNarrative(domainStats, speedLevel) {
  const parts = [];

  Object.entries(domainStats).forEach(([key, s]) => {
    const pct = Math.round((s.correct / s.total) * 100);
    const tier = pct >= 67 ? 'high' : pct >= 50 ? 'mid' : 'low';
    const info = DOMAIN_DESCRIPTIONS[key];
    if (info) {
      parts.push(`<strong>${info.name}</strong> (${s.correct}/${s.total}, ${pct}%): ${info[tier]}`);
    }
  });

  const speedInfo = DOMAIN_DESCRIPTIONS.speed;
  parts.push(`<strong>${speedInfo.name}</strong>: ${speedInfo[speedLevel]}`);

  return parts;
}

function buildStrengthText(strengths) {
  if (strengths.length === 0) return '특정 영역의 두드러진 강점보다 전반적으로 고르게 나타났습니다.';
  return strengths.map(s => {
    const info = DOMAIN_DESCRIPTIONS[s.domain];
    const pct = Math.round(s.pct * 100);
    return `${info ? info.name : s.domain} (${pct}% 정답) — ${info ? info.high : '우수한 수행'}`;
  }).join(' ');
}

function buildWeaknessText(weaknesses) {
  if (weaknesses.length === 0) return '특별히 취약한 인지 영역이 관찰되지 않았습니다.';
  return weaknesses.map(s => {
    const info = DOMAIN_DESCRIPTIONS[s.domain];
    const pct = Math.round(s.pct * 100);
    return `${info ? info.name : s.domain} (${pct}% 정답) — ${info ? info.low : '보완 학습 권장'}`;
  }).join(' ');
}

function buildAgeComparison(level, iq, percentile) {
  if (iq >= 120) {
    return `${level.label} 연령대에서 상위권에 해당하는 결과입니다. 또래 대비 추론·학습 잠재력이 높게 나타났습니다.`;
  }
  if (iq >= 90) {
    return `${level.label} 연령대의 일반적인 발달 범위에 해당합니다. 꾸준한 학습으로 각 영역을 균형 있게 발전시킬 수 있습니다.`;
  }
  return `${level.label} 연령대 기준으로 기초 영역의 보완이 도움이 될 수 있습니다. 개별 속도에 맞춘 학습이 중요합니다.`;
}
