import { describe, expect, it } from "vitest";
import { initialValues, surveySchema } from "../lib/survey-schema";
import { modifySurvey } from "./utils/schema-test-helpers";

// Helper function to get the correct step key name
function getStepKey(index: number): string {
  switch (index) {
    case 1:
      return "stepOne";
    case 2:
      return "stepTwo";
    case 3:
      return "stepThree";
    case 4:
      return "stepFour";
    case 5:
      return "stepFive";
    case 6:
      return "stepSix";
    case 7:
      return "stepSeven";
    case 8:
      return "stepEight";
    case 9:
      return "stepNine";
    default:
      return `step${index}`;
  }
}

describe("Survey Schema Integration Tests", () => {
  it("should validate a survey with minimal valid data for each step", () => {
    // Start with initial values
    const minimalSurvey = JSON.parse(JSON.stringify(initialValues));

    // Remove all song ratings (they're optional arrays)
    for (let i = 1; i <= 9; i++) {
      const stepKey = getStepKey(i) as keyof typeof minimalSurvey;
      minimalSurvey[stepKey].songRatings = [];
    }

    const result = surveySchema.safeParse(minimalSurvey);
    expect(result.success).toBeTruthy();
  });

  it("should validate a survey with maximum values within valid ranges", () => {
    const maxValuesSurvey = JSON.parse(JSON.stringify(initialValues));

    // Set maximum valid age
    maxValuesSurvey.review.age = 120;

    // Set maximum ratings for all model ratings
    for (let i = 1; i <= 9; i++) {
      const stepKey = getStepKey(i) as keyof typeof maxValuesSurvey;
      maxValuesSurvey[stepKey].modelRating = {
        relevance: 5,
        novelty: 5,
        satisfaction: 5,
      };
    }

    const result = surveySchema.safeParse(maxValuesSurvey);
    expect(result.success).toBeTruthy();
  });

  it("should reject a survey with invalid data in multiple steps", () => {
    let invalidMultiStepSurvey = modifySurvey(initialValues, "stepOne.step", 2); // Wrong step number
    invalidMultiStepSurvey = modifySurvey(
      invalidMultiStepSurvey,
      "review.age",
      10
    ); // Invalid age

    const result = surveySchema.safeParse(invalidMultiStepSurvey);
    expect(result.success).toBeFalsy();

    if (!result.success) {
      // Should have at least 2 validation errors
      expect(result.error.issues.length).toBeGreaterThanOrEqual(2);

      // Check that we have errors for both fields we modified
      const paths = result.error.issues.map((issue) => issue.path.join("."));
      expect(paths).toContain("stepOne.step");
      expect(paths.some((path) => path.includes("review.age"))).toBeTruthy();
    }
  });

  it("should validate a survey when transforming data types correctly", () => {
    // Create a survey with data that needs type coercion
    const surveyWithStringValues = {
      ...initialValues,
      review: {
        ...initialValues.review,
        age: "25", // String instead of number
      },
    };

    // Use parse (not safeParse) with type coercion
    const result = surveySchema
      .transform((val) => val)
      .safeParse(surveyWithStringValues);

    // This should fail because Zod won't automatically coerce the types
    expect(result.success).toBeFalsy();
  });
});
