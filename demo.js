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

// tree.add(10, 5)
// tree.add(20, 5)
// tree.add(40, 5)
// tree.add(60, 5)
// tree.add(80, 5)
// tree.add(100, 5)
// tree.add(120, 5)
// tree.add(240, 5)
// tree.add(240, 50)

var mouse = {
  down: false,
  diry: false,
  moved: false,
  pos: [0, 0],
  add: function(e) {
    if (this.dirty) {
      tree.toggle(this.pos[0], this.pos[1]);
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

    if (this.pos[0] !== x || this.pos[1] !== y) {
      this.dirty = true;
      this.pos[0] = x;
      this.pos[1] = y;
    }
  },
  render: function(ctx) {
    ctx.save()
      ctx.translate(this.pos[0], this.pos[1])
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

var ctx = fc(function() {
  ctx.clear();

  center(ctx)
  ctx.scale(1, -1);

  tree.root.render(ctx)

  var r = tree.root.radius;
  var x = tree.root.center[0];
  var y = tree.root.center[1];
  ctx.strokeStyle = 'hsla(90, 100%, 63%, .75)'

  ctx.strokeRect(x-r, y-r, r*2, r*2);

  mouse.render(ctx)
})
