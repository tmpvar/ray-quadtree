var test = require('tape');
var dashedLine = require('./dashed-line');


test('basic dashed line', function(t) {

  var movements = [];
  var ctx = {
    moveTo: function(x, y) {
      movements.push(['m', x, y]);
    },
    lineTo: function(x, y) {
      movements.push(['l', x, y]);
    }
  }

  var out = dashedLine(ctx, [0, 0], [10, 0], 1);

  t.ok(out === ctx, 'returns ctx');

  t.deepEqual(movements, [
    [ 'm', 0, 0 ],
    [ 'l', 1, 0 ],
    [ 'm', 2, 0 ],
    [ 'l', 3, 0 ],
    [ 'm', 4, 0 ],
    [ 'l', 5, 0 ],
    [ 'm', 6, 0 ],
    [ 'l', 7, 0 ],
    [ 'm', 8, 0 ],
    [ 'l', 9, 0 ],
    [ 'm', 10, 0 ],
    [ 'l', 10, 0 ]
  ], '')

  t.end();
});

test('basic dashed line (vec2 style)', function(t) {

  var movements = [];
  var ctx = {
    moveTo: function(x, y) {
      movements.push(['m', x, y]);
    },
    lineTo: function(x, y) {
      movements.push(['l', x, y]);
    }
  }

  dashedLine(ctx, { x: 0, y: 0 }, { x:10, y: 0 }, 1);

  t.deepEqual(movements, [
    [ 'm', 0, 0 ],
    [ 'l', 1, 0 ],
    [ 'm', 2, 0 ],
    [ 'l', 3, 0 ],
    [ 'm', 4, 0 ],
    [ 'l', 5, 0 ],
    [ 'm', 6, 0 ],
    [ 'l', 7, 0 ],
    [ 'm', 8, 0 ],
    [ 'l', 9, 0 ],
    [ 'm', 10, 0 ],
    [ 'l', 10, 0 ]
  ], '')

  t.end();
});
