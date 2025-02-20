import {
    serial,
    text,
    pgTable,
    doublePrecision,
    varchar,
    timestamp,
    index,
    json,
    boolean,
    integer,
} from 'drizzle-orm/pg-core';

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

    // New Columns
    track_name: text('track_name'),
    album: text('album'),
    album_id: text('album_id'),
    artists: text('artists'),
    artist_ids: text('artist_ids'),
    track_number: integer('track_number'),
    disc_number: integer('disc_number'),
    explicit: boolean('explicit'),
    key: integer('key'),
    mode: integer('mode'),
    tempo: doublePrecision('tempo'),
    duration_ms: integer('duration_ms'),
    time_signature: integer('time_signature'),
    year: integer('year'),
    release_date: text('release_date'),
    image_path: text('image_path'),
    single_pixel_color_r: integer('single_pixel_color_r'),
    single_pixel_color_g: integer('single_pixel_color_g'),
    single_pixel_color_b: integer('single_pixel_color_b'),
    weighted_average_color_r: doublePrecision('weighted_average_color_r'),
    weighted_average_color_g: doublePrecision('weighted_average_color_g'),
    weighted_average_color_b: doublePrecision('weighted_average_color_b'),
    most_vibrant_color_r: integer('most_vibrant_color_r'),
    most_vibrant_color_g: integer('most_vibrant_color_g'),
    most_vibrant_color_b: integer('most_vibrant_color_b'),
    dominant_colors: text('dominant_colors'),
    color_temperature: text('color_temperature'),
    color_brightness: text('color_brightness'),
    overall_lightness: text('overall_lightness'),
    rgb_histogram_shapes: text('rgb_histogram_shapes'),
    hsv_histogram_shapes: text('hsv_histogram_shapes'),
    single_pixel_color: text('single_pixel_color'),
    weighted_average_color: text('weighted_average_color'),
    most_vibrant_color: text('most_vibrant_color'),
    edge_map_shape: text('edge_map_shape'),
    lbp_histogram_shape: text('lbp_histogram_shape'),

    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
}, (table) => {
    return {
        nameIdx: index('name_idx').on(table.name),
        artistIdx: index('artist_idx').on(table.artist),
        spotifyIdx: index('spotify_idx').on(table.spotify_id),
    };
});

export const surveys = pgTable('surveys', {
    id: serial('id').primaryKey(),
    step_one: json('step_one').notNull(),
    step_two: json('step_two').notNull(),
    step_three: json('step_three').notNull(),
    step_four: json('step_four').notNull(),
    created_at: timestamp('created_at').defaultNow(),
    updated_at: timestamp('updated_at').defaultNow(),
});


export type Song = typeof songs.$inferSelect;
export type NewSong = typeof songs.$inferInsert;