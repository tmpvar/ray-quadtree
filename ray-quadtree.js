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
  var i = x < y ? 0 : 1
  return exitLookup[quad][i];
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

function processSubtree(mask, tx0, ty0, tx1, ty1, node, visit, depth, path) {
  path = path || []
  var mx = (tx0 + tx1) * 0.5;
  var my = (ty0 + ty1) * 0.5;

  // if (tx1 < 0 && ty1 < 0) {
  //   return false;
  // }
  var quad = first(tx0, ty0, mx, my);

  if (visit(node, tx0, ty0, depth, path)) {
    return true;
  }

  while (quad < 4) {
    var masked = quad ^ mask;
    var child = node.children[masked];
    if (!child) {
      console.warn('skip:', path.concat(masked).join(', '));
    }
    switch (quad) {
      case 0:
        if (child && processSubtree(mask, tx0, ty0, mx, my, child, visit, depth+1, path.concat(masked))) {
          return true;
        }
        quad = next(quad, mx, my);
      break;

      case 1:
        if (child && processSubtree(mask, mx, ty0, tx1, my, child, visit, depth+1, path.concat(masked))) {
          return true;
        }
        quad = next(quad, tx1, my);
      break;

      case 2:
        if (child && processSubtree(mask, tx0, my, mx, ty1, child, visit, depth+1, path.concat(masked))) {
          return true;
        }
        quad = next(quad, mx, ty1);
      break;

      case 3:
        if (child && processSubtree(mask, mx, my, tx1, ty1, child, visit, depth+1, path.concat(masked))) {
          return true;
        }
        quad = 4;
      break;
    }
  }
}

function processSubtreeHorizontal(ro, tx0, ty0, tx1, ty1, node, visit, depth) {
  if (visit(node, tx0, ty0, depth, quad)) {
    return true
  }

  var txm = (tx0 + tx1) * 0.5;
  var quad = (txm >= 0 ? 0 : 1) | (ro[1] >= node.center[1] ? 2 : 0);
  var child = node.children[quad];

  if (child && processSubtreeHorizontal(ro, txm, ty0, tx1, ty1, child, visit, depth+1)) {
    return true;
  }

  if (!(quad & 1)) {
    child = node.children[quad + 1];
    if (child && processSubtreeHorizontal(ro, txm, ty0, tx1, ty1, child, visit, depth+1)) {
      return true;
    }
  }
}

function processSubtreeVertical(ro, tx0, ty0, tx1, ty1, node, visit, depth) {
  if (!node.occupied) {
    return false;
  }

  if (visit(node, tx0, ty0, depth, quad)) {
    return true
  }

  var tym = (ty0 + ty1) * 0.5;
  var quad = (ro[0] >= node.center[0] ? 1 : 0) | (tym >= 0 ? 0 : 2);
  console.log(depth, quad)
  var child = node.children[quad];

  // TODO: test for occupancy
  if (child && processSubtreeVertical(ro, tx0, tym, tx1, ty1, child, visit, depth+1)) {
    return true;
  }

  if (quad < 2) {
    child = node.children[quad + 2];
    return child && processSubtreeVertical(ro, tx0, tym, tx1, ty1, child, visit, depth+1);
  }
}

function rayQuadtree(ctx, origin, dir, quadtree, out, visit) {
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

ctx.beginPath()
  ctx.arc(rox, roy, 2, 0, Math.PI*2, false)
  var far = rayAtTime([rox, roy], [dx, dy], 10000);
  ctx.moveTo(rox, roy);
  ctx.lineTo(far[0], far[1])
  ctx.fillStyle = ctx.strokeStyle = 'yellow'
  ctx.fill()
  ctx.stroke()

  var idir = [1/dx, 1/dy];

  var tx0 = (bounds[0][0] - rox) * idir[0];
  var ty0 = (bounds[0][1] - roy) * idir[1];
  var tx1 = (bounds[1][0] - rox) * idir[0];
  var ty1 = (bounds[1][1] - roy) * idir[1];
  if (max(tx0,ty0) < min(tx1,ty1)) {
    if (!isFinite(ty0)) {
      return processSubtreeHorizontal(origin, tx0, ty0, tx1, ty1, root, visit, 0);
    } else if (!isFinite(tx0)) {
      return processSubtreeVertical(origin, tx0, ty0, tx1, ty1, root, visit, 0);
    } else {
      return processSubtree(mask, tx0, ty0, tx1, ty1, root, visit, 0);
    }
  } else {
    console.log('no isect')
  }

  return null;
}
