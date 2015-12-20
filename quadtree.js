module.exports = QuadTree;

QuadTree.leafRadius = 10;
QuadTree.QuadTreeNode = QuadTreeNode;

function QuadTree(center, radius) {
  this.root = new QuadTreeNode(center, radius)
}

QuadTree.prototype.add = function add(x, y) {
  // ensure the quadtree will contain the new point
  while (!this.root.contains(x, y)) {
    var child = this.root;
    this.root = new QuadTreeNode(child.nearestCorner(x, y), child.radius * 2);
    var childQuad = this.root.quadrant(child.center[0], child.center[1])
    this.root.children[childQuad] = child;
    this.root.occupied = child.occupied;
    child.parent = this.root;
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
console.log(activeChildren.length)

    this.root = activeChildren[0]
    this.root.parent = null
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
    return child;// && child.occupied > 0;
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
  return (x > this.center[0] ? 1 : 0) | (y > this.center[1] ? 2 : 0)
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
