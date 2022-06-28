<script setup>
import GlobalHeader from 'components/GlobalHeader'
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
</style>
