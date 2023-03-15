import axios from "axios";
import Cookies from "universal-cookie";
import CONFIG from "../config.json";
const cookies = new Cookies();

export default function DevityBaseAxios(TooManyRequestCallback, UnauthorizedCallback)
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
        response => {
            return response; 
        },
        error => {
            const originalRequest = error.config;
            let bearer = cookies.get("devity-token");
            if (error.response && error.response.status === 401 && !originalRequest._retry 
                && bearer && originalRequest.url === "/api/sessions") {
                console.log("retry logic executed....");
                originalRequest._retry = true;
                cookies.remove("devity-token", { path: "/" });
                return axios(originalRequest);
            }

            if (error.response && error.response.status === 401 && UnauthorizedCallback) {
                console.log("show 401 Modal logic executed....");
                bearer !== null && bearer !== undefined && cookies.remove("devity-token", { path: "/" });
                UnauthorizedCallback();
            }

            if (error.response && error.response.status === 429 && TooManyRequestCallback) {
                console.log("show 429 Modal logic executed....");
                TooManyRequestCallback();
            }

            return Promise.reject(error);
        }
    );

    return instance;
}