import { createStore, createLogger } from 'vuex';

import GlobalModule from './modules/global';
import UserModule from './modules/user';

const logger = createLogger({
  collapsed: false, // Whether to collapse log groups by default
  filter: (mutation, stateBefore, stateAfter) => true, // Customize which mutations to log (return true to log)
  transformer: (state) => state, // Customize how state is logged (e.g., transform state data)
  mutationTransformer: (mutation) => mutation, // Customize how mutations are logged (e.g., transform mutation data)
  logActions: true, // Whether to log actions
  logMutations: true // Whether to log mutations
});

const store = createStore({
  modules: {
    global: GlobalModule,
    user: UserModule
  },
  actions: {
    resetAllStates: ({ commit }) => {
      commit('global/resetState');
      commit('user/resetState');
    },
    makeRequest: ({ commit }, { request, successMessage = 'Request successful!', ignoreError = false, spinner = true }) => {
      if (spinner) commit('global/setSpinner', true);

      return request
        .then((response) => {
          commit('global/setAlert', { ...response, data: { message: successMessage } });
          return response.data;
        }).catch((err) => {
          if (ignoreError) return;

          commit('global/setAlert', err);
          return Promise.reject(err);
        }).finally(() => {
          if (spinner) commit('global/setSpinner', false);
        });
    }
  },
  plugins: [logger] // Enable the logger as a plugin
});

export default store;
