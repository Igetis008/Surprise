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

  console.log("THE BIRTHDAY PROTOCOL // PRAKHAR_18 INITIALIZED.");
});
