export const reviver = (key: string, value: any) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.assign(Object.create(null), value);
  }
  return value;
};
