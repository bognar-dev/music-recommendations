import { parse } from 'csv-parse/sync';
import fs from 'fs';
import path from 'path';
import { db } from '@/db';
import { songs } from '@/db/schema';
import { NewSong } from '@/db/schema';

interface CSVRecord {
    id: string;
    name: string;
    artist: string;
    preview: string;
    img: string;
    danceability: string;
    energy: string;
    loudness: string;
    speechiness: string;
    acousticness: string;
    instrumentalness: string;
    liveness: string;
    valence: string;
    acousticness_artist: string;
    danceability_artist: string;
    energy_artist: string;
    instrumentalness_artist: string;
    liveness_artist: string;
    speechiness_artist: string;
    valence_artist: string;
    track_name: string;
    album: string;
    album_id: string;
    artists: string;
    artist_ids: string;
    track_number: string;
    disc_number: string;
    explicit: string;
    key: string;
    mode: string;
    tempo: string;
    duration_ms: string;
    time_signature: string;
    year: string;
    release_date: string;
    image_path: string;
    single_pixel_color_r: string;
    single_pixel_color_g: string;
    single_pixel_color_b: string;
    weighted_average_color_r: string;
    weighted_average_color_g: string;
    weighted_average_color_b: string;
    most_vibrant_color_r: string;
    most_vibrant_color_g: string;
    most_vibrant_color_b: string;
    dominant_colors: string;
    color_temperature: string;
    color_brightness: string;
    overall_lightness: string;
    single_pixel_color: string;
    weighted_average_color: string;
    most_vibrant_color: string;
    both_efficientnet_v2_extracted: string;
}

async function seed() {
    try {
        console.log('Starting seed...');

        // Read CSV file
        const csvFilePath = path.join(process.cwd(), "src", 'data', 'cleaned_data_both_efficientnet_v2_features.csv');
        const fileContent = fs.readFileSync(csvFilePath, 'utf-8');
        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
        }) as CSVRecord[];

        // Convert records to song objects
        const songsData: NewSong[] = records.map(record => ({
            name: record.name || 'Unknown',
            artist: record.artist || 'Unknown Artist',
            spotify_id: record.id, // Use 'id' from CSV
            preview_url: record.preview || null,
            image_url: record.img || '/placeholder.svg',
            danceability: parseFloat(record.danceability) || 0,
            energy: parseFloat(record.energy) || 0,
            loudness: parseFloat(record.loudness) || 0,
            speechiness: parseFloat(record.speechiness) || 0,
            acousticness: parseFloat(record.acousticness) || 0,
            instrumentalness: parseFloat(record.instrumentalness) || 0,
            liveness: parseFloat(record.liveness) || 0,
            valence: parseFloat(record.valence) || 0,
            acousticness_artist: parseFloat(record.acousticness_artist) || 0,
            danceability_artist: parseFloat(record.danceability_artist) || 0,
            energy_artist: parseFloat(record.energy_artist) || 0,
            instrumentalness_artist: parseFloat(record.instrumentalness_artist) || 0,
            liveness_artist: parseFloat(record.liveness_artist) || 0,
            speechiness_artist: parseFloat(record.speechiness_artist) || 0,
            valence_artist: parseFloat(record.valence_artist) || 0,

            //New mappings
            track_name: record.track_name || null,
            album: record.album || null,
            album_id: record.album_id || null,
            artists: record.artists || null,
            artist_ids: record.artist_ids || null,
            track_number: parseInt(record.track_number) || null,
            disc_number: parseInt(record.disc_number) || null,
            explicit: record.explicit === 'True' || record.explicit === 'TRUE',
            key: parseInt(record.key) || null,
            mode: parseInt(record.mode) || null,
            tempo: parseFloat(record.tempo) || null,
            duration_ms: parseInt(record.duration_ms) || null,
            time_signature: parseInt(record.time_signature) || null,
            year: parseInt(record.year) || null,
            release_date: record.release_date || null,
            image_path: record.image_path || null,
            single_pixel_color_r: parseInt(record.single_pixel_color_r) || null,
            single_pixel_color_g: parseInt(record.single_pixel_color_g) || null,
            single_pixel_color_b: parseInt(record.single_pixel_color_b) || null,
            weighted_average_color_r: parseFloat(record.weighted_average_color_r) || null,
            weighted_average_color_g: parseFloat(record.weighted_average_color_g) || null,
            weighted_average_color_b: parseFloat(record.weighted_average_color_b) || null,
            most_vibrant_color_r: parseInt(record.most_vibrant_color_r) || null,
            most_vibrant_color_g: parseInt(record.most_vibrant_color_g) || null,
            most_vibrant_color_b: parseInt(record.most_vibrant_color_b) || null,
            dominant_colors: record.dominant_colors || null,
            color_temperature: record.color_temperature || null,
            color_brightness: record.color_brightness || null,
            overall_lightness: record.overall_lightness || null,
            single_pixel_color: record.single_pixel_color || null,
            weighted_average_color: record.weighted_average_color || null,
            most_vibrant_color: record.most_vibrant_color || null,
        }));

        // Insert in batches of 100
        const batchSize = 100;
        for (let i = 0; i < songsData.length; i += batchSize) {
            const batch = songsData.slice(i, i + batchSize);
            await db.insert(songs).values(batch);
            console.log(`Inserted ${i + batch.length} of ${songsData.length} songs`);
        }

        console.log('Seed completed successfully');
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
