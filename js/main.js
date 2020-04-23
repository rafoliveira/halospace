var scene, camera, renderer, nebula_particles = [], composer

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
    scene.fog = new THREE.FogExp2('#000', 0.001)
    renderer.setClearColor(scene.fog.color)
    document.body.appendChild(renderer.domElement)

    textureLoader('img/cloud_particle1.png', 20)
    textureLoader('img/cloud_particle2.png', 30)
    textureLoader('img/cloud_particle3.png', 20)

    hdr(renderer)
    render()
}

function render() {
    nebula_particles.forEach(p => {
        p.rotation.z -= 0.0002
    })
    composer.render(0.1)
    requestAnimationFrame(render)
}

init()

window.addEventListener('resize', onWindowResize, false)

function light() {
    let directionalLight = new THREE.DirectionalLight('#d000ff')
    directionalLight.position.set(0, 0, 1)
    scene.add(directionalLight)

    let lightblue = new THREE.PointLight('#00ccff', 50, 450, 1.7)
    lightblue.position.set(200, 300, 100)
    scene.add(lightblue)

    let pink = new THREE.PointLight('#ff00f2', 50, 450, 1.7)
    pink.position.set(200, 300, 100)
    scene.add(pink)

    let blue = new THREE.PointLight('#2200ff', 50, 450, 1.7)
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