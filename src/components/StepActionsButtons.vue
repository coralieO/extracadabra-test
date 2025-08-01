<script setup lang="ts">
import BaseButton from '../components/utils/BaseButton.vue'

const props = defineProps<{
  showPrev?: boolean
  showNext?: boolean
  nextLabel?: string
  prevLabel?: string
  lastStep?: boolean
}>()

const emit = defineEmits(['prev', 'next', 'submit'])
</script>

<template>
  <div class="actions">
    <!-- Bouton précédent -->
    <BaseButton
      v-if="showPrev"
      button-size="small"
      :button-text="prevLabel || 'Précédent'"
      @button-clicked="$emit('prev')"
    />

    <!-- Bouton suivant ou soumission -->
       <!-- Bouton suivant ou envoyer -->
    <BaseButton
      v-if="showNext"
      type="submit"
      button-size="small"
      :button-text="lastStep ? 'Envoyer' : (nextLabel || 'Suivant')"
      @button-clicked="$emit('next')"
    />
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: space-between;
}
</style>
