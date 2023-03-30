<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import * as THREE from 'three'
import gsap from 'gsap'

import vertexShader from './shaders/basic.vert'
import fragmentShader from './shaders/main.frag'
import flowmapFragmentShader from './shaders/flowmap.frag'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const flowmapScene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
camera.position.set(0, 0, 0)
camera.lookAt(0, 0, -1)

// const controls = new OrbitControls(camera, renderer.domElement)

/**
 * Global Refs
 */
const uTime = { value: 0 }
const uAspect = { value: windowWidth / windowHeight }
const tMap = { value: null }
const mouse = new THREE.Vector2() // mouse values will be between 0 and 1
const velocity = new THREE.Vector2()
const velocityTweened = new THREE.Vector2()
const lastMouse = new THREE.Vector2()
let lastTime = null

/**
 * Render Targets
 */
const targetOptions = {
  depthBuffer: false,
  stencilBuffer: false,
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
}
const targets = {
  read: new THREE.WebGLRenderTarget(windowWidth, windowHeight, targetOptions),
  write: new THREE.WebGLRenderTarget(windowWidth, windowHeight, targetOptions),
  // Helper function to ping pong the render targets and update the uniform
  swap: () => {
    const temp = targets.read
    targets.read = targets.write
    targets.write = temp
    tMap.value = targets.read.texture
  },
}

/**
 * Interaction Layer
 */
// let mouseMovedThisFrame = false
// const lastMouse = [-1, -1]
// const mouse = [-1, -1]
// const mouseVelocity = [0, 0]

// const maskMaterial = new THREE.ShaderMaterial({
//   vertexShader,
//   fragmentShader: maskFragmentShader,
//   uniforms: {
//     tMask,
//     uFalloff: { value: 0.01 },
//     uAspect: { value: windowWidth / windowHeight },
//     uDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
//     uMouse: { value: mouse },
//     uMouseVelocity: { value: mouseVelocity },
//   },
// })
// const maskMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), maskMaterial)
// maskMesh.position.z = -1.0
// maskScene.add(maskMesh)

const flowmapMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader: flowmapFragmentShader,
  uniforms: {
    tMap,
    uTime,
    uAspect,
    uFalloff: { value: 0.15 },
    uDissipation: { value: 0.97 },
    uAlpha: { value: 0.3 },
    uMouse: { value: mouse },
    uVelocity: { value: velocityTweened },
  },
})
const flowmapMesh = new THREE.Mesh(new THREE.PlaneGeometry(), flowmapMaterial)
flowmapMesh.position.z = -1.0
flowmapScene.add(flowmapMesh)

/**
 * Display Layer
 */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    tMap,
    uTime,
    uAspect,
  },
})
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), material)
mesh.position.z = -1.0
scene.add(mesh)

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  uTime.value = time

  if (!velocity.needsUpdate) {
    mouse.set(-1)
    velocity.set(0)
  }
  velocity.needsUpdate = false

  renderer.setRenderTarget(targets.write)
  renderer.render(flowmapScene, camera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  targets.swap()
}

/**
 * Events
 */
function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  uAspect.value = windowWidth / windowHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  renderer.setSize(windowWidth, windowHeight)
}

function mousemove(event) {
  const { clientX, clientY } = event

  mouse.set(clientX / windowWidth, 1 - clientY / windowHeight)

  // Calculate velocity
  if (!lastTime) {
    // First frame
    lastTime = performance.now()
    lastMouse.set(clientX, clientY)
  }

  const deltaX = clientX - lastMouse.x
  const deltaY = clientY - lastMouse.y

  lastMouse.set(clientX, clientY)

  const time = performance.now()

  // Avoid dividing by 0
  const delta = Math.max(14, time - lastTime)
  lastTime = time
  velocity.set(deltaX / delta, deltaY / delta)
  gsap.to(velocityTweened, { x: velocity.x, y: velocity.y, duration: 0.5 })

  // Flag update to prevent hanging velocity values when not moving
  velocity.needsUpdate = true
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
  <div ref="container" class="container"></div>
</template>

<style lang="scss"></style>
