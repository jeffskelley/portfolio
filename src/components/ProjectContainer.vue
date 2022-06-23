<script setup>
defineProps({
  title: {
    type: String,
    default: null,
  },
  tech: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <section class="project">
    <slot></slot>

    <div class="project__info">
      <header class="project__title">
        {{ title }}
      </header>
      <div class="project__description">
        <slot name="description"></slot>
      </div>
      <div class="project__tech">
        <ul>
          <li v-for="item in tech" :key="item">
            {{ item }}
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style lang="scss">
.project {
  &__info {
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: #fff;
  }
}
</style>
