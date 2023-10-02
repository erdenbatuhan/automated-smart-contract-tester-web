import { addUsers } from '@/api/backend/services/user';
import projectServices from '@/api/backend/services/project';

import listUtils from '@/utils/listUtils';
import sortingUtils from '@/utils/sortingUtils';

const getInitialState = (previousState) => ({
  _resetCount: previousState ? previousState._resetCount + 1 : 0,
  availableTestExecutionArguments: null,
  projects: null
});

const state = () => getInitialState();

const getters = {
  projectsList: (state) => state.projects ? Object.values(state.projects) : null,
  successfulProjectNames: (state) => state.projects
    ? Object.values(state.projects)
      .filter(({ testStatus }) => testStatus === 'Passed')
      .map(({ projectName }) => projectName)
    : null
};

const actions = {
  fetchAvailableTestExecutionArguments: ({ commit, dispatch }) => {
    commit('setAvailableTestExecutionArguments', null);

    return dispatch('handleRequestPromise', {
      request: projectServices.getAvailableTestExecutionArguments
    }, { root: true })
      .then((testExecutionArguments) => {
        commit('setAvailableTestExecutionArguments', testExecutionArguments);
        return testExecutionArguments;
      })
      .catch(() => {
        commit('setAvailableTestExecutionArguments', []);
      });
  },
  fetchProjects: ({ commit, dispatch }, { spinner } = { spinner: false }) => {
    commit('setProjects', null);

    return dispatch('handleRequestPromise', {
      request: projectServices.getAllProjects,
      spinner
    }, { root: true })
      .then(addUsers)
      .then((projects) => sortingUtils.sortByDate(projects, 'updatedAt'))
      .then((projects) => {
        commit('setProjects', projects);
        return projects;
      })
      .catch(() => {
        commit('setProjects', []);
      });
  },
  uploadProject: ({ rootState, commit, dispatch }, { isEdit, projectUploadPayload }) => (
    dispatch('handleRequestPromise', {
      request: isEdit ? projectServices.uploadExistingProject : projectServices.uploadNewProject,
      payload: projectUploadPayload,
      successMessage: `The ${projectUploadPayload[0]} project has successfully been uploaded!`
    }, { root: true })
      .then(({ project: projectUploaded }) => {
        commit('addOrUpdateProject', {
          project: projectUploaded,
          authenticatedUser: rootState.user.authenticatedUser
        });

        return projectUploaded;
      })
  ),
  updateProjectConfig: ({ rootState, commit, dispatch }, { projectName, projectConfig }) => (
    dispatch('handleRequestPromise', {
      request: projectServices.updateProjectConfig,
      payload: [projectName, projectConfig],
      successMessage: `The config of the ${projectName} project has successfully been updated!`
    }, { root: true })
      .then((projectUpdated) => {
        commit('addOrUpdateProject', {
          project: projectUpdated,
          authenticatedUser: rootState.user.authenticatedUser
        });
        return projectUpdated;
      })
  ),
  deleteProject: ({ commit, dispatch }, deletedProject) => (
    dispatch('handleRequestPromise', {
      request: projectServices.deleteProject,
      payload: [deletedProject.projectName],
      successMessage: `The ${deletedProject.projectName} project has successfully been deleted!`
    }, { root: true })
      .then(() => {
        commit('deleteProject', deletedProject);
        return deletedProject;
      })
  )
};

const mutations = {
  resetState: (state) => {
    Object.assign(state, getInitialState(state));
  },
  setAvailableTestExecutionArguments: (state, availableTestExecutionArguments) => {
    state.availableTestExecutionArguments = availableTestExecutionArguments;
  },
  setProjects: (state, projects) => {
    state.projects = listUtils.objectify(projects);
  },
  addOrUpdateProject: (state, { project, authenticatedUser }) => {
    // If the project is already in the list, delete it first
    if (state.projects[project._id]) {
      delete state.projects[project._id];
    }

    // Set the authenticated user as the deployer and prepend the project to the list
    state.projects = {
      [project._id]: { ...project, deployer: authenticatedUser },
      ...state.projects
    };
  },
  deleteProject: (state, project) => {
    delete state.projects[project._id];
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
