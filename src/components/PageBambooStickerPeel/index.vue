<script>
export default {
  name: 'PageBambooAlbumGrid',
}
</script>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// components
import ProjectContainer from 'components/ProjectContainer'
import ButtonSolid from 'components/ButtonSolid'

// libs
import * as THREE from 'three'
import SplitType from 'split-type'
import gsap from 'gsap'

// shaders
import vertexShader from './shaders/main.vert'
import fragmentShader from './shaders/main.frag'

// template refs
const container = ref(null)
const glContainer = ref(null)

// initial gl configuration
// const uMouse = reactive({ x: 0, y: 0 })

/**
 * GSAP Timeline initialization
 */
const timeline = gsap
  .timeline()
  .addLabel('start', 0)
  .addLabel('subtitle', `+=${8 / 30}`)
  .pause(0)

/**
 * Scene initialization
 */
let windowWidth = window.innerWidth
let windowHeight = window.innerHeight
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
  uniforms: {},
})
const mesh = new THREE.Mesh(geometry, material)
mesh.position.z = -1
scene.add(mesh)
scene.background = new THREE.Color('black')

/**
 * Assets
 */
function getRandomImageURLs() {
  const urls = [...Array(50)].map((_, i) => `/assets/img/album-art/${i + 1}.jpg`)
  shuffleArray(urls)
  const sliced = urls.slice(0, 9)
  return sliced
}

async function loadAlbumArt() {
  const loader = new THREE.TextureLoader()
  const urls = getRandomImageURLs()
  const textures = await Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve) => {
          loader.load(url, (texture) => {
            resolve(texture)
          })
        })
    )
  )
  return textures
}

function setTextures(textures) {
  textures.forEach((texture, index) => {
    material.uniforms[`tImage${index + 1}`].value = texture
    bgMaterial.uniforms[`tImage${index + 1}`].value = texture
  })
}

/**
 * Render Functions
 */
async function init() {
  glContainer.value.appendChild(renderer.domElement)
  // const textures = await loadAlbumArt()
  // setTextures(textures)

  // // google font preloading is tempermental and this is the (not ideal)
  // // solution to making sure the fonts are loaded before using SplitType
  // await new Promise((resolve) => {
  //   setTimeout(() => {
  //     resolve()
  //   }, 30)
  // })
  // animate()
}

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

function animate() {
  const el = container.value.$el
  const uniforms = material.uniforms
}

/**
 * Events
 */

// function mousemove({ clientX, clientY }) {
//   gsap.to(uMouse, {
//     x: clientX / window.innerWidth,
//     y: (clientY / window.innerHeight) * -1,
//     duration: 1,
//     ease: 'power1.out',
//   })
// }

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  renderer.setSize(windowWidth, windowHeight)

  // resize fullscreen mesh
  const viewSize = getViewSizeAtDepth(camera, -1)
  // mesh.scale.set(size, size)
}

async function flip() {
  const newTextures = await loadAlbumArt()
  const timingIn = 10 / 30
  const timingOut = 8 / 30
  const flip1 = gsap
    .timeline()
    .to([material.uniforms.uDistortion1, bgMaterial.uniforms.uDistortion1], {
      value: 1.0,
      duration: timingIn,
      ease: 'power2.in',
    })
    .call(() => {
      material.uniforms.tImage1.value = newTextures[0]
      material.uniforms.tImage4.value = newTextures[3]
      material.uniforms.tImage7.value = newTextures[6]
    })
    .to([material.uniforms.uDistortion1, bgMaterial.uniforms.uDistortion1], {
      value: 0.0,
      duration: timingOut,
      ease: 'power2.out',
    })
    .pause()
  const flip2 = gsap
    .timeline()
    .to([material.uniforms.uDistortion2, bgMaterial.uniforms.uDistortion2], {
      value: 1.0,
      duration: timingIn,
      ease: 'power2.in',
    })
    .call(() => {
      material.uniforms.tImage2.value = newTextures[1]
      material.uniforms.tImage5.value = newTextures[4]
      material.uniforms.tImage8.value = newTextures[7]
    })
    .to([material.uniforms.uDistortion2, bgMaterial.uniforms.uDistortion2], {
      value: 0.0,
      duration: timingOut,
      ease: 'power2.out',
    })
    .pause()
  const flip3 = gsap
    .timeline()
    .to([material.uniforms.uDistortion3, bgMaterial.uniforms.uDistortion3], {
      value: 1.0,
      duration: timingIn,
      ease: 'power2.in',
    })
    .call(() => {
      material.uniforms.tImage3.value = newTextures[2]
      material.uniforms.tImage6.value = newTextures[5]
      material.uniforms.tImage9.value = newTextures[8]
    })
    .to([material.uniforms.uDistortion3, bgMaterial.uniforms.uDistortion3], {
      value: 0.0,
      duration: timingOut,
      ease: 'power2.out',
    })
    .pause()
  gsap
    .timeline()
    .add(() => flip1.play())
    .add(() => flip2.play(), 5 / 30)
    .add(() => flip3.play(), 10 / 30)
}

/**
 * Lifecycle
 */
onMounted(() => {
  init()
  resize()
  render()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  renderer.forceContextLoss()
})
</script>

<template>
  <ProjectContainer ref="container" class="album-grid">
    <div class="album-grid__content"></div>

    <div ref="glContainer" class="sticker-peel__gl-container"></div>

    <template #description>
      <p>Detail from an app I built for a music streaming client that didn't go to production.</p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
.sticker-peel {
}
</style>
