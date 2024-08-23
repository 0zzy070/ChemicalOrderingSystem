import axios from "axios";

axios.defaults.baseURL = "http://13.238.27.37:9080";
axios.defaults.headers.common["Access-Control-Allow-Origin"] =
    "http://13.238.27.37:9080";
axios.defaults.withCredentials = true;

export default axios;
