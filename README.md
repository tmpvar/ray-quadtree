# ray-quadtree

A 2d implementation of the octree traversal algorithm described in [An Efficient Parametric Algorithm for Octree Traversal](http://wscg.zcu.cz/wscg2000/Papers_2000/X31.pdf).

![demo screenshot](http://i.imgur.com/bN1EGRV.png)

[view demo](https://tmpvar.github.io/ray-quadtree/)

## install

`npm install --save ray-quadtree`

## use

```javascript
var isect = require('ray-quadtree')
var QuadTree = require('ray-quadtree/quadtree')

// create a new quadtree centered at (0,0)
var tree = new QuadTree([0, 0])

// leaves are to 10x10 unit squares
tree.add(-20, -20);
tree.add( 20, -20);
tree.add( 20,  20);
tree.add(-20,  20);

// this is called every time the traversal algorithm processes a
// quadtree node. Returning `true` marks the traversal complete.
function visitor(origin, node, tx, ty, depth) {
  console.log('depth: %s, center: (%s), bounds: (%s) -> (%s)',
    depth,
    node.center.join(', '),
    node.bounds[0].join(', '),
    node.bounds[1].join(', ')
  )

  // returning true here will stop the traversal for this ray
  return node.leaf;
}

var origin = [-50, 20]
var direction = [1, 0]; // this needs to be normalized

if (isect(origin, direction, tree, visitor)) {
  console.log('found occupied cell')
}
```

outputs:

```
depth: 0, center: (50, 10), bounds: (-30, -70) -> (130, 90)
depth: 1, center: (10, 50), bounds: (-30, 10) -> (50, 90)
depth: 2, center: (-10, 30), bounds: (-30, 10) -> (10, 50)
depth: 3, center: (-20, 20), bounds: (-30, 10) -> (-10, 30)
found occupied cell
```

take a look at [demo.js](demo.js) to see a full example of usage

## license

[MIT](LICENSE.txt)