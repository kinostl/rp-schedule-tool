import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:8080/records',
    timeout: 1000,
  });

export default api