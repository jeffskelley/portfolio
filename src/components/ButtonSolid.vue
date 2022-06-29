<script setup>
import { defineProps } from 'vue'

defineProps({
  color: {
    type: String,
    default: 'white',
  },
})
</script>

<template>
  <button class="button" :class="`button--${color}`">
    <slot />
  </button>
</template>

<style lang="scss">
.button {
  // button reset
  border: 0;
  white-space: nowrap;
  text-decoration: none;
  padding: 0;
  margin: 0;
  cursor: pointer;

  // styles
  font-family: $fontDisplay;
  font-size: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 8px 35px;
  border-radius: 25px;

  transition-duration: background 0.3s;
  &:hover,
  &:active {
    transition-duration: 0.1s;
  }

  &--white {
    background: #fff;
    color: #000;
    transition: background 0.3s;

    &:hover {
      background: rgb(200, 200, 200);
    }
    &:active {
      background: rgb(150, 150, 150);
    }
  }
}
</style>
