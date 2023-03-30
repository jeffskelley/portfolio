<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

import * as THREE from 'three'
import gsap from 'gsap'

import vertexShader from './shaders/main.vert'
import fragmentShader from './shaders/main.frag'

import baseVertexShader from './shaders/base.vert'
import blurVertexShader from './shaders/blur.vert'
import advectionShader from './shaders/advection.frag'
import advectionManualShader from './shaders/advectionManual.frag'
import blurShader from './shaders/blur.frag'
import clearShader from './shaders/clear.frag'
import colorShader from './shaders/color.frag'
import copyShader from './shaders/copy.frag'
import curlShader from './shaders/curl.frag'
import displayShader from './shaders/display.frag'
import divergenceShader from './shaders/divergence.frag'
import gradientSubtractShader from './shaders/gradientSubtract.frag'
import pressureShader from './shaders/pressure.frag'
import splatShader from './shaders/splat.frag'
import vorticityShader from './shaders/vorticity.frag'

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

const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5)
camera.position.set(0, 0, 0)
camera.lookAt(0, 0, -1)

// helper functions
function getWebGLContext() {
  const isWebGL2 = renderer.capabilities.isWebGL2
  const gl = renderer.getContext()

  let halfFloat
  let supportLinearFiltering
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float')
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear')
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float')
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')
  }

  gl.clearColor(0.0, 0.0, 0.0, 1.0)

  let halfFloatTexType = isWebGL2 ? gl.HALF_FLOAT : halfFloat.HALF_FLOAT_OES
  let formatRGBA
  let formatRG
  let formatR

  if (isWebGL2) {
    formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType)
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
  }

  return {
    formatRGBA: formatRGBA,
    formatRG: formatRG,
    formatR: formatR,
    halfFloatTexType: halfFloatTexType,
    supportLinearFiltering: supportLinearFiltering,
  }
}

function getSupportedFormat(gl, internalFormat, format, type) {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    switch (internalFormat) {
      case gl.R16F:
        return getSupportedFormat(gl, gl.RG16F, gl.RG, type)
      case gl.RG16F:
        return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }

  return {
    internalFormat: internalFormat,
    format: format,
  }
}

function supportRenderTextureFormat(gl, internalFormat, format, type) {
  var texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  var fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)

  var status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  return status == gl.FRAMEBUFFER_COMPLETE
}

const ext = getWebGLContext()

/**
 * Simulation config
 */
const config = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 1024,
  CAPTURE_RESOLUTION: 512,
  DENSITY_DISSIPATION: 1,
  VELOCITY_DISSIPATION: 0.2,
  PRESSURE: 0.8,
  PRESSURE_ITERATIONS: 3,
  CURL: 30,
  SPLAT_RADIUS: 0.25,
  SPLAT_FORCE: 6000,
}

/**
 * Global Refs
 */
const uTime = { value: 0 }
const uAspect = { value: window.innerWidth / window.innerHeight }
const uVelocity = { value: null }
const uCurl = { value: null }
const uDivergence = { value: null }
const uPressure = { value: null }
const uFluid = { value: null }

let lastTime

/**
 * Simulation Entities
 */
const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

const texelSize = { value: new THREE.Vector2(config.SIM_RESOLUTION) }

const blurProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: blurVertexShader,
    fragmentShader: blurShader,
    uniforms: {
      texelSize,
      uTexture: { value: null },
    },
    depthTest: false,
    depthWrite: false,
  })
)
const copyProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: copyShader,
    uniforms: {
      uTexture: { value: null },
    },
    depthTest: false,
    depthWrite: false,
  })
)
const clearProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: clearShader,
    uniforms: {
      uTexture: { value: null },
      value: { value: config.PRESSURE },
    },
    depthTest: false,
    depthWrite: false,
  })
)

const colorProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: colorShader,
    uniforms: {
      color: { value: new THREE.Vector4(1, 1, 1, 1) },
    },
    depthTest: false,
    depthWrite: false,
  })
)

const splatProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: splatShader,
    uniforms: {
      uTarget: { value: null },
      aspectRatio: { value: windowWidth / windowHeight },
      point: { value: new THREE.Vector2() },
      color: { value: new THREE.Vector3() },
      radius: { value: correctRadius(config.SPLAT_RADIUS) },
    },
    depthTest: false,
    depthWrite: false,
  })
)

const advectionProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: ext.supportLinearFiltering ? advectionShader : advectionManualShader,
    uniforms: {
      texelSize,
      dyeTexelSize: texelSize,
      uVelocity,
      uSource: { value: null },
      dt: { value: 1 / 60 },
      dissipation: { value: config.VELOCITY_DISSIPATION },
    },
    depthTest: false,
    depthWrite: false,
  })
)

const divergenceProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: divergenceShader,
    uniforms: {
      texelSize,
      uVelocity,
    },
    depthTest: false,
    depthWrite: false,
  })
)

const curlProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: curlShader,
    uniforms: {
      texelSize,
      uVelocity,
    },
    depthTest: false,
    depthWrite: false,
  })
)

const vorticityProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: vorticityShader,
    uniforms: {
      texelSize,
      uVelocity,
      uCurl,
      curl: { value: config.CURL },
      dt: { value: 1 / 60 },
    },
    depthTest: false,
    depthWrite: false,
  })
)

const pressureProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: pressureShader,
    uniforms: {
      texelSize,
      uDivergence,
      uPressure,
    },
    depthTest: false,
    depthWrite: false,
  })
)

const gradientSubtractProgram = new THREE.Mesh(
  geometry,
  new THREE.ShaderMaterial({
    vertexShader: baseVertexShader,
    fragmentShader: gradientSubtractShader,
    uniforms: {
      texelSize,
      uVelocity,
      uPressure,
    },
    depthTest: false,
    depthWrite: false,
  })
)

function getResolution(resolution) {
  return { width: resolution, height: resolution }
}

function correctRadius(radius) {
  var aspectRatio = windowWidth / windowHeight
  if (aspectRatio > 1) {
    radius *= aspectRatio
  }
  return radius
}

let dye
let velocity
let divergence
let curl
let pressure

function initFrameBuffers() {
  const simRes = getResolution(config.SIM_RESOLUTION)
  const dyeRes = getResolution(config.DYE_RESOLUTION)
  const gl = renderer.getContext()

  const texType = ext.halfFloatTexType
  const rgba = ext.formatRGBA
  const rg = ext.formatRG
  const r = ext.formatR
  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  dye = createDoubleFBO(
    dyeRes.width,
    dyeRes.height,
    rgba.internalFormat,
    rgba.format,
    texType,
    filtering
  )

  velocity = createDoubleFBO(
    simRes.width,
    simRes.height,
    rg.internalFormat,
    rg.format,
    texType,
    filtering
  )
  pressure = createDoubleFBO(
    simRes.width,
    simRes.height,
    r.internalFormat,
    r.format,
    texType,
    gl.NEAREST
  )

  divergence = new THREE.WebGLRenderTarget(simRes.width, simRes.height, {
    // minFilter: gl.NEAREST,
    // magFilter: gl.NEAREST,
    // format: r.format,
    // internalFormat: r.internalFormat,
    // type: texType,
  })

  curl = new THREE.WebGLRenderTarget(simRes.width, simRes.height, {
    // minFilter: gl.NEAREST,
    // magFilter: gl.NEAREST,
    // format: r.format,
    // internalFormat: r.internalFormat,
    // type: texType,
  })
}

function createDoubleFBO(w, h, internalFormat, format, type, filtering) {
  const options = {
    // minFilter: filtering,
    // magFilter: filtering,
    // format,
    // internalFormat,
    // type,
  }

  const fbo = {
    read: new THREE.WebGLRenderTarget(w, h, options),
    write: new THREE.WebGLRenderTarget(w, h, options),
    swap: () => {
      let temp = fbo.read
      fbo.read = fbo.write
      fbo.write = temp
    },
  }
  return fbo
}

/**
 * Display Layer
 */
const material = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    // tMap,
    uTime,
    uAspect,
  },
})
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1, 1), material)
mesh.position.z = -1.0
scene.add(mesh)

/**
 * Render Functions
 */

function init() {
  container.value.appendChild(renderer.domElement)
  initFrameBuffers()
}

function calcDeltaTime(time) {
  let dt = (time - lastTime) / 1000
  dt = Math.min(dt, 0.016666)
  lastTime = time
  return dt
}

function animate(time) {
  requestAnimationFrame(animate)
  uTime.value = time

  if (!lastTime) {
    lastTime = time
  }
  const dt = calcDeltaTime()

  // do all the fluid stuff here

  renderer.setRenderTarget(null)
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

function mousemove(event) {
  const { clientX, clientY } = event
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
  <div ref="container" class="container"></div>
</template>

<style lang="scss"></style>
