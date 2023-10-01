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

const removeItem = (items, deletedItem, key) => {
  // Remove the item from the list
  const idx = items.findIndex((item) => item[key] === deletedItem[key]);

  return [
    ...items.slice(0, idx),
    ...items.slice(idx + 1)
  ];
};

export default {
  addOrUpdateItem,
  removeItem
};
