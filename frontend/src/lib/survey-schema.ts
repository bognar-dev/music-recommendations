import z from 'zod';

// Define common types that are reused
const songRatingSchema = z.object({
  songId: z.number(),
  songName: z.string(),
  rating: z.number().min(1).max(5).int()
});

const modelRatingSchema = z.object({
  relevance: z.number().min(1).max(5).int(),
  novelty: z.number().min(1).max(5).int(),
  satisfaction: z.number().min(1).max(5).int()
});

// Define each step schema separately
export const stepOneSchema = z.object({
  step: z.literal(1),
  modelId: z.string(),
  songRatings: z.array(songRatingSchema).default([]), // Remove .min(1) constraint
  modelRating: modelRatingSchema
});

export const stepTwoSchema = z.object({
  step: z.literal(2),
  modelId: z.string(),
  songRatings: z.array(songRatingSchema).default([]), // Remove .min(1) constraint
  modelRating: modelRatingSchema
});

export const stepThreeSchema = z.object({
  step: z.literal(3),
  modelId: z.string(),
  songRatings: z.array(songRatingSchema).default([]), // Remove .min(1) constraint
  modelRating: modelRatingSchema
});

export const stepFourSchema = z.object({
  step: z.literal(4),
  age: z.number().int().min(13, "You must be at least 13 years old").max(120, "Please enter a valid age"),
  country: z.string().min(1, "Country is required"),
  preference: z.enum(["model1", "model2", "model3"], {
    required_error: "Please select a preferred model",
  }),
  feedback: z.string().max(500, "Feedback must be less than 500 characters"),
})

// Complete survey schema
export const surveySchema = z.object({
  stepOne: stepOneSchema,
  stepTwo: stepTwoSchema,
  stepThree: stepThreeSchema,
  stepFour: stepFourSchema
});

// Initial values for each step
export const initialValues = {
  stepOne: {
    step: 1,
    modelId: '',
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepTwo: {
    step: 2,
    modelId: '',
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepThree: {
    step: 3,
    modelId: '',
    songRatings: [],
    modelRating: { relevance: 1, novelty: 1, satisfaction: 1 }
  },
  stepFour: {
    step: 4,
    usability: 1,
    clarity: 1,
    preference: 1,
    feedback: ''
  }
} as const;

// Type exports
export type StepOneType = z.infer<typeof stepOneSchema>;
export type StepTwoType = z.infer<typeof stepTwoSchema>;
export type StepThreeType = z.infer<typeof stepThreeSchema>;
export type StepFourType = z.infer<typeof stepFourSchema>;
export type SurveyType = z.infer<typeof surveySchema>;
