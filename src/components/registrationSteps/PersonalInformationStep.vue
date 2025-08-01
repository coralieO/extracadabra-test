<script setup lang="ts">
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import { validationSchemas } from '../../../src/validation/validationSchemas';   
import BaseInput from '../../../src/components/utils/BaseInput.vue';
import StepActionsButtons from '../../../src/components/StepActionsButtons.vue';

const props = defineProps<{
  stepData: Record<string, any>;
  fields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder?: string;
    required?: boolean;
  }>;
}>();

const emit = defineEmits(['next', 'prev']);

// Utiliser une copie locale des données pour éviter de modifier directement les props
const newStepData = ref(
  Object.fromEntries(
    Object.entries(props.stepData).map(([key, value]) => [key, value ?? ""])
  )
);
// Utiliser Vee-Validate pour gérer le formulaire
const { handleSubmit, errors } = useForm({
  validationSchema: validationSchemas.personal_information,
  initialValues: newStepData.value,
});

function onSubmit(values: Record<string, any>) {
  console.log('Form submitted with values:', values);
  emit('next', values); // Émettre les données validées
}
</script>

<template>
  <form class="personal-information-step flex-column-gap-large" @submit="handleSubmit(onSubmit)">
    <div v-for="field in fields" :key="field.name" class="form-group flex-column-gap-small">
      {{ newStepData }}
      <label :for="field.name">{{ field.label }}</label>
      <BaseInput  
        v-model:modelValue="newStepData[field.name]"
        :id="field.name"
        :name="field.name"
        :type="field.type"
        :place-holder="field.placeholder"
        :errors="errors[field.name]"
        :rounded="true"
        :required="field.required"
         ></BaseInput>
      <p v-if="errors[field.name]" class="error">{{ errors[field.name] }}</p>
    </div>

    <StepActionsButtons
      :show-prev="false"
      :show-next="true"
      @prev="$emit('prev')"
      @next="() => emit('next', newStepData.value)"
      />
  </form>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.875rem;
}
</style>