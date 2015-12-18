var test = require('tape')
var QuadTree = require('./quadtree')
var rayquad = require('./ray-quadtree')

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
