/**
 * js/particles.js — Seasonal particle animation system
 * Landing/marketing pages only. Never used in canvas tool (distraction risk).
 *
 * Seasons:
 *   spring  — dandelion seeds drifting on the breeze
 *   summer  — bees and butterflies wandering
 *   autumn  — leaves tumbling down
 *   winter  — detailed six-armed snowflakes
 *
 * Usage:
 *   import { startParticles, stopParticles, resizeParticleCanvas } from './js/particles.js';
 *   startParticles(canvasEl, 'spring');
 *   stopParticles();
 */

let animFrame = null;
let particles  = [];
let ctx        = null;
let W = 0, H = 0;

// ── Butterfly colour pairs (upper wing, lower wing) ────────────────────────
const BFY_COLS = [
  ['#e84393', '#c01070'],
  ['#f97316', '#c04a00'],
  ['#3b82f6', '#1d4ed8'],
  ['#a855f7', '#7c3aed'],
  ['#f59e0b', '#b45309'],
];

// ── Draw helpers ────────────────────────────────────────────────────────────

/** Spring — dandelion seed: fluffy pappus at top, thin stem, small seed below */
function drawDandelionSeed(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;

  const sz      = p.size;
  const stemLen = sz * 1.6;
  const spokeR  = sz * 1.1;
  const n       = p.spokeCount;

  // Stem
  ctx.strokeStyle = 'rgba(210,190,140,0.8)';
  ctx.lineWidth   = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(0, stemLen);
  ctx.stroke();

  // Seed (small oval at base of stem)
  ctx.fillStyle = 'rgba(170,140,90,0.9)';
  ctx.beginPath();
  ctx.ellipse(0, stemLen, sz * 0.22, sz * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pappus spokes radiating from (0, 0)
  ctx.strokeStyle = 'rgba(255,255,255,0.88)';
  ctx.lineWidth   = 0.65;
  for (let i = 0; i < n; i++) {
    const a  = (i / n) * Math.PI * 2;
    const ex = Math.cos(a) * spokeR;
    const ey = Math.sin(a) * spokeR;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(ex, ey);
    ctx.stroke();
    // Tip dot
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(ex, ey, 1.4, 0, Math.PI * 2);
    ctx.fill();
  }

  // Hub dot
  ctx.fillStyle = 'rgba(230,210,160,0.85)';
  ctx.beginPath();
  ctx.arc(0, 0, sz * 0.15, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Summer — bee with striped body and translucent flapping wings */
function drawBee(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;

  const sz      = p.size;
  const flap    = Math.abs(Math.sin(p.wingPhase)); // 0 → 1

  // Wings (translucent, scale-Y to flap)
  ctx.save();
  ctx.scale(1, flap * 0.85 + 0.15);
  ctx.fillStyle = 'rgba(210,235,255,0.55)';
  ctx.beginPath();
  ctx.ellipse(-sz * 0.85, -sz * 0.3, sz * 0.75, sz * 0.38, -0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse( sz * 0.85, -sz * 0.3, sz * 0.75, sz * 0.38,  0.25, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Body — yellow oval
  ctx.fillStyle = '#f9c22e';
  ctx.beginPath();
  ctx.ellipse(0, 0, sz * 0.42, sz * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  // Black stripes
  ctx.fillStyle = 'rgba(20,10,5,0.72)';
  [-0.45, 0, 0.45].forEach(oy => {
    ctx.beginPath();
    ctx.ellipse(0, oy * sz, sz * 0.42, sz * 0.14, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  // Head
  ctx.fillStyle = '#1a0d00';
  ctx.beginPath();
  ctx.arc(0, -sz * 0.8, sz * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Summer — butterfly with bezier wings that flap by scaling X */
function drawButterfly(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;

  const sz   = p.size;
  const open = Math.abs(Math.sin(p.wingPhase)); // 0 (folded) → 1 (open)

  // Left wings
  ctx.save();
  ctx.scale(open, 1);
  ctx.fillStyle = p.colour;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-sz * 1.6, -sz * 1.1, -sz * 2.1, sz * 0.15, 0, sz * 0.35);
  ctx.fill();
  ctx.fillStyle = p.colour2;
  ctx.beginPath();
  ctx.moveTo(0, sz * 0.2);
  ctx.bezierCurveTo(-sz * 1.2, sz * 0.45, -sz * 1.35, sz * 1.45, 0, sz * 1.05);
  ctx.fill();
  ctx.restore();

  // Right wings (mirror)
  ctx.save();
  ctx.scale(-open, 1);
  ctx.fillStyle = p.colour;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-sz * 1.6, -sz * 1.1, -sz * 2.1, sz * 0.15, 0, sz * 0.35);
  ctx.fill();
  ctx.fillStyle = p.colour2;
  ctx.beginPath();
  ctx.moveTo(0, sz * 0.2);
  ctx.bezierCurveTo(-sz * 1.2, sz * 0.45, -sz * 1.35, sz * 1.45, 0, sz * 1.05);
  ctx.fill();
  ctx.restore();

  // Body
  ctx.fillStyle = '#1a0d00';
  ctx.beginPath();
  ctx.ellipse(0, sz * 0.45, sz * 0.14, sz * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

/** Autumn — leaf shape with midrib and side veins */
function drawLeaf(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;

  const s = p.size;

  // Leaf body
  ctx.fillStyle = p.colour;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.bezierCurveTo( s * 0.88, -s * 0.4,  s * 0.88,  s * 0.4, 0,  s);
  ctx.bezierCurveTo(-s * 0.88,  s * 0.4, -s * 0.88, -s * 0.4, 0, -s);
  ctx.fill();

  // Midrib
  ctx.strokeStyle = 'rgba(0,0,0,0.18)';
  ctx.lineWidth   = 0.9;
  ctx.beginPath();
  ctx.moveTo(0, -s);
  ctx.lineTo(0,  s);
  ctx.stroke();

  // Side veins (3 pairs)
  ctx.lineWidth = 0.5;
  [0.35, 0.55, 0.72].forEach(t => {
    const y = -s + t * s * 2;
    const vl = s * (0.6 - t * 0.4);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(-vl, y - s * 0.2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo( vl, y - s * 0.2);
    ctx.stroke();
  });

  ctx.restore();
}

/** Winter — six-armed snowflake with branching arms */
function drawSnowflake(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.globalAlpha = p.alpha;
  ctx.strokeStyle = p.colour;
  ctx.lineCap     = 'round';

  const sz = p.size;

  for (let i = 0; i < 6; i++) {
    ctx.save();
    ctx.rotate((i / 6) * Math.PI * 2);

    // Main arm
    ctx.lineWidth = 1.1;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -sz);
    ctx.stroke();

    // Tip crossbar
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(-sz * 0.22, -sz * 0.84);
    ctx.lineTo( sz * 0.22, -sz * 0.84);
    ctx.stroke();

    // Branch pair at 60 %
    const b1Y  = -sz * 0.58;
    const b1L  = sz * 0.28;
    ctx.beginPath();
    ctx.moveTo(0, b1Y);
    ctx.lineTo(-b1L, b1Y - b1L * 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, b1Y);
    ctx.lineTo( b1L, b1Y - b1L * 0.55);
    ctx.stroke();

    // Branch pair at 35 %
    const b2Y = -sz * 0.33;
    const b2L = sz * 0.18;
    ctx.beginPath();
    ctx.moveTo(0, b2Y);
    ctx.lineTo(-b2L, b2Y - b2L * 0.55);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, b2Y);
    ctx.lineTo( b2L, b2Y - b2L * 0.55);
    ctx.stroke();

    ctx.restore();
  }

  // Centre dot
  ctx.fillStyle = p.colour;
  ctx.beginPath();
  ctx.arc(0, 0, sz * 0.13, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// ── Config table ─────────────────────────────────────────────────────────────

const AUTUMN_COLS = ['#c0392b','#e67e22','#f39c12','#d35400','#a04000','#8b6914','#6b3a1f'];
const WINTER_COLS = ['#ffffff','#e8f4ff','#cce4f7','#e0eeff'];

const CONFIGS = {

  // ── Spring — dandelion seeds ────────────────────────────────────────────
  spring: {
    count: 35,
    create() {
      return {
        x:          Math.random() * W,
        y:          Math.random() * H,
        size:       5 + Math.random() * 5,
        spokeCount: 10 + Math.floor(Math.random() * 6),
        vx:         (Math.random() - 0.5) * 0.5,
        vy:         0.45 + Math.random() * 0.8,
        rot:        Math.random() * Math.PI * 2,
        rotV:       (Math.random() - 0.5) * 0.022,
        sway:       Math.random() * Math.PI * 2,
        swaySpeed:  0.008 + Math.random() * 0.015,
        alpha:      0.5 + Math.random() * 0.45
      };
    },
    update(p) {
      p.sway += p.swaySpeed;
      p.x   += p.vx + Math.sin(p.sway) * 0.65;
      p.y   += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 50) { p.y = -50; p.x = Math.random() * W; }
    },
    draw: drawDandelionSeed
  },

  // ── Summer — bees + butterflies ────────────────────────────────────────
  summer: {
    count: 20,
    create() {
      const isBee = Math.random() < 0.45;
      const base  = {
        x:           Math.random() * W,
        y:           Math.random() * H,
        vx:          (Math.random() - 0.5) * 0.85,
        vy:          (Math.random() - 0.5) * 0.85,
        rot:         Math.random() * Math.PI * 2,
        wingPhase:   Math.random() * Math.PI * 2,
        wingSpeed:   isBee ? (0.16 + Math.random() * 0.14) : (0.07 + Math.random() * 0.05),
        alpha:       0.7 + Math.random() * 0.25,
        sway:        Math.random() * Math.PI * 2,
        swaySpeed:   0.014 + Math.random() * 0.022,
        changeTimer: 60 + Math.floor(Math.random() * 120)
      };
      if (isBee) {
        return { ...base, type: 'bee', size: 5 + Math.random() * 4 };
      }
      const cp = BFY_COLS[Math.floor(Math.random() * BFY_COLS.length)];
      return { ...base, type: 'butterfly', size: 6 + Math.random() * 5, colour: cp[0], colour2: cp[1] };
    },
    update(p) {
      p.wingPhase   += p.wingSpeed;
      p.sway        += p.swaySpeed;
      p.changeTimer--;
      if (p.changeTimer <= 0) {
        p.vx          = (Math.random() - 0.5) * 0.85;
        p.vy          = (Math.random() - 0.5) * 0.85;
        p.rot         = Math.atan2(p.vy, p.vx) + Math.PI / 2;
        p.changeTimer = 80 + Math.floor(Math.random() * 120);
      }
      p.x += p.vx + Math.sin(p.sway) * 0.3;
      p.y += p.vy;
      // Wrap at edges
      if (p.x < -50)  p.x = W + 50;
      if (p.x > W+50) p.x = -50;
      if (p.y < -50)  p.y = H + 50;
      if (p.y > H+50) p.y = -50;
    },
    draw(p) {
      if (p.type === 'bee') drawBee(p); else drawButterfly(p);
    }
  },

  // ── Autumn — falling leaves ─────────────────────────────────────────────
  autumn: {
    count: 30,
    create() {
      return {
        x:         Math.random() * W,
        y:         Math.random() * -H,
        size:      8 + Math.random() * 9,
        vx:        (Math.random() - 0.5) * 1.0,
        vy:        1.0 + Math.random() * 1.5,
        rot:       Math.random() * Math.PI * 2,
        rotV:      (Math.random() - 0.5) * 0.07,
        sway:      Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.013,
        alpha:     0.55 + Math.random() * 0.4,
        colour:    AUTUMN_COLS[Math.floor(Math.random() * AUTUMN_COLS.length)]
      };
    },
    update(p) {
      p.sway += p.swaySpeed;
      p.x   += p.vx + Math.sin(p.sway) * 1.0;
      p.y   += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    },
    draw: drawLeaf
  },

  // ── Winter — crystalline snowflakes ────────────────────────────────────
  winter: {
    count: 45,
    create() {
      return {
        x:         Math.random() * W,
        y:         Math.random() * -H,
        size:      6 + Math.random() * 10,
        vx:        (Math.random() - 0.5) * 0.4,
        vy:        0.45 + Math.random() * 0.85,
        rot:       Math.random() * Math.PI * 2,
        rotV:      (Math.random() - 0.5) * 0.011,
        sway:      Math.random() * Math.PI * 2,
        swaySpeed: 0.006 + Math.random() * 0.01,
        alpha:     0.45 + Math.random() * 0.5,
        colour:    WINTER_COLS[Math.floor(Math.random() * WINTER_COLS.length)]
      };
    },
    update(p) {
      p.sway += p.swaySpeed;
      p.x   += p.vx + Math.sin(p.sway) * 0.35;
      p.y   += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    },
    draw: drawSnowflake
  }
};

// ── Animation loop ───────────────────────────────────────────────────────────

function tick() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    CONFIGS[p._season].update(p);
    CONFIGS[p._season].draw(p);
  }
  animFrame = requestAnimationFrame(tick);
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Start particle animation on a given canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {string} season — 'spring'|'summer'|'autumn'|'winter'
 */
export function startParticles(canvas, season) {
  stopParticles();
  if (!CONFIGS[season]) return;

  ctx = canvas.getContext('2d');
  W   = canvas.width;
  H   = canvas.height;

  const cfg = CONFIGS[season];
  particles = Array.from({ length: cfg.count }, () => {
    const p    = cfg.create();
    p._season  = season;
    return p;
  });

  tick();
}

/**
 * Stop the animation and clear the canvas.
 */
export function stopParticles() {
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  if (ctx)       { ctx.clearRect(0, 0, W, H); }
  particles = [];
  ctx       = null;
}

/**
 * Resize the particle canvas to match its container.
 * Call on window resize.
 * @param {HTMLCanvasElement} canvas
 */
export function resizeParticleCanvas(canvas) {
  canvas.width  = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  W = canvas.width;
  H = canvas.height;
}
