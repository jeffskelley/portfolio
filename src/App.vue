<script setup>
import GlobalHeader from 'components/GlobalHeader'
</script>

<template>
  <div class="app">
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
</style>
