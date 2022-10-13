<script>
export default {
  name: 'PageParticleTorrent',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import getViewSizeAtDepth from '@/helpers/getViewSizeAtDepth'

import mainVertexShader from './shaders/main.vert'
import mainFragmentShader from './shaders/main.frag'
import bufferFragmentShader from './shaders/buffer.frag'
import basicVertexShader from './shaders/basic.vert'
import circleFragmentShader from './shaders/circle.frag'
import testFragmentShader from './shaders/test.frag'

// config
const PARTICLE_COUNT = Math.pow(2, 18)

// fast pseudorandom
let randomSeed = new Date().getTime()
window.Math.random = function () {
  const x = Math.sin(randomSeed++) * 10000
  return x - Math.floor(x)
}

let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const windowDPR = window.devicePixelRatio
const container = ref(null)
const scene = new THREE.Scene()
const bufferScene = new THREE.Scene()
const outputScene = new THREE.Scene()

const initialRenderer = new THREE.WebGLRenderer()
const renderer = new THREE.WebGLRenderer()
renderer.setPixelRatio(windowDPR)

const camera = new THREE.PerspectiveCamera()
camera.position.set(0, 0, 1)
camera.lookAt(0, 0, 0)

const orbitCamera = new THREE.PerspectiveCamera()
orbitCamera.position.set(0, 0, 2)
orbitCamera.lookAt(0, 0, 0)

const controls = new OrbitControls(orbitCamera, renderer.domElement)
controls.autoRotateSpeed = -3.0
controls.autoRotate = true

/**
 * Render Targets
 */
const targetOptions = {
  depthBuffer: false,
  stencilBuffer: false,
  format: THREE.RGBAFormat,
  type: THREE.FloatType,
}
// for the initial render
const initialTarget = new THREE.WebGLRenderTarget(
  windowWidth * windowDPR,
  windowHeight * windowDPR,
  targetOptions
)

// for the feedback pass
const uResolution = { value: new THREE.Vector2(windowWidth * windowDPR, windowHeight * windowDPR) }
const tBuffer = { value: null }
const tInitial = { value: null }

const bufferMaterial = new THREE.ShaderMaterial({
  fragmentShader: bufferFragmentShader,
  uniforms: {
    tBuffer,
    tInitial,
    uResolution,
  },
})
const bufferPlane = new THREE.PlaneGeometry(10, 10)
const bufferMesh = new THREE.Mesh(bufferPlane, bufferMaterial)
bufferScene.add(bufferMesh)

const targets = {
  read: new THREE.WebGLRenderTarget(
    windowWidth * windowDPR,
    windowHeight * windowDPR,
    targetOptions
  ),
  write: new THREE.WebGLRenderTarget(
    windowWidth * windowDPR,
    windowHeight * windowDPR,
    targetOptions
  ),
  swap: () => {
    const temp = targets.read
    targets.read = targets.write
    targets.write = temp
    tInitial.value = initialTarget.texture
    tBuffer.value = targets.read.texture
  },
}

/**
 * Entities
 */
const geometry = new THREE.PlaneGeometry(1, 1, Math.sqrt(PARTICLE_COUNT), Math.sqrt(PARTICLE_COUNT))
// Slightly randomize initial positions of vertices
const positions = geometry.attributes.position.array
for (let i = 0; i < positions.length; i += 3) {
  // const x = positions[i]
  // const y = positions[i + 1]
  // const z = positions[i + 2]

  const displacement = {
    x: (Math.random() - 0.5) * 0.005,
    y: (Math.random() - 0.5) * 0.005,
  }

  positions[i] += displacement.x
  positions[i + 1] += displacement.y
}

geometry.attributes.position.needsUpdate = true
geometry.computeBoundingBox()
geometry.computeBoundingSphere()

const material = new THREE.ShaderMaterial({
  vertexShader: mainVertexShader,
  fragmentShader: mainFragmentShader,
  uniforms: {
    uResolution,
    uTime: { value: 0 },
  },
})
const mesh = new THREE.Points(geometry, material)
scene.add(mesh)

const circle = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.ShaderMaterial({
    vertexShader: basicVertexShader,
    fragmentShader: circleFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  })
)
scene.add(circle)

const outputMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1),
  new THREE.MeshBasicMaterial({ map: targets.read.texture })
)
outputMesh.position.z = 0
outputScene.add(outputMesh)

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  material.uniforms.uTime.value = time
  controls.update()

  // renderer.render(scene, orbitCamera)

  renderer.setRenderTarget(initialTarget)
  renderer.render(scene, orbitCamera)

  renderer.setRenderTarget(targets.write)
  renderer.render(bufferScene, camera)

  renderer.setRenderTarget(null)
  renderer.render(outputScene, camera)

  targets.swap()
}

/**
 * Events
 */

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()

  orbitCamera.aspect = windowWidth / windowHeight
  orbitCamera.updateProjectionMatrix()

  initialRenderer.setSize(1080, 1080)
  renderer.setSize(windowWidth, windowHeight)

  const viewSize = getViewSizeAtDepth(camera, 0)
  const maxSize = Math.max(viewSize.width, viewSize.height)
  mesh.scale.set(maxSize, maxSize)
  circle.scale.set(maxSize, maxSize)
  outputMesh.scale.set(viewSize.width, viewSize.height)
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
  <ProjectContainer>
    <div ref="container" class="container"></div>

    <template #description>
      <p>
        An experiment with displacing particles in the vertex shader. Also utilizes ping-pong FBOs
        to create motion blur.
      </p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss"></style>
