/**
 * Capitalizes the first character of a string.
 *
 * @param {string} str - The input string.
 * @returns {string} A new string with the first character capitalized.
 */
const capitalizeString = (str) => str && str.charAt(0).toUpperCase() + str.slice(1);

export default {
  capitalizeString
};
