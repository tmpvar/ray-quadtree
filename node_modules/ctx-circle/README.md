# ctx-circle

draw a circle in 2d html5 canvas

## install

`npm install ctx-circle`

## use

### api

__circle__(`ctx`, `x`, `y`, `radius`[, `reverse`])

* `ctx` - the CanvasRenderingContext2D to draw the circle on
* `x` - the center of the circle in the x axis
* `y` - the center of the circle in the y axis
* `radius` - the radius of the circle to draw on the canvas
* `reverse` - (optional, default _false_) whether or not to reverse the direction the circle is drawn in.  This is good for holes and such using the [canvas winding rules](http://blogs.adobe.com/webplatform/2013/01/30/winding-rules-in-canvas/)


__Note__: this module will not call `ctx.beginPath` for you. 

### example

as seen in [example.js](example.js)

```javascript

var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
var circle = require('ctx-circle');
document.body.appendChild(canvas);

canvas.width = 200;
canvas.height = 200;

ctx.beginPath()
  circle(ctx, 100, 100, 50);
  circle(ctx, 100, 100, 30, true);
  ctx.strokeStyle = "red";
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.stroke();
```

results in:

![orange circle with red stroke](http://i.imgur.com/67BNwtD.png)

## license

[MIT](LICENSE.txt)
