const AGE_LEVELS = INSIGHTIQ_LEVELS;

const DOMAIN_LABELS = {
  fluid: '유동적 추론 (Gf)',
  crystallized: '결정적 지능 (Gc)',
  visual: '시공간 처리 (Gv)',
  memory: '작업 기억 (Gwm)',
  speed: '처리 속도 (Gs)'
};

const CATEGORY_TO_DOMAIN = {
  '관찰': 'visual', '분류': 'fluid', '수세기': 'memory',
  '수리': 'fluid', '논리': 'fluid', '언어': 'crystallized',
  '패턴': 'visual', '공간': 'visual', '추론': 'fluid'
};

const CATEGORY_LABELS = {
  '관찰': '관찰력', '분류': '분류·개념', '수세기': '수·기억',
  '수리': '수리 추론', '논리': '논리 추론', '언어': '언어·어휘',
  '패턴': '패턴 인식', '공간': '공간 지각'
};

// 성인 간편 모드 — adult-questions.js 고난도 풀 사용
const QUESTION_BANK = {
  adult: []
};
