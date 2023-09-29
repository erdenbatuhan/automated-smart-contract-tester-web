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

export default { sendFormDataRequest };
