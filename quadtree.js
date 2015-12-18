module.exports = QuadTree;

QuadTree.leafRadius = 10

function QuadTree(center, radius) {
  this.root = new QuadTreeNode(center, radius)
}

QuadTree.prototype.add = function add(x, y) {
  // ensure the quadtree will contain the new point
  while (!this.root.contains(x, y)) {
    var child = this.root;
    this.root = new QuadTreeNode(child.nearestCorner(x, y), child.radius * 2)
  }

  // // trace down into the quadtree and place the point in the correct cell
  var node = this.root
  while (!node.leaf) {

    var quad = node.quadrant(x, y)
    if (!node.children[quad]) {
      var r = node.radius/2
      node.occupied++;
      node = node.children[quad] = new QuadTreeNode(node.quadrantCenter(x, y), r)
    }
  }

  return node;
}


function QuadTreeNode(center, radius) {
  this.children = [null, null, null, null];
  this.center = center;
  this.radius = radius || QuadTree.leafRadius;
  this.bounds = [
    [center[0] - this.radius, center[1] - this.radius],
    [center[0] + this.radius, center[1] + this.radius]
  ];
  this.occupied = 0;

  this.leaf = this.radius <= QuadTree.leafRadius;
}

QuadTreeNode.prototype.contains = function contains(x, y) {
  var lb = this.bounds[0];
  var ub = this.bounds[1];
  return x > lb[0] && x < ub[0] && y > lb[1] && y < ub[1];
}

//
// +---+
// |2|3|
// +-+-+
// |0|1|
// +-+-+
//

QuadTreeNode.prototype.quadrant = function quadrant(x, y) {
  return (x > this.center[0] ? 1 : 0) | (y > this.center[1] ? 2 : 0)
}

QuadTreeNode.prototype.quadrantCenter = function quadrantCenter(x, y) {
  var r = this.radius/2
  return [
    x < this.center[0] ? -r : r,
    y < this.center[1] ? -r : r
  ]
}

QuadTreeNode.prototype.nearestCorner = function nearestCorner(x, y) {
  return [
    x < this.center[0] ? -this.radius : this.radius,
    y < this.center[1] ? -this.radius : this.radius
  ]
}
