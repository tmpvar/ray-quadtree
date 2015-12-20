var isect = require('ray-aabb-slab');

module.exports = rayQuadtree;
rayQuadtree.rayAtTime = rayAtTime;

var scratch = [null, null];

function rayAtTime(o, d, t) {
  return [
    o[0] + d[0] * t,
    o[1] + d[1] * t,
    o[2] + d[2] * t
  ];
}

function rayQuadtree(origin, dir, quadtree, out) {
  out = out || scratch;
  var idir = [1/dir[0], 1/dir[1]];

  if (isect(origin, idir, quadtree.root.bounds, scratch)) {

    out[0] = rayAtTime(origin, dir, scratch[0]);
    out[1] = rayAtTime(origin, dir, scratch[1]);

    // TODO: actual traversal goes here
    return true;
  }

  return false;
}
