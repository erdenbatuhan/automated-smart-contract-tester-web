const FormData = require('form-data');

const sendFormDataRequest = (axiosInstance, url, method, requestFile, requestBodies) => {
  // Create a FormData object and append the file
  const formData = new FormData();
  formData.append(
    requestFile['fieldname'],
    requestFile['buffer'],
    { filename: requestFile['filename'] }
  );

  // Append the request bodies if provided
  if (requestBodies) {
    Object.entries(requestBodies).forEach(([key, obj]) => {
      formData.append(key, JSON.stringify(obj));
    });
  }

  // Send the FormData request using Axios
  return axiosInstance.request({
    method,
    maxBodyLength: Infinity,
    url,
    headers: { ...formData.getHeaders() },
    data: formData
  });
};

export default { sendFormDataRequest };
