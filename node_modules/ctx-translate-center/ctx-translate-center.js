module.exports = center;

function center(ctx) {
  var w = (ctx.canvas.width/2)|0;
  var h = (ctx.canvas.height/2)|0;

  ctx.translate(w, h);
}
