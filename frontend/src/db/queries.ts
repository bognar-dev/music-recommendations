"server-only";
import { sql, and, gte, eq, lte, desc, asc } from 'drizzle-orm';
import { db } from './index';
import { songs } from './schema';
import { SearchParams } from '@/lib/url-state';

export const ITEMS_PER_PAGE = 20;

const danceabilityFilter = (params: SearchParams) => {
  if (params.minDanceability || params.maxDanceability) {
    return and(
      params.minDanceability ? gte(songs.danceability, params.minDanceability) : undefined,
      params.maxDanceability ? lte(songs.danceability, params.maxDanceability) : undefined
    );
  }
  return undefined;
};

const energyFilter = (params: SearchParams) => {
  if (params.minEnergy || params.maxEnergy) {
    return and(
      params.minEnergy ? gte(songs.energy, params.minEnergy) : undefined,
      params.maxEnergy ? lte(songs.energy, params.maxEnergy) : undefined
    );
  }
  return undefined;
};

const loudnessFilter = (params: SearchParams) => {
  if (params.minLoudness || params.maxLoudness) {
    return and(
      params.minLoudness ? gte(songs.loudness, params.minLoudness) : undefined,
      params.maxLoudness ? lte(songs.loudness, params.maxLoudness) : undefined
    );
  }
  return undefined;
};

const searchFilter = (q?: string) => {
  if (q) {
    const tsQuery = q.trim().split(/\s+/).join(' & ');
    return sql`(${songs.name} @@ to_tsquery(${tsQuery}) OR ${songs.artist} @@ to_tsquery(${tsQuery}))`;
  }
  return undefined;
};


const artistFilter = (artist?: string) => {
  if (artist) {
    return sql`${songs.artist} ILIKE ${`%${artist}%`}`;
  }
  return undefined;
};

const previewUrlFilter = (previewUrl?: boolean) => {
  if (previewUrl) {
    return sql`${songs.preview_url} IS NOT NULL`;
  }
  return undefined;
};

const imageUrlFilter = (imageUrl?: boolean) => {
  if (imageUrl) {
    return sql`${songs.image_url} IS NOT NULL`;
  }
  return undefined;
};



export async function fetchSongsWithPagination(searchParams: SearchParams) {
  console.log(searchParams)
  const page = Math.max(1, searchParams.page || 1);
  const limit = searchParams.limit || ITEMS_PER_PAGE;

  const filters = [
    danceabilityFilter(searchParams),
    energyFilter(searchParams),
    loudnessFilter(searchParams),
    searchFilter(searchParams.search),
    artistFilter(searchParams.artist),
    previewUrlFilter(searchParams.preview_url),
    imageUrlFilter(searchParams.image_url),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;
  const offset = (page - 1) * limit;

  const sortColumn = searchParams.sortBy ? songs[searchParams.sortBy] : songs.id;
  const sortOrder = searchParams.sortOrder === 'desc' ? desc : asc;

  const paginatedSongs = await db
    .select()
    .from(songs)
    .where(whereClause)
    .orderBy(sortOrder(sortColumn))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
    console.log(paginatedSongs.length)
  return paginatedSongs;
}

export async function estimateTotalSongs(searchParams: SearchParams) {
  const filters = [
    danceabilityFilter(searchParams),
    energyFilter(searchParams),
    loudnessFilter(searchParams),
    searchFilter(searchParams.search),
    artistFilter(searchParams.artist),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(songs)
    .where(whereClause);

  return result[0].count;
}

export async function fetchSongById(id: number) {
  const result = await db
    .select()
    .from(songs)
    .where(eq(songs.id, id))
    .limit(1);

  return result[0];
}

