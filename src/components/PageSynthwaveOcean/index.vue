<script>
export default {
  name: 'PageSynthwaveOcean',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from 'components/ProjectContainer'
import * as THREE from 'three'
import gsap from 'gsap'
import hexToRGB from 'util/hexToRGB'

import oceanFragmentShader from './oceanFragment2.glsl'
import oceanVertexShader from './oceanVertex.glsl'

const config = {
  cameraPosition: { x: 0, y: 4, z: 20 },
  mouseDelta: { x: 0.5, y: 0.5 },
  colors: {
    pink: 0xff00c6,
    blue: 0x00f1ff,
    purple: 0x9100ff,
    red: 0xfd1d53,
    orange: 0xff6c11,
    white: 0xffffff,
  },
}

let windowWidth
let windowHeight
const container = ref(null)
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)

const camera = new THREE.PerspectiveCamera()
camera.position.set(config.cameraPosition.x, config.cameraPosition.y, config.cameraPosition.z)
camera.lookAt(0, 0, 0)

// mouse values will be between -1 and 1
let mouse = { x: 0, y: 0 }

/**
 * Ocean
 */
const oceanGeometry = new THREE.PlaneGeometry(50, 30, 50, 30)
const oceanMaterial = new THREE.ShaderMaterial({
  vertexShader: oceanVertexShader,
  fragmentShader: oceanFragmentShader,
  // wireframe: true,
  uniforms: {
    uTime: {
      value: 0.0,
    },
    uOceanColor: {
      value: hexToRGB(config.colors.blue),
    },
  },
  extensions: {
    derivatives: true,
  },
})
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
ocean.rotation.x = -Math.PI / 2
ocean.position.z = 5
scene.add(ocean)

/**
 * Stars
 */
const starsGeometry = new THREE.BufferGeometry()
const starsMaterial = new THREE.PointsMaterial({
  color: config.colors.white,
})
const starsVertices = []
for (let i = 0; i < 1000; i++) {
  starsVertices.push(
    (Math.random() - 0.5) * 1000,
    (Math.random() - 0.5) * 1000,
    -Math.random() * 1000
  )
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
console.log({ starsVertices, starsGeometry })
const stars = new THREE.Points(starsGeometry, starsMaterial)
console.log(stars)
scene.add(stars)

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  camera.position.set(
    config.cameraPosition.x + mouse.x * config.mouseDelta.x,
    config.cameraPosition.y + mouse.y * config.mouseDelta.y
  )
  oceanMaterial.uniforms.uTime.value = time
  renderer.render(scene, camera)
}

/**
 * Events
 */

function mousemove(event) {
  const { clientX, clientY } = event
  gsap.to(mouse, {
    x: (clientX / windowWidth) * 2 - 1,
    y: ((clientY / windowHeight) * 2 - 1) * -1,
    duration: 2,
  })
}

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  renderer.setSize(windowWidth, windowHeight)
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
})
</script>

<template>
  <ProjectContainer title="Synthwave Ocean" :tech="['WebGL', 'ThreeJS']">
    <div ref="container" class="container"></div>

    <template #description>
      <p>Short description of project.</p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">

</style>
