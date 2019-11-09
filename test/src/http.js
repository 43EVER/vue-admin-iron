import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8080/application'
});

export default http;