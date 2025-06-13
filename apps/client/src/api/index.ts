import axios from 'axios';

export const apiClientMainServer = axios.create({
  baseURL: import.meta.env.VITE_MAIN_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClientMainServer.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiClientProxyServer = axios.create({
  baseURL: import.meta.env.VITE_PROXY_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClientProxyServer.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiClientBuilderServer = axios.create({
  baseURL: import.meta.env.VITE_BUILDER_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClientBuilderServer.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error occurred';
    return Promise.reject(new Error(message));
  }
);

export const apiClientContainerServer = axios.create({
  baseURL: import.meta.env.VITE_CONTAINER_SERVER_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

apiClientContainerServer.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.error || error.message || 'Unknown error occurred';
    return Promise.reject(new Error(message));
  }
);
