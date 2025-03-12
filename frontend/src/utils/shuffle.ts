/**
 * Fisher-Yates shuffle algorithm to randomly reorder array elements
 * This algorithm provides a truly random shuffle with equal probability
 * for all possible permutations
 *
 * @param array The array to shuffle (will not be modified)
 * @returns A new shuffled array
 */
export function shuffleModels<T>(array: T[]): T[] {
  // Create a copy of the array to avoid modifying the original
  const result = [...array];

  // Fisher-Yates algorithm
  for (let i = result.length - 1; i > 0; i--) {
    // Generate a random index from 0 to i
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and j
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

/**
 * Tests if the shuffle algorithm is properly random by running
 * multiple iterations and analyzing the distribution
 *
 * @param elements Array of elements to shuffle
 * @param iterations Number of iterations to run
 * @returns Object containing distribution statistics
 */
export function testShuffleRandomness<T>(
  elements: T[],
  iterations: number = 10000
) {
  const permutationCounts: Record<string, number> = {};

  for (let i = 0; i < iterations; i++) {
    const shuffled = shuffleModels([...elements]);
    // Use JSON stringify to create a unique key for each permutation
    const permKey = JSON.stringify(shuffled);

    permutationCounts[permKey] = (permutationCounts[permKey] || 0) + 1;
  }

  // Calculate statistics
  const uniquePermutations = Object.keys(permutationCounts).length;
  const expectedCount = iterations / uniquePermutations;

  let chiSquareValue = 0;
  let maxDeviation = 0;

  Object.values(permutationCounts).forEach((count) => {
    const deviation = Math.abs(count - expectedCount) / expectedCount;
    maxDeviation = Math.max(maxDeviation, deviation);
    chiSquareValue += Math.pow(count - expectedCount, 2) / expectedCount;
  });

  return {
    uniquePermutations,
    expectedCount,
    chiSquareValue,
    maxDeviation,
    isRandom: chiSquareValue < (uniquePermutations - 1) * 3.84, // Approximate critical value
  };
}
