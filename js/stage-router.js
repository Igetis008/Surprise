/**
 * Stage Router & State Orchestrator
 */
class StageRouter {
  constructor() {
    this.currentStage = 1;
    this.stages = document.querySelectorAll('.stage');
  }

  goToStage(stageNumber) {
    if (stageNumber < 1 || stageNumber > 5) return;
    this.currentStage = stageNumber;

    this.stages.forEach(stage => {
      const sNum = parseInt(stage.getAttribute('data-stage'), 10);
      if (sNum === stageNumber) {
        stage.classList.add('stage--active');
        stage.setAttribute('aria-hidden', 'false');
      } else {
        stage.classList.remove('stage--active');
        stage.setAttribute('aria-hidden', 'true');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Stage Lifecycle hooks
    if (stageNumber === 1 && window.BootSequenceManager) {
      window.BootSequenceManager.start();
    } else if (stageNumber === 3 && window.QuizManager) {
      window.QuizManager.start();
    } else if (stageNumber === 4 && window.MessageRevealManager) {
      window.MessageRevealManager.start();
    }
  }

  resetAll() {
    if (window.BootSequenceManager) window.BootSequenceManager.reset();
    if (window.QuizManager) window.QuizManager.reset();
    if (window.MessageRevealManager) window.MessageRevealManager.reset();
    this.goToStage(1);
  }
}

window.StageRouter = new StageRouter();
