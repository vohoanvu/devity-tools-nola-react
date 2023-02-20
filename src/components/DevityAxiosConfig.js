import axios from "axios";
import Cookies from "universal-cookie";
import CONFIG from "../config.json";
const cookies = new Cookies();

export default function DevityBaseAxios(failResponseCallback)
{
    const instance = axios.create({
        baseURL: CONFIG.API_URL
    });

    instance.interceptors.request.use(
        (config) => {
            let bearer = cookies.get("devity-token");
            if (bearer) {
                config.headers["Authorization"] = bearer;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    instance.interceptors.response.use(
        response => { return response; },
        error => {
            const originalRequest = error.config;
            let bearer = cookies.get("devity-token");
            if (error.response.status === 401 && !originalRequest._retry && bearer) {
                originalRequest._retry = true;
                axios.defaults.headers.common["Authorization"] = bearer;
                return axios(originalRequest);
            }

            if (error.response.status === 429 && error.response && failResponseCallback) {
                failResponseCallback();
            }
            return Promise.reject(error);
        }
    );

    return instance;
}