import axios from '@/api/backend';

import listUtils from '@/utils/listUtils';

const BASE_URL_USERS = '/users';

const getUsers = (userIds) => axios.get(`${BASE_URL_USERS}?ids=${userIds?.join(',') ?? ''}`);
const getUser = (userId) => axios.get(`${BASE_URL_USERS}/${userId}`);
const removeUser = (userId) => axios.delete(`${BASE_URL_USERS}/${userId}`);

/**
 * Adds users to an array of data based on their IDs.
 *
 * @param {Array} arr - The array of data to which users will be added.
 * @param {string} [userKey='deployer'] - The key that represents the user in each data object.
 * @returns {Promise<Array>} A promise that resolves to the updated array of data with users added.
 */
export const addUsers = (arr, userKey = 'deployer') => {
  const userIds = arr.map(({ deployer }) => deployer);
  const distinctUserIds = [...new Set(userIds)];

  // Check if there are any users to fetch
  if (distinctUserIds.length === 0) return Promise.resolve(arr);

  // Fetch the users listed in the data
  return getUsers(distinctUserIds).then(({ data: users }) => {
    const usersObjectified = listUtils.objectify(users);

    return arr.map((item) => {
      item[userKey] = usersObjectified[item[userKey]];
      return item;
    });
  });
};

export default {
  getUsers,
  getUser,
  removeUser
};
