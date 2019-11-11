import axios from 'axios';

const http = axios.create({
    baseURL: 'http://localhost:8080/web_war_exploded/application'
});

http.interceptors.response.use(res => {
    return res;
}, err => {
    if (err.response.data.message) {
        Vue.prototype.$message({
            type: 'error',
            message: err.response.data.message
        });
    }
});

export default http;