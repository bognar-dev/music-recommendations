
export interface FormErrors {
    [key: string]: string | undefined;
  }
  
  export enum AddDealRoutes {
    MODEL_1 = '/survey/step-one',
    MODEL_2 = '/survey/step-two',
    MODEL_3 = '/survey/step-three',
    REVIEW_SURVEY = '/survey/review',
    THANK_YOU = '/thank-you',
  }