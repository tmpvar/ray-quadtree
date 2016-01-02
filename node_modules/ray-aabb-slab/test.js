var test = require('tape');
var isect = require('./ray-aabb-slab')
var vec3 = require('gl-vec3')

function rayAtTime(o, d, t) {
  return [
    o[0] + d[0] * t,
    o[1] + d[1] * t,
    o[2] + d[2] * t
  ]
}

test('single', function(t) {
  var r = 10;
  var l = 100;

  var box = [
    [-1, -1, -1],
    [ 1,  1,  1]
  ];

  var origin = [
    -10,
    0,
    0
  ];

  var direction = [1, 0, 0];
  var out = [0, 0];

  t.ok(isect(origin, vec3.inverse([0, 0, 0], direction), box, out), 'intersects');
  t.deepEqual(rayAtTime(origin, direction, out[0]), [-1, 0, 0])
  t.deepEqual(rayAtTime(origin, direction, out[1]), [1, 0, 0])

  t.end();
});

test('rotated on the z - isect', function(t) {
  var r = 10;
  var l = 100;

  var box = [
    [-1, -1, -1],
    [ 1,  1,  1]
  ];

  for (var i=0; i<l; i++) {
    var origin = [
      Math.sin(i/l),
      Math.cos(i/l),
      0
    ];

    var direction = [0, 0, 0];
    var out = [0, 0];
    vec3.normalize(direction, vec3.negate(direction, origin));
    vec3.scale(origin, origin, r);

    t.ok(isect(origin, vec3.inverse(direction, direction), box, out), 'intersects');
  }

  t.end();
});

test('rotated on the y - isect', function(t) {
  var r = 10;
  var l = 100;

  var box = [
    [-1, -1, -1],
    [ 1,  1,  1]
  ];

  for (var i=0; i<l; i++) {
    var origin = [
      Math.sin(i/l),
      0,
      Math.cos(i/l)
    ];

    var direction = [0, 0, 0];
    vec3.normalize(direction, vec3.negate(direction, origin));
    vec3.scale(origin, origin, r);

    t.ok(isect(origin, vec3.inverse(direction, direction), box, [0, 0]), 'intersects');
  }

  t.end();
});

test('rotated on the x - isect', function(t) {
  var r = 10;
  var l = 100;

  var box = [
    [-1, -1, -1],
    [ 1,  1,  1]
  ];

  for (var i=0; i<l; i++) {
    var origin = [
      0,
      Math.sin(i/l),
      Math.cos(i/l)
    ];

    var direction = [0, 0, 0];
    vec3.normalize(direction, vec3.negate(direction, origin));
    vec3.scale(origin, origin, r);

    t.ok(isect(origin, vec3.inverse(direction, direction), box, [0, 0]), 'intersects');
  }

  t.end();
});
