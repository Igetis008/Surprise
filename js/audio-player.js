/**
 * Audio Player with graceful degradation and silent fallback
 */
class AudioManager {
  constructor() {
    this.audioElement = document.getElementById('birthday-audio');
    this.toggleButton = document.getElementById('music-toggle-btn');
    this.musicBars = document.getElementById('music-bars');
    this.isPlaying = false;
    this.synthContext = null;
    this.synthInterval = null;

    this.init();
  }

  init() {
    if (!this.toggleButton) return;

    this.toggleButton.addEventListener('click', () => this.togglePlayback());

    if (this.audioElement) {
      this.audioElement.addEventListener('ended', () => {
        this.setPlayingState(false);
      });
      this.audioElement.addEventListener('error', (e) => {
        // Silent fail as requested - do not crash or show error
      });
    }
  }

  async togglePlayback() {
    if (this.isPlaying) {
      this.pause();
    } else {
      await this.play();
    }
  }

  async play() {
    try {
      if (this.audioElement && this.audioElement.src) {
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          await playPromise;
          this.setPlayingState(true);
          return;
        }
      }
    } catch (err) {
      // Audio file missing or blocked by browser policy -> fall back to ambient synthetic chime
      this.startSyntheticAmbience();
      this.setPlayingState(true);
    }
  }

  pause() {
    if (this.audioElement) {
      try { this.audioElement.pause(); } catch(e) {}
    }
    this.stopSyntheticAmbience();
    this.setPlayingState(false);
  }

  setPlayingState(playing) {
    this.isPlaying = playing;
    if (this.toggleButton) {
      this.toggleButton.classList.toggle('playing', playing);
      this.toggleButton.setAttribute('aria-pressed', playing ? 'true' : 'false');
    }
  }

  // Sweet gentle 8-bit birthday arpeggio chord fallback if mp3 is missing
  startSyntheticAmbience() {
    if (this.synthInterval) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.synthContext = new AudioCtx();
      
      const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25]; // C Major
      let step = 0;

      this.synthInterval = setInterval(() => {
        if (!this.synthContext || this.synthContext.state === 'closed') return;
        
        const osc = this.synthContext.createOscillator();
        const gain = this.synthContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(notes[step % notes.length], this.synthContext.currentTime);
        
        gain.gain.setValueAtTime(0.04, this.synthContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.synthContext.currentTime + 0.8);
        
        osc.connect(gain);
        gain.connect(this.synthContext.destination);
        
        osc.start();
        osc.stop(this.synthContext.currentTime + 0.8);
        
        step++;
      }, 500);
    } catch (e) {
      // Silent pass
    }
  }

  stopSyntheticAmbience() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
    if (this.synthContext) {
      try { this.synthContext.close(); } catch(e) {}
      this.synthContext = null;
    }
  }
}

window.BirthdayAudio = new AudioManager();
