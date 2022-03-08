import styles from '../sass/main.scss'
//import Lib from './folder/lib.js';
import coreFunc from './components/core.js'
import spaceFunc from './components/space.js'
import raycastFunc from './components/raycast.js'

document.addEventListener("DOMContentLoaded", function (event) {

  if(document.querySelector("#home")) {
    coreFunc()
  }
  if(document.querySelector("#space")) {
    spaceFunc()
  }
  if(document.querySelector("#raycast")) {
    raycastFunc()
  }

  window.addEventListener('load', function () {
    
  })
})