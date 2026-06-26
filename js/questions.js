const AGE_LEVELS = WECHSLER_LEVELS;

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

// 성인 간편 모드용 (CHC)
const QUESTION_BANK = {
  adult: [
    { category: '수리', domain: 'fluid', text: '2, 4, 8, 16, ? — 다음 수는?', visual: '2, 4, 8, 16, ?', options: ['24', '28', '32', '36'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '어떤 수에 3을 곱하고 7을 빼면 20입니다. 그 수는?', options: ['7', '8', '9', '10'], answer: 2 },
    { category: '수리', domain: 'fluid', text: '1, 1, 2, 3, 5, 8, ?', visual: '1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '14'], answer: 2 },
    { category: '논리', domain: 'fluid', text: '모든 A는 B이다. 어떤 B는 C이다. 반드시 참인 것은?', options: ['모든 A는 C', '어떤 A는 C일 수 있다', '모든 C는 A', 'C는 B가 아니다'], answer: 1 },
    { category: '논리', domain: 'fluid', text: 'A는 B보다 키가 크고, B는 C보다 큽니다. 반드시 참인 것은?', options: ['C가 A보다 크다', 'A가 C보다 크다', 'B와 C가 같다', '알 수 없다'], answer: 1 },
    { category: '언어', domain: 'crystallized', text: '책 : 읽다 = 음악 : ?', options: ['듣다', '보다', '만들다', '쓰다'], answer: 0 },
    { category: '언어', domain: 'crystallized', text: '「우의」의 반대말은?', options: ['진지함', '친밀함', '냉소', '격식'], answer: 0 },
    { category: '패턴', domain: 'visual', text: '○ △ ○ △ ○ ?', visual: '○ △ ○ △ ○ ?', options: ['○', '△', '□', '◇'], answer: 1 },
    { category: '패턴', domain: 'visual', text: 'Z, Y, X, W, V, ?', visual: 'Z, Y, X, W, V, ?', options: ['U', 'T', 'S', 'R'], answer: 0 }
  ]
};
