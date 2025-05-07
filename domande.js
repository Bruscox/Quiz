import { domandeStoria, risposteStoria, domandeAttualità, domandeAnime, domandeVideogiochi, domandeFilm, risposteAttualità, risposteAnime, risposteFilm, risposteVideogiochi } from './argomenti.js';

const quizType = localStorage.getItem('quizType');

let domande = [];
let risposteFinali = [];

if (quizType === "storia") {
    domande = domandeStoria;
    risposteFinali = risposteStoria;
} else if (quizType === "attualità") {
    domande = domandeAttualità;
    risposteFinali = risposteAttualità;
} else if (quizType === "anime") {
    domande = domandeAnime;
    risposteFinali = risposteAnime;
} else if (quizType === "videogiochi") {
    domande = domandeVideogiochi;
    risposteFinali = risposteVideogiochi;
} else if (quizType === "film") {
    domande = domandeFilm;
    risposteFinali = risposteFilm;
} else {
    alert("Errore: argomento non riconosciuto.");
}

// Variabili globali
let indiceDomanda = 0;
let risposteUtente = new Array(domande.length);
let risultatoQuiz = false;

function mostraDomanda() {
    const domanda = domande[indiceDomanda];
    document.getElementById("titoloDomanda").innerText = "Domanda " + (indiceDomanda + 1) + " di " + domande.length;
    document.getElementById("testoDomanda").innerText = domanda.testo;

    const opzioniContainer = document.getElementById("opzioniContainer");
    opzioniContainer.innerHTML = ""; // pulisce le vecchie opzioni

    //Creazione opzioni domanda
    domanda.opzioni.forEach((opzione, i) => {
        const div = document.createElement("div");

        // controllo se questa opzione è già stata selezionata prima
        let checked = "";
        if (risposteUtente[indiceDomanda] === opzione) {
            checked = "checked";
        }
        //es: <input type="radio" name="risposta" value="2" checked> 2
        // div.innerHTML = `<input type="radio" name="risposta" value="${opzione}" ${checked}> ${opzione}`;
        div.innerHTML = `<input type="radio" id="domanda${indiceDomanda}_opzione${i}" name="risposta${indiceDomanda}" value="${opzione}" ${checked}> ${opzione}`;

        opzioniContainer.appendChild(div);
    });
}

function verificaRisposta() {

    // Prende tutte le opzioni radio
    const opzioni = document.getElementsByName(`risposta${indiceDomanda}`);
    // Cerca quella selezionata
    for (let i = 0; i < opzioni.length; i++) {

        if (opzioni[i].checked) {
            return opzioni[i].value;
        }
    }
    return null;
}

// All’avvio
if (domande.length > 0) {
    mostraDomanda();
} else {
    alert("Errore: nessuna domanda caricata. Controlla di aver scelto un argomento valido!");
}
document.getElementById("tornaIndietro").style.display = "none";
document.getElementById("invia").style.display = "none";

// Quando clicchi "Prossima domanda"
document.getElementById("prossimaDomanda").addEventListener("click", () => {

    if (risultatoQuiz) {
        //Incremento prima l'indice delle domande per togliere visivamente il bottone 'ProssimaDomanda'
        indiceDomanda++;
        document.getElementById("tornaIndietro").style.display = "inline";
        if (indiceDomanda === domande.length - 1) {
            document.getElementById("prossimaDomanda").style.display = "none";

        }
        mostraRisultati(indiceDomanda);
    } else {
        //Verifica se ha inserito il valore tra le 4 opzioni
        const rispostaSelezionata = verificaRisposta();
        if (rispostaSelezionata !== null) {
            risposteUtente[indiceDomanda] = rispostaSelezionata; // aggiorno risposta
        }
        //adesso controllo se esiste una risposta salvata
        if (risposteUtente[indiceDomanda]) {


            if (indiceDomanda < domande.length - 1) {
                indiceDomanda++;
                mostraDomanda();
                document.getElementById("tornaIndietro").style.display = "inline";
            } if (indiceDomanda === domande.length - 1) {
                document.getElementById("prossimaDomanda").style.display = "none"
                document.getElementById("invia").style.display = "inline";
            }
        } else {
            alert("Seleziona un'opzione prima di continuare!");
        }


    }
});

//Click "Invia"
document.getElementById("invia").addEventListener("click", () => {

    let giusto = 0;
    let sbagliato = 0;
    const rispostaSelezionata = verificaRisposta();
    if (rispostaSelezionata) {
        risposteUtente[indiceDomanda] = rispostaSelezionata; // <-- salva ANCHE alla fine
        console.log(risposteUtente); // puoi controllare tutte le risposte salvate
        for (let i = 0; i < risposteFinali.length; i++) {
            if (risposteUtente[i] === risposteFinali[i]) {
                giusto++;

                const radios = document.querySelectorAll(`[id^="domanda${i}"]`);
                console.log(radios);
                for (let j = 0; j < radios.length; j++) {
                    if (radios[j].value === risposteFinali[i]) {
                        console.log("a");
                        radios[j].classList.add("domandaCorretta");

                    }
                }
            } else {
                sbagliato++;

                const radioss = document.querySelectorAll(`[id^="domanda${i}"]`);
                for (let a = 0; a < radioss.length; a++) {
                    if (radioss[a].value === risposteUtente[i]) {
                        radioss[a].classList.add("domandaSbagliata");
                    }
                    if (radioss[a].value === risposteFinali[i]) {
                        radioss[a].classList.add("domandaCorretta");
                        radioss[a].checked = true;
                    }
                }
            }
        }

        alert("risposte giuste: " + giusto + " risposte sbagliate: " + sbagliato);

        //Dopo il click del pulsante, lo rimuovo in modo permanente, rimuovo temporaneamente "tornaIndietro" e riabilito "prossimaDomanda"
        document.getElementById("tornaIndietro").style.display = "none";
        document.getElementById("prossimaDomanda").style.display = "inline"
        let invia = document.getElementById("invia");
        invia.remove();
        indiceDomanda = 0;
        risultatoQuiz = true;
        mostraRisultati(indiceDomanda);

    } else {
        alert("Seleziona un'opzione prima di inviare!");
    }
});

function mostraRisultati(indiceDomanda) {
    console.log("valore della domanda: " + indiceDomanda)
    const domanda = domande[indiceDomanda];
    document.getElementById("titoloDomanda").innerText = "Domanda " + (indiceDomanda + 1) + " di " + domande.length;
    document.getElementById("testoDomanda").innerText = domanda.testo;

    const opzioniContainer = document.getElementById("opzioniContainer");
    opzioniContainer.innerHTML = ""; // Pulisce il contenitore

    for (let i = 0; i < domanda.opzioni.length; i++) {
        const opzione = domanda.opzioni[i];
        const div = document.createElement("div");
        const id = `domanda${indiceDomanda}_opzione${i}`;

        // Controlla se l'opzione era stata selezionata dall'utente
        const isChecked = risposteUtente[indiceDomanda] === opzione ? "checked" : ""; //Operatore ternario

        // Crea input radio disabilitato
        const inputHTML = `<input type="radio" id="${id}" name="risposta${indiceDomanda}" value="${opzione}" ${isChecked} disabled> ${opzione}`;
        div.innerHTML = inputHTML;

        // Aggiunge le classi corrette o sbagliate
        if (risposteUtente[indiceDomanda] === risposteFinali[indiceDomanda] && opzione === risposteFinali[indiceDomanda]) {
            div.firstChild.classList.add("domandaCorretta");
        } else {
            if (opzione === risposteUtente[indiceDomanda]) {
                div.firstChild.classList.add("domandaSbagliata");
            }
            if (opzione === risposteFinali[indiceDomanda]) {
                div.firstChild.classList.add("domandaCorretta");
                div.firstChild.checked = true;
            }
        }
        opzioniContainer.appendChild(div);

    }
    //Disabilita radiobuttons ai figli di OpzioniContainer
    let radioButtons = opzioniContainer.querySelectorAll('input[type="radio"]');
    for (let indexDisabilita = 0; indexDisabilita < radioButtons.length; indexDisabilita++) {
        radioButtons[indexDisabilita].disabled = true;
    }
}

// Click "Torna indietro"
document.getElementById("tornaIndietro").addEventListener("click", () => {

    if (risultatoQuiz) {
        indiceDomanda--;
        document.getElementById("prossimaDomanda").style.display = "inline";
        if (indiceDomanda <= 0) {
            document.getElementById("tornaIndietro").style.display = "none";

        }
        mostraRisultati(indiceDomanda);
    } else {
        indiceDomanda--;
        if (indiceDomanda < domande.length) {
            document.getElementById("prossimaDomanda").style.display = "inline";
            document.getElementById("invia").style.display = "none";

        } if (indiceDomanda <= 0) {
            document.getElementById("tornaIndietro").style.display = "none";
            document.getElementById("prossimaDomanda").style.display = "inline";
        }
        mostraDomanda();
    }
});