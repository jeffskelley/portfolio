<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ButtonSolid from '@/components/ButtonSolid.vue'

defineProps({
  showInfo: {
    type: Boolean,
    default: true,
  },
  buttonColor: {
    type: String,
    default: 'black',
  },
})

const store = useStore()
const route = useRoute()

// project
const projectIndex = computed(() =>
  store.state.projects.findIndex((project) => project.route.name === route.name)
)
const project = computed(() => store.state.projects[projectIndex.value])
const title = computed(() => project.value?.title)
const tech = computed(() => project.value?.tech)

// site navigation
const nextProject = computed(() => store.state.projects[projectIndex.value + 1])
const previousProject = computed(() => store.state.projects[projectIndex.value - 1])

// popup
const showingPopover = computed(() => store.state.showingPopover)
function togglePopover() {
  store.state.showingPopover = !store.state.showingPopover
}
</script>

<template>
  <section class="project">
    <div class="project__content">
      <slot></slot>
    </div>

    <div class="project__actions">
      <slot name="actions" />
    </div>

    <div v-if="showInfo" class="project__info-container">
      <div v-if="showingPopover" class="project__info">
        <header v-if="title" class="project__title">
          <h1 class="headline headline--large">{{ title }}</h1>
        </header>
        <ul class="project__tech">
          <li v-for="item in tech" :key="item">
            {{ item }}
          </li>
        </ul>

        <div class="project__description">
          <slot name="description"></slot>
        </div>
        <footer v-if="project" class="project__footer">
          <router-link v-if="previousProject" class="project__previous" :to="previousProject.route"
            >Previous</router-link
          >
          <router-link v-if="nextProject" class="project__next" :to="nextProject.route"
            >Next</router-link
          >
        </footer>
      </div>
      <ButtonSolid icon :color="buttonColor" class="project__info-toggle" @click="togglePopover">
        <span class="sr-only">Show project info</span>
        <span class="project__info-icon">i</span>
      </ButtonSolid>
    </div>
  </section>
</template>

<style lang="scss">
.project {
  &__content {
    position: relative;
    z-index: 10;
  }
  &__info-container {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 100;
  }
  &__info-icon {
    font-family: $fontBody;
    font-weight: 700;
    font-size: 20px;
  }
  &__info-toggle {
    display: block;
    margin: 0 0 0 auto;
  }
  &__info {
    width: 100%;
    max-width: 350px;
    padding: 15px;
    margin-bottom: 15px;

    border-radius: 5px;
    background: #fff;
    box-shadow: 0 0 15px rgba(#000, 0.25);
  }

  &__tech {
    font-family: $fontDisplay;
    font-size: 14px;
    letter-spacing: 0.025em;
    margin-bottom: 15px;
    display: flex;

    li:not(:first-child) {
      padding-left: 10px;
    }
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    margin-top: 25px;
  }
  &__next {
    margin-left: auto;
  }

  &__actions {
    position: absolute;
    bottom: 25px;
    left: 25px;
    z-index: 100;
  }
}
</style>
