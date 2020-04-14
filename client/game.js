var socket = io();

var canvas = document.getElementById('canvas');
canvas.width = 600;
canvas.height = 600;
var context = canvas.getContext('2d');

socket.on('state', function(state) {
  context.clearRect(0, 0, 600, 600);

  players = state.players;
  for (var id in players) {
    var player = players[id];
    context.fillStyle = player.color;
    context.beginPath();
    context.arc(player.position.x, player.position.y, 10, 0, 2 * Math.PI);
    context.fill();
  }

  if(state.gift){
    context.fillStyle = '#000';
    context.fillRect(state.gift.x-4, state.gift.y-4, 8, 8);
  }

});

const scores = document.getElementById('scores');
let players = null;
let myId = null;

setInterval(function() {
  if(players) {
    renderPlayers();
  }
}, 1000);

socket.on('playerId', function(playerId){
  myId = playerId;
});

const renderPlayers = function(){
  scores.innerHTML = '';
  const ps = players.sort((a,b) => b.score - a.score);
  for (var i in ps) {
    const player = ps[i];

    var ply = document.createElement("div");
    ply.className = "player";
    if(player.socketId == myId) {
      ply.className += " me";
    }

    var color = document.createElement("div");
    color.className = "player_color";
    color.style.backgroundColor = player.color;
    ply.appendChild(color);

    var score = document.createElement("div");
    score.className = "player_score";
    score.innerText = player.score;
    ply.appendChild(score);

    scores.appendChild(ply);
  }
}

const addPlayer = function(player){
  if(players[player.socketId]){
    var ply = document.createElement("div");
    ply.className = "player";

    var color = document.createElement("div");
    color.className = "player_color";
    color.style.backgroundColor = player.color;
    ply.appendChild(color);

    var score = document.createElement("div");
    score.className = "player_score";
    score.innerText = player.score;
    ply.appendChild(score);

    scores.appendChild(ply);
  }
}

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);

window.addEventListener('blur', function(){
  movement.left = false;
  movement.up = false;
  movement.right = false;
  movement.down = false;
});
