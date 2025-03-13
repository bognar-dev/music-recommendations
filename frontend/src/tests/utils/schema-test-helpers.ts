import type { SurveyType } from "../../lib/survey-schema";

// Define a recursive type for nested objects
export type RecursivePartial<T> = {
  [P in keyof T]?: T[P] extends (infer U)[]
    ? RecursivePartial<U>[]
    : T[P] extends object
    ? RecursivePartial<T[P]>
    : T[P];
};

/**
 * Creates a modified copy of a survey object with specific changes
 * @param original - The original survey object
 * @param path - Dot notation path to the property to modify (e.g., 'stepOne.step')
 * @param value - The new value to set
 * @returns A new survey object with the specified modification
 */
export function modifySurvey<T extends Record<string, unknown>>(
  original: T,
  path: string,
  value: unknown
): T {
  const result = JSON.parse(JSON.stringify(original));
  const parts = path.split(".");
  let current: Record<string, unknown> = result;

  for (let i = 0; i < parts.length - 1; i++) {
    current = current[parts[i]] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
  return result;
}

/**
 * Creates a survey object with a specified step removed
 * @param original - The original survey object
 * @param stepKey - The key of the step to remove (e.g., 'stepOne')
 * @returns A new survey object with the specified step removed
 */
export function removeStep(
  original: SurveyType,
  stepKey: keyof SurveyType
): Partial<SurveyType> {
  const { [stepKey]: _, ...rest } = JSON.parse(JSON.stringify(original));
  return rest;
}

/**
 * Creates a sample valid song rating object
 * @param id - Optional song ID (defaults to 1)
 * @returns A valid song rating object
 */
export function createValidSongRating(id = 1) {
  return {
    songId: id,
    songName: `Test Song ${id}`,
    rating: Math.random() > 0.5,
  };
}

/**
 * Creates a sample valid model rating object
 * @returns A valid model rating object
 */
export function createValidModelRating() {
  return {
    relevance: Math.floor(Math.random() * 5) + 1,
    novelty: Math.floor(Math.random() * 5) + 1,
    satisfaction: Math.floor(Math.random() * 5) + 1,
  };
}
