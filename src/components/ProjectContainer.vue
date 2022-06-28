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
        <h1>{{ title }}</h1>
      </header>
      <div class="project__description">
        <slot name="description"></slot>
      </div>
      <ul class="project__tech">
        <li v-for="item in tech" :key="item">
          {{ item }}
        </li>
      </ul>
    </div>
  </section>
</template>

<style lang="scss">
.project {
  &__info {
    position: fixed;
    bottom: 25px;
    right: 25px;
    max-width: 350px;
    padding: 15px;

    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 15px rgba(#000, 0.25);

    h1 {
      font-family: $fontDisplay;
      font-weight: bold;
      font-size: 25px;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      margin-bottom: 25px;
    }
    p {
      font-size: 14px;
      line-height: 1.5;
    }
  }

  &__tech {
    font-family: $fontDisplay;
    font-size: 14px;
    letter-spacing: 0.025em;
    margin-top: 25px;
    display: flex;

    li:not(:first-child) {
      padding-left: 10px;
    }
  }
}
</style>
