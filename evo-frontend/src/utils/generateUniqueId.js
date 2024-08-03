let uniqueIdCounter = 0;

export const generateUniqueId = () => {
  uniqueIdCounter += 1;
  return `_${uniqueIdCounter.toString(36) + Math.random().toString(36).substr(2, 9)}`;
};