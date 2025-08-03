
<script setup lang="ts">
import { ref } from 'vue';
import BaseInput from '../../components/utils/BaseInput.vue';
import StepActionsButtons from '../../components/StepActionsButtons.vue';
import type { FormField, StepData } from '../../interface/RegistrationFormInterface';

const props = defineProps<{
  stepData: StepData;
  fields: FormField[];
}>()


const emit = defineEmits(['next', 'prev', 'lastStep']);
const newStepData = ref({ ...props.stepData });

interface Suggestion {
  display_name: string;
  // ajoute d'autres propriétés si besoin
}
const suggestions = ref<Suggestion[]>([]);
let timeoutId: ReturnType<typeof setTimeout> | null = null;

function onInput() {
  if (timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(() => {
    fetchSuggestions();
  }, 300);
}


async function fetchSuggestions() {
  const query = newStepData.value.address?.trim() || '';

  // Si moins de 2 caractères, on vide les suggestions et on sort
  if (query.length < 2) {
    suggestions.value = [];
    return;
  }

  const url = `https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=10`;
 
  try {
    const res = await fetch(url, { headers: { 'Accept-Language': 'fr' } });
    if (!res.ok) throw new Error('Erreur API');

    const data = await res.json();
    // Filtrer pour ne garder que des adresses postales
    suggestions.value = data.features.map((f: any) => ({
      label: f.properties.label,
    }));
;
  } catch (error) {
    console.error(error);
    suggestions.value = [];
  }
}



function selectSuggestion(suggestion: Suggestion) {
  newStepData.value.address = suggestion.label;
  suggestions.value = [];
}

// Validation et soumission
function handleSubmit(e?: Event) {
  e?.preventDefault(); 

  // Emission de l'événement lastStep avec les données
  emit('lastStep', newStepData.value);
  emit('next', newStepData.value)
console.log('Données de l\'étape d\'adresse soumises :', newStepData.value);
}

// Pour fermer la liste des suggestions si on clique en dehors
function onClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (!target.closest('.autocomplete-wrapper')) {
    suggestions.value = [];
  }
}

window.addEventListener('click', onClickOutside);
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
      <BaseInput
        v-model:modelValue="newStepData[field.name]"
        @input="onInput"
        :id="field.name"
        :name="field.name"
        type="text"
        :placeholder="field.placeholder"
        :rounded="true"
        :required="field.required"
        autocomplete="off"
      />

      <div v-if="suggestions.length" class="autocomplete-wrapper" style="position: relative;">
        <!-- Suggestions -->

        <ul class="autocomplete-list">
        <li
          v-for="(suggestion, index) in suggestions"
          :key="index"
          @click="selectSuggestion(suggestion)"
        >
          {{ suggestion.label }}
        </li>
      </ul>
      </div>

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


<style lang="scss" scoped>

.autocomplete-wrapper {
  position: absolute;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  width: 100%;
  max-height: 200px;
  overflow-y: auto;
  padding: 0;
  margin: 0;
  list-style: none;
  z-index: 10;
  li {
    padding: var(--padding-small);
    cursor: pointer;
    &:hover {
      background-color: var( --color-primary-muted);
    }
  }
}

</style>