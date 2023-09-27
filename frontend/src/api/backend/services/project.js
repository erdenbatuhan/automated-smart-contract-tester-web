import axios from '@/api/backend';

const PROJECTS_BASE_URL = `/projects`;

export default {
  getAvailableTestExecutionArguments: () => axios.get(`${PROJECTS_BASE_URL}/descriptions/test-execution-arguments`),
  getAllProjects: () => axios.get(`${PROJECTS_BASE_URL}`)
};
