<script>
export default {
  name: 'PageReflections',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Reflector } from 'three/examples/jsm/objects/Reflector'

// import gsap from 'gsap'
import * as dat from 'dat.gui'

import floorFrag from './shaders/floor.frag'
import floorVert from './shaders/floor.vert'

let windowWidth
let windowHeight
const container = ref(null)
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Cameras & Controls
 */

const camera = new THREE.PerspectiveCamera()
camera.position.set(0, 7, 17)

const controls = new OrbitControls(camera, renderer.domElement)
controls.target = new THREE.Vector3(0, 3, 0)

/**
 * Helper functions
 */
function randRange(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * GUI
 */
const config = {
  numEntities: 100,
  floorSegments: 100,
  constraints: {
    xMin: -5,
    xMax: 5,
    yMin: 1,
    yMax: 9,
    zMin: -5,
    zMax: 5,
  },
}

const gui = new dat.GUI()
gui.add(config, 'numEntities', 10, 1000, 10).onChange(generateEntities)
// gui.add(config, 'floorSegments', 10, 1000, 1)
const constraintsFolder = gui.addFolder('constraints')
constraintsFolder.add(config.constraints, 'xMin', -10, 0, 1).onChange(generateEntities)
constraintsFolder.add(config.constraints, 'xMax', 0, 10, 1).onChange(generateEntities)
constraintsFolder.add(config.constraints, 'yMin', 0, 10, 1).onChange(generateEntities)
constraintsFolder.add(config.constraints, 'yMax', 10, 20, 1).onChange(generateEntities)
constraintsFolder.add(config.constraints, 'zMin', -10, 0, 1).onChange(generateEntities)
constraintsFolder.add(config.constraints, 'zMax', 0, 10, 1).onChange(generateEntities)

/**
 * Lights
 */
const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(17, 3, 17)
scene.add(pointLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(ambientLight)

/**
 * Entities
 */
const floorShader = {
  uniforms: {
    color: {
      value: null,
    },
    tDiffuse: {
      value: null,
    },
    textureMatrix: {
      value: null,
    },
    tint: {
      value: new THREE.Color(0xffffff),
    },
    tintAlpha: {
      value: 0.1,
    },
    time: {
      value: 0,
    },
  },
  vertexShader: floorVert,
  fragmentShader: floorFrag,
}
const floor = new Reflector(
  new THREE.PlaneGeometry(25, 25, config.floorSegments, config.floorSegments),
  {
    // textureWidth: 1024,
    // textureHeight: 1024,
    shader: floorShader,
  }
)
floor.rotateX(Math.PI / -2)
scene.add(floor)

let entities = []
function generateEntities() {
  entities.forEach((entity) => {
    entity.geometry.dispose()
    entity.material.dispose()
    entity.parent.remove(entity)
  })
  entities = []
  for (let i = 0; i < config.numEntities; i++) {
    const newEntity = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 16),
      new THREE.MeshPhongMaterial({ color: 0xffffff })
    )
    const newPosition = [
      randRange(config.constraints.xMin, config.constraints.xMax),
      randRange(config.constraints.yMin, config.constraints.yMax),
      randRange(config.constraints.zMin, config.constraints.zMax),
    ]
    newEntity.position.set(...newPosition)
    scene.add(newEntity)
    entities.push(newEntity)
  }
}
generateEntities()

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  controls.update()
  floor.material.uniforms.time.value = time
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
  gui.destroy()
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

<style lang="scss">
.dg.ac {
  z-index: 100;
}
</style>
