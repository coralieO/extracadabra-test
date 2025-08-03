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

const newStepData = ref({ ...props.stepData })

// Pour stocker les previews des fichiers
const filePreviews = ref<Record<string, string>>({})

// Pour stocker les erreurs de validation
const errors = ref<Record<string, string>>({})

function handleFileChange(event: Event, field: any) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  // Si tout est OK
  errors.value[field.name] = ''
  newStepData.value[field.name] = file
  filePreviews.value[field.name] = URL.createObjectURL(file)
}

function handleSubmit(e: Event) {
  e.preventDefault()
  emit('next', { ...newStepData.value })
}
</script>

<template>
  <form class="personal-information-step flex-column-gap-large" @submit="handleSubmit">
    <div v-for="field in fields" :key="field.name" class="form-group flex-column-gap-small">
      <label :for="field.name">{{ field.label }}</label>

      <!-- Gestion des fichiers -->
      <template v-if="field.type === 'file'">
        <input
          :id="field.name"
          :name="field.name"
          type="file"
          :accept="field.accept"
          @change="handleFileChange($event, field)"
        />
        <p v-if="errors[field.name]" class="error">{{ errors[field.name] }}</p>

        <!-- Preview image -->
        <img
          v-if="filePreviews[field.name]"
          :src="filePreviews[field.name]"
          alt="Preview"
          class="preview-image"
        />
        <img  v-if="!filePreviews[field.name] && stepData.picture" :src="stepData.picture" alt="Photo de profil" class="preview-image" />
      </template>

      <!-- Inputs classiques -->
      <BaseInput
        v-else
        v-model:modelValue="newStepData[field.name]"
        :id="field.name"
        :name="field.name"
        :type="field.type"
        :place-holder="field.placeholder"
        :rounded="true"
        :required="field.required"
      />
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

.preview-image {
  max-width: 200px;
  margin-top: var(--padding-large);
}
.error {
  color: red;
  font-size: 0.9em;
}
</style>
