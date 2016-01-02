module.exports = dashedLine;

function dashedLine(ctx, start, end, dashLen) {
  var sx, sy, ex, ey;
  if (Array.isArray(start)) {
    sx = start[0];
    sy = start[1];
  } else {
    sx = start.x;
    sy = start.y;
  }

  if (Array.isArray(end)) {
    ex = end[0];
    ey = end[1];
  } else {
    ex = end.x;
    ey = end.y;
  }

  if (dashLen == undefined) dashLen = 2;
  ctx.moveTo(sx, sy);

  var dX = ex - sx;
  var dY = ey - sy;
  var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
  var dashX = dX / dashes;
  var dashY = dY / dashes;

  var q = 0;
  while (q++ < dashes) {
    sx += dashX;
    sy += dashY;
    ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](sx, sy);
  }
  ctx[q % 2 == 0 ? 'moveTo' : 'lineTo'](sx, sy);

  return ctx;
};
