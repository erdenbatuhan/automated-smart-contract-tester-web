import axios from '@/api/backend';

import requestUtils from "@/utils/request-utils";

export const BASE_URL_PROJECTS = `/projects`;

const uploadProject = (method) => (projectName, requestFile, requestBodies) => requestUtils
  .sendFormDataRequest(axios, `${BASE_URL_PROJECTS}/${projectName}/upload`, method, requestFile, requestBodies);

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
