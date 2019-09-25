init = () => {
    let scene = new THREE.Scene(),
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
        renderer = new THREE.WebGLRenderer(),
        axis = new THREE.AxesHelper(20),
        planeGeometry = new THREE.PlaneGeometry(60, 20, 1, 1),
        planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}),  // new THREE.MeshBasicMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial),
        cubeGeometry = new THREE.BoxGeometry(4, 4, 4),
        cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000}),  // new THREE.MeshBasicMaterial({color: 0x00aa00, wireframe: true}),
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial),
        sphereGeometry = new THREE.SphereGeometry(4, 20, 20),
        sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff}),   // new THREE.MeshBasicMaterial({color: 0x777ff, wireframe: true}),
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial),
        spotLight = new THREE.SpotLight(0xffffff),
        stats = initStats(),
        sphereStep = 0

    renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true

    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0
    plane.receiveShadow = true

    cube.position.x = -4
    cube.position.y = 3
    cube.position.z = 0
    cube.castShadow = true

    sphere.position.x = 20
    sphere.position.y = 4
    sphere.position.z = 2
    sphere.castShadow = true

    spotLight.position.set(-40, 60, -10)
    spotLight.castShadow = true

    scene.add(axis)
    scene.add(plane)
    scene.add(cube)
    scene.add(sphere)
    scene.add(spotLight)

    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    document.getElementById('WebGL-output').appendChild(renderer.domElement)

    renderScene = () => {
        stats.update()

        cube.rotation.x += 0.02
        cube.rotation.y += 0.02
        cube.rotation.z += 0.02

        sphereStep += 0.04
        sphere.position.x = 20 + (10 * Math.cos(sphereStep))
        sphere.position.y = 2 + (10 * Math.abs(Math.sin(sphereStep)))

        requestAnimationFrame(renderScene)
        renderer.render(scene, camera)
    }

    renderScene()
}

initStats = () => {
    let stats = new Stats()

    stats.setMode(0)
    stats.domElement.style.position = 'absolute'
    stats.domElement.style.left = '0px'
    stats.domElement.style.top = '0px'
    document.getElementById('Stats-output').appendChild(stats.domElement)
    return stats
}