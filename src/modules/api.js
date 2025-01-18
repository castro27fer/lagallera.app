import axios from '../modules/axiosInterceptor';

const get_streaming = (streamingId) => axios.get(`/stream/${streamingId}`);
const get_connect_streaming = (streamingId) => axios.get(`/receptor/${streamingId}`);

export default { 
    get_streaming,
    get_connect_streaming
}
