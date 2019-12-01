import App from './app';
import {EARTH, MOON, THREE_BODY_345} from './constants';

let app = new App();
const ASPECT_RATIO = 1.77;
let menuOpen = false;

const controls = {
  startButton: document.getElementById("start"),
  menuButton: document.getElementById("menu-button"),
  menuDiv: document.getElementById("menu"),
  threePlanetCheckbox: document.getElementById("threePlanet"),
  timeSlider: document.getElementById("time-slider"),
  planet1: {
    x: document.getElementById("planet1-x"),
    y: document.getElementById("planet1-y"),
    z: document.getElementById("planet1-z"),
    vx: document.getElementById("planet1-vx"),
    vy: document.getElementById("planet1-vy"),
    vz: document.getElementById("planet1-vz"),
    mass: document.getElementById("planet1-mass")
  },
  planet2: {
    x: document.getElementById("planet2-x"),
    y: document.getElementById("planet2-y"),
    z: document.getElementById("planet2-z"),
    vx: document.getElementById("planet2-vx"),
    vy: document.getElementById("planet2-vy"),
    vz: document.getElementById("planet2-vz"),
    mass: document.getElementById("planet2-mass")
  },
planet3: {
    x: document.getElementById("planet3-x"),
    y: document.getElementById("planet3-y"),
    z: document.getElementById("planet3-z"),
    vx: document.getElementById("planet3-vx"),
    vy: document.getElementById("planet3-vy"),
    vz: document.getElementById("planet3-vz"),
    mass: document.getElementById("planet3-mass")
  },
}
resetDefaults();


// Handle Start/Reset button clicks
controls.startButton.onclick = (event) => {
  app.toggleStart();
  controls.startButton.innerText = app._running ? 'Reset' : 'Start';
  disableEnableInputs(app._running)
}

//Handle showing/hiding the menu
controls.menuButton.onclick = () => {
  if (menuOpen) {
    controls.menuButton.children[0].src = 'assets/menu-24px.svg';
    controls.menuDiv.classList.add('hide');
  } else {
    controls.menuButton.children[0].src = 'assets/menu_open-24px.svg';
    controls.menuDiv.classList.remove('hide');
  }
  menuOpen = !menuOpen;
}

// Handle change the time-scale slider
controls.timeSlider.onchange = () => {
  app.setTimeScale(controls.timeSlider.value / 1000);
}

controls.threePlanetCheckbox.onchange = () => {
  if (controls.threePlanetCheckbox.checked) {
    app.setThreePlanet();
    document.getElementById("planet3").classList.remove('hide');
  } else {
    app.setTwoPlanet();
    document.getElementById("planet3").classList.add('hide');
  }
  resetDefaults();
}

//Reset the default earth/moon values for the two body problem
function resetDefaults() {
  controls.timeSlider.value = 500;
  app.setTimeScale(controls.timeSlider.value / 1000);
  if (!controls.threePlanetCheckbox.checked) {
    controls.planet1.x.value = EARTH.x;
    controls.planet1.y.value = EARTH.y;
    controls.planet1.z.value = EARTH.z;
    controls.planet1.vx.value = EARTH.vx;
    controls.planet1.vy.value = EARTH.vy;
    controls.planet1.vz.value = EARTH.vz;
    controls.planet1.mass.value = EARTH.mass;

    controls.planet2.x.value = MOON.x;
    controls.planet2.y.value = MOON.y;
    controls.planet2.z.value = MOON.z;
    controls.planet2.vx.value = MOON.vx;
    controls.planet2.vy.value = MOON.vy;
    controls.planet2.vz.value = MOON.vz;
    controls.planet2.mass.value = MOON.mass;
  } else {
    controls.planet1.x.value = THREE_BODY_345[0].x;
    controls.planet1.y.value = THREE_BODY_345[0].y;
    controls.planet1.z.value = THREE_BODY_345[0].z;
    controls.planet1.vx.value = THREE_BODY_345[0].vx;
    controls.planet1.vy.value = THREE_BODY_345[0].vy;
    controls.planet1.vz.value = THREE_BODY_345[0].vz;
    controls.planet1.mass.value = THREE_BODY_345[0].mass;

    controls.planet2.x.value = THREE_BODY_345[1].x;
    controls.planet2.y.value = THREE_BODY_345[1].y;
    controls.planet2.z.value = THREE_BODY_345[1].z;
    controls.planet2.vx.value = THREE_BODY_345[1].vx;
    controls.planet2.vy.value = THREE_BODY_345[1].vy;
    controls.planet2.vz.value = THREE_BODY_345[1].vz;
    controls.planet2.mass.value = THREE_BODY_345[1].mass;

    controls.planet3.x.value = THREE_BODY_345[2].x;
    controls.planet3.y.value = THREE_BODY_345[2].y;
    controls.planet3.z.value = THREE_BODY_345[2].z;
    controls.planet3.vx.value = THREE_BODY_345[2].vx;
    controls.planet3.vy.value = THREE_BODY_345[2].vy;
    controls.planet3.vz.value = THREE_BODY_345[2].vz;
    controls.planet3.mass.value = THREE_BODY_345[2].mass;
  }
}

function disableEnableInputs(shouldEnable) {
  controls.threePlanetCheckbox.disabled = shouldEnable;

  controls.planet1.x.disabled = shouldEnable;
  controls.planet1.y.disabled = shouldEnable;
  controls.planet1.z.disabled = shouldEnable;
  controls.planet1.vx.disabled = shouldEnable;
  controls.planet1.vy.disabled = shouldEnable;
  controls.planet1.vz.disabled = shouldEnable;
  controls.planet1.mass.disabled = shouldEnable;

  controls.planet2.x.disabled = shouldEnable;
  controls.planet2.y.disabled = shouldEnable;
  controls.planet2.z.disabled = shouldEnable;
  controls.planet2.vx.disabled = shouldEnable;
  controls.planet2.vy.disabled = shouldEnable;
  controls.planet2.vz.disabled = shouldEnable;
  controls.planet2.mass.disabled = shouldEnable;

  controls.planet3.x.disabled = shouldEnable;
  controls.planet3.y.disabled = shouldEnable;
  controls.planet3.z.disabled = shouldEnable;
  controls.planet3.vx.disabled = shouldEnable;
  controls.planet3.vy.disabled = shouldEnable;
  controls.planet3.vz.disabled = shouldEnable;
  controls.planet3.mass.disabled = shouldEnable;
} 

// onchange watchers for planet inputs
controls.planet1.x.onchange = () => {
  app._planets[0].x0 = parseFloat(controls.planet1.x.value);
  app._planets[0].reset()
}
controls.planet1.y.onchange = () => {
  app._planets[0].y0 = parseFloat(controls.planet1.y.value);
  app._planets[0].reset()
}
controls.planet1.z.onchange = () => {
  app._planets[0].z0 = parseFloat(controls.planet1.z.value);
  app._planets[0].reset()
}
controls.planet1.vx.onchange = () => {
  app._planets[0].vx0 = parseFloat(controls.planet1.vx.value);
  app._planets[0].reset()
}
controls.planet1.vy.onchange = () => {
  app._planets[0].vy0 = parseFloat(controls.planet1.vy.value);
  app._planets[0].reset()
}
controls.planet1.vz.onchange = () => {
  app._planets[0].vz0 = parseFloat(controls.planet1.vz.value);
  app._planets[0].reset()
}
controls.planet1.mass.onchange = () => {
  app._planets[0].mass = parseFloat(controls.planet1.mass.value);
}

controls.planet2.x.onchange = () => {
  app._planets[1].x0 = parseFloat(controls.planet2.x.value);
  app._planets[1].reset()
}
controls.planet2.y.onchange = () => {
  app._planets[1].y0 = parseFloat(controls.planet2.y.value);
  app._planets[1].reset()
}
controls.planet2.z.onchange = () => {
  app._planets[1].z0 = parseFloat(controls.planet2.z.value);
  app._planets[1].reset()
}
controls.planet2.vx.onchange = () => {
  app._planets[1].vx0 = parseFloat(controls.planet2.vx.value);
  app._planets[1].reset()
}
controls.planet2.vy.onchange = () => {
  app._planets[1].vy0 = parseFloat(controls.planet2.vy.value);
  app._planets[1].reset()
}
controls.planet2.vz.onchange = () => {
  app._planets[1].vz0 = parseFloat(controls.planet2.vz.value);
  app._planets[1].reset()
}
controls.planet2.mass.onchange = () => {
  app._planets[1].mass = parseFloat(controls.planet2.mass.value);
}

controls.planet3.x.onchange = () => {
  app._planets[2].x0 = parseFloat(controls.planet3.x.value);
  app._planets[2].reset()
}
controls.planet3.y.onchange = () => {
  app._planets[2].y0 = parseFloat(controls.planet3.y.value);
  app._planets[2].reset()
}
controls.planet3.z.onchange = () => {
  app._planets[2].z0 = parseFloat(controls.planet3.z.value);
  app._planets[2].reset()
}
controls.planet3.vx.onchange = () => {
  app._planets[2].vx0 = parseFloat(controls.planet3.vx.value);
  app._planets[2].reset()
}
controls.planet3.vy.onchange = () => {
  app._planets[2].vy0 = parseFloat(controls.planet3.vy.value);
  app._planets[2].reset()
}
controls.planet3.vz.onchange = () => {
  app._planets[2].vz0 = parseFloat(controls.planet3.vz.value);
  app._planets[2].reset()
}
controls.planet3.mass.onchange = () => {
  app._planets[2].mass = parseFloat(controls.planet3.mass.value);
}