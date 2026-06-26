// AI Cognitive Assessment (ACA) — 레이븐형 진행행렬 검사 설정
// ※ 공인 Raven/K-WAIS 등을 대체하지 않는 AI 기반 인지능력 평가

const ACA_BRAND = 'AI Cognitive Assessment';

const ACA_TIERS = [
  { tier: 1, label: '쉬움', difficultyRange: [1, 3] },
  { tier: 2, label: '보통', difficultyRange: [3, 5] },
  { tier: 3, label: '어려움', difficultyRange: [5, 7] },
  { tier: 4, label: '최상급', difficultyRange: [7, 10] }
];

const ACA_DOMAINS = {
  matrix: { name: '행렬추론', desc: '행·열 규칙을 통합해 빈 칸을 완성' },
  pattern: { name: '패턴찾기', desc: '반복·변화 패턴 인식' },
  rule: { name: '규칙찾기', desc: '변환 규칙 추론' },
  spatial: { name: '공간지각', desc: '위치·배치 관계 파악' },
  rotation: { name: '도형회전', desc: '회전 변환 추론' },
  symmetry: { name: '대칭', desc: '축 대칭·반전 규칙' },
  analogy: { name: '시각적 유추', desc: '도형 간 관계 유추' },
  abstract: { name: '추상적 사고', desc: '복합 규칙 통합' },
  logic: { name: '논리추론', desc: '일관된 논리 구조 유지' },
  completion: { name: '도형완성', desc: '누락 도형 완성' }
};

const ACA_LEVELS = {
  kindergarten: {
    id: 'kindergarten',
    subLabel: '유치원',
    ageRange: '5~7세',
    icon: '🌱',
    description: '기본 도형·색·개수 패턴 행렬',
    timeLimit: 15,
    perTier: 4,
    matrixSize: 2,
    optionCount: 4
  },
  elementary: {
    id: 'elementary',
    subLabel: '초등학생',
    ageRange: '8~12세',
    icon: '📚',
    description: '2×2·3×3 행렬 · 회전·대칭 도입',
    timeLimit: 20,
    perTier: 5,
    matrixSize: 2,
    optionCount: 5
  },
  middle: {
    id: 'middle',
    subLabel: '중학생',
    ageRange: '13~15세',
    icon: '🔬',
    description: '3×3 진행행렬 · 복합 규칙',
    timeLimit: 25,
    perTier: 6,
    matrixSize: 3,
    optionCount: 6
  },
  high: {
    id: 'high',
    subLabel: '고등학생',
    ageRange: '16~18세',
    icon: '🎓',
    description: '고난도 3×3 · 다중 변환',
    timeLimit: 30,
    perTier: 7,
    matrixSize: 3,
    optionCount: 6
  },
  adult: {
    id: 'adult',
    subLabel: '성인',
    ageRange: '19세 이상',
    icon: '🧠',
    description: '최고난도 추상 행렬 · 복합 규칙',
    timeLimit: 35,
    perTier: 8,
    matrixSize: 3,
    optionCount: 6
  }
};

const ACA_CLASSIFICATIONS = [
  { min: 130, label: '매우 우수', desc: '동일 연령 집단 상위 약 2%' },
  { min: 120, label: '우수', desc: '동일 연령 집단 상위 약 10%' },
  { min: 110, label: '평균 상', desc: '동일 연령 집단 상위 약 25%' },
  { min: 90, label: '평균', desc: '동일 연령 집단 중간 50% 범위' },
  { min: 80, label: '평균 하', desc: '동일 연령 집단 하위 약 25%' },
  { min: 70, label: '경계선', desc: '동일 연령 집단 하위 약 10%' },
  { min: 0, label: '저하', desc: '전문가 상담을 권장합니다' }
];

function getACALevels() {
  return { ...ACA_LEVELS };
}

function getACAQuestionCount(levelId) {
  const cfg = ACA_LEVELS[levelId];
  return cfg ? cfg.perTier * ACA_TIERS.length : 16;
}
