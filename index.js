(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

  // ctx.save()
  //   ctx.scale(1, -1)
  //   ctx.fillStyle = '#aaa'
  //   ctx.font = "14px monospace"
  //   ctx.fillText(this.occupied, this.center[0] - 5, -this.center[1]);
  // ctx.restore()

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
tree.add(20, 60)
tree.add(40, 80)
tree.add(100, -20)

tree.add(180, 100)
tree.add(200, 80)
// tree.add(500, 260)


var mouse = {
  down: false,
  diry: false,
  moved: false,
  rotation: -.75,
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

function visitNode(origin, node, tx, ty, depth, path) {
  var ret = false;

  // ctx.beginPath()
  //   circle(ctx, node.center[0], node.center[1], 5);
  //   ctx.fillStyle = ctx.strokeStyle = "#444"
  // ctx.closePath()
  // ctx.stroke()

  ctx.save()
    ctx.translate(node.center[0], node.center[1])
    if (!node.leaf) {
      if (node.occupied) {
        // ctx.strokeStyle = "green"
      } else {
        ctx.strokeStyle = "red"
      }

      // ctx.strokeRect(-node.radius + 5, -node.radius + 5, node.radius*2 - 10, node.radius*2 - 10);
    } else {
      ctx.fillStyle = 'hsla(210, 90%, 63%, 1)'
      ctx.fillRect(-node.radius, -node.radius, node.radius*2, node.radius*2)
      ret = true;
    }

  ctx.restore();

  if (node.leaf) {
    ctx.beginPath()
      ctx.moveTo(origin[0], origin[1])
      ctx.lineTo(
        origin[0] + ray.direction[0] * Math.max(tx, ty),
        origin[1] + ray.direction[1] * Math.max(tx, ty)
      )
      ctx.strokeStyle = 'hsla(25, 100%, 68%, .5)';
      ctx.stroke()
  }

  return ret;
}

var ctx = fc(function() {
  ctx.clear();
  traversalPath.length = 0;

  center(ctx)
  ctx.scale(1, -1);

  tree.root.render(ctx)

  var r = tree.root.radius;
  var x = tree.root.center[0];
  var y = tree.root.center[1];
  ctx.strokeStyle = 'hsla(90, 100%, 63%, .75)'

  // ctx.strokeRect(x-r, y-r, r*2, r*2);

  var out = [0, 0]

  ray.origin[0] = x + Math.sin(mouse.rotation) * r * 1.5;
  ray.origin[1] = y + Math.cos(mouse.rotation) * r * 1.5;

  var dx = x - ray.origin[0]
  var dy = y - ray.origin[1]
  var il = 1/Math.sqrt(dx*dx + dy*dy)
  ray.direction[0] = dx * il;
  ray.direction[1] = dy * il;

  var dist = 400;
  var skewed = [-ray.direction[1], ray.direction[0]]

  for (var i=-dist; i<=dist; i++) {
    var origin = [
      ray.origin[0] + skewed[0] * i * .25,
      ray.origin[1] + skewed[1] * i * .25
    ]


    var r = isect(origin, ray.direction, tree, out, visitNode)
    ctx.beginPath()
    circle(ctx, origin[0], origin[1], 1)
    ctx.moveTo(origin[0], origin[1])
    ctx.strokeStyle = 'hsla(25, 100%, 68%, .5)';

    if (r) {
      ctx.lineTo(out[0][0], out[0][1]);
      dline(ctx, out[0], out[1], 4)
      ctx.stroke()
        circle(ctx, out[0][0], out[0][1], 3)
        circle(ctx, out[1][0], out[1][1], 3)
    } else {
      var end = isect.rayAtTime(origin, ray.direction, 100000)
      ctx.lineTo(end[0], end[1])

    }
    ctx.stroke()
  }

  mouse.render(ctx)
})

},{"./quadtree":7,"./ray-quadtree":8,"ctx-circle":2,"ctx-dashed-line":3,"ctx-translate-center":4,"fc":5}],2:[function(require,module,exports){
var TAU = Math.PI*2;

module.exports = circle;

function circle(ctx, x, y, r, reverse) {
  ctx.moveTo(x+r, y);
  ctx.arc(x, y, r, 0, TAU, !!reverse);
}

},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
module.exports = center;

function center(ctx) {
  var w = (ctx.canvas.width/2)|0;
  var h = (ctx.canvas.height/2)|0;

  ctx.translate(w, h);
}

},{}],5:[function(require,module,exports){
;(function() {
  var performance = window.performance || {}
  var performanceNow =
    performance.now        ||
    performance.now        ||
    performance.mozNow     ||
    performance.msNow      ||
    performance.oNow       ||
    performance.webkitNow  ||
    function(){ return (new Date()).getTime() }
  performanceNow = performanceNow.bind(performance)

  // Fullscreen canvas
  function fc(fn, autorun, dimensions) {
    document.body.style.margin = "0px";
    document.body.style.padding = "0px";

    var canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    canvas.style.position = 'absolute';
    canvas.style.left = '0px';
    canvas.style.top = '0px';

    var ctx;
    dimensions = dimensions || 2;

    if (dimensions === 2) {
      ctx = canvas.getContext('2d');
    } else if (dimensions === 3) {
      ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }

    if (!ctx) {
      return;
    }

    var last = performanceNow(), request;

    function requestFrame() {
      if (request === null) {
        request = requestAnimationFrame(tick);
      }
    }

    function tick() {
      request = null;
      var time = performanceNow();
      var delta = time-last;
      last = time;

      ctx.reset();

      dimensions === 2 && ctx.save();

      fn && fn.call(ctx, delta);

      dimensions === 2 && ctx.restore();
      if (autorun) {
        requestFrame();
      }
    }

    if (dimensions === 2) {
      ctx.reset = function fc_reset() {
        canvas.width = 0;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      ctx.clear = function fc_clear(color) {
        var orig = ctx.fillStyle;
        ctx.fillStyle = color || "#223";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = orig;
      };
    } else {
      ctx.reset = function fc_reset() {
        if (canvas.width !== window.innerWidth) {
          canvas.width = window.innerWidth;
        }

        if (canvas.height !== window.innerHeight) {
          canvas.height = window.innerHeight;
        }
      }
    }

    setTimeout(tick, 0);

    ctx.dirty = function fc_dirty() {
      last = performanceNow();
      requestFrame();
    };

    ctx.stop = function fc_stop() {
      autorun = false;
      request && cancelAnimationFrame(request);
      request = null;
    };

    ctx.start = function fc_start() {
      autorun = true;
      requestFrame();
    };

    (window.attachEvent || window.addEventListener)('resize', ctx.dirty);

    // resize to fullscreen immediately
    ctx.reset();

    ctx.canvas = canvas;
    return ctx;
  };

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = fc;
  }

  if (typeof window !== 'undefined') {
    window.fc = window.fc || fc;
  }
})();

},{}],6:[function(require,module,exports){
module.exports = raySlab;

var min = Math.min;
var max = Math.max;

function raySlab(origin, invdir, aabb, out) {
  var tmin, tmax, t1, t2, l = aabb[0], u = aabb[1];
  var ix = invdir[0], iy = invdir[1], iz = invdir[2];
  var ox = origin[0], oy = origin[1], oz = origin[2];

  t1 = (l[0] - ox) * ix;
  t2 = (u[0] - ox) * ix;

  tmin = min(t1, t2)
  tmax = max(t1, t2)

  t1 = (l[1] - oy) * iy;
  t2 = (u[1] - oy) * iy;

  tmin = max(tmin, min(t1, t2))
  tmax = min(tmax, max(t1, t2))

  if (origin.length === 3) {
    t1 = (l[2] - oz) * iz;
    t2 = (u[2] - oz) * iz;

    tmin = max(tmin, min(t1, t2))
    tmax = min(tmax, max(t1, t2))
  }

  if (tmax >= max(0.0, tmin)) {
    out[0] = tmin;
    out[1] = tmax;
    return out;
  }
  return null;
}

},{}],7:[function(require,module,exports){
module.exports = QuadTree;

QuadTree.leafRadius = 10;
QuadTree.Node = QuadTreeNode;

function QuadTree(center, radius) {
  this.root = new QuadTreeNode(center, radius)
}

QuadTree.prototype.add = function add(x, y) {
  // ensure the quadtree will contain the new point
  while (!this.root.contains(x, y)) {
    var child = this.root;
    this.root = new QuadTreeNode(child.nearestCorner(x, y), child.radius * 2);
    var childQuad = this.root.quadrant(child.center[0], child.center[1])
    if (child.occupied) {
      this.root.children[childQuad] = child;
      this.root.occupied = child.occupied;
      child.parent = this.root;
    }
  }

  // // trace down into the quadtree and place the point in the correct cell
  var node = this.root
  while (!node.leaf) {
    var quad = node.quadrant(x, y);
    if (!node.children[quad]) {
      node = node.children[quad] = new QuadTreeNode(
        node.quadrantCenter(x, y),
        node.radius/2,
        node
      );
    } else {
      node = node.children[quad];
    }
  }

  node.setOccupied(true)
  return node;
}

QuadTree.prototype.remove = function remove(x, y) {
  if (!this.root.contains(x, y)) {
    return
  }

  // // trace down into the quadtree and place the point in the correct cell
  var node = this.root
  while (!node.leaf) {
    var quad = node.quadrant(x, y);
    if (!node.children[quad]) {
      node = node.children[quad] = new QuadTreeNode(
        node.quadrantCenter(x, y),
        node.radius/2,
        node
      );
    } else {
      node = node.children[quad];
    }
  }

  node.setOccupied(false)

  return node;
}

QuadTree.prototype.cleanRoot = function cleanRoot() {
  var activeChildren = this.root.getActiveChildren();
  while (activeChildren.length === 1) {
    this.root = activeChildren[0];
    this.root.parent = null;
    activeChildren = this.root.getActiveChildren();
  }
}

QuadTree.prototype.toggle = function toggle(x, y) {
  if (!this.root.contains(x, y)) {
    return this.add(x, y)
  }

  // // trace down into the quadtree and place the point in the correct cell
  var node = this.root
  while (!node.leaf) {
    var quad = node.quadrant(x, y);
    if (!node.children[quad]) {
      node = node.children[quad] = new QuadTreeNode(
        node.quadrantCenter(x, y),
        node.radius/2,
        node
      );
    } else {
      node = node.children[quad];
    }
  }

  node.setOccupied(!node.occupied)
  return node;
}



function QuadTreeNode(center, radius, parent) {
  this.children = [null, null, null, null];
  this.center = center;
  this.radius = radius || QuadTree.leafRadius;
  this.bounds = [
    [center[0] - this.radius, center[1] - this.radius],
    [center[0] + this.radius, center[1] + this.radius]
  ];
  this.occupied = 0;

  this.leaf = this.radius <= QuadTree.leafRadius;
  this.parent = parent || null;
}

QuadTreeNode.prototype.contains = function contains(x, y) {
  var lb = this.bounds[0];
  var ub = this.bounds[1];
  return x > lb[0] && x < ub[0] && y > lb[1] && y < ub[1];
}

QuadTreeNode.prototype.getActiveChildren = function getActiveChildren() {
  return this.children.filter(function(child) {
    return child && child.occupied > 0;
  })
}

QuadTreeNode.prototype.removeChild = function removeChild(child) {
  for (var i=0; i<this.children.length; i++) {
    if (this.children[i] === child) {
      this.children[i] = null;
    }
  }
}

QuadTreeNode.prototype.setOccupied = function markOccupied(bool) {
  var node = this;
  while (node) {
    node.occupied += bool ? 1 : -1;
    if (!node.occupied && node.parent) {
      node.parent.removeChild(node)
    }

    node = node.parent;
  }
}

//
// +---+
// |2|3|
// +-+-+
// |0|1|
// +-+-+
//

QuadTreeNode.prototype.quadrant = function quadrant(x, y) {
  return (x >= this.center[0] ? 1 : 0) | (y >= this.center[1] ? 2 : 0)
}

QuadTreeNode.prototype.quadrantCenter = function quadrantCenter(x, y) {
  var r = this.radius / 2;
  return [
    x < this.center[0] ? this.center[0] - r : this.center[0] + r,
    y < this.center[1] ? this.center[1] - r : this.center[1] + r
  ]
}

QuadTreeNode.prototype.nearestCorner = function nearestCorner(x, y) {
  var r = this.radius
  return [
    x < this.center[0] ? this.center[0] - r : this.center[0] + r,
    y < this.center[1] ? this.center[1] - r : this.center[1] + r
  ]
}


},{}],8:[function(require,module,exports){
var isect = require('ray-aabb-slab');

module.exports = rayQuadtree;
rayQuadtree.rayAtTime = rayAtTime;

var scratch = [null, null];
var min = Math.min;
var max = Math.max;

function rayAtTime(o, d, t) {
  return [
    o[0] + d[0] * t,
    o[1] + d[1] * t
  ];
}

var exitLookup = [
  // [x, y]
  [1, 2],
  [4, 3],
  [3, 4],
  [4, 4]
];

function next(quad, x, y) {
  return exitLookup[quad][x <= y ? 0 : 1];
}

/*
        o-------o-------o
        |       |       |
        |       |       |
        |       |       |
  my -- o-------o-------o
        |       |       |
        |       |       |
        |       |       |
  y0 -- o-------o-------o
        |       |
        x0      mx
*/

function first(x, y, mx, my) {
  // x entry plane
  if (x > y) {
    if (x < my) {
      return 0;
    } else {
      return 2;
    }
  // y entry plane
  } else {
    if (y < mx) {
      return 0;
    } else {
      return 1;
    }
  }
}

function processSubtree(ro, mask, tx0, ty0, tx1, ty1, node, visit, depth) {
  var mx = (tx0 + tx1) * 0.5;
  var my = (ty0 + ty1) * 0.5;

  var quad = first(tx0, ty0, mx, my);

  if (visit(ro, node, tx0, ty0, depth)) {
    return true;
  }

  while (quad < 4) {
    var masked = quad ^ mask;
    var child = node.children[masked];

    switch (quad) {
      case 0:
        if (child && processSubtree(ro, mask, tx0, ty0, mx, my, child, visit, depth+1)) {
          return true;
        }
        quad = next(quad, mx, my);
      break;

      case 1:
        if (child && processSubtree(ro, mask, mx, ty0, tx1, my, child, visit, depth+1)) {
          return true;
        }
        quad = next(quad, tx1, my);
      break;

      case 2:
        if (child && processSubtree(ro, mask, tx0, my, mx, ty1, child, visit, depth+1)) {
          return true;
        }
        quad = next(quad, mx, ty1);
      break;

      case 3:
        if (child && processSubtree(ro, mask, mx, my, tx1, ty1, child, visit, depth+1)) {
          return true;
        }
        quad = 4;
      break;
    }
  }
}

function processSubtreeHorizontal(ro, mask, tx0, ty0, tx1, ty1, node, visit, depth) {
  if (visit(node, tx0, ty0, depth, quad)) {
    return true
  }

  var txm = (tx0 + tx1) * 0.5;
  var quad = (txm >= 0 ? 0 : 1) | (ro[1] >= node.center[1] ? 2 : 0);
  var child = node.children[quad ^ mask];

  if (child && processSubtreeHorizontal(ro, mask, txm, ty0, tx1, ty1, child, visit, depth+1)) {
    return true;
  }

  if (!(quad & 1)) {
    child = node.children[(quad + 1) ^ mask];
    if (child && processSubtreeHorizontal(ro, mask, txm, ty0, tx1, ty1, child, visit, depth+1)) {
      return true;
    }
  }
}

function processSubtreeVertical(ro, mask, tx0, ty0, tx1, ty1, node, visit, depth) {
  if (!node.occupied) {
    return false;
  }

  if (visit(ro, node, -Infinity, ty0, depth, quad)) {
    return true
  }

  var tym = (ty0 + ty1) * 0.5;
  var quad = (ro[0] >= node.center[0] ? 1 : 0) | (tym >= 0 ? 0 : 2);

  var child = node.children[quad^mask];

  // TODO: test for occupancy
  if (child && processSubtreeVertical(ro, mask, tx0, ty0, tx1, tym, child, visit, depth+1)) {
    console.log('here')
    return true;
  }
  child = node.children[(quad + 2) ^ mask];
  return child && processSubtreeVertical(ro, mask, tx0, tym, tx1, ty1, child, visit, depth+1);
}

function rayQuadtree(origin, dir, quadtree, out, visit) {
  var dx = dir[0];
  var dy = dir[1];
  var rox = origin[0];
  var roy = origin[1];
  var mask = 0;
  var root = quadtree.root;
  var bounds = root.bounds;

  if (dx < 0) {
    dx = -dx;
    mask += 1;
    rox = bounds[0][0] + (bounds[1][0] - rox);
  }

  if (dy < 0) {
    mask += 2;
    dy = -dy;
    roy = bounds[0][1] + (bounds[1][1] - roy);
  }

  var idir = [1/dx, 1/dy];

  var tx0 = (bounds[0][0] - rox) * idir[0];
  var ty0 = (bounds[0][1] - roy) * idir[1];
  var tx1 = (bounds[1][0] - rox) * idir[0];
  var ty1 = (bounds[1][1] - roy) * idir[1];
  if (max(tx0,ty0) < min(tx1,ty1)) {
    if (!isFinite(ty0)) {
      return processSubtreeHorizontal(origin, mask, tx0, ty0, tx1, ty1, root, visit, 0);
    } else if (!isFinite(tx0)) {
      return processSubtreeVertical(origin, mask, tx0, ty0, tx1, ty1, root, visit, 0);
    } else {
      return processSubtree(origin, mask, tx0, ty0, tx1, ty1, root, visit, 0);
    }
  } else {
    console.log('no isect')
  }

  return null;
}

},{"ray-aabb-slab":6}]},{},[1]);
