import { StepTenType } from "@/lib/survey-schema"
import { Disc3 } from "lucide-react"

interface VinylRatingProps {
  name: string
  value: number | StepTenType["preference"]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  range?: number
  ratingMode?: "single" | "range"
  likertLabels?: string[]  // Add labels for Likert scale
  showLabels?: boolean     // Option to show/hide labels
}

export function VinylRating({
  name,
  value,
  onChange,
  range = 5,
  ratingMode = "range",
  likertLabels,
  showLabels = false,
}: VinylRatingProps) {
  // Convert StepTenType["preference"] ("model1", "model2", "model3") to a number 1-3
  const numericValue =
    typeof value === "number" ? value : Number(value.replace("model", ""))

  // Default Likert labels if none are provided
  const defaultLikertLabels = [
    "Strongly Disagree",
    "Disagree",
    "Neutral",
    "Agree",
    "Strongly Agree"
  ];
  
  // Use provided labels or defaults, sliced to match the range
  const labels = (likertLabels || defaultLikertLabels).slice(0, range);

  return (
    <div className="flex flex-col items-center w-full">
      <div className={`flex justify-between ${showLabels ? "w-full" : ""}`}>
      {Array.from({ length: range }, (_, i) => i + 1).map((rating) => {
        const isColored =
        ratingMode === "range"
          ? rating <= numericValue
          : rating === numericValue
        return (
        <div key={rating} className="flex flex-col items-center">
          <input
          type="radio"
          id={`${name}-${rating}`}
          name={name}
          value={rating}
          checked={numericValue === rating}
          onChange={onChange}
          className="sr-only"
          />
            <label
            htmlFor={`${name}-${rating}`}
            className="cursor-pointer flex flex-col items-center"
            >
            <Disc3
            className={`h-8 w-8 stroke-1 ${
            isColored ? "text-primary fill-primary/60" : "text-gray-300"
            }`}
            />
            {!showLabels && <span>{rating.toString()}</span>}
            </label>
        </div>
        )
      })}
      </div>
      
      {showLabels && labels.length > 0 && (
      <div className="flex justify-between w-full mt-2 text-xs">
        {labels.map((label, index) => (
        <div key={index} className="text-center max-w-[80px]">
          {label}
        </div>
          ))}
        </div>
      )}
    </div>
  )
}
