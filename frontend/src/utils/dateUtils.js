/**
 * Formats a date string into a human-readable date and time format.
 *
 * @param {string} dateString - The date string to be formatted.
 * @returns {string} A formatted date and time string.
 */
const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  };

  return new Date(dateString).toLocaleString(undefined, options);
};

export default {
  formatDate
};
