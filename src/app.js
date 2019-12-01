import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import Planet from './planet';
import Axes from './axes';
import {EARTH, MOON, THREE_BODY_345, G} from './constants'

const FOV = 40;
const CLIPPING_PANES = [0.1, 1000];
const ASPECT_RATIO = 1.77;
const AXES_SIZE = 8;

const TIME_MAX = 2; // time scaler

export default class App {
  constructor() {
    this.initWorld();
    this._planets = [];
    this.setThreePlanet();
    
    this._planets.forEach(p => this._scene.add( p ));

    this._running = false;
    this._lastTime = 0;
    this._timeScale = .5 * TIME_MAX;
    requestAnimationFrame(this.animate.bind(this));
  }

  initWorld() {
    this._scene = new THREE.Scene();
    this._camera = new THREE.PerspectiveCamera( FOV, ASPECT_RATIO, ...CLIPPING_PANES );

    this._renderer = new THREE.WebGLRenderer({ antialias: true });
    if (window.innerHeight * ASPECT_RATIO < window.innerWidth) {
      this._renderer.setSize( window.innerHeight * ASPECT_RATIO, window.innerHeight );
    } else {
      this._renderer.setSize( window.innerWidth, window.innerWidth / ASPECT_RATIO );
    }


    this._scene.add( new Axes( AXES_SIZE ));
    

    this._controls = new OrbitControls( this._camera, this._renderer.domElement );

    this._camera.position.z = 15;
    this._controls.update();

    this.drawBackgroundStars()

    document.body.appendChild( this._renderer.domElement );
  }

  // Decorative stars in the background
  drawBackgroundStars() {
    var starsGeometry = new THREE.Geometry();

    for ( var i = 0; i < 50000; i ++ ) {
      var star = new THREE.Vector3();
      star.x = Math.random() > .5 ? THREE.Math.randFloat( 15, 400 ) : -1 * THREE.Math.randFloat( 15, 400 );
      star.y = Math.random() > .5 ? THREE.Math.randFloat( 15, 400 ) : -1 * THREE.Math.randFloat( 15, 400 );
      star.z = Math.random() > .5 ? THREE.Math.randFloat( 15, 400 ) : -1 * THREE.Math.randFloat( 15, 400 );
      starsGeometry.vertices.push( star );
    }

    var starsMaterial = new THREE.PointsMaterial( { color: 0x888888 } );

    var starField = new THREE.Points( starsGeometry, starsMaterial );

    this._scene.add( starField );
  }

  toggleStart() {
    if (this._running) {
      this._running = false;
      this._planets.forEach(p => p.reset());
      this._camera.position.x = 0;
      this._camera.position.y = 0;
      this._camera.position.z = 15;
      this._controls.update();
      return;
    }
    this._running = true;
    this._scene.add(new THREE.Line(this._planets[0].lineTraceGeo, this._planets[0].lineTraceMat));
    this._scene.add(new THREE.Line(this._planets[1].lineTraceGeo, this._planets[1].lineTraceMat));
    if (this._planets[2])
      this._scene.add(new THREE.Line(this._planets[2].lineTraceGeo, this._planets[2].lineTraceMat));
  }

  animate(time) {
    requestAnimationFrame(this.animate.bind(this));
    this._controls.update();
    this._renderer.render( this._scene, this._camera );

    if (this.lastTime === 0) {
      this._lastTime = time;
      return;
    }
    let frameTime = time - this._lastTime
    this._lastTime = time;
    if (frameTime > 200) // if we spend too much time between frames (likely alt-tab) just skip the frame
      return;

    let dt = this._timeScale
    if (this._running) {
      for (let i = 0; i < 50000; i++) {
        if (this._planets.length === 2) {
          this.applyForceVector2Planet(dt);
        } else if (this._planets.length === 3) {
          this.applyForceVector3Planet(dt);
        }
        this._planets.forEach(p => p.update(dt));
      }
      this._planets.forEach(p => p.newPath());
    }
  }

  applyForceVector2Planet(dt) {
    let d = this.dist(
      [this._planets[0].realX, this._planets[0].realY, this._planets[0].realZ],
      [this._planets[1].realX, this._planets[1].realY, this._planets[1].realZ]);

    let f = (G * this._planets[0].mass * this._planets[1].mass) / (d * d);

    let fx = f * ((this._planets[0].realX - this._planets[1].realX)/d);
    let fy = f * ((this._planets[0].realY - this._planets[1].realY)/d);
    let fz = f * ((this._planets[0].realZ - this._planets[1].realZ)/d);
    this._planets[0].applyForce(-fx, -fy, -fz, dt);
    this._planets[1].applyForce(fx, fy, fz, dt);
  }

  applyForceVector3Planet(dt) {
    let d01 = this.dist(
      [this._planets[0].realX, this._planets[0].realY, this._planets[0].realZ],
      [this._planets[1].realX, this._planets[1].realY, this._planets[1].realZ]);
    let d12 = this.dist(
      [this._planets[1].realX, this._planets[1].realY, this._planets[1].realZ],
      [this._planets[2].realX, this._planets[2].realY, this._planets[2].realZ]);
    let d20 = this.dist(
      [this._planets[2].realX, this._planets[2].realY, this._planets[2].realZ],
      [this._planets[0].realX, this._planets[0].realY, this._planets[0].realZ]);

    let f01 = (G * this._planets[0].mass * this._planets[1].mass) / (d01 * d01);
    let f01x = f01 * ((this._planets[0].realX - this._planets[1].realX)/d01);
    let f01y = f01 * ((this._planets[0].realY - this._planets[1].realY)/d01);
    let f01z = f01 * ((this._planets[0].realZ - this._planets[1].realZ)/d01);

    let f12 = (G * this._planets[1].mass * this._planets[2].mass) / (d12 * d12);
    let f12x = f12 * ((this._planets[1].realX - this._planets[2].realX)/d12);
    let f12y = f12 * ((this._planets[1].realY - this._planets[2].realY)/d12);
    let f12z = f12 * ((this._planets[1].realZ - this._planets[2].realZ)/d12);

    let f20 = (G * this._planets[2].mass * this._planets[0].mass) / (d20 * d20);
    let f20x = f20 * ((this._planets[2].realX - this._planets[0].realX)/d20);
    let f20y = f20 * ((this._planets[2].realY - this._planets[0].realY)/d20);
    let f20z = f20 * ((this._planets[2].realZ - this._planets[0].realZ)/d20);

    this._planets[0].applyForce(f20x-f01x, f20y-f01y, f20z-f01z, dt);
    this._planets[1].applyForce(f01x-f12x, f01y-f12y, f01z-f12z, dt);
    this._planets[2].applyForce(f12x-f20x, f12y-f20y, f12z-f20z, dt);
  }

  // Move to Utils
  dist(vector1, vector2) {
    let distSquared = ((vector1[0] - vector2[0]) * (vector1[0] - vector2[0])) //x^2
    + ((vector1[1] - vector2[1]) * (vector1[1] - vector2[1])) //y^2
    + ((vector1[2] - vector2[2]) * (vector1[2] - vector2[2])) //z^2
    return Math.sqrt(distSquared);
  }

  setTimeScale(scale) {
    this._timeScale = TIME_MAX * scale;
  }

  setThreePlanet() {
    this._planets.forEach(p => this._scene.remove( p ));
    this._planets = [
      new Planet(THREE_BODY_345[0], 0xfff00),
      new Planet(THREE_BODY_345[1], 0x00ffff),
      new Planet(THREE_BODY_345[2], 0xff00ff),
    ]
    this._planets.forEach(p => this._scene.add( p ));
  }

  setTwoPlanet() {
    this._planets.forEach(p => this._scene.remove( p ));
    this._planets = [
      new Planet(EARTH, 0x00ffff),
      new Planet(MOON, 0xaaaaaa)
    ];
    this._planets.forEach(p => this._scene.add( p ));
  }
}