/**
 * Ambient Canvas Particle Network & Celebratory Confetti Engine
 */
class ParticleSystem {
  constructor() {
    this.canvas = document.getElementById('ambient-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.particles = [];
    this.confettiPieces = [];
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });

    if (!this.reducedMotion) {
      this.createAmbientParticles();
      this.animate();
    }
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  createAmbientParticles() {
    const count = Math.min(Math.floor(this.width / 24), 50);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 1.8 + 0.6,
        color: Math.random() > 0.6 ? '#f5af19' : (Math.random() > 0.5 ? '#e63956' : '#00f0ff'),
        alpha: Math.random() * 0.4 + 0.1,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }
  }

  fireConfetti(options = {}) {
    const count = options.count || 120;
    const colors = ['#f5af19', '#e63956', '#ff758f', '#ffffff', '#ffd166', '#00f0ff'];
    const originX = options.x !== undefined ? options.x : this.width / 2;
    const originY = options.y !== undefined ? options.y : this.height * 0.4;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 9 + 4;
      this.confettiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.18,
        drag: 0.96,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
        life: 1.0,
        decay: Math.random() * 0.008 + 0.004
      });
    }
  }

  fireRoyalCrowns(x, y) {
    const originX = x || this.width / 2;
    const originY = y || this.height / 2;
    const crowns = ['👑', '✨', '⭐', '💎', '🎉'];
    
    for (let i = 0; i < 24; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 7 + 3;
      this.confettiPieces.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        emoji: crowns[Math.floor(Math.random() * crowns.length)],
        size: Math.random() * 10 + 16,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 6,
        gravity: 0.14,
        drag: 0.97,
        shape: 'emoji',
        life: 1.0,
        decay: 0.007
      });
    }
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw ambient floating dust
    for (let p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.fill();
    }

    // Draw Confetti
    for (let i = this.confettiPieces.length - 1; i >= 0; i--) {
      const c = this.confettiPieces[i];
      c.x += c.vx;
      c.y += c.vy;
      c.vy += c.gravity;
      c.vx *= c.drag;
      c.rotation += c.rotationSpeed;
      c.life -= c.decay;

      if (c.life <= 0 || c.y > this.height + 50) {
        this.confettiPieces.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(c.x, c.y);
      this.ctx.rotate((c.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, c.life);

      if (c.shape === 'emoji') {
        this.ctx.font = `${c.size}px sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.fillText(c.emoji, 0, 0);
      } else if (c.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = c.color;
        this.ctx.fill();
      } else {
        this.ctx.fillStyle = c.color;
        this.ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      }

      this.ctx.restore();
    }

    this.ctx.globalAlpha = 1.0;
    requestAnimationFrame(() => this.animate());
  }
}

window.ParticleEngine = new ParticleSystem();
