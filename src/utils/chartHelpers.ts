export const formatFieldName = (field: string): string => {
  return field.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());
};
