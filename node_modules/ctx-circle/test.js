var test = require('tape');
var circle = require('./ctx-circle');

test('it does what it says on the box', function(t) {
  var calls = 0;
  var ctx = {
    moveTo: function(x, y) {
      calls++;
      t.equal(x, 5, 'x includes radius');
      t.equal(y, 1, 'y is left alone');
    },
    arc : function(x, y, r, start, end, reverse) {
      calls++;
      t.equal(x, 0, 'x is 0');
      t.equal(y, 1, 'y is 1');
      t.equal(r, 5, 'radius is 5');
      t.equal(start, 0, 'start at 0 rads');
      t.equal(end, Math.PI*2, 'end at TAU');
      t.equal(reverse, false, 'default to false for reverse')
    }
  };


  circle(ctx, 0, 1, 5);
  t.equal(calls, 2, 'called moveTo and arc')

  t.end();
});
