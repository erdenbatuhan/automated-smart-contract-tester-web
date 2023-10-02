import { createStore, createLogger } from 'vuex';

import GlobalModule from './modules/global';
import UserModule from './modules/user';
import ProjectModule from './modules/project';

const logger = createLogger({
  collapsed: false, // Whether to collapse log groups by default
  filter: (/* mutation, stateBefore, stateAfter */) => true, // Customize which mutations to log (return true to log)
  transformer: (state) => state, // Customize how state is logged (e.g., transform state project)
  mutationTransformer: (mutation) => mutation, // Customize how mutations are logged (e.g., transform mutation project)
  logActions: true, // Whether to log actions
  logMutations: true // Whether to log mutations
});

const store = createStore({
  modules: {
    global: GlobalModule,
    user: UserModule,
    project: ProjectModule
  },
  actions: {
    resetAllStates: ({ commit }) => {
      commit('global/resetState');
      commit('project/resetState');
      commit('user/resetState');
    },
    handleRequestPromise: async ({ commit }, { requestPromise, successMessage, spinner = true, ignoreError = false, delay }) => {
      if (spinner) commit('global/setSpinner', true);
      if (delay) await new Promise((resolve) => setTimeout(() => resolve(), delay));

      return requestPromise
        .then((response) => {
          if (successMessage) commit('global/setAlert', { ...response, data: successMessage });
          return response.data;
        }).catch((err) => {
          if (ignoreError) return;

          commit('global/setAlert', err);
          return Promise.reject(err);
        }).finally(() => {
          if (spinner) commit('global/setSpinner', false);
        });
    }
  }
  // plugins: [logger] // Enable the logger as a plugin
});

export default store;
