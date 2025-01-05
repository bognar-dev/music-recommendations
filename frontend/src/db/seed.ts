import { parse } from 'csv-parse/sync'
import fs from 'fs'
import path from 'path'
import { db } from '@/db'
import { songs } from '@/db/schema'
import { NewSong } from '@/db/schema'

interface CSVRecord {
  name: string;
  artist: string;
  spotify_id: string;
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
}

async function seed() {
  try {
    console.log('Starting seed...')
    
    // Read CSV file
    const csvFilePath = path.join(process.cwd(), "src",'data', 'spotify_dataset.csv')
    const fileContent = fs.readFileSync(csvFilePath, 'utf-8')
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    }) as CSVRecord[]

    // Convert records to song objects
    const songsData: NewSong[] = records.map(record => ({
      name: record.name || 'Unknown',
      artist: record.artist || 'Unknown Artist',
      spotify_id: record.spotify_id,
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
    }))

    // Insert in batches of 100
    const batchSize = 100
    for (let i = 0; i < songsData.length; i += batchSize) {
      const batch = songsData.slice(i, i + batchSize)
      await db.insert(songs).values(batch)
      console.log(`Inserted ${i + batch.length} of ${songsData.length} songs`)
    }

    console.log('Seed completed successfully')
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seed()