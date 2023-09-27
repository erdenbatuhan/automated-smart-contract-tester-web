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

export const store = createStore({
  modules: {
    global: GlobalModule,
    user: UserModule
  },
  actions: {
    resetAllStates: ({ commit }) => {
      commit('global/resetState');
      commit('user/resetState');
    },
    makeRequest: ({ commit }, { request, spinner = true }) => {
      if (spinner) commit('global/setSpinner', true);

      return request.catch((err) => {
        commit('global/setAlert', err);
      }).finally(() => {
        if (spinner) commit('global/setSpinner', false);
      });
    }
  },
  plugins: [logger] // Enable the logger as a plugin
});
