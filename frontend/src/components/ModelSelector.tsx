"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ModelSelector() {
  return (
    <div className="mb-4">
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a recommendation model" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="audio">Spotify Audio Features</SelectItem>
          <SelectItem value="cover">Album Cover Features</SelectItem>
          <SelectItem value="combined">Combined Audio and Cover Features</SelectItem>
          <SelectItem value="baseline">Spotify Baseline Model</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

