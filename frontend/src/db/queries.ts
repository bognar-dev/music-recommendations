import { and, asc, desc, eq, ilike, gte, or, sql } from 'drizzle-orm'
import { db } from '.'
import { songs } from './schema'
import { cache } from 'react'

export const ITEMS_PER_PAGE = 20

export type SearchParams = {
  query?: string
  page?: number
  minDanceability?: number
  minEnergy?: number
  sortBy?: string
}

export const getSongs = cache(async ({
  query,
  page = 1,
  minDanceability,
  minEnergy,
  sortBy,
}: SearchParams) => {
  try {
    let whereClause = undefined

    // Build where conditions
    const conditions = []
    
    if (query) {
      conditions.push(
        or(
          ilike(songs.name, `%${query}%`),
          ilike(songs.artist, `%${query}%`)
        )
      )
    }

    if (minDanceability) {
      conditions.push(gte(songs.danceability, minDanceability))
    }

    if (minEnergy) {
      conditions.push(gte(songs.energy, minEnergy))
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions)
    }

    // Calculate offset
    const offset = (page - 1) * ITEMS_PER_PAGE

    // Build order by
    let orderBy = undefined
    if (sortBy) {
      switch (sortBy) {
        case 'name':
          orderBy = [asc(songs.name)]
          break
        case 'danceability':
          orderBy = [desc(songs.danceability)]
          break
        case 'energy':
          orderBy = [desc(songs.energy)]
          break
        case 'valence':
          orderBy = [desc(songs.valence)]
          break
      }
    }

    // Get total count
    const totalPromise = db.select({
      count: sql<number>`count(*)::int`,
    })
    .from(songs)
    .where(whereClause)
    .execute()

    // Get paginated results
    const songsPromise = db.select()
      .from(songs)
      .where(whereClause)
      .limit(ITEMS_PER_PAGE)
      .offset(offset)
      .orderBy(...(orderBy || [desc(songs.id)]))
      .execute()

    // Run queries in parallel
    const [total, results] = await Promise.all([totalPromise, songsPromise])

    return {
      songs: results,
      total: total[0].count,
      totalPages: Math.ceil(total[0].count / ITEMS_PER_PAGE)
    }
  } catch (error) {
    console.error('Error fetching songs:', error)
    throw error
  }
})

export const getSongById = cache(async (id: number) => {
  return db.select()
    .from(songs)
    .where(eq(songs.id, id))
    .limit(1)
    .execute()
    .then(results => results[0])
})