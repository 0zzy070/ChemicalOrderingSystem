import axios from "axios";

axios.defaults.baseURL = "http://3.105.190.201:8080";
axios.defaults.headers.common["Access-Control-Allow-Origin"] =
    "http://3.105.190.201:8080";
axios.defaults.withCredentials = true;

export default axios;
