const { randomPosition, randomColor } = require('./util');

const Game = function() {
  this.gift = null;
}

Game.prototype.startGift = function(){
  setInterval( () => this.generateGift(), 5000);
}

Game.prototype.generateGift = function(){
  this.gift = randomPosition();
}

Game.prototype.calcState = function(players){
  const game = this;
  if(!game.gift){
    return;
  }
  players.forEach(function(player){  
    if(!game.gift){
      return;
    }
    const distance = Math.pow(player.position.x - game.gift.x, 2) + Math.pow(player.position.y - game.gift.y, 2);
    if(distance < 100) {
      player.scoreUp();
      game.gift = null;
    }
  })
}

module.exports = Game;
