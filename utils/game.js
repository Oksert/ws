class Game {
    constructor (room, io) {
        this.roomName
        this.io = io
        this.players = []
        this.questions = [
            {
                number: "1",
                text: "Q1?",
                answer: 2,
                variants: ['1','2','3','4']
            }
        ]
    }
    addPlayer (socket) {
        this.players.push(socket.id)
    }
    start() {
        if (this.players.length != 2) {

        }
        this.questions.forEach((q)=>{
            this.ask(q)
        })

    }
    ask(q) {
        this.io.sockets.in(this.roomName).emit("q", q)
    }
    listen() {
        this.io.socket.on()
    }
}