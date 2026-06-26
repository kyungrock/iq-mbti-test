// ACA 절차적 행렬 생성 엔진 — SVG 렌더링 · 규칙 기반 무한 생성

function acaMulberry32(seed) {
  let t = seed >>> 0;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const ACA_PALETTES = {
  kindergarten: ['#6c8cff', '#f87171', '#4ade80'],
  elementary: ['#6c8cff', '#f87171', '#4ade80', '#fbbf24'],
  middle: ['#6c8cff', '#f87171', '#4ade80', '#fbbf24', '#a78bfa'],
  high: ['#6c8cff', '#f87171', '#4ade80', '#fbbf24', '#a78bfa', '#38bdf8'],
  adult: ['#6c8cff', '#f87171', '#4ade80', '#fbbf24', '#a78bfa', '#38bdf8', '#fb923c']
};

const ACA_SHAPE_SETS = {
  kindergarten: ['circle', 'square', 'triangle'],
  elementary: ['circle', 'square', 'triangle', 'diamond'],
  middle: ['circle', 'square', 'triangle', 'diamond', 'cross'],
  high: ['circle', 'square', 'triangle', 'diamond', 'cross', 'ring'],
  adult: ['circle', 'square', 'triangle', 'diamond', 'cross', 'ring', 'arc']
};

const ACA_RULE_POOL = {
  kindergarten: ['colorShift', 'countPlus', 'rotate90'],
  elementary: ['colorShift', 'countPlus', 'rotate90', 'sizeUp', 'flipH'],
  middle: ['colorShift', 'countPlus', 'rotate90', 'rotate180', 'sizeUp', 'flipH', 'flipV', 'moveRight'],
  high: ['colorShift', 'countPlus', 'rotate90', 'rotate180', 'sizeUp', 'sizeDown', 'flipH', 'flipV', 'moveRight', 'moveDown', 'swapShape'],
  adult: ['colorShift', 'countPlus', 'countMinus', 'rotate90', 'rotate180', 'sizeUp', 'sizeDown', 'flipH', 'flipV', 'moveRight', 'moveDown', 'swapShape', 'invertFill']
};

const ACA_RULE_DOMAINS = {
  colorShift: 'pattern',
  countPlus: 'pattern',
  countMinus: 'pattern',
  rotate90: 'rotation',
  rotate180: 'rotation',
  sizeUp: 'spatial',
  sizeDown: 'spatial',
  flipH: 'symmetry',
  flipV: 'symmetry',
  moveRight: 'spatial',
  moveDown: 'spatial',
  swapShape: 'analogy',
  invertFill: 'abstract'
};

function acaPick(rng, arr) {
  return arr[Math.floor(rng() * arr.length)];
}

function acaCloneCell(cell) {
  return {
    elements: cell.elements.map(e => ({ ...e }))
  };
}

function acaRandomCell(rng, ageId) {
  const shapes = ACA_SHAPE_SETS[ageId];
  const colors = ACA_PALETTES[ageId];
  const count = 1 + Math.floor(rng() * (ageId === 'kindergarten' ? 2 : ageId === 'elementary' ? 2 : 3));
  const elements = [];
  for (let i = 0; i < count; i++) {
    elements.push({
      shape: acaPick(rng, shapes),
      color: acaPick(rng, colors),
      size: 0.22 + rng() * 0.12,
      x: 0.35 + rng() * 0.3,
      y: 0.35 + rng() * 0.3,
      rotation: [0, 90, 180, 270][Math.floor(rng() * 4)],
      filled: rng() > 0.15
    });
  }
  return { elements };
}

function acaApplyRule(rule, cell, rng, ageId) {
  const c = acaCloneCell(cell);
  const colors = ACA_PALETTES[ageId];
  const shapes = ACA_SHAPE_SETS[ageId];

  switch (rule) {
    case 'colorShift':
      c.elements.forEach(e => {
        const idx = colors.indexOf(e.color);
        e.color = colors[(idx + 1 + colors.length) % colors.length];
      });
      break;
    case 'countPlus':
      if (c.elements.length < 5) {
        const src = c.elements[0];
        c.elements.push({
          ...src,
          x: Math.min(0.75, src.x + 0.18),
          y: Math.min(0.75, src.y + (rng() > 0.5 ? 0.12 : -0.12))
        });
      }
      break;
    case 'countMinus':
      if (c.elements.length > 1) c.elements.pop();
      break;
    case 'rotate90':
      c.elements.forEach(e => { e.rotation = (e.rotation + 90) % 360; });
      break;
    case 'rotate180':
      c.elements.forEach(e => { e.rotation = (e.rotation + 180) % 360; });
      break;
    case 'sizeUp':
      c.elements.forEach(e => { e.size = Math.min(0.42, e.size + 0.08); });
      break;
    case 'sizeDown':
      c.elements.forEach(e => { e.size = Math.max(0.14, e.size - 0.08); });
      break;
    case 'flipH':
      c.elements.forEach(e => { e.x = 1 - e.x; e.rotation = (360 - e.rotation) % 360; });
      break;
    case 'flipV':
      c.elements.forEach(e => { e.y = 1 - e.y; e.rotation = (180 - e.rotation + 360) % 360; });
      break;
    case 'moveRight':
      c.elements.forEach(e => { e.x = Math.min(0.82, e.x + 0.2); });
      break;
    case 'moveDown':
      c.elements.forEach(e => { e.y = Math.min(0.82, e.y + 0.2); });
      break;
    case 'swapShape': {
      const order = shapes.slice();
      c.elements.forEach(e => {
        const i = order.indexOf(e.shape);
        e.shape = order[(i + 1) % order.length];
      });
      break;
    }
    case 'invertFill':
      c.elements.forEach(e => { e.filled = !e.filled; });
      break;
    default:
      break;
  }
  return c;
}

function acaCellsEqual(a, b) {
  if (!a || !b || a.elements.length !== b.elements.length) return false;
  const sig = cell => cell.elements
    .map(e => `${e.shape}|${e.color}|${e.size.toFixed(2)}|${e.x.toFixed(2)}|${e.y.toFixed(2)}|${e.rotation}|${e.filled}`)
    .sort()
    .join(';');
  return sig(a) === sig(b);
}

function acaCellSignature(cell) {
  return cell.elements
    .map(e => `${e.shape}|${e.color}|${e.size.toFixed(2)}|${e.x.toFixed(2)}|${e.y.toFixed(2)}|${e.rotation}|${e.filled}`)
    .sort()
    .join(';');
}

function acaBuildGrid(size, rowRule, colRule, seedCell, rng, ageId) {
  const grid = Array.from({ length: size }, () => Array(size).fill(null));
  grid[0][0] = acaCloneCell(seedCell);

  for (let c = 1; c < size; c++) {
    grid[0][c] = acaApplyRule(rowRule, grid[0][c - 1], rng, ageId);
  }
  for (let r = 1; r < size; r++) {
    grid[r][0] = acaApplyRule(colRule, grid[r - 1][0], rng, ageId);
  }
  for (let r = 1; r < size; r++) {
    for (let c = 1; c < size; c++) {
      const viaRow = acaApplyRule(rowRule, grid[r][c - 1], rng, ageId);
      const viaCol = acaApplyRule(colRule, grid[r - 1][c], rng, ageId);
      if (!acaCellsEqual(viaRow, viaCol)) return null;
      grid[r][c] = viaRow;
    }
  }
  return grid;
}

function acaShapeSvg(el, cx, cy, scale) {
  const r = 14 * el.size / 0.28 * scale;
  const rot = el.rotation;
  const fill = el.filled ? el.color : 'none';
  const stroke = el.color;
  const sw = el.filled ? 0 : 2.2;

  switch (el.shape) {
    case 'circle':
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
    case 'square':
      return `<rect x="${cx - r}" y="${cy - r}" width="${r * 2}" height="${r * 2}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(${rot} ${cx} ${cy})"/>`;
    case 'triangle': {
      const h = r * 1.15;
      return `<polygon points="${cx},${cy - h} ${cx - r},${cy + h * 0.6} ${cx + r},${cy + h * 0.6}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(${rot} ${cx} ${cy})"/>`;
    }
    case 'diamond':
      return `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" transform="rotate(${rot} ${cx} ${cy})"/>`;
    case 'cross': {
      const w = r * 0.35;
      return `<g transform="rotate(${rot} ${cx} ${cy})" stroke="${stroke}" stroke-width="${w}" stroke-linecap="round">
        <line x1="${cx - r}" y1="${cy}" x2="${cx + r}" y2="${cy}"/>
        <line x1="${cx}" y1="${cy - r}" x2="${cx}" y2="${cy + r}"/>
      </g>`;
    }
    case 'ring':
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${stroke}" stroke-width="${r * 0.45}"/>`;
    case 'arc':
      return `<path d="M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}" fill="none" stroke="${stroke}" stroke-width="2.8" transform="rotate(${rot} ${cx} ${cy})"/>`;
    default:
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
  }
}

function acaCellInnerMarkup(cell) {
  if (!cell) {
    return `<rect width="100" height="100" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.15)" stroke-width="2" stroke-dasharray="6 4" rx="6"/>
      <text x="50" y="58" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="28" font-weight="700">?</text>`;
  }
  const shapes = cell.elements.map(e => {
    const cx = e.x * 100;
    const cy = e.y * 100;
    return acaShapeSvg(e, cx, cy, 1);
  }).join('');
  return `<rect width="100" height="100" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" stroke-width="1.5" rx="6"/>${shapes}`;
}

function acaRenderCell(cell, cellPx) {
  return `<svg viewBox="0 0 100 100" width="${cellPx}" height="${cellPx}" class="aca-cell${cell ? '' : ' aca-missing'}">
    ${acaCellInnerMarkup(cell)}
  </svg>`;
}

function acaRenderMatrix(grid, cellPx, missingR, missingC) {
  const size = grid.length;
  const gap = 6;
  const unit = 100;
  const total = size * unit + (size - 1) * (gap * 100 / cellPx);
  let cells = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const x = c * (unit + gap * 100 / cellPx);
      const y = r * (unit + gap * 100 / cellPx);
      const isMissing = r === missingR && c === missingC;
      const inner = isMissing ? null : grid[r][c];
      cells += `<g transform="translate(${x},${y})">${acaCellInnerMarkup(inner)}</g>`;
    }
  }
  const display = size * cellPx + (size - 1) * gap;
  return `<svg viewBox="0 0 ${total} ${total}" width="${display}" height="${display}" class="aca-matrix" role="img" aria-label="진행행렬">${cells}</svg>`;
}

function acaRenderOption(cell, px) {
  return acaRenderCell(cell, px);
}

function acaMakeDistractors(correct, rng, ageId, count) {
  const rules = ACA_RULE_POOL[ageId];
  const distractors = [];
  const seen = new Set([acaCellSignature(correct)]);

  const attempts = [
    () => acaApplyRule(acaPick(rng, rules), correct, rng, ageId),
    () => {
      const c = acaCloneCell(correct);
      if (c.elements[0]) c.elements[0].rotation = (c.elements[0].rotation + 90) % 360;
      return c;
    },
    () => {
      const c = acaCloneCell(correct);
      if (c.elements[0]) c.elements[0].color = acaPick(rng, ACA_PALETTES[ageId]);
      return c;
    },
    () => {
      const c = acaCloneCell(correct);
      c.elements.forEach(e => { e.size = Math.max(0.12, e.size - 0.1); });
      return c;
    },
    () => {
      const c = acaCloneCell(correct);
      if (c.elements.length > 1) c.elements = [c.elements[0]];
      return c;
    },
    () => acaApplyRule('flipH', correct, rng, ageId),
    () => acaApplyRule('flipV', correct, rng, ageId)
  ];

  let guard = 0;
  while (distractors.length < count - 1 && guard < 80) {
    guard++;
    const fn = acaPick(rng, attempts);
    const d = fn();
    const sig = acaCellSignature(d);
    if (!seen.has(sig)) {
      seen.add(sig);
      distractors.push(d);
    }
  }

  while (distractors.length < count - 1) {
    const d = acaRandomCell(rng, ageId);
    const sig = acaCellSignature(d);
    if (!seen.has(sig)) {
      seen.add(sig);
      distractors.push(d);
    }
  }

  return distractors;
}

function acaGenerateMatrixQuestion(ageId, tier, seq, baseSeed) {
  const level = ACA_LEVELS[ageId];
  const tierInfo = ACA_TIERS.find(t => t.tier === tier);
  const rng = acaMulberry32(baseSeed + seq * 7919 + tier * 104729);
  const size = tier === 1 && level.matrixSize === 2 ? 2 : level.matrixSize;
  const pool = ACA_RULE_POOL[ageId];
  const [dMin, dMax] = tierInfo.difficultyRange;
  const difficulty = dMin + Math.floor(rng() * (dMax - dMin + 1));

  for (let attempt = 0; attempt < 40; attempt++) {
    const rowRule = acaPick(rng, pool);
    let colRule = acaPick(rng, pool.filter(r => r !== rowRule || pool.length < 3));
    if (tier >= 3 && rng() > 0.4) colRule = rowRule;

    const seedCell = acaRandomCell(rng, ageId);
    const grid = acaBuildGrid(size, rowRule, colRule, seedCell, rng, ageId);
    if (!grid) continue;

    const mr = size - 1;
    const mc = size - 1;
    const correctCell = acaCloneCell(grid[mr][mc]);
    grid[mr][mc] = null;

    const optionCells = [correctCell, ...acaMakeDistractors(correctCell, rng, ageId, level.optionCount)];
    const shuffled = shuffleArray(optionCells.map((cell, i) => ({ cell, i })));
    const options = shuffled.map(x => x.cell);
    const answer = shuffled.findIndex(x => x.i === 0);

    const matrixSvg = acaRenderMatrix(grid, size === 2 ? 72 : 64, mr, mc);
    const optionSvgs = options.map(c => acaRenderOption(c, size === 2 ? 56 : 50));

    const domain = tier >= 4 ? 'abstract' : (ACA_RULE_DOMAINS[rowRule] || 'matrix');
    const ruleLabel = tier >= 3 ? `${rowRule}+${colRule}` : rowRule;

    return enrichQuestionIRT({
      id: `aca-${ageId}-${baseSeed}-${seq}`,
      type: 'matrix',
      ageId,
      tier,
      tierLabel: tierInfo.label,
      domain,
      difficulty,
      ruleTypes: [rowRule, colRule],
      text: '빈 칸에 들어갈 도형을 고르세요.',
      matrixSvg,
      options: optionSvgs,
      answer,
      timeLimitSec: 25 + difficulty * 4,
      discrimination: 0.85 + difficulty * 0.06,
      ability: domain
    });
  }

  return acaGenerateMatrixQuestion(ageId, tier, seq + 1000, baseSeed + 1);
}
