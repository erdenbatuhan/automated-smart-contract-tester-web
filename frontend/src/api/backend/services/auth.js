import axios from '@/api/backend';

const AUTH_BASE_URL = `/auth`;

export default {
  signup: (user) => axios.post(`${AUTH_BASE_URL}/signup`, user),
  login: (user) => axios.post(`${AUTH_BASE_URL}/login`, user),
  logout: () => axios.get(`${AUTH_BASE_URL}/logout`)
};
