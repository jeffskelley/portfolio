<script>
export default {
  name: 'PageBoids',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

import * as THREE from 'three'
import { GPUComputationRenderer } from 'three/addons/misc/GPUComputationRenderer.js'

import vertexShader from './shaders/basic.vert'
import boidMapFragmentShader from './shaders/boidMap.frag'
import boidsVert from './shaders/boids.vert'
import boidsFrag from './shaders/boids.frag'

/**
 * Initialization
 */

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

const camera = new THREE.PerspectiveCamera()
camera.position.set(0, 0, 1)
camera.lookAt(0, 0, 0)

let gpuCompute
let positionVelocityVariable
let positionVelocityUniforms
const SIZE = 1024 // must be a power of 2

/**
 * Helper functions
 */
function getViewSizeAtDepth(camera, depth = 0) {
  const fovInRadians = (camera.fov * Math.PI) / 180
  const height = Math.abs((camera.position.z - depth) * Math.tan(fovInRadians / 2) * 2)
  return { width: height * camera.aspect, height }
}

let randomSeed = new Date().getTime()
window.Math.random = function () {
  // fast pseudorandom
  const x = Math.sin(randomSeed++) * 10000
  return x - Math.floor(x)
}

/**
 * Entities
 */
let boidsUniforms = {
  uTime: { value: 0 },
  uDelta: { value: 0 },
  tPositionVelocity: { value: null },
}
const boidsGeometry = new THREE.PlaneGeometry()
// const vertices = Float32Array.from([...new Array(SIZE)].map(() => 0))
// boidsGeometry.setAttribute('position', new THREE.BufferAttribute(vertices), 3)
const boidsMesh = new THREE.Mesh(
  boidsGeometry,
  new THREE.ShaderMaterial({
    vertexShader: boidsVert,
    fragmentShader: boidsFrag,
    uniforms: boidsUniforms,
  })
)
boidsMesh.scale.x = 0.75
boidsMesh.scale.y = 0.75
scene.add(boidsMesh)

/**
 * Initialization functions
 */
function fillTexture(texture) {
  const textureArray = texture.image.data
  for (let i = 0, l = textureArray.length; i < l; i += 4) {
    const velocity = new THREE.Vector2(Math.random(), Math.random())
    velocity.normalize()
    textureArray[i + 0] = Math.random() // position x
    textureArray[i + 1] = Math.random() // position y
    textureArray[i + 2] = velocity.x - 0.5 // velocity x
    textureArray[i + 3] = velocity.y - 0.5 // velocity y
  }
  return textureArray
}

function initComputeRenderer() {
  gpuCompute = new GPUComputationRenderer(Math.sqrt(SIZE), Math.sqrt(SIZE), renderer)
  const computeTexture = gpuCompute.createTexture()
  fillTexture(computeTexture)
  positionVelocityVariable = gpuCompute.addVariable(
    'positionVelocityVariable',
    boidMapFragmentShader,
    computeTexture
  )
  positionVelocityVariable.wrapS = THREE.RepeatWrapping
  positionVelocityVariable.wrapT = THREE.RepeatWrapping

  positionVelocityUniforms = positionVelocityVariable.material.uniforms
  positionVelocityUniforms.uTime = { value: 0.0 }
  positionVelocityUniforms.uDelta = { value: 0.0 }
  positionVelocityUniforms.uSeparationDistance = { value: 1.0 }
  positionVelocityUniforms.uAlignmentDistance = { value: 1.0 }
  positionVelocityUniforms.uCohesionDistance = { value: 1.0 }
  positionVelocityUniforms.uFreedomFactor = { value: 1.0 }

  const error = gpuCompute.init()
  if (error !== null) {
    console.error(error)
  }
}

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
  initComputeRenderer()
}

let last
function animate(time) {
  requestAnimationFrame(animate)

  let delta = (time - last) / 1000
  if (delta > 1) delta = 1 // safety cap on large deltas
  last = time

  positionVelocityUniforms.uTime.value = time
  positionVelocityUniforms.uDelta.value = delta
  boidsUniforms.uTime.value = time
  boidsUniforms.uDelta.value = delta

  gpuCompute.compute()

  boidsUniforms.tPositionVelocity.value =
    gpuCompute.getCurrentRenderTarget(positionVelocityVariable).texture
  renderer.render(scene, camera)
}
/**
 * Events
 */

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  renderer.setSize(windowWidth, windowHeight)
}

// function generateInitialImage() {
//   const canvas = document.querySelector('.canvas')
//   const ctx = canvas.getContext('2d')

//   for (let x = 0; x < 32; x++) {
//     for (let y = 0; y < 32; y++) {
//       ctx.fillStyle = `rgb(
//         ${Math.random() * 255},
//         ${Math.random() * 255},
//         ${Math.random() * 255}
//       )`
//       ctx.fillRect(x, y, 1, 1)
//     }
//   }
// }

/**
 * Lifecycle
 */
onMounted(() => {
  init()
  resize()
  animate()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)

  renderer.forceContextLoss()
})
</script>

<template>
  <ProjectContainer :show-info="false">
    <div ref="container" class="container"></div>

    <!-- <canvas width="32" height="32" class="canvas" /> -->
  </ProjectContainer>
</template>

<style lang="scss"></style>
