<script>
export default {
  name: 'PageAlbumGrid',
}
</script>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// components
import ProjectContainer from 'components/ProjectContainer'
import ButtonSolid from 'components/ButtonSolid'
import RangeSlider from 'components/RangeSlider'

// assets
import artwork1 from './assets/albumart-tyler.jpg'
import artwork2 from './assets/albumart-phoebe-bridgers.jpg'
import artwork3 from './assets/albumart-solange.jpg'
import artwork4 from './assets/albumart-floating-points.jpg'

// libs
import * as THREE from 'three'
import gsap from 'gsap'

// shaders
import vertexShader from './shaders/basic.vert'
import fragmentShader from './shaders/main.frag'

// config
const fisheye = ref(0.1)
const bgFisheye = ref(-0.1)
const mouseAmt = ref(0.25)
const width = ref(400.0)
const bgWidth = ref(190.0)
const gutter = ref(0.2)
const offsetX1 = ref(0.0)
const offsetX2 = ref(0.0)
const distortion1 = ref(0.0)
const distortion2 = ref(0.0)
const offsetY1 = ref(0.5)
const offsetY2 = ref(0.0)
const showingControls = ref(false)

const controlsVerb = computed(() => (showingControls.value ? 'Hide' : 'Show'))
const invertMouseAmt = computed(() => mouseAmt.value * -1)
const invertOffsetX1 = computed(() => offsetX1.value * -1)
const invertOffsetX2 = computed(() => offsetX1.value * -1)
const invertOffsetY1 = computed(() => offsetY1.value * -1)
const invertOffsetY2 = computed(() => offsetY2.value * -1)
const distortion1Float = computed(() => parseFloat(distortion1.value))
const distortion2Float = computed(() => parseFloat(distortion2.value))

/**
 * GSAP Timeline
 */
const timeline = gsap
  .timeline({ repeat: -1 })
  .to(offsetY1, { value: 1.5, duration: 0.5, ease: 'Power2.easeInOut', delay: 3 })
  .to(offsetY1, { value: 2.5, duration: 0.5, ease: 'Power2.easeInOut', delay: 3 })
  .call(blink)
  .to(offsetY2, { value: -1.0, duration: 0.5, ease: 'Power2.easeInOut', delay: 3 })
  .to(offsetY2, { value: -2.0, duration: 0.5, ease: 'Power2.easeInOut', delay: 3 })
  .call(blink)

/**
 * Scene initialization
 */
let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
const container = ref(null)
const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})
renderer.setPixelRatio(window.devicePixelRatio)

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera()
camera.lookAt(0, 0, 0)

// mouse values will be between -1 and 1
const mouse = new THREE.Vector2(0, 0)

/**
 * Helper functions
 */
function getViewSizeAtDepth(camera, depth = 0) {
  const fovInRadians = (camera.fov * Math.PI) / 180
  const height = Math.abs((camera.position.z - depth) * Math.tan(fovInRadians / 2) * 2)
  return { width: height * camera.aspect, height }
}

/**
 * Meshes
 */
const geometry = new THREE.PlaneGeometry()
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  uniforms: {
    tImage1: { value: null },
    tImage2: { value: null },
    tImage3: { value: null },
    tImage4: { value: null },
    uWindowDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
    uMouse: { value: mouse },
    uTime: { value: 0 },

    uFisheye: fisheye,
    uMouseAmt: mouseAmt,
    uWidth: width,
    uGutter: gutter,
    // uCycleLength: cycleLength,
    // uSpeed: speed,
    uOffsetX1: offsetX1,
    uOffsetX2: offsetX2,
    uOffsetY1: offsetY1,
    uOffsetY2: offsetY2,
    uDistortion1: distortion1Float,
    uDistortion2: distortion2Float,
    uAlpha: { value: 1.0 },
  },
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = -1
scene.add(mesh)

const bgMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  transparent: true,
  uniforms: {
    tImage1: { value: null },
    tImage2: { value: null },
    tImage3: { value: null },
    tImage4: { value: null },
    uWindowDimensions: { value: new THREE.Vector2(windowWidth, windowHeight) },
    uMouse: { value: mouse },
    uTime: { value: 0 },

    uFisheye: bgFisheye,
    uMouseAmt: invertMouseAmt,
    uWidth: bgWidth,
    uGutter: gutter,
    uOffsetX1: invertOffsetX1,
    uOffsetX2: invertOffsetX2,
    uOffsetY1: invertOffsetY1,
    uOffsetY2: invertOffsetY2,
    uDistortion1: distortion1Float,
    uDistortion2: distortion2Float,
    uAlpha: { value: 0.2 },
  },
})
const bgMesh = new THREE.Mesh(geometry, bgMaterial)
bgMesh.position.z = -1.00001
scene.add(bgMesh)

scene.background = new THREE.Color('black')

/**
 * Assets
 */

const loader = new THREE.TextureLoader()
const texture1 = loader.load(artwork1, (texture) => {
  material.uniforms.tImage1.value = texture
  bgMaterial.uniforms.tImage1.value = texture
})
const texture2 = loader.load(artwork2, (texture) => {
  material.uniforms.tImage2.value = texture
  bgMaterial.uniforms.tImage2.value = texture
})
const texture3 = loader.load(artwork3, (texture) => {
  material.uniforms.tImage3.value = texture
  bgMaterial.uniforms.tImage3.value = texture
})
const texture4 = loader.load(artwork4, (texture) => {
  material.uniforms.tImage4.value = texture
  bgMaterial.uniforms.tImage4.value = texture
})

/**
 * Render Functions
 */
function init() {
  container.value.appendChild(renderer.domElement)
}

function animate(time) {
  requestAnimationFrame(animate)
  material.uniforms.uMouse.value = mouse
  material.uniforms.uTime.value = time
  renderer.render(scene, camera)
}

/**
 * Events
 */

function mousemove(event) {
  const { clientX, clientY } = event
  gsap.to(mouse, {
    x: (clientX / windowWidth) * 2.0 - 1.0,
    y: (1.0 - clientY / windowHeight) * 2.0 - 1.0,
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
  bgMesh.scale.set(viewSize.width, viewSize.height)
}

function toggleControls() {
  showingControls.value = !showingControls.value
}

let flipped = false
function blink() {
  console.log('blink')
  flipped = !flipped
  const newTexture1 = flipped ? texture1 : texture1
  const newTexture2 = flipped ? texture1 : texture2
  const newTexture3 = flipped ? texture1 : texture3
  const newTexture4 = flipped ? texture1 : texture4
  gsap
    .timeline({ repeat: 0 })
    .to(distortion1, { value: 1.0, duration: 0.4, ease: 'Power2.easeIn' })
    .to(material.uniforms.tImage1, { value: newTexture1, duration: 0 })
    .to(bgMaterial.uniforms.tImage1, { value: newTexture1, duration: 0 })
    .to(material.uniforms.tImage2, { value: newTexture2, duration: 0 })
    .to(bgMaterial.uniforms.tImage2, { value: newTexture2, duration: 0 })
    .to(distortion1, { value: 0.0, duration: 0.1, ease: 'Power2.easeOut' })
    .to(distortion2, { value: 1.0, duration: 0.4, ease: 'Power2.easeIn' }, '-=0.25')
    .to(material.uniforms.tImage3, { value: newTexture3, duration: 0 })
    .to(bgMaterial.uniforms.tImage3, { value: newTexture3, duration: 0 })
    .to(material.uniforms.tImage4, { value: newTexture4, duration: 0 })
    .to(bgMaterial.uniforms.tImage4, { value: newTexture4, duration: 0 })
    .to(distortion2, { value: 0.0, duration: 0.1, ease: 'Power2.easeOut' })
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
  <ProjectContainer title="Album Grid" :tech="['WebGL', 'GLSL', 'ThreeJS']" class="album-grid">
    <div ref="container" class="container"></div>

    <template #description>
      <!-- <p>Pulled from a prototype I created for a streaming music client.</p>
      <p>Rendered entirely in the fragment shader.</p> -->

      <ul v-if="showingControls" class="album-grid__controls-container">
        <li>
          <RangeSlider v-model="fisheye" label="Fisheye" :step="0.01" :min="-0.1" :max="0.5" />
        </li>
        <li>
          <RangeSlider v-model="bgFisheye" label="BG Fisheye" :step="0.01" :min="-0.2" :max="0.0" />
        </li>
        <li>
          <RangeSlider v-model="width" label="Artwork Size" :min="100" :max="1000" />
        </li>
        <li>
          <RangeSlider v-model="bgWidth" label="BG Artwork Size" :min="100" :max="500" />
        </li>
        <li>
          <RangeSlider v-model="gutter" label="Gutter Size" :step="0.001" :min="0" :max="1" />
        </li>
        <!-- <li>
          <RangeSlider v-model="offsetX1" label="Offset X 1" :step="0.001" :min="0" :max="2" />
        </li>
        <li>
          <RangeSlider v-model="offsetX2" label="Offset X 2" :step="0.001" :min="0" :max="2" />
        </li>
        <li>
          <RangeSlider v-model="offsetY1" label="Offset Y 1" :step="0.001" :min="0" :max="2" />
        </li>
        <li>
          <RangeSlider v-model="offsetY2" label="Offset Y 2" :step="0.001" :min="0" :max="2" />
        </li> -->
        <!-- <li>
          <RangeSlider v-model="cycleLength" label="Cycle length" :min="4" :max="30" />
        </li> -->
        <!-- <li>
          <RangeSlider v-model="speed" label="Speed" :step="0.0001" :min="0" :max="0.005" />
        </li> -->
      </ul>
      <ButtonSolid color="gray" @click="toggleControls">{{ controlsVerb }} controls</ButtonSolid>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
.album-grid {
}
</style>
