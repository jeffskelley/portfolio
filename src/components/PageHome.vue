<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import SplitType from 'split-type'

import store from '@/store'
import HomeBackground from '@/components/HomeBackground'
import distributeByPosition from '@/helpers/distributeByPosition'

const el = ref()
const texts = ref()
let timeline

function splitChars() {
  new SplitType(texts.value, { types: 'chars' })
}

function initialize() {
  const border = el.value.querySelector('.page-home__header-border')
  const name = el.value.querySelector('.page-home__header-name')
  const titleParts = el.value.querySelectorAll(
    '.page-home__header-title:not(.page-home__header-name)'
  )

  const introTimeline = gsap
    .timeline()
    .to(name, {
      opacity: 1,
      duration: 2,
      ease: 'power4.out',
    })
    .to(
      border,
      {
        scaleX: 1,
        duration: 2.5,
        ease: 'power4.out',
      },
      '0.25'
    )
    .to(
      titleParts,
      {
        opacity: 1,
        x: 0,
        duration: 2,
        ease: 'power4.out',
      },
      '0.75'
    )
    .to(
      texts.value,
      {
        opacity: 1,
        y: 0,
        scaleY: 1,
        duration: 2,
        stagger: 0.1,
        ease: 'power4.out',
      },
      '.5'
    )
  if (store.introHasPlayed) {
    introTimeline.seek(introTimeline.duration)
  }
  store.introHasPlayed = true
}

function mouseenter(index) {
  const outChars = el.value.querySelectorAll(
    `.page-home__list-item:not(:nth-child(${index + 1})) .char`
  )
  const inChars = el.value.querySelectorAll(`.page-home__list-item:nth-child(${index + 1}) .char`)
  if (timeline) {
    timeline.kill()
  }
  timeline = gsap
    .timeline()
    .to(
      outChars,
      {
        opacity: 0.2,
        // y: 15,
        ease: 'power4.out',
        stagger: distributeByPosition({
          amount: 0.25,
          from: 'edges',
          ease: 'power2.out',
        }),
      },
      0
    )
    .to(
      inChars,
      {
        opacity: 1,
        ease: 'power4.out',
        stagger: distributeByPosition({
          amount: 0.25,
          from: 'center',
          ease: 'power2.out',
        }),
      },
      0
    )
}
function mouseleave() {
  if (!el.value) {
    return
  }
  const charsToAnimate = el.value.querySelectorAll(`.page-home__list-item .char`)
  if (timeline) {
    timeline.kill()
  }
  timeline = gsap.timeline().to(charsToAnimate, {
    opacity: 1,
    ease: 'power4.out',
    stagger: distributeByPosition({
      amount: 0.25,
      from: 'center',
      ease: 'power2.out',
    }),
  })
  // gsap.timeline().to(chars, {
  //   opacity: 1,
  //   duration: 0.5,
  //   ease: 'power4.out',
  // })
}

onMounted(() => {
  splitChars()
  initialize()
})

onUnmounted(() => {})
</script>

<template>
  <article ref="el" class="page-home">
    <h1 class="page-home__header">
      <span class="page-home__header-title">Creative Developer</span>
      <a
        class="page-home__header-title page-home__header-name"
        href="mailto:jeffrey.saverio.kelley@gmail.com"
        >Jeff Kelley</a
      >
      <span class="page-home__header-title">experiments and work samples</span>

      <span class="page-home__header-border" />
    </h1>
    <div class="page-home__inner">
      <ul>
        <li
          v-for="(project, index) in store.state.projects"
          :key="project.id"
          class="page-home__list-item"
        >
          <router-link
            class="page-home__link"
            :to="project.route"
            @mouseenter="mouseenter(index)"
            @mouseleave="mouseleave(index)"
            @focus="mouseenter(index)"
            @blur="mouseleave(index)"
          >
            <span ref="texts" class="page-home__text">{{ project.title }}</span>
          </router-link>
        </li>
      </ul>
    </div>

    <HomeBackground class="page-home__background" />
  </article>
</template>

<style lang="scss">
$offwhite: rgb(247, 236, 226);
.page-home {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #000;

  &__inner {
    margin: auto;
    text-align: center;
    position: relative;
    z-index: 10;
  }

  &__background {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
  }

  &__header {
    position: absolute;
    top: 0;
    max-width: 1280px;
    width: 100%;
    left: 0;
    right: 0;
    margin: 0 auto;

    z-index: 10;
    font-family: $fontDisplay;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 20px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    font-style: italic;

    &-border {
      position: absolute;
      right: 0;
      bottom: 0;
      left: 0;
      height: 1px;
      background: rgba($offwhite, 0.5);
      transform: scaleX(0);
    }

    a {
      &:hover,
      &:focus {
        color: #fff;
      }
    }

    &-title {
      color: $offwhite;
      opacity: 0;
      &:nth-child(1) {
        position: absolute;
        left: 10px;
        bottom: 20px;
        transform: translateX(50px);
      }
      &:nth-child(2) {
        font-size: 32px;
        margin: 0 auto;
      }
      &:nth-child(3) {
        position: absolute;
        right: 10px;
        bottom: 20px;
        transform: translateX(-50px);
      }
    }
  }

  &__section {
    margin: 0 0 2em;
  }

  &__list-item {
    display: block;
    padding: 20px 0;
  }

  &__link {
    display: inline-block;
    font-family: $fontDisplay;
    font-weight: 800;
    font-size: 84px;
    line-height: 0.8;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $offwhite;

    &:hover,
    &:focus {
      color: #fff;
    }
  }

  &__text {
    display: block;
    opacity: 0;
    transform: translateY(-30px);

    .char {
      will-change: transform;
    }
  }
}
</style>
