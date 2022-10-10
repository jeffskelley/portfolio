<script>
export default {
  name: 'PageGradientCircles',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// components
import ProjectContainer from '@/components/ProjectContainer.vue'

// shaders
import vertexShader from './shaders/basic.vert'
import fragmentShader from './shaders/main.frag'

import * as THREE from 'three'
import gsap from 'gsap'

// config
const colors = {
  pink: new THREE.Color('#e59fbe'),
  blue: new THREE.Color('#cfe0ed'),
  yellow: new THREE.Color('#f6f4de'),
  green: new THREE.Color('#b4dab7'),
}

let windowWidth
let windowHeight
const container = ref(null)
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

const camera = new THREE.PerspectiveCamera()
camera.lookAt(0, 0, 0)

// const controls = new OrbitControls(camera, renderer.domElement)
const uTime = ref(0)

// mouse values will be between -1 and 1
let mouse = { x: 0, y: 0 }

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
    uWindowDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
    uColor1: { value: colors.pink },
    uColor2: { value: colors.blue },
    uColor3: { value: colors.yellow },
    uColor4: { value: colors.green },
    uTime,
  },
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = -1
scene.add(mesh)
scene.background = new THREE.Color('white')

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  uTime.value = time
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
  <ProjectContainer :show-info="false">
    <div ref="container" class="container"></div>
  </ProjectContainer>
</template>

<style lang="scss"></style>
