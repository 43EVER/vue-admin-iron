import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080/web_war_exploded"
});


// http.interceptors.request.use(config => {
//   return config;
// })

export default http;
