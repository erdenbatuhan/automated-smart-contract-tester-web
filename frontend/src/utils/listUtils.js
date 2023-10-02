/**
 * Converts an array of objects into an object where the keys are based on a specified property of the objects.
 *
 * @param {Array} items - The array of objects to be converted.
 * @param {string} key - The property name to use as the key for the resulting object.
 * @returns {Object} An object where keys are extracted from the specified property, and values are the original objects.
 */
const objectify = (items, key = '_id') => {
  if (!items || items.length === 0) return items;

  return Object.assign(...items.map((item) => (
    { [item[key]]: item }
  )));
};

/**
 * Adds or updates an item within an array of items based on a specified key property.
 *
 * @param {Array} items - The array of items to be modified.
 * @param {Object} newItem - The item to be added or used for updating.
 * @param {string} key - The property name to use as the key for identifying items.
 * @returns {Array} An updated array of items.
 */
const addOrUpdateItem = (items, newItem, key) => {
  // If the updated item is already in the list, update the list; otherwise, prepend the item to the list
  const idx = items.findIndex((item) => item[key] === newItem[key]);

  if (idx !== -1) {
    items[idx] = newItem;
  } else {
    items.unshift(newItem);
  }

  return items;
};

/**
 * Removes an item from an array of items based on a specified key property.
 *
 * @param {Array} items - The array of items to be modified.
 * @param {Object} deletedItem - The item to be removed.
 * @param {string} key - The property name to use as the key for identifying items.
 * @returns {Array} An updated array of items with the specified item removed.
 */
const removeItem = (items, deletedItem, key) => {
  // Remove the item from the list
  const idx = items.findIndex((item) => item[key] === deletedItem[key]);

  return [
    ...items.slice(0, idx),
    ...items.slice(idx + 1)
  ];
};

export default {
  objectify,
  addOrUpdateItem,
  removeItem
};
