/**
 * Stage 3: Assessment Quiz Logic
 */
class QuizEngine {
  constructor() {
    this.card = document.getElementById('quiz-card');
    this.stepText = document.getElementById('quiz-step-text');
    this.progressBar = document.getElementById('quiz-progress-bar');
    this.badge = document.getElementById('quiz-badge');
    this.title = document.getElementById('quiz-question-title');
    this.optionsContainer = document.getElementById('quiz-options-container');
    this.feedbackBox = document.getElementById('quiz-feedback-box');
    this.feedbackText = document.getElementById('feedback-text');
    this.feedbackCode = document.getElementById('feedback-code');
    this.feedbackNextBtn = document.getElementById('btn-feedback-next');

    this.currentQuestionIndex = 0;
    this.autoAdvanceTimer = null;

    this.questions = [
      {
        id: 1,
        badge: "SECTION 3.1 // CLASSIFICATION",
        question: "The birthday subject is best described as:",
        options: [
          { text: "Completely normal human being", response: "ANALYSIS: Blatant falsehood detected. Subject is anything but ordinary." },
          { text: "Lowkey nerd pretending otherwise", response: "CONFIRMED: He really thinks he is hiding it. We all know." },
          { text: "Certified Prince Charming", response: "VERIFIED: Royal designation active. Smugness index rising." },
          { text: "Unfortunately, all of the above", response: "DIAGNOSIS: Accurate. A chaotic, charming, nerdy package." }
        ]
      },
      {
        id: 2,
        badge: "SECTION 3.2 // ARCHIVAL QUERY",
        question: "Historical records indicate that the subject was first called...",
        options: [
          { text: "Prince Charming", isCanonical: true, response: "HISTORICAL RECORD VERIFIED. The designation \"Prince Charming\" remains active." },
          { text: "Your Highness", isCanonical: false, response: "CLOSE ENOUGH. But the canonical title is \"Prince Charming\"." },
          { text: "Mr. Handsome", isCanonical: false, response: "VALID COMPLIMENT, but archival records specify \"Prince Charming\"." },
          { text: "The Chopped Trash Teen™", isCanonical: false, response: "ACCURATE ERA, but the designation \"Prince Charming\" took priority." }
        ]
      },
      {
        id: 3,
        badge: "SECTION 3.3 // SYSTEM UPGRADE",
        question: "The subject has officially reached Level 18. What happens now?",
        options: [
          { text: "Immediate wisdom", response: "AGE UPDATED SUCCESSFULLY. MATURITY LEVEL: STILL UNDER INVESTIGATION." },
          { text: "Responsibilities", response: "SYSTEM: Responsibilities incoming... Subject will probably procrastinate." },
          { text: "Taxes", response: "ERROR: Adulting module not installed. Taxes queued for later." },
          { text: "Absolutely nothing. Bro is still baby.", response: "AGE UPDATED SUCCESSFULLY. MATURITY LEVEL: STILL UNDER INVESTIGATION. (100% Truth)" }
        ]
      },
      {
        id: 4,
        badge: "SECTION 3.4 // THE ONLY QUESTION THAT MATTERS",
        question: "Do you love me?",
        isFinal: true,
        options: [
          { 
            text: "Yes", 
            code: "ANSWER ACCEPTED.", 
            response: "Knew it. Took you long enough, Prince Charming." 
          },
          { 
            text: "Obviously", 
            code: "SYSTEM: SMUGNESS DETECTED.", 
            response: "Yeah yeah, we know. 😭" 
          },
          { 
            text: "Next question.", 
            code: "ERROR 404: ESCAPE ROUTE NOT FOUND.", 
            response: "Nice try." 
          },
          { 
            text: "I'm not answering that 💀", 
            code: "INTERESTING.", 
            response: "Your hesitation has been noted. 👁️" 
          }
        ]
      }
    ];

    this.init();
  }

  init() {
    if (this.feedbackNextBtn) {
      this.feedbackNextBtn.addEventListener('click', () => {
        this.handleContinue();
      });
    }
  }

  start() {
    this.currentQuestionIndex = 0;
    this.renderCurrentQuestion();
  }

  renderCurrentQuestion() {
    clearTimeout(this.autoAdvanceTimer);
    if (!this.card) return;

    const q = this.questions[this.currentQuestionIndex];
    if (!q) return;

    // Tonal shift on Q4
    if (q.isFinal) {
      this.card.classList.add('stage-3--intimate');
    } else {
      this.card.classList.remove('stage-3--intimate');
    }

    if (this.stepText) this.stepText.textContent = `QUESTION ${q.id} / ${this.questions.length}`;
    if (this.progressBar) {
      const pct = (q.id / this.questions.length) * 100;
      this.progressBar.style.width = `${pct}%`;
    }

    if (this.badge) this.badge.textContent = q.badge;
    if (this.title) this.title.textContent = q.question;

    if (this.feedbackBox) this.feedbackBox.style.display = 'none';

    if (this.optionsContainer) {
      this.optionsContainer.innerHTML = '';
      q.options.forEach((opt, idx) => {
        const optCard = document.createElement('div');
        optCard.className = 'option-card';
        optCard.tabIndex = 0;
        optCard.innerHTML = `
          <span class="option-index">${String.fromCharCode(65 + idx)}</span>
          <span class="option-text">${opt.text}</span>
        `;

        optCard.addEventListener('click', () => this.handleOptionSelect(opt, optCard));
        optCard.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.handleOptionSelect(opt, optCard);
          }
        });

        this.optionsContainer.appendChild(optCard);
      });
    }
  }

  handleOptionSelect(opt, cardElem) {
    if (cardElem.classList.contains('option-card--disabled')) return;

    // Disable all options
    const allCards = this.optionsContainer.querySelectorAll('.option-card');
    allCards.forEach(c => {
      c.classList.add('option-card--disabled');
      c.tabIndex = -1;
    });

    cardElem.classList.remove('option-card--disabled');
    cardElem.classList.add('option-card--selected');

    // Show feedback
    if (this.feedbackBox && this.feedbackText) {
      this.feedbackCode.textContent = opt.code || (opt.isCanonical ? "HISTORICAL RECORD VERIFIED." : "SYSTEM_RESPONSE");
      this.feedbackText.textContent = opt.response;
      this.feedbackBox.style.display = 'block';
    }

    // Auto advance timer
    this.autoAdvanceTimer = setTimeout(() => {
      this.handleContinue();
    }, 2800);
  }

  handleContinue() {
    clearTimeout(this.autoAdvanceTimer);
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.renderCurrentQuestion();
    } else {
      // Completed Stage 3 -> advance to Stage 4 (Message Reveal)
      window.StageRouter.goToStage(4);
    }
  }

  reset() {
    clearTimeout(this.autoAdvanceTimer);
    this.currentQuestionIndex = 0;
    if (this.card) this.card.classList.remove('stage-3--intimate');
    if (this.feedbackBox) this.feedbackBox.style.display = 'none';
  }
}

window.QuizManager = new QuizEngine();
