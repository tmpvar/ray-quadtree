var TAU = Math.PI*2;

module.exports = circle;

function circle(ctx, x, y, r, reverse) {
  ctx.moveTo(x+r, y);
  ctx.arc(x, y, r, 0, TAU, !!reverse);
}
