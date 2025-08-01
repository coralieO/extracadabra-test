import * as yup from 'yup';
const frenchAddressRegex = /^[0-9]{1,4}\s?[A-Za-zÀ-ÿ0-9\s'\-]+$/;

export const validationSchemas = {
  personal_information: yup.object({
    first_name: yup.string().required('Le prénom est requis').min(2, 'Minimum 2 caractères pour le prénom'),
    last_name: yup.string().required('Le nom est requis').min(2, 'Minimum 2 caractères pour le nom'),
  }),
  birthdate: yup.object({
    birthdate: yup
      .date()
      .required('La date de naissance est requise')
      .test('age', 'Vous devez avoir au moins 18 ans', (value) => {
        if (!value) return false;
        const today = new Date();
        const birthDate = new Date(value);
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
      }),
  }),
  picture: yup.object({
    picture: yup
      .mixed()
      .required('Une photo est requise')
      .test('fileSize', 'Le fichier est trop volumineux', (value) => {
        return value && value.size <= 2 * 1024 * 1024; // 2MB max
      })
      .test('fileType', 'Format non supporté', (value) => {
        return value && ['image/jpeg', 'image/png'].includes(value.type);
      }),
  }),
  address: yup.object({
      address: yup
        .string()
        .required('L’adresse est requise')
        .matches(
          frenchAddressRegex,
          'Veuillez entrer une adresse française valide (ex: 12 Rue de Paris)'
        ),
  }),
};