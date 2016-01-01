var fc = require('fc')
var center = require('ctx-translate-center')
var QuadTree = require('./quadtree')
var circle = require('ctx-circle')
var dline = require('ctx-dashed-line')
var isect = require('./ray-quadtree')

QuadTree.Node.prototype.render = function render(ctx) {
  var r = this.radius;
  var x = this.center[0];
  var y = this.center[1];

  this.children.forEach(function(child) {
    child && child.render(ctx);
  })

  ctx.save()
    ctx.scale(1, -1)
    ctx.fillStyle = '#aaa'
    ctx.font = "14px monospace"
    ctx.fillText(this.occupied, this.center[0] - 5, -this.center[1]);
  ctx.restore()

  if (this.leaf && this.occupied) {
    ctx.strokeStyle = 'hsl(210, 100%, 63%)'
    ctx.fillStyle = 'hsla(210, 90%, 63%, .65)'
    ctx.fillRect(x-r + 2, y-r + 2, r*2 - 4, r*2 - 4);
  } else if (!this.leaf) {
    ctx.save()
      ctx.lineWidth = .5
      ctx.strokeStyle = 'rgba(100, 100, 100, .6)'
      ctx.beginPath()
        ctx.moveTo(x - r + 1, y);
        ctx.lineTo(x + r - 1, y);

        ctx.moveTo(x, y - r + 1);
        ctx.lineTo(x, y + r - 1);

      ctx.stroke()
    ctx.restore()
  }
}

var tree = new QuadTree([0, 0])

tree.add(0, -60)
// tree.add(20, 60)
tree.add(180, 100)
// tree.add(200, 80)
// tree.add(500, 260)


var mouse = {
  down: false,
  diry: false,
  moved: false,
  rotation: 0,
  position: [0, 0],
  add: function(e) {
    if (this.dirty) {
      tree.toggle(this.position[0], this.position[1]);
      tree.cleanRoot()
      this.dirty = false;
    }
    ctx.dirty()
  },
  pos: function(e) {
    var hw = (window.innerWidth/2)|0;
    var hh = (window.innerHeight/2)|0;
    var x = Math.round((e.clientX - hw) / 20) * 20
    var y = Math.round((window.innerHeight - (e.clientY + hh)) / 20) * 20

    if (this.position[0] !== x || this.position[1] !== y) {
      this.dirty = true;
      this.position[0] = x;
      this.position[1] = y;
    }
  },
  render: function(ctx) {
    ctx.save()
      ctx.translate(this.position[0], this.position[1])
      ctx.strokeStyle = 'red'
      ctx.strokeRect(-10, -10, 20, 20)
    ctx.restore()
  }
}

window.addEventListener('mousedown', function(e) {
  mouse.down = true;
  mouse.moved = false;
})

window.addEventListener('mousemove', function(e) {
  mouse.pos(e);

  if (mouse.down) {
    mouse.add(e);
    mouse.moved = true;
  }

  ctx.dirty();
})

window.addEventListener('mouseup', function(e) {
  if (!mouse.moved) {
    mouse.dirty = true;
  }
  mouse.add(e);
  mouse.down = false;
})

window.addEventListener('mousewheel', function(e) {
  ctx.dirty()
  // mouse.rotation = e.
  mouse.rotation += e.wheelDelta / 500;
  e.preventDefault()
})

var ray = {
  origin: [-100, -50],
  direction: [0.894427, 0.447214]
}

var traversalPath = [];

function visitNode(node, tx, ty, depth, path) {
  var ret = false;
  path && console.log('path:', path.join(', '))


  ctx.beginPath()
    circle(ctx, node.center[0], node.center[1], 5);
    ctx.fillStyle = ctx.strokeStyle = "#444"
  ctx.closePath()
  ctx.stroke()

  ctx.save()
    ctx.translate(node.center[0], node.center[1])
    if (!node.leaf) {
      if (node.occupied) {
        ctx.strokeStyle = "green"
      } else {
        ctx.strokeStyle = "red"
      }

      ctx.strokeRect(-node.radius + 5, -node.radius + 5, node.radius*2 - 10, node.radius*2 - 10);
    } else {
      ctx.fillStyle = "#f0f";
      ctx.fillRect(-node.radius, -node.radius, node.radius*2, node.radius*2)
      ret = true;
    }

  ctx.restore();

  return ret;
}

var ctx = fc(function() {
  console.clear()
  ctx.clear();
  traversalPath.length = 0;

  center(ctx)
  ctx.scale(1, -1);

  tree.root.render(ctx)

  var r = tree.root.radius;
  var x = tree.root.center[0];
  var y = tree.root.center[1];
  ctx.strokeStyle = 'hsla(90, 100%, 63%, .75)'

  ctx.strokeRect(x-r, y-r, r*2, r*2);

  var out = [0, 0]

  ray.origin[0] = x + Math.sin(mouse.rotation) * r * 1.5;
  ray.origin[1] = y + Math.cos(mouse.rotation) * r * 1.5;

  var dx = x - ray.origin[0]
  var dy = y - ray.origin[1]
  var il = 1/Math.sqrt(dx*dx + dy*dy)
  ray.direction[0] = dx * il;
  ray.direction[1] = dy * il;


  var r = isect(ray.origin, ray.direction, tree, out, visitNode)
  ctx.beginPath()
  circle(ctx, ray.origin[0], ray.origin[1], 1)
  ctx.moveTo(ray.origin[0], ray.origin[1])
  ctx.strokeStyle = 'hsl(260, 100%, 68%)';

  if (r) {
    ctx.lineTo(out[0][0], out[0][1]);
    dline(ctx, out[0], out[1], 4)
    ctx.stroke()
      circle(ctx, out[0][0], out[0][1], 3)
      circle(ctx, out[1][0], out[1][1], 3)
  }

  var end = isect.rayAtTime(ray.origin, ray.direction, 100000)
  ctx.lineTo(end[0], end[1])
  ctx.stroke()

  mouse.render(ctx)

  ctx.save()
    ctx.fillStyle = "#aaa"
    ctx.font = '16px monospace'
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    traversalPath.forEach(function(part, i) {
      ctx.fillText(part.join(' - '), 010, 0);
      ctx.translate(0, 20)
    })
  ctx.restore()
})
