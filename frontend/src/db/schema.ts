import { 
    serial,
    text,
    pgTable,
    doublePrecision,
    varchar,
    timestamp,
    index, 
    json
  } from 'drizzle-orm/pg-core'
  
  export const songs = pgTable('songs', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    artist: text('artist').notNull(),
    spotify_id: varchar('spotify_id', { length: 256 }).notNull(),
    preview_url: text('preview_url'),
    image_url: text('image_url'),
    
    // Song metrics
    danceability: doublePrecision('danceability').notNull().default(0),
    energy: doublePrecision('energy').notNull().default(0),
    loudness: doublePrecision('loudness').notNull().default(0),
    speechiness: doublePrecision('speechiness').notNull().default(0),
    acousticness: doublePrecision('acousticness').notNull().default(0),
    instrumentalness: doublePrecision('instrumentalness').notNull().default(0),
    liveness: doublePrecision('liveness').notNull().default(0),
    valence: doublePrecision('valence').notNull().default(0),
    
    // Artist averages
    acousticness_artist: doublePrecision('acousticness_artist').notNull().default(0),
    danceability_artist: doublePrecision('danceability_artist').notNull().default(0),
    energy_artist: doublePrecision('energy_artist').notNull().default(0),
    instrumentalness_artist: doublePrecision('instrumentalness_artist').notNull().default(0),
    liveness_artist: doublePrecision('liveness_artist').notNull().default(0),
    speechiness_artist: doublePrecision('speechiness_artist').notNull().default(0),
    valence_artist: doublePrecision('valence_artist').notNull().default(0),
    
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  }, (table) => {
    return {
      nameIdx: index('name_idx').on(table.name),
      artistIdx: index('artist_idx').on(table.artist),
      spotifyIdx: index('spotify_idx').on(table.spotify_id),
    }
  })

  export const surveys = pgTable('surveys', {
    id: serial('id').primaryKey(),
    step_one: json('step_one').notNull(),
    step_two: json('step_two').notNull(),
    step_three: json('step_three').notNull(),
    step_four: json('step_four').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
  })
  
  
  export type Song = typeof songs.$inferSelect
  export type NewSong = typeof songs.$inferInsert