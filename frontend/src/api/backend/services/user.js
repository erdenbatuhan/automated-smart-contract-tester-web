import axios from '@/api/backend';

const BASE_URL_USERS = '/users';

const getUsers = (userIds) => axios.get(`${BASE_URL_USERS}?ids=${userIds?.join(',') ?? ''}`)
  .then((response) => {
    response.data = Object.assign(...response.data.map((user) => (
      { [user._id]: user }
    )));

    return response;
  });

const getUser = (userId) => axios.get(`${BASE_URL_USERS}/${userId}`);

const removeUser = (userId) => axios.delete(`${BASE_URL_USERS}/${userId}`);

export const addDeployerEmailsToData = (data) => {
  const userIds = data.map(({ deployer }) => deployer);
  const distinctUserIds = [...new Set(userIds)];

  // Fetch the users listed in the project as deployers, then add deployer emails to the project
  return getUsers(distinctUserIds).then(({ data: users }) => (
    data.map((item) => {
      item['deployer'] = users[item['deployer']];
      return item;
    })
  ));
};

export default {
  getUsers,
  getUser,
  removeUser
};
