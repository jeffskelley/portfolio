<script setup>
import GlobalHeader from '@/components/GlobalHeader.vue'
</script>

<template>
  <div>
    <GlobalHeader />

    <div class="app__main">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
.app__main {
  position: relative;
  z-index: 10;
}
.global-header {
  z-index: 100;
}
</style>
