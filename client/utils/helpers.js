export const onlyFloatNumber = (value, maxLength) => {
  const v = value.replace(/\s+/g, "").replace(/[^0-9.]/gi, "");
  const formatted = maxLength ? v.slice(0, maxLength) : v;
  return formatted;
};
