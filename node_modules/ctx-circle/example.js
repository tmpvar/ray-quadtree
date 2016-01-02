// run this with:
//   beefy example.js --open


var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var circle = require('./ctx-circle');
document.body.appendChild(canvas);

canvas.width = 200;
canvas.height = 200;

ctx.beginPath()
  circle(ctx, 100, 100, 50);
  circle(ctx, 100, 100, 30, true);
  ctx.strokeStyle = "red";
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.stroke();
