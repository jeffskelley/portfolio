<script setup>

</script>

<template>
  <article class="page-home">
    <h1>Jeff Kelley</h1>

    <h2>Experiments and Work Samples</h2>
    <h3>2D</h3>
    <ul>
      <li>
        <router-link :to="{ name: 'liquidText' }">Liquid text (WebGL, GLSL, Three.JS)</router-link>
      </li>
      <li>
        <router-link :to="{ name: 'drawToReveal' }"
          >Draw to reveal (WebGL, GLSL, Three.JS)</router-link
        >
      </li>
      <li>
        <router-link :to="{ name: 'dripMask' }">SVG Drip Mask (SVG, GSAP)</router-link>
      </li>
    </ul>

    <h3>3D</h3>
    <ul>
      <li>
        <router-link :to="{ name: 'synthwaveOcean' }"
          >Synthwave ocean (WebGL, GLSL, Three.JS)</router-link
        >
      </li>
    </ul>
  </article>
</template>

<style lang="scss">

</style>
