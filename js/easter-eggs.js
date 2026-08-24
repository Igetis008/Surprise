/**
 * Easter Eggs & Secret Cleared Interactions
 */
class EasterEggManager {
  constructor() {
    this.modal = document.getElementById('easter-modal');
    this.modalTitle = document.getElementById('easter-title');
    this.modalMsg = document.getElementById('easter-message');
    this.modalClose = document.getElementById('easter-close-btn');
    this.modalOk = document.getElementById('easter-ok-btn');
    this.restrictedBtn = document.getElementById('easter-egg-btn');

    this.princeClickCount = 0;
    this.princeClickTimer = null;
    this.typedKeys = [];
    this.secretWord = 'prince';

    this.init();
  }

  init() {
    // 1. DO NOT CLICK button
    if (this.restrictedBtn) {
      this.restrictedBtn.addEventListener('click', () => this.handleRestrictedClick());
    }

    // Modal Close
    if (this.modalClose) this.modalClose.addEventListener('click', () => this.closeModal());
    if (this.modalOk) this.modalOk.addEventListener('click', () => this.closeModal());

    // 2. Click "Prince Charming" 5 times
    const princeTriggers = document.querySelectorAll('.prince-trigger');
    princeTriggers.forEach(el => {
      el.addEventListener('click', (e) => this.handlePrinceClick(e));
    });

    // 3. Typing 'prince' on keyboard
    window.addEventListener('keydown', (e) => this.handleKeySequence(e));
  }

  handleRestrictedClick() {
    const warnings = [
      "PROTOCOL OVERRIDE: Why did you click that? You never listen, do you? ⚠️",
      "SYSTEM ALARM: Smugness Index increased by +50. Close this immediately before Prakhar finds out.",
      "CRITICAL: Adulthood verification was almost revoked. Do not press that again! 😂"
    ];
    const msg = warnings[Math.floor(Math.random() * warnings.length)];
    this.openModal("RESTRICTED DIRECTIVE", msg);
  }

  handlePrinceClick(e) {
    this.princeClickCount++;
    clearTimeout(this.princeClickTimer);
    
    this.princeClickTimer = setTimeout(() => {
      this.princeClickCount = 0;
    }, 2000);

    if (this.princeClickCount >= 5) {
      this.princeClickCount = 0;
      if (window.ParticleEngine) {
        window.ParticleEngine.fireRoyalCrowns(e.clientX, e.clientY);
      }
      this.openModal(
        "👑 ROYAL CLEARANCE GRANTED",
        "Smugness levels have reached maximum capacity (999%). You are officially recognized as Supreme Prince Charming."
      );
    }
  }

  handleKeySequence(e) {
    if (['input', 'textarea'].includes(e.target.tagName.toLowerCase())) return;

    this.typedKeys.push(e.key.toLowerCase());
    if (this.typedKeys.length > 20) this.typedKeys.shift();

    const sequence = this.typedKeys.join('');
    if (sequence.includes(this.secretWord)) {
      this.typedKeys = [];
      if (window.ParticleEngine) {
        window.ParticleEngine.fireRoyalCrowns();
        window.ParticleEngine.fireConfetti({ count: 80 });
      }
      this.openModal(
        "⚡ CHEAT CODE ACTIVATED: 'PRINCE'",
        "All 18 years of mischief validated. Status: Absolute Legend. ❤️"
      );
    }
  }

  openModal(title, msg) {
    if (!this.modal) return;
    if (this.modalTitle) this.modalTitle.textContent = title;
    if (this.modalMsg) this.modalMsg.textContent = msg;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
  }

  closeModal() {
    if (!this.modal) return;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
  }
}

window.EasterEggEngine = new EasterEggManager();
