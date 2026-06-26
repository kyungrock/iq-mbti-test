// 웩슬러 계열 검사 연령별 설정
// ※ 공인 검사 대체 불가 · 자기 이해용

const WECHSLER_LEVELS = {
  kindergarten: {
    id: 'kindergarten',
    label: 'K-WPPSI-IV',
    subLabel: '유치원',
    ageRange: '5~7세',
    icon: '🌱',
    description: '유아·아동용 웩슬러 4지표',
    examName: 'K-WPPSI-IV',
    timeLimit: 20,
    questionCount: 24,
    perIndex: 6,
    normMean: 0.55,
    normSd: 0.20,
    isWechsler: true,
    recKey: 'kindergarten'
  },
  elementary: {
    id: 'elementary',
    label: 'K-WISC-V',
    subLabel: '초등',
    ageRange: '8~12세',
    icon: '📚',
    description: '아동·청소년용 웩슬러 4지표',
    examName: 'K-WISC-V',
    timeLimit: 28,
    questionCount: 28,
    perIndex: 7,
    normMean: 0.58,
    normSd: 0.19,
    isWechsler: true,
    recKey: 'elementary'
  },
  middle: {
    id: 'middle',
    label: 'K-WISC-V',
    subLabel: '중등',
    ageRange: '13~15세',
    icon: '🔬',
    description: '아동·청소년용 웩슬러 4지표',
    examName: 'K-WISC-V',
    timeLimit: 30,
    questionCount: 28,
    perIndex: 7,
    normMean: 0.60,
    normSd: 0.18,
    isWechsler: true,
    recKey: 'middle'
  },
  high: {
    id: 'high',
    label: 'K-WISC-V',
    subLabel: '고등',
    ageRange: '16~18세',
    icon: '🎓',
    description: '청소년용 웩슬러 4지표',
    examName: 'K-WISC-V',
    timeLimit: 35,
    questionCount: 32,
    perIndex: 8,
    normMean: 0.62,
    normSd: 0.17,
    isWechsler: true,
    recKey: 'high'
  },
  kwais: {
    id: 'kwais',
    label: 'K-WAIS-IV',
    subLabel: '성인',
    ageRange: '16~69세',
    icon: '📋',
    description: '성인용 웩슬러 4지표 · 10소검사',
    examName: 'K-WAIS-IV',
    timeLimit: 40,
    questionCount: 32,
    perIndex: 8,
    normMean: 0.62,
    normSd: 0.17,
    isWechsler: true,
    recKey: 'adult'
  },
  adult: {
    id: 'adult',
    label: '성인 (간편)',
    subLabel: '성인',
    ageRange: '19세 이상',
    icon: '💼',
    description: '고난도 종합 인지 검사',
    timeLimit: 25,
    questionCount: 15,
    normMean: 0.65,
    normSd: 0.17,
    isWechsler: false,
    recKey: 'adult'
  }
};

const WECHSLER_INDICES = {
  VCI: {
    code: 'VCI',
    name: '언어이해',
    fullName: '언어이해 지표 (VCI)',
    desc: '언어적 개념화, 추상적 사고, 지식'
  },
  PRI: {
    code: 'PRI',
    name: '지각추론',
    fullName: '지각추론 지표 (PRI)',
    desc: '시공간 추론, 유동적 지능, 문제 해결'
  },
  WMI: {
    code: 'WMI',
    name: '작업기억',
    fullName: '작업기억 지표 (WMI)',
    desc: '단기 기억, 주의집중, 정보 조작'
  },
  PSI: {
    code: 'PSI',
    name: '처리속도',
    fullName: '처리속도 지표 (PSI)',
    desc: '시지각 처리 속도, 시각-운동 협응'
  }
};

const WECHSLER_SUBTEST_LABELS = {
  '공통성': '공통성', '어휘': '어휘', '상식': '상식', '이해': '이해',
  '질문': '질문', '이름대기': '이름대기', '재미': '재미',
  '행렬추론': '행렬추론', '퍼즐': '퍼즐', '토막짜기': '토막짜기',
  '무게비교': '무게비교', '빠진곳': '빠진 곳 찾기', '모양': '모양 맞추기',
  '숫자': '숫자', '산수': '산수', '순서화': '순서화', '그림기억': '그림 기억',
  '동형찾기': '동형 찾기', '기호': '기호', '지우기': '지우기', '동물': '동물 찾기'
};

const WECHSLER_CLASSIFICATIONS = [
  { min: 130, label: '매우 우수 (Superior)', desc: '웩슬러 규준 상위 2% 수준' },
  { min: 120, label: '우수 (High Average)', desc: '웩슬러 규준 상위 10% 수준' },
  { min: 110, label: '평균 상 (High Average)', desc: '웩슬러 규준 상위 25% 수준' },
  { min: 90, label: '평균 (Average)', desc: '웩슬러 규준 중간 50% 범위' },
  { min: 80, label: '평균 하 (Low Average)', desc: '웩슬러 규준 하위 25% 수준' },
  { min: 70, label: '경계선 (Borderline)', desc: '웩슬러 규준 하위 10% 수준' },
  { min: 0, label: '저하 (Extremely Low)', desc: '전문가 웩슬러 검사 실시 권장' }
];

// 하위 호환
const KWAIS_INDICES = WECHSLER_INDICES;
const KWAIS_SUBTEST_LABELS = WECHSLER_SUBTEST_LABELS;
const KWAIS_CLASSIFICATIONS = WECHSLER_CLASSIFICATIONS;
const KWAIS_CONFIG = WECHSLER_LEVELS.kwais;

function getAllAgeLevels() {
  return { ...WECHSLER_LEVELS };
}
