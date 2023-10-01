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
