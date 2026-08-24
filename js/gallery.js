/**
 * Stage 5: Archived Memories Photo Gallery & Lightbox
 */
class GalleryManager {
  constructor() {
    this.lightbox = document.getElementById('lightbox-modal');
    this.lightboxClose = document.getElementById('lightbox-close-btn');
    this.lightboxBackdrop = document.getElementById('lightbox-backdrop');
    this.lightboxMedia = document.getElementById('lightbox-media-container');
    this.lightboxCaption = document.getElementById('lightbox-caption');
    this.localPhotoInput = document.getElementById('local-photo-input');
    this.replayButton = document.getElementById('btn-replay-chaos');

    this.init();
  }

  init() {
    // Polaroid click inspection
    const cards = document.querySelectorAll('.polaroid-card');
    cards.forEach(card => {
      card.addEventListener('click', () => this.openLightbox(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.openLightbox(card);
        }
      });
    });

    if (this.lightboxClose) {
      this.lightboxClose.addEventListener('click', () => this.closeLightbox());
    }
    if (this.lightboxBackdrop) {
      this.lightboxBackdrop.addEventListener('click', () => this.closeLightbox());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.lightbox && this.lightbox.classList.contains('active')) {
        this.closeLightbox();
      }
    });

    // Custom local photos input
    if (this.localPhotoInput) {
      this.localPhotoInput.addEventListener('change', (e) => this.handleLocalPhotos(e));
    }

    // Replay button
    if (this.replayButton) {
      this.replayButton.addEventListener('click', () => {
        window.StageRouter.resetAll();
      });
    }
  }

  openLightbox(card) {
    if (!this.lightbox || !this.lightboxMedia) return;

    const caption = card.getAttribute('data-caption') || 'Archived File';
    const img = card.querySelector('.polaroid-img');
    const placeholder = card.querySelector('.photo-placeholder-tile');

    this.lightboxMedia.innerHTML = '';

    if (img && img.style.display !== 'none' && img.complete && img.naturalWidth > 0) {
      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.alt = caption;
      this.lightboxMedia.appendChild(fullImg);
    } else if (placeholder) {
      const clonedPlaceholder = placeholder.cloneNode(true);
      clonedPlaceholder.style.width = '360px';
      clonedPlaceholder.style.height = '280px';
      clonedPlaceholder.style.display = 'flex';
      this.lightboxMedia.appendChild(clonedPlaceholder);
    }

    if (this.lightboxCaption) {
      this.lightboxCaption.textContent = caption;
    }

    this.lightbox.classList.add('active');
    this.lightbox.setAttribute('aria-hidden', 'false');
  }

  closeLightbox() {
    if (!this.lightbox) return;
    this.lightbox.classList.remove('active');
    this.lightbox.setAttribute('aria-hidden', 'true');
  }

  handleLocalPhotos(e) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const wrappers = [
      document.getElementById('photo-wrapper-1'),
      document.getElementById('photo-wrapper-2'),
      document.getElementById('photo-wrapper-3'),
      document.getElementById('photo-wrapper-4')
    ];

    Array.from(files).forEach((file, index) => {
      if (index >= wrappers.length) return;
      const wrapper = wrappers[index];
      if (!wrapper) return;

      const img = wrapper.querySelector('.polaroid-img');
      const placeholder = wrapper.querySelector('.photo-placeholder-tile');
      const reader = new FileReader();

      reader.onload = (event) => {
        if (img) {
          img.src = event.target.result;
          img.style.display = 'block';
          if (placeholder) placeholder.style.display = 'none';
        }
      };

      reader.readAsDataURL(file);
    });

    if (window.ParticleEngine) {
      window.ParticleEngine.fireConfetti({ count: 50 });
    }
  }
}

window.GalleryManager = new GalleryManager();
