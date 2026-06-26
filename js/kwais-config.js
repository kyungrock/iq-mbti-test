// K-WAIS-IV (한국판 웩슬러 성인지능검사 4판) 구성
// 대상: 만 16세 0개월 ~ 69세 11개월
// ※ 본 웹 테스트는 K-WAIS-IV 구조를 참고한 자기 이해용이며 공인 검사를 대체하지 않습니다.

const KWAIS_CONFIG = {
  id: 'kwais',
  label: 'K-WAIS-IV',
  ageRange: '16~69세',
  icon: '📋',
  description: '웩슬러 4지표 · 10핵심 소검사',
  timeLimit: 40,
  questionCount: 32,
  normMean: 0.62,
  normSd: 0.17,
  isKwais: true
};

const KWAIS_INDICES = {
  VCI: {
    code: 'VCI',
    name: '언어이해',
    fullName: '언어이해 지표 (VCI)',
    desc: '언어적 개념화, 추상적 사고, 축적된 지식',
    subtests: ['공통성', '어휘', '상식', '이해']
  },
  PRI: {
    code: 'PRI',
    name: '지각추론',
    fullName: '지각추론 지표 (PRI)',
    desc: '시공간 추론, 유동적 지능, 시각적 문제 해결',
    subtests: ['행렬추론', '퍼즐', '토막짜기', '무게비교', '빠진곳']
  },
  WMI: {
    code: 'WMI',
    name: '작업기억',
    fullName: '작업기억 지표 (WMI)',
    desc: '단기 기억, 주의집중, 정보 조작',
    subtests: ['숫자', '산수', '순서화']
  },
  PSI: {
    code: 'PSI',
    name: '처리속도',
    fullName: '처리속도 지표 (PSI)',
    desc: '시지각 처리 속도, 시각-운동 협응',
    subtests: ['동형찾기', '기호', '지우기']
  }
};

const KWAIS_SUBTEST_LABELS = {
  '공통성': '공통성 (Similarities)',
  '어휘': '어휘 (Vocabulary)',
  '상식': '상식 (Information)',
  '이해': '이해 (Comprehension)',
  '행렬추론': '행렬추론 (Matrix Reasoning)',
  '퍼즐': '퍼즐 (Visual Puzzles)',
  '토막짜기': '토막짜기 (Block Design)',
  '무게비교': '무게비교 (Figure Weights)',
  '빠진곳': '빠진 곳 찾기 (Picture Completion)',
  '숫자': '숫자 (Digit Span)',
  '산수': '산수 (Arithmetic)',
  '순서화': '순서화 (Sequencing)',
  '동형찾기': '동형 찾기 (Symbol Search)',
  '기호': '기호 (Coding)',
  '지우기': '지우기 (Cancellation)'
};

const KWAIS_CLASSIFICATIONS = [
  { min: 130, label: '매우 우수 (Superior)', desc: 'K-WAIS-IV 기준 상위 2% 수준' },
  { min: 120, label: '우수 (High Average)', desc: 'K-WAIS-IV 기준 상위 10% 수준' },
  { min: 110, label: '평균 상 (High Average)', desc: 'K-WAIS-IV 기준 상위 25% 수준' },
  { min: 90, label: '평균 (Average)', desc: 'K-WAIS-IV 기준 중간 50% 범위' },
  { min: 80, label: '평균 하 (Low Average)', desc: 'K-WAIS-IV 기준 하위 25% 수준' },
  { min: 70, label: '경계선 (Borderline)', desc: 'K-WAIS-IV 기준 하위 10% 수준' },
  { min: 0, label: '저하 (Extremely Low)', desc: '전문가 K-WAIS-IV 실시 권장' }
];
