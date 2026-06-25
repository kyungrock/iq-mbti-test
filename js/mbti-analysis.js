function scorePhase1(answers, questions) {
  const scores = {
    E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
  };
  const counts = { EI: 0, SN: 0, TF: 0, JP: 0 };

  questions.forEach((q, i) => {
    const val = answers[i];
    if (val == null) return;

    counts[q.dim]++;

    if (val === 3) return; // 중립

    const weight = val >= 4 ? (val - 3) : (3 - val);
    const agree = val >= 4;

    if (agree) {
      scores[q.pole] += weight;
    } else {
      const opposite = getOppositePole(q.pole);
      scores[opposite] += weight;
    }
  });

  const dimensions = {};
  const letters = {};

  ['EI', 'SN', 'TF', 'JP'].forEach(dim => {
    const [a, b] = dim.split('');
    const totalA = scores[a];
    const totalB = scores[b];
    const total = totalA + totalB || 1;

    const winner = totalA >= totalB ? a : b;
    letters[dim] = winner;

    const winScore = Math.max(totalA, totalB);
    const clarity = Math.round((winScore / total) * 100);

    dimensions[dim] = {
      winner,
      scores: { [a]: totalA, [b]: totalB },
      clarity,
      label: DIM_INFO[dim].poles[winner]
    };
  });

  const mbtiType = letters.EI + letters.SN + letters.TF + letters.JP;

  const avgClarity = Math.round(
    (dimensions.EI.clarity + dimensions.SN.clarity + dimensions.TF.clarity + dimensions.JP.clarity) / 4
  );

  return { mbtiType, dimensions, letters, avgClarity, scores };
}

function getOppositePole(pole) {
  const map = { E: 'I', I: 'E', S: 'N', N: 'S', T: 'F', F: 'T', J: 'P', P: 'J' };
  return map[pole];
}

function scorePhase2(answers, questions) {
  if (!answers.length) return { matchPercent: 0, avgScore: 0, breakdown: [] };

  let total = 0;
  const breakdown = [];

  questions.forEach((q, i) => {
    const val = answers[i];
    if (val == null) return;
    total += val;
    breakdown.push({ text: q.text, score: val, percent: Math.round((val / 5) * 100) });
  });

  const answered = breakdown.length || 1;
  const avgScore = total / answered;
  const matchPercent = Math.round((avgScore / 5) * 100);

  let fitLevel;
  if (matchPercent >= 85) fitLevel = { label: '매우 높은 일치', desc: '해당 유형의 특성이 본인에게 강하게 나타납니다.' };
  else if (matchPercent >= 70) fitLevel = { label: '높은 일치', desc: '해당 유형의 핵심 특성 대부분이 본인과 잘 맞습니다.' };
  else if (matchPercent >= 55) fitLevel = { label: '보통 일치', desc: '일부 특성은 맞지만, 다른 면도 함께 가지고 있습니다.' };
  else if (matchPercent >= 40) fitLevel = { label: '낮은 일치', desc: '유형의 일부 특성만 해당되며, 경계형일 수 있습니다.' };
  else fitLevel = { label: '매우 낮은 일치', desc: '결과 유형과 실제 자아인식 사이에 차이가 큽니다. 재검사를 권장합니다.' };

  return { matchPercent, avgScore: Math.round(avgScore * 10) / 10, breakdown, fitLevel, answered };
}

function getSecondaryTypes(dimensions) {
  const mainType = ['EI', 'SN', 'TF', 'JP'].map(dim => dimensions[dim].winner).join('');
  const types = new Set();

  ['EI', 'SN', 'TF', 'JP'].forEach((dim, i) => {
    const d = dimensions[dim];
    const [a, b] = dim.split('');
    const diff = Math.abs(d.scores[a] - d.scores[b]);
    if (diff <= 2) {
      const chars = mainType.split('');
      chars[i] = chars[i] === a ? b : a;
      types.add(chars.join(''));
    }
  });

  return [...types].filter(t => t !== mainType).slice(0, 3);
}

function buildMbtiReport(phase1Answers, phase2Answers, mbtiType, phase1Questions) {
  const phase1 = scorePhase1(phase1Answers, phase1Questions);
  const type = mbtiType || phase1.mbtiType;
  const typeInfo = MBTI_TYPES[type];
  const phase2Questions = getPhase2Questions(type);
  const phase2 = scorePhase2(phase2Answers, phase2Questions);
  const secondary = getSecondaryTypes(phase1.dimensions);

  const summary = buildSummary(type, typeInfo, phase1, phase2, phase1Questions.length);
  const dimensionAnalysis = buildDimensionAnalysis(phase1.dimensions);
  const cognitiveStack = getCognitiveStack(type);

  return {
    type,
    typeInfo,
    phase1,
    phase2,
    secondary,
    summary,
    dimensionAnalysis,
    cognitiveStack,
    totalQuestions: phase1Questions.length + phase2Questions.length
  };
}

function buildSummary(type, info, phase1, phase2, phase1Count) {
  return `1차 검사(${phase1Count}문항) 결과 <strong>${type} (${info.name})</strong> 유형이 도출되었습니다. ` +
    `4가지 차원의 평균 명확도는 <strong>${phase1.avgClarity}%</strong>입니다. ` +
    `2차 적합도 검사(${phase2.answered}문항) 결과, 해당 유형과의 일치도는 <strong>${phase2.matchPercent}%</strong>로 ` +
    `「${phase2.fitLevel.label}」 수준입니다.`;
}

function buildDimensionAnalysis(dimensions) {
  return Object.entries(dimensions).map(([dim, d]) => {
    const info = DIM_INFO[dim];
    const [a, b] = dim.split('');
    const total = d.scores[a] + d.scores[b] || 1;
    const pctA = Math.round((d.scores[a] / total) * 100);
    const pctB = 100 - pctA;

    let interpretation;
    if (d.clarity >= 75) interpretation = `${d.label} 성향이 매우 뚜렷합니다.`;
    else if (d.clarity >= 60) interpretation = `${d.label} 성향이 비교적 분명합니다.`;
    else if (d.clarity >= 55) interpretation = `${info.poles[a]}와 ${info.poles[b]} 사이에서 약간의 경향이 보입니다.`;
    else interpretation = `경계형에 가깝습니다. 상황에 따라 양쪽 특성이 나타날 수 있습니다.`;

    return { dim, info, d, pctA, pctB, interpretation };
  });
}

function getCognitiveStack(type) {
  const stacks = {
    INTJ: ['Ni', 'Te', 'Fi', 'Se'], INTP: ['Ti', 'Ne', 'Si', 'Fe'],
    ENTJ: ['Te', 'Ni', 'Se', 'Fi'], ENTP: ['Ne', 'Ti', 'Fe', 'Si'],
    INFJ: ['Ni', 'Fe', 'Ti', 'Se'], INFP: ['Fi', 'Ne', 'Si', 'Te'],
    ENFJ: ['Fe', 'Ni', 'Se', 'Ti'], ENFP: ['Ne', 'Fi', 'Te', 'Si'],
    ISTJ: ['Si', 'Te', 'Fi', 'Ne'], ISFJ: ['Si', 'Fe', 'Ti', 'Ne'],
    ESTJ: ['Te', 'Si', 'Ne', 'Fi'], ESFJ: ['Fe', 'Si', 'Ne', 'Ti'],
    ISTP: ['Ti', 'Se', 'Ni', 'Fe'], ISFP: ['Fi', 'Se', 'Ni', 'Te'],
    ESTP: ['Se', 'Ti', 'Fe', 'Ni'], ESFP: ['Se', 'Fi', 'Te', 'Ni']
  };

  const funcNames = {
    Ni: '내향 직관', Ne: '외향 직관', Si: '내향 감각', Se: '외향 감각',
    Ti: '내향 사고', Te: '외향 사고', Fi: '내향 감정', Fe: '외향 감정'
  };

  const stack = stacks[type] || [];
  const roles = ['주기능 (핵심)', '보조기능', '3차기능', '열등기능 (성장 영역)'];

  return stack.map((fn, i) => ({
    func: fn,
    name: funcNames[fn],
    role: roles[i]
  }));
}

const GROUP_COLORS = {
  '분석가': '#a78bfa',
  '외교관': '#4ade80',
  '관리자': '#6c8cff',
  '탐험가': '#fbbf24'
};
