<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useRegistrationStore } from '../store/registration';
import { validationSchemas } from '../validation/validationSchemas';

import PersonalInformationStep from '../components/registrationSteps/PersonalInformationStep.vue';
import BirthdateStep from '../components/registrationSteps/BirthdateStep.vue';
import PictureStep from '../components/registrationSteps/PictureStep.vue';
import AddressStep from '../components/registrationSteps/AddressStep.vue';

const registration = useRegistrationStore();
const { stepsData, currentStepIndex } = storeToRefs(registration);

const globalErrors = ref<string[]>([]);

onMounted(() => {
  registration.initRegistration();
});

const stepsArray = computed(() => stepsData.value);
const currentStep = computed(() => stepsArray.value[currentStepIndex.value]);

function getStepComponent(slug?: string) {
  switch (slug) {
    case 'personal_information':
      return PersonalInformationStep;
    case 'birthdate':
      return BirthdateStep;
    case 'picture':
      return PictureStep;
    case 'address':
      return AddressStep;
    default:
      console.warn('Step non trouvé:', slug);
      return null;
  }
}

function handleNext(payload: any) {
  const schema = validationSchemas[currentStep.value.slug];
  schema
    .validate(payload, { abortEarly: false })
    .then(() => {
      globalErrors.value = [];
      registration.nextStep(payload);
    })
    .catch((err) => {
      globalErrors.value = err.errors;
      console.error('Validation échouée:', err.errors);
    });
}

function handlePrev() {
  registration.prevStep();
}
</script>

<template>
  <div class="registration-form flex-column-gap-large">
    <h1>{{ currentStep?.title }}</h1>

    <!-- Encart des erreurs -->
    <div v-if="globalErrors.length" class="error-box">
      <ul>
        <li v-for="(error, index) in globalErrors" :key="index">{{ error }}</li>
      </ul>
    </div>

    <component
      :is="getStepComponent(currentStep?.slug)"
      v-if="currentStep"
      :step-data="currentStep.data"
      :fields="currentStep.assets?.fields || []"
      @next="handleNext"
      @prev="handlePrev"
    />
  </div>
</template>

<style lang="scss" scoped>
@import '../assets/Style/main.scss';

h1 {
  font-size: var(--font-size-400);
  line-height: var(--line-height-400);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary-darker);
  text-align: center;
}

.registration-form {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: var(--padding-medium);
  background-color: var(--color-bg);
  border-radius: var(--border-radius-large);
  box-shadow: var(--box-shadow);
}

.error-box {
  background-color: var(--color-secondary-dark);
  color: var(--color-neutral);
  border-radius: var(--border-radius-small);
  padding: var(--padding-small);
}

.error-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.error-box li {
  font-size: var(--font-size-200);
  line-height: var(--line-height-200);
}
</style>