# ray-aabb-slab

Find the intersection between a ray and an axis-aligned bounding box (AABB) in 2 or 3 dimensional space.

ported from https://tavianator.com/fast-branchless-raybounding-box-intersections/

## install

`npm install ray-aabb-slab`

## use

```javascript
var isect = require('ray-aabb-slab')

// the origin of the ray
var origin = [-10, 0, 0];

// the direction of the ray
var direction = [1, 0, 0];

// inverted direction
var idir = [
    1.0 / direction[0],
    1.0 / direction[1],
    1.0 / direction[2]
];

// aabb
var aabb = [
  [-1, -1, -1],
  [ 1,  1,  1]
];

// will contain the entry/exit `t` values if there is an intersection
var out = [0, 0];

if (isect(origin, idir, aabb, out)) {
  console.log('entry',
    origin[0] + direction[0] * out[0],
    origin[1] + direction[1] * out[0],
    origin[2] + direction[2] * out[0]
  );

  console.log('exit',
    origin[0] + direction[0] * out[1],
    origin[1] + direction[1] * out[1],
    origin[2] + direction[2] * out[1]
  )
}

/* outputs:
entry -1 0 0
exit 1 0 0
*/
```

## license

[MIT](LICENSE.txt)
