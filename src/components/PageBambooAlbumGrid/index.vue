<script>
export default {
  name: 'PageBambooAlbumGrid',
}
</script>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'

// components
import ProjectContainer from '@/components/ProjectContainer.vue'
import ButtonSolid from '@/components/ButtonSolid.vue'

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
const size = 0.2
const gutter = 0.2
const offsetX = 0.5
const offsetY1 = 0
const offsetY2 = 0
const distortion1 = 0
const distortion2 = 0
const distortion3 = 0
const uMouse = reactive({ x: 0, y: 0 })

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
  uniforms: {
    tImage1: { value: null },
    tImage2: { value: null },
    tImage3: { value: null },
    tImage4: { value: null },
    tImage5: { value: null },
    tImage6: { value: null },
    tImage7: { value: null },
    tImage8: { value: null },
    tImage9: { value: null },
    uPreDistortionOffsetX: { value: 0 },
    uPreDistortionOffsetY: { value: 0 },
    uOffsetX: { value: offsetX },
    uOffsetY1: { value: offsetY1 },
    uOffsetY2: { value: offsetY2 },
    uDistortion1: { value: distortion1 },
    uDistortion2: { value: distortion2 },
    uDistortion3: { value: distortion3 },
    uMouse: { value: uMouse },
    uMouseAmt: { value: 0.05 },
    uScroll: { value: 0 },
    uScrollAmt: { value: 0 },
    uFisheye: { value: 0.2 },
    uFisheye2: { value: 0.1 },
    uWidth: { value: size },
    uGutter: { value: gutter },
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
    tImage5: { value: null },
    tImage6: { value: null },
    tImage7: { value: null },
    tImage8: { value: null },
    tImage9: { value: null },
    uPreDistortionOffsetX: { value: 0 },
    uPreDistortionOffsetY: { value: 0 },
    uOffsetX: { value: offsetX },
    uOffsetY1: { value: offsetY1 },
    uOffsetY2: { value: offsetY2 },
    uDistortion1: { value: distortion1 },
    uDistortion2: { value: distortion2 },
    uDistortion3: { value: distortion3 },
    uMouse: { value: uMouse },
    uMouseAmt: { value: -0.05 },
    uScroll: { value: 0 },
    uScrollAmt: { value: 0 },
    uFisheye: { value: -0.15 },
    uFisheye2: { value: -0.001 },
    uWidth: { value: size * 0.7 },
    uGutter: { value: gutter },
    uAlpha: { value: 0.15 },
  },
})
const bgMesh = new THREE.Mesh(geometry, bgMaterial)
bgMesh.position.z = -1.00001
scene.add(bgMesh)

scene.background = new THREE.Color('black')

/**
 * Assets
 */
function shuffleArray(array) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}

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
  const textures = await loadAlbumArt()
  setTextures(textures)

  // google font preloading is tempermental and this is the (not ideal)
  // solution to making sure the fonts are loaded before using SplitType
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, 30)
  })
  animate()
}

function render() {
  requestAnimationFrame(render)
  renderer.render(scene, camera)
}

function animate() {
  const el = container.value.$el
  const fgUniforms = material.uniforms
  const bgUniforms = bgMaterial.uniforms
  const { lines: headlineLines } = new SplitType(el.querySelector('.album-grid__headline'), {
    types: 'lines',
  })
  const { lines: subtitleLines } = new SplitType(el.querySelector('.album-grid__subtitle'), {
    types: 'lines',
  })

  timeline
    // grid animation
    .to(fgUniforms.uOffsetX, { value: '+=8', duration: 4.5, ease: 'expo.out' }, 'start')
    .to(bgUniforms.uOffsetX, { value: '-=8', duration: 4.5, ease: 'expo.out' }, 'start')
    .to(fgUniforms.uOffsetY1, { value: '+=1', duration: 3.5, ease: 'expo.out' }, 'start+=0.25')
    .to(bgUniforms.uOffsetY1, { value: '-=1', duration: 3.5, ease: 'expo.out' }, 'start+=0.25')
    .to(fgUniforms.uOffsetY2, { value: '-=0.5', duration: 3.5, ease: 'expo.out' }, 'start+=0.25')
    .to(bgUniforms.uOffsetY2, { value: '+=0.5', duration: 3.5, ease: 'expo.out' }, 'start+=0.25')

    // fade in gl cover
    .fromTo(
      el.querySelector('.album-grid__cover'),
      {
        opacity: 0.2,
      },
      {
        opacity: 1,
        duration: 35 / 30,
        ease: 'power1.out',
      },
      'start'
    )
    .to(
      el.querySelectorAll('.album-grid__headline, .album-grid__subtitle'),
      {
        opacity: 1,
        duration: 0,
      },
      'start'
    )

  // headline animation
  headlineLines.forEach((line, index) => {
    const delay = 8 / 30
    const x = index === 0 ? '100px' : '-100px'
    timeline
      .fromTo(
        line,
        {
          opacity: 0,
        },
        {
          opacity: 1,
          ease: 'power2.out',
          duration: 1,
        },
        `start+=${delay * index}`
      )
      .fromTo(
        line,
        {
          x,
        },
        {
          x: '0px',
          ease: 'power2.out',
          duration: 25 / 30,
        },
        `start+=${delay * index}`
      )
  })

  timeline
    .fromTo(
      subtitleLines,
      {
        opacity: 0,
      },
      {
        opacity: 1,
        duration: 8 / 30,
        ease: 'power1.in',
        stagger: 3 / 30,
      },
      'subtitle'
    )
    .fromTo(
      subtitleLines,
      {
        y: '50px',
      },
      {
        y: '0px',
        duration: 25 / 30,
        ease: 'circ.out',
        stagger: 3 / 30,
      },
      'subtitle'
    )
    .call(flip, null, `-=2.5`)

  timeline.play(0)
}

/**
 * Events
 */

function mousemove({ clientX, clientY }) {
  gsap.to(uMouse, {
    x: clientX / window.innerWidth,
    y: (clientY / window.innerHeight) * -1,
    duration: 1,
    ease: 'power1.out',
  })
}

function resize() {
  windowWidth = window.innerWidth
  windowHeight = window.innerHeight
  camera.aspect = windowWidth / windowHeight
  camera.updateProjectionMatrix()
  renderer.setSize(windowWidth, windowHeight)

  // resize fullscreen mesh
  const viewSize = getViewSizeAtDepth(camera, -1)
  // maintain 1:1 aspect ratio otherwise distortion looks wack
  const size = Math.max(viewSize.width, viewSize.height)
  mesh.scale.set(size, size)
  bgMesh.scale.set(size, size)
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
  window.addEventListener('mousemove', mousemove)
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', mousemove)
  renderer.forceContextLoss()
})
</script>

<template>
  <ProjectContainer ref="container" class="album-grid" buttonColor="black">
    <div class="album-grid__content">
      <h1 class="album-grid__headline">Hello World</h1>

      <div>
        <p class="album-grid__subtitle">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Minima, nesciunt laboriosam
          architecto illo facilis rem quaerat maxime? Iste facilis.
        </p>
      </div>
    </div>

    <div class="album-grid__cover" />

    <div ref="glContainer" class="album-grid__gl-container"></div>

    <template #actions>
      <ButtonSolid color="black" @click="flip">Album change animation</ButtonSolid>
      <ButtonSolid color="black" @click="animate">Replay intro animation</ButtonSolid>
    </template>

    <template #description>
      <p>
        Detail from an app I built for a music streaming client that didn't go to production.
        Geometry is just two basic planes for the foreground and background, the 3D fisheye effect
        is created in the fragment shader.
      </p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
.album-grid {
  &__content {
    position: relative;
    z-index: 30;
    color: #fff;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    min-height: 100vh;
  }

  &__headline {
    font-family: $fontDisplay;
    text-transform: uppercase;
    font-weight: 700;
    font-size: 103px;
    line-height: math.div(103, 103);
    letter-spacing: -0.02em;
    text-align: center;
    letter-spacing: -0.02em;
    margin: 0 auto;
    max-width: 500px;
    opacity: 0;
  }

  &__subtitle {
    font-size: 28px;
    font-weight: 700;
    line-height: math.div(34, 28);
    letter-spacing: -0.02em;
    text-align: center;
    margin: 72px auto 50px;
    max-width: 550px;
    opacity: 0;
  }

  &__cover {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom, rgba(#000, 0.6) 0%, rgba(#000, 0.9) 70%, rgba(#000, 1));
    z-index: 20;
    opacity: 0.2;
  }

  &__gl-container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
  }

  .button:not(:first-child) {
    margin-left: 15px;
  }
}
</style>
