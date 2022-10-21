<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

import * as THREE from 'three'

import vertexShader from './shaders/basic.vert'
import fragmentShader from './shaders/main.frag'
import maskFragmentShader from './shaders/mask.frag'

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const maskScene = new THREE.Scene()

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
const uTime = ref(0)
const uAspect = ref(1)

/**
 * Render Targets
 */
const tMask = { value: null }
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
    tMask.value = targets.read.texture
  },
}

/**
 * Interaction Layer
 */
let mouseMovedThisFrame = false
const lastMouse = [-1, -1]
const mouse = [-1, -1]
const mouseVelocity = [0, 0]
const maskMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader: maskFragmentShader,
  uniforms: {
    tMask,
    uFalloff: { value: 0.01 },
    uAspect: { value: windowWidth / windowHeight },
    uDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
    uMouse: { value: mouse },
    uMouseVelocity: { value: mouseVelocity },
  },
})
const maskMesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), maskMaterial)
maskMesh.position.z = -1.0
maskScene.add(maskMesh)

/**
 * Display Layer
 */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    tMask,
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

  if (mouseMovedThisFrame) {
    mouseMovedThisFrame = false
    mouseVelocity[0] = mouse[0] - lastMouse[0]
    mouseVelocity[1] = mouse[1] - lastMouse[1]
  } else {
    mouse[0] = -1
    mouse[1] = -1
  }

  renderer.setRenderTarget(targets.write)
  renderer.render(maskScene, camera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  targets.swap()

  if (mouseMovedThisFrame) {
    lastMouse[0] = mouse[0]
    lastMouse[1] = mouse[1]
  }
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
  const { pageX, pageY } = event
  const newX = pageX / windowWidth
  const newY = 1 - pageY / windowHeight
  mouse[0] = newX
  mouse[1] = newY
  mouseMovedThisFrame = true
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
