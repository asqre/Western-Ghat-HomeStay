export const filterObject = (object, keys) => {
  const filteredObject = {};
  Object.keys(object).forEach((key) => {
    if (!keys.includes(key)) {
      filteredObject[key] = object[key];
    }
  });
  return filteredObject;
}