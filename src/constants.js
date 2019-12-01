export const G = 6.673 * Math.pow(10, -11); //N * (m/kg)^2

export const EARTH = {
  mass: 5.972e+24,
  x: 0,
  y: 0,
  z: 0,
  vx: 0,
  vy: -12, // prevent earth drifting since the sun isn't anchoring it
  vz: 0,
}

export const MOON = {
  mass:  7.346e+22,
  x: 3.75e+8, // m
  y: 0,
  z: 0,
  vx: 0,
  vy: 920, // m/s
  vz: 0,
}

export const THREE_BODY_345 = [{
  mass:  5e+22,
  x: 0, // m
  y: 0,
  z: 0,
  vx: 0,
  vy: 0, // m/s
  vz: 0,
},
 {
  mass:  4e+22,
  x: 3e8, // m
  y: 0,
  z: 0,
  vx: 0,
  vy: 0, // m/s
  vz: 0,
},
{
  mass:  3e+22,
  x: 0,
  y: 4e8, // m
  z: 0,
  vx: 0,
  vy: 0, // m/s
  vz: 0,
}];