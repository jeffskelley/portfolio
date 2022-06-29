<script setup>

</script>

<template>
  <article class="page-home">
    <div class="page-home__inner">
      <header class="page-home__header">
        <h1>Jeff Kelley</h1>

        <p>Creative development experiments and work samples</p>
      </header>

      <section class="page-home__section">
        <h3>2D</h3>
        <ul>
          <li>
            <router-link :to="{ name: 'liquidText' }"
              >Liquid text (WebGL, GLSL, Three.JS)</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'drawToReveal' }"
              >Draw to reveal (WebGL, GLSL, Three.JS)</router-link
            >
          </li>
          <li>
            <router-link :to="{ name: 'dripMask' }">SVG Drip Mask (SVG, GSAP, Canvas)</router-link>
          </li>
        </ul>
      </section>

      <section class="page-home__section">
        <h3>3D</h3>
        <ul>
          <li>
            <router-link :to="{ name: 'synthwaveOcean' }"
              >Synthwave ocean (WebGL, GLSL, Three.JS)</router-link
            >
          </li>
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

  h1,
  h2,
  h3,
  h4,
  h5 {
    font-family: $fontDisplay;
    font-weight: 700;
    line-height: 1.3;
  }

  h1 {
    margin-top: 0;
    font-size: 3.052rem;
  }

  h2 {
    font-size: 2.441rem;
  }

  h3 {
    font-size: 1.953rem;
  }

  h4 {
    font-size: 1.563rem;
  }

  h5 {
    font-size: 1.25rem;
  }
}
</style>
