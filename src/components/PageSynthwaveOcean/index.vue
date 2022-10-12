<script>
export default {
  name: 'PageSynthwaveOcean',
}
</script>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import ProjectContainer from '@/components/ProjectContainer.vue'

// import * as dat from 'dat.gui'

import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import SimplexNoise from 'simplex-noise'
import gsap from 'gsap'

import vertexShader from './shaders/basic.vert'
import oceanFragmentShader from './shaders/ocean.frag'
import oceanVertexShader from './shaders/ocean.vert'
import mountainsFragmentShader from './shaders/mountains.frag'
import moonFragmentShader from './shaders/moon.frag'
import moonVertexShader from './shaders/moon.vert'
import backdropFragmentShader from './shaders/backdrop.frag'

const config = {
  cameraPosition: new THREE.Vector3(0.0, 10.0, 30.0),
  mouseDelta: new THREE.Vector2(6.0, 2.0),
  colors: {
    blue: new THREE.Vector3(0.0, 0.94, 1.0),
    darkBlue: new THREE.Vector3(0.03, 0.11, 0.35),
    pink: new THREE.Vector3(0.88, 0.24, 0.94),
    purple: new THREE.Vector3(0.3, 0.05, 0.37),
    darkPurple: new THREE.Vector3(0.05, 0.01, 0.05),
    white: new THREE.Vector3(1.0, 1.0, 1.0),
    black: new THREE.Vector3(0.0, 0.0, 0.0),
  },
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
camera.lookAt(0, 10.0, 0)

// const controls = new OrbitControls(camera, renderer.domElement)

// mouse values will be between -1 and 1
let mouse = new THREE.Vector2(0, 0)

/**
 * Moon
 */
const moonGeometry = new THREE.PlaneGeometry(65, 65, 1, 1)
const moonMaterial = new THREE.ShaderMaterial({
  vertexShader: moonVertexShader,
  fragmentShader: moonFragmentShader,
  uniforms: {
    uTime: {
      value: 0.0,
    },
    uMoonColor1: {
      value: config.colors.pink,
    },
    uMoonColor2: {
      value: config.colors.darkPurple,
    },
  },
  extensions: {
    derivatives: true,
  },
  transparent: true,
})
const moon = new THREE.Mesh(moonGeometry, moonMaterial)
moon.position.y = 10
moon.position.z = -200
scene.add(moon)

/**
 * Ocean
 */
const oceanGeometry = new THREE.PlaneGeometry(500, 150, 500, 150)
const oceanMaterial = new THREE.ShaderMaterial({
  vertexShader: oceanVertexShader,
  fragmentShader: oceanFragmentShader,
  uniforms: {
    uTime: {
      value: 0.0,
    },
    uLineColor: {
      value: config.colors.blue,
    },
    uFillColor: {
      value: config.colors.darkBlue,
    },
  },
  extensions: {
    derivatives: true,
  },
})
const ocean = new THREE.Mesh(oceanGeometry, oceanMaterial)
ocean.rotation.x = -Math.PI / 2
ocean.position.z = -50
scene.add(ocean)

/**
 * Stars
 */
const starsGeometry = new THREE.BufferGeometry()
const starsMaterial = new THREE.PointsMaterial({
  color: config.colors.white,
})
const starsVertices = []
for (let i = 0; i < 200; i++) {
  starsVertices.push((Math.random() - 0.5) * 1000, Math.random() * 250, -Math.random() * 1000 - 200)
}
starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3))
const stars = new THREE.Points(starsGeometry, starsMaterial)
scene.add(stars)

/**
 * Mountains
 */
const mountainsWidth = 300
const mountainsHeight = 50

const mountainsGeometry = new THREE.PlaneGeometry(
  mountainsWidth,
  mountainsHeight,
  mountainsWidth / 4,
  mountainsHeight / 5
)

function cubicPulse(x, center, width) {
  x = Math.abs(x - center)
  if (x > width) {
    return 0.0
  }
  x /= width
  return 1.0 - x * x * (3.0 - 2.0 * x)
}

function initMountainsGeometry() {
  const simplex = new SimplexNoise()
  const positions = mountainsGeometry.attributes.position.array
  const maxPoints = positions.length / 3
  let x, y, z, index
  x = y = z = index = 0
  for (let i = 0; i < maxPoints; i++) {
    x = positions[index++]
    y = positions[index++]
    z = positions[index++]

    const uv = {
      x: (x + mountainsWidth / 2) / mountainsWidth,
      y: (y + mountainsHeight / 2) / mountainsHeight,
    }
    let displacement = (simplex.noise2D(uv.x * 10, uv.y * 3) + 1) / 2 // normalize to 0.0-1.0
    displacement *= uv.y // fade in on y axis
    displacement = displacement * (1.0 - cubicPulse(uv.x, 0.5, 0.2)) // carve out space for moon
    positions[index - 1] += displacement * 30
  }

  mountainsGeometry.attributes.position.needsUpdate = true
  mountainsGeometry.computeBoundingBox()
  mountainsGeometry.computeBoundingSphere()
}

mountainsGeometry.addGroup(0, Infinity, 0)
mountainsGeometry.addGroup(0, Infinity, 1)

const mountainsMaterial = new THREE.MeshStandardMaterial({
  color: new THREE.Color(config.colors.pink.x, config.colors.pink.y, config.colors.pink.z),
  flatShading: true,
})

const mountainsGridMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader: mountainsFragmentShader,
  uniforms: {
    uLineColor: {
      value: config.colors.purple,
    },
  },
  extensions: {
    derivatives: true,
  },
  transparent: true,
})

const mountains = new THREE.Mesh(mountainsGeometry, [mountainsMaterial, mountainsGridMaterial])
mountains.rotation.x = -Math.PI / 2
mountains.position.y = -1
mountains.position.z = -150
scene.add(mountains)

const light = new THREE.PointLight(0xffffff, 0.5, 0, 2)
light.position.x = moon.position.x
light.position.y = moon.position.y
light.position.z = moon.position.z + 40

light.lookAt(moon.position)
scene.add(light)

// const helper = new THREE.PointLightHelper(light, 5)
// scene.add(helper)

/**
 * Backdrop
 */
const backdropGeometry = new THREE.PlaneGeometry(10000, 1000, 1, 1)
const backdropMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader: backdropFragmentShader,
  uniforms: {
    uColor1: {
      value: config.colors.black,
    },
    uColor2: {
      value: config.colors.purple,
    },
  },
  extensions: {
    derivatives: true,
  },
})
const backdrop = new THREE.Mesh(backdropGeometry, backdropMaterial)
backdrop.position.y = 400
backdrop.position.z = -1800
scene.add(backdrop)

/**
 * Text
 */
const fontLoader = new FontLoader()
fontLoader.load('/assets/glsl/fonts/Streamster_Regular.json', (font) => {
  const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff })
  const textShapes = font.generateShapes('Hello world', 10)
  const textGeometry = new THREE.ShapeGeometry(textShapes)
  textGeometry.computeBoundingBox()
  const textMiddle = -0.5 * (textGeometry.boundingBox.max.x - textGeometry.boundingBox.min.x)
  textGeometry.translate(textMiddle, 0, 0)
  const text = new THREE.Mesh(textGeometry, textMaterial)
  text.position.y = -0.5
  text.position.z = -50

  scene.add(text)
})

/**
 * Render Functions
 */

function init() {
  initMountainsGeometry()
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)

  camera.position.set(
    config.cameraPosition.x + mouse.x * config.mouseDelta.x,
    config.cameraPosition.y + mouse.y * config.mouseDelta.y + Math.sin(time * 0.001) * 0.75
  )
  // controls.update()
  oceanMaterial.uniforms.uTime.value = time

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
      <p>
        Exploring different ways of using noise to generate mountain terrain, a field of stars, and
        an ocean.
      </p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
.dg.ac {
  z-index: 999;
}
</style>
