import * as THREE from "three";

export const getStarfield = () => {
    // Textures
    const textureLoader = new THREE.TextureLoader()

    const particlesTexture = textureLoader.load('/textures/particles/star.png')
    particlesTexture.colorSpace = THREE.SRGBColorSpace

    // Geometry
    const particlesGeometry = new THREE.BufferGeometry()

    const count = 10000
    const positions = new Float32Array(count * 3)


    for(let i = 0; i < count; i++) {
        /*
            This is polar/spherical coordinates and then converting them into cartesian
            coordinates. Spherical coordinates require two angles.

            x = r * cos(s) * sin(t)
            y = r * sin(s) * sin(t)
            z = r * cos(t)
        */

        const i3 = i * 3

        const angleXY = Math.random() * ( Math.PI * 2 )

        // This is handling the sin and cos of angleZ but with a
        // different distribution. Using Math.PI * 2 was clustering
        // too many points around xy = 0.
        const cosZ = (Math.random() * 2) - 1 // Random number between -1 and 1
        const sinZ = Math.sqrt(1-(cosZ ** 2)) // Get sin value with cos

        const radius = 25 + Math.random() * 100

        const x = radius * sinZ * Math.cos(angleXY)
        const y = radius * sinZ * Math.sin(angleXY)
        const z = radius * cosZ

        positions[i3] = x
        positions[i3 + 1] = y
        positions[i3 + 2] = z
    }

    particlesGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        sizeAttenuation: true,
        color: 0xfffee9,
        transparent: true,
        alphaMap: particlesTexture,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
    })

    // Points
    return new THREE.Points(particlesGeometry, particlesMaterial)
}
