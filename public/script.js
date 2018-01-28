var socket = io('http://localhost:3000');
window.join = function() {
    socket.emit("wannaplay")
    document.getElementById('game').showModal()
}
window.closeModal = () => {
    document.getElementById('game').close()
    socket.emit("exitroom", socket.id)
}
socket.on('q', (data) =>{ 
    document.querySelector('.spin').classList.add('spin_hide')    
    document.querySelector('.game-quest_number').innerHTML = `Вопрос номер ${data.number}`
    document.querySelector('.game-quest_text').innerHTML = `Вопрос: ${data.text}`
    
})
socket.on('wait', () => {
    document.querySelector('.spin').classList.remove('spin_hide')
})