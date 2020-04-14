'use strict';

const express = require('express');
const path = require('path');
const socketIO = require('socket.io');

const Player = require('./player');
const Game = require('./game');

const PORT = process.env.PORT || 3000;

const server = express()
  .use(express.static(path.join(__dirname, './../client')))
  //.get('/', (req, res) => res.render('../client/index'))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

const io = socketIO(server);

const game = new Game();
game.startGift();
const players = new Map();

io.on('connection', (socket) => {
  console.log('Client connected');

  const player = new Player(socket.id);
  players.set(socket.id, player);
  console.log(player);

  socket.emit('playerId', player.socketId);

  socket.on('movement', function(data) {
    var player = players.get(socket.id);
    player.move(data);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    players.delete(socket.id);
  });
});

setInterval(function() {
  game.calcState(players);
  io.sockets.emit('state', {
    'players' : [...players.values()],
    'gift' : game.gift
  });
}, 1000 / 60);
