# ctx-dashed-line

draw a dashed line in html5 2d canvas

## install

`npm install ctx-dashed-line`

## use

```javascript
var dashedLine = require('ctx-dashed-line')
```

### api

`dashedLine`(`ctx`, `start`, `end`[, `dashLength=2`])

* `ctx` - a CanvasRenderingContext2D (e.g. `var ctx = canvas.getContext('2d')`)
* `start` - a 2 component array `[x, y]` or object with the shape: `{ x: 1, y: 1 }` specifying the start of a line segment
* `end` - a 2 component array `[x, y]` or object with the shape: `{ x: 1, y: 1 }` specifying the end of a line segment
* `dashLength` - optional length of on & off of dash (_defaults_)

__returns__ `ctx`

### example

as seen in [examples/basic.js](examples/basic.js), run with `beefy example/basic.js --live --open`

```javascript
var dashedLine = require('../dashed-line');
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
document.body.appendChild(canvas);

ctx.lineCap = "round";

ctx.beginPath();
  dashedLine(ctx, [10, 10], [100, 100], 5);
  dashedLine(ctx, [10, 10], [100, 10], 5);
  dashedLine(ctx, [100, 10], [100, 100], 5);

  ctx.lineWidth = 2;
  ctx.stroke();
```

results in:

![dashed triangle](http://i.imgur.com/0zNlrKd.png)


## license

[MIT](LICENSE.txt)
