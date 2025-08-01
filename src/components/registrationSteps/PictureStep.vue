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
    accept?: string 
    maxSizeMB?: number 
  }>
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

  // Vérif format
  if (field.accept && !file.type.match(field.accept.replace('*', '.*'))) {
    errors.value[field.name] = `Format invalide. Fichiers acceptés : ${field.accept}`
    return
  }

  // Vérif taille
  if (field.maxSizeMB && file.size > field.maxSizeMB * 1024 * 1024) {
    errors.value[field.name] = `Fichier trop volumineux (max ${field.maxSizeMB} MB)`
    return
  }

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
  {{filePreviews}}
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
@import "../../assets/Style/main.scss";

.preview-image {
  max-width: 200px;
  margin-top: var(--padding-large);
}
.error {
  color: red;
  font-size: 0.9em;
}
</style>
