import * as THREE from 'three';

const SCALE = 1/100000000
const MAX_POINTS = 2500;
export default class Planet extends THREE.Mesh {
  constructor(planetSettings, color) {
    var geometry = new THREE.SphereGeometry( .25, 16, 16 );
    var material = new THREE.MeshBasicMaterial( { color } );
    super( geometry, material );

    this.mass = planetSettings.mass;
    this.x0 = planetSettings.x;
    this.y0 = planetSettings.y;
    this.z0 = planetSettings.z;
    this.vx0 = planetSettings.vx;
    this.vy0 = planetSettings.vy;
    this.vz0 = planetSettings.vz

    this.lineTraceGeo = new THREE.BufferGeometry();

    this.linePoints = new Float32Array( MAX_POINTS * 3 ); // 3 vertices per point
    this.vertexCount = 0;
    this.lineTraceGeo.addAttribute( 'position', new THREE.BufferAttribute( this.linePoints, 3 ) );

    // draw range
    this.lineTraceGeo.setDrawRange( 0, 0 );

    this.lineTraceMat = new THREE.LineBasicMaterial( { color } );
    this.reset();
  }

  reset() {
    this.vx = this.vx0;
    this.vy = this.vy0;
    this.vz = this.vz0;
    this.ax = 0;
    this.ay = 0;
    this.az = 0;
    this.realX = this.x0;
    this.realY = this.y0;
    this.realZ = this.z0;
    this.position.x = this.realX * SCALE;
    this.position.y = this.realY * SCALE;
    this.position.z = this.realZ * SCALE;

    this.vertexCount = 0
    this.lineTraceGeo.setDrawRange( 0, 0 );
    this.lineTraceGeo.attributes.position.needsUpdate = true;
  }

  applyForce(fx, fy, fz, dt) {
    this.ax = fx / this.mass;
    this.ay = fy / this.mass;
    this.az = fz / this.mass;
  }

  update(dt) {
    this.vx += (this.ax) * dt;
    this.vy += (this.ay) * dt;
    this.vz += (this.az) * dt;
    this.realX += this.vx * dt;
    this.realY += this.vy * dt;
    this.realZ += this.vz * dt;

    // move the planet
    this.translateX(this.vx * dt *SCALE);
    this.translateY(this.vy * dt * SCALE);
    this.translateZ(this.vz * dt * SCALE);
  }

  newPath() {
    //push verticies to the line tracing behind this planet
    if (this.vertexCount > MAX_POINTS) {
      for(let i = 0; i < this.linePoints.length-3; i++) {
        this.linePoints[i] = this.linePoints[i+3]
      }
      this.linePoints[this.linePoints.length - 3] = this.position.x;
      this.linePoints[this.linePoints.length - 2] = this.position.y;
      this.linePoints[this.linePoints.length - 1] = this.position.z;
    } else {
      this.linePoints[this.vertexCount * 3] = this.position.x;
      this.linePoints[this.vertexCount * 3+1] = this.position.y;
      this.linePoints[this.vertexCount * 3+2] = this.position.z;
    }
    this.vertexCount++;
    this.lineTraceGeo.attributes.position.needsUpdate = true;
    let drawCount = this.vertexCount < MAX_POINTS ? this.vertexCount: MAX_POINTS;
    this.lineTraceGeo.setDrawRange( 0, drawCount );
  }
}