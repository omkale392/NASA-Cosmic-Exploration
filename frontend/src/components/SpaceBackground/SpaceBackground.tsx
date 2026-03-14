import { useEffect, useRef } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  phase: number;       // sine wave phase offset
  speed: number;       // twinkle speed
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  state: 'fadein' | 'travel' | 'fadeout';
  life: number;        // frames elapsed
  maxLife: number;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vx: number;         // horizontal wobble velocity
  vy: number;         // upward drift velocity
  opacity: number;
  wobblePhase: number;
  wobbleSpeed: number;
}

interface Nebula {
  x: number;          // 0-1 fraction of canvas width
  y: number;          // 0-1 fraction of canvas height
  radius: number;     // 0-1 fraction of canvas width
  color: string;
  baseOpacity: number;
  phase: number;
  speed: number;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const STAR_COUNT = 200;
const PARTICLE_COUNT = 30;
const SHOOT_INTERVAL_MIN = 4000;
const SHOOT_INTERVAL_MAX = 8000;

const NEBULAE: Omit<Nebula, 'phase' | 'speed'>[] = [
  { x: 0.15, y: 0.25, radius: 0.35, color: '30,20,80',  baseOpacity: 0.08 },
  { x: 0.75, y: 0.15, radius: 0.30, color: '0,60,120',  baseOpacity: 0.06 },
  { x: 0.85, y: 0.70, radius: 0.38, color: '60,10,100', baseOpacity: 0.10 },
  { x: 0.30, y: 0.80, radius: 0.28, color: '0,40,90',   baseOpacity: 0.07 },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function initStars(w: number, h: number): Star[] {
  return Array.from({ length: STAR_COUNT }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    size: rand(0.5, 2.5),
    opacity: rand(0.3, 1.0),
    phase: rand(0, Math.PI * 2),
    speed: rand(0.005, 0.025),
  }));
}

function initParticles(w: number, h: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    size: rand(1, 4),
    vx: 0,
    vy: rand(0.1, 0.4),
    opacity: rand(0.1, 0.4),
    wobblePhase: rand(0, Math.PI * 2),
    wobbleSpeed: rand(0.01, 0.03),
  }));
}

function initNebulae(): Nebula[] {
  return NEBULAE.map((n) => ({
    ...n,
    phase: rand(0, Math.PI * 2),
    speed: rand(0.003, 0.008),
  }));
}

function spawnShootingStar(w: number, h: number): ShootingStar {
  const angle = rand(Math.PI * 0.1, Math.PI * 0.4); // downward-right diagonal
  const speed = rand(6, 14);
  return {
    x: rand(0, w * 0.7),
    y: rand(0, h * 0.4),
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    length: rand(80, 180),
    opacity: 0,
    state: 'fadein',
    life: 0,
    maxLife: rand(40, 80),
  };
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const frameRef = useRef<number>(0);
  const shootTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // ── Resize ──────────────────────────────────────────────────────────────
    let W = 0, H = 0;
    let stars: Star[] = [];
    let particles: Particle[] = [];
    const nebulae: Nebula[] = initNebulae();
    const shootingStars: ShootingStar[] = [];

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas!.width = W;
      canvas!.height = H;
      stars = initStars(W, H);
      particles = initParticles(W, H);
    }

    resize();

    // ── Mouse Parallax ───────────────────────────────────────────────────────
    function onMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    // ── Shooting Star Scheduler ──────────────────────────────────────────────
    function scheduleShoot() {
      shootTimerRef.current = setTimeout(() => {
        shootingStars.push(spawnShootingStar(W, H));
        scheduleShoot();
      }, rand(SHOOT_INTERVAL_MIN, SHOOT_INTERVAL_MAX));
    }

    scheduleShoot();

    // ── Animation Loop ───────────────────────────────────────────────────────
    let t = 0;

    function draw() {
      frameRef.current = requestAnimationFrame(draw);
      ctx!.clearRect(0, 0, W, H);
      t += 1;

      const mx = mouseRef.current.x / W - 0.5; // -0.5 to 0.5
      const my = mouseRef.current.y / H - 0.5;

      // ── Layer 2: Nebula ────────────────────────────────────────────────────
      ctx!.save();
      ctx!.globalCompositeOperation = 'screen';
      for (const neb of nebulae) {
        const pulse = neb.baseOpacity + Math.sin(t * neb.speed + neb.phase) * 0.03;
        const cx = neb.x * W + mx * 20;
        const cy = neb.y * H + my * 20;
        const r = neb.radius * W;
        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, r);
        grad.addColorStop(0, `rgba(${neb.color},${Math.min(pulse, 0.12)})`);
        grad.addColorStop(1, `rgba(${neb.color},0)`);
        ctx!.fillStyle = grad;
        ctx!.beginPath();
        ctx!.arc(cx, cy, r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.restore();

      // ── Layer 1: Stars ─────────────────────────────────────────────────────
      for (const star of stars) {
        const twinkle = star.opacity * (0.6 + 0.4 * Math.sin(t * star.speed + star.phase));
        const px = star.x + mx * star.size * 4;
        const py = star.y + my * star.size * 4;
        ctx!.beginPath();
        ctx!.arc(px, py, star.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(255,255,255,${twinkle.toFixed(3)})`;
        ctx!.fill();
      }

      // ── Layer 3: Shooting Stars ────────────────────────────────────────────
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const s = shootingStars[i];
        s.life += 1;

        const fadeFrames = 10;
        if (s.state === 'fadein') {
          s.opacity = Math.min(1, s.life / fadeFrames);
          if (s.opacity >= 1) s.state = 'travel';
        } else if (s.state === 'travel') {
          if (s.life >= s.maxLife) s.state = 'fadeout';
        } else {
          s.opacity -= 0.05;
          if (s.opacity <= 0) {
            shootingStars.splice(i, 1);
            continue;
          }
        }

        // Draw gradient tail
        const tailX = s.x - (s.vx / Math.hypot(s.vx, s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.hypot(s.vx, s.vy)) * s.length;
        const grad = ctx!.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `rgba(255,255,255,0)`);
        grad.addColorStop(1, `rgba(255,255,255,${s.opacity.toFixed(3)})`);
        ctx!.beginPath();
        ctx!.moveTo(tailX, tailY);
        ctx!.lineTo(s.x, s.y);
        ctx!.strokeStyle = grad;
        ctx!.lineWidth = 1.5;
        ctx!.stroke();

        s.x += s.vx;
        s.y += s.vy;

        // Cull off-screen
        if (s.x > W + 200 || s.y > H + 200) {
          shootingStars.splice(i, 1);
        }
      }

      // ── Layer 4: Particles ─────────────────────────────────────────────────
      for (const p of particles) {
        p.wobblePhase += p.wobbleSpeed;
        p.x += Math.sin(p.wobblePhase) * 0.4;
        p.y -= p.vy;

        // Wrap top → bottom
        if (p.y < -p.size) p.y = H + p.size;
        // Wrap sides
        if (p.x < -p.size) p.x = W + p.size;
        if (p.x > W + p.size) p.x = -p.size;

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(0,212,255,${p.opacity.toFixed(3)})`;
        ctx!.fill();
      }
    }

    draw();

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(frameRef.current);
      if (shootTimerRef.current) clearTimeout(shootTimerRef.current);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
