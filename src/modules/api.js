import axios from '../modules/axiosInterceptor';

/**
 * obtiene la información del streaming
 * @param {String} streamingId identificador único del streaming
 * @returns 
 */
const get_streaming = (streamingId) => axios.get(`/stream/${streamingId}`);

/**
 * obtiene la información de conexión para los receptores
 * @param {string} streamingId identificador único del streaming
 * @returns 
 */
const get_connect_streaming = (streamingId) => axios.get(`/receptor/${streamingId}`);

/**
 * obtiene la configuración del algoritmo de encriptación para generar el certificado de conexión entre peers
 * @returns 
 */
const stream_keygenAlgorithm = ()=> axios.get(`/stream/configCertificate`);

export default { 
    get_streaming,
    get_connect_streaming,
    stream_keygenAlgorithm
}
