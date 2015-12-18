var fc = require('fc')
var center = require('ctx-translate-center')
var QuadTree = require('./quadtree')


QuadTree.QuadTreeNode.prototype.render = function render(ctx) {
  var r = this.radius;
  var x = this.center[0];
  var y = this.center[1];

  this.children.forEach(function(child) {
    child && child.render(ctx);
  })

  ctx.strokeStyle = 'hsl(9, 100%, 63%)'
  ctx.fillStyle = 'hsla(210, 100%, 63%, .65)'

  if (this.leaf && this.occupied) {
    ctx.fillRect(x-r + 2, y-r + 2, r*2 - 4, r*2 - 4);
  } else if (!this.leaf) {
    ctx.beginPath()
      ctx.moveTo(x - r + 2, y);
      ctx.lineTo(x - 2, y);
      ctx.moveTo(x + 2, y);
      ctx.lineTo(x + r - 2, y);

      ctx.moveTo(x, y - r + 2);
      ctx.lineTo(x, y - 2);
      ctx.moveTo(x, y + 2);
      ctx.lineTo(x, y + r - 2);

    ctx.stroke()

    ctx.fillStyle = 'hsl(350, 100%, 63%)'
    ctx.fillRect(x-1, y-1, 2, 2)
  }
}

var tree = new QuadTree([0, 0])

tree.add(10, 5)
tree.add(20, 5)
tree.add(40, 5)
tree.add(60, 5)
tree.add(80, 5)
tree.add(100, 5)
tree.add(120, 5)
tree.add(240, 5)



var ctx = fc(function() {
  ctx.clear();

  center(ctx)
  ctx.scale(1, -1);

  tree.root.render(ctx)

  var r = tree.root.radius;
  var x = tree.root.center[0];
  var y = tree.root.center[1];
  ctx.strokeStyle = 'hsla(90, 100%, 63%, 1)'

  ctx.strokeRect(x-r, y-r, r*2, r*2);
})
