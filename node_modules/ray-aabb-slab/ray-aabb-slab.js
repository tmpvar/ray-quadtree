module.exports = raySlab;

var min = Math.min;
var max = Math.max;

function raySlab(origin, invdir, aabb, out) {
  var tmin, tmax, t1, t2, l = aabb[0], u = aabb[1];
  var ix = invdir[0], iy = invdir[1], iz = invdir[2];
  var ox = origin[0], oy = origin[1], oz = origin[2];

  t1 = (l[0] - ox) * ix;
  t2 = (u[0] - ox) * ix;

  tmin = min(t1, t2)
  tmax = max(t1, t2)

  t1 = (l[1] - oy) * iy;
  t2 = (u[1] - oy) * iy;

  tmin = max(tmin, min(t1, t2))
  tmax = min(tmax, max(t1, t2))

  if (origin.length === 3) {
    t1 = (l[2] - oz) * iz;
    t2 = (u[2] - oz) * iz;

    tmin = max(tmin, min(t1, t2))
    tmax = min(tmax, max(t1, t2))
  }

  if (tmax >= max(0.0, tmin)) {
    out[0] = tmin;
    out[1] = tmax;
    return out;
  }
  return null;
}
