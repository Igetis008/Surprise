/**
 * Audio Player: MITRAZ - Akhiyaan
 * Bulletproof Play / Pause Toggle & Autoplay on Website Open
 */
class AudioManager {
  constructor() {
    this.audioElement = document.getElementById('birthday-audio');
    this.toggleButton = document.getElementById('music-toggle-btn');
    this.gestureHandler = null;

    this.init();
  }

  init() {
    if (!this.audioElement) return;

    this.audioElement.volume = 0.9;

    // Directly bind state to native audio events
    this.audioElement.addEventListener('play', () => this.updateUI(true));
    this.audioElement.addEventListener('playing', () => this.updateUI(true));
    this.audioElement.addEventListener('pause', () => this.updateUI(false));
    this.audioElement.addEventListener('ended', () => this.updateUI(false));

    // Bind Button Click
    if (this.toggleButton) {
      this.toggleButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle();
      });
    }

    // Attempt direct autoplay
    this.tryPlay();

    // Attach passive one-time gesture unlock for browser policy, but NEVER trigger on toggle button itself
    this.gestureHandler = (e) => {
      if (e.target && (e.target.closest('#music-toggle-btn') || e.target.id === 'music-toggle-btn')) {
        this.removeGestureListeners();
        return;
      }
      if (this.audioElement && this.audioElement.paused) {
        this.tryPlay();
      }
      this.removeGestureListeners();
    };

    ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
      window.addEventListener(evt, this.gestureHandler, { passive: true });
    });
  }

  removeGestureListeners() {
    if (this.gestureHandler) {
      ['click', 'touchstart', 'touchend', 'keydown'].forEach(evt => {
        window.removeEventListener(evt, this.gestureHandler, { passive: true });
      });
      this.gestureHandler = null;
    }
  }

  tryPlay() {
    if (!this.audioElement) return;
    const playPromise = this.audioElement.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.updateUI(true);
      }).catch(() => {
        this.updateUI(false);
      });
    }
  }

  toggle() {
    if (!this.audioElement) return;
    this.removeGestureListeners();

    if (this.audioElement.paused) {
      this.audioElement.play().then(() => {
        this.updateUI(true);
      }).catch(err => {
        console.warn('Playback error:', err);
      });
    } else {
      this.audioElement.pause();
      this.updateUI(false);
    }
  }

  updateUI(isPlaying) {
    if (this.toggleButton) {
      this.toggleButton.classList.toggle('playing', isPlaying);
      this.toggleButton.classList.toggle('needs-tap', !isPlaying);
      this.toggleButton.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    }
  }
}

window.BirthdayAudio = new AudioManager();
