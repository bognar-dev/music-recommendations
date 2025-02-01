'use client';

import Recommendations from "@/components/Recommendations";
import SubmitButton from "@/components/survey-submit";
import { Song } from "@/db/schema";


interface StepTwoFormProps {
    recommendations: Song[]
}
export default function StepTwoForm({recommendations}: StepTwoFormProps) {
  return (
      <form className="flex flex-1 flex-col items-center">
          <div className="flex w-full flex-col gap-8 lg:max-w-[700px] ">
            <Recommendations recommendations={recommendations} />
          </div>
          <SubmitButton text="Submit" />
        </form>
  );
}