// 연령별 추가 문항 풀 (기본 15 + 추가 20 = 35문항 중 매번 15문항 랜덤 출제)

const QUESTION_EXTRA = {
  kindergarten: [
    { category: '관찰', domain: 'visual', text: '노랑, 초록, 노랑, 초록 — 다음은?', visual: '🟡 🟢 🟡 🟢 ?', options: ['🟡 노랑', '🟢 초록', '🔴 빨강', '🔵 파랑'], answer: 0 },
    { category: '관찰', domain: 'visual', text: '가장 작은 것은?', options: ['코끼리', '개미', '말', '소'], answer: 1 },
    { category: '수세기', domain: 'memory', text: '별이 몇 개?', visual: '⭐ ⭐ ⭐ ⭐', options: ['3개', '4개', '5개', '6개'], answer: 1 },
    { category: '수세기', domain: 'memory', text: '0 다음 숫자는?', visual: '0, 1, ?', options: ['0', '1', '2', '3'], answer: 2 },
    { category: '분류', domain: 'fluid', text: '바다에 사는 동물은?', options: ['사자', '고래', '토끼', '닭'], answer: 1 },
    { category: '분류', domain: 'fluid', text: '색깔이 있는 것은?', options: ['바람', '무지개', '소리', '냄새'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '△ □ △ □ ?', visual: '△ □ △ □ ?', options: ['△', '□', '○', '★'], answer: 0 },
    { category: '패턴', domain: 'visual', text: '1, 1, 2, 1, 1, ?', visual: '1, 1, 2, 1, 1, ?', options: ['1', '2', '3', '4'], answer: 1 },
    { category: '관찰', domain: 'visual', text: '둘이 똑같은 짝은?', visual: '🐶 🐱 🐶 🐰', options: ['강아지 2마리', '고양이 2마리', '토끼 2마리', '없다'], answer: 0 },
    { category: '수세기', domain: 'memory', text: '한 주는 며칠?', options: ['5일', '6일', '7일', '8일'], answer: 2 },
    { category: '분류', domain: 'fluid', text: '달리기를 할 수 있는 것은?', options: ['나무', '사람', '바위', '구름'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '☀️ 🌙 ☀️ 🌙 ?', visual: '☀️ 🌙 ☀️ 🌙 ?', options: ['☀️', '🌙', '⭐', '🌧️'], answer: 0 },
    { category: '관찰', domain: 'visual', text: '무거운 것은?', options: ['깃털', '풍선', '돌', '종이'], answer: 2 },
    { category: '수세기', domain: 'memory', text: '5, 6, 7 — 다음은?', visual: '5, 6, 7, ?', options: ['6', '7', '8', '9'], answer: 2 },
    { category: '분류', domain: 'fluid', text: '추운 곳에 사는 동물은?', options: ['펭귄', '사막여우', '악어', '원숭이'], answer: 0 },
    { category: '관찰', domain: 'visual', text: '빠른 것은?', options: ['거북이', '치타', '달팽이', '나무'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '● ● ○ ● ● ?', visual: '● ● ○ ● ● ?', options: ['●', '○', '■', '△'], answer: 1 },
    { category: '수세기', domain: 'memory', text: '양손 손가락은?', options: ['5개', '8개', '10개', '12개'], answer: 2 },
    { category: '분류', domain: 'fluid', text: '공기를 날 수 있는 것은?', options: ['자동차', '비행기', '배', '기차'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '크다, 작다, 크다 — 다음은?', options: ['크다', '작다', '중간', '없다'], answer: 1 }
  ],

  elementary: [
    { category: '수리', domain: 'fluid', text: '12 − 5 = ?', options: ['5', '6', '7', '8'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '7 × 8 = ?', options: ['54', '56', '58', '63'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '100 ÷ 4 = ?', options: ['20', '25', '30', '40'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '3, 5, 7, 9, ?', visual: '3, 5, 7, 9, ?', options: ['10', '11', '12', '13'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '비가 오면 우산을 쓴다. 우산을 썼다면?', options: ['반드시 비가 온다', '비가 왔을 수 있다', '비가 안 왔다', '알 수 없다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '다른 하나는?', options: ['볼펜', '연필', '지우개', '의자'], answer: 3 },
    { category: '언어', domain: 'crystallized', text: '물 : 마시다 = 빵 : ?', options: ['먹다', '자르다', '굽다', '사다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「크다」의 반대말은?', options: ['작다', '길다', '높다', '넓다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '태양 : 낮 = 달 : ?', options: ['밤', '별', '구름', '비'], answer: 0 },
    { category: '패턴', domain: 'visual', text: '2, 4, 8, 16, ?', visual: '2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], answer: 2 },
    { category: '패턴', domain: 'visual', text: 'B, D, F, H, ?', visual: 'B, D, F, H, ?', options: ['I', 'J', 'K', 'L'], answer: 1 },
    { category: '공간', domain: 'visual', text: '시계 방향으로 90° 돌리면?', options: ['같다', '거꾸로', '옆으로', '뒤집힌다'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '한 변이 5cm인 정사각형 둘레는?', options: ['15cm', '20cm', '25cm', '10cm'], answer: 1 },
    { category: '논리', domain: 'fluid', text: 'A>B, B=C이면?', options: ['A<C', 'A=C', 'A>C', '알 수 없다'], answer: 2 },
    { category: '언어', domain: 'crystallized', text: '「용감」과 비슷한 말은?', options: ['겁쟁이', '대담', '소심', '조심'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '□ △ □ △ □ ?', visual: '□ △ □ △ □ ?', options: ['□', '△', '○', '◇'], answer: 1 },
    { category: '공간', domain: 'visual', text: '거울에 비친 글자는?', options: ['같다', '좌우 반전', '상하 반전', '변하지 않는다'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '15 + 28 = ?', options: ['41', '42', '43', '44'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '모든 고양이는 동물이다. 토토는 고양이다. 토토는?', options: ['식물', '동물', '광물', '알 수 없다'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '바늘 : 실 = 망치 : ?', options: ['못', '나무', '톱', '페인트'], answer: 0 }
  ],

  middle: [
    { category: '수리', domain: 'fluid', text: '2, 6, 12, 20, 30, ?', visual: '2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '48'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '√144 = ?', options: ['10', '11', '12', '14'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '3x − 7 = 14, x = ?', options: ['5', '6', '7', '8'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '2⁵ = ?', options: ['16', '24', '32', '64'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '일부 A는 B이다. 일부 B는 C이다. 반드시 참인 것은?', options: ['모든 A는 C', '어떤 A는 C일 수 있다', 'C는 A가 아니다', '모든 C는 B'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '다음 중 가장 강한 논리 연결은?', options: ['상관관계', '인과관계', '우연', '유사성'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '「망설이다」의 반대말에 가까운 것은?', options: ['결단하다', '생각하다', '피하다', '잊다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '은유 : 직유 = ?', options: ['비유 : 비유', '직유 : 은유', '은유 : 비유', '비유 : 은유'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '1, 3, 6, 10, 15, ?', visual: '1, 3, 6, 10, 15, ?', options: ['18', '20', '21', '25'], answer: 2 },
    { category: '패턴', domain: 'visual', text: 'ACE, BDF, CEG, ?', visual: 'ACE, BDF, CEG, ?', options: ['DFH', 'DEG', 'DFI', 'EFH'], answer: 0 },
    { category: '공간', domain: 'visual', text: '정삼각형 내각의 합은?', options: ['90°', '180°', '270°', '360°'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '반지름 3인 원의 지름은?', options: ['3', '6', '9', '12'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '거짓 → 참 은 항상?', options: ['참', '거짓', '모순', '알 수 없다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「관용」의 뜻은?', options: ['엄격함', '관습적 너그러움', '무관심', '고집'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '3, 9, 27, 81, ?', visual: '3, 9, 27, 81, ?', options: ['162', '243', '324', '405'], answer: 1 },
    { category: '공간', domain: 'visual', text: '원뿔의 밑면은?', options: ['삼각형', '원', '사각형', '타원'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '15% of 200 = ?', options: ['20', '25', '30', '35'], answer: 2 },
    { category: '논리', domain: 'fluid', text: 'A∪B에서 A만 해당하는 원소는?', options: ['A∩B', 'A−B', 'B−A', 'A′'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '역사 : 과거 = 예언 : ?', options: ['현재', '미래', '과거', '상상'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '○●○●○● ?', visual: '○●○●○● ?', options: ['○', '●', '◐', '◑'], answer: 0 }
  ],

  high: [
    { category: '수리', domain: 'fluid', text: 'sin 30° = ?', options: ['0', '1/2', '√2/2', '1'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '등비수열 2, 6, 18의 5번째 항은?', options: ['54', '108', '162', '486'], answer: 2 },
    { category: '수리', domain: 'fluid', text: 'lim(x→0) sinx/x = ?', options: ['0', '1', '∞', '없다'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '행렬 [[1,2],[3,4]]의 행렬식은?', options: ['−2', '−1', '0', '2'], answer: 0 },
    { category: '논리', domain: 'fluid', text: '대우명제: p→q의 대우는?', options: ['q→p', '¬p→¬q', '¬q→¬p', 'p∧q'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '8명 중 3명을 뽑는 경우의 수는?', options: ['24', '56', '84', '120'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '「절충」의 의미는?', options: ['극단 선택', '중간 타협', '완전 거부', '일방 승리'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '문학 : 소설 = 미술 : ?', options: ['음악', '그림', '춤', '건축'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '1, 4, 10, 22, 46, ?', visual: '1, 4, 10, 22, 46, ?', options: ['82', '94', '100', '106'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '△, △△, △△△, ?', visual: '△ → △△ → △△△ → ?', options: ['△△', '△△△△', '□□□□', '○○○○'], answer: 1 },
    { category: '공간', domain: 'visual', text: '4차원 초정팔체의 면 수는?', options: ['8', '16', '24', '32'], answer: 1 },
    { category: '수리', domain: 'fluid', text: '∫₀¹ 2x dx = ?', options: ['0', '1', '2', '4'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '귀류법으로 증명할 때 가정은?', options: ['결론이 참', '결론의 부정이 참', '전제가 거짓', '모순 없음'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '「허사」에 가까운 것은?', options: ['사실', '과장·거짓', '비유', '풍자'], answer: 1 },
    { category: '패턴', domain: 'visual', text: '2, 3, 5, 7, 11, ?', visual: '2, 3, 5, 7, 11, ?', options: ['12', '13', '14', '15'], answer: 1 },
    { category: '공간', domain: 'visual', text: '좌표 (0,0)에서 (3,4)까지 거리는?', options: ['5', '6', '7', '8'], answer: 0 },
    { category: '수리', domain: 'fluid', text: 'log₁₀(1000) = ?', options: ['2', '3', '4', '10'], answer: 1 },
    { category: '논리', domain: 'fluid', text: '명제 ¬(p∧q)와 동치인 것은?', options: ['¬p∧¬q', '¬p∨¬q', 'p∨q', 'p→q'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '「보수」와 대비되는 개념은?', options: ['진보', '전통', '안정', '유지'], answer: 0 },
    { category: '패턴', domain: 'visual', text: '1, 1, 2, 6, 24, ?', visual: '1, 1, 2, 6, 24, ?', options: ['48', '72', '120', '240'], answer: 2 }
  ],

  adult: []
};

function getFullQuestionPool(levelId) {
  const base = QUESTION_BANK[levelId] || [];
  const extra = QUESTION_EXTRA[levelId] || [];
  return [...base, ...extra];
}

function buildIqTest(levelId, count) {
  const config = getAllAgeLevels()[levelId];
  if (config?.isInsightIQ && typeof buildInsightIQTest === 'function') {
    return buildInsightIQTest(levelId);
  }
  if (levelId === 'adult' && typeof buildAdultChcTest === 'function') {
    return buildAdultChcTest(count);
  }
  const pool = getFullQuestionPool(levelId);
  return prepareTestQuestions(pool, count, 'category');
}
