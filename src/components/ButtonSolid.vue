<script setup>
defineProps({
  color: {
    type: String,
    default: 'white',
  },
  icon: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <button class="button label label--large" :class="[`button--${color}`, { 'button--icon': icon }]">
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
  padding: 8px 35px;
  border-radius: 18px;
  height: 36px;

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
  &--black {
    background: rgb(25, 25, 25);
    color: #fff;
    &:hover {
      background: rgb(55, 55, 55);
    }
    &:active {
      background: rgb(45, 45, 45);
    }
  }

  &--icon {
    padding-left: 0;
    padding-right: 0;
    width: 36px;
  }
}
</style>
