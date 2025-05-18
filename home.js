let scegli = document.getElementById("obbligation");

document.getElementById('start-button').addEventListener('click', function () {
    const quizType = document.getElementById('quiz-type').value;
    if (quizType == "default") {
        scegli.textContent = "Scegli un argomento...";
    } else {
        //Continua...
        // Salva il tipo di quiz in localStorage
        localStorage.setItem('quizType', quizType);
        window.location.href = 'paginaQuiz.html';
    }
});

document.getElementById('quiz-type').addEventListener("change", function () {
    const quizType = document.getElementById('quiz-type').value;
    if (quizType != "default") {
        scegli.textContent = "";
    }
});
