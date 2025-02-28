import { StepTenType } from "@/lib/survey-schema"
import { Disc3 } from "lucide-react"

interface VinylRatingProps {
  name: string
  value: number | StepTenType["preference"]
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  range?: number
  ratingMode?: "single" | "range"
}

export function VinylRating({
  name,
  value,
  onChange,
  range = 5,
  ratingMode = "range",
}: VinylRatingProps) {
  // Convert StepTenType["preference"] ("model1", "model2", "model3") to a number 1-3
  const numericValue =
    typeof value === "number" ? value : Number(value.replace("model", ""))

  return (
    <div className="flex space-x-2">
      {Array.from({ length: range }, (_, i) => i + 1).map((rating) => {
        const isColored =
          ratingMode === "range"
            ? rating <= numericValue
            : rating === numericValue
        return (
          <div key={rating} className="flex items-center">
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
              className="cursor-pointer flex flex-col items-center space-x-1"
            >
              <Disc3
                className={`h-8 w-8 stroke-1 ${
                  isColored ? "text-primary fill-primary/60" : "text-gray-300"
                }`}
              />
              <span>{rating.toString()}</span>
            </label>
          </div>
        )
      })}
    </div>
  )
}
