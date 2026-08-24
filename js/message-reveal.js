/**
 * Stage 4: Birthday Message Gradual Reveal
 */
class MessageReveal {
  constructor() {
    this.container = document.getElementById('letter-content');
    this.skipButton = document.getElementById('btn-skip-letter-anim');
    this.galleryButton = document.getElementById('btn-to-gallery');
    this.paragraphs = [];
    this.timeouts = [];
    this.isRevealed = false;

    this.init();
  }

  init() {
    if (this.skipButton) {
      this.skipButton.addEventListener('click', () => this.fastForward());
    }

    if (this.galleryButton) {
      this.galleryButton.addEventListener('click', () => {
        window.StageRouter.goToStage(5);
      });
    }
  }

  start() {
    this.reset();
    if (!this.container) return;

    this.paragraphs = Array.from(this.container.querySelectorAll('.letter-para'));
    let delay = 600;

    this.paragraphs.forEach((p, idx) => {
      const t = setTimeout(() => {
        p.classList.add('revealed');
        if (idx === this.paragraphs.length - 1) {
          const finalT = setTimeout(() => this.onComplete(), 600);
          this.timeouts.push(finalT);
        }
      }, delay);

      this.timeouts.push(t);
      delay += 1100;
    });
  }

  fastForward() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    if (!this.container) return;
    this.paragraphs = Array.from(this.container.querySelectorAll('.letter-para'));
    this.paragraphs.forEach(p => p.classList.add('revealed'));
    this.onComplete();
  }

  onComplete() {
    this.isRevealed = true;
    if (this.galleryButton) this.galleryButton.style.display = 'inline-flex';
    if (this.skipButton) this.skipButton.style.display = 'none';

    // Fire big celebratory confetti for unlocking adulthood
    if (window.ParticleEngine) {
      window.ParticleEngine.fireConfetti({ count: 160 });
    }
  }

  reset() {
    this.isRevealed = false;
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    if (this.container) {
      const paras = this.container.querySelectorAll('.letter-para');
      paras.forEach(p => p.classList.remove('revealed'));
    }
    if (this.galleryButton) this.galleryButton.style.display = 'none';
    if (this.skipButton) this.skipButton.style.display = 'inline-flex';
  }
}

window.MessageRevealManager = new MessageReveal();
