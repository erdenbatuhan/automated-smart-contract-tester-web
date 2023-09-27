import axios from '@/api/backend';

const BASE_URL_USERS = `/users`;

export default {
  getAllUsers: () => axios.get(`${BASE_URL_USERS}`),
  getUser: (userId) => axios.get(`${BASE_URL_USERS}/${userId}`),
  removeUser: (userId) => axios.delete(`${BASE_URL_USERS}/${userId}`)
};
