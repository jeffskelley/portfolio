<script setup>
import MenuToggle from '@/components/MenuToggle.vue'
</script>

<template>
  <nav class="global-header">
    <MenuToggle />
  </nav>
</template>

<style lang="scss">
.global-header {
  position: fixed;
  top: 15px;
  left: 15px;
}
</style>
