<script>
export default {
  name: 'PageFlowmapDistortion',
}
</script>

<script setup>
// flowmap is essentially my THREEjs port of https://github.com/oframe/ogl/blob/master/src/extras/Flowmap.js

import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from 'components/ProjectContainer'

import * as THREE from 'three'
import basicVertexShader from './shaders/basic.vert'
import flowmapFragmentShader from './shaders/flowmap.frag'
import mainFragmentShader from './shaders/main.frag'

import gsap from 'gsap'

const config = {
  cameraPosition: new THREE.Vector3(0.0, 0.0, 0.0),
}

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const flowmapScene = new THREE.Scene()
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
let flowmapCamera = camera.clone()

// mouse values will be between 0 and 1
const mouse = new THREE.Vector2()
const velocity = new THREE.Vector2()
const velocityTweened = new THREE.Vector2()
const lastMouse = new THREE.Vector2()
let lastTime = null

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
const tMap = { value: null }
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
 * Meshes
 */
const geometry = new THREE.PlaneGeometry()
const flowmapMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: flowmapFragmentShader,
  uniforms: {
    tMap,
    uTime: { value: 0.0 },
    uFalloff: { value: 0.1 },
    uDissipation: { value: 0.97 },
    uAlpha: { value: 1.0 },

    uAspect: { value: windowWidth / windowHeight },
    uMouse: { value: mouse },
    uVelocity: { value: velocityTweened },
  },
})
const flowmapMesh = new THREE.Mesh(geometry, flowmapMaterial)
flowmapMesh.position.z = -1
flowmapScene.add(flowmapMesh)

const mainMaterial = new THREE.ShaderMaterial({
  vertexShader: basicVertexShader,
  fragmentShader: mainFragmentShader,
  uniforms: {
    tFlow: tMap,
    tImage: { value: null },
    uImageAspect: { value: null },
    uScreenAspect: { value: windowHeight / windowWidth },
    uFlowStrength: { value: 0.05 },
    uBackgroundColor: { value: new THREE.Color(0x7f2b78) },
    uForegroundColor: { value: new THREE.Color(0xf9db8a) },
  },
})
const mainMesh = new THREE.Mesh(geometry, mainMaterial)
mainMesh.position.z = -1
scene.add(mainMesh)

/**
 * Assets
 */

new THREE.TextureLoader().load('/assets/img/hello-world.png', (texture) => {
  mainMaterial.uniforms.tImage.value = texture
  mainMaterial.uniforms.uImageAspect.value = texture.source.data.width / texture.source.data.height
})

/**
 * Render Functions
 */
function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)

  if (!velocity.needsUpdate) {
    mouse.set(-1)
    velocity.set(0)
  }
  velocity.needsUpdate = false

  renderer.setRenderTarget(targets.write)
  renderer.render(flowmapScene, flowmapCamera)

  renderer.setRenderTarget(null)
  renderer.render(scene, camera)

  targets.swap()
}

/**
 * Events
 */

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

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  flowmapCamera = camera.clone()

  // todo: resize render targets
  // flowmapMaterial.uniforms.uAspect = windowWidth / windowHeight

  renderer.setSize(windowWidth, windowHeight)

  // resize fullscreen mesh
  const viewSize = getViewSizeAtDepth(camera, -1)
  flowmapMesh.scale.set(viewSize.width, viewSize.height)
  mainMesh.scale.set(viewSize.width, viewSize.height)
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
  <ProjectContainer title="Liquid text" :tech="['WebGL', 'GLSL', 'ThreeJS']">
    <div ref="container" class="container"></div>

    <template #description>
      <p>
        Uses custom-written GLSL shaders to distort an image based on the velocity and position of
        the user's mouse.
      </p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
</style>
