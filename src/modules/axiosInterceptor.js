
import axios from "axios";
import { get_token } from './auth.js';

export const host = process.env.REACT_APP_URL_API;
const state = process.env.REACT_APP_STATE;

const STATUS = {
    ERR_NETWORK       : "ERR_NETWORK",
    ERR_BAD_REQUEST   : "ERR_BAD_REQUEST",
    ERR_BAD_RESPONSE  : "ERR_BAD_RESPONSE",
    UNAUTHORIZED      : "UNAUTHORIZED",
}

// axios.defaults.baseURL = host + "/api";
axios.defaults.baseURL = host + (state !== "DEVELOPER" ? "/api" : "");

axios.interceptors.request.use(
  function (config) {
    const token = get_token();

    if (token !== null) {
      config.headers.Authorization = `bearer ${token}`;
    }

    document.body.classList.add('loading-indicator');

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Configura un interceptor para capturar errores en las respuestas
axios.interceptors.response.use((response) => {
    // Puedes realizar alguna manipulación de la respuesta antes de resolverla

    document.body.classList.remove('loading-indicator');

    return response.data;
  }, (error) => {
    
    // Captura y maneja errores en las respuestas
    document.body.classList.remove('loading-indicator');
    
    if(error.code === STATUS.ERR_NETWORK){
        return Promise.reject({
            status: 500,
            message: 'Error de conexión al servidor.',
        });
    }

    if(error.status === 401){
      console.log(error)
      localStorage.clear();
      window.location.href = "/";
    }

    if(error.code === STATUS.ERR_BAD_REQUEST || error.code === STATUS.ERR_BAD_RESPONSE){
      return Promise.reject(error.response.data);
    }

   

    // Puedes lanzar una nueva promesa para personalizar el manejo del error
    return Promise.reject(error);
  });

export default axios;
