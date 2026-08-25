/**
 * Temporal Lock Countdown Engine
 * Locks the website until 12 September 2026 00:00:00 (Local / IST Time)
 * Automatically unlocks on arrival.
 */
class CountdownManager {
  constructor() {
    this.lockScreen = document.getElementById('lock-screen');
    this.daysEl = document.getElementById('timer-days');
    this.hoursEl = document.getElementById('timer-hours');
    this.minutesEl = document.getElementById('timer-minutes');
    this.secondsEl = document.getElementById('timer-seconds');

    // 12 September 2026 00:00:00 Local / IST
    this.targetDate = new Date(2025, 8, 12, 0, 0, 0).getTime();
    this.timerInterval = null;
    this.isUnlocked = false;

    this.init();
  }

  init() {
    // Check if target date is already reached or programmatic test bypass is set
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('bypass') === 'true') {
      this.unlockSite(false);
      return;
    }

    // Already unlocked earlier this session (e.g. page was reloaded after unlock)
    if (sessionStorage.getItem('prk_unlocked') === 'true') {
      this.unlockSite(false);
      return;
    }

    this.startTicker();
  }

  startTicker() {
    this.updateTime();
    this.timerInterval = setInterval(() => {
      this.updateTime();
    }, 1000);
  }

  updateTime() {
    const now = new Date().getTime();
    const distance = this.targetDate - now;

    if (distance <= 0) {
      // Target reached: 12/9/2026 00:00:00
      clearInterval(this.timerInterval);
      this.unlockSite(true);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (this.daysEl) this.daysEl.textContent = String(days).padStart(2, '0');
    if (this.hoursEl) this.hoursEl.textContent = String(hours).padStart(2, '0');
    if (this.minutesEl) this.minutesEl.textContent = String(minutes).padStart(2, '0');
    if (this.secondsEl) this.secondsEl.textContent = String(seconds).padStart(2, '0');
  }

  unlockSite(withCelebration = true) {
    if (this.isUnlocked) return;
    this.isUnlocked = true;
    clearInterval(this.timerInterval);
    sessionStorage.setItem('prk_unlocked', 'true');

    if (this.lockScreen) {
      this.lockScreen.classList.add('unlocked');
      setTimeout(() => {
        this.lockScreen.style.display = 'none';
      }, 600);
    }

    // Launch Stage 1 Boot Sequence
    if (window.StageRouter) {
      window.StageRouter.goToStage(1);
    }

    if (withCelebration && window.ParticleEngine) {
      window.ParticleEngine.fireConfetti({ count: 120 });
      window.ParticleEngine.fireRoyalCrowns();
    }
  }
}

window.CountdownLock = new CountdownManager();
