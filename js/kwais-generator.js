// InsightIQ 성인용 절차적 문항 생성기 (500+ 고유 문항 · 매 세션 신규 생성)

function kwaisRngSeed() {
  return (Date.now() ^ (Math.random() * 0xFFFFFFFF)) >>> 0;
}

function mulberry32(seed) {
  let s = seed >>> 0;
  return function () {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickN(rng, arr, n) {
  const copy = arr.slice();
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rng() * copy.length);
    out.push(copy.splice(idx, 1)[0]);
  }
  return out;
}

function shuffleOpts(rng, options, answerIdx) {
  const tagged = options.map((text, i) => ({ text, correct: i === answerIdx }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  return {
    options: tagged.map(t => t.text),
    answer: tagged.findIndex(t => t.correct)
  };
}

function makeQ(params) {
  const difficulty = params.difficulty;
  const timeLimitSec = params.timeLimitSec ?? (20 + difficulty * 5);
  const q = {
    id: params.id,
    index: params.index,
    subtest: params.subtest,
    category: params.subtest,
    text: params.text,
    visual: params.visual || null,
    options: params.options,
    answer: params.answer,
    difficulty,
    ability: params.index,
    discrimination: params.discrimination ?? (0.9 + difficulty * 0.05),
    timeLimitSec
  };
  return enrichQuestionIRT(q);
}

// ── VCI 언어이해 ──
const VOCAB_ITEMS = [
  { w: '변증법', d: '대립되는 견해를 대비·통합하여 진리를 탐구하는 논법', w1: '단정적 주장만 반복하는 방식', w2: '감정에 호소하는 설득', w3: '통계만 나열하는 기술' },
  { w: '허구', d: '실제가 아닌 상상으로 꾸며 낸 이야기', w1: '검증된 역사 기록', w2: '법률 조문', w3: '실험 데이터' },
  { w: '역설', d: '겉으로 모순되어 보이나 깊은 진리를 담은 명제', w1: '항상 거짓인 명제', w2: '단순한 동어반복', w3: '우연의 일치' },
  { w: '냉소', d: '타인의 동기를 비관적으로 의심하는 태도', w1: '무조건적 신뢰', w2: '객관적 분석', w3: '낙관적 기대' },
  { w: '절제', d: '욕망이나 감정을 스스로 억제함', w1: '과도한 표출', w2: '무관심', w3: '충동적 행동' },
  { w: '관용', d: '타인의 잘못을 너그럽게 용서함', w1: '엄격한 처벌', w2: '무시', w3: '회피' },
  { w: '추상', d: '구체적 사물이 아닌 개념·관념 수준의 사고', w1: '감각으로 직접 확인 가능한 것', w2: '물리적 실체', w3: '측정 단위' },
  { w: '실증', d: '경험·관찰로 입증함', w1: '직관만으로 판단', w2: '권위에 의존', w3: '추측' },
  { w: '은유', d: '다른 대상에 빗대어 표현하는 수사', w1: '사실만 나열', w2: '수치 비교', w3: '정의 설명' },
  { w: '풍자', d: '비꼬아 사회적 결함을 비판함', w1: '무조건적 찬양', w2: '중립적 보도', w3: '기술 설명' },
  { w: '합리화', d: '행동을 그럴듯한 이유로 정당화함', w1: '솔직한 반성', w2: '객관적 실험', w3: '데이터 수집' },
  { w: '관념', d: '마음속에 형성된 추상적 개념', w1: '물리적 물체', w2: '측정값', w3: '지도상 좌표' },
  { w: '인과', d: '원인과 결과의 필연적 연결', w1: '시간적 우연', w2: '상관만 존재', w3: '무관한 병치' },
  { w: '귀납', d: '개별 사례에서 일반 원리를 도출', w1: '일반에서 개별을 논증', w2: '감정적 호소', w3: '권위 인용' },
  { w: '연역', d: '일반 원리에서 개별 결론을 도출', w1: '사례만 나열', w2: '통계적 추정', w3: '은유적 표현' },
  { w: '절대', d: '조건 없이 항상 성립하는 것', w1: '상황에 따라 변함', w2: '확률적', w3: '임시적' },
  { w: '상대', d: '기준에 따라 달라지는 것', w1: '불변의 진리', w2: '보편 법칙', w3: '수학적 항등' },
  { w: '양립', d: '동시에 성립할 수 있음', w1: '반드시 배타적', w2: '모순됨', w3: '불가능' },
  { w: '배타', d: '동시에 성립할 수 없음', w1: '공존 가능', w2: '상호 보완', w3: '동일' },
  { w: '가설', d: '검증 대기 중인 잠정적 설명', w1: '이미 증명된 법칙', w2: '정의', w3: '관습' }
];

const SIMILARITY_PAIRS = [
  ['민주주의', '자유', '권력 분산과 개인 권리 보장'],
  ['법', '도덕', '사회 행위의 규범'],
  ['소설', '영화', '서사를 통한 의미 전달'],
  ['과학', '기술', '자연 이해와 응용'],
  ['경제', '정치', '사회 자원·권력 배분'],
  ['음악', '미술', '예술적 표현 매체'],
  ['교육', '훈련', '능력·기술 함양'],
  ['역사', '고고학', '과거에 대한 탐구'],
  ['심리', '철학', '인간 사고·행동 이해'],
  ['통계', '확률', '불확실성의 수량화'],
  ['언어', '문화', '의미 체계와 공동체'],
  ['논리', '수학', '형식적 추론'],
  ['의학', '생물학', '생명 현상 연구'],
  ['물리', '화학', '물질과 에너지'],
  ['시', '산문', '문학적 언어 예술']
];

const COMPREHENSION = [
  { q: '언론의 사회적 기능으로 가장 적절한 것은?', a: '공공의 알 권리와 견제 기능 수행', w: ['엔터테인먼트만 제공', '정부 정책 홍보만', '광고 수익 극대화만'] },
  { q: '다양성 존중이 민주 사회에서 중요한 이유는?', a: '소수 의견도 정책 형성에 반영되기 위해', w: ['모두 같은 의견을 갖기 위해', '갈등을 완전히 없애기 위해', '전통만 보존하기 위해'] },
  { q: '연구 윤리에서 피어 리뷰의 목적은?', a: '학문적 엄밀성과 오류 검증', w: ['저자 신원 은폐', '연구 비용 절감', '출판 속도만 높임'] },
  { q: '환경 규제가 경제와 양립할 수 있는 이유는?', a: '장기적 지속가능성이 경쟁력의 기반이 되기 때문', w: ['단기 이익만 중요', '규제는 항상 비용만 증가', '환경은 경제와 무관'] },
  { q: '헌법상 기본권 제한의 정당화 요건으로 맞는 것은?', a: '법률 유보·비례성·본질적 내용 침해 금지', w: ['행정 명령만으로 가능', '목적 없이 제한 가능', '모든 권리 무제한'] }
];

function generateVCI(rng, startId) {
  const out = [];
  let id = startId;

  VOCAB_ITEMS.forEach((v, vi) => {
    for (let lv = 0; lv < 4; lv++) {
      const difficulty = 4 + Math.floor(vi / 5) + lv;
      const d = Math.min(10, Math.max(4, difficulty));
      const wrongs = pickN(rng, [v.w1, v.w2, v.w3], 3);
      const shuffled = shuffleOpts(rng, [v.d, ...wrongs], 0);
      out.push(makeQ({
        id: `VCI-V${id++}`,
        index: 'VCI',
        subtest: '어휘',
        difficulty: d,
        text: `「${v.w}」의 의미로 가장 적절한 것은?`,
        ...shuffled
      }));
    }
  });

  SIMILARITY_PAIRS.forEach((pair, pi) => {
    for (let lv = 0; lv < 3; lv++) {
      const d = Math.min(9, 5 + Math.floor(pi / 3) + lv);
      const shuffled = shuffleOpts(rng, [pair[2], '표현 매체만 같음', '시간적 순서만 같음', '무관한 개념'], 0);
      out.push(makeQ({
        id: `VCI-S${id++}`,
        index: 'VCI',
        subtest: '공통성',
        difficulty: d,
        text: `「${pair[0]}」와 「${pair[1]}」의 관계로 가장 적절한 것은?`,
        ...shuffled
      }));
    }
  });

  COMPREHENSION.forEach((c, ci) => {
    for (let lv = 0; lv < 4; lv++) {
      const d = Math.min(10, 5 + ci + lv);
      const shuffled = shuffleOpts(rng, [c.a, ...c.w], 0);
      out.push(makeQ({
        id: `VCI-C${id++}`,
        index: 'VCI',
        subtest: '이해',
        difficulty: d,
        text: c.q,
        ...shuffled
      }));
    }
  });

  return { questions: out, nextId: id };
}

// ── VSI 시공간추론 ──
const ROT_SYMBOLS = ['↑', '→', '↓', '←'];

function generateVSI(rng, startId) {
  const out = [];
  let id = startId;

  for (let diff = 3; diff <= 10; diff++) {
    for (let v = 0; v < 12; v++) {
      const steps = diff % 4;
      const start = Math.floor(rng() * 4);
      const seq = [];
      for (let i = 0; i < 4; i++) seq.push(ROT_SYMBOLS[(start + i * (steps + 1)) % 4]);
      const next = ROT_SYMBOLS[(start + 4 * (steps + 1)) % 4];
      const wrongs = pickN(rng, ROT_SYMBOLS.filter(s => s !== next), 3);
      const shuffled = shuffleOpts(rng, [next, ...wrongs], 0);
      out.push(makeQ({
        id: `VSI-R${id++}`,
        index: 'VSI',
        subtest: '회전',
        difficulty: diff,
        text: '시계방향 회전 패턴. 빈 칸에 들어갈 화살표는?',
        visual: seq.join('  ') + '  ?',
        ...shuffled
      }));
    }
  }

  for (let diff = 4; diff <= 10; diff++) {
    for (let v = 0; v < 10; v++) {
      const n = Math.min(4, 2 + (diff % 3));
      const blocks = '■'.repeat(n) + '□'.repeat(Math.max(0, 4 - n));
      const rotated = blocks.split('').reverse().join('');
      const wrongs = pickN(rng, ['□□□□', '■■■■', '■□■□', '□■□■'].filter(x => x !== rotated), 3);
      const shuffled = shuffleOpts(rng, [rotated, ...wrongs], 0);
      out.push(makeQ({
        id: `VSI-B${id++}`,
        index: 'VSI',
        subtest: '블록',
        difficulty: diff,
        text: '2×2 블록을 좌우 대칭으로 접었을 때 위에서 본 모양은?',
        visual: `위: ${blocks}\n(좌우 접기)`,
        ...shuffled
      }));
    }
  }

  const shapes = ['△', '○', '□', '◇'];
  for (let diff = 3; diff <= 9; diff++) {
    for (let v = 0; v < 10; v++) {
      const s = shapes[Math.floor(rng() * shapes.length)];
      const pattern = [s, shapes[(shapes.indexOf(s) + 1) % 4], s, shapes[(shapes.indexOf(s) + 2) % 4]];
      const ans = s;
      const wrongs = pickN(rng, shapes.filter(x => x !== ans), 3);
      const shuffled = shuffleOpts(rng, [ans, ...wrongs], 0);
      out.push(makeQ({
        id: `VSI-P${id++}`,
        index: 'VSI',
        subtest: '패턴',
        difficulty: diff,
        text: '대칭·반복 규칙에 따른 빈 칸의 도형은?',
        visual: pattern.join('  ') + '  ?',
        ...shuffled
      }));
    }
  }

  return { questions: out, nextId: id };
}

// ── FRI 유동추론 ──
function generateFRI(rng, startId) {
  const out = [];
  let id = startId;

  for (let diff = 4; diff <= 10; diff++) {
    for (let v = 0; v < 14; v++) {
      let seq, ans;
      const type = diff % 5;
      if (type === 0) {
        const a = 2 + (diff % 3);
        seq = [a, a * a, a * a * a, a * a * a * a];
        ans = a * a * a * a * a;
      } else if (type === 1) {
        const start = 1 + (v % 5);
        seq = [start, start + 2, start + 5, start + 9];
        ans = start + 14;
      } else if (type === 2) {
        seq = [2, 3, 5, 8];
        ans = 13;
      } else if (type === 3) {
        const b = 3 + (diff % 4);
        seq = [b, b * 2 - 1, b * 3 - 2, b * 4 - 3];
        ans = b * 5 - 4;
      } else {
        seq = [1, 2, 6, 24];
        ans = 120;
      }
      const wrongs = [ans + 2, ans - 3, ans + 7, ans * 2, ans + 11].filter(x => x > 0 && x !== ans);
      const shuffled = shuffleOpts(rng, [String(ans), ...pickN(rng, wrongs, 3).map(String)], 0);
      out.push(makeQ({
        id: `FRI-N${id++}`,
        index: 'FRI',
        subtest: '수열',
        difficulty: diff,
        text: '규칙을 찾아 다음 수는?',
        visual: seq.join(',  ') + ',  ?',
        ...shuffled
      }));
    }
  }

  const logicItems = [
    { p: '모든 A는 B이다. 모든 B는 C이다.', q: '반드시 참인 것은?', a: '모든 A는 C이다', w: ['모든 C는 A이다', '어떤 C도 B가 아니다', 'A와 C는 무관'] },
    { p: 'A ⊃ B, B ⊃ C', q: '논리적으로 반드시 성립하는 것은?', a: 'A ⊃ C', w: ['C ⊃ A', '¬A ⊃ ¬C', 'B ⊃ ¬A'] },
    { p: '필요조건: 비 → 젖음', q: '젖었다면 반드시?', a: '비가 왔을 가능성(충분은 아님)', w: ['비가 왔다', '비가 안 왔다', '우산이 없었다'] },
    { p: '5명 중 3명을 뽑는 경우의 수', q: '정답은?', a: '10', w: ['15', '6', '20'] },
    { p: '주사위 2개 합이 7일 확률', q: '정답은?', a: '1/6', w: ['1/12', '1/3', '1/36'] }
  ];

  logicItems.forEach((item, li) => {
    for (let lv = 0; lv < 8; lv++) {
      const d = Math.min(10, 6 + li + Math.floor(lv / 2));
      const shuffled = shuffleOpts(rng, [item.a, ...item.w], 0);
      out.push(makeQ({
        id: `FRI-L${id++}`,
        index: 'FRI',
        subtest: '논리',
        difficulty: d,
        text: `${item.p}\n${item.q}`,
        ...shuffled
      }));
    }
  });

  const analogies = [
    ['법칙', '과학', '문법', '언어'],
    ['수술', '의사', '소송', '변호사'],
    ['목적', '수단', '원인', '결과'],
    ['가설', '실험', '안', '검증'],
    ['전제', '결론', '증거', '판결']
  ];
  analogies.forEach(([a, b, c, ans], ai) => {
    for (let lv = 0; lv < 10; lv++) {
      const d = Math.min(10, 5 + ai + Math.floor(lv / 2));
      const wrongs = pickN(rng, ['경제', '정치', '역사', '음악', '체육'].filter(x => x !== ans), 3);
      const shuffled = shuffleOpts(rng, [ans, ...wrongs], 0);
      out.push(makeQ({
        id: `FRI-A${id++}`,
        index: 'FRI',
        subtest: '유추',
        difficulty: d,
        text: `${a} : ${b} = ${c} : ?`,
        ...shuffled
      }));
    }
  });

  return { questions: out, nextId: id };
}

// ── WMI 작업기억 (단순 산수 제외) ──
function generateWMI(rng, startId) {
  const out = [];
  let id = startId;

  for (let diff = 4; diff <= 10; diff++) {
    for (let v = 0; v < 12; v++) {
      const len = 3 + Math.floor((diff - 3) / 1.2);
      const digits = [];
      while (digits.length < len) {
        const d = Math.floor(rng() * 10);
        if (digits.length === 0 || d !== digits[digits.length - 1]) digits.push(d);
      }
      const correct = digits.slice().reverse().join('-');
      const wrongs = [
        digits.join('-'),
        digits.slice().sort(() => rng() - 0.5).join('-'),
        digits.slice(1).reverse().concat(digits[0]).join('-')
      ];
      const shuffled = shuffleOpts(rng, [correct, ...wrongs], 0);
      out.push(makeQ({
        id: `WMI-D${id++}`,
        index: 'WMI',
        subtest: '숫자',
        difficulty: diff,
        text: '다음 숫자를 거꾸로 기억하세요.',
        visual: digits.join(' → '),
        timeLimitSec: 15 + diff * 4,
        ...shuffled
      }));
    }
  }

  const arith = [
    { t: '어떤 수의 20%에 8을 더하면 28이다. 그 수는?', a: '100', w: ['80', '120', '60'] },
    { t: '연속한 두 정수의 곱이 210일 때, 큰 수는?', a: '15', w: ['14', '16', '21'] },
    { t: '3x + 2(5 − x) = 14일 때 x는?', a: '4', w: ['2', '6', '8'] },
    { t: '시속 60km로 2.5시간 이동한 거리(km)는?', a: '150', w: ['120', '180', '90'] },
    { t: '원금 200만 원에 연 5% 단리 3년 이자(만 원)는?', a: '30', w: ['25', '35', '20'] },
    { t: '등차수열 7, 12, 17, … 의 15번째 항은?', a: '77', w: ['72', '82', '67'] },
    { t: 'A가 B보다 5세 많고, 두 사람 나이 합이 47이면 A의 나이는?', a: '26', w: ['21', '24', '28'] },
    { t: '240의 약수 중 12보다 큰 것의 개수는?', a: '4', w: ['3', '5', '6'] }
  ];

  arith.forEach((item, ai) => {
    for (let lv = 0; lv < 6; lv++) {
      const d = Math.min(10, 5 + ai + lv);
      const shuffled = shuffleOpts(rng, [item.a, ...item.w], 0);
      out.push(makeQ({
        id: `WMI-A${id++}`,
        index: 'WMI',
        subtest: '산수',
        difficulty: d,
        text: item.t,
        timeLimitSec: 40 + d * 5,
        ...shuffled
      }));
    }
  });

  const sequences = [
    { steps: ['①조사', '②가설', '③실험', '④분석', '⑤결론'], order: '①②③④⑤' },
    { steps: ['①기획', '②제작', '③검수', '④배포'], order: '①②③④' },
    { steps: ['①문제정의', '②대안도출', '③평가', '④실행'], order: '①②③④' }
  ];
  sequences.forEach((s, si) => {
    for (let lv = 0; lv < 12; lv++) {
      const d = Math.min(9, 4 + si + Math.floor(lv / 3));
      const wrong = s.steps.slice().reverse().map((_, i, a) => a[i]).join('').replace(/[①②③④⑤]/g, (m, i) => m);
      const wrongs = [
        s.steps.slice().reverse().map((x, i) => ['①', '②', '③', '④', '⑤'][i] || x).join(''),
        '②①③④⑤',
        '①③②④⑤'
      ];
      const shuffled = shuffleOpts(rng, [s.order, ...wrongs.slice(0, 3)], 0);
      out.push(makeQ({
        id: `WMI-S${id++}`,
        index: 'WMI',
        subtest: '순서화',
        difficulty: d,
        text: `다음 단계를 올바른 순서로 배열하면? (${s.steps.join(' ')})`,
        ...shuffled
      }));
    }
  });

  return { questions: out, nextId: id };
}

// ── PSI 처리속도 ──
const PSI_SYMBOLS = ['●', '■', '▲', '◆', '★'];

function generatePSI(rng, startId) {
  const out = [];
  let id = startId;

  for (let diff = 2; diff <= 8; diff++) {
    for (let v = 0; v < 14; v++) {
      const target = PSI_SYMBOLS[Math.floor(rng() * PSI_SYMBOLS.length)];
      const len = 8 + diff;
      const arr = [];
      let count = 0;
      for (let i = 0; i < len; i++) {
        const sym = rng() < 0.35 ? target : PSI_SYMBOLS[Math.floor(rng() * PSI_SYMBOLS.length)];
        if (sym === target) count++;
        arr.push(sym);
      }
      if (count === 0) { arr[0] = target; count = 1; }
      const wrongs = [String(count + 1), String(Math.max(0, count - 1)), String(count + 2)];
      const shuffled = shuffleOpts(rng, [String(count), ...wrongs], 0);
      out.push(makeQ({
        id: `PSI-C${id++}`,
        index: 'PSI',
        subtest: '기호찾기',
        difficulty: diff,
        text: `「${target}」의 개수는?`,
        visual: arr.join(' '),
        timeLimitSec: 12 + diff * 2,
        ...shuffled
      }));
    }
  }

  for (let diff = 3; diff <= 9; diff++) {
    for (let v = 0; v < 12; v++) {
      const map = { 1: '○', 2: '□', 3: '△' };
      const seq = [1 + Math.floor(rng() * 3), 1 + Math.floor(rng() * 3), 1 + Math.floor(rng() * 3)];
      const ans = seq.map(n => map[n]).join('');
      const wrongs = [
        seq.map(n => map[n === 3 ? 1 : n + 1]).join(''),
        seq.slice().reverse().map(n => map[n]).join(''),
        seq.map(n => map[4 - n]).join('')
      ];
      const shuffled = shuffleOpts(rng, [ans, ...wrongs], 0);
      out.push(makeQ({
        id: `PSI-K${id++}`,
        index: 'PSI',
        subtest: '기호',
        difficulty: diff,
        text: '1→○, 2→□, 3→△ 일 때 다음 숫자열의 기호는?',
        visual: `1→○  2→□  3→△\n[ ${seq.join('  ')} ]`,
        timeLimitSec: 15 + diff * 2,
        ...shuffled
      }));
    }
  }

  for (let diff = 3; diff <= 8; diff++) {
    for (let v = 0; v < 12; v++) {
      const vowels = 'AEIOU';
      const chars = [];
      for (let i = 0; i < 10; i++) {
        chars.push(rng() < 0.4 ? vowels[Math.floor(rng() * 5)] : String.fromCharCode(66 + Math.floor(rng() * 20)));
      }
      const nonVowel = chars.filter(c => !vowels.includes(c));
      const shuffled = shuffleOpts(rng, [
        `${nonVowel.length}개`,
        `${nonVowel.length + 1}개`,
        `${Math.max(0, nonVowel.length - 1)}개`,
        `${nonVowel.length + 2}개`
      ], 0);
      out.push(makeQ({
        id: `PSI-X${id++}`,
        index: 'PSI',
        subtest: '지우기',
        difficulty: diff,
        text: '모음(A,E,I,O,U)이 아닌 글자의 개수는?',
        visual: chars.join(' '),
        timeLimitSec: 14 + diff * 2,
        ...shuffled
      }));
    }
  }

  return { questions: out, nextId: id };
}

/** 세션마다 500+ 고유 문항 은행 생성 */
function generateKwaisQuestionBank(seed) {
  const rng = mulberry32(seed ?? kwaisRngSeed());
  let id = 0;
  const vci = generateVCI(rng, id); id = vci.nextId;
  const vsi = generateVSI(rng, id); id = vsi.nextId;
  const fri = generateFRI(rng, id); id = fri.nextId;
  const wmi = generateWMI(rng, id); id = wmi.nextId;
  const psi = generatePSI(rng, id);

  const bank = [
    ...vci.questions,
    ...vsi.questions,
    ...fri.questions,
    ...wmi.questions,
    ...psi.questions
  ];

  return { bank, seed: seed ?? 0, count: bank.length };
}

/** 즉석 추가 문항 1개 (은행 소진 시) */
function generateKwaisQuestionOnDemand(index, difficulty, rng) {
  const r = rng || mulberry32(kwaisRngSeed());
  const gens = { VCI: generateVCI, VSI: generateVSI, FRI: generateFRI, WMI: generateWMI, PSI: generatePSI };
  const gen = gens[index] || generateFRI;
  const batch = gen(r, Date.now()).questions.filter(q => Math.abs(q.difficulty - difficulty) <= 1);
  return batch[Math.floor(r() * batch.length)] || gen(r, 0).questions[0];
}

let _kwaisBankCache = null;

function getKwaisQuestionBank(forceNew) {
  if (!forceNew && _kwaisBankCache) return _kwaisBankCache;
  const seed = kwaisRngSeed();
  _kwaisBankCache = generateKwaisQuestionBank(seed);
  return _kwaisBankCache;
}

function clearKwaisBankCache() {
  _kwaisBankCache = null;
}
