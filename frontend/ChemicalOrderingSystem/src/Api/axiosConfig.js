import axios from "axios";

axios.defaults.baseURL = "http://52.65.207.133:8080";
axios.defaults.headers.common["Access-Control-Allow-Origin"] =
    "http://52.65.207.133:8080";
axios.defaults.withCredentials = true;

export default axios;
