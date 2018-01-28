

// function configSocket(app, io) {
//     io.on('connection', (socket)=>{
//         console.log("New connection")
//     })
// }
const socketio = require('socket.io');

class SocketHandler {
    constructor (app) {
        this.io = socketio(app);
        this.events()
        this.rooms = []

    }
    events() {
        this.io.on('connection', (socket) => {
            socket.on('wannaplay', () => {
            console.log("New connection on wannaplay")
                
                // if(io.nsps['/'].adapter.rooms["room-"+roomno] && io.nsps['/'].adapter.rooms["room-"+roomno].length > 1) 
                // {
                //     roomno++;
                // }
                // socket.join("room-"+roomno);
                this.getRoom(socket)
            })
        })
    }
    getRoom(socket) {
        let freeRoom = ''
        console.log("Searching for room")
        this.rooms.forEach((room) => {
            if (room.participants == 1) {
                freeRoom = room.name
                socket.join(freeRoom)
                room.participants++
                this.startGame(room.name,socket)
                return
            }
        })
        if (freeRoom === '') {
            let roomIdx = this.rooms.length + 1
            this.rooms.push({
                name: "room-" + roomIdx,
                participants: 1,
                idx: roomIdx
            })
            freeRoom = "room-" + roomIdx
            console.log("Create room: ", freeRoom)
            this.io.to(socket.id).emit("wait")
        }
        console.log("Joined room: ", freeRoom)
        socket.join(freeRoom)
        

    }
    startGame(room, socket) {
        this.io.sockets.in(room).emit("q", {
            number: 1,
            text: "Первый вопрос"
        })
        socket.on("exitroom", () => {
            socket.rooms.includes(soc)
            console.log("Player left room", room.roomIdx)
            if (--this.rooms[room.roomIdx].participants === 0) {
                this.rooms.splice(roomIdx, 1)
                console.log("Deleting room ", roomIdx)
            }
        })
    }
}
module.exports = SocketHandler
