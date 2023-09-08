import axios from 'axios';
import {API_BASE_URL} from "../constants/apiUrl";

export const index = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

index.interceptors.request.use(
  (config) => {
    console.info('calling api');
    return config;
  },
  (error) => {
    return error;
  }
);
