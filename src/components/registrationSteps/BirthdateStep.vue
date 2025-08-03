<script setup lang="ts">
import { ref } from 'vue'
import BaseInput from '../../components/utils/BaseInput.vue'
import StepActionsButtons from '../../components/StepActionsButtons.vue'
import type { FormField, StepData } from '../../interface/RegistrationFormInterface';

const props = defineProps<{
  stepData: StepData;
  fields: FormField[];
}>()


const emit = defineEmits(['next', 'prev'])

// Création d'un état local basé sur stepData pour permettre le v-model
const newStepData = ref({ ...props.stepData })

function handleSubmit(e: Event) {
  e.preventDefault()
  emit('next', newStepData.value)
}
</script>

<template>
  <form class="birthdate-step flex-column-gap-large"  @submit="handleSubmit">
    <div v-for="field in fields" :key="field.name" class="form-group flex-column-gap-small">
      <label :for="field.name">{{ field.label }}</label>
      <BaseInput  
        v-model:modelValue="newStepData[field.name]"
        :id="field.name"
        :name="field.name"
        :type="field.type"
        :place-holder="field.placeholder"
        :rounded="true"
        :required="field.required"
         ></BaseInput>
    </div>

    <StepActionsButtons
      :show-prev="true"
      :show-next="true"
      @prev="$emit('prev')"
      @next="() => emit('next', newStepData.value)"
      />
  </form>
</template>

<style lang="scss" scoped>
@use "../../assets/style/main.scss";
</style>