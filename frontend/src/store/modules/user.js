import authServices from '@/api/backend/services/auth';

const getInitialState = (previousState) => ({
  _resetCount: previousState ? previousState._resetCount + 1 : 0,
  authenticatedUser: localStorage.getItem('authenticatedUser') && JSON.parse(localStorage.getItem('authenticatedUser'))
});

const state = () => getInitialState();

const getters = {
  isLoggedIn: (state) => state.authenticatedUser && state.authenticatedUser.role === "User",
  isLoggedInAsAdmin: (state) => state.authenticatedUser && state.authenticatedUser.role === "Admin"
};

const actions = {
  signup: ({ commit, dispatch }, user) => {
    const request = authServices.signup(user);
    const successMessage =  `Successfully signed up as ${user.email}.`;

    return dispatch('makeRequest', { request, successMessage }, { root: true })
      .then(({user}) => commit('setAuthenticatedUser', user));
  },
  login: ({ commit, dispatch }, user) => {
    const request = authServices.login(user);
    const successMessage = `Successfully logged in as ${user.email}.`;

    return dispatch('makeRequest', { request, successMessage }, { root: true })
      .then(({user}) => commit('setAuthenticatedUser', user));
  },
  logout: ({ state, commit, dispatch }) => {
    const request = authServices.logout();
    const successMessage = `Successfully signed out from ${state.authenticatedUser.email}.`;

    return dispatch('makeRequest', { request, successMessage, ignoreError: true }, { root: true })
      .finally(() => commit('removeAuthenticatedUser'));
  }
};

const mutations = {
  resetState: (state) => {
    Object.assign(state, getInitialState(state));
  },
  setAuthenticatedUser(state, authenticatedUser) {
    state.authenticatedUser = authenticatedUser;
    localStorage.setItem('authenticatedUser', JSON.stringify(authenticatedUser));
  },
  removeAuthenticatedUser(state) {
    state.authenticatedUser = null;
    localStorage.removeItem('authenticatedUser');
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
