let vertices = [
        new THREE.Vector3(1, 3, 1),
        new THREE.Vector3(1, 3, -1),
        new THREE.Vector3(1, -1, 1),
        new THREE.Vector3(1, -1, -1),
        new THREE.Vector3(-1, 3, -1),
        new THREE.Vector3(-1, 5, 1),
        new THREE.Vector3(-1, -1, -1),
        new THREE.Vector3(-1, -1, 1)
    ],
    faces = [
        new THREE.Face3(0, 2, 1),
        new THREE.Face3(2, 3, 1),
        new THREE.Face3(4, 6, 5),
        new THREE.Face3(6, 7, 5),
        new THREE.Face3(4, 5, 1),
        new THREE.Face3(5, 0, 1),
        new THREE.Face3(7, 6, 2),
        new THREE.Face3(6, 3, 2),
        new THREE.Face3(5, 7, 0),
        new THREE.Face3(7, 2, 0),
        new THREE.Face3(1, 3, 4),
        new THREE.Face3(3, 6, 4)
    ]

let scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer()

init = () => {
    let axis = new THREE.AxesHelper(20),  //  轴体
        planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1),
        planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}),  // new THREE.MeshBasicMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial),
        cubeGeometry = new THREE.BoxGeometry(4, 4, 4),
        cubeMaterial = new THREE.MeshLambertMaterial({color: 0xff0000}),  // new THREE.MeshBasicMaterial({color: 0x00aa00, wireframe: true}),
        cube = new THREE.Mesh(cubeGeometry, cubeMaterial),
        sphereGeometry = new THREE.SphereGeometry(4, 20, 20),
        sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff}),   // new THREE.MeshBasicMaterial({color: 0x777ff, wireframe: true}),
        sphere = new THREE.Mesh(sphereGeometry, sphereMaterial),
        spotLight = new THREE.SpotLight(0xffffff),  //  聚光灯光源
        ambientLight = new THREE.AmbientLight(0x0c0c0c),  //  环境光
        stats = initStats(),  //  运行帧数
        sphereStep = 0,
        gui = new dat.GUI(),  //  调试控件
        geom = new THREE.Geometry(),
        materials = [
            new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ],
        mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials)

    var controls = new function() {
        this.rotationSpeed = 0.02
        this.bouncingSpeed = 0.03
        this.numberOfObjects = scene.children.length
        this.addCube = () => {
            let cubeSize = Math.ceil(Math.random() * 3),
                cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}),
                cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

            cube.castShadow = true
            cube.name = 'cube-' + scene.children.length
            cube.position.x = -30 + Math.round(Math.random() * planeGeometry.parameters.width)
            cube.position.y = Math.round(Math.random() * 5)
            cube.position.z = -20 + Math.round(Math.random() * planeGeometry.parameters.height)

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
        this.clone = () => {
            let clonedGeom = mesh.children[0].geometry.clone(),
                materials = [
                    new THREE.MeshLambertMaterial({opacity: 0.6, color: 0xff44ff, transparent: true}),
                    new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
                ],
                mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeom, materials)

            mesh2.children.forEach(e => {e.castShadow = true})
            mesh2.translateY(20)
            mesh2.translateZ(5)
            mesh2.name = 'clone'
            scene.remove(scene.getObjectByName('clone'))
            scene.add(mesh2)
        }
        this.outputObjects = () => {
            console.log(scene.children)
        }
    }

    renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true //  打开场景阴影

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

    geom.vertices = vertices
    geom.faces = faces
    geom.computeFaceNormals()

    mesh.translateY(10)

    spotLight.position.set(-40, 60, -10)
    spotLight.castShadow = true

    scene.add(axis)
    scene.add(plane)
    scene.add(cube)
    scene.add(sphere)
    scene.add(spotLight)
    scene.add(ambientLight)
    scene.add(mesh)
    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100) //  雾化效果
    scene.fog = new THREE.FogExp2(0xffffff, 0.01)  // 随距离呈指数增长雾化效果
    scene.fog = new THREE.MeshLambertMaterial({color: 0xffffff})  // 强制场景中的所有物体使用相同的材质

    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'bouncingSpeed', 0, 0.5)
    gui.add(controls, 'addCube')
    gui.add(controls, 'clone')
    gui.add(controls, 'removeCube')
    gui.add(controls, 'outputObjects')

    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    document.getElementById('WebGL-output').appendChild(renderer.domElement)

    renderScene = () => {
        stats.update()

        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        mesh.children.forEach(e => {
            e.geometry.vertices = vertices
            e.geometry.verticesNeedUpdate = true
            e.geometry.computeFaceNormals()
            e.castShadow = true
        })

        sphereStep += controls.bouncingSpeed
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

onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}