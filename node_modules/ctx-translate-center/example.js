var center = require('./ctx-translate-center');

var ctx = document.createElement('canvas').getContext('2d');

document.body.appendChild(ctx.canvas);

ctx.fillStyle = "black";
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

center(ctx);

ctx.beginPath();
  ctx.arc(0, 0, 20, 0, Math.PI*2, false);
  ctx.fillStyle = "orange";
  ctx.fill()
