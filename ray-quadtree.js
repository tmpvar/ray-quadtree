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
  if (visit(ro, node, tx0, ty0, depth, quad)) {
    return true
  }

  var txm = (tx0 + tx1) * 0.5;
  var quad = (txm >= 0 ? 0 : 1) | (ro[1] >= node.center[1] ? 2 : 0);
  var child = node.children[quad ^ mask];

  if (child && processSubtreeHorizontal(ro, mask, tx0, ty0, tx1, ty1, child, visit, depth+1)) {
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

function rayQuadtree(origin, dir, quadtree, visit) {
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
  }
  return false;
}
