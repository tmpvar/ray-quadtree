var isect = require('./ray-aabb-slab');
var Suite = require('benchmark').Suite;
var suite = new Suite({
  onError: function(e) {
    console.log('ERROR', e.target.error.stack );
  }
});

var origin = [0, 0, 0], idir = [0, 0, 0], out = [0, 0];
var boxa = [
  [-1, -1, -1],
  [ 1,  1,  1]
];

suite.add('all sides, edges and corners', function() {
// for (var i=0; i<1000; i++) {
  for (var x=-1; x<=1; x++) {
    origin[0] = !x?0:-x * 2;
    idir[0] = !x?0:1/x;

    for (var y=-1; y<=1; y++) {
      origin[1] = !y?0:-y * 2;
      idir[1] = !y?0:1/y;

      for (var z=-1; z<=1; z++) {
        origin[2] = !z?0:-z * 2;
        idir[2] = !z?0:1/z;
        isect(origin, idir, boxa, out)
      }
    }
  }
// }
})

suite.on('cycle', function(event) {
  console.log(String(event.target));
});

suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.run();
