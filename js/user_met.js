const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const dot = document.querySelector('.dot');
const enterBtn = document.querySelector('.join-btn');
const codeInput = document.querySelector('.form-control');


var metronome = new Metronome(dot);
let bpm = 140;
let tempoTextString = 'Medium';
var socket = io();
var pinger;
var timeInterval;
var avgPing = 0;
var totalPing = 0;
var counter = 0;

var totalTimeDif = 0;
var timeDif = 0;

socket.on('user_start', function(msg) {
    console.log("server time: " + msg)
    console.log("my time: " + Date.now())
    console.log("timdif:" + timeDif)
    let timeToStart = msg - Date.now() - timeDif;
    console.log("start: " + timeToStart)
    console.log("ping:" + avgPing)
    setTimeout(function(){ 
        metronome.start();
      }, timeToStart)
    
    
});
socket.on('user_stop', function(msg) {
  metronome.stop();
});

socket.on('user_bpm', function(msg) {
    bpm = parseInt(msg);
    updateMetronome();
});

socket.on('joined', function(msg){
    enterBtn.innerHTML = 'Joined!';
    // pinger = new Pinger(socket, socket.id)
    // pinger.startPing();
    // setTimeout(function(){ 
    //     pinger.stopPing();
    //   }, 10000)

})


socket.on('start_ping', (msg) => {
    // pinger = setInterval(() => {
    //     socket.emit('ping', {ID: socket.id, start: Date.now()})
    // }, 5)
    socket.emit('ping', {ID: socket.id, start: Date.now()})
})
socket.on('ping' , (msg) => {
    avgPing = Date.now() - msg.start;
    socket.emit('get_time', {ID: socket.id});
})
// socket.on('ping' , (msg) => {
//     counter++
//     totalPing += Date.now() - msg.start;
//     console.log(msg)
//     if(counter > 200 )
//     {
//         avgPing = totalPing / (counter * 2)
//         console.log(avgPing);
//         counter = totalPing = 0;
//         clearInterval(pinger)
        
//         timeInterval = setInterval(() => {
//             socket.emit('get_time', {ID: socket.id});
//           }, 5);
//     }
// })
socket.on('time', (msg) => {
    timeDif = msg - Date.now();
    if(timeDif <= 0)
    {
        timeDif += avgPing
    }
    else
    {
        timeDif -= avgPing
    }
})
// socket.on('time', (msg) => {
//     counter++
//     totalTimeDif += (msg - Date.now());
//     if(totalTimeDif <= 0)
//     {
//         totalTimeDif += avgPing
//     }
//     else
//     {
//         totalTimeDif -= avgPing
//     }

//     if(counter > 200)
//     {
//         timeDif = totalTimeDif / (counter)
//         console.log(timeDif)
//         counter = totalTimeDif = 0;
//         clearInterval(timeInterval);
//     }
// })
// socket.on('result', (msg) =>{
//     console.log(msg);
// })
socket.on('not found', function(msg) {
    enterBtn.innerHTML = 'Not found!';
    setTimeout(function(){ 
        enterBtn.innerHTML = 'JOIN';
      }, 1000)
})

enterBtn.addEventListener('click', () => {
    console.log(socket.id)
    var txt = codeInput.value
    socket.emit('join_room', { room: txt , id: socket.id});

    metronome.start();
    setTimeout(function(){ 
      metronome.stop();
    }, 500)
});

function updateMetronome() {
    tempoDisplay.textContent = bpm;
    metronome.tempo = bpm;
    if (bpm <= 40) { tempoTextString = "Grave" };
    if (bpm > 40 && bpm <= 45) { tempoTextString = "Lento" };
    if (bpm > 45 && bpm <= 55) { tempoTextString = "Largo" };
    if (bpm > 55 && bpm <= 65) { tempoTextString = "Adagio" };
    if (bpm > 65 && bpm <= 69) { tempoTextString = "Adagietto" };
    if (bpm > 69 && bpm <= 77) { tempoTextString = "Andante" };
    if (bpm > 77 && bpm <= 97) { tempoTextString = "Moderato" };
    if (bpm > 97 && bpm <= 109) { tempoTextString = "Allegretto" };
    if (bpm > 109 && bpm <= 132) { tempoTextString = "Allegro" };
    if (bpm > 132 && bpm <= 154) { tempoTextString = "Vivace" };
    if (bpm > 154 && bpm <= 177) { tempoTextString = "Presto" };
    if (bpm > 178) { tempoTextString = "Prestissimo" };

    tempoText.textContent = tempoTextString;
}



