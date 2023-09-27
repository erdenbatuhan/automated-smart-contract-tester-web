import axios, { HttpStatusCode } from 'axios';

const {
  VUE_APP_BACKEND_HOST: BACKEND_HOST,
  VUE_APP_BACKEND_BASE_URL: BACKEND_BASE_URL
} = process.env;
if (!BACKEND_HOST || !BACKEND_BASE_URL) throw new Error('Missing environment variables!');

const axiosInstance = axios.create({
  baseURL: BACKEND_HOST + BACKEND_BASE_URL,
  withCredentials: true
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      return Promise.reject(error.response);
    } else if (error.request) {
      return Promise.reject({ data: { error: { message: 'Network error' } }, status: HttpStatusCode.InternalServerError });
    } else {
      return Promise.reject({ data: { error: { message: 'Request setup error' } }, status: HttpStatusCode.InternalServerError });
    }
  }
);

export default axiosInstance;
