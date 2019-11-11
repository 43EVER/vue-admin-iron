import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8080/web_war_exploded/application'
});

export default http;