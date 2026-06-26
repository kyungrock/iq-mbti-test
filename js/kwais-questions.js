// K-WAIS-IV 소검사별 문항 풀 (index: VCI/PRI/WMI/PSI, subtest: 소검사명)

const KWAIS_QUESTION_POOL = [
  // ── VCI 언어이해 ──
  { index: 'VCI', subtest: '공통성', category: '공통성', text: '「바나나」와 「오렌지」의 공통점은?', options: ['과일이다', '노란색이다', '달다', '나무에서 난다'], answer: 0 },
  { index: 'VCI', subtest: '공통성', category: '공통성', text: '「시」와 「소설」의 공통점은?', options: ['종이에 쓴다', '문학이다', '짧다', '읽는다'], answer: 1 },
  { index: 'VCI', subtest: '공통성', category: '공통성', text: '「피아노」와 「기타」의 공통점은?', options: ['악기이다', '현이 있다', '건반이다', '큰 것이다'], answer: 0 },
  { index: 'VCI', subtest: '공통성', category: '공통성', text: '「의사」와 「변호사」의 공통점은?', options: ['전문직이다', '병원에 있다', '법원에 있다', '수술한다'], answer: 0 },

  { index: 'VCI', subtest: '어휘', category: '어휘', text: '「절제」의 뜻으로 가장 알맞은 것은?', options: ['과도하게 행동함', '욕망을 억제하고 자제함', '무관심함', '화를 냄'], answer: 1 },
  { index: 'VCI', subtest: '어휘', category: '어휘', text: '「관용」의 뜻은?', options: ['엄격함', '너그럽고 관대함', '무시함', '비판함'], answer: 1 },
  { index: 'VCI', subtest: '어휘', category: '어휘', text: '「추상」의 반대 개념은?', options: ['구체', '관념', '이론', '상징'], answer: 0 },
  { index: 'VCI', subtest: '어휘', category: '어휘', text: '「인내」의 의미는?', options: ['빠른 행동', '어려움을 참고 견딤', '포기', '분노'], answer: 1 },

  { index: 'VCI', subtest: '상식', category: '상식', text: '지구에서 가장 큰 대양은?', options: ['대서양', '인도양', '태평양', '북극해'], answer: 2 },
  { index: 'VCI', subtest: '상식', category: '상식', text: '대한민국의 수도는?', options: ['부산', '서울', '대전', '인천'], answer: 1 },
  { index: 'VCI', subtest: '상식', category: '상식', text: '1년은 몇 개월?', options: ['10', '11', '12', '13'], answer: 2 },
  { index: 'VCI', subtest: '상식', category: '상식', text: '물의 화학식은?', options: ['CO₂', 'H₂O', 'O₂', 'NaCl'], answer: 1 },

  { index: 'VCI', subtest: '이해', category: '이해', text: '친구가 시험에 떨어졌을 때 가장 적절한 말은?', options: ['너는 공부를 안 해서 그래', '다음에 더 잘할 수 있을 거야', '나는 항상 잘 봐', '시험은 중요하지 않아'], answer: 1 },
  { index: 'VCI', subtest: '이해', category: '이해', text: '왜 신호등에 노란불이 있을까요?', options: ['예쁘게', '정지와 출발 사이 경고', '전기 절약', '장식'], answer: 1 },
  { index: 'VCI', subtest: '이해', category: '이해', text: '도서관에서 조용히 해야 하는 이유는?', options: ['규칙이라서', '다른 사람의 집중을 방해하지 않기 위해', '관리자가 싫어해서', '이유 없음'], answer: 1 },

  // ── PRI 지각추론 ──
  { index: 'PRI', subtest: '행렬추론', category: '행렬추론', text: '3×3 행렬: ○가 대각선으로 증가한다. 빈 칸은?', visual: '○ · · / · ○ · / · · ?', options: ['○', '●', '△', '□'], answer: 0 },
  { index: 'PRI', subtest: '행렬추론', category: '행렬추론', text: '패턴: ▲▼▲ / ▼▲▼ / ▲▼?', visual: '▲▼▲ / ▼▲▼ / ▲▼?', options: ['▲', '▼', '●', '■'], answer: 0 },
  { index: 'PRI', subtest: '행렬추론', category: '행렬추론', text: '각 행의 도형 수가 1,2,3으로 증가. 다음 행은?', visual: '● / ●● / ?', options: ['●●', '●●●', '●●●●', '○○○'], answer: 1 },
  { index: 'PRI', subtest: '행렬추론', category: '행렬추론', text: '시계방향 90° 회전 패턴. 다음은?', visual: '→ ↓ ← ?', options: ['→', '↑', '↓', '←'], answer: 1 },

  { index: 'PRI', subtest: '퍼즐', category: '퍼즐', text: '4조각 중 정사각형을 완성하는 조각은? (ㄱ+ㄴ=□)', visual: 'ㄱ + ㄴ = □', options: ['ㄱ+ㄴ', 'ㄱ+ㄱ', 'ㄴ+ㄴ', 'ㄱ+ㄷ'], answer: 0 },
  { index: 'PRI', subtest: '퍼즐', category: '퍼즐', text: '삼각형 2개를 합치면?', options: ['사각형', '오각형', '원', '삼각형'], answer: 0 },
  { index: 'PRI', subtest: '퍼즐', category: '퍼즐', text: '6개의 정삼각형으로 만든 도형은?', options: ['육각형', '오각형', '사각형', '원'], answer: 0 },

  { index: 'PRI', subtest: '토막짜기', category: '토막짜기', text: '빨강 2 + 파랑 1 = ?', visual: '🔴🔴 + 🔵 = ?', options: ['3칸 블록', '2칸', '4칸', '1칸'], answer: 0 },
  { index: 'PRI', subtest: '토막짜기', category: '토막짜기', text: '정사각형 4개를 2×2로 배열하면?', options: ['큰 정사각형', '직사각형', '삼각형', '원'], answer: 0 },
  { index: 'PRI', subtest: '토막짜기', category: '토막짜기', text: 'L자 2개를 맞붙이면?', options: ['정사각형', '긴 직사각형', 'T자', '원'], answer: 1 },

  { index: 'PRI', subtest: '무게비교', category: '무게비교', text: '저울: A > B, B = C. A와 C는?', visual: 'A ↓ B = C', options: ['A > C', 'A = C', 'A < C', '알 수 없다'], answer: 0 },
  { index: 'PRI', subtest: '무게비교', category: '무게비교', text: '●● = ▲, ● = ?', visual: '●● = ▲', options: ['▲의 절반', '▲', '▲×2', '△'], answer: 0 },
  { index: 'PRI', subtest: '무게비교', category: '무게비교', text: 'A+B = C, A = B. C는 A의?', options: ['같음', '2배', '절반', '3배'], answer: 1 },

  { index: 'PRI', subtest: '빠진곳', category: '빠진곳', text: '얼굴 그림에서 빠진 부분은?', visual: '👤 (코 없음)', options: ['코', '귀', '머리', '목'], answer: 0 },
  { index: 'PRI', subtest: '빠진곳', category: '빠진곳', text: '집 그림에서 빠진 것은?', visual: '🏠 (창문 1개만)', options: ['문', '지붕', '굴뚝', '울타리'], answer: 0 },

  // ── WMI 작업기억 ──
  { index: 'WMI', subtest: '숫자', category: '숫자', text: '7 → 3 → 9 → 1 을 거꾸로 외우면?', visual: '7 → 3 → 9 → 1', options: ['1-9-3-7', '7-3-9-1', '1-3-9-7', '9-7-3-1'], answer: 0 },
  { index: 'WMI', subtest: '숫자', category: '숫자', text: '5 → 2 → 8 을 거꾸로?', visual: '5 → 2 → 8', options: ['8-2-5', '5-2-8', '2-5-8', '8-5-2'], answer: 0 },
  { index: 'WMI', subtest: '숫자', category: '숫자', text: '4 → 1 → 6 → 2 를 거꾸로?', visual: '4 → 1 → 6 → 2', options: ['2-6-1-4', '4-1-6-2', '6-2-1-4', '1-4-2-6'], answer: 0 },
  { index: 'WMI', subtest: '숫자', category: '숫자', text: '9 → 0 → 3 을 거꾸로?', visual: '9 → 0 → 3', options: ['3-0-9', '9-0-3', '0-3-9', '3-9-0'], answer: 0 },

  { index: 'WMI', subtest: '산수', category: '산수', text: '15 + 27 = ? (암산)', options: ['40', '41', '42', '43'], answer: 2 },
  { index: 'WMI', subtest: '산수', category: '산수', text: '8 × 7 = ?', options: ['54', '56', '58', '63'], answer: 1 },
  { index: 'WMI', subtest: '산수', category: '산수', text: '100 − 37 = ?', options: ['53', '63', '73', '67'], answer: 1 },
  { index: 'WMI', subtest: '산수', category: '산수', text: '어떤 수에 4를 곱하면 36. 그 수는?', options: ['7', '8', '9', '10'], answer: 2 },

  { index: 'WMI', subtest: '순서화', category: '순서화', text: '올바른 순서: ①먹기 ②요리 ③재료사기 ④설거지', options: ['③②①④', '②③①④', '③①②④', '①②③④'], answer: 0 },
  { index: 'WMI', subtest: '순서화', category: '순서화', text: '씨앗→?→꽃→열매. 빈칸은?', visual: '씨앗 → ? → 꽃 → 열매', options: ['새싹', '나무', '잎', '뿌리'], answer: 0 },
  { index: 'WMI', subtest: '순서화', category: '순서화', text: '아침→점심→?→자기. 빈칸은?', options: ['저녁', '운동', '공부', '씻기'], answer: 0 },

  // ── PSI 처리속도 ──
  { index: 'PSI', subtest: '동형찾기', category: '동형찾기', text: '▲와 같은 도형은?', visual: '▲  ■  ▲  ●  △', options: ['1번째', '2번째', '3번째', '5번째'], answer: 2 },
  { index: 'PSI', subtest: '동형찾기', category: '동형찾기', text: '●가 몇 개?', visual: '● ■ ● ● ■ ●', options: ['3', '4', '5', '6'], answer: 1 },
  { index: 'PSI', subtest: '동형찾기', category: '동형찾기', text: '7과 같은 숫자는?', visual: '3  7  1  7  9', options: ['1번째', '2번째와 4번째', '3번째', '5번째'], answer: 1 },
  { index: 'PSI', subtest: '동형찾기', category: '동형찾기', text: '★의 개수는?', visual: '★ ☆ ★ ★ ☆ ★', options: ['2', '3', '4', '5'], answer: 2 },

  { index: 'PSI', subtest: '기호', category: '기호', text: '●=1, ■=2, ▲=3 일 때 ■●=?', visual: '●=1 ■=2 ▲=3', options: ['12', '21', '3', '32'], answer: 1 },
  { index: 'PSI', subtest: '기호', category: '기호', text: '★=A, ◆=B 일 때 ★◆★=?', visual: '★=A ◆=B', options: ['ABA', 'BAB', 'ABB', 'AAB'], answer: 0 },
  { index: 'PSI', subtest: '기호', category: '기호', text: '1→○, 2→□, 3→△. 「2 1 3」은?', visual: '1→○ 2→□ 3→△', options: ['□○△', '○□△', '△□○', '□△○'], answer: 0 },

  { index: 'PSI', subtest: '지우기', category: '지우기', text: '■이 아닌 것을 모두 고르면?', visual: '■ ● ■ ■ ● ■', options: ['● 2개', '■ 2개', '● 4개', '■ 4개'], answer: 0 },
  { index: 'PSI', subtest: '지우기', category: '지우기', text: '숫자 5가 아닌 것의 개수는?', visual: '5 3 5 5 8 5 2', options: ['1', '2', '3', '4'], answer: 2 }
];

const KWAIS_PER_INDEX = 8; // 4지표 × 8문항 = 32문항

function buildKwaisTest() {
  const indices = ['VCI', 'PRI', 'WMI', 'PSI'];
  let selected = [];

  indices.forEach(idx => {
    const pool = KWAIS_QUESTION_POOL.filter(q => q.index === idx);
    const picked = pickFromPool(pool, KWAIS_PER_INDEX);
    selected = selected.concat(picked);
  });

  return shuffleArray(selected).map(shuffleQuestionOptions);
}

function getKwaisPoolSize() {
  return KWAIS_QUESTION_POOL.length;
}
