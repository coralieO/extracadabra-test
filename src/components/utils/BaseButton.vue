<script setup lang="ts">
import { ref, computed } from 'vue'

// événement "buttonClicked" qui sera émis lorsque le bouton est cliqué
const emit = defineEmits<{
  (e: 'buttonClicked'): void
}>()

const buttonRef = ref<HTMLButtonElement | null>(null)

// Permet de définir les propriétés du composant avec des valeurs par défaut
const props = withDefaults(defineProps<{
  buttonSize?: string
  buttonText?: string
  inactive?: boolean
}>(), {
  buttonText: '',
  buttonSize: undefined,
  inactive: false
})

// Computed property pour gérer les classes CSS dynamiques du bouton
const computedClass = computed(() => {
  return [
    props.buttonSize ? `btn-${props.buttonSize}` : '',
    { 'is-inactive': props.inactive }
  ]
})
</script>

<template>
  <button
    v-bind="$attrs"
    ref="buttonRef"
    class="button"
    :class="computedClass"
    @click="emit('buttonClicked')"
  >
    {{ props.buttonText }}
  </button>
</template>

<style lang="scss" scoped>
@use '../../assets/style/main.scss';

button[disabled], html input[disabled], a[data-loading] {
  cursor: not-allowed !important;
  border-color: var(--grey-medium);
}

/* Style de base pour tous les boutons */
button {
  font-size: var(--font-size-300);
  line-height: var(--line-height-300);
  gap: var(--padding-large);
  border-radius: var(--padding-small);  
  text-decoration: none;
  text-align: center;
  border: none;
  padding: var(--padding-small);
  word-wrap: break-word;
  white-space: normal;
  background-color: var(--color-primary-dark);
  color: var(--color-neutral);
  cursor: pointer;

  /* Style pour les boutons inactifs */
  &.inactive {
    border-color: var(--grey-medium);
    color: var(--grey-dark);
  }

  /* Style pour les boutons de grande taille */
  &.btn-large {
    width: 100%;
  }

  /* Style pour les boutons de petite taille */
  &.btn-small {
    font-size: var(--font-size-100);
    line-height: var(--line-height-100);
    border-radius: var(--padding-small);  
  }

  /* Style pour les boutons de taille moyenne */
  &.btn-medium, &.medium { 
    font-size: var(--font-size-200);
    line-height: var(--line-height-200);
    border-radius: var(--padding-small);
  }
}
</style>
