'use client';

import { useSurveyContext } from '@/context/survey-context'

interface InputProps {
  label: string;
  id: string;
  name?: string;
  description?: string;
  required?: boolean;
  pattern?: string;
  type: string;
  minLength?: number;
  min?: number;
  max?: number;
  errorMsg?: string;
  ratingType?: string;
}

export default function Input({
  label,
  id,
  name,
  required,
  pattern,
  type,
  minLength,
  min,
  max,
  description,
  errorMsg,
  ratingType
}: InputProps) {
  const { updateSurveyDetails, surveyData } = useSurveyContext(); // Changed these context values

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSurveyDetails({ [e.target.name]: e.target.value }); // Changed to use survey context
  };

  return (
    <div>
      <label className="block text-lg" htmlFor={id}>
        {label}
        {description && (
          <span className="text-sm text-slate-200 block mb-1">
            {description}
          </span>
        )}
      </label>
      <input
        className={`w-full rounded-md py-4 px-2 text-slate-900 ${
          errorMsg ? 'border-red-500' : 'border-slate-300'
        } border-2`}
        type={type}
        name={name}
        id={id}
        required={required}
        pattern={pattern}
        minLength={minLength}
        min={min}
        max={max}
        onChange={handleInputChange}
        value={ratingType === 'song' 
          ? surveyData.songRatings.find((rating) => rating.songId === id)?.rating
          : ratingType === 'preference' 
            ? surveyData.preferences[id]
            : surveyData.demographics[id]
        }
      />
      <div className="min-h-8 mt-1">
        {errorMsg && (
          <span className="text-red-500 text-sm block ">{errorMsg}</span>
        )}
      </div>
    </div>
  );
}