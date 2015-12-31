var test = require('tape')
var QuadTree = require('./quadtree')
var rayquad = require('./ray-quadtree')
var slab = require('ray-aabb-slab')

// test('quadtree - quadrant', function(t) {

//   var qt = new QuadTree([0, 0])

//   t.equal(qt.root.quadrant(-20, -20), 0, 'lower left')
//   t.equal(qt.root.quadrant( 20, -20), 1, 'lower right')
//   t.equal(qt.root.quadrant(-20,  20), 2, 'upper left')
//   t.equal(qt.root.quadrant( 20,  20), 3, 'upper right')

//   t.end()
// })

// test('quadtree - add block', function(t) {
//   var qt = new QuadTree([0, 0])
//   var n = qt.add(20, 20)
//   t.equal(n, qt.root.children[3], 'same')
//   t.equal(qt.root.occupied, 1, 'occupied by one node')
//   t.end()
// })

// test('ray quadtree - no isect', function(t) {
//   var qt = new QuadTree([0, 0])
//   t.equal(rayquad([-20, 0], [-1, 0], qt), false, 'no intersection')
//   t.end()
// })

// test('ray quadtree - isect, no result', function(t) {
//   var qt = new QuadTree([0, 0])
//   t.equal(rayquad([-20, 0], [1, 0], qt), false, 'no intersection')
//   t.end()
// })

// test('ray quadtree - isect, no result', function(t) {
//   var qt = new QuadTree([0, 0])
//   qt.add(0, -60)
//   qt.add(20, 60)
//   var expects = [
//     [0, 0],
//     [1, 2],
//     [1, 3],
//     [2, 2]
//   ];

//   rayquad([-20, 0], [1, 0], qt, [0, 0], visit)
//   function visit(node, x, y, depth, quad) {
//     var expect = expects.shift()
//     t.equal(depth, expect[0], 'depth is ' + expect[0]);
//     t.equal(quad, expect[1], 'quad is ' + expect[1]);
//   }

//   t.end()
// })

// test('ray quadtree - isect, no result', function(t) {
//   var qt = new QuadTree([10, 10])
//   qt.add(0, 0)
// console.log(qt.root.children)

//   console.log(qt.root.bounds)


//   rayquad([-20, -20], [1, 0], qt, [0, 0], visit)
//   function visit(node, x, y, depth, quad) {
//   }

//   t.end()
// })

/*
var root = {
  children: [0, 1, 2, 3],
  bounds: [[-1,-1], [1, 1]],
  center: [0, 0]
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

root.quadrant = QuadTree.Node.prototype.quadrant.bind(root);

function sameinf(a, b) {
  return a === b ? Infinity : a;
}

function traverse(tx0, ty0, tx1, ty1, node, visit, depth) {
  depth = depth || 0

  if (depth > 0) {
    return
  }

  var mx = (tx0 + tx1) / 2;
  var my = (ty0 + ty1) / 2

  var quad = node.quadrant(tx0, ty0);

  while (quad < 4) {
    var child = node.children[quad];
    // console.log('d:%s q:%s x:(%s, %s, %s) y:(%s, %s, %s)',
    //   depth, quad, tx0, mx, tx1, ty0, my, ty1
    // )
    visit(child, tx0, ty0, depth, quad)
    switch (quad) {
      case 0:
        child && processSubtree(tx0, ty0, mx, my, child, visit, depth+1);
        quad = next(quad, sameinf(mx, tx1), sameinf(my, ty1));
      break;

      case 1:
        child && processSubtree(mx, ty0, tx1, my, child, visit, depth+1);
        quad = next(quad, tx1, sameinf(my, ty1));
      break;

      case 2:
        child && processSubtree(tx0, my, mx, ty1, child, visit, depth+1);
        quad = next(quad, sameinf(mx, tx1), sameinf(my, ty1));
      break;

      case 3:
        child && processSubtree(mx, my, tx1, ty1, child, visit, depth+1);
        quad = next(quad, sameinf(mx, tx1), ty1);
      break;
    }
  }
  return true;
}

traverse(-1, -.5, 1, -.5, root, function visit(node) {
  console.log('visit:', node)
})

console.log('---')
traverse(-1, .5, 1, .5, root, function visit(node) {
  console.log('visit:', node)
})

console.log('---')
traverse(-.5, -1, -.5, 1, root, function visit(node) {
  console.log('visit:', node)
})

console.log('---')
traverse(.5, -1, .5, 1, root, function visit(node) {
  console.log('visit:', node)
})

*/


// function quad(txa, tya, txm, tym, txb, tyb, cx, cy) {
//   console.log('a(%s, %s) m(%s, %s) b(%s, %s)', txa, tya, txm, tym, txb, tyb);

//   console.log('max entry', Math.max(txa, tya))

//   var r = 0;

//   // not vertical
//   if (isFinite(txa)) {

//   }

//   // not horizontal
//   if (isFinite(tya)) {

//   } else {
//     // if (txa >= 0 || txm >= 0) {
//     //   r |=
//     // } else if (txm)
//   }


// }


// test('horizontal > 0', function(t) {
//   var r = quad(1, -Infinity, 2, Infinity, 3, Infinity);
//   t.equal(r, 2)
//   t.end()
// })

// console.log(quad(-1, 0, 0, 0, 1, 1))

function rayAtTime(o, d, t) {
  return [
    o[0] + d[0] * t,
    o[1] + d[1] * t,
    o[2] + d[2] * t
  ];
}

function quadrant(x, y, cx, cy) {
  return (x > cx ? 1 : 0) | (y > cy ? 2 : 0);
}

test('hybrid', function(t) {
  var ts = [0, 0];
  var ro = [-5, .5];
  var rd = [1, 0];
  var aabb = [[-1, -1], [1, 1]];
  var center = [
    (aabb[0][0] + aabb[1][0]) / 2,
    (aabb[0][1] + aabb[1][1]) / 2
  ];


  var r = slab(ro, [1/rd[0], 1/rd[1]], aabb, ts);
  t.ok(r, 'isect')

  var txa = (aabb[0][0] - ro[0]) / rd[0];
  var tya = (aabb[0][1] - ro[1]) / rd[1];
  var txb = (aabb[1][0] - ro[0]) / rd[0];
  var tyb = (aabb[1][1] - ro[1]) / rd[1];
  var txm = (txa+txb)/2;
  var tym = (tya+tyb)/2;
  var entry = rayAtTime(ro, rd, r[0])

  var s = 0, e = 0, d=0;

  // vertical line
  if (!isFinite(txa)) {
    throw new Error('need to handle vertical')
  } else if (!isFinite(tya)) {
    console.log(entry)
    console.log('quad', quadrant(entry[0], entry[1], center[0], center[1]))
    if (txm >= 0) {

    }
  } else {
    console.log(txa, tya, txb, tyb)
    console.log(txm, tym)
  }

  for (s; s<e; s+=d) {
    console.log('step', s)
  }

  t.end();
})

