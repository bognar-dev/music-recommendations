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
import { SearchFilterBadges } from "./search-filter-badges"

export function SearchFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(key, value)
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  return (
    <div className="space-y-4 grid grid-cols-2 grid-rows-3 sm:grid-cols-1 gap-3 justify-start items-end">
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
      <SearchFilterBadges 
        label={"Color Temperature"} 
        paramName={"color_temperature"} 
        options={[
          { value: "warm", label: "Warm" },
          { value: "cool", label: "Cool" }
        ]}
      />
      <SearchFilterBadges 
        label={"Colour Brightness"} 
        paramName={"color_brightness"} 
        options={[
          { value: "bright", label: "Bright" },
          { value: "soft", label: "Soft" }
        ]}
      />
      <SearchFilterBadges 
        label={"Overall Lightness"} 
        paramName={"overall_lightness"} 
        options={[
          { value: "light", label: "Light" },
          { value: "medium", label: "Medium" },
          { value: "dark", label: "Dark" }
        ]}
      />
    </div>
  )
}

