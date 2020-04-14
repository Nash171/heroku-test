function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomPosition() {
  return {
    x: randomInt(0, 600),
    y: randomInt(0, 600)
  }
}

function randomColor() {
  return `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`
}

module.exports = {
  randomPosition,
  randomColor
}
