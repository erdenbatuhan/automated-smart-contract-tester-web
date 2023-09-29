import axios from '@/api/backend';

const BASE_URL_AUTH = '/auth';

export default {
  signup: (user) => axios.post(`${BASE_URL_AUTH}/signup`, user),
  login: (user) => axios.post(`${BASE_URL_AUTH}/login`, user),
  logout: () => axios.get(`${BASE_URL_AUTH}/logout`)
};
