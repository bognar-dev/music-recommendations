"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">Minimum Danceability</label>
        <Slider
          defaultValue={[0]}
          max={1}
          step={0.1}
          onValueChange={([value]) => updateSearchParam("minDanceability", value.toString())}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Minimum Energy</label>
        <Slider
          defaultValue={[0]}
          max={1}
          step={0.1}
          onValueChange={([value]) => updateSearchParam("minEnergy", value.toString())}
        />
      </div>
      <div>
        <label className="text-sm font-medium">Sort By</label>
        <Select onValueChange={(value) => updateSearchParam("sortBy", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="danceability">Danceability</SelectItem>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="valence">Valence</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

