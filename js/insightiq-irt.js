// 2PL IRT (문항반응이론) 엔진 — InsightIQ CAT용

const IRT_A_DEFAULT = 1.15;

/** 난이도 Level 1~10 → IRT b (θ 스케일, IQ 80~160 대응) */
function difficultyToIrtB(level) {
  return (level - 5.5) * 0.52;
}

/** IRT b → Level 1~10 */
function irtBToDifficulty(b) {
  return Math.max(1, Math.min(10, Math.round(b / 0.52 + 5.5)));
}

/** θ=0(평균)에서의 예상 정답률 */
function expectedCorrectRate(a, b, theta) {
  theta = theta ?? 0;
  return 1 / (1 + Math.exp(-a * (theta - b)));
}

function irtProbability(theta, a, b) {
  const z = a * (theta - b);
  if (z > 20) return 1;
  if (z < -20) return 0;
  return 1 / (1 + Math.exp(-z));
}

function itemInformation(theta, a, b) {
  const p = irtProbability(theta, a, b);
  return a * a * p * (1 - p);
}

function logLikelihood(theta, responses) {
  let ll = 0;
  responses.forEach(({ a, b, correct }) => {
    const p = irtProbability(theta, a, b);
    const clamped = Math.max(1e-9, Math.min(1 - 1e-9, p));
    ll += correct ? Math.log(clamped) : Math.log(1 - clamped);
  });
  return ll;
}

function logLikelihoodDerivative(theta, responses) {
  let d = 0;
  responses.forEach(({ a, b, correct }) => {
    const p = irtProbability(theta, a, b);
    d += a * (correct - p);
  });
  return d;
}

function logLikelihoodSecondDerivative(theta, responses) {
  let d2 = 0;
  responses.forEach(({ a, b }) => {
    const p = irtProbability(theta, a, b);
    d2 -= a * a * p * (1 - p);
  });
  return d2;
}

/** Newton-Raphson MLE 능력 추정 */
function estimateThetaMLE(responses, initialTheta) {
  if (!responses.length) return initialTheta ?? 0;
  let theta = initialTheta ?? 0;

  for (let i = 0; i < 40; i++) {
    const d1 = logLikelihoodDerivative(theta, responses);
    const d2 = logLikelihoodSecondDerivative(theta, responses);
    if (Math.abs(d2) < 1e-8) break;
    const step = d1 / d2;
    theta -= step;
    theta = Math.max(-3.5, Math.min(4.5, theta));
    if (Math.abs(step) < 0.001) break;
  }
  return theta;
}

/** 표준오차 (SE) */
function estimateStandardError(theta, responses) {
  if (responses.length < 2) return 1.0;
  const info = responses.reduce((sum, r) => sum + itemInformation(theta, r.a, r.b), 0);
  return info > 0 ? 1 / Math.sqrt(info) : 1.0;
}

function thetaToIQ(theta) {
  return Math.round(Math.max(80, Math.min(160, 100 + 15 * theta)));
}

function iqToTheta(iq) {
  return (iq - 100) / 15;
}

function thetaToPercentile(theta) {
  return Math.round(normCdf(theta) * 100);
}

function enrichQuestionIRT(q) {
  const a = q.discrimination ?? IRT_A_DEFAULT;
  const b = q.irtB ?? difficultyToIrtB(q.difficulty);
  return {
    ...q,
    discrimination: a,
    irtB: b,
    expectedCorrectRate: Math.round(expectedCorrectRate(a, b, 0) * 100) / 100,
    ability: q.ability || q.index
  };
}
