var isect = require('ray-aabb-slab');

module.exports = rayQuadtree

var scratch = [0, 0]

function rayQuadtree(origin, dir, quadtree) {
  var idir = [1/dir[0], 1/dir[1]];

  if (isect(origin, idir, quadtree.root.bounds, scratch)) {

    // TODO: actual traversal goes here
    return true;
  }

  return false;
}
