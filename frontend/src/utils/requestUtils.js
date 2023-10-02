/**
 * Sends a FormData request using Axios.
 *
 * @param {AxiosInstance} axiosInstance - Axios instance for making the request.
 * @param {string} url - The URL to send the request to.
 * @param {string} method - The HTTP method for the request (e.g., 'POST', 'PUT').
 * @param {object} requestFile - The file to include in the FormData.
 * @param {object} [requestBody] - Additional request body parameters.
 * @returns {Promise} A Promise that resolves when the request is complete.
 */
const sendFormDataRequest = (axiosInstance, url, method, requestFile, requestBody) => {
  // Create a FormData object and append the file
  const formData = new window.FormData();
  formData.append(
    requestFile['fieldname'],
    requestFile['buffer'],
    { filename: requestFile['filename'] }
  );

  // Append the request body if provided
  if (requestBody) {
    Object.entries(requestBody).forEach(([key, value]) => {
      if (typeof value === 'string') {
        formData.append(key, value);
      } else if (typeof value === 'object') {
        formData.append(key, JSON.stringify(value));
      }
    });
  }

  // Send the FormData request using Axios
  return axiosInstance.request({
    method,
    maxBodyLength: Infinity,
    url,
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData
  });
};

export default {
  sendFormDataRequest
};
