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
            console.log("id:" + this.id)
            this.socket.emit("ping", { start: start, ID: this.id})
          }, 10);
    }

    stopPing()
    {
        clearInterval(this.interval);
    }
}