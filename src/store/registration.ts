import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getStep, submitStep } from '../api/registrationApi'

const LOCAL_STORAGE_KEY = 'registration_steps_data'

export const useRegistrationStore = defineStore('registration', () => {
  const currentStepIndex = ref(0)
  const stepsData = ref<any[]>([])
  const totalSteps = ref(0)
  const summary = ref<any | null>(null); 

  const stepOrder = ["personal_information", "birthdate", "picture", "address"]

  const currentStepSlug = computed(() => stepsData.value[currentStepIndex.value]?.slug || null)
  const nextStepSlug = computed(() => {
    const nextIndex = currentStepIndex.value + 1
    return nextIndex < stepOrder.length ? stepOrder[nextIndex] : null
  })
  const prevStepSlug = computed(() => {
    const prevIndex = currentStepIndex.value - 1
    return prevIndex >= 0 ? stepOrder[prevIndex] : null
  })

  function saveToLocalStorage() {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({
      stepsData: stepsData.value,
      currentStepIndex: currentStepIndex.value,
      totalSteps: totalSteps.value
    }))
  }

  function loadFromLocalStorage() {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.stepsData && Array.isArray(parsed.stepsData)) {
          stepsData.value = parsed.stepsData
          currentStepIndex.value = parsed.currentStepIndex ?? 0
          totalSteps.value = parsed.totalSteps ?? stepOrder.length
          return true
        }
      } catch(e) {
        // Parsing error, ignore
      }
    }
    return false
  }

  async function initRegistration() {
    // Tenter de récupérer en localStorage
    if (loadFromLocalStorage()) {
      return
    }

    const startSlug = 'personal_information'

    const { data } = await getStep(startSlug)
    stepsData.value = [data]
    totalSteps.value = data.total_steps
    currentStepIndex.value = data.current_step - 1

    saveToLocalStorage()
  }

  async function loadStep(index: number) {
    const slug = stepOrder[index]
    if (!slug) return

    const { data } = await getStep(slug)
    stepsData.value[index] = data
    currentStepIndex.value = index

    saveToLocalStorage()
  }
  
  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = err => reject(err)
    })
  }
  
  async function nextStep(payload: any) {
     // Parcours chaque clé dans payload
  for (const key in payload) {
    if (payload[key] instanceof File) {
      payload[key] = await fileToBase64(payload[key])
    }
  }

    const step = stepsData.value[currentStepIndex.value]

    await submitStep(step.slug, payload)

    stepsData.value[currentStepIndex.value].data = payload

    saveToLocalStorage()

    if (currentStepIndex.value < totalSteps.value - 1) {
      currentStepIndex.value++

      if (!stepsData.value[currentStepIndex.value]) {
        await loadStep(currentStepIndex.value)
      } else {
        saveToLocalStorage()
      }
    }
  }

  async function prevStep() {
    if (currentStepIndex.value > 0) {
      currentStepIndex.value--
      await loadStep(currentStepIndex.value)
    }
  }

  // méthode pour récupérer le résumé
  async function fetchSummary() {
    const { data } = await getSummary();
    summary.value = data; // Stocke les données du résumé
  }

  return { 
    currentStepIndex,
    stepsData,
    totalSteps,
    currentStepSlug,
    nextStepSlug,
    prevStepSlug,
    summary,
    initRegistration,
    fetchSummary,
    nextStep,
    prevStep
  }
})