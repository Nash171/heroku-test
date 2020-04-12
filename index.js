
'use strict';

const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static(path.join(__dirname, 'client')))
  .get('/', (req, res) => res.render('client/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

const players = new Map();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomPosition(){
  return {
    x: randomInt(0, 800),
    y: randomInt(0, 600)
  }
}

function randomColor(){
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
}

const Player = function(socketId){
  this.socketId = socketId;
  this.position = randomPosition();
  this.color = randomColor();
}

io.on('connection', (socket) => {
  console.log('Client connected');

  const player = new Player(socket.id);
  players.set(socket.id, player);
  console.log(players);

  socket.on('movement', function(data) {
    var player = players.get(socket.id);
    if (data.left) {
      player.position.x = (player.position.x + 800 - 3) % 800;
    }
    if (data.up) {
      player.position.y = (player.position.y + 600 - 3) % 600;
    }
    if (data.right) {
      player.position.x = (player.position.x + 3) % 800;
    }
    if (data.down) {
      player.position.y = (player.position.y + 3) % 600;
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    players.delete(socket.id);
  });
});

setInterval(function() {
  io.sockets.emit('state', [...players.values()]);
}, 1000/60);
