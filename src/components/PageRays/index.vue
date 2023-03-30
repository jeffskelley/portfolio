<script>
export default {
  name: 'PageRays',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

import * as THREE from 'three'
import gsap from 'gsap'
// import getViewSizeAtDepth from '@/helpers/getViewSizeAtDepth'

import vertexShader from './shaders/main.vert'
import fragmentShader from './shaders/main.frag'

let windowWidth
let windowHeight
const container = ref(null)

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
camera.position.set(0, 0, 0)
camera.lookAt(0, 0, -1)

/**
 * Entities
 */
const uTime = { value: 0 }
const mesh = new THREE.Mesh(
  new THREE.PlaneGeometry(1, 1, 1, 1),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      uTime,
    },
  })
)
mesh.position.set(0, 0, -1)
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
      <p>Lorem ipsum</p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss"></style>
