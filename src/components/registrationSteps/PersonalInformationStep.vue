<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../../components/utils/BaseInput.vue'
import StepActionsButtons from '../../components/StepActionsButtons.vue'

const props = defineProps<{
  stepData: Record<string, any>
  fields: Array<{
    name: string
    label: string
    type: string
    placeholder?: string
    required?: boolean
  }>
}>()

const emit = defineEmits(['next', 'prev'])

// Création d'un état local basé sur stepData pour permettre le v-model
const newStepData = ref({ ...props.stepData })

function handleSubmit(e: Event) {
  e.preventDefault()
  console.log('Données soumises :', newStepData.value);
  emit('next', newStepData.value)
}
</script>

<template>
  <form class="personal-information-step flex-column-gap-large" @submit="handleSubmit">
    <div v-for="field in fields" :key="field.name" class="form-group flex-column-gap-small">
      <label :for="field.name">{{ field.label }}</label>
      <BaseInput  
        v-model:modelValue="newStepData[field.name]"
        :id="field.name"
        :name="field.name"
        :type="field.type"
        :place-holder="field.placeholder"
        :errors="error"
        :rounded="true"
        :required="field.required"
         ></BaseInput>
    </div>

    <StepActionsButtons
      :show-prev="false"
      :show-next="true"
      @prev="$emit('prev')"
      @next="() => emit('next', newStepData.value)"
      />

  </form>
</template>

<style lang="scss" scoped>
@import "../../assets/Style/main.scss";
</style>