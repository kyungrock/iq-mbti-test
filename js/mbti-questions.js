// 1차 검사: 56문항 (각 차원 14문항) — MBTI 4차원 판별
// pole: 해당 진술에 동의하면 점수가 가는 쪽

const PHASE1_QUESTIONS = [
  // E/I (14)
  { dim: 'EI', pole: 'E', text: '새로운 사람을 만나면 에너지가 생기는 편이다.' },
  { dim: 'EI', pole: 'E', text: '파티나 모임에서 여러 사람과 대화하는 것이 즐겁다.' },
  { dim: 'EI', pole: 'E', text: '생각을 정리할 때 말로 표현하는 것이 도움이 된다.' },
  { dim: 'EI', pole: 'E', text: '사람들과 함께 있을 때 더 활기차게 느껴진다.' },
  { dim: 'EI', pole: 'E', text: '먼저 대화를 시작하는 편이다.' },
  { dim: 'EI', pole: 'E', text: '넓은 인맥을 유지하는 것이 편하다.' },
  { dim: 'EI', pole: 'E', text: '외출 후에도 에너지가 남는 경우가 많다.' },
  { dim: 'EI', pole: 'I', text: '혼자만의 시간이 없으면 지친다.' },
  { dim: 'EI', pole: 'I', text: '깊은 대화는 소수의 사람과 나누는 것을 선호한다.' },
  { dim: 'EI', pole: 'I', text: '생각을 정리할 때 혼자 조용히 있는 것이 좋다.' },
  { dim: 'EI', pole: 'I', text: '큰 모임보다 소규모 만남이 편하다.' },
  { dim: 'EI', pole: 'I', text: '말하기 전에 먼저 생각하는 편이다.' },
  { dim: 'EI', pole: 'I', text: '혼자 취미를 즐기는 시간이 필요하다.' },
  { dim: 'EI', pole: 'I', text: '사교 모임 후에는 혼자 쉬어야 충전된다.' },

  // S/N (14)
  { dim: 'SN', pole: 'S', text: '구체적인 사실과 세부 사항에 주의를 기울인다.' },
  { dim: 'SN', pole: 'S', text: '경험과 실제 사례를 통해 배우는 것을 선호한다.' },
  { dim: 'SN', pole: 'S', text: '현실적이고 실용적인 해결책을 찾는다.' },
  { dim: 'SN', pole: 'S', text: '지금 당장 할 수 있는 일에 집중한다.' },
  { dim: 'SN', pole: 'S', text: '검증된 방법을 신뢰한다.' },
  { dim: 'SN', pole: 'S', text: '설명을 들을 때 구체적 예시가 있으면 이해가 잘 된다.' },
  { dim: 'SN', pole: 'S', text: '세부적인 관찰력이 좋은 편이다.' },
  { dim: 'SN', pole: 'N', text: '미래의 가능성과 잠재력에 대해 자주 생각한다.' },
  { dim: 'SN', pole: 'N', text: '큰 그림과 전체적인 맥락을 먼저 파악하려 한다.' },
  { dim: 'SN', pole: 'N', text: '추상적 개념과 이론에 흥미를 느낀다.' },
  { dim: 'SN', pole: 'N', text: '새로운 아이디어와 혁신을 좋아한다.' },
  { dim: 'SN', pole: 'N', text: '패턴과 연결고리를 찾는 것을 즐긴다.' },
  { dim: 'SN', pole: 'N', text: '상상력이 풍부한 편이다.' },
  { dim: 'SN', pole: 'N', text: '현재보다 미래에 더 관심이 많다.' },

  // T/F (14)
  { dim: 'TF', pole: 'T', text: '결정을 내릴 때 논리와 객관적 사실을 우선한다.' },
  { dim: 'TF', pole: 'T', text: '공정함과 일관된 기준이 중요하다.' },
  { dim: 'TF', pole: 'T', text: '비판적 피드백도 성장에 도움이 된다고 생각한다.' },
  { dim: 'TF', pole: 'T', text: '감정보다 원칙을 따르는 편이다.' },
  { dim: 'TF', pole: 'T', text: '문제 해결 시 효율성을 중시한다.' },
  { dim: 'TF', pole: 'T', text: '논쟁을 통해 더 나은 결론을 찾을 수 있다.' },
  { dim: 'TF', pole: 'T', text: '감정적 호소보다 논리적 설득에 설득된다.' },
  { dim: 'TF', pole: 'F', text: '결정이 타인의 감정에 미치는 영향을 고려한다.' },
  { dim: 'TF', pole: 'F', text: '조화와 공감이 논리만큼 중요하다.' },
  { dim: 'TF', pole: 'F', text: '다른 사람의 감정을 잘 읽는 편이다.' },
  { dim: 'TF', pole: 'F', text: '갈등 상황에서 상대의 기분을 먼저 생각한다.' },
  { dim: 'TF', pole: 'F', text: '공감과 배려가 핵심 가치다.' },
  { dim: 'TF', pole: 'F', text: '비판보다 격려가 더 동기부여가 된다.' },
  { dim: 'TF', pole: 'F', text: '진정성 있는 관계를 매우 중시한다.' },

  // J/P (14)
  { dim: 'JP', pole: 'J', text: '일정과 계획을 미리 세우는 것을 좋아한다.' },
  { dim: 'JP', pole: 'J', text: '마감 전에 일을 끝내는 편이다.' },
  { dim: 'JP', pole: 'J', text: '정리정돈된 환경에서 집중이 잘 된다.' },
  { dim: 'JP', pole: 'J', text: '결정을 빨리 내리고 움직이는 것이 편하다.' },
  { dim: 'JP', pole: 'J', text: '체크리스트를 활용하는 편이다.' },
  { dim: 'JP', pole: 'J', text: '예측 가능한 일상이 안정감을 준다.' },
  { dim: 'JP', pole: 'J', text: '프로젝트를 시작 전에 계획을 세운다.' },
  { dim: 'JP', pole: 'P', text: '유연하게 상황에 맞춰 대응하는 것을 선호한다.' },
  { dim: 'JP', pole: 'P', text: '마감 직전에 집중력이 올라가는 편이다.' },
  { dim: 'JP', pole: 'P', text: '즉흥적인 계획 변경을 크게 개의치 않는다.' },
  { dim: 'JP', pole: 'P', text: '선택지를 열어두고 정보를 더 모으려 한다.' },
  { dim: 'JP', pole: 'P', text: '자유로운 환경에서 더 창의적이다.' },
  { dim: 'JP', pole: 'P', text: '엄격한 일정보다 여유 있는 일정이 좋다.' },
  { dim: 'JP', pole: 'P', text: '새로운 정보가 나오면 계획을 수정할 수 있다.' }
];

const LIKERT_LABELS = [
  { value: 1, label: '전혀 아니다' },
  { value: 2, label: '아니다' },
  { value: 3, label: '보통' },
  { value: 4, label: '그렇다' },
  { value: 5, label: '매우 그렇다' }
];

// 2차 검사: 유형별 적합도 확인 문항 수
const PHASE2_COUNT = 24;

function getPhase2Questions(mbtiType) {
  const traits = TYPE_TRAITS[mbtiType];
  if (!traits) return [];
  return traits.slice(0, PHASE2_COUNT).map((text, i) => ({
    id: `${mbtiType}-${i}`,
    text,
    type: mbtiType
  }));
}
