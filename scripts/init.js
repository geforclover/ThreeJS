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
    let axis = new THREE.AxesHelper(100),  //  轴体
        planeGeometry = new THREE.PlaneGeometry(180, 100, 1, 1),
        planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff}),  // new THREE.MeshBasicMaterial({color: 0xcccccc}),
        plane = new THREE.Mesh(planeGeometry, planeMaterial),
        spotLight = new THREE.SpotLight(0xffffff),  //  聚光灯光源
        stats = initStats(),  //  运行帧数
        sphere = null,
        mesh = null,
        sphereStep = 0,
        gui = new dat.GUI(),  //  调试控件
        materials = [
            new THREE.MeshLambertMaterial({opacity: 0.6, color: 0x44ff44, transparent: true}),
            new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true})
        ],
        ambiColor = '#0c0c0c',
        ambientLight = new THREE.AmbientLight(ambiColor),  //  环境光
        cubeLamberMaterial = new THREE.MeshLambertMaterial({color: 0x7777ff}),
        sceneLight = gui.addFolder('SceneLight'),
        cameraLimit = gui.addFolder('CameraLimit'),
        cubeList = gui.addFolder('CubeList'),
        sphereList = gui.addFolder('SphereList')

    var controls = new function() {
        this.planeRotationX = -0.5 * Math.PI
        this.planeRotationY = 0
        this.planeRotationZ = -0.25 * Math.PI
        this.lightLimitX = 0
        this.lightLimitY = 60
        this.lightLimitZ = 0
        this.cameraPoiX = -30
        this.cameraPoiY = 80
        this.cameraPoiZ = 30
        this.rotationSpeed = 0.02
        this.bouncingSpeed = 0.03
        this.numberOfObjects = scene.children.length
        this.lightLimit = 100
        this.sceneAmbientColor = ambiColor
        this.lamberEmissive = cubeLamberMaterial.emissive.getHex()
        this.lamberColor = cubeLamberMaterial.color.getStyle()
        this.near = camera.near
        this.far = camera.far
        this.addNormalCube = () => {
            let cubeSize = Math.ceil(Math.random() * 6),
                cubeNormalGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeNormalMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}),  // THREE.MeshBasicMaterial({color: , wireframe: true})
                cubeNormal = new THREE.Mesh(cubeNormalGeom, cubeNormalMaterial)

            cubeNormal.castShadow = true
            cubeNormal.name = 'cube-normal-' + scene.children.length
            cubeNormal.position.x = 50 - Math.round(Math.random() * 110)
            cubeNormal.position.y = Math.round(Math.random() * 10)
            cubeNormal.position.z = 50 - Math.round(Math.random() * 100)

            scene.add(cubeNormal)
        }
        this.addDepthCube = () => {
            let cubeSize = Math.ceil(Math.random() * 6),
                cubeDepthGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeDepthMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff}),
                cubeDepth = new THREE.Mesh(cubeDepthGeom, cubeDepthMaterial)

            cubeDepth.castShadow = true
            cubeDepth.name = 'cube-depth-' + scene.children.length
            cubeDepth.position.x = 50 - Math.round(Math.random() * 110)
            cubeDepth.position.y = Math.round(Math.random() * 10)
            cubeDepth.position.z = 50 - Math.round(Math.random() * 100)

            scene.add(cubeDepth)
            scene.overrideMaterial = new THREE.MeshDepthMaterial();
        }
        this.addMultiCube = () => {
            let cubeSize = Math.ceil(Math.random() * 6),
                cubeMultiGeom = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize),
                cubeMultiMaterial = new THREE.MeshDepthMaterial(),
                colorMultiMaterial = new THREE.MeshBasicMaterial({color: Math.random() * 0xffffff, transparent: true, blending: THREE.MultiplyBlending})
                cubeMulti = new THREE.SceneUtils.createMultiMaterialObject(cubeMultiGeom, [colorMultiMaterial, cubeMultiMaterial])

            cubeMulti.children[1].scale.set(0.99, 0.99, 0.99)

            cubeMulti.castShadow = true
            cubeMulti.name = 'cube-multi-' + scene.children.length
            cubeMulti.position.x = 50 - Math.round(Math.random() * 110)
            cubeMulti.position.y = Math.round(Math.random() * 10)
            cubeMulti.position.z = 50 - Math.round(Math.random() * 100)

            scene.add(cubeMulti)
        }
        this.addGroupCube = () => {
            let group = new THREE.Mesh(),
                mats = []

            mats.push(new THREE.MeshBasicMaterial({color: 0x009e60}))
            mats.push(new THREE.MeshBasicMaterial({color: 0x0051ba}))
            mats.push(new THREE.MeshBasicMaterial({color: 0xffd500}))
            mats.push(new THREE.MeshBasicMaterial({color: 0xff5800}))
            mats.push(new THREE.MeshBasicMaterial({color: 0xc41e3a}))
            mats.push(new THREE.MeshBasicMaterial({color: 0xffffff}))

            for (let x = 0; x < 3; x++) {
                for (let y = 0; y < 3; y++) {
                    for (let z = 0; z < 3; z++) {
                        let cubeGroupGeometry = new THREE.BoxGeometry(2.9, 2.9, 2.9),
                            cubeGroup = new THREE.Mesh(cubeGroupGeometry, mats)

                        cubeGroup.position.set(x * 3 - 3, y * 3 - 3, z * 3 - 3)
                        group.add(cubeGroup)
                    }
                }
            }

            group.name = 'groupCube-' + scene.children.length
            group.scale.copy(new THREE.Vector3(2, 2, 2))
            group.position.x = -15
            group.position.y = 10
            group.position.z = -20

            scene.add(group)
        }
        this.addLamberCube = () => {
            let cubeLamberGeom = new THREE.BoxGeometry(15, 15, 15),
                cubeLamber = new THREE.Mesh(cubeLamberGeom, cubeLamberMaterial)

            cubeLamber.position.x = -5
            cubeLamber.position.y = 10
            cubeLamber.position.z = 20
            cubeLamber.rotation.z = -10
            cubeLamber.name = 'cube-lamber-' + scene.children.length

            scene.add(cubeLamber)
        }
        this.addNormalSphere = () => {
            let  sphereSize = Math.ceil(Math.random() * 3),
                sphereSegment = Math.ceil(Math.random() * 40 + 10),
                sphereGeometry = new THREE.SphereGeometry(sphereSize, sphereSegment, sphereSegment),
                sphereMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff})

            sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
            sphere.castShadow = true
            sphere.name = 'sphere-' + scene.children.length
            sphere.position.x = 50 - Math.round(Math.random() * 110)
            sphere.position.y = 0
            sphere.position.z = 50 - Math.round(Math.random() * 100)

            scene.add(sphere)
        }
        this.addShpereNormalMaterial = () => {
            let sphereGeomery = new THREE.SphereGeometry(16, 24, 24),
                sphereMaterial = new THREE.MeshNormalMaterial({flatShading: false}),
                sphere = new THREE.Mesh(sphereGeomery, sphereMaterial)

            sphere.position.x = -20
            sphere.position.y = -3
            sphere.position.z = 0
            sphere.name = 'sphere-normalMaterial-' + scene.children.length

            for (let f = 0, f1 = sphere.geometry.faces.length; f < f1; f++) {
                let face = sphere.geometry.faces[f],
                    centroid = new THREE.Vector3(0, 0, 0)

                centroid.add(sphere.geometry.vertices[face.a])
                centroid.add(sphere.geometry.vertices[face.b])
                centroid.add(sphere.geometry.vertices[face.c])
                centroid.divideScalar(3)

                let arrow = new THREE.ArrowHelper(
                    face.normal,
                    centroid,
                    2,
                    0x3333ff,
                    0.5,
                    0.5
                )
                // sphere.add(arrow)
            }

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

            mesh.translateX(50 - Math.round(Math.random() * 100))
            mesh.translateY(Math.random() * 30 + 10)
            mesh.translateZ(50 - Math.round(Math.random() * 100))
            mesh.name = 'gemo-' + scene.children.length
            scene.add(mesh)
        }
        this.removeLast = () => {
            let allChildren = scene.children,
                lastObject = allChildren[allChildren.length - 1]

            scene.remove(lastObject)
            this.numberOfObjects = scene.children.length
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
                mesh2.translateX(50 - Math.round(Math.random() * 100))
                mesh2.translateY(Math.random() * 30 + 10)
                mesh2.translateZ(50 - Math.round(Math.random() * 100))
                mesh2.name = 'gemo-' + scene.children.length
                scene.add(mesh2)
            }
        }
        this.clear = () => {
            scene = new THREE.Scene();
            scene.add(axis)
            scene.add(plane)
            scene.add(spotLight)
            scene.add(ambientLight)
        }
        this.outputObjects = () => {
            console.log(scene.children)
        }
    }

    sceneLight.add(controls, 'planeRotationX', -1 * Math.PI, Math.PI)
    sceneLight.add(controls, 'planeRotationY', -1 * Math.PI, Math.PI)
    sceneLight.add(controls, 'planeRotationZ', -1 * Math.PI, Math.PI)
    sceneLight.add(controls, 'lightLimitX', -180, 180)
    sceneLight.add(controls, 'lightLimitY', 0, 100)
    sceneLight.add(controls, 'lightLimitZ', -180, 180)
    sceneLight.addColor(controls, 'sceneAmbientColor').onChange(e => {
        ambientLight.color = new THREE.Color(e)
    })

    cameraLimit.add(controls, 'cameraPoiX', -100, 100)
    cameraLimit.add(controls, 'cameraPoiY', -100, 100)
    cameraLimit.add(controls, 'cameraPoiZ', -100, 100)

    cubeList.add(controls, 'addNormalCube')
    cubeList.add(controls, 'addDepthCube')
    cubeList.add(controls, 'addMultiCube')
    cubeList.add(controls, 'addGroupCube')
    cubeList.add(controls, 'addLamberCube')
    cubeList.addColor(controls, 'lamberColor').onChange(e => {
        cubeLamberMaterial.color.setStyle(e)
    })
    cubeList.addColor(controls, 'lamberEmissive').onChange(e => {
        cubeLamberMaterial.emissive = new THREE.Color(e)
    })
    cubeList.add(controls, 'near', 0, 100).onChange(function (e) {
        camera.near = e;
        camera.updateProjectionMatrix();
    });
    cubeList.add(controls, 'far', 50, 200).onChange(function (e) {
        camera.far = e;
        camera.updateProjectionMatrix();
    });

    sphereList.add(controls, 'addNormalSphere')
    sphereList.add(controls, 'addShpereNormalMaterial')

    gui.add(controls, 'rotationSpeed', 0, 0.5)
    gui.add(controls, 'bouncingSpeed', 0, 0.5)
    gui.add(controls, 'addGeometry')
    gui.add(controls, 'clone')
    gui.add(controls, 'removeLast')
    gui.add(controls, 'clear')
    gui.add(controls, 'outputObjects')

    renderer.setClearColor(new THREE.Color(0xeeeeee, 1.0))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true //  打开场景阴影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap

    plane.position.x = 0
    plane.position.y = 0
    plane.position.z = 0
    plane.receiveShadow = true

    spotLight.castShadow = true
    spotLight.shadow.mapSize.width = 2048
    spotLight.shadow.mapSize.height = 2048

    scene.add(axis)
    scene.add(plane)
    scene.add(spotLight)
    scene.add(ambientLight)

    // scene.fog = new THREE.Fog(0xffffff, 0.015, 100) //  雾化效果
    // scene.fog = new THREE.FogExp2(0xffffff, 0.2)  // 随距离呈指数增长雾化效果
    // scene.fog = new THREE.MeshLambertMaterial({color: 0xffffff})  // 强制场景中的所有物体使用相同的材质

    document.getElementById('WebGL-output').appendChild(renderer.domElement)

    renderScene = () => {
        stats.update()
        sphereStep += Math.random() * controls.bouncingSpeed

        plane.rotation.x = controls.planeRotationX
        plane.rotation.y = controls.planeRotationY
        plane.rotation.z = controls.planeRotationZ

        camera.position.x = controls.cameraPoiX
        camera.position.y = controls.cameraPoiY
        camera.position.z = controls.cameraPoiZ
        camera.near = controls.near
        camera.far = controls.far
        camera.lookAt(scene.position)

        spotLight.position.set(controls.lightLimitX, controls.lightLimitY, controls.lightLimitZ)

        scene.traverse(function (e) {
            if (
                e.name.includes('cube-normal-') ||
                e.name.includes('cube-depth-') ||
                e.name.includes('cube-multi-') ||
                e.name.includes('gemo-') ||
                e.name.includes('groupCube-')) {
                e.rotation.x += controls.rotationSpeed;
                e.rotation.y += controls.rotationSpeed;
                e.rotation.z += controls.rotationSpeed;
            }

            if (e.name.includes('sphere-normalMaterial-')) {
                e.rotation.x += controls.rotationSpeed
            }

            if (e.name.includes('cube-lamber-')) {
                e.rotation.y += controls.rotationSpeed
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