const tempoDisplay = document.querySelector('.tempo');
const tempoText = document.querySelector('.tempo-text');
const decreaseTempoBtn = document.querySelector('.decrease-tempo');
const increaseTempoBtn = document.querySelector('.increase-tempo');
const tempoSlider = document.querySelector('.slider');
const startStopBtn = document.querySelector('.start-stop');
const dot = document.querySelector('.dot');
const code = document.querySelector('.code');


let bpm = 140;
let isRunning = false;
let lobbyCreated = false;
let tempoTextString = 'Medium';
var socket = io();
const id = makeid(5)

var metronome = new Metronome(dot);
var pinger;
var timeInterval;
var avgPing = 0;
var totalPing = 0;
var counter = 0;

var totalTimeDif = 0;
var timeDif = 0;

socket.on('user_start', function(msg) {
    let timeToStart = msg - Date.now() + timeDif;
    //- Date.now() - timeDif
    console.log("server time: " + msg)
    console.log("my time: " + Date.now())
    console.log("ping:" + avgPing)
    console.log("timdif:" + timeDif)
    console.log("start: " + timeToStart)
    setTimeout(function(){ 
        metronome.start();
      }, timeToStart)
});
socket.on('user_stop', function(msg) {
    metronome.stop();
});
socket.on('user_ping', function(msg){
    console.log(Date.now() - msg);
})

socket.on('room taken', function(msg){
    code.textContent = "error: refresh page";
})


socket.on('start_ping', (msg) => {
    // pinger = setInterval(() => {
    //     socket.emit('ping', {ID: socket.id, start: Date.now()})
    // }, 5)
    socket.emit('ping', {ID: socket.id, start: msg})
})
socket.on('ping' , (msg) => {
    console.log(msg)
    avgPing = msg;
    socket.emit('get_time', {ID: socket.id, time: Date.now(), ping: avgPing});
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
socket.on('set_time', (msg) =>{
    timeDif = msg;
})
// socket.on('time', (msg) => {
//     timeDif = msg - Date.now();
//     console.log(msg)
//     console.log(Date.now());
//     console.log("b4 ping time: " + timeDif)
//     if(timeDif <= 0)
//     {
//         timeDif += avgPing
//     }
//     else
//     {
//         timeDif -= avgPing
//     }
// })
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

decreaseTempoBtn.addEventListener('click', () => {
    if (bpm <= 20) { return };
    bpm--;
    socket.emit('server_bpm', { BPM: bpm , ID: id} );
    updateMetronome();
});
increaseTempoBtn.addEventListener('click', () => {
    if (bpm >= 280) { return };
    bpm++;
    socket.emit('server_bpm', { BPM: bpm , ID: id} );
    updateMetronome();
});
tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    socket.emit('server_bpm', { BPM: bpm , ID: id} );
    updateMetronome();
});



startStopBtn.addEventListener('click', () => {
    if(lobbyCreated === false){
        startStopBtn.textContent = "START";
        code.textContent = id;
        socket.emit('create_room', {room: id, id: socket.id}); //i realize this is confusing so if ur lookinga t this gl im too lazy to fix
        metronome.start();
        setTimeout(function(){ 
            socket.emit('master_stop', id);
        }, 100)

    //     pinger = new Pinger(socket, socket.id)
    //     pinger.startPing();
    //     setTimeout(function(){ 
    //         pinger.stopPing();
    //   }, 10000)
//test
        lobbyCreated = true;
    }else{
      if (!isRunning) {
          isRunning = true;
          startStopBtn.textContent = 'STOP';
          socket.emit('server_bpm', { BPM: bpm , ID: id} );
          socket.emit('master_start', id);

        //   pinger.startPing()
      } else {
        // pinger.stopPing()
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

function makeid(length) {
    var result           = '';
    var characters       = 'BCDFGHJKMNPQRSTVWXYZbcdfghkmnpqrstvwxyz23456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() *
 charactersLength));
   }
   return result;
}

