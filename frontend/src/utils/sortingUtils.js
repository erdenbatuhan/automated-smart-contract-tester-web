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
