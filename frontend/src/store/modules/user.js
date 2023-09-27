import authServices from '@/api/backend/services/auth';

const getInitialState = (previousState) => ({
  _resetCount: previousState ? previousState._resetCount + 1 : 0,
  authenticatedUser: null
});

const state = () => getInitialState();

const getters = {
  isUserLoggedIn: (state) => !!state.authenticatedUser
};

const actions = {
  signup: ({ commit, dispatch }, user) => dispatch('makeRequest', { request: authServices.signup(user) }, { root: true })
    .then(({ user }) => commit('setAuthenticatedUser', user)),
  login: ({ commit, dispatch }, user) => dispatch('makeRequest', { request: authServices.login(user) }, { root: true })
    .then(({ user }) => commit('setAuthenticatedUser', user)),
  logout: ({ commit, dispatch }) => dispatch('makeRequest', { request: authServices.logout() }, { root: true })
    .then(() => commit('setAuthenticatedUser', null))
};

const mutations = {
  resetState: (state) => {
    Object.assign(state, getInitialState(state));
  },
  setAuthenticatedUser(state, authenticatedUser) {
    state.authenticatedUser = authenticatedUser;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
