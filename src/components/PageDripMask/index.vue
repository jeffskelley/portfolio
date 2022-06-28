<script>
export default {
  name: 'PageDripMask',
}
</script>

<script setup>
import { gsap } from 'gsap'
import { ref, computed, onMounted } from 'vue'

import ProjectContainer from 'components/ProjectContainer'

const numSegments = 24
const lineHeight = 120
const content = ['Hello, world!', 'Hover over', 'the text to', 'see the effect']

// template refs
const container = ref(null)
const maskEl = ref(null)

const width = ref(0)
const height = computed(() => content.length * lineHeight + 2)
const progress = ref(0)
let timeline

const segments = ref()
const mask = computed(() => {
  if (!segments.value) {
    return
  }
  const maxY = height.value
  const yProgress = maxY * progress.value
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
      const previousY = yProgress + previous.deltaY * Math.sin(progress.value * Math.PI)
      const segmentY = yProgress + segment.deltaY * Math.sin(progress.value * Math.PI)
      return {
        action: 'C',
        x1: previous.x + 10,
        y1: previousY,
        x2: segment.x - 10,
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
})

/**
 * Methods
 */
function generateSegments() {
  segments.value = [...new Array(numSegments)].map((_, i) => {
    const segmentProgress = (i + 1) / numSegments
    return {
      x: segmentProgress * width.value,
      // general wave shape
      deltaY:
        (Math.random() - 0.5) * lineHeight * 0.7 + // randomized ridges
        Math.sin(segmentProgress * 2 * Math.PI) * lineHeight * 0.7, // general sin wave shape
    }
  })
}

function initTimeline() {
  timeline = gsap
    .timeline()
    .to(progress, { value: 1 })
    .to(maskEl.value, { duration: 0, rotate: '180deg' })
    .to(progress, { value: 0 })
    .pause()

  timeline.eventCallback('onComplete', () => {
    timeline.progress(0).pause()
  })
}

/**
 * Events
 */
function play() {
  gsap.to(timeline, { duration: 1.3, progress: 0.5, ease: 'power1.inOut' })
}
function reverse() {
  gsap.to(timeline, { duration: 1.3, progress: 1, ease: 'power1.inOut' })
}
function resize() {
  const $el = container.value
  width.value = $el.clientWidth
  generateSegments()
}

/**
 * Lifecycle
 */
onMounted(() => {
  resize()
  initTimeline()
})
</script>

<template>
  <ProjectContainer title="SVG Drip Mask" :tech="['SVG', 'GSAP']" class="page-drip-mask">
    <blockquote class="blockquote">
      <div ref="container" class="blockquote__content" @mouseenter="play" @mouseleave="reverse">
        <svg class="blockquote__svg" :viewBox="`0 0 ${width} ${height}`">
          <defs>
            <clipPath id="clip-path" ref="maskEl" :style="{ transformOrigin: '50% 50%' }">
              <path :d="mask" />
            </clipPath>
          </defs>
          <g>
            <text
              x="0"
              y="0"
              class="blockquote__text blockquote__text--fill"
              clip-path="url(#clip-path)"
            >
              <tspan v-for="(line, index) in content" :key="index" x="50%" :dy="lineHeight">
                {{ line }}
              </tspan>
            </text>

            <text x="0" y="0" class="blockquote__text blockquote__text--outline">
              <tspan v-for="(line, index) in content" :key="index" x="50%" :dy="lineHeight">
                {{ line }}
              </tspan>
            </text>
          </g>
        </svg>
      </div>
    </blockquote>

    <template #description>
      <p>
        Sometimes you don't need complex WebGL shaders to acheive a visually interesting,
        technically performant effect. This component generates a drip pattern mask using bezier
        curves in SVG.
      </p>
    </template>
  </ProjectContainer>
</template>

<style lang="scss">
.blockquote {
  display: flex;
  height: 100vh;

  &__content {
    width: 671px;
    margin: auto;
  }

  &__svg {
    cursor: pointer;
    width: 100%;
  }

  &__text {
    font-family: $fontDisplay;
    font-weight: bold;
    font-size: 100px;
    text-anchor: middle;
    text-transform: uppercase;
    fill: none;

    &--fill {
      fill: #2f3035;
    }
    &--outline {
      stroke: #171625;
      opacity: 0.3;
    }
  }
}
</style>
