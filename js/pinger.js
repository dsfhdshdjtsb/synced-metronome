class Pinger
{
    constructor(socket, id)
    {
        this.socket = socket;
        this.interval;
        this.id = id;
    }

    startPing()
    {
        this.interval = setInterval(() => {
            const start = Date.now();
          
            this.socket.emit("ping", { start: start, ID: this.id})
          }, 500);
    }

    stopPing()
    {
        clearInterval(this.interval);
    }
}