import axios from 'axios';
import { paths } from '../shared/lib/consts/paths';

export const baseURL = process.env.REACT_APP_BASE_URL;

const $api = axios.create({
  baseURL,
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  (error) => {
    if (error.response.status === 401) {
      console.log('НЕ АВТОРИЗОВАН', error);
      localStorage.clear();
      window.location.href = paths.login;
    }
    throw error;
  },
);
export default $api;
