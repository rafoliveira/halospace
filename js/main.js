var scene, camera, renderer, nebula_particles = [], composer, halo_ring


function init() {
    scene = new THREE.Scene()
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
    camera.position.z = 10
    camera.rotation.x = 1.16
    camera.rotation.y = -0.12
    camera.rotation.z = 0.27

    let ambientLight = new THREE.AmbientLight('#76B3EA')
    scene.add(ambientLight)

    light()

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)
    
    let loaderGLTF = new THREE.GLTFLoader();
    loaderGLTF.load('img/sacred_ring_halo/scene.gltf', function(gltf){
      halo_ring = gltf.scene.children[0];
      halo_ring.position.set(0,450,-180);
      halo_ring.rotation.set(-2.1,3.4,-1.2);
      halo_ring.scale.set(0.2,0.2,0.2);
      scene.add(gltf.scene);
    });

    let loader = new THREE.TextureLoader()
    loader.load('img/stars.jpg', function (texture) {
        scene.background = texture;  
    })

    textureLoader('img/cloud_particle1.png', 20)
    textureLoader('img/cloud_particle2.png', 30)
    textureLoader('img/cloud_particle3.png', 20)
    
    
    hdr(renderer)
    render()
}

document.addEventListener('keypress', logKey);

function logKey(e) {
    console.log(e.code)

    if(e.code == "KeyS"){
        halo_ring.rotation.z -= 0.1;
    }
    if(e.code == "KeyW"){
        halo_ring.rotation.z += 0.1;
    }
    if(e.code == "KeyA"){
        halo_ring.rotation.x -= 0.1;
    }
    if(e.code == "KeyD"){
        halo_ring.rotation.x += 0.1;
    }
    if(e.code == "KeyQ"){
        halo_ring.rotation.y += 0.1;
    }


    if(e.code == "KeyE"){
        halo_ring.rotation.y -= 0.1;
    }
    console.log(halo_ring.rotation)

}
  


function render() {
    nebula_particles.forEach(p => {
        p.rotation.z -= 0.001

    })

    try {
        halo_ring.rotation.x -= 0.005;
    } catch (error) {
        
    }

    composer.render(0.1)
    requestAnimationFrame(render)
}

init()

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();
}, false)

function light() {
    let directionalLight = new THREE.DirectionalLight('#fff')
    directionalLight.position.set(0, 0, 1)
    scene.add(directionalLight)


    let white = new THREE.PointLight('#a3e5ff', 50, 300, 6.5)
    white.position.set( -120,  190,  -130)
    
    scene.add(white)

    let pink = new THREE.PointLight('#ff00f2', 50, 450, 6.5)
    pink.position.set(200, 300, 100)
    scene.add(pink)

    let blue = new THREE.PointLight('#2200ff', 50, 450, 6.5)
    blue.position.set(200, 300, 100)
    scene.add(blue)
}

function textureLoader(path, amount) {
    let loader = new THREE.TextureLoader()
    loader.load(path, function (texture) {
        var geometry = new THREE.PlaneBufferGeometry(500, 500)
        var material = new THREE.MeshLambertMaterial({
            map: texture,
            transparent: true
        })

        for (let i = 0; i < amount; i++) {
            let nebula = new THREE.Mesh(geometry, material)
            nebula.position.set(
                Math.random() * 900 - 400,
                Math.random() * 50 + 500,
                Math.random() * 500 - 500,
            )
            nebula.rotation.x = 1.16
            nebula.rotation.y = -0.12
            nebula.rotation.z = Math.random() * 2 * Math.PI
            nebula.material.opacity = 0.75
            nebula_particles.push(nebula)
            scene.add(nebula)
        }
    })
}

function hdr(renderer) {
    const bloomEffect = new POSTPROCESSING.BloomEffect({
        blendFunction: POSTPROCESSING.BlendFunction.COLOR_DODGE,
        kernelSize: POSTPROCESSING.KernelSize.SMALL,
        useLuminanceFilter: true,
        luminanceThreshold: 0.3,
        luminanceSmoothing: 0.75
    });
    bloomEffect.blendMode.opacity.value = 1.5;

    let effectPass = new POSTPROCESSING.EffectPass(camera, bloomEffect)
    effectPass.renderToScreen = true

    composer = new POSTPROCESSING.EffectComposer(renderer)
    composer.addPass(new POSTPROCESSING.RenderPass(scene, camera))
    composer.addPass(effectPass)
}
