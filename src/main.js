import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'

import {getMoon, getPlanet, getSun} from "./meshes";
import {toDegrees, toRadians} from "./helpers";
import {getStarfield} from "./particles";

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

const starfield = getStarfield();
scene.add(starfield);

// Flat Planet
const planet = getPlanet();
scene.add(planet)

// Sun
const sun = getSun();
scene.add(sun);

// Moon
const moon = getMoon();
scene.add(moon);

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.z = 10
camera.position.y = 0
camera.lookAt(0, 0, 0)
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});
renderer.setSize(sizes.width, sizes.height);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.render(scene, camera);

let degrees = 0; // Starting angle in radians
let lastOrbit = 0;

const sunOrbit = {
    radius: 5,
    azimuth: 0,
    increment: 4,
    altitude: 0,
    x: 0,
    y: 0,
    z: 0
}

const moonOrbit = {
    radius: -3,
    azimuth: 45,
    increment: 4,
    altitude: 0,
    x: 0,
    y: 0,
    z: 0
}

const clock = new THREE.Clock()

const tick = () =>
{
    // Timer
    const elapsedTime = clock.getElapsedTime()

    /*
        NOTES:

        Need to get polar/spherical coordinates and then convert them into cartesian
        coordinates. Spherical coordinates require two angles.

        s = azimuth angle: An angle measured clockwise from a reference direction.
        t = altitude/elevation angle: An angle measured upwards from a reference plane.

        x = r * sin(t) * cos(s)
        y = r * sin(t) * sin(s)
        z = r * cos(t)
    */

    const currentOrbit = Math.floor(toDegrees(elapsedTime) / 360)
    if (currentOrbit > lastOrbit) {
        console.log('new orbit')
        sunOrbit.azimuth += sunOrbit.increment;
        moonOrbit.azimuth += moonOrbit.increment;
        lastOrbit = currentOrbit;
    }

    // Sun Orbit
    sunOrbit.altitude = elapsedTime

    sunOrbit.x = sunOrbit.radius * Math.sin(sunOrbit.altitude) * Math.cos(toRadians(sunOrbit.azimuth))
    sunOrbit.y = sunOrbit.radius * Math.sin(sunOrbit.altitude) * Math.sin(toRadians(sunOrbit.azimuth))
    sunOrbit.z = sunOrbit.radius * Math.cos(sunOrbit.altitude)

    sun.position.set(sunOrbit.x, sunOrbit.y, sunOrbit.z)

    // Moon Orbit
    moonOrbit.altitude = -(elapsedTime + toRadians(180))

    moonOrbit.x = moonOrbit.radius * Math.sin(moonOrbit.altitude) * Math.cos(toRadians(moonOrbit.azimuth))
    moonOrbit.y = moonOrbit.radius * Math.sin(moonOrbit.altitude) * Math.sin(toRadians(moonOrbit.azimuth))
    moonOrbit.z = moonOrbit.radius * Math.cos(moonOrbit.altitude)

    moon.position.set(moonOrbit.x, moonOrbit.y, moonOrbit.z)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()