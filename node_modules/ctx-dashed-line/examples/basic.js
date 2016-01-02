var dashedLine = require('../dashed-line');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

ctx.lineCap = "round";

ctx.beginPath();
  dashedLine(ctx, [10, 10], [100, 100], 5);
  dashedLine(ctx, [10, 10], [100, 10], 5);
  dashedLine(ctx, [100, 10], [100, 100], 5);

  ctx.lineWidth = 2;
  ctx.stroke();
