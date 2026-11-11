import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000', 
});

// 1. Intercepta o envio (Injeta o token)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 2. Intercepta a resposta (Trata token vencido)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token'); 
      
      // O pulo do gato: só redireciona se a pessoa NÃO estiver na tela inicial "/"
      if (window.location.pathname !== '/') {
        window.location.href = '/'; 
      }
    }
    return Promise.reject(error);
  }
);