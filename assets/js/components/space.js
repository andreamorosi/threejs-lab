import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { DragControls } from 'three/examples/jsm/controls/DragControls';


function spaceFunc() {

  let cubeContainer = document.querySelector('#cube-scene')
  var clock = new THREE.Clock()
  var dragControls
  const cubeCore = []

  //SCENE 
  const scene = new THREE.Scene()
  //

  /*
  CAMERA ha 4 parametri: 
    • Field of View (FOV): valore in gradi, rappresenta l'estensione della scena visualizzata
    • Aspect Ratio: width del contenitore / height del contenitore
    • Near (clipping plane) & Far (clipping plane): questi ultimi due parametri rappresentano
      il range in cui gli oggetti devono essere renderizzati. Per migliorare perfomance, diminuire range.

    ∆ per ora utilizzo una camera PerspectiveCamera, però ce ne sono altre.
  */
  const camera = new THREE.PerspectiveCamera( 100, cubeContainer.clientWidth / cubeContainer.clientHeight, 0.1, 1000 )
  
  camera.position.set(3,1,9)
  camera.lookAt( 0,0,0 )
  //

  // Luce
  const pointLight = new THREE.PointLight(0xffffff)
  pointLight.position.set(2,2,3.5)
  scene.add(pointLight)
  
  const ambientLight = new THREE.AmbientLight(0xffffff)
  scene.add(ambientLight)

  /*
  RENDER: ci sono diversi render in ThreeJS, per ora uso il render di WebGL.
  Imposto la grandezza del renderer, e lo aggiungo al documento HTML.
  */
  const renderer = new THREE.WebGLRenderer({alpha: false, antialias: true})
  renderer.setSize( cubeContainer.clientWidth, cubeContainer.clientHeight )
  cubeContainer.appendChild( renderer.domElement )
  //

  /*
  * CONTROLS
  */
  const controls = new OrbitControls(camera, renderer.domElement);
  console.log("controls")
  console.log(controls)
  controls.enableDamping = true;
  controls.dampingFactor = 0.2;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = true;
  controls.minPolarAngle = Math.PI / 2;
  controls.maxPolarAngle = Math.PI / 2;
  controls.enableKeys = false;

  controls.enabled = false

  if(document.querySelector(".orbit-controls")) {
    document.querySelector(".orbit-controls").addEventListener("click", () => {
      if(controls.enabled) {
        controls.enabled = false
        document.querySelector(".alerts").classList.add("active")
        document.querySelector(".alerts").innerText = "orbitControls disabled!"
        setTimeout(() => {
          document.querySelector(".alerts").classList.remove("active")
          document.querySelector(".alerts").innerText = ""
        }, 1000);
      } else {
        controls.enabled = true
        document.querySelector(".alerts").classList.add("active")
        document.querySelector(".alerts").innerText = "orbitControls active!"
        setTimeout(() => {
          document.querySelector(".alerts").classList.remove("active")
          document.querySelector(".alerts").innerText = ""
        }, 1000);
      }
    })
  }
  if(document.querySelector(".drag-controls")) {
    document.querySelector(".drag-controls").addEventListener("click", () => {
      if(dragControls.enabled) {
        dragControls.enabled = false
        document.querySelector(".alerts").classList.add("active")
        document.querySelector(".alerts").innerText = "dragControls disabled!"
        setTimeout(() => {
          document.querySelector(".alerts").classList.remove("active")
          document.querySelector(".alerts").innerText = ""
        }, 1000);
      } else {
        dragControls.enabled = true
        document.querySelector(".alerts").classList.add("active")
        document.querySelector(".alerts").innerText = "dragControls active!"
        setTimeout(() => {
          document.querySelector(".alerts").classList.remove("active")
          document.querySelector(".alerts").innerText = ""
        }, 1000);
      }
    })
  }

  // 3d model loading
  const loader = new GLTFLoader();
  loader.load( '/assets/models/rock.gltf', function ( rock ) {

    let material = new THREE.MeshBasicMaterial( {color:0x1fff00} );
    scene.add( rock.scene );
    console.log(rock)
    console.log(rock.scene.children[0].material)
    rock.scene.position.set(-2,-9,-9)

    // changing model mesh material
    rock.scene.children[0].material = new THREE.MeshPhysicalMaterial( { color: 0xF75940 } )
  
  }, undefined, function ( error ) {
  
    console.error( error );
  
  } );

  console.log(scene.children)

  //cube
  const geometryCube = new THREE.BoxGeometry()
  const materialCube = new THREE.MeshStandardMaterial( { color: 0x39CFB4 } )
  const cube = new THREE.Mesh( geometryCube, materialCube )
  cube.scale.x = 0.6
  cube.scale.y = 0.6
  cube.scale.z = 0.6
  cube.position.x = 8
  scene.add( cube )
  //

  const geometry = new THREE.TorusGeometry( 10, 3, 8, 100 );
  const material = new THREE.MeshPhysicalMaterial( { color: 0xf14f40 } );
  const torus = new THREE.Mesh( geometry, material );
  //scene.add( torus );

  //sphere
  const geometrySphere = new THREE.SphereGeometry( 4, 64, 32 );
  const materialSphere = new THREE.MeshPhysicalMaterial( { color: 0x39CFB4 } );
  const sphere = new THREE.Mesh( geometrySphere, materialSphere );
  scene.add( sphere );
  sphere.position.x = -10
  sphere.position.y = -2
  sphere.position.z = -2

  setTimeout(() => {
    alert("controls ready")
    dragControls = new DragControls( [...scene.children], camera, renderer.domElement );
    dragControls.addEventListener( 'drag', render );
    dragControls.enabled = false
  }, 2000);


  //line
  const lineMat = new THREE.LineBasicMaterial( { color: 0xF75940 } )
  const linePoints = []
  linePoints.push(new THREE.Vector3(-6,0,0))
  linePoints.push(new THREE.Vector3(0,6,0))
  linePoints.push(new THREE.Vector3(6,0,0))
  linePoints.push(new THREE.Vector3(0,-6,0))
  linePoints.push(new THREE.Vector3(-6,0,0))
  const lineGeometry = new THREE.BufferGeometry().setFromPoints( linePoints )
  const line = new THREE.Line(lineGeometry, lineMat)
  //scene.add(line)
  //

  //lots of cubes
  function cubeGenerator(num) {
    for(let i = 0; i < num; i++) {
      let cubeGeometry = new THREE.BoxGeometry()
      let cubeColor = "rgb("+(i+6)*4+",1"+(Math.floor(Math.random() * 9)+10*3)+","+(i*16)+")"
      console.log(cubeColor)
      let cubeMat = new THREE.MeshBasicMaterial( { color: cubeColor} )
      cubeCore[i] = new THREE.Mesh( cubeGeometry, cubeMat )
      scene.add(cubeCore[i])
      cubeCore[i].position.x = Math.floor(Math.random() * 10)
      cubeCore[i].position.y = i
    }
  }
  //cubeGenerator(1)


  //behaviours
  function sphereBehaviour() {
    sphere.rotation.x += 0.02
    sphere.rotation.y += 0.02
  }
  function cubeBehaviour() {
    cube.rotation.x += 0.005
    cube.rotation.y += 0.005
  }
  function lineBehaviour() {
    line.rotation.x -= 0.005
    line.rotation.y += 0.005
  }
  //

  function render () {
    renderer.render( scene, camera )
  }

  //animate loop
  function animate() {
    cubeBehaviour()
    lineBehaviour()
    sphereBehaviour()

    let t = clock.getElapsedTime()

    /*
    for(let d = 0; d < cubeCore.length; d++) {
      let auxSize = (Math.abs(Math.cos(t)))/1.05;
      cubeCore[d].scale.x = auxSize
      cubeCore[d].scale.y = auxSize
      cubeCore[d].scale.z = auxSize

      cubeCore[d].rotation.x += 0.01
      cubeCore[d].rotation.y += 0.02
    }
    */
    
    controls.update()
    render()
    requestAnimationFrame( animate )
  }
  animate()
}
export default spaceFunc;