import { z } from 'zod'

export const searchParamsSchema = z.object({
  search: z.string().optional(),
  artist: z.string().optional(),
  minDanceability: z.coerce.number().min(0).max(1).optional(),
  maxDanceability: z.coerce.number().min(0).max(1).optional(),
  minEnergy: z.coerce.number().min(0).max(1).optional(),
  maxEnergy: z.coerce.number().min(0).max(1).optional(),
  minLoudness: z.coerce.number().optional(),
  maxLoudness: z.coerce.number().optional(),
  minSpeechiness: z.coerce.number().min(0).max(1).optional(),
  maxSpeechiness: z.coerce.number().min(0).max(1).optional(),
  minAcousticness: z.coerce.number().min(0).max(1).optional(),
  maxAcousticness: z.coerce.number().min(0).max(1).optional(),
  minInstrumentalness: z.coerce.number().min(0).max(1).optional(),
  maxInstrumentalness: z.coerce.number().min(0).max(1).optional(),
  minLiveness: z.coerce.number().min(0).max(1).optional(),
  maxLiveness: z.coerce.number().min(0).max(1).optional(),
  minValence: z.coerce.number().min(0).max(1).optional(),
  maxValence: z.coerce.number().min(0).max(1).optional(),
  preview_url: z.boolean().optional(),
  image_url: z.boolean().optional(),
  sortBy: z.enum(['name', 'artist', 'danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 'liveness', 'valence']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
})

export type SearchParams = z.infer<typeof searchParamsSchema>

export function parseSearchParams(
  params: Record<string, string | string[] | undefined>
): SearchParams {
  const result = searchParamsSchema.safeParse(params)
  
  if (result.success) {
    return result.data
  } else {
    console.error('Invalid search params:', result.error)
    return {}
  }
}

export function stringifySearchParams(params: SearchParams): string {
  const urlParams = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      urlParams.append(key, value.toString())
    }
  })
  return urlParams.toString()
}
