import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Création du mock
const mock = new MockAdapter(axios, { delayResponse: 500 });

// Données simulées pour chaque étape
let stepsData: Record<string, any> = {
  personal_information: {
    total_steps: 4,
    current_step: 1,
    title: "Informations personnelles",
    slug: "personal_information",
    assets: {
      type: "form",
      fields: [
        {
          name: "first_name",
          type: "text",
          label: "Prénom",
          required: true,
          placeholder: "Votre prénom",
        },
        {
          name: "last_name",
          type: "text",
          label: "Nom",
          required: true,
          placeholder: "Votre nom",
        },
      ],
    },
    data: {
      first_name: null,
      last_name: null,
    },
  },
  birthdate: {
    total_steps: 4,
    current_step: 2,
    title: "Date de naissance",
    slug: "birthdate",
    assets: {
      type: "form",
      fields: [
        {
          name: "birthdate",
          type: "date",
          label: "Date de naissance",
          required: true,
        },
      ],
    },
    data: {
      birthdate: null,
    },
  },
  picture: {
    total_steps: 4,
    current_step: 3,
    title: "Photo de profil",
    slug: "picture",
    assets: {
      type: "upload",
      fields: [
        {
          name: "picture",
          type: "file",
          label: "Photo de profil",
          required: true,
          accept: "image/*",
        },
      ],
    },
    data: {
      picture: null,
    },
  },
  address: {
    total_steps: 4,
    current_step: 4,
    title: "Adresse",
    slug: "address",
    assets: {
      type: "form",
      fields: [
        {
          name: "address",
          type: "text",
          label: "Adresse",
          required: true,
          placeholder: "Votre adresse complète",
        },
      ],
    },
    data: {
      address: null,
    },
  },
};

// GET /api/registration/step/{slug}
mock.onGet(/\/api\/registration\/step\/\w+/).reply((config) => {
  const slug = config.url?.split("/").pop() as string;
  return [200, stepsData[slug]];
});

// POST /api/registration/step/{slug}
mock.onPost(/\/api\/registration\/step\/\w+/).reply((config) => {
  const slug = config.url?.split("/").pop() as string;
  const body = JSON.parse(config.data);

  // Sauvegarde les données
  stepsData[slug].data = { ...stepsData[slug].data, ...body.data };

  return [200, { data: stepsData[slug].data }];
});

// GET /api/registration/summary
mock.onGet("/api/registration/summary").reply(200, {
  title: "Récapitulatif de votre inscription",
  is_valid: true,
  steps: [
    {
      slug: "personal_information",
      label: "Informations personnelles",
      has_error: false,
      data:
        stepsData.personal_information.data.first_name &&
        stepsData.personal_information.data.last_name
          ? `${stepsData.personal_information.data.first_name} ${stepsData.personal_information.data.last_name}`
          : null,
    },
    {
      slug: "birthdate",
      label: "Date de naissance",
      has_error: false,
      data: stepsData.birthdate.data.birthdate,
    },
    {
      slug: "picture",
      label: "Photo de profil",
      has_error: false,
      data: stepsData.picture.data.picture,
    },
    {
      slug: "address",
      label: "Adresse",
      has_error: !stepsData.address.data.address,
      error: !stepsData.address.data.address ? "Adresse incomplète" : undefined,
      data: stepsData.address.data.address,
    },
  ],
});

export default mock;
