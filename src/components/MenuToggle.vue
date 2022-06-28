<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const theme = computed(() => {
  return route.meta.hasLightBackground ? 'dark' : 'light'
})
</script>

<template>
  <router-link :to="{ name: 'home' }" class="menu-toggle" :class="`menu-toggle--${theme}`">
    <span class="sr-only">Toggle Menu</span>
    <div class="menu-toggle__icon">
      <div
        v-for="index in 3"
        :key="index"
        class="menu-toggle__icon-bar"
        :class="'menu-toggle__icon-bar--' + index"
      />
    </div>
  </router-link>
</template>

<style lang="scss">
.menu-toggle {
  display: inline-block;
  margin: 0;
  padding: 10px;
  transition: transform 0.3s;

  &.router-link-active {
    display: none;
  }

  &__icon {
    display: block;
    width: 23px;
    height: 14px;
    position: relative;
    transform-origin: center;
    transition: transform 0.3s;
  }
  &__icon-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 16px;
    height: 2px;
    display: block;
    transform-origin: center;
    transition: transform 0.3s;

    &--1 {
      transform: translate(2px, 1px);
    }
    &--2 {
      transform: translate(7px, 7px);
    }
    &--3 {
      transform: translate(0px, 13px);
    }
  }

  &:not(.menu-toggle--active):hover {
    transform: scale(1);
    .menu-toggle__icon-bar--1 {
      transform: translate(3px, 1px);
    }
    .menu-toggle__icon-bar--2 {
      transform: translate(3px, 7px);
    }
    .menu-toggle__icon-bar--3 {
      transform: translate(3px, 13px);
    }
  }
  &--active {
    .menu-toggle__icon-bar--1 {
      transform: translate(3px, 7px) rotate(45deg);
    }
    .menu-toggle__icon-bar--2 {
      transform: translate(3px, 7px) scale(0);
    }
    .menu-toggle__icon-bar--3 {
      transform: translate(3px, 7px) rotate(-45deg);
    }
  }
  &--light {
    .menu-toggle__icon-bar {
      background: #fff;
    }
  }
  &--dark {
    .menu-toggle__icon-bar {
      background: #000;
    }
  }
}
</style>
