'use strict'

const socket = io();
socket.emit("chatting", "hihi")
socket.on("chatting", (data) => {
  console.log(data)
})
console.log(socket)