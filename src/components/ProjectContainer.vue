<script setup>
import { computed } from 'vue'
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
const nextProject = computed(() =>
  projectIndex.value + 1 >= store.state.projects.length
    ? store.state.projects[0]
    : store.state.projects[projectIndex.value + 1]
)
const previousProject = computed(() =>
  projectIndex.value === 0
    ? store.state.projects[store.state.projects.length - 1]
    : store.state.projects[projectIndex.value - 1]
)

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

    <div class="project__nav">
      <router-link
        v-if="project && previousProject"
        class="project__previous project__arrow-link project__nav-item"
        :to="previousProject.route"
      >
        <span class="sr-only">Previous</span>

        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="6.28"
            y1="3.77859"
            x2="2.14857"
            y2="3.77859"
            stroke="white"
            stroke-width="1.44"
            stroke-linecap="round"
          />
          <path
            d="M3.57164 1.00084L1.00021 3.57227L3.57164 6.14369"
            stroke="white"
            stroke-width="1.44"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </router-link>

      <div class="project__info-container project__nav-item" v-if="showInfo">
        <div v-if="showingPopover" class="project__info">
          <header v-if="title" class="project__title">
            <h1 class="headline headline--small">{{ title }}</h1>
          </header>
          <ul class="project__tech">
            <li v-for="item in tech" :key="item">
              {{ item }}
            </li>
          </ul>

          <div class="project__description">
            <slot name="description"></slot>
          </div>
        </div>
        <ButtonSolid icon :color="buttonColor" class="project__info-toggle" @click="togglePopover">
          <span class="sr-only">Show project info</span>
          <span class="project__info-icon">i</span>
        </ButtonSolid>
      </div>

      <router-link
        v-if="project && nextProject"
        class="project__next project__arrow-link project__nav-item"
        :to="nextProject.route"
      >
        <span class="sr-only">Next</span>
        <svg width="7" height="7" viewBox="0 0 7 7" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line
            x1="6.28"
            y1="3.77859"
            x2="2.14857"
            y2="3.77859"
            stroke="white"
            stroke-width="1.44"
            stroke-linecap="round"
          />
          <path
            d="M3.57164 1.00084L1.00021 3.57227L3.57164 6.14369"
            stroke="white"
            stroke-width="1.44"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </router-link>
    </div>
  </section>
</template>

<style lang="scss">
.project {
  &__content {
    position: relative;
    z-index: 10;
  }
  &__nav {
    position: fixed;
    bottom: 25px;
    right: 25px;
    z-index: 100;
  }
  &__title {
    margin-bottom: 0.3em;
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
    position: absolute;
    bottom: 100%;
    right: 0;
    width: 350px;
    padding: 15px 15px 25px;
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

  &__arrow-link {
    margin: 0 15px;
    svg {
      height: 16px;
      width: 16px;
    }
    transition: transform 0.25s;
    &:hover {
      transform: scale(1.2);
    }
  }
  &__next {
    svg {
      transform: rotate(180deg);
    }
  }

  &__actions {
    position: absolute;
    bottom: 25px;
    left: 25px;
    z-index: 100;
  }

  &__nav {
    display: flex;
    align-items: center;
  }
}
</style>
