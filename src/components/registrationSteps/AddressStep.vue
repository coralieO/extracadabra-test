<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import BaseInput from '../../components/utils/BaseInput.vue';
import StepActionsButtons from '../../components/StepActionsButtons.vue';

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

const emit = defineEmits(['next', 'prev', 'lastStep']);

const newStepData = ref({ ...props.stepData });
const suggestions = ref<Array<any>>([]);
const isValidAddress = ref(false);
const errors = ref<Record<string, string>>({});

async function fetchAddressSuggestions(query: string) {
  if (!query || query.length < 3) {
    suggestions.value = [];
    return;
  }

  try {
    const { data } = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: query,
        limit: 5,
      },
    });

    suggestions.value = data.features.map((f: any) => ({
      label: f.properties.label,
      city: f.properties.city,
      postcode: f.properties.postcode,
      coordinates: f.geometry.coordinates,
    }));
  } catch (error) {
    console.error('Erreur lors de la récupération des adresses :', error);
  }
}

/**
 * When user selects a suggestion
 */
function selectSuggestion(fieldName: string, suggestion: any) {
  newStepData.value[fieldName] = suggestion.label;
  isValidAddress.value = true;
  suggestions.value = [];
}

/**
 * Validate and submit step
 */
function handleSubmit(e: Event) {
  e.preventDefault();
  const addressField = props.fields.find((f) => f.type === 'address');
  if (addressField && !isValidAddress.value) {
    errors.value[addressField.name] = 'Veuillez sélectionner une adresse valide';
    return;
  }

  // Émettre l'événement `lastStep` si c'est la dernière étape
  emit('lastStep', newStepData.value);
}
</script>

<template>
  <form class="address-step flex-column-gap-large" @submit="handleSubmit">
    <div
      v-for="field in fields"
      :key="field.name"
      class="form-group flex-column-gap-small"
    >
      <label :for="field.name">{{ field.label }}</label>

      <!-- Champ adresse avec autocomplétion -->
      <div v-if="field.type === 'address'" class="autocomplete-wrapper">
        <BaseInput
          v-model:modelValue="newStepData[field.name]"
          :id="field.name"
          :name="field.name"
          type="text"
          :place-holder="field.placeholder"
          :rounded="true"
          :required="field.required"
          @input="fetchAddressSuggestions(newStepData[field.name])"
          @update:modelValue="fetchAddressSuggestions"
        />

        <!-- Suggestions -->
        <ul v-if="suggestions.length" class="suggestions-list">
          <li
            v-for="(suggestion, index) in suggestions"
            :key="index"
            @click="selectSuggestion(field.name, suggestion)"
          >
            {{ suggestion.label }}
          </li>
        </ul>

        <p v-if="errors[field.name]" class="error">{{ errors[field.name] }}</p>
      </div>

      <!-- Autres inputs -->
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
      :last-step="true"
      @prev="$emit('prev')"
      @next="handleSubmit"
    />
  </form>
</template>