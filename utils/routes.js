const socketio = require('socket.io');

class SocketHandler {
    constructor (app) {
        this.io = socketio(app);
        this.events()
        this.allRooms = []
        this.clients = []

    }
    events() {
        this.io.on('connection', (socket) => {
            socket.on('wannaplay', () => {
            console.log("New connection on wannaplay")
            this.getRoom(socket)
            })
        })
    }
    getRoom(socket) {
        let freeRoom = ''
        console.log("Searching for room")
        this.allRooms.forEach((room) => {
            if (room.players.length == 1) {
                freeRoom = room.name
                socket.join(freeRoom)
                room.players.push(socket.id)
                this.startGame(room,socket)
                return
            }
        })
        if (freeRoom === '') {
            let idx = this.allRooms.length + 1
            this.allRooms.push({
                name: "room-" + idx,
                idx: idx,
                players:[socket.id]
            })
            freeRoom = "room-" + idx
            console.log("Create room: ", freeRoom)
            this.io.to(socket.id).emit("wait")
        }
        console.log("Joined room: ", freeRoom)
        socket.join(freeRoom)
        

    }
    startGame(room, socket) {
        this.io.sockets.in(room.name).emit("q", {
            number: 1,
            text: "Первый вопрос"
        })
        let x = this.io.nsps['/'].adapter.rooms
        socket.on("exitroom", (socket) => {
            let x = this.nsp
            console.log(this.io.nsps['/'].adapter.rooms[room.name].sockets, socket)
            if (this.io.nsps['/'].adapter.rooms[room.name].sockets[socket]) {
                this.allRooms[room.idx]
            }
            console.log("Player left room", room.idx)
            console.log(room)
            if (this.allRooms[room.idx - 1].players.length === 0) {
                this.allRooms.splice(idx, 1)
                console.log("Deleting room ", room.idx)
            }
        })
    }
}
module.exports = SocketHandler
