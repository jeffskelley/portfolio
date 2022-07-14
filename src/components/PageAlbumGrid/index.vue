<script>
export default {
  name: 'PageAlbumGrid',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from 'components/ProjectContainer'
import artwork1 from './assets/albumart-tyler.jpg'
import artwork2 from './assets/albumart-phoebe-bridgers.jpg'
import artwork3 from './assets/albumart-solange.jpg'
import artwork4 from './assets/albumart-floating-points.jpg'

import * as THREE from 'three'
import vertexShader from './shaders/basic.vert'
import fragmentShader from './shaders/main.frag'

import gsap from 'gsap'

const mouseAmt = ref(0.25)
const width = ref(300.0)
const gutter = ref(30.0)
const cycleLength = ref(20.0)
const speed = ref(0.001)

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera()
camera.lookAt(0, 0, 0)

// mouse values will be between -1 and 1
const mouse = new THREE.Vector2(0, 0)

/**
 * Helper functions
 */
function getViewSizeAtDepth(camera, depth = 0) {
  const fovInRadians = (camera.fov * Math.PI) / 180
  const height = Math.abs((camera.position.z - depth) * Math.tan(fovInRadians / 2) * 2)
  return { width: height * camera.aspect, height }
}

/**
 * Mesh
 */
const geometry = new THREE.PlaneGeometry()
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    tImage1: { value: null },
    tImage2: { value: null },
    tImage3: { value: null },
    tImage4: { value: null },
    uWindowDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
    uMouse: { value: mouse },
    uTime: { value: 0 },

    uMouseAmt: mouseAmt,
    uWidth: width,
    uGutter: gutter,
    uCycleLength: cycleLength,
    uSpeed: speed,
  },
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = -1
scene.add(mesh)

/**
 * Assets
 */

const loader = new THREE.TextureLoader()
loader.load(artwork1, (texture) => {
  material.uniforms.tImage1.value = texture
})
loader.load(artwork2, (texture) => {
  material.uniforms.tImage2.value = texture
})
loader.load(artwork3, (texture) => {
  material.uniforms.tImage3.value = texture
})
loader.load(artwork4, (texture) => {
  material.uniforms.tImage4.value = texture
})

/**
 * Render Functions
 */
function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  material.uniforms.uMouse.value = mouse
  material.uniforms.uTime.value = time
  renderer.render(scene, camera)
}

/**
 * Events
 */

function mousemove(event) {
  const { clientX, clientY } = event
  gsap.to(mouse, {
    x: (clientX / windowWidth) * 2.0 - 1.0,
    y: (1.0 - clientY / windowHeight) * 2.0 - 1.0,
    duration: 2,
  })
}

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  renderer.setSize(windowWidth, windowHeight)

  material.uniforms.uWindowDimensions.value.set(windowWidth, windowHeight)

  // resize fullscreen mesh
  const viewSize = getViewSizeAtDepth(camera, -1)
  mesh.scale.set(viewSize.width, viewSize.height)
}

/**
 * Lifecycle
 */
onMounted(() => {
  init()
  resize()
  animate()
  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', mousemove)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', mousemove)
  renderer.forceContextLoss()
})
</script>

<template>
  <ProjectContainer title="Album Grid" :tech="['WebGL', 'GLSL', 'ThreeJS']">
    <div ref="container" class="container"></div>

    <template #description>
      <p>Pulled from a prototype I created for a streaming music client.</p>
      <p>Rendered entirely in the fragment shader.</p>

      <ul>
        <li>
          <label>Mouse Pan</label>
          <input v-model="mouseAmt" type="range" step="0.0001" :min="0" :max="1.0" />
        </li>
        <li>
          <label>Artwork Size</label>
          <input v-model="width" type="range" :min="100" :max="500" />
        </li>
        <li>
          <label>Gutter Size</label>
          <input v-model="gutter" type="range" :min="0" :max="40" />
        </li>
        <li>
          <label>Cycle length</label>
          <input v-model="cycleLength" type="range" :min="4" :max="30" />
        </li>
        <li>
          <label>Speed</label>
          <input v-model="speed" type="range" step="0.0001" :min="0" :max="0.005" />
        </li>
      </ul>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
</style>
