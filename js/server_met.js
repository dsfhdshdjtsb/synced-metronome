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
const roomID = makeid(5)
const socketID = socket.id;
var metronome = new Metronome(dot);

var ts = timesync.create({
    server: socket,
    interval: 5000
});

socket.on('user_start', function(msg) {
    console.log(msg - ts.now())
    let offset = msg-ts.now();
    if (offset < 500 && offset > 0){
        setTimeout(function(){
            metronome.start()
        }, msg - ts.now())
    }else{
        setTimeout(()=>{
            socket.emit("master_stop", { roomID: roomID, error: "masterOOS" })
        },500)
    }
   
});

socket.on('user_stop', function(msg) {
    metronome.stop();
    if (msg.error == "outOfSync"){
        metronome.start();
    }
});

socket.on('room taken', function(msg){
    code.textContent = "error: refresh page";
})


socket.on('timesync', function (data) {
    //console.log('receive', data);
    ts.receive(null, data);
  });


ts.on('sync', function (state) {
    console.log('sync ' + state + '');
});

ts.on('change', function (offset) {
    console.log('changed offset: ' + offset + ' ms');
});

ts.send = function (socket, data, timeout) {
    //console.log('send', data);
    return new Promise(function (resolve, reject) {
      var timeoutFn = setTimeout(reject, timeout);

      socket.emit('timesync', data, function () {
        clearTimeout(timeoutFn);
        resolve();
      });
    });
  };

  tempoDisplay.addEventListener("click", (e)=>{
    tempoDisplay.textContent="";
  })

window.addEventListener('click', function(e){   //probably bad practice idc tho
    if (!(tempoDisplay.contains(e.target))){
        updateTempoDisplay();
    }
});

tempoDisplay.addEventListener("keypress", (e)=>{
    var x = e.charCode || e.keyCode;
    let newBpm = -1;
    if (isNaN(String.fromCharCode(e.which)) && x!=46 || x===32 || (x===46 && e.currentTarget.innerText.includes('.'))){
        e.preventDefault()
    }

    if (x == 13){
        updateTempoDisplay();
    }

})

function updateTempoDisplay(){
    tempoDisplay.removeAttribute("contenteditable");
    let newBpm = parseInt(tempoDisplay.textContent);
    tempoDisplay.setAttribute("contenteditable", true);
    console.log(newBpm);
    if (newBpm <= 280 && newBpm > 0){
        bpm = newBpm;
        updateMetronome();
        newBpm = -1;
    }else{
        newBpm = -1;
        updateMetronome();
    }
}

decreaseTempoBtn.addEventListener('click', () => {
    if (bpm <= 20) { return };
    bpm--;
    socket.emit('server_bpm', { BPM: bpm , roomID: roomID} );
    updateMetronome();
});
increaseTempoBtn.addEventListener('click', () => {
    if (bpm >= 280) { return };
    bpm++;
    socket.emit('server_bpm', { BPM: bpm , roomID: roomID} );
    updateMetronome();
});
tempoSlider.addEventListener('input', () => {
    bpm = tempoSlider.value;
    socket.emit('server_bpm', { BPM: bpm , roomID: roomID} );
    updateMetronome();
});

startStopBtn.addEventListener('click', () => {
    if(lobbyCreated === false){
        startStopBtn.textContent = "START";
        code.textContent = roomID;
        socket.emit('create_room', {roomID: roomID, socketID: socketID}); //i realize this is confusing so if ur lookinga t this gl im too lazy to fix
        metronome.start();
        setTimeout(function(){ 
            socket.emit('master_stop', {roomID: roomID, error: ""});
        }, 100)

        lobbyCreated = true;
    }else{
      if (!isRunning) {
          isRunning = true;
          startStopBtn.textContent = 'STOP';
          socket.emit('server_bpm', { BPM: bpm , roomID: roomID} );
          socket.emit('master_start', {roomID:roomID, start: ts.now() + 500});
          console.log('now: ', ts.now())
      } else {
        // pinger.stopPing()
          isRunning = false;
          startStopBtn.textContent = 'START';
          dot.style.background = "white";
          socket.emit('master_stop', {roomID: roomID, error: ""});
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

