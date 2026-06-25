// 1차 MBTI 추가 문항 (차원별 14문항 중 랜덤 출제, 풀 확장)

const PHASE1_EXTRA = [
  // E 추가
  { dim: 'EI', pole: 'E', text: '그룹 프로젝트에서 적극적으로 의견을 낸다.' },
  { dim: 'EI', pole: 'E', text: '낯선 사람에게도 쉽게 말을 건다.' },
  { dim: 'EI', pole: 'E', text: '활동적인 환경에서 일할 때 능률이 오른다.' },
  { dim: 'EI', pole: 'E', text: '전화 통화가 메시지보다 편하다.' },
  { dim: 'EI', pole: 'E', text: '여러 사람 앞에서 발표하는 것이 부담스럽지 않다.' },
  { dim: 'EI', pole: 'E', text: '주말에 친구들과 만나는 것을 선호한다.' },
  { dim: 'EI', pole: 'E', text: '생각이 나면 바로 말로 표현한다.' },
  { dim: 'EI', pole: 'E', text: '에너지가 넘쳐서 가만히 있기 어렵다.' },
  // I 추가
  { dim: 'EI', pole: 'I', text: '중요한 결정은 혼자 내리는 것이 편하다.' },
  { dim: 'EI', pole: 'I', text: '긴 대화 후에는 혼자 쉬고 싶다.' },
  { dim: 'EI', pole: 'I', text: '깊이 있는 1:1 대화를 좋아한다.' },
  { dim: 'EI', pole: 'I', text: '생각을 글로 정리하는 편이다.' },
  { dim: 'EI', pole: 'I', text: '관심사에 대해 깊이 탐구하는 것을 즐긴다.' },
  { dim: 'EI', pole: 'I', text: '시끄러운 장소보다 조용한 곳을 선호한다.' },
  { dim: 'EI', pole: 'I', text: '먼저 다가오기보다 기다리는 편이다.' },
  { dim: 'EI', pole: 'I', text: '혼자 여행하거나 활동하는 것이 좋다.' },

  // S 추가
  { dim: 'SN', pole: 'S', text: '지시사항을 단계별로 따르는 것이 편하다.' },
  { dim: 'SN', pole: 'S', text: '실제 경험한 것을 더 신뢰한다.' },
  { dim: 'SN', pole: 'S', text: '숫자와 데이터에 근거해 판단한다.' },
  { dim: 'SN', pole: 'S', text: '현재 상황에 집중하는 편이다.' },
  { dim: 'SN', pole: 'S', text: '명확하고 구체적인 설명을 선호한다.' },
  { dim: 'SN', pole: 'S', text: '전통적이고 검증된 방법을 따른다.' },
  { dim: 'SN', pole: 'S', text: '세부 사항을 놓치지 않으려 한다.' },
  { dim: 'SN', pole: 'S', text: '실용적인 결과를 중시한다.' },
  // N 추가
  { dim: 'SN', pole: 'N', text: '아이디어와 가능성을 먼저 떠올린다.' },
  { dim: 'SN', pole: 'N', text: '상징과 은유를 이해하는 데 능하다.' },
  { dim: 'SN', pole: 'N', text: '여러 가지 해석을 동시에 고려한다.' },
  { dim: 'SN', pole: 'N', text: '미래 트렌드에 관심이 많다.' },
  { dim: 'SN', pole: 'N', text: '추상적 개념을 쉽게 이해한다.' },
  { dim: 'SN', pole: 'N', text: '새로운 관점을 제시하는 것을 좋아한다.' },
  { dim: 'SN', pole: 'N', text: '세부보다 전체 구조를 먼저 본다.' },
  { dim: 'SN', pole: 'N', text: '상상력을 활용해 문제를 해결한다.' },

  // T 추가
  { dim: 'TF', pole: 'T', text: '객관적 기준으로 사람을 평가하려 한다.' },
  { dim: 'TF', pole: 'T', text: '감정적 호소에 흔들리지 않는 편이다.' },
  { dim: 'TF', pole: 'T', text: '진실이 친절함보다 중요할 때가 있다.' },
  { dim: 'TF', pole: 'T', text: '논리적 일관성을 중시한다.' },
  { dim: 'TF', pole: 'T', text: '문제의 원인을 분석적으로 파악한다.' },
  { dim: 'TF', pole: 'T', text: '감정보다 사실에 기반해 조언한다.' },
  { dim: 'TF', pole: 'T', text: '비판을 개인 공격이 아닌 피드백으로 받는다.' },
  { dim: 'TF', pole: 'T', text: '원칙과 규칙을 일관되게 적용한다.' },
  // F 추가
  { dim: 'TF', pole: 'F', text: '타인의 기분을 해치지 않으려 노력한다.' },
  { dim: 'TF', pole: 'F', text: '갈등 시 감정적 상처를 걱정한다.' },
  { dim: 'TF', pole: 'F', text: '공감과 위로가 중요하다고 생각한다.' },
  { dim: 'TF', pole: 'F', text: '사람의 가치를 먼저 생각한다.' },
  { dim: 'TF', pole: 'F', text: '분위기와 조화를 중시한다.' },
  { dim: 'TF', pole: 'F', text: '감정 표현이 풍부한 편이다.' },
  { dim: 'TF', pole: 'F', text: '타인의 입장에서 생각하려 한다.' },
  { dim: 'TF', pole: 'F', text: '따뜻한 관계를 유지하려 한다.' },

  // J 추가
  { dim: 'JP', pole: 'J', text: '할 일 목록을 만들어 관리한다.' },
  { dim: 'JP', pole: 'J', text: '일을 미루지 않고 바로 처리한다.' },
  { dim: 'JP', pole: 'J', text: '결정을 내리면 바꾸기 어렵다.' },
  { dim: 'JP', pole: 'J', text: '정해진 규칙을 따르는 것이 편하다.' },
  { dim: 'JP', pole: 'J', text: '시간 약속을 철저히 지킨다.' },
  { dim: 'JP', pole: 'J', text: '목표를 세우고 계획대로 진행한다.' },
  { dim: 'JP', pole: 'J', text: '마무리가 안 되면 불편하다.' },
  { dim: 'JP', pole: 'J', text: '체계적인 환경을 선호한다.' },
  // P 추가
  { dim: 'JP', pole: 'P', text: '즉흥적으로 계획을 바꾸는 것이 자연스럽다.' },
  { dim: 'JP', pole: 'P', text: '마감이 다가와야 집중이 된다.' },
  { dim: 'JP', pole: 'P', text: '선택을 미루고 옵션을 열어둔다.' },
  { dim: 'JP', pole: 'P', text: '융통성 있는 일정을 선호한다.' },
  { dim: 'JP', pole: 'P', text: '새로운 정보에 따라 방향을 바꿀 수 있다.' },
  { dim: 'JP', pole: 'P', text: '자유로운 분위기에서 더 잘한다.' },
  { dim: 'JP', pole: 'P', text: '엄격한 규칙을 답답해한다.' },
  { dim: 'JP', pole: 'P', text: '여러 일을 동시에 진행하는 편이다.' }
];

const PHASE1_PER_DIM = 14;

function buildPhase1Questions() {
  const pool = [...PHASE1_QUESTIONS, ...PHASE1_EXTRA];
  const dims = ['EI', 'SN', 'TF', 'JP'];
  let selected = [];
  dims.forEach(dim => {
    const dimPool = pool.filter(q => q.dim === dim);
    selected = selected.concat(pickFromPool(dimPool, PHASE1_PER_DIM));
  });
  return shuffleArray(selected);
}
