
export interface FormErrors {
    [key: string]: string | undefined;
  }
  
  export enum AddDealRoutes {
    MODEL_1 = '/survey/step-one',
    M_1_P1 = '/survey/step-one/playlist-one',
    M_1_P2 = '/survey/step-one/playlist-two',
    M_1_P3 = '/survey/step-one/playlist-three',
    MODEL_2 = '/survey/step-two',
    M_2_P1 = '/survey/step-two/playlist-one',
    M_2_P2 = '/survey/step-two/playlist-two',
    M_2_P3 = '/survey/step-two/playlist-three',
    MODEL_3 = '/survey/step-three',
    M_3_P1 = '/survey/step-three/playlist-one',
    M_3_P2 = '/survey/step-three/playlist-two',
    M_3_P3 = '/survey/step-three/playlist-three',
    REVIEW_SURVEY = '/survey/review',
    THANK_YOU = '/thank-you',
  }