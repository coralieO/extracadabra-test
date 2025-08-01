<script setup lang="ts">

defineProps<{
  modelValue: string
  color?: string
  placeHolder?: string
  rounded?: boolean,
  errors?: string
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

</script>

<template>
  <div class="flex-column-gap-small input-row">
    <input
      v-bind="$attrs"
      :value="modelValue"
      class="input"
      :class="[{ 'rounded': rounded }, color]"
      :placeholder="placeHolder"
      @input="$emit('update:modelValue', $event.target?.value)"
    >
    <span
      v-if="errors"
      class="error-text"
    >{{ errors }}</span>
  </div>
</template>

<style lang="scss" scoped>

@import "../../assets/Style/main.scss";

.input {
  outline: none;
  box-sizing: border-box;
  border: none;
  border-bottom: 1px var(--color-primary) solid;
  padding-right: var(--padding-large);
  padding-left: 0;
  background-color: transparent;
  height: 40px;
  width: 100%;
}

input::placeholder {
  color: var(--color-primary-dark);
  opacity: 1;
  transition: opacity 0.2s ease;
}

input:focus::placeholder {
  opacity: 0;
}


:deep(input[type=email]) {
  height: 40px;
}

.input-row {
  flex-grow: 1;
}

.error-text {
  color: var(--color-secondary-dark);
  font-family: Dinhab, Arial, sans-serif;
  margin-top: var(--padding-extra-small);
}

.error-text::first-letter {
  text-transform: uppercase;
}

</style>
