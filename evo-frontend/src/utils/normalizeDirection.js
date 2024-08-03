// src/utils/normalizeDirection.js

/**
 * Normalize a direction to ensure it is within the range of 0-360 degrees.
 * @param {number} direction - The direction to normalize.
 * @returns {number} - The normalized direction.
 */
export const normalizeDirection = (direction) => {
    let newDirection = direction % 360;
    if (newDirection < 0) newDirection += 360;
    return newDirection;
  };
  
  export default normalizeDirection;
  