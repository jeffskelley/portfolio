<script>
export default {
  name: 'PageGLBoilerplate',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

import * as THREE from 'three'
import gsap from 'gsap'
// import getViewSizeAtDepth from '@/helpers/getViewSizeAtDepth'

const config = {
  cameraPosition: new THREE.Vector3(0.0, 0.0, 1.0),
  mouseDelta: { x: 6.0, y: 2.0 },
}

let randomSeed = new Date().getTime()
window.Math.random = function () {
  // fast pseudorandom
  const x = Math.sin(randomSeed++) * 10000
  return x - Math.floor(x)
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
camera.position.set(config.cameraPosition.x, config.cameraPosition.y, config.cameraPosition.z)
camera.lookAt(0, 0, 0)

// const controls = new OrbitControls(camera, renderer.domElement)

// mouse values will be between -1 and 1
let mouse = { x: 0, y: 0 }

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
