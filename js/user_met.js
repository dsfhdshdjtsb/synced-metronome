import Timer from './timer.js';

const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const measureCount = document.querySelector('.measure-count');
const dot = document.querySelector('.dot');

const click1 = new Audio('../audio/click1.mp3');
const click2 = new Audio('../audio/click2.mp3');

let bpm = 140;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let tempoTextString = 'Medium';

var socket = io();

socket.on('user_toggle', function(msg) {
    if(msg == "start")
    {
        metronome.start();
    }
    else if(msg == "stop")
    {
        metronome.stop();
    }
})

function updateMetronome() {
    tempoDisplay.textContent = bpm;
    tempoSlider.value = bpm;
    metronome.timeInterval = 60000 / bpm;
    if (bpm <= 40) { tempoTextString = "Grave" };
    if (bpm > 40 && bpm <= 45) { tempoTextString = "Lento" };
    if (bpm > 45 && bpm <= 55) { tempoTextString = "Largo" };
    if (bpm > 55 && bpm <= 65) { tempoTextString = "Adagio" };
    if (bpm > 65 && bpm <= 69) { tempoTextString = "Adagietto" };
    if (bpm > 69 && bpm <= 77) { tempoTextString = "Andante" };
    if (bpm > 77 && bpm <= 97) { tempoTextString = "Moderato" };
    if (bpm > 97 && bpm <= 109) { tempoTextString = "Allegretto" };
    if (bpm > 109 && bpm <= 132) { tempoTextString = "Allegro" };
    if (bpm > 132 && bpm <= 168) { tempoTextString = "Vivace" };
    if (bpm > 168 && bpm <= 177) { tempoTextString = "Presto" };
    if (bpm > 178) { tempoTextString = "Prestissimo" };

    tempoText.textContent = tempoTextString;
}
function validateTempo() {
    if (bpm <= 20) { return };
    if (bpm >= 280) { return };
}

function playClick() {
    console.log(count);
    if (count === beatsPerMeasure) {
        count = 0;
    }
    if (count === 0) {
        click1.play();
        dot.style.background = "#F0DF8B";
        click1.currentTime = 0;
    } else {
        click2.play();
        if (count%2===1){
          dot.style.background = "#00FF00";
        } else{
          dot.style.background = "#FF0000";
        }
        click2.currentTime = 0;
    }
    count++;
}

const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });
