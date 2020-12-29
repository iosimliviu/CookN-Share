import axios from "axios";

const state = {
  users: []
};

const getters = {
  getUsers: state => state.users,
  getUserById: state => user_id => {
    return state.users.find(user => user.id === user_id);
  }
};

const actions = {
  async fetchUsers({ commit }) {
    const response = await axios.get(`${process.env.API}/api/users`);
    commit("SET_USERS", response.data);
  },
  async deleteUser({ commit }, id) {
    await axios.delete(`${process.env.API}/api/users/${userId}`);
    commit("REMOVE_USER", id);
  }
};

const mutations = {
  SET_USERS: (state, payload) => (state.users = payload),
  REMOVE_USER: (state, id) =>
    (state.users = state.users.filter(users => users.id !== id))
};

export default {
  state,
  getters,
  actions,
  mutations
};
