// 유치원·초·중·고 InsightIQ 문항 풀

const YOUTH_WECHSLER_POOLS = {
  kindergarten: [
    // VCI
    { index: 'VCI', subtest: '공통성', text: '강아지와 고양이의 공통점은?', options: ['동물이다', '크다', '빠르다', '짖는다'], answer: 0 },
    { index: 'VCI', subtest: '공통성', text: '사과와 바나나의 공통점은?', options: ['과일이다', '노란색이다', '달다', '나무'], answer: 0 },
    { index: 'VCI', subtest: '이름대기', text: '「비행기」를 다른 말로 하면?', options: ['하늘을 나는 탈것', '자동차', '배', '기차'], answer: 0 },
    { index: 'VCI', subtest: '질문', text: '왜 손을 씻어야 할까요?', options: ['예쁘게', '세균을 없애려고', '물놀이', '재미'], answer: 1 },
    { index: 'VCI', subtest: '재미', text: '「덥다」의 반대말은?', options: ['따뜻하다', '춥다', '시원하다', '뜨겁다'], answer: 1 },
    { index: 'VCI', subtest: '상식', text: '하늘의 색은?', options: ['파란색', '빨간색', '초록색', '노란색'], answer: 0 },
    { index: 'VCI', subtest: '공통성', text: '연필과 지우개의 공통점은?', options: ['학용품이다', '먹는다', '크다', '날카롭다'], answer: 0 },
    { index: 'VCI', subtest: '질문', text: '왜 신호등을 지켜야 할까요?', options: ['예쁘게', '사고를 막으려고', '느리게', '재미'], answer: 1 },
    // PRI
    { index: 'PRI', subtest: '모양', text: '🔴 🔵 🔴 🔵 ?', visual: '🔴 🔵 🔴 🔵 ?', options: ['🔴', '🔵', '🟡', '🟢'], answer: 0 },
    { index: 'PRI', subtest: '모양', text: '● ■ ● ■ ?', visual: '● ■ ● ■ ?', options: ['●', '■', '▲', '★'], answer: 0 },
    { index: 'PRI', subtest: '퍼즐', text: '큰 것, 작은 것, 큰 것 — 다음은?', visual: '⬤ ○ ⬤ ?', options: ['작은 것 (○)', '큰 것 (⬤)', '△', '□'], answer: 0 },
    { index: 'PRI', subtest: '토막짜기', text: '□ 2개를 붙이면?', options: ['긴 직사각형', '원', '삼각형', '별'], answer: 0 },
    { index: 'PRI', subtest: '빠진곳', text: '얼굴에서 빠진 것은?', visual: '👤 (입 없음)', options: ['입', '귀', '머리', '손'], answer: 0 },
    { index: 'PRI', subtest: '모양', text: '△ □ △ □ ?', visual: '△ □ △ □ ?', options: ['△', '□', '○', '★'], answer: 0 },
    { index: 'PRI', subtest: '퍼즐', text: '1, 2, 3, ?', visual: '1, 2, 3, ?', options: ['2', '3', '4', '5'], answer: 2 },
    { index: 'PRI', subtest: '빠진곳', text: '집 그림에서 빠진 것은?', visual: '🏠 (문 없음)', options: ['문', '지붕', '굴뚝', '울타리'], answer: 0 },
    // WMI
    { index: 'WMI', subtest: '숫자', text: '3 → 5 를 거꾸로?', visual: '3 → 5', options: ['5-3', '3-5', '5-5', '3-3'], answer: 0 },
    { index: 'WMI', subtest: '숫자', text: '2 → 4 → 1 거꾸로?', visual: '2 → 4 → 1', options: ['1-4-2', '2-4-1', '4-2-1', '1-2-4'], answer: 0 },
    { index: 'WMI', subtest: '그림기억', text: '🍎 🍌 🍎 — 사과는?', visual: '🍎 🍌 🍎', options: ['1개', '2개', '3개', '0개'], answer: 1 },
    { index: 'WMI', subtest: '순서화', text: '씻기 → ? → 밥먹기. 빈칸은?', options: ['놀기', '옷입기', '자기', '학교'], answer: 1 },
    { index: 'WMI', subtest: '숫자', text: '1 → 2 → 3 거꾸로?', visual: '1 → 2 → 3', options: ['3-2-1', '1-2-3', '2-1-3', '3-1-2'], answer: 0 },
    { index: 'WMI', subtest: '그림기억', text: '⭐가 몇 개?', visual: '⭐ ⭐ ⭐', options: ['2', '3', '4', '5'], answer: 1 },
    // PSI
    { index: 'PSI', subtest: '동물', text: '강아지는?', options: ['🐶', '🐱', '🐰', '🐻'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '●와 같은 것은?', visual: '● ■ ● ○ ●', options: ['1,3,5번째', '2번째', '4번째', '전부'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '★가 아닌 것은?', visual: '★ ☆ ★ ★ ☆', options: ['☆ 2개', '★ 2개', '☆ 3개', '★ 3개'], answer: 0 },
    { index: 'PSI', subtest: '기호', text: '●=1, ■=2. ■●=?', visual: '●=1 ■=2', options: ['21', '12', '3', '22'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '🔵가 몇 개?', visual: '🔵 🔴 🔵 🔵 🔴', options: ['2', '3', '4', '5'], answer: 1 },
    { index: 'PSI', subtest: '동물', text: '고양이는?', options: ['🐶', '🐱', '🐮', '🐷'], answer: 1 }
  ],

  elementary: [
    { index: 'VCI', subtest: '공통성', text: '「시」와 「노래」의 공통점은?', options: ['예술/표현', '종이', '크다', '조용하다'], answer: 0 },
    { index: 'VCI', subtest: '공통성', text: '「병원」과 「학교」의 공통점은?', options: ['사람을 돕는 곳', '크다', '밤에 문 닫음', '운동장'], answer: 0 },
    { index: 'VCI', subtest: '어휘', text: '「용기」의 뜻은?', options: ['겁', '두려움 없이 행동함', '슬픔', '화'], answer: 1 },
    { index: 'VCI', subtest: '어휘', text: '「정직」의 반대말에 가까운 것은?', options: ['거짓말', '친절', '용감', '조용'], answer: 0 },
    { index: 'VCI', subtest: '상식', text: '1년은 몇 계절?', options: ['2', '3', '4', '5'], answer: 2 },
    { index: 'VCI', subtest: '상식', text: '지구에서 가장 큰 대양은?', options: ['대서양', '태평양', '인도양', '북극해'], answer: 1 },
    { index: 'VCI', subtest: '이해', text: '친구가 넘어졌을 때 해야 할 일은?', options: ['웃는다', '도와주고 안부를 묻는다', '무시한다', '뛰어간다'], answer: 1 },
    { index: 'VCI', subtest: '이해', text: '왜 약속 시간을 지켜야 할까요?', options: ['재미', '상대를 존중하기 위해', '필요 없음', '늦어도 됨'], answer: 1 },
    { index: 'PRI', subtest: '행렬추론', text: '○ △ ○ △ ?', visual: '○ △ ○ △ ?', options: ['○', '△', '□', '◇'], answer: 0 },
    { index: 'PRI', subtest: '행렬추론', text: '2, 4, 6, 8, ?', visual: '2, 4, 6, 8, ?', options: ['9', '10', '11', '12'], answer: 1 },
    { index: 'PRI', subtest: '퍼즐', text: '1, 4, 9, 16, ?', visual: '1, 4, 9, 16, ?', options: ['20', '25', '30', '36'], answer: 1 },
    { index: 'PRI', subtest: '토막짜기', text: '정사각형 2개를 붙이면?', options: ['직사각형', '원', '삼각형', '오각형'], answer: 0 },
    { index: 'PRI', subtest: '무게비교', text: 'A > B, B = C. A와 C?', options: ['A > C', 'A = C', 'A < C', '모름'], answer: 0 },
    { index: 'PRI', subtest: '빠진곳', text: '자전거에서 빠진 것?', visual: '🚲 (바퀴 1개)', options: ['바퀴', '안장', '핸들', '벨'], answer: 0 },
    { index: 'PRI', subtest: '행렬추론', text: 'A, C, E, G, ?', visual: 'A, C, E, G, ?', options: ['H', 'I', 'J', 'K'], answer: 1 },
    { index: 'WMI', subtest: '숫자', text: '5 → 2 → 8 거꾸로?', visual: '5 → 2 → 8', options: ['8-2-5', '5-2-8', '2-5-8', '8-5-2'], answer: 0 },
    { index: 'WMI', subtest: '숫자', text: '9 → 3 → 6 → 1 거꾸로?', visual: '9 → 3 → 6 → 1', options: ['1-6-3-9', '9-3-6-1', '6-1-3-9', '1-3-6-9'], answer: 0 },
    { index: 'WMI', subtest: '산수', text: '7 × 8 = ?', options: ['54', '56', '58', '63'], answer: 1 },
    { index: 'WMI', subtest: '산수', text: '48 ÷ 6 = ?', options: ['6', '7', '8', '9'], answer: 2 },
    { index: 'WMI', subtest: '순서화', text: '①씨앗 ②꽃 ③새싹 ④열매. 올바른 순서?', options: ['①③②④', '③①②④', '①②③④', '②③①④'], answer: 0 },
    { index: 'WMI', subtest: '순서화', text: '아침→점심→?→자기', options: ['저녁', '운동', '공부', '놀이'], answer: 0 },
    { index: 'WMI', subtest: '산수', text: '9 + 6 = ?', options: ['14', '15', '16', '17'], answer: 1 },
    { index: 'PSI', subtest: '동형찾기', text: '■와 같은 것?', visual: '■ ● ■ ○ ■', options: ['1,3,5번째', '2번째', '4번째', '전부'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '7이 몇 개?', visual: '3 7 1 7 9 7', options: ['1', '2', '3', '4'], answer: 2 },
    { index: 'PSI', subtest: '기호', text: '★=A ◆=B. ★◆★=?', visual: '★=A ◆=B', options: ['ABA', 'BAB', 'AAB', 'ABB'], answer: 0 },
    { index: 'PSI', subtest: '기호', text: '1→○ 2→□ 3→△. 「2 3 1」=?', visual: '1→○ 2→□ 3→△', options: ['□△○', '○□△', '△□○', '□○△'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '■이 아닌 것?', visual: '■ ● ■ ■ ●', options: ['● 2개', '■ 3개', '● 3개', '■ 2개'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '5가 아닌 숫자 개수?', visual: '5 3 5 8 5 2', options: ['2', '3', '4', '5'], answer: 1 },
    { index: 'PSI', subtest: '기호', text: '●=1 ■=2. ●■●=?', visual: '●=1 ■=2', options: ['121', '212', '12', '21'], answer: 0 }
  ],

  middle: [
    { index: 'VCI', subtest: '공통성', text: '「민주주의」와 「자유」의 관계는?', options: ['반대', '관련 있음', '무관', '같음'], answer: 1 },
    { index: 'VCI', subtest: '공통성', text: '「소설」과 「영화」의 공통점은?', options: ['이야기를 전달', '종이', '같은 길이', '같은 감독'], answer: 0 },
    { index: 'VCI', subtest: '어휘', text: '「추상」의 반대 개념은?', options: ['구체', '관념', '이론', '상징'], answer: 0 },
    { index: 'VCI', subtest: '어휘', text: '「절제」의 의미는?', options: ['과욕', '욕망을 억제함', '무관심', '화'], answer: 1 },
    { index: 'VCI', subtest: '상식', text: '광합성을 하는 것은?', options: ['동물', '식물', '바람', '구름'], answer: 1 },
    { index: 'VCI', subtest: '상식', text: '대한민국 헌법이 보장하는 기본권이 아닌 것은?', options: ['자유', '평등', '무죄추정', '면책'], answer: 3 },
    { index: 'VCI', subtest: '이해', text: '왜 다양성을 존중해야 할까요?', options: ['법 때문', '서로 다른 가치를 인정하기 위해', '필요 없음', '싸움'], answer: 1 },
    { index: 'VCI', subtest: '이해', text: '환경 보호가 중요한 이유는?', options: ['미래 세대를 위해', '재미', '돈', '유행'], answer: 0 },
    { index: 'PRI', subtest: '행렬추론', text: '1, 1, 2, 3, 5, ?', visual: '1, 1, 2, 3, 5, ?', options: ['6', '7', '8', '9'], answer: 2 },
    { index: 'PRI', subtest: '행렬추론', text: '2→4, 3→9, 4→16, 5→?', visual: '2→4, 3→9, 4→16, 5→?', options: ['20', '25', '30', '36'], answer: 1 },
    { index: 'PRI', subtest: '퍼즐', text: '3, 6, 11, 18, ?', visual: '3, 6, 11, 18, ?', options: ['25', '27', '29', '31'], answer: 1 },
    { index: 'PRI', subtest: '토막짜기', text: '정육면체 면의 수는?', options: ['4', '5', '6', '8'], answer: 2 },
    { index: 'PRI', subtest: '무게비교', text: '●● = ▲, ● = ?', visual: '●● = ▲', options: ['▲의 절반', '▲', '▲×2', '없음'], answer: 0 },
    { index: 'PRI', subtest: '빠진곳', text: '지도에서 빠진 나침반 방향?', visual: '동서남 (북 없음)', options: ['북', '남', '동', '서'], answer: 0 },
    { index: 'PRI', subtest: '행렬추론', text: 'Z, Y, X, W, ?', visual: 'Z, Y, X, W, ?', options: ['U', 'V', 'T', 'S'], answer: 1 },
    { index: 'PRI', subtest: '퍼즐', text: '4, 9, 16, 25, ?', visual: '4, 9, 16, 25, ?', options: ['30', '32', '36', '49'], answer: 2 },
    { index: 'WMI', subtest: '숫자', text: '4 → 9 → 2 → 7 거꾸로?', visual: '4 → 9 → 2 → 7', options: ['7-2-9-4', '4-9-2-7', '2-7-4-9', '9-4-7-2'], answer: 0 },
    { index: 'WMI', subtest: '숫자', text: '6 → 1 → 8 → 3 거꾸로?', visual: '6 → 1 → 8 → 3', options: ['3-8-1-6', '6-1-8-3', '8-3-6-1', '1-6-3-8'], answer: 0 },
    { index: 'WMI', subtest: '산수', text: '3x − 7 = 14, x = ?', options: ['5', '6', '7', '8'], answer: 2 },
    { index: 'WMI', subtest: '산수', text: '15% of 200 = ?', options: ['20', '25', '30', '35'], answer: 2 },
    { index: 'WMI', subtest: '순서화', text: '①계획 ②실행 ③준비 ④평가. 올바른 순서?', options: ['③①②④', '①③②④', '③②①④', '①②③④'], answer: 0 },
    { index: 'WMI', subtest: '순서화', text: '탄생→성장→?→죽음', options: ['노년', '청년', '유년', '출생'], answer: 0 },
    { index: 'WMI', subtest: '산수', text: '72 ÷ 8 = ?', options: ['7', '8', '9', '10'], answer: 2 },
    { index: 'PSI', subtest: '동형찾기', text: '◆가 몇 개?', visual: '◆ ○ ◆ ◆ ○ ◆', options: ['3', '4', '5', '6'], answer: 1 },
    { index: 'PSI', subtest: '동형찾기', text: 'B와 같은 글자?', visual: 'A B C B D B', options: ['2,4,6번째', '1번째', '3번째', '5번째'], answer: 0 },
    { index: 'PSI', subtest: '기호', text: '●=1 ■=2 ▲=3. ▲■●=?', visual: '●=1 ■=2 ▲=3', options: ['321', '123', '213', '312'], answer: 0 },
    { index: 'PSI', subtest: '기호', text: 'A→1 B→2 C→3. 「CAB」=?', visual: 'A→1 B→2 C→3', options: ['312', '123', '321', '213'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '△가 아닌 것?', visual: '△ ■ △ △ ■ △', options: ['■ 2개', '△ 4개', '■ 4개', '△ 2개'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '짝수가 아닌 것?', visual: '2 4 7 8 6 9', options: ['7, 9', '2, 4', '8, 6', '전부'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '○가 몇 개?', visual: '○ △ ○ ○ △ ○', options: ['3', '4', '5', '6'], answer: 1 }
  ],

  high: [
    { index: 'VCI', subtest: '공통성', text: '「과학」과 「기술」의 관계는?', options: ['무관', '상호 보완', '완전 동일', '반대'], answer: 1 },
    { index: 'VCI', subtest: '공통성', text: '「법」과 「도덕」의 공통점은?', options: ['행동 규범', '같은 벌', '종교', '무관'], answer: 0 },
    { index: 'VCI', subtest: '어휘', text: '「역설」의 의미는?', options: ['명백한 진리', '겉과 다른 모순적 진리', '거짓', '통계'], answer: 1 },
    { index: 'VCI', subtest: '어휘', text: '「인과관계」와 가까운 것은?', options: ['우연', '원인과 결과의 연결', '상관', '시간'], answer: 1 },
    { index: 'VCI', subtest: '상식', text: 'DNA의 기능은?', options: ['유전 정보 저장', '에너지 생산', '호흡', '소화'], answer: 0 },
    { index: 'VCI', subtest: '상식', text: '프랑스 혁명이 일어난 세기는?', options: ['16세기', '17세기', '18세기', '19세기'], answer: 2 },
    { index: 'VCI', subtest: '이해', text: '언론의 자유가 중요한 이유는?', options: ['민주주의의 기본', '시끄러움', '유행', '필요 없음'], answer: 0 },
    { index: 'VCI', subtest: '이해', text: '양극화 해소가 필요한 이유는?', options: ['사회 통합', '경쟁', '개인 이익', '무관'], answer: 0 },
    { index: 'PRI', subtest: '행렬추론', text: '2, 4, 8, 16, ?', visual: '2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], answer: 2 },
    { index: 'PRI', subtest: '행렬추론', text: '1, 4, 10, 22, 46, ?', visual: '1, 4, 10, 22, 46, ?', options: ['82', '94', '100', '106'], answer: 1 },
    { index: 'PRI', subtest: '퍼즐', text: 'x²−5x+6=0의 해 중 하나?', options: ['1', '2', '4', '5'], answer: 1 },
    { index: 'PRI', subtest: '토막짜기', text: '좌표 (0,0)~(3,4) 거리?', options: ['3', '4', '5', '7'], answer: 2 },
    { index: 'PRI', subtest: '무게비교', text: 'A+B=C, A=B. C는 A의?', options: ['같음', '2배', '절반', '3배'], answer: 1 },
    { index: 'PRI', subtest: '빠진곳', text: '원소 주기율표에서 H 다음?', options: ['He', 'Li', 'O', 'C'], answer: 0 },
    { index: 'PRI', subtest: '행렬추론', text: '2, 3, 5, 7, 11, ?', visual: '2, 3, 5, 7, 11, ?', options: ['12', '13', '14', '15'], answer: 1 },
    { index: 'PRI', subtest: '무게비교', text: 'A > B, B > C. A와 C?', options: ['A > C', 'A = C', 'A < C', '모름'], answer: 0 },
    { index: 'WMI', subtest: '숫자', text: '7→2→5→4→6 거꾸로?', visual: '7→2→5→4→6', options: ['6-4-5-2-7', '7-2-5-4-6', '5-4-7-2', '2-7-6-4'], answer: 0 },
    { index: 'WMI', subtest: '숫자', text: '1→4→2→8→3 거꾸로?', visual: '1→4→2→8→3', options: ['3-8-2-4-1', '1-4-2-8-3', '8-3-1-4', '4-1-3-8'], answer: 0 },
    { index: 'WMI', subtest: '산수', text: '√81 + 4² = ?', options: ['17', '19', '21', '25'], answer: 3 },
    { index: 'WMI', subtest: '순서화', text: '문제→분석→?→해결', options: ['무시', '대안 모색', '포기', '반복'], answer: 1 },
    { index: 'PSI', subtest: '지우기', text: '3의 배수가 아닌 것?', visual: '3 6 8 9 12 14', options: ['8, 14', '3, 6', '9, 12', '전부'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '「A」와 같은 글자?', visual: 'B A C A D A E', options: ['2,4,6번째', '1,3,5', '전부', '없음'], answer: 0 },
    { index: 'PSI', subtest: '기호', text: '1→□ 2→○ 3→△. 「123」=?', visual: '1→□ 2→○ 3→△', options: ['□○△', '○△□', '△□○', '□△○'], answer: 0 },
    { index: 'WMI', subtest: '산수', text: 'log₂(8)+log₂(4)=?', options: ['3', '4', '5', '6'], answer: 2 },
    { index: 'WMI', subtest: '산수', text: '등차 3,7,11의 10번째 항?', options: ['35', '39', '43', '47'], answer: 1 },
    { index: 'WMI', subtest: '순서화', text: '가설→실험→?→결론', options: ['관찰', '분석', '출판', '질문'], answer: 1 },
    { index: 'WMI', subtest: '순서화', text: '원인→?→결과. 빈칸에 맞는 과정?', options: ['과정/메커니즘', '무시', '반대', '우연'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '「8」과 같은 숫자?', visual: '3 8 1 8 5 8 2', options: ['2,4,6번째', '1,3,5', '전부', '없음'], answer: 0 },
    { index: 'PSI', subtest: '동형찾기', text: '■ 개수?', visual: '■ □ ■ ■ □ ■ ■', options: ['4', '5', '6', '7'], answer: 1 },
    { index: 'PSI', subtest: '기호', text: 'α=A β=B γ=C. βαγ=?', visual: 'α=A β=B γ=C', options: ['BCA', 'ABC', 'CAB', 'ACB'], answer: 0 },
    { index: 'PSI', subtest: '기호', text: '1→★ 2→◆ 3→●. 「321」=?', visual: '1→★ 2→◆ 3→●', options: ['●◆★', '★◆●', '◆●★', '●★◆'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '모음(A,E)이 아닌 것?', visual: 'A B C D E F', options: ['B,C,D,F', 'A,E', '전부', '없음'], answer: 0 },
    { index: 'PSI', subtest: '지우기', text: '3의 배수가 아닌 것?', visual: '3 6 8 9 12 14', options: ['8, 14', '3, 6', '9, 12', '전부'], answer: 0 }
  ]
};

function buildWechslerTest(levelId) {
  const config = WECHSLER_LEVELS[levelId];
  if (levelId === 'insightiq') return [];

  const pool = YOUTH_WECHSLER_POOLS[levelId];
  if (!pool || !config) return [];

  const indices = ['VCI', 'PRI', 'WMI', 'PSI'];
  let selected = [];

  indices.forEach(idx => {
    const idxPool = pool.filter(q => q.index === idx);
    selected = selected.concat(pickFromPool(idxPool, config.perIndex));
  });

  return shuffleArray(selected).map(shuffleQuestionOptions);
}

function getWechslerPoolSize(levelId) {
  if (levelId === 'insightiq') {
    return getKwaisQuestionBank().count;
  }
  return (YOUTH_WECHSLER_POOLS[levelId] || []).length;
}
