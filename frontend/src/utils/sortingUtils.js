/**
 * Sorts a list of objects by a date field in descending order.
 *
 * @param {Array} lst - The list of objects to sort.
 * @param {string} dateFieldName - The name of the date field to use for sorting.
 * @returns {Array} A new array containing the sorted objects.
 */
const sortByDate = (lst, dateFieldName) => {
  lst.sort((a, b) => {
    const dateA = new Date(a[dateFieldName]);
    const dateB = new Date(b[dateFieldName]);

    return dateB - dateA;
  });

  return lst;
};

export default {
  sortByDate
};
