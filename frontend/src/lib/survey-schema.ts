import z from 'zod';

// Define common types that are reused
const songRatingSchema = z.object({
  songId: z.number(),
  songName: z.string(),
  rating: z.boolean()
});

const modelRatingSchema = z.object({
  relevance: z.number().min(1).max(5).int().default(1),
  novelty: z.number().min(1).max(5).int().default(1),
  satisfaction: z.number().min(1).max(5).int().default(1)
});

// Define each step schema separately
export const stepSchema = z.object({
  step: z.number().min(1).max(10), 
  seedSongId: z.number().min(1).max(3),
  modelId: z.string(),
  songRatings: z.array(songRatingSchema).default([]),
  modelRating: modelRatingSchema
});

export const reviewSchema = z.object({
  step: z.literal(10),
  age: z.number().int().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age"),
  country: z.string().min(1, "Country is required"),
  preference: z.enum(["model1", "model2", "model3"], {
    required_error: "Please select a preferred model",
  }),
  feedback: z.string().max(500, "Feedback must be less than 500 characters"),
});

// Step schemas remain the same
export const stepOneSchema = stepSchema.extend({ step: z.literal(1) });
export const stepTwoSchema = stepSchema.extend({ step: z.literal(2) });
export const stepThreeSchema = stepSchema.extend({ step: z.literal(3) });
export const stepFourSchema = stepSchema.extend({ step: z.literal(4) });
export const stepFiveSchema = stepSchema.extend({ step: z.literal(5) });
export const stepSixSchema = stepSchema.extend({ step: z.literal(6) });
export const stepSevenSchema = stepSchema.extend({ step: z.literal(7) });
export const stepEightSchema = stepSchema.extend({ step: z.literal(8) });
export const stepNineSchema = stepSchema.extend({ step: z.literal(9) });
export const stepTenSchema = reviewSchema;

export const surveySchema = z.object({
  stepOne: stepOneSchema,
  stepTwo: stepTwoSchema,
  stepThree: stepThreeSchema,
  stepFour: stepFourSchema,
  stepFive: stepFiveSchema,
  stepSix: stepSixSchema,
  stepSeven: stepSevenSchema,
  stepEight: stepEightSchema,
  stepNine: stepNineSchema,
  review: stepTenSchema
});

// Function to get randomized model IDs
function getRandomizedModelIds() {
  const modelIds = ['model1', 'model2', 'model3'];
  // Shuffle the array
  for (let i = modelIds.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [modelIds[i], modelIds[j]] = [modelIds[j], modelIds[i]];
  }
  return modelIds;
}

// Get randomized model IDs
const [firstModel, secondModel, thirdModel] = getRandomizedModelIds();

// Initial values for each step with consistent model IDs per group
export const initialValues: SurveyType = {
  stepOne: {
    step: 1,
    seedSongId: 1,
    modelId: firstModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepTwo: {
    step: 2,
    seedSongId: 2,
    modelId: firstModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepThree: {
    step: 3,
    seedSongId: 3,
    modelId: firstModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepFour: {
    step: 4,
    seedSongId: 1,
    modelId: secondModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepFive: {
    step: 5,
    seedSongId: 2,
    modelId: secondModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepSix: {
    step: 6,
    seedSongId: 3,
    modelId: secondModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepSeven: {
    step: 7,
    seedSongId: 1,
    modelId: thirdModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepEight: {
    step: 8,
    seedSongId: 2,
    modelId: thirdModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepNine: {
    step: 9,
    seedSongId: 3,
    modelId: thirdModel,
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  review: {
    step: 10,
    age: 18,
    country: 'GBR',
    preference: 'model1',
    feedback: ''
  }
};

// Type exports
export type StepOneType = z.infer<typeof stepOneSchema>;
export type StepTwoType = z.infer<typeof stepTwoSchema>;
export type StepThreeType = z.infer<typeof stepThreeSchema>;
export type StepFourType = z.infer<typeof stepFourSchema>;
export type StepFiveType = z.infer<typeof stepFiveSchema>;
export type StepSixType = z.infer<typeof stepSixSchema>;
export type StepSevenType = z.infer<typeof stepSevenSchema>;
export type StepEightType = z.infer<typeof stepEightSchema>;
export type StepNineType = z.infer<typeof stepNineSchema>;
export type StepTenType = z.infer<typeof stepTenSchema>;
export type SurveyType = z.infer<typeof surveySchema>;
