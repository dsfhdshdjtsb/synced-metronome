import Timer from './timer.js';

const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const measureCount = document.querySelector('.measure-count');
const testButton = document.querySelector('.testButton');
const dot = document.querySelector('.dot');
const enterBtn = document.querySelector('.troll');
const codeInput = document.getElementById("code");

// const click1 = new Audio('../audio/click2.mp3');
// const click2 = new Audio('../audio/click2.mp3');
var click1 = new Audio('../audio/click2.mp3');
click1.play()
click1.pause()
let bpm = 140;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let tempoTextString = 'Medium';

var socket = io();

socket.on('user_start', function(msg) {
    count = 0
    metronome.start();
});
socket.on('user_stop', function(msg) {
    metronome.stop();
    count = 0
    dot.style.background = "white";
});

socket.on('user_bpm', function(msg) {
    bpm = parseInt(msg);
    console.log("curbpm" + bpm)
    updateMetronome();
});

// socket.on('user_bpmeasure', function(msg) {
//     beatsPerMeasure = parseInt(msg);
//     updateMetronome();
// });

enterBtn.addEventListener('click', () => {
    var txt = codeInput.value
    socket.emit('join_room', txt);
});

function updateMetronome() {
    tempoDisplay.textContent = bpm;
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
    if (count === beatsPerMeasure) {
        count = 0;
    }
    if (count === 0) {
        click1.play();
        click1.currentTime = 0;
    } else {
        click1.play(); //click 2
        click1.currentTime = 0; //click 2
    }
    if (count%2 === 0){
      dot.style.background = "#fa545c";
    } else{
      dot.style.background = "white";
    }
    count++;
}


const metronome = new Timer(playClick, 60000 / bpm, { immediate: true });
