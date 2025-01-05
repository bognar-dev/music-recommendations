import "server-only";

import { cache } from 'react'
import fs from 'fs'
import path from 'path'
import { parse } from 'csv-parse/sync'
import type { Song, SearchParams } from '@/types/music'

// Function to parse CSV data
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

function parseCSV(filePath: string): Song[] {
  
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
  })


  return records.map((record: CSVRecord) => ({
    name: record.name || 'Unknown',
    artist: record.artist || 'Unknown Artist',
    spotify_id: record.spotify_id || '',
    preview: record.preview || null,
    img: record.img || '/placeholder.svg',
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
    valence_artist: parseFloat(record.valence_artist) || 0
  }))
}

// Load and parse the CSV file
const csvFilePath = path.join(process.cwd(), 'data', 'songs.csv')
const songs: Song[] = parseCSV(csvFilePath)

// Cache the filtered and sorted results
export const getSongs = cache((params: SearchParams) => {
  let filtered = songs

  // Apply search filter
  if (params.query) {
    const query = params.query.toLowerCase()
    filtered = filtered.filter(
      song => 
        song.name.toLowerCase().includes(query) ||
        song.artist.toLowerCase().includes(query)
    )
  }

  // Apply numeric filters
  if (params.minDanceability) {
    filtered = filtered.filter(
      song => song.danceability >= Number(params.minDanceability)
    )
  }

  if (params.minEnergy) {
    filtered = filtered.filter(
      song => song.energy >= Number(params.minEnergy)
    )
  }

  // Apply sorting
  if (params.sortBy) {
    filtered = [...filtered].sort((a, b) => {
      switch (params.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'danceability':
          return b.danceability - a.danceability
        case 'energy':
          return b.energy - a.energy
        case 'valence':
          return b.valence - a.valence
        default:
          return 0
      }
    })
  }

  // Calculate pagination
  const page = Number(params.page) || 1
  const pageSize = 20
  const start = (page - 1) * pageSize
  const end = start + pageSize

  return {
    songs: filtered.slice(start, end),
    total: filtered.length,
    totalPages: Math.ceil(filtered.length / pageSize)
  }
})

