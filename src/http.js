import axios from "axios";

const http = axios.create({
  baseURL: "http://192.168.3.9:8080/web_war_exploded"
});

export default http;
