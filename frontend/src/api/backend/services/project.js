import axios from '@/api/backend';

import requestUtils from '@/utils/requestUtils';

export const BASE_URL_PROJECTS = '/projects';

const uploadProject = (method) => (projectName, file = {}, requestBody = {}) => {
  const projectNameFormatted = projectName.toLowerCase().replace(/\s+/g, '');
  const requestFile = {
    fieldname: 'projectZip',
    buffer: file,
    filename: file.name
  };

  return requestUtils
    .sendFormDataRequest(axios, `${BASE_URL_PROJECTS}/${projectNameFormatted}/upload`, method, requestFile, requestBody);
};

export default {
  getAvailableTestExecutionArguments: () => axios.get(`${BASE_URL_PROJECTS}/descriptions/test-execution-arguments`),
  getAllProjects: () => axios.get(`${BASE_URL_PROJECTS}`),
  getProject: (projectName) => axios.get(`${BASE_URL_PROJECTS}/${projectName}`),
  uploadNewProject: uploadProject('POST'),
  uploadExistingProject: uploadProject('PUT'),
  updateProjectConfig: (projectName, requestBody) => axios.put(`${BASE_URL_PROJECTS}/${projectName}/update`, requestBody),
  downloadProject: (projectName) => axios.get(`${BASE_URL_PROJECTS}/${projectName}/download`),
  deleteProject: (projectName) => axios.delete(`${BASE_URL_PROJECTS}/${projectName}`)
};
