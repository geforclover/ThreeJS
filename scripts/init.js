let faces = [
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
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000),
    renderer = new THREE.WebGLRenderer()

init = () => {
    let axis = new THREE.AxesHelper(20),  //  轴体
        planeGeometry = new THREE.PlaneGeometry(80, 60, 1, 1),
        planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}),  // new THREE.MeshBasicMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial),
        spotLight = new THREE.SpotLight(0xffffff),  //  聚光灯光源
        stats = initStats(),  //  运行帧数
        sphere = null,
        mesh = null,
        sphereStep = 0,
        lightLimit = 60,
        spotLightReverse = false,
        gui = new dat.GUI(),  //  调试控件
        materials = [
            new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ],
        ambiColor = '#0c0c0c',
        ambientLight = new THREE.AmbientLight(ambiColor)  //  环境光

    var controls = new function() {
        this.rotationSpeed = 0.02
        this.bouncingSpeed = 0.03
        this.numberOfObjects = scene.children.length
        this.spotLightLimit = 0.7
        this.ambientColor = ambiColor
        this.addCube = () => {
            let cubeSize = Math.ceil(Math.random() * 3),
                cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}),  // THREE.MeshBasicMaterial({color: , wireframe: true})
                cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

            cube.castShadow = true
            cube.name = 'cube-' + scene.children.length
            cube.position.x = -15 + Math.round(Math.random() * planeGeometry.parameters.width / 2)
            cube.position.y = Math.round(Math.random() * 5)
            cube.position.z = -10 + Math.round(Math.random() * planeGeometry.parameters.height / 2)

            scene.add(cube)
        }
        this.addSphere = () => {
            let  sphereSize = Math.ceil(Math.random() * 3),
                sphereSegment = Math.ceil(Math.random() * 40 + 10),
                sphereGeometry = new THREE.SphereGeometry(sphereSize, sphereSegment, sphereSegment),
                sphereMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff})

            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
            sphere.castShadow = true
            sphere.name = 'sphere-' + scene.children.length
            sphere.position.x = -15 + Math.round(Math.random() * planeGeometry.parameters.width / 2)
            sphere.position.y = Math.round(Math.random() * 5)
            sphere.position.z = -10 + Math.round(Math.random() * planeGeometry.parameters.height / 2)

            scene.add(sphere)
        }
        this.addGeometry = () => {
            let geom = new THREE.Geometry(),
                vertices = Array.from({length: 8}, (v, i) => new THREE.Vector3(10 - Math.random() * 5, 10 - Math.random() * 5, 10 - Math.random() * 5))

            mesh = THREE.SceneUtils.createMultiMaterialObject(geom, materials)
            geom.vertices = vertices
            geom.faces = faces
            geom.computeFaceNormals()

            mesh.children.forEach(e => {
                e.geometry.vertices = vertices
                e.geometry.verticesNeedUpdate = true
                e.geometry.computeFaceNormals()
                e.castShadow = true
            })

            mesh.translateY(Math.random() * 20)
            mesh.translateX(Math.random() * 30)
            mesh.translateZ(Math.random() * 10)
            scene.add(mesh)
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
            if (mesh) {
                let clonedGeom = mesh.children[mesh.children.length - 1].geometry.clone(),
                    materials = [
                        new THREE.MeshLambertMaterial({opacity: 0.6, color: 0xff44ff, transparent: true}),
                        new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
                    ],
                    mesh2 = THREE.SceneUtils.createMultiMaterialObject(clonedGeom, materials)

                mesh2.children.forEach(e => {e.castShadow = true})
                mesh2.translateY(Math.random() * 10)
                mesh2.translateX(Math.random() * 15)
                mesh2.translateZ(Math.random() * 5)
                mesh2.name = 'clone'
                scene.add(mesh2)
            }
        }
        this.clear = () => {
            scene.children.forEach((e) => {
                if ((e instanceof THREE.Mesh || e instanceof THREE.Group) && e != plane) {
                    scene.remove(e)
                }
            });
        }
        this.outputObjects = () => {
            console.log(scene.children)
        }
    }

    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'bouncingSpeed', 0, 0.5)
    gui.add(controls, 'spotLightLimit', 0, 1)
    gui.add(controls, 'addCube')
    gui.add(controls, 'addSphere')
    gui.add(controls, 'addGeometry')
    gui.add(controls, 'clone')
    gui.add(controls, 'removeCube')
    gui.add(controls, 'clear')
    gui.add(controls, 'outputObjects')
    gui.addColor(controls, 'ambientColor').onChange(e => {
        ambientLight.color = new THREE.Color(e)
    })

    renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true //  打开场景阴影
    renderer.shadowMapType = THREE.PCFSoftShadowMap

    plane.rotation.x = -0.5 * Math.PI
    plane.position.x = 15
    plane.position.y = 0
    plane.position.z = 0
    plane.receiveShadow = true

    spotLight.castShadow = true
    spotLight.position.set(lightLimit, 60, lightLimit)
    spotLight.shadowMapWidth = 2048
    spotLight.shadowMapHeight = 2048
    spotLight.target = plane

    scene.add(axis)
    scene.add(plane)
    scene.add(spotLight)
    scene.add(ambientLight)

    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100) //  雾化效果
    scene.fog = new THREE.FogExp2(0xffffff, 0.01)  // 随距离呈指数增长雾化效果
    scene.fog = new THREE.MeshLambertMaterial({color: 0xffffff})  // 强制场景中的所有物体使用相同的材质

    camera.position.x = -30
    camera.position.y = 40
    camera.position.z = 30
    camera.lookAt(scene.position)

    document.getElementById('WebGL-output').appendChild(renderer.domElement)

    renderScene = () => {
        stats.update()
        sphereStep += Math.random() * controls.bouncingSpeed

        if (spotLightReverse) {
            lightLimit  += controls.spotLightLimit
            spotLight.position.set(lightLimit, 60, lightLimit)
            if (lightLimit > 120) {
                spotLightReverse = !spotLightReverse
            }
        } else {
            lightLimit  -= controls.spotLightLimit
            spotLight.position.set(lightLimit, 60, lightLimit)
            if (lightLimit < -60) {
                spotLightReverse = !spotLightReverse
            }
        }

        scene.traverse(function (e) {
            if (e instanceof THREE.Mesh && e != plane) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }
        });

        scene.children.map((item, index) => {
            if (item.name.includes('sphere-') && (parseInt(item.name.split('-')[1]) === index)) {
                item.position.x =  index / 4 * 2 + (10 * Math.cos(sphereStep + index / 4))
                item.position.y =  index  / 4 + (10 * Math.abs(Math.sin(sphereStep + index / 4)))
            }
        })

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