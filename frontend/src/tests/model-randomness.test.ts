import { Song } from "../db/schema";
import { beforeEach, describe, expect, it } from "vitest";
import { shuffleModels } from "../utils/shuffle";

describe("Model Shuffling Tests", () => {
  // Unit tests for the shuffle function
  describe("shuffleModels function", () => {
    it("should maintain the same elements after shuffling", () => {
      const models = ["model1", "model2", "model3"];
      const shuffled = shuffleModels([...models]);

      expect(shuffled).toHaveLength(models.length);
      expect(shuffled.sort()).toEqual(models.sort());
    });

    it("should handle empty arrays", () => {
      const emptyArray: string[] = [];
      expect(shuffleModels(emptyArray)).toEqual([]);
    });

    it("should handle single element arrays", () => {
      const singleElement = ["model1"];
      expect(shuffleModels(singleElement)).toEqual(singleElement);
    });
  });

  // Statistical tests for randomness
  describe("Randomness of model shuffling", () => {
    it("should produce a uniform distribution of all possible permutations", () => {
      const models = ["A", "B", "C", "D"]; // 4 models = 24 possible permutations
      const iterations = 24000; // Run many iterations to ensure statistical significance
      const permutationCounts: Record<string, number> = {};

      // Initialize counts for all permutations
      // Running the shuffle many times
      for (let i = 0; i < iterations; i++) {
        const shuffled = shuffleModels([...models]);
        const permKey = shuffled.join(",");

        if (!permutationCounts[permKey]) {
          permutationCounts[permKey] = 0;
        }
        permutationCounts[permKey]++;
      }

      // Check number of unique permutations (should be factorial(4) = 24)
      const uniquePermutations = Object.keys(permutationCounts).length;
      expect(uniquePermutations).toBe(24); // 4! = 24 possible permutations

      // Expected count for each permutation with perfect distribution
      const expectedCount = iterations / 24;

      // Chi-square test for uniformity
      let chiSquareValue = 0;
      Object.values(permutationCounts).forEach((count) => {
        chiSquareValue += Math.pow(count - expectedCount, 2) / expectedCount;
      });

      // For 23 degrees of freedom (24-1) at 95% confidence, chi-square critical value is ~35.17
      // If chiSquareValue < 35.17, then the distribution is likely uniform
      expect(chiSquareValue).toBeLessThan(35.17);

      // Additionally, ensure no permutation is more than 20% off from expected
      Object.values(permutationCounts).forEach((count) => {
        const deviation = Math.abs(count - expectedCount) / expectedCount;
        expect(deviation).toBeLessThan(0.2);
      });
    });

    it("should produce unique order each time with high probability", () => {
      const models = ["A", "B", "C", "D", "E"];
      const runs = 100;
      const results: string[] = [];

      for (let i = 0; i < runs; i++) {
        const shuffled = shuffleModels([...models]);
        results.push(shuffled.join(","));
      }

      // Count unique arrangements
      const uniqueResults = new Set(results).size;

      // Due to the birthday paradox, with 5! = 120 possible permutations and 100 runs,
      // we statistically expect around 65-75 unique results (not 90+)
      // For more details on the birthday problem: https://en.wikipedia.org/wiki/Birthday_problem
      expect(uniqueResults).toBeGreaterThan(60);
    });

    // Add a more comprehensive uniqueness test with more runs
    it("should approach maximum possible permutations with larger sample sizes", () => {
      const models = ["A", "B", "C", "D"]; // 4! = 24 permutations
      const runs = 1000; // Many more runs than permutations
      const results: string[] = [];

      for (let i = 0; i < runs; i++) {
        const shuffled = shuffleModels([...models]);
        results.push(shuffled.join(","));
      }

      const uniqueResults = new Set(results).size;

      // With 1000 runs and only 24 possible permutations,
      // we should see nearly all possible permutations
      expect(uniqueResults).toBeGreaterThanOrEqual(23); // Allow for at most 1 missing
    });
  });

  // Integration tests with Song objects
  describe("Integration with Song objects", () => {
    let songModels: Song[];

    beforeEach(() => {
      // Create sample Song objects
      songModels = [
        { id: "1", name: "Song 1" },
        { id: "2", name: "Song 2" },
        { id: "3", name: "Song 3" },
        { id: "4", name: "Song 4" },
      ] as unknown as Song[];
    });

    it("should properly shuffle an array of Song objects", () => {
      const shuffled = shuffleModels([...songModels]);

      // Verify length is maintained
      expect(shuffled).toHaveLength(songModels.length);

      // Verify all songs are included, comparing by ID
      const originalIds = songModels.map((song) => song.id).sort();
      const shuffledIds = shuffled.map((song) => song.id).sort();
      expect(shuffledIds).toEqual(originalIds);
    });

    it("should maintain object references after shuffling", () => {
      const shuffled = shuffleModels([...songModels]);

      // Check that each object in shuffled array is one of the original objects
      shuffled.forEach((song) => {
        const originalSong = songModels.find((s) => s.id === song.id);
        expect(song).toBe(originalSong);
      });
    });
  });

  // Focused randomness test for recommended songs order
  describe("Randomness in recommended songs order", () => {
    it("should distribute first position equally among all songs over many iterations", () => {
      // Mock songs for testing
      const songs = [
        { id: "1", name: "Song 1" },
        { id: "2", name: "Song 2" },
        { id: "3", name: "Song 3" },
        { id: "4", name: "Song 4" },
      ];

      const iterations = 10000;
      const firstPositionCounts: Record<string, number> = {
        "1": 0,
        "2": 0,
        "3": 0,
        "4": 0,
      };

      // Count how many times each song appears first
      for (let i = 0; i < iterations; i++) {
        const shuffled = shuffleModels([...songs]);
        const firstSongId = shuffled[0].id;
        firstPositionCounts[firstSongId]++;
      }

      // Expected count for each song in first position with perfect distribution
      const expectedCount = iterations / songs.length;

      // Apply chi-square test
      let chiSquareValue = 0;
      Object.values(firstPositionCounts).forEach((count) => {
        chiSquareValue += Math.pow(count - expectedCount, 2) / expectedCount;
      });

      // For 3 degrees of freedom (4-1) at 95% confidence, chi-square critical value is ~7.81
      expect(chiSquareValue).toBeLessThan(7.81);

      // Each song should be first approximately 25% of the time
      Object.values(firstPositionCounts).forEach((count) => {
        const percentage = count / iterations;
        expect(percentage).toBeCloseTo(0.25, 1);
      });
    });
  });
});
