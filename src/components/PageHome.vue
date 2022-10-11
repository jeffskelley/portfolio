<script setup>
import store from '@/store'
</script>

<template>
  <article class="page-home">
    <div class="page-home__inner">
      <header class="page-home__header">
        <h1 class="brand brand--large">Jeff Kelley</h1>

        <p class="headline headline--large">
          Creative development<br />
          experiments and work samples
        </p>
      </header>

      <section class="page-home__section body body--large">
        <ul>
          <li v-for="project in store.state.projects" :key="project.id">
            <router-link class="page-home__link" :to="project.route">
              <span class="title title--large">{{ project.title }}</span>
              <span class="title title--small">({{ project.tech.join(', ') }})</span>
            </router-link>
          </li>
          <!-- <li>
            <router-link class="page-home__link" :to="{ name: 'albumGrid' }"
              >Fisheye Album Art Grid (WebGL, GLSL, Three.JS)</router-link
            >
          </li>
          <li>
            <router-link class="page-home__link" :to="{ name: 'liquidText' }"
              >Liquid text (WebGL, GLSL, Three.JS)</router-link
            >
          </li>
          <li>
            <router-link class="page-home__link" :to="{ name: 'dripMask' }"
              >SVG Drip Mask (SVG, GSAP, Canvas)</router-link
            >
          </li>
          <li>
            <router-link class="page-home__link" :to="{ name: 'drawToReveal' }"
              >Draw to reveal (WebGL, GLSL, Three.JS)</router-link
            >
          </li>
          <li>
            <router-link class="page-home__link" :to="{ name: 'synthwaveOcean' }"
              >Synthwave ocean (WebGL, GLSL, Three.JS)</router-link
            >
          </li> -->
        </ul>
      </section>
    </div>
  </article>
</template>

<style lang="scss">
.page-home {
  display: flex;
  min-height: 100vh;
  width: 100%;

  &__inner {
    margin: auto;
    max-width: 600px;
  }

  &__header {
    margin: 0 0 1.38rem;
  }

  &__section {
    margin: 0 0 2em;
  }

  h1 {
    margin-bottom: 5px;
  }

  li {
    margin: 0.5em 0;

    .title {
      display: block;
    }
  }
}
</style>
