<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Number,
    required: true,
  },
  min: {
    type: Number,
    required: true,
  },
  max: {
    type: Number,
    required: true,
  },
  step: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits(['update:modelValue'])

function onInput(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="range-slider">
    <label>{{ label }}</label>

    <div class="range-slider__main">
      <input
        class="range-slider__slider"
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="onInput"
      />
      <input class="range-slider__value" type="text" disabled :value="modelValue" />
    </div>
  </div>
</template>

<style lang='scss'>
.range-slider {
  &__main {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  &__slider {
    width: 100%;
  }
  &__value {
    width: 60px;
    flex-shrink: 0;
    margin-left: 15px;
  }
}
</style>
