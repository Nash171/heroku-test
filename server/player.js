const { randomPosition, randomColor } = require('./util');

const STEP_SIZE = 3;
const FRAME_WIDTH = 600;
const FRAME_HEIGHT = 600;

const Player = function(socketId) {
  this.socketId = socketId;
  this.position = randomPosition();
  this.color = randomColor();
  this.score = 0;
}

Player.prototype.move = function(move) {
  if (move.left) {
    this.position.x = (this.position.x + FRAME_WIDTH - STEP_SIZE) % FRAME_WIDTH;
  }
  if (move.up) {
    this.position.y = (this.position.y + FRAME_HEIGHT - STEP_SIZE) % FRAME_HEIGHT;
  }
  if (move.right) {
    this.position.x = (this.position.x + STEP_SIZE) % FRAME_WIDTH;
  }
  if (move.down) {
    this.position.y = (this.position.y + STEP_SIZE) % FRAME_HEIGHT;
  }
}

Player.prototype.scoreUp = function() {
  this.score++;
}

module.exports = Player;
