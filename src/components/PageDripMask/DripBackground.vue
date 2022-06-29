<script setup>
import { ref, onMounted, nextTick } from 'vue'

import DripBackground from './DripBackground'

const horizontalSegments = 75
const verticalSegments = 30

const sineWaveSize = 250
const dripSize = 150

// template refs
const container = ref(null)
const canvas = ref(null)

const width = ref(0)
const height = ref(0)
const colors = [
  'rgb(125, 199, 139)',
  'rgb(222, 104, 95)',
  'rgb(140, 197, 226)',
  'rgb(240, 133, 79)',
  'rgb(94, 82, 135)',
  'rgb(250, 238, 82)',
  'rgb(75, 98, 167)',
]

const segments = ref()
function getMask(progress) {
  if (!segments.value) {
    return
  }
  const maxY = height.value
  const yProgress = maxY * progress
  const points = [
    {
      action: 'M',
      x: 0,
      y: 0,
    },
    {
      action: 'L',
      x: 0,
      y: yProgress,
    },
    ...segments.value.map((segment, i, array) => {
      const previous = i === 0 ? { x: 0, deltaY: 0 } : array[i - 1]
      const previousY = yProgress + previous.deltaY * Math.sin(progress * Math.PI)
      const segmentY = yProgress + segment.deltaY * Math.sin(progress * Math.PI)
      return {
        action: 'C',
        x1: previous.x + width.value / horizontalSegments / 2,
        y1: previousY,
        x2: segment.x - width.value / horizontalSegments / 2,
        y2: segmentY,
        x: segment.x,
        y: segmentY,
      }
    }),
    {
      action: 'L',
      x: width.value,
      y: 0,
    },
    {
      action: 'L',
      x: 0,
      y: 0,
    },
  ]

  return points
}

/**
 * Methods
 */
function gaussianRandom() {
  return 0.333 * (Math.random() + Math.random() + Math.random())
}

function generateSegments() {
  segments.value = [...new Array(horizontalSegments)].map((_, i) => {
    const segmentProgress = (i + 1) / horizontalSegments
    return {
      x: segmentProgress * width.value,
      // general wave shape
      deltaY:
        (gaussianRandom() - 0.5) * dripSize + // randomized ridges
        Math.sin(segmentProgress * 2 * Math.PI) * sineWaveSize, // general sin wave shape
    }
  })
}

function draw() {
  const ctx = canvas.value.getContext('2d')

  for (let i = 0; i < verticalSegments; i++) {
    const color = colors[i % colors.length]
    const points = getMask((verticalSegments - i + 1) / verticalSegments)
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.strokeStyle = 'rgb(0, 0, 0)'
    points.forEach((point) => {
      if (point.action === 'M') {
        ctx.moveTo(point.x, point.y)
      } else if (point.action === 'L') {
        ctx.lineTo(point.x, point.y)
      } else if (point.action === 'C') {
        ctx.bezierCurveTo(point.x1, point.y1, point.x2, point.y2, point.x, point.y)
      }
    })
    ctx.fill()
    ctx.stroke()
  }
}

/**
 * Events
 */
function resize() {
  const $el = container.value
  width.value = $el.clientWidth
  height.value = $el.clientHeight
  generateSegments()
}

/**
 * Lifecycle
 */
onMounted(async () => {
  resize()
  await nextTick()
  draw()
})
</script>

<template>
  <div ref="container" class="drip-background">
    <canvas ref="canvas" class="drip-background__canvas" :width="width" :height="height" />
  </div>
</template>

<style lang="scss">
.drip-background {
  &__canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
