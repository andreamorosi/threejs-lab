import * as THREE from 'three'

function coreFunc() {

  let cubeContainer = document.querySelector('#cube-scene')
  var clock = new THREE.Clock()
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
  const camera = new THREE.PerspectiveCamera( 75, cubeContainer.clientWidth / cubeContainer.clientHeight, 0.1, 1000 )
  camera.position.set(0,0,10)
  camera.lookAt( 0, 0, 0 )
  //

  /*
  RENDER: ci sono diversi render in ThreeJS, per ora usiamo il render di WebGL.
  Imposto la grandezza del renderer, e lo aggiungo al documento HTML.
  */
  const renderer = new THREE.WebGLRenderer()
  renderer.setSize( cubeContainer.clientWidth, cubeContainer.clientHeight )
  cubeContainer.appendChild( renderer.domElement )
  //

  //cube
  const geometry = new THREE.BoxGeometry()
  const material = new THREE.MeshBasicMaterial( { color: 0x39CFB4 } )
  const cube = new THREE.Mesh( geometry, material )
  cube.scale.x = 4
  cube.scale.y = 4
  cube.scale.z = 4
  scene.add( cube )
  //

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
  scene.add(line)
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
  cubeGenerator(7)


  //behaviours
  function cubeBehaviour() {
    cube.rotation.x += 0.01
    cube.rotation.y += 0.02
  }
  function lineBehaviour() {
    line.rotation.x -= 0.01
    line.rotation.y += 0.01
  }
  //

  function clickTitle() {
    document.querySelector('#scene-title').addEventListener('click', () => {
      console.log('Clicked!')
      cube.scale.x = Math.floor(Math.random() * 7)
      cube.scale.y = Math.floor(Math.random() * 7)
      cube.scale.z = Math.floor(Math.random() * 7)
    })
  }
  clickTitle()

  function createCube() {
    document.querySelector('#create-cube').addEventListener('click', () => {
      console.log('Adding cube')
      let auxGeometry = new THREE.BoxGeometry()
      let auxMaterial = new THREE.MeshBasicMaterial( { color: 0x96C0CE } )
      let auxCube = new THREE.Mesh( auxGeometry, auxMaterial )
      auxCube.scale.x = 2
      auxCube.scale.y = 2
      auxCube.scale.z = 2
      auxCube.position.x = 1
      auxCube.position.y = 3
      auxCube.name = 'Nuovo cubo'
      scene.add( auxCube )
      console.log(scene.children)
      scene.children.splice(2,1)
    })
  }
  createCube()

  function deleteCube() {
    document.querySelector('#delete-cube').addEventListener('click', () => {
      console.log('Deleting cube')
      for( var i = 0; i < scene.children.length; i++) {
        if ( scene.children[i].name === 'Nuovo cubo') {
          scene.children.splice(i, 1);
          //ma non viene eliminato dalla memoria, perchè serve il dispose() ma la doc fa schifo
        }
      }
    })
  }
  deleteCube()

  //animate loop
  function animate() {
    cubeBehaviour()
    lineBehaviour()

    let t = clock.getElapsedTime()
    for(let d = 0; d < cubeCore.length; d++) {
      let auxSize = (Math.abs(Math.cos(t)))/1.05;
      cubeCore[d].scale.x = auxSize
      cubeCore[d].scale.y = auxSize
      cubeCore[d].scale.z = auxSize

      cubeCore[d].rotation.x += 0.01
      cubeCore[d].rotation.y += 0.02
    }
    
    requestAnimationFrame( animate )
    renderer.render( scene, camera )
  }
  animate()
}
export default coreFunc;