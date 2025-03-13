import {
  initialValues,
  modelRatingSchema,
  reviewSchema,
  songRatingSchema,
  stepOneSchema,
  stepSchema,
  stepTenSchema,
  surveySchema,
  SurveyType,
} from "../lib/survey-schema";

import { describe, expect, it } from "vitest";

describe("Song Rating Schema Validation", () => {
  it("should validate a valid song rating", () => {
    const validSongRating = {
      songId: 123,
      songName: "Test Song",
      rating: true,
    };

    const result = songRatingSchema.safeParse(validSongRating);
    expect(result.success).toBeTruthy();
  });

  it("should reject a song rating with missing fields", () => {
    const invalidSongRating = {
      songId: 123,
      // songName is missing
      rating: true,
    };

    const result = songRatingSchema.safeParse(invalidSongRating);
    expect(result.success).toBeFalsy();
  });

  it("should reject a song rating with invalid data types", () => {
    const invalidSongRating = {
      songId: "123", // Should be a number
      songName: "Test Song",
      rating: true,
    };

    const result = songRatingSchema.safeParse(invalidSongRating);
    expect(result.success).toBeFalsy();
  });
});

describe("Model Rating Schema Validation", () => {
  it("should validate a valid model rating", () => {
    const validModelRating = {
      relevance: 4,
      novelty: 5,
      satisfaction: 3,
    };

    const result = modelRatingSchema.safeParse(validModelRating);
    expect(result.success).toBeTruthy();
  });

  it("should apply default values for missing fields", () => {
    const partialModelRating = {};

    const result = modelRatingSchema.safeParse(partialModelRating);
    expect(result.success).toBeTruthy();

    if (result.success) {
      expect(result.data.relevance).toBe(1);
      expect(result.data.novelty).toBe(1);
      expect(result.data.satisfaction).toBe(1);
    }
  });

  it("should reject ratings outside the allowed range", () => {
    const invalidModelRating = {
      relevance: 6, // Should be max 5
      novelty: 3,
      satisfaction: 0, // Should be min 1
    };

    const result = modelRatingSchema.safeParse(invalidModelRating);
    expect(result.success).toBeFalsy();
  });

  it("should reject non-integer ratings", () => {
    const invalidModelRating = {
      relevance: 3.5, // Should be an integer
      novelty: 4,
      satisfaction: 2,
    };

    const result = modelRatingSchema.safeParse(invalidModelRating);
    expect(result.success).toBeFalsy();
  });
});

describe("Step Schema Validation", () => {
  it("should validate a valid step", () => {
    const validStep = {
      step: 3,
      seedSongId: "song123",
      modelId: "model1",
      songRatings: [],
      modelRating: { relevance: 4, novelty: 3, satisfaction: 5 },
    };

    const result = stepSchema.safeParse(validStep);
    expect(result.success).toBeTruthy();
  });

  it("should apply default empty array for songRatings", () => {
    const stepWithoutRatings = {
      step: 2,
      seedSongId: "song123",
      modelId: "model1",
      modelRating: { relevance: 3, novelty: 3, satisfaction: 3 },
    };

    const result = stepSchema.safeParse(stepWithoutRatings);
    expect(result.success).toBeTruthy();

    if (result.success) {
      expect(Array.isArray(result.data.songRatings)).toBeTruthy();
      expect(result.data.songRatings.length).toBe(0);
    }
  });

  it("should reject a step with invalid step number", () => {
    const invalidStep = {
      step: 11, // Out of range (1-10)
      seedSongId: "song123",
      modelId: "model1",
      songRatings: [],
      modelRating: { relevance: 4, novelty: 3, satisfaction: 5 },
    };

    const result = stepSchema.safeParse(invalidStep);
    expect(result.success).toBeFalsy();
  });

  it("should reject a step with missing required fields", () => {
    const invalidStep = {
      step: 3,
      // seedSongId is missing
      modelId: "model1",
      songRatings: [],
      modelRating: { relevance: 4, novelty: 3, satisfaction: 5 },
    };

    const result = stepSchema.safeParse(invalidStep);
    expect(result.success).toBeFalsy();
  });
});

describe("Review Schema Validation", () => {
  it("should validate a valid review", () => {
    const validReview = {
      step: 10,
      age: 25,
      country: "USA",
      preference: "model2",
      feedback: "Great experience!",
    };

    const result = reviewSchema.safeParse(validReview);
    expect(result.success).toBeTruthy();
  });

  it("should reject a review with age below minimum", () => {
    const invalidReview = {
      step: 10,
      age: 12, // Below minimum age of 13
      country: "USA",
      preference: "model1",
      feedback: "Great experience!",
    };

    const result = reviewSchema.safeParse(invalidReview);
    expect(result.success).toBeFalsy();

    if (!result.success) {
      const ageError = result.error.issues.find((issue) =>
        issue.path.includes("age")
      );
      expect(ageError).toBeDefined();
    }
  });

  it("should reject a review with age above maximum", () => {
    const invalidReview = {
      step: 10,
      age: 121, // Above maximum age of 120
      country: "USA",
      preference: "model1",
      feedback: "Great experience!",
    };

    const result = reviewSchema.safeParse(invalidReview);
    expect(result.success).toBeFalsy();
  });

  it("should reject a review with invalid model preference", () => {
    const invalidReview = {
      step: 10,
      age: 30,
      country: "USA",
      preference: "model4", // Invalid preference
      feedback: "Great experience!",
    };

    const result = reviewSchema.safeParse(invalidReview);
    expect(result.success).toBeFalsy();
  });

  it("should reject a review with too long feedback", () => {
    const invalidReview = {
      step: 10,
      age: 30,
      country: "USA",
      preference: "model2",
      feedback: "a".repeat(501), // Exceeds 500 character limit
    };

    const result = reviewSchema.safeParse(invalidReview);
    expect(result.success).toBeFalsy();
  });
});

describe("Step-Specific Schema Validation", () => {
  it("should validate a valid stepOne", () => {
    const validStepOne = {
      step: 1,
      seedSongId: "song123",
      modelId: "model1",
      songRatings: [],
      modelRating: { relevance: 4, novelty: 3, satisfaction: 5 },
    };

    const result = stepOneSchema.safeParse(validStepOne);
    expect(result.success).toBeTruthy();
  });

  it("should reject stepOne with incorrect step number", () => {
    const invalidStepOne = {
      step: 2, // Should be 1 for stepOneSchema
      seedSongId: "song123",
      modelId: "model1",
      songRatings: [],
      modelRating: { relevance: 4, novelty: 3, satisfaction: 5 },
    };

    const result = stepOneSchema.safeParse(invalidStepOne);
    expect(result.success).toBeFalsy();
  });

  it("should validate a valid stepTen (review)", () => {
    const validStepTen = {
      step: 10,
      age: 25,
      country: "USA",
      preference: "model2",
      feedback: "Great experience!",
    };

    const result = stepTenSchema.safeParse(validStepTen);
    expect(result.success).toBeTruthy();
  });
});

describe("Complete Survey Schema Validation", () => {
  it("should validate a complete valid survey", () => {
    // Using the initialValues as a base for a valid survey
    const validSurvey: SurveyType = JSON.parse(JSON.stringify(initialValues));

    const result = surveySchema.safeParse(validSurvey);
    expect(result.success).toBeTruthy();
  });

  it("should reject a survey with missing steps", () => {
    // Create an incomplete survey missing stepThree
    const incompleteSurvey = JSON.parse(JSON.stringify(initialValues));
    delete incompleteSurvey.stepThree; // Actually remove the stepThree property

    const result = surveySchema.safeParse(incompleteSurvey);
    expect(result.success).toBeFalsy();
  });

  it("should reject a survey with invalid step data", () => {
    // Create a survey with invalid stepOne
    const invalidSurvey = JSON.parse(JSON.stringify(initialValues));
    invalidSurvey.stepOne.step = 2; // Should be 1

    const result = surveySchema.safeParse(invalidSurvey);
    expect(result.success).toBeFalsy();
  });

  it("should reject a survey with invalid review data", () => {
    // Create a survey with invalid review
    const invalidSurvey = JSON.parse(JSON.stringify(initialValues));
    invalidSurvey.review.age = 10; // Below minimum age

    const result = surveySchema.safeParse(invalidSurvey);
    expect(result.success).toBeFalsy();
  });
});
