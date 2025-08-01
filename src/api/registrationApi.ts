import axios from 'axios';

export const getStep = (slug: string) =>
  axios.get(`/api/registration/step/${slug}`);

export const submitStep = (slug: string, data: any) =>
  axios.post(`/api/registration/step/${slug}`, { data });

export const getSummary = () =>
  axios.get(`/api/registration/summary`);
