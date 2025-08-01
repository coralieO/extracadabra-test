// Interface pour un champ de formulaire
export interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder: string;
  required: boolean;
}

// Interface pour les données d'une étape
export interface StepData {
  total_steps: number;
  current_step: number;
  title: string;
  slug: string;
  assets: {
    type: string;
    fields: FormField[];
  };
  data: Record<string, string | null>;
}

// Interface pour le résumé
export interface SummaryStep {
  slug: string;
  label: string;
  has_error: boolean;
  error?: string;
  data: string | null;
}

export interface SummaryData {
  title: string;
  is_valid: boolean;
  steps: SummaryStep[];
}