/**
 * Stage 1: Terminal Boot Sequence
 */
class BootSequence {
  constructor() {
    this.logsContainer = document.getElementById('boot-logs');
    this.revealContainer = document.getElementById('boot-reveal');
    this.enterButton = document.getElementById('btn-enter-system');
    this.skipButton = document.getElementById('btn-skip-boot');

    this.messages = [
      { text: "INITIALIZING BIRTHDAY PROTOCOL...", prefix: "SYS::INIT", highlight: false },
      { text: "SCANNING SUBJECT...", prefix: "SYS::SCAN", highlight: false },
      { text: "SUBJECT IDENTIFIED.", prefix: "SYS::ID", highlight: false },
      { text: "AGE: 17 → 18", prefix: "SYS::STAT", highlight: true },
      { text: "ADULTHOOD STATUS: UNLOCKED", prefix: "SYS::LVL", highlight: true },
      { text: "COMMON SENSE: UNKNOWN", prefix: "SYS::WARN", highlight: false }
    ];

    this.isComplete = false;
    this.timeouts = [];

    this.init();
  }

  init() {
    if (this.enterButton) {
      this.enterButton.addEventListener('click', () => {
        window.StageRouter.goToStage(2);
      });
    }

    if (this.skipButton) {
      this.skipButton.addEventListener('click', () => {
        this.skip();
      });
    }
  }

  start() {
    this.reset();
    let delay = 350;

    this.messages.forEach((msg, index) => {
      const t = setTimeout(() => {
        this.appendLogLine(msg);
        if (index === this.messages.length - 1) {
          const finalT = setTimeout(() => this.showReveal(), 700);
          this.timeouts.push(finalT);
        }
      }, delay);
      this.timeouts.push(t);
      delay += 750;
    });
  }

  appendLogLine(msg) {
    if (!this.logsContainer) return;
    const line = document.createElement('div');
    line.className = 'log-line';
    line.innerHTML = `
      <span class="log-prefix">[${msg.prefix}]</span>
      <span class="log-content ${msg.highlight ? 'log-highlight' : ''}">${msg.text}</span>
    `;
    this.logsContainer.appendChild(line);
  }

  showReveal() {
    this.isComplete = true;
    if (this.revealContainer) this.revealContainer.style.display = 'block';
    if (this.enterButton) this.enterButton.style.display = 'inline-flex';
    if (this.skipButton) this.skipButton.style.display = 'none';

    if (window.ParticleEngine) {
      window.ParticleEngine.fireConfetti({ count: 40 });
    }
  }

  skip() {
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    if (!this.logsContainer) return;
    this.logsContainer.innerHTML = '';
    this.messages.forEach(msg => this.appendLogLine(msg));
    this.showReveal();
  }

  reset() {
    this.isComplete = false;
    this.timeouts.forEach(t => clearTimeout(t));
    this.timeouts = [];
    if (this.logsContainer) this.logsContainer.innerHTML = '';
    if (this.revealContainer) this.revealContainer.style.display = 'none';
    if (this.enterButton) this.enterButton.style.display = 'none';
    if (this.skipButton) this.skipButton.style.display = 'inline-flex';
  }
}

window.BootSequenceManager = new BootSequence();
