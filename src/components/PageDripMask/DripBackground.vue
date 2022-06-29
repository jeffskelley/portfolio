<script setup>
import { ref, onMounted } from 'vue'

import DripBackground from './DripBackground'

const horizontalSegments = 50
const verticalSegments = 30

const sineWaveSize = 250
const dripSize = 150

// template refs
const container = ref(null)

const width = ref(0)
const height = ref(0)

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
    .map((point) => {
      return point.action === 'C'
        ? `${point.action} ${point.x1}, ${point.y1} ${point.x2}, ${point.y2} ${point.x}, ${point.y}`
        : `${point.action} ${point.x}, ${point.y}`
    })
    .join(' ')
}

/**
 * Methods
 */
function generateSegments() {
  segments.value = [...new Array(horizontalSegments)].map((_, i) => {
    const segmentProgress = (i + 1) / horizontalSegments
    return {
      x: segmentProgress * width.value,
      // general wave shape
      deltaY:
        (Math.random() - 0.5) * dripSize + // randomized ridges
        Math.sin(segmentProgress * 2 * Math.PI) * sineWaveSize, // general sin wave shape
    }
  })
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
onMounted(() => {
  resize()
})
</script>

<template>
  <div ref="container" class="drip-background">
    <svg :viewBox="`0 0 ${width} ${height}`">
      <path
        v-for="n in verticalSegments"
        :key="n"
        :d="getMask((verticalSegments - n + 1) / verticalSegments)"
        class="drip"
        :class="`drip-${verticalSegments - n}`"
      />
    </svg>
  </div>
</template>

<style lang="scss">
$colors: (
  rgb(222, 104, 95),
  rgb(140, 197, 226),
  rgb(240, 133, 79),
  rgb(94, 82, 135),
  rgb(250, 238, 82),
  rgb(75, 98, 167),
  rgb(125, 199, 139)
);
.drip-background {
  svg {
    width: 100%;
    height: 100%;
  }

  .drip {
    stroke: #000;
  }

  @for $n from 1 through list.length($colors) {
    .drip:nth-child(#{$n}n) {
      fill: nth($colors, $n);
    }
  }
}
</style>
