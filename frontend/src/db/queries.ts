"server-only";
import { sql, and, gte, eq, lte, desc, asc, inArray, or } from "drizzle-orm";
import { db } from "./index";
import { songs, surveys } from "./schema";
import { SearchParams } from "@/lib/url-state";
import { SurveyType } from "@/lib/survey-schema";
import { postHogServer } from "@/lib/postHog-server";

export const ITEMS_PER_PAGE = 20;

const danceabilityFilter = (params: SearchParams) => {
  if (params.minDanceability || params.maxDanceability) {
    return and(
      params.minDanceability
        ? gte(songs.danceability, params.minDanceability)
        : undefined,
      params.maxDanceability
        ? lte(songs.danceability, params.maxDanceability)
        : undefined
    );
  }
  return undefined;
};

const colorTemperatureFilter = (params: SearchParams) => {
  if (params.color_temperature) {
    const colorTemperature =
      params.color_temperature.charAt(0).toUpperCase() +
      params.color_temperature.slice(1);
    console.log("params.color_temperature", colorTemperature);
    return and(
      colorTemperature
        ? eq(songs.color_temperature, colorTemperature)
        : undefined
    );
  }
  return undefined;
};

const colorBrightnessFilter = (params: SearchParams) => {
  if (params.color_brightness) {
    const colorBrightness =
      params.color_brightness.charAt(0).toUpperCase() +
      params.color_brightness.slice(1);
    return and(
      colorBrightness ? eq(songs.color_brightness, colorBrightness) : undefined
    );
  }
  return undefined;
};

const overallLightnessFilter = (params: SearchParams) => {
  if (params.overall_lightness) {
    const overallLightness =
      params.overall_lightness.charAt(0).toUpperCase() +
      params.overall_lightness.slice(1);
    return and(
      overallLightness
        ? eq(songs.overall_lightness, overallLightness)
        : undefined
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
    // Escape special characters for tsquery
    postHogServer.capture({
      distinctId: "server",
      event: "searchFilter",
      properties: { q: q },
    });
    const tsQuery = q.trim().split(/\s+/).join(" & ") + ":*";
    const nameFilter = sql`${songs.name} @@ to_tsquery('english', ${tsQuery})`;
    const artistFilter = sql`${songs.artist} @@ to_tsquery('english', ${tsQuery})`;
    return or(nameFilter, artistFilter);
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

export async function fetchSongs(songIds: string[]) {
  const songsArray = await db
    .select()
    .from(songs)
    .where(inArray(songs.spotify_id, songIds));
  return songsArray;
}

export async function fetchSongsWithPagination(searchParams: SearchParams) {
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
    colorTemperatureFilter(searchParams),
    colorBrightnessFilter(searchParams),
    overallLightnessFilter(searchParams),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;
  const offset = (page - 1) * limit;

  const sortColumn = searchParams.sortBy
    ? songs[searchParams.sortBy]
    : songs.id;
  const sortOrder = searchParams.sortOrder === "desc" ? desc : asc;

  const paginatedSongs = await db
    .select()
    .from(songs)
    .where(whereClause)
    .orderBy(sortOrder(sortColumn))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);
  return paginatedSongs;
}

export async function estimateTotalSongs(searchParams: SearchParams) {
  const filters = [
    danceabilityFilter(searchParams),
    energyFilter(searchParams),
    loudnessFilter(searchParams),
    searchFilter(searchParams.search),
    artistFilter(searchParams.artist),
    previewUrlFilter(searchParams.preview_url),
    imageUrlFilter(searchParams.image_url),
    colorTemperatureFilter(searchParams),
    colorBrightnessFilter(searchParams),
    overallLightnessFilter(searchParams),
  ].filter(Boolean);

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(songs)
    .where(whereClause);

  return result[0].count;
}

export async function fetchSongById(id: number) {
  const result = await db.select().from(songs).where(eq(songs.id, id)).limit(1);

  return result[0];
}

export async function insertSurvey(survey: SurveyType) {
  const surveyToInsert = {
    step_one: survey.stepOne,
    step_two: survey.stepTwo,
    step_three: survey.stepThree,
    step_four: survey.stepFour,
  };
  const result = await db.insert(surveys).values(surveyToInsert).returning();
  return result;
}
