/**
 * js/particles.js — Seasonal particle animation system
 * Landing/marketing pages only. Never used in canvas tool (distraction risk).
 *
 * Usage:
 *   import { startParticles, stopParticles } from './js/particles.js';
 *   startParticles(canvasEl, 'spring');  // 'spring'|'summer'|'autumn'|'winter'
 *   stopParticles();
 */

let animFrame = null;
let particles = [];
let ctx = null;
let W = 0, H = 0;

const CONFIGS = {
  spring: {
    count: 40,
    colours: ['#f9c6d0','#fde8ec','#f48fb1','#ffffff','#f8bbd9'],
    create(i) {
      return {
        x: Math.random() * W,
        y: Math.random() * -H,
        r: 4 + Math.random() * 5,
        rx: 2 + Math.random() * 3,       // ellipse x radius (petal shape)
        ry: 4 + Math.random() * 6,       // ellipse y radius
        vx: (Math.random() - 0.5) * 0.6,
        vy: 0.8 + Math.random() * 1.2,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.06,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.01 + Math.random() * 0.02,
        alpha: 0.5 + Math.random() * 0.5,
        colour: CONFIGS.spring.colours[Math.floor(Math.random() * CONFIGS.spring.colours.length)]
      };
    },
    update(p) {
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * 0.5;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    },
    draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.colour;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },

  summer: {
    count: 50,
    colours: ['#ffffff','#fffde7','#fff9c4','#e8f5e9','#b2dfdb'],
    create() {
      return {
        x: Math.random() * W,
        y: H + Math.random() * H,
        r: 1 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(0.5 + Math.random() * 1.0),
        alpha: 0,
        alphaTarget: 0.3 + Math.random() * 0.6,
        alphaV: 0.008 + Math.random() * 0.01,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.03 + Math.random() * 0.04,
        colour: CONFIGS.summer.colours[Math.floor(Math.random() * CONFIGS.summer.colours.length)]
      };
    },
    update(p) {
      p.x += p.vx;
      p.y += p.vy;
      p.pulse += p.pulseSpeed;
      p.alpha = p.alphaTarget * (0.5 + 0.5 * Math.sin(p.pulse));
      if (p.y < -20) { p.y = H + 10; p.x = Math.random() * W; }
    },
    draw(p) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.colour;
      ctx.shadowBlur = 4;
      ctx.shadowColor = p.colour;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  },

  autumn: {
    count: 30,
    colours: ['#c0392b','#e67e22','#f39c12','#d35400','#a04000','#8b6914'],
    create() {
      return {
        x: Math.random() * W,
        y: Math.random() * -H,
        size: 8 + Math.random() * 10,
        vx: (Math.random() - 0.5) * 1.2,
        vy: 1.0 + Math.random() * 1.5,
        rot: Math.random() * Math.PI * 2,
        rotV: (Math.random() - 0.5) * 0.08,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.015,
        alpha: 0.5 + Math.random() * 0.45,
        colour: CONFIGS.autumn.colours[Math.floor(Math.random() * CONFIGS.autumn.colours.length)]
      };
    },
    update(p) {
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * 1.2;
      p.y += p.vy;
      p.rot += p.rotV;
      if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
    },
    draw(p) {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.colour;
      // Simple leaf shape: two arcs
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo( s * 0.8, -s * 0.5,  s * 0.8,  s * 0.5, 0,  s);
      ctx.bezierCurveTo(-s * 0.8,  s * 0.5, -s * 0.8, -s * 0.5, 0, -s);
      ctx.fill();
      // Midrib
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(0, s);
      ctx.stroke();
      ctx.restore();
    }
  },

  winter: {
    count: 60,
    colours: ['#ffffff','#e3f2fd','#bbdefb','#e8eaf6'],
    create() {
      return {
        x: Math.random() * W,
        y: Math.random() * -H,
        r: 1.5 + Math.random() * 3.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: 0.6 + Math.random() * 1.0,
        sway: Math.random() * Math.PI * 2,
        swaySpeed: 0.008 + Math.random() * 0.012,
        alpha: 0.4 + Math.random() * 0.5,
        colour: CONFIGS.winter.colours[Math.floor(Math.random() * CONFIGS.winter.colours.length)]
      };
    },
    update(p) {
      p.sway += p.swaySpeed;
      p.x += p.vx + Math.sin(p.sway) * 0.4;
      p.y += p.vy;
      if (p.y > H + 10) { p.y = -10; p.x = Math.random() * W; }
    },
    draw(p) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.colour;
      ctx.shadowBlur = 2;
      ctx.shadowColor = '#fff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
};

function tick() {
  ctx.clearRect(0, 0, W, H);
  for (const p of particles) {
    CONFIGS[p._season].update(p);
    CONFIGS[p._season].draw(p);
  }
  animFrame = requestAnimationFrame(tick);
}

/**
 * Start particle animation on a given canvas element.
 * @param {HTMLCanvasElement} canvas
 * @param {string} season — 'spring'|'summer'|'autumn'|'winter'
 */
export function startParticles(canvas, season) {
  stopParticles();
  if (!CONFIGS[season]) return;

  ctx = canvas.getContext('2d');
  W = canvas.width;
  H = canvas.height;

  const cfg = CONFIGS[season];
  particles = Array.from({ length: cfg.count }, (_, i) => {
    const p = cfg.create(i);
    p._season = season;
    return p;
  });

  tick();
}

/**
 * Stop the animation and clear the canvas.
 */
export function stopParticles() {
  if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
  if (ctx) { ctx.clearRect(0, 0, W, H); }
  particles = [];
  ctx = null;
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
