let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 20, 200),
    renderer = new THREE.WebGLRenderer()

init = () => {
    let axis = new THREE.AxesHelper(20),  //  轴体
        planeGeometry = new THREE.PlaneGeometry(100, 60, 1, 1),
        planeMaterial = new THREE.MeshBasicMaterial({color: 0x666666}),  // new THREE.MeshBasicMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial),
        stats = initStats(),  //  运行帧数
        gui = new dat.GUI()  //  调试控件

    var controls = new function() {
        this.rotationSpeed = 0.1
        this.near = camera.near
        this.far = camera.far
        this.addCube = () => {
            let cubeSize = Math.ceil(Math.random() * 10),
                cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff}),
                cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

            cube.castShadow = true
            cube.name = 'cube-' + scene.children.length
            cube.position.x = -15 + Math.round(Math.random() * planeGeometry.parameters.width / 2)
            cube.position.y = Math.round(Math.random() * 5)
            cube.position.z = -10 + Math.round(Math.random() * planeGeometry.parameters.height / 2)

            scene.add(cube)
        }
        this.addDepthCube = () => {
            let cubeSize = Math.ceil(Math.random() * 10),
                cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff}),
                cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

            cube.castShadow = true
            cube.name = 'cube-' + scene.children.length
            cube.position.x = -15 + Math.round(Math.random() * planeGeometry.parameters.width / 2)
            cube.position.y = Math.round(Math.random() * 5)
            cube.position.z = -10 + Math.round(Math.random() * planeGeometry.parameters.height / 2)

            scene.add(cube)
        }
        this.addMultiCube = () => {
            let cubeSize = Math.ceil(Math.random() * 10),
                cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMaterial = new THREE.MeshDepthMaterial(),
                colorMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, transparent: true, blending: THREE.MultiplyBlending})
                cube = new THREE.SceneUtils.createMultiMaterialObject(cubeGeometry, [colorMaterial, cubeMaterial])

            cube.children[1].scale.set(0.99, 0.99, 0.99)

            cube.castShadow = true
            cube.name = 'cube-' + scene.children.length
            cube.position.x = -15 + Math.round(Math.random() * window.innerWidth / 20)
            cube.position.y = Math.round(Math.random() * 5)
            cube.position.z = -10 + Math.round(Math.random() * window.innerHeight / 20)

            scene.add(cube)
        }
        this.removeCube = () => {
            let allChildren = scene.children,
                lastObject = allChildren[allChildren.length - 1]

            if (lastObject instanceof THREE.Mesh) {
                scene.remove(lastObject)
                this.numberOfObjects = scene.children.length
            }
        }
    }

    gui.add(controls, 'addCube')
    gui.add(controls, 'addDepthCube')
    gui.add(controls, 'addMultiCube')
    gui.add(controls, 'removeCube')
    gui.add(controls, 'near', 0, 100).onChange(function (e) {
        camera.near = e;
        camera.updateProjectionMatrix();
    });
    gui.add(controls, 'far', 50, 200).onChange(function (e) {
        camera.far = e;
        camera.updateProjectionMatrix();
    });

    // renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true //  打开场景阴影
    renderer.shadowMap.Type = THREE.PCFSoftShadowMap

    plane.rotation.x = -0.5 * Math.PI
    plane.rotation.z = -0.25 * Math.PI
    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0
    plane.receiveShadow = true

    scene.add(axis)
    // scene.add(plane)
    // scene.overrideMaterial = new THREE.MeshDepthMaterial();

    camera.position.x = -30
    camera.position.y = 30
    camera.position.z = 30
    camera.lookAt(scene.position)

    document.getElementById('WebGL-output').appendChild(renderer.domElement)

    renderScene = () => {
        stats.update()
        camera.near = controls.near
        camera.far = controls.far

        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

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

onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}