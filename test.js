var test = require('tape')
var QuadTree = require('./quadtree')
var rayquad = require('./ray-quadtree')
var slab = require('ray-aabb-slab')

test('quadtree - quadrant', function(t) {

  var qt = new QuadTree([0, 0])

  t.equal(qt.root.quadrant(-20, -20), 0, 'lower left')
  t.equal(qt.root.quadrant( 20, -20), 1, 'lower right')
  t.equal(qt.root.quadrant(-20,  20), 2, 'upper left')
  t.equal(qt.root.quadrant( 20,  20), 3, 'upper right')

  t.end()
})

test('quadtree - add block', function(t) {
  var qt = new QuadTree([0, 0])
  var n = qt.add(20, 20)
  t.equal(n, qt.root.children[3], 'same')
  t.equal(qt.root.occupied, 1, 'occupied by one node')
  t.end()
})

test('ray quadtree - no isect', function(t) {
  var qt = new QuadTree([0, 0])
  t.equal(rayquad([-20, 0], [-1, 0], qt), false, 'no intersection')
  t.end()
})

test('ray quadtree - isect, no result', function(t) {
  var qt = new QuadTree([0, 0])
  t.equal(rayquad([-20, 0], [1, 0], qt), false, 'no intersection')
  t.end()
})

test('ray quadtree - isect, no result', function(t) {
  var qt = new QuadTree([0, 0])
  qt.add(0, -60)
  qt.add(20, 60)
  var expects = [
    [0, 0],
    [1, 2],
    [1, 3],
    [2, 2]
  ];

  rayquad([-20, 0], [1, 0], qt, visit)
  function visit(origin, node, x, y, depth) {
    var expect = expects.shift()
    t.equal(depth, expect[0], 'depth is ' + expect[0]);
  }

  t.end()
})

test('ray quadtree - isect, no result', function(t) {
  var qt = new QuadTree([10, 10])
  qt.add(0, 0)
  t.ok(!rayquad([-20, -20], [1, 0], qt))
  t.end()
})
