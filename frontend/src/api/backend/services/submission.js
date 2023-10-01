import axios from '@/api/backend';

import { BASE_URL_PROJECTS } from '@/api/backend/services/project';

import requestUtils from '@/utils/requestUtils';

const BASE_URL_SUBMISSIONS = (projectName) => `${BASE_URL_PROJECTS}/${projectName}/submissions`;

export default {
  getAllSubmissions: (projectName) => axios.get(`${BASE_URL_SUBMISSIONS(projectName)}`),
  getSubmission: (projectName, submissionId) => axios.get(`${BASE_URL_SUBMISSIONS(projectName)}/${submissionId}`),
  uploadSubmission: (projectName, requestFile) => requestUtils
    .sendFormDataRequest(axios, BASE_URL_SUBMISSIONS(projectName), 'POST', requestFile),
  downloadSubmission: (projectName, submissionId) => axios.get(
    `${BASE_URL_SUBMISSIONS(projectName)}/${submissionId}/download`, { responseType: 'blob' }),
  deleteSubmission: (projectName, submissionId) => axios.delete(`${BASE_URL_SUBMISSIONS(projectName)}/${submissionId}`)
};
