/**
 * Main Application Bootstrapper
 */
document.addEventListener('DOMContentLoaded', () => {
  // Bind Stage 2 Start Button
  const btnStartQuiz = document.getElementById('btn-start-quiz');
  if (btnStartQuiz) {
    btnStartQuiz.addEventListener('click', () => {
      window.StageRouter.goToStage(3);
    });
  }

  // Start Stage 1 Boot Sequence
  if (window.BootSequenceManager) {
    window.BootSequenceManager.start();
  }

  console.log("THE BIRTHDAY PROTOCOL // PRAKHAR_18 INITIALIZED.");
});
