import { Disc3 } from "lucide-react"

interface VinylRatingProps {
  name: string
  value: number
  onChange: (value: number) => void
}

export function VinylRating({ name, value, onChange }: VinylRatingProps) {
  return (
    <div className="flex space-x-2">
      {[1, 2, 3, 4, 5].map((rating) => (
        <div key={rating} className="flex items-center">
          <input
            type="radio"
            id={`${name}-${rating}`}
            name={name}
            value={rating}
            checked={value === rating}
            onChange={() => onChange(rating)}
            className="sr-only"
          />
          <label htmlFor={`${name}-${rating}`} className="cursor-pointer">
            <Disc3 className={`h-8 w-8 ${rating <= value ? "text-primary fill-primary" : "text-gray-300"}`} />
          </label>
        </div>
      ))}
    </div>
  )
}

