import * as THREE from "three";
import {toRadians} from "./helpers";

// Planet
export const getPlanet = () => {
    const group = new THREE.Group()

    const mesh = new THREE.Mesh(
        new THREE.CircleGeometry(1, 360),
        new THREE.MeshStandardMaterial({color: 0x004400, side: THREE.DoubleSide})
    )
    group.add(mesh)

    const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(1, 32, 32,0, toRadians(180)),
        new THREE.MeshStandardMaterial({color: 0x2e2927, side: THREE.DoubleSide})
    )
    group.add(sphere)

    group.rotation.x = toRadians(90)
    group.castShadow = true

    return group;
}

// Sun
export const getSun = () => {
    const group = new THREE.Group();

    // Visible object
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.25, 32, 32),
        new THREE.MeshBasicMaterial({color: 0xffff00})
    )

    mesh.castShadow = true

    group.add(mesh)

    // Point Light / Sunlight
    const light = new THREE.PointLight(0xffffff, 2, 50, 0);

    light.castShadow = true;

    group.add(light);

    const helper = new THREE.PointLightHelper(light);
    helper.visible = false;
    group.add(helper);

    // group.position.set(
    //     5 * Math.sin(0) * Math.sin(0),
    //     5 * Math.cos(0),
    //     5 * Math.sin(0) * Math.cos(0)
    // );

    return group;
}

// Moon
export const getMoon = () => {
    const group = new THREE.Group();

    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.1, 32, 32),
        new THREE.MeshStandardMaterial({color: 0x0000ff})
    )

    mesh.receiveShadow = true

    group.add(mesh)

    // Point Light / Moonlight
    const light = new THREE.PointLight(0x0000ff, 1, 50, 0);

    light.castShadow = true;

    group.add(light);

    // mesh.position.set(
    //     -5 * Math.sin(0) * Math.sin(0),
    //     -5 * Math.cos(0),
    //     -5 * Math.sin(0) * Math.cos(0)
    // );

    return group;
}