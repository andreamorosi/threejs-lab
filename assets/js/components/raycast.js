import * as THREE from 'three';

import { DragControls } from 'three/examples/jsm/controls/DragControls.js';

import Stats from 'three/examples/jsm/libs/stats.module.js';

function raycastFunc() {


  let container, stats;
  let camera, scene, raycaster, renderer, dragControls, ghostObj
  let cubeContainer = document.querySelector('#cube-scene')

  let INTERSECTED;
  let theta = 0;

  const pointer = new THREE.Vector2();
  const radius = 100;

  init();
  animate();

  function init() {

    container = document.createElement( 'div' );
    document.body.appendChild( container );

    camera = new THREE.PerspectiveCamera( 70, cubeContainer.clientWidth / cubeContainer.clientHeight, 1, 10000 );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xf0f0f0 );

    const light = new THREE.DirectionalLight( 0xffffff, 1 );
    light.position.set( 1, 1, 1 ).normalize();
    scene.add( light );

    const geometry = new THREE.BoxGeometry( 20, 20, 20 );

    for ( let i = 0; i < 2000; i ++ ) {

      const object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

      object.position.x = Math.random() * 800 - 400;
      object.position.y = Math.random() * 800 - 400;
      object.position.z = Math.random() * 800 - 400;

      object.rotation.x = Math.random() * 2 * Math.PI;
      object.rotation.y = Math.random() * 2 * Math.PI;
      object.rotation.z = Math.random() * 2 * Math.PI;

      object.scale.x = Math.random() + 0.5;
      object.scale.y = Math.random() + 0.5;
      object.scale.z = Math.random() + 0.5;

      scene.add( object );

    }


    raycaster = new THREE.Raycaster();

    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    //renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setSize( cubeContainer.clientWidth, cubeContainer.clientHeight )
    //container.appendChild( renderer.domElement );
    cubeContainer.appendChild( renderer.domElement )

    stats = new Stats();
    container.appendChild( stats.dom );

    /*
    * CONTROLS
    */
    setTimeout(() => {
      console.log("controls ready")
      dragControls = new DragControls( [...scene.children], camera, renderer.domElement );
      dragControls.addEventListener( 'drag', render );
      dragControls.enabled = true
    }, 1000);

    document.addEventListener( 'mousemove', onPointerMove );

    document.addEventListener("dblclick", doubleClick)

    //

    window.addEventListener( 'resize', onWindowResize );

  }

  function onWindowResize() {

    //camera.aspect = window.innerWidth / window.innerHeight;
    camera.aspect = cubeContainer.clientWidth / cubeContainer.clientHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( cubeContainer.clientWidth, cubeContainer.clientHeight );

  }

  function onPointerMove( event ) {
    const {top, left, width, height} = renderer.domElement.getBoundingClientRect();

    pointer.x = ( (event.clientX - left) / width ) * 2 - 1;
    pointer.y = - ( (event.clientY - top) / height ) * 2 + 1;

  }

  function doubleClick (event) {
    console.log(ghostObj)
    document.querySelector(".ghostinfo").innerHTML = 
    `
    <div><em>uuid</em>: ${ghostObj.uuid}</div>
    <div><em>position</em>: x = ${ghostObj.position.x}, y = ${ghostObj.position.y}, z = ${ghostObj.position.z}</div>
    <div><em>scale</em>: x = ${ghostObj.scale.x}, y = ${ghostObj.scale.y}, z = ${ghostObj.scale.z}</div>
    `
  }

  //

  function animate() {

    requestAnimationFrame( animate );

    render();
    stats.update();
  }

  function render() {

    /*
    theta += 0.1;
    camera.position.x = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.y = radius * Math.sin( THREE.MathUtils.degToRad( theta ) );
    camera.position.z = radius * Math.cos( THREE.MathUtils.degToRad( theta ) );
    camera.lookAt( scene.position );
    */

    camera.updateMatrixWorld();

    // find intersections

    raycaster.setFromCamera( pointer, camera );

    const intersects = raycaster.intersectObjects( scene.children, false );

    if ( intersects.length > 0 ) {

      if ( INTERSECTED != intersects[ 0 ].object ) {

        if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

        INTERSECTED = intersects[ 0 ].object;
        INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
        INTERSECTED.material.emissive.setHex( 0xff0000 );
        ghostObj = intersects[ 0 ].object

      }

    } else {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

      INTERSECTED = null;

    }

    renderer.render( scene, camera );

  }
}

export default raycastFunc;