<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useRegistrationStore } from '../../store/registration';

const registration = useRegistrationStore();
const { stepsData } = storeToRefs(registration);

// Récupération des données
const personalInfo = stepsData.value.find(step => step.slug === "personal_information")?.data || {};
const birthdate = stepsData.value.find(step => step.slug === "birthdate")?.data?.birthdate || '';
const picture = stepsData.value.find(step => step.slug === "picture")?.data?.picture || '';
const address = stepsData.value.find(step => step.slug === "address")?.data?.address || '';
</script>

<template>
  <div class="candidate-card">
    <div class="header">Résumé de votre profil</div>
    <div class="card-content">
      <div class="photo">
        <img :src="picture" alt="Photo de profil" />
      </div>
      <div class="info">
        <p class="label">NOM</p>
        <p class="value">{{ personalInfo.first_name }} {{ personalInfo.last_name }}</p>

        <p class="label">DATE DE NAISSANCE</p>
        <p class="value">{{ birthdate }}</p>

        <p class="label">ADRESSE</p>
        <p class="value">{{ address }}</p>
      </div>
    </div>
    <div class="footer">Extracadabra</div>
  </div>
</template>

<style scoped lang="scss">
@import '../../assets/Style/main.scss';

.candidate-card {
  width: 600px;
  border-radius: var(--border-radius-small);
  overflow: hidden;
  font-family: 'Merriweather', serif;
  color: var(--color-text);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid var(--color-border);

  .header {
    background-color: var(--color-primary-dark);
    color: var(--color-neutral);
    text-align: center;
    padding: var(--padding-medium);
    font-weight: var(--font-weight-bold);
    font-size: var(--font-size-400);
    letter-spacing: 1px;
  }

  .card-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--padding-large);
    background-color: var(--color-neutral);

    .photo {
      flex: 0 0 120px;

      img {
        width: 120px;
        height: 120px;
        object-fit: cover;
        border-radius: var(--border-radius-extra-small);
        border: 2px solid var(--color-border);
      }
    }

    .info {
      flex: 1;
      margin: 0 var(--padding-large);
      display: flex;
      flex-direction: column;
      gap: 6px;

      .label {
        font-weight: var(--font-weight-semibold);
        font-size: 12px;
        color: var(--color-primary-dark);
        margin-bottom: -2px;
      }

      .value {
        font-size: 14px;
        margin-bottom: 8px;
      }
    }
  }

  .footer {
    background-color: var(--color-primary-light);
    color: var( --color-secondary-dark);
    text-align: center;
    font-weight: var(--font-weight-bold);
    padding: var(--padding-medium);
    font-size: var(--font-size-300);
    letter-spacing: 2px;
  }
}
</style>
