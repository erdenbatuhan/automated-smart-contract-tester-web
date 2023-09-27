const getInitialState = (previousState) => ({
  _resetCount: previousState ? previousState._resetCount + 1 : 0,
  alert: null,
  spinner: false
});

const state = () => getInitialState();

const getters = {
  alert: (state) => state.alert,
  spinner: (state) => state.spinner
};

const actions = {};

const mutations = {
  resetState: (state) => {
    Object.assign(state, getInitialState(state));
  },
  setAlert: (state, alert) => {
    state.alert = alert;
  },
  setSpinner: (state, spinner) => {
    state.spinner = spinner;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
