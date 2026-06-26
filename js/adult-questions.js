// InsightIQ 성인 간편(CHC) — 고난도 전용 문항 풀 (초등 수준 제외)

const ADULT_CHC_POOL = [
  // ── 수리·유동추론 ──
  { category: '수리', domain: 'fluid', difficulty: 8, text: '1, 1, 2, 3, 5, 8, 13, ?', visual: '1, 1, 2, 3, 5, 8, 13, ?', options: ['18', '20', '21', '24'], answer: 2 },
  { category: '수리', domain: 'fluid', difficulty: 9, text: '3, 6, 11, 18, 27, ?', visual: '3, 6, 11, 18, 27, ?', options: ['36', '38', '40', '42'], answer: 1 },
  { category: '수리', domain: 'fluid', difficulty: 8, text: '1, 4, 10, 22, 46, ?', visual: '1, 4, 10, 22, 46, ?', options: ['82', '90', '94', '100'], answer: 2 },
  { category: '수리', domain: 'fluid', difficulty: 9, text: '어떤 수의 25%에 15를 더하면 55이다. 그 수는?', options: ['140', '150', '160', '180'], answer: 2 },
  { category: '수리', domain: 'fluid', difficulty: 8, text: '연속한 두 정수의 곱이 306일 때, 두 수의 합은?', options: ['35', '37', '39', '41'], answer: 1 },
  { category: '수리', domain: 'fluid', difficulty: 9, text: '2x² − 11x + 12 = 0의 두 근의 합은?', options: ['5', '5.5', '6', '11'], answer: 1 },
  { category: '수리', domain: 'fluid', difficulty: 8, text: '등차수열 5, 9, 13, … 의 20번째 항은?', options: ['77', '81', '85', '89'], answer: 1 },
  { category: '수리', domain: 'fluid', difficulty: 9, text: 'log₂(32) + log₃(27) = ?', options: ['8', '9', '10', '11'], answer: 3 },
  { category: '수리', domain: 'fluid', difficulty: 8, text: '시속 72km로 2시간 30분 이동한 거리는?', options: ['160km', '170km', '180km', '190km'], answer: 2 },
  { category: '수리', domain: 'fluid', difficulty: 9, text: '주사위 3개를 던질 때 모두 다른 눈이 나올 확률은?', options: ['1/6', '5/18', '5/36', '1/36'], answer: 1 },

  // ── 논리·추론 ──
  { category: '논리', domain: 'fluid', difficulty: 8, text: '모든 A는 B이다. 어떤 B는 C이다. 반드시 참인 것은?', options: ['모든 A는 C', '어떤 A는 C일 수 있다', '모든 C는 A', 'C는 B가 아니다'], answer: 1 },
  { category: '논리', domain: 'fluid', difficulty: 9, text: '「필요조건」과 「충분조건」: 비가 오면 길이 젖는다. 길이 젖었다면?', options: ['반드시 비가 왔다', '비가 왔을 수 있다', '비가 안 왔다', '우산이 없었다'], answer: 1 },
  { category: '논리', domain: 'fluid', difficulty: 8, text: '대우명제: p→q의 대우는?', options: ['q→p', '¬p→¬q', '¬q→¬p', 'p∧q'], answer: 2 },
  { category: '논리', domain: 'fluid', difficulty: 9, text: '명제 ¬(p→q)와 논리적으로 동치인 것은?', options: ['p∧¬q', '¬p∨q', 'p∨¬q', '¬p∧q'], answer: 0 },
  { category: '논리', domain: 'fluid', difficulty: 8, text: '확증 편향이 의사결정에 미치는 영향은?', options: ['모든 증거를 공정히 검토', '자기 믿음을 뒷받침하는 정보만 선택', '감정을 배제', '확률을 정확히 계산'], answer: 1 },
  { category: '논리', domain: 'fluid', difficulty: 9, text: '8명 중 4명을 뽑는 경우의 수는?', options: ['56', '68', '70', '84'], answer: 2 },
  { category: '논리', domain: 'fluid', difficulty: 8, text: '순환논증의 핵심 문제는?', options: ['결론이 거짓', '전제가 결론을 미리 가정', '표본이 작음', '감정적 표현'], answer: 1 },
  { category: '논리', domain: 'fluid', difficulty: 9, text: '삼단논법: 모든 M은 P, 모든 S는 M → 결론은?', options: ['모든 S는 P', '일부 S는 P', '모든 P는 S', 'S는 P가 아니다'], answer: 0 },

  // ── 언어·결정지능 ──
  { category: '언어', domain: 'crystallized', difficulty: 8, text: '「우의」의 반대말에 가장 가까운 것은?', options: ['진지함', '친밀함', '냉소', '격식'], answer: 0 },
  { category: '언어', domain: 'crystallized', difficulty: 9, text: '「역설」의 의미로 가장 적절한 것은?', options: ['명백한 진리', '겉과 다른 모순적 진리', '통계적 오류', '거짓 주장'], answer: 1 },
  { category: '언어', domain: 'crystallized', difficulty: 8, text: '「절제」와 가장 가까운 개념은?', options: ['과욕', '자제', '무관심', '방종'], answer: 1 },
  { category: '언어', domain: 'crystallized', difficulty: 9, text: '법칙 : 과학 = 문법 : ?', options: ['언어', '수학', '역사', '철학'], answer: 0 },
  { category: '언어', domain: 'crystallized', difficulty: 8, text: '「관용」의 뜻은?', options: ['엄격함', '너그러운 용서', '무시', '고집'], answer: 1 },
  { category: '언어', domain: 'crystallized', difficulty: 9, text: 'DNA : 유전정보 = 소프트웨어 : ?', options: ['하드웨어', '프로그램·명령', '전원', '케이블'], answer: 1 },
  { category: '언어', domain: 'crystallized', difficulty: 8, text: '「인과관계」와 가장 가까운 것은?', options: ['우연의 일치', '원인과 결과의 연결', '시간적 선후', '상관만 존재'], answer: 1 },
  { category: '언어', domain: 'crystallized', difficulty: 9, text: '「뉘앙스」의 의미는?', options: ['사전적 정의만', '맥락에 따른 미묘한 뉘앙스', '거짓말', '음성의 크기'], answer: 1 },

  // ── 패턴·시공간 ──
  { category: '패턴', domain: 'visual', difficulty: 8, text: '2, 3, 5, 7, 11, 13, ?', visual: '2, 3, 5, 7, 11, 13, ?', options: ['15', '17', '19', '21'], answer: 1 },
  { category: '패턴', domain: 'visual', difficulty: 9, text: '1, 2, 6, 24, 120, ?', visual: '1, 2, 6, 24, 120, ?', options: ['600', '720', '840', '960'], answer: 1 },
  { category: '패턴', domain: 'visual', difficulty: 8, text: 'ACE, BDF, CEG, ?', visual: 'ACE, BDF, CEG, ?', options: ['DFH', 'DEG', 'DFI', 'EFH'], answer: 0 },
  { category: '패턴', domain: 'visual', difficulty: 9, text: '2→4, 3→9, 4→16, 5→25, 6→?', visual: '6→?', options: ['30', '36', '42', '49'], answer: 1 },
  { category: '패턴', domain: 'visual', difficulty: 8, text: 'Z, X, V, T, R, ?', visual: 'Z, X, V, T, R, ?', options: ['P', 'O', 'N', 'M'], answer: 0 },
  { category: '패턴', domain: 'visual', difficulty: 9, text: '1, 1, 2, 6, 24, 120, ?', visual: '1, 1, 2, 6, 24, 120, ?', options: ['600', '720', '840', '5040'], answer: 1 },

  // ── 공간·고급 ──
  { category: '공간', domain: 'visual', difficulty: 8, text: '좌표 (0,0)에서 (5,12)까지 거리는?', options: ['11', '12', '13', '14'], answer: 2 },
  { category: '공간', domain: 'visual', difficulty: 9, text: '정육면체 3개를 일렬로 붙였을 때 표면적(한 면=1)은?', options: ['12', '14', '16', '18'], answer: 1 },
  { category: '공간', domain: 'visual', difficulty: 8, text: '시계가 10시 15분일 때 시침과 분침이 이루는 각은?', options: ['112.5°', '120°', '127.5°', '135°'], answer: 0 },
  { category: '공간', domain: 'visual', difficulty: 9, text: '한 변이 6인 정삼각형의 넓이는? (√3≈1.73)', options: ['9√3', '12√3', '15√3', '18√3'], answer: 2 },

  // ── 추론·응용 ──
  { category: '추론', domain: 'fluid', difficulty: 8, text: '가설 검정에서 p-value가 0.01 미만이면 일반적으로?', options: ['귀무가설 기각', '귀무가설 채택', '표본 불필요', '결론 없음'], answer: 0 },
  { category: '추론', domain: 'fluid', difficulty: 9, text: '원금 500만 원, 연이자 4% 복리 2년 후 원리합계(만 원)는?', options: ['520', '530', '540', '550'], answer: 2 },
  { category: '추론', domain: 'fluid', difficulty: 8, text: 'A가 B보다 20% 많고, B가 C보다 25% 적다. A와 C의 비는?', options: ['A=C', 'A가 C보다 10% 많음', 'A가 C보다 20% 많음', 'A가 C보다 40% 많음'], answer: 1 },
  { category: '추론', domain: 'fluid', difficulty: 9, text: '「항등」명제의 특성은?', options: ['항상 거짓', '항상 참', '조건부 참', '모순'], answer: 1 }
];

function buildAdultChcTest(count) {
  return prepareTestQuestions(ADULT_CHC_POOL, count, 'category');
}

function getAdultChcPoolSize() {
  return ADULT_CHC_POOL.length;
}
