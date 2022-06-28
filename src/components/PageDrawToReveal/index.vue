<script>
export default {
  name: 'PageDrawToReveal',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from 'components/ProjectContainer'

import * as THREE from 'three'
import basicVertexShader from './shaders/basic.vert'
import maskFragmentShader from './shaders/mask.frag'
import mainFragmentShader from './shaders/main.frag'

import gsap from 'gsap'

const config = {
  cameraPosition: new THREE.Vector3(0.0, 0.0, 0.0),
}

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const maskScene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Cameras
 */
const camera = new THREE.PerspectiveCamera()
camera.position.set(config.cameraPosition.x, config.cameraPosition.y, config.cameraPosition.z)
camera.lookAt(0, 0, 0)
let maskCamera = camera.clone()

// mouse values will be between 0 and 1
const mouse = new THREE.Vector2(-1)
let mouseIsDown = false

/**
 * Helper functions
 */
function getViewSizeAtDepth(camera, depth = 0) {
  const fovInRadians = (camera.fov * Math.PI) / 180
  const height = Math.abs((camera.position.z - depth) * Math.tan(fovInRadians / 2) * 2)
  return { width: height * camera.aspect, height }
}

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
 * Meshes
 */
const geometry = new THREE.PlaneGeometry()
const maskMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: maskFragmentShader,
  uniforms: {
    tMask,
    uFalloff: { value: 0.05 },

    uAspect: { value: windowWidth / windowHeight },
    uDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
    uMouse: { value: mouse },
  },
})
const maskMesh = new THREE.Mesh(geometry, maskMaterial)
maskMesh.position.z = -1
maskScene.add(maskMesh)

const mainMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: mainFragmentShader,
  uniforms: {
    tMask,
    tImage1: { value: null },
    tImage2: { value: null },
    uImage1Dimensions: { value: new THREE.Vector2() },
    uImage2Dimensions: { value: new THREE.Vector2() },
    uScreenDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
  },
})
const mainMesh = new THREE.Mesh(geometry, mainMaterial)
mainMesh.position.z = -1
scene.add(mainMesh)

/**
 * Assets
 */

new THREE.TextureLoader().load('/assets/img/agencyea-reveal-1.jpg', (texture) => {
  mainMaterial.uniforms.tImage1.value = texture
  mainMaterial.uniforms.uImage1Dimensions.value = new THREE.Vector2(
    texture.source.data.width,
    texture.source.data.height
  )
})
new THREE.TextureLoader().load('/assets/img/agencyea-reveal-2.jpg', (texture) => {
  mainMaterial.uniforms.tImage2.value = texture
  mainMaterial.uniforms.uImage2Dimensions.value = new THREE.Vector2(
    texture.source.data.width,
    texture.source.data.height
  )
})

/**
 * Render Functions
 */
function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)

  renderer.setRenderTarget(targets.write)
  renderer.render(maskScene, maskCamera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  targets.swap()
}

/**
 * Events
 */

function mousemove(event) {
  const { clientX, clientY } = event

  if (mouseIsDown) {
    mouse.set(clientX / windowWidth, 1 - clientY / windowHeight)
  } else {
    mouse.set(-1)
  }
}

function mousedown(event) {
  const { clientX, clientY } = event
  mouseIsDown = true
  mouse.set(clientX / windowWidth, 1 - clientY / windowHeight)
}

function mouseup() {
  mouseIsDown = false
}

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  maskCamera = camera.clone()

  renderer.setSize(windowWidth, windowHeight)

  // resize fullscreen mesh
  const viewSize = getViewSizeAtDepth(camera, -1)
  maskMesh.scale.set(viewSize.width, viewSize.height)
  mainMesh.scale.set(viewSize.width, viewSize.height)
}

function reset() {
  renderer.setRenderTarget(targets.read)
  renderer.clear()
}

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
  <ProjectContainer title="Draw to Reveal" :tech="['WebGL', 'GLSL', 'ThreeJS']">
    <div
      ref="container"
      class="container"
      @mousedown="mousedown"
      @mouseup="mouseup"
      @mousemove="mousemove"
    ></div>
    <button class="reset" @click="reset">Reset</button>

    <template #description>
      <p>Uses custom-written GLSL shaders to dilate the mask drawn by the user.</p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
.reset {
  position: absolute;
  bottom: 20px;
  left: 20px;
}
</style>
