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

var offsets = [];
var roomSize = -1;

var metronome = new Metronome(dot);

socket.on('user_start', function(msg) {
    metronome.start();
});
socket.on('user_stop', function(msg) {
    metronome.stop();
});

function ping(){
    offsets = [];
    for (let i = 0; i < 10; i++){
        socket.emit('ping', {roomId: id, masterId: socket.id, startTime: Date.now()});
    }
}

function calcOffsets(startTime, id){
    return new Promise((resolve)=>{
        let afterTime = Date.now();
        let offset = (afterTime-startTime)/2;
        resolve({ clientId: id, offset: offset });
    })
}

function sumKeys(array){
    // copy pasted from stack overflow
    let counts = array.reduce((prev, curr) => {
        let count = prev.get(curr.clientId) || 0;
        prev.set(curr.clientId, parseInt(curr.offset) + count);
        return prev;
    }, new Map());

      
    // then, map your counts object back to an array
    console.log(counts);
    let res = [];
    counts.forEach(function(val, key) {
        res.push({ clientId: key, offset: val });
    });
    console.log(res);
    return res;
}

async function averageOffsets(array){
    const settled = await Promise.allSettled(array)
    array = await Promise.all(array)
    array = sumKeys(array);
    array.forEach((val, index) =>{
        array[index]/=10;
    })
    console.log(array);
    return array;
}



socket.on('return_ping', (msg)=>{
    offsets.push(calcOffsets(msg.startTime, msg.clientId));
    roomSize = msg.roomSize - 1;
    if (offsets.length/10 == roomSize){
        let averagedOffsets = averageOffsets(offsets);
    }
})

socket.on('room taken', function(msg){
    code.textContent = "error: refresh page";
})

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

        lobbyCreated = true;
    }else{
      if (!isRunning) {
        //   isRunning = true;
        //   startStopBtn.textContent = 'STOP';
        //   socket.emit('server_bpm', { BPM: bpm , ID: id} );
        //   socket.emit('master_start', id);
        ping();

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

