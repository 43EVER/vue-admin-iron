import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:8080"
});


// http.interceptors.request.use(config => {
//   return config;
// })

export default http;
