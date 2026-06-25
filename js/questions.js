const AGE_LEVELS = {
  kindergarten: {
    id: 'kindergarten',
    label: '유치원',
    ageRange: '5~7세',
    icon: '🌱',
    description: '그림·색깔·간단한 패턴',
    timeLimit: 15,
    questionCount: 15,
    normMean: 0.55,
    normSd: 0.22
  },
  elementary: {
    id: 'elementary',
    label: '초등학생',
    ageRange: '8~12세',
    icon: '📚',
    description: '기초 수리·언어·논리',
    timeLimit: 18,
    questionCount: 15,
    normMean: 0.58,
    normSd: 0.20
  },
  middle: {
    id: 'middle',
    label: '중학생',
    ageRange: '13~15세',
    icon: '🔬',
    description: '추론·수열·관계 파악',
    timeLimit: 20,
    questionCount: 15,
    normMean: 0.60,
    normSd: 0.19
  },
  high: {
    id: 'high',
    label: '고등학생',
    ageRange: '16~18세',
    icon: '🎓',
    description: '추상 추론·복합 문제',
    timeLimit: 22,
    questionCount: 15,
    normMean: 0.62,
    normSd: 0.18
  },
  adult: {
    id: 'adult',
    label: '성인',
    ageRange: '19세 이상',
    icon: '💼',
    description: '고난도 종합 인지 검사',
    timeLimit: 25,
    questionCount: 15,
    normMean: 0.65,
    normSd: 0.17
  }
};

const DOMAIN_LABELS = {
  fluid: '유동적 추론 (Gf)',
  crystallized: '결정적 지능 (Gc)',
  visual: '시공간 처리 (Gv)',
  memory: '작업 기억 (Gwm)',
  speed: '처리 속도 (Gs)'
};

const CATEGORY_TO_DOMAIN = {
  '관찰': 'visual',
  '분류': 'fluid',
  '수세기': 'memory',
  '수리': 'fluid',
  '논리': 'fluid',
  '언어': 'crystallized',
  '패턴': 'visual',
  '공간': 'visual',
  '추론': 'fluid'
};

const QUESTION_BANK = {
  kindergarten: [
    { category: '관찰', domain: 'visual', text: '빨강, 파랑, 빨강, 파랑, 빨강 — 다음 색은?', visual: '🔴 🔵 🔴 🔵 🔴 ?', options: ['🔴 빨강', '🔵 파랑', '🟡 노랑', '🟢 초록'], answer: 1 },
    { category: '관찰', domain: 'visual', text: '같은 모양을 고르세요.', visual: '● ■ ▲ ● ?', options: ['●', '■', '▲', '★'], answer: 0 },
    { category: '수세기', domain: 'memory', text: '사과가 몇 개일까요?', visual: '🍎 🍎 🍎', options: ['2개', '3개', '4개', '5개'], answer: 1 },
    { category: '분류', domain: 'fluid', text: '다른 하나를 고르세요.', options: ['강아지', '고양이', '자동차', '토끼'], answer: 2 },
    { category: '패턴', domain: 'visual', text: '큰 것, 작은 것, 큰 것 — 다음은?', visual: '⬤ ○ ⬤ ?', options: ['큰 것 (⬤)', '작은 것 (○)', '세모 (△)', '네모 (□)'], answer: 1 },
    { category: '수세기', domain: 'memory', text: '1 다음 숫자는?', visual: '1, 2, ?', options: ['1', '2', '3', '4'], answer: 2 },
    { category: '관찰', domain: 'visual', text: '똑같이 생긴 것은?', visual: '★ ☆ ★ ?', options: ['★', '☆', '●', '■'], answer: 0 },
    { category: '분류', domain: 'fluid', text: '과일만 모은 것은?', options: ['사과, 바나나, 당근', '사과, 바나나, 포도', '당근, 양파, 감자', '고기, 생선, 달걀'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '○ □ ○ □ ○ — 다음은?', visual: '○ □ ○ □ ○ ?', options: ['○', '□', '△', '★'], answer: 1 },
    { category: '수세기', domain: 'memory', text: '손가락은 몇 개일까요?', options: ['3개', '5개', '8개', '10개'], answer: 3 },
    { category: '관찰', domain: 'visual', text: '위와 아래가 바뀐 것은?', visual: '△ 위 ▽ 아래 → ?', options: ['▽ 위 △ 아래', '△ 위 △ 아래', '□ 위 □ 아래', '○ 위 ○ 아래'], answer: 0 },
    { category: '분류', domain: 'fluid', text: '날 수 있는 동물은?', options: ['물고기', '새', '뱀', '개구리'], answer: 1 },
    { category: '수세기', domain: 'memory', text: '2, 3, 4 — 다음 숫자는?', visual: '2, 3, 4, ?', options: ['3', '4', '5', '6'], answer: 2 },
    { category: '패턴', domain: 'visual', text: '🔵 🔵 🔴 🔵 🔵 ?', visual: '🔵 🔵 🔴 🔵 🔵 ?', options: ['🔵', '🔴', '🟡', '🟢'], answer: 1 },
    { category: '관찰', domain: 'visual', text: '가장 긴 것은?', options: ['연필', '지우개', '자(30cm)', '클립'], answer: 2 }
  ],

  elementary: [
    { category: '수리', domain: 'fluid', text: '5 + 7 = ?', options: ['10', '11', '12', '13'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '다음 수열: 2, 4, 6, 8, ?', visual: '2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '9 × 3 = ?', options: ['24', '27', '30', '33'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '모든 강아지는 동물이다. 이 말이 맞으면?', options: ['동물은 모두 강아지다', '강아지는 동물이다', '동물이 아닌 것도 있다', '알 수 없다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '다른 하나는?', options: ['사과', '배', '당근', '포도'], answer: 2 },
    { category: '언어', domain: 'crystallized', text: '책 : 읽다 = 음악 : ?', options: ['듣다', '보다', '만들다', '춤추다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「덥다」의 반대말은?', options: ['따뜻하다', '춥다', '시원하다', '뜨겁다'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '의사 : 병원 = 선생님 : ?', options: ['학교', '학생', '교과서', '시험'], answer: 0 },
    { category: '패턴', domain: 'visual', text: '○ △ ○ △ ○ ?', visual: '○ △ ○ △ ○ ?', options: ['○', '△', '□', '◇'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '1, 4, 9, 16, ? — 다음은?', visual: '1, 4, 9, 16, ?', options: ['20', '25', '30', '36'], answer: 1 },
    { category: '공간', domain: 'visual', text: '정사각형을 반으로 자르면?', options: ['원', '삼각형 2개', '사각형 2개', '오각형'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '48 ÷ 6 = ?', options: ['6', '7', '8', '9'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '민수가 영희보다 키가 크고, 영희가 철수보다 키가 큽니다. 가장 키가 큰 사람은?', options: ['민수', '영희', '철수', '같다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「행복」과 비슷한 말은?', options: ['슬픔', '기쁨', '화남', '걱정'], answer: 1 },
    { category: '패턴', domain: 'visual', text: 'A, C, E, G, ?', visual: 'A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], answer: 1 }
  ],

  middle: [
    { category: '수리', domain: 'fluid', text: '1, 1, 2, 3, 5, 8, ? — 다음 수는?', visual: '1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '14'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '어떤 수의 2배에 5를 더하면 21입니다. 그 수는?', options: ['6', '7', '8', '9'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '3, 6, 11, 18, 27, ?', visual: '3, 6, 11, 18, 27, ?', options: ['36', '38', '40', '42'], answer: 1 },
    { category: '논리', domain: 'fluid', text: 'A는 B보다 키가 크고, B는 C보다 큽니다. 반드시 참인 것은?', options: ['C가 A보다 크다', 'A가 C보다 크다', 'B와 C가 같다', '알 수 없다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '「모든 새는 날 수 있다」가 거짓이 되려면?', options: ['날지 못하는 새가 하나라도 있다', '모든 새가 날지 못한다', '새가 없다', '날 수 있는 동물이 있다'], answer: 0 },
    { category: '논리', domain: 'fluid', text: '다른 성격의 하나는?', options: ['삼각형', '사각형', '원', '오각형'], answer: 2 },
    { category: '언어', domain: 'crystallized', text: '「추상」과 가장 가까운 말은?', options: ['구체적', '관념적', '실용적', '물질적'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: 'A는 B의 아버지, B는 C의 아버지입니다. A와 C의 관계는?', options: ['형제', '삼촌', '조부모와 손자', '사촌'], answer: 2 },
    { category: '언어', domain: 'crystallized', text: '「비유」의 뜻으로 맞는 것은?', options: ['직접 표현', '다른 것에 빗대어 표현', '거짓말', '반복 표현'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '2→4, 3→9, 4→16, 5→?', visual: '2→4, 3→9, 4→16, 5→?', options: ['20', '25', '30', '36'], answer: 1 },
    { category: '패턴', domain: 'visual', text: 'AB, CD, EF, GH, ?', visual: 'AB, CD, EF, GH, ?', options: ['IJ', 'HI', 'JK', 'GH'], answer: 0 },
    { category: '공간', domain: 'visual', text: '정육면체의 면은 몇 개?', options: ['4', '5', '6', '8'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '시계가 3시일 때 시침과 분침의 각도는?', options: ['75°', '80°', '90°', '100°'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '올바른 순서: ①계획 ②실행 ③준비 ④평가', options: ['③①②④', '①③②④', '③②①④', '①②③④'], answer: 0 },
    { category: '패턴', domain: 'visual', text: 'Z, Y, X, W, V, ?', visual: 'Z, Y, X, W, V, ?', options: ['U', 'T', 'S', 'R'], answer: 0 }
  ],

  high: [
    { category: '수리', domain: 'fluid', text: '2, 4, 8, 16, ? — 다음 수는?', visual: '2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], answer: 2 },
    { category: '수리', domain: 'fluid', text: 'x² − 5x + 6 = 0의 해 중 하나는?', options: ['1', '2', '4', '5'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '등차수열 3, 7, 11, 15의 10번째 항은?', options: ['35', '39', '43', '47'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '모든 A는 B이다. 일부 B는 C이다. 반드시 참인 것은?', options: ['모든 A는 C', '어떤 A는 C일 수 있다', '모든 C는 A', 'C는 B가 아니다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '「필요조건」과 「충분조건」 중, 비가 오면 땅이 젖는다 — 비는?', options: ['필요조건', '충분조건', '둘 다', '둘 다 아님'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '5명 중 2명을 뽑는 경우의 수는?', options: ['5', '10', '15', '20'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '「우의」의 반대말은?', options: ['진지함', '친밀함', '냉소', '격식'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「역설」의 의미는?', options: ['명백한 진리', '겉과 다른 모순된 진리', '거짓 주장', '통계적 오류'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '법칙 : 과학 = 문법 : ?', options: ['언어', '수학', '역사', '음악'], answer: 0 },
    { category: '패턴', domain: 'visual', text: '▲ ▲ ■ ▲ ▲ ■ ▲ ▲ ?', visual: '▲ ▲ ■ ▲ ▲ ■ ▲ ▲ ?', options: ['▲', '■', '●', '◆'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '1→1, 2→4, 3→9, 4→16, 5→25, 6→?', visual: '6→?', options: ['30', '36', '42', '49'], answer: 1 },
    { category: '공간', domain: 'visual', text: '종이를 두 번 접어 원형을 잘랐을 때 펼치면?', options: ['원 1개', '원 2개', '원 4개', '타원 2개'], answer: 2 },
    { category: '수리', domain: 'fluid', text: 'log₂(8) + log₂(4) = ?', options: ['3', '4', '5', '6'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '3명이 거짓말하면 진실은? (A: B가 거짓, B: C가 거짓, C: A와 B가 거짓)', options: ['A만 참', 'B만 참', 'C만 참', '모두 참'], answer: 2 },
    { category: '언어', domain: 'crystallized', text: '「인과관계」와 가장 가까운 것은?', options: ['우연의 일치', '원인과 결과의 연결', '상관관계', '시간적 선후'], answer: 1 }
  ],

  adult: [
    { category: '수리', domain: 'fluid', text: '2, 4, 8, 16, ? — 다음 수는?', visual: '2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '어떤 수에 3을 곱하고 7을 빼면 20입니다. 그 수는?', options: ['7', '8', '9', '10'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '1, 1, 2, 3, 5, 8, ?', visual: '1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '14'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '3, 6, 11, 18, 27, ?', visual: '3, 6, 11, 18, 27, ?', options: ['36', '38', '40', '42'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '모든 A는 B이다. 어떤 B는 C이다. 반드시 참인 것은?', options: ['모든 A는 C', '어떤 A는 C일 수 있다', '모든 C는 A', 'C는 B가 아니다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '다음 중 다른 성격의 하나는?', options: ['삼각형', '사각형', '원', '오각형'], answer: 2 },
    { category: '논리', domain: 'fluid', text: 'A는 B보다 키가 크고, B는 C보다 큽니다. 반드시 참인 것은?', options: ['C가 A보다 크다', 'A가 C보다 크다', 'B와 C가 같다', '알 수 없다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '올바른 순서: ①준비 ②실행 ③계획 ④평가', options: ['③①②④', '①③②④', '③②①④', '①②③④'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '책 : 읽다 = 음악 : ?', options: ['듣다', '보다', '만들다', '쓰다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「우의」의 반대말은?', options: ['진지함', '친밀함', '냉소', '격식'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '의사 : 병원 = 교사 : ?', options: ['학교', '학생', '교과서', '시험'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「추상」과 가장 가까운 개념은?', options: ['구체적', '관념적', '실용적', '물질적'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '○ △ ○ △ ○ ?', visual: '○ △ ○ △ ○ ?', options: ['○', '△', '□', '◇'], answer: 1 },
    { category: '패턴', domain: 'fluid', text: '1→2, 2→4, 3→9, 4→16, 5→?', visual: '1→2, 2→4, 3→9, 4→16, 5→?', options: ['20', '25', '30', '36'], answer: 1 },
    { category: '패턴', domain: 'visual', text: 'Z, Y, X, W, V, ?', visual: 'Z, Y, X, W, V, ?', options: ['U', 'T', 'S', 'R'], answer: 0 }
  ]
};

const CATEGORY_LABELS = {
  '관찰': '관찰력',
  '분류': '분류·개념',
  '수세기': '수·기억',
  '수리': '수리 추론',
  '논리': '논리 추론',
  '언어': '언어·어휘',
  '패턴': '패턴 인식',
  '공간': '공간 지각'
};
