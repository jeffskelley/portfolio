<script setup>
import MenuToggle from 'components/MenuToggle'
</script>

<template>
  <nav class="global-header">
    <MenuToggle />
  </nav>
</template>

<style lang="scss">
.global-header {
  position: fixed;
  top: 0;
  left: 0;
}
</style>
