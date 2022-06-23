<script setup>
</script>

<template>
  <nav class="global-header">
    <router-link class="global-header__home" :to="{ name: 'home' }">Home</router-link>

    <a class="global-header__contact" href="mailto:jeff.s.kelley@gmail.com">Contact</a>
  </nav>
</template>

<style lang="scss">
.global-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
