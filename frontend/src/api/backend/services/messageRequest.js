import axios from '@/api/backend';

const BASE_URL_MESSAGE_REQUESTS = `/message-requests`;

export default {
  getAllMessageRequests: () => axios.get(`${BASE_URL_MESSAGE_REQUESTS}`),
  getMessageRequest: (messageRequestId) => axios.get(`${BASE_URL_MESSAGE_REQUESTS}/${messageRequestId}`)
};
