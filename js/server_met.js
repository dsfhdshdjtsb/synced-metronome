import Timer from './timer.js';

const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const subtractBeats = document.querySelector('.subtract-beats');
const addBeats = document.querySelector('.add-beats');
const measureCount = document.querySelector('.measure-count');
const dot = document.querySelector('.dot');
const code = document.querySelector('.code');
const id = makeid(5)

const click1 = new Audio('../audio/click2.mp3');
const click2 = new Audio('../audio/click2.mp3');

let bpm = 140;
let beatsPerMeasure = 4;
let count = 0;
let isRunning = false;
let lobbyCreated = false;
let tempoTextString = 'Medium';
var socket = io();


socket.on('user_start', function(msg) {
    metronome.start();
    count = 0;
});
socket.on('user_stop', function(msg) {
    metronome.stop();
    count = 0;
});

decreaseTempoBtn.addEventListener('click', () => {
    if (bpm <= 20) { return };
    bpm--;
    socket.emit('server_bpm', { BPM: bpm , ID: id} );
    validateTempo();
    updateMetronome();
});
increaseTempoBtn.addEventListener('click', () => {
    if (bpm >= 280) { return };
    bpm++;
    console.log(bpm)
    socket.emit('server_bpm', { BPM: bpm , ID: id} );
    validateTempo();
    updateMetronome();
});
tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    socket.emit('server_bpm', { BPM: bpm , ID: id} );
    validateTempo();
    updateMetronome();
});


startStopBtn.addEventListener('click', () => {
    if (lobbyCreated === false){
      startStopBtn.textContent = "START";
      socket.emit('create_room', id);
      code.textContent = id;

      lobbyCreated = true;
    }else{
      count = 0;
      if (!isRunning) {
          isRunning = true;
          startStopBtn.textContent = 'STOP';
          socket.emit('master_start', id);
      } else {
          isRunning = false;
          startStopBtn.textContent = 'START';
          dot.style.background = "white";
          socket.emit('master_stop', id);
      }
    }
});

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
        click1.currentTime = 0;
    } else {
        click2.play();
        click2.currentTime = 0;
    }
    if (count%2 === 0){
      dot.style.background = "white";
    } else{
      dot.style.background = "#fa545c";
    }
    count++;
}

function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHJKMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}

let metronome = new Timer(playClick, 60000 / bpm, { immediate: true });
