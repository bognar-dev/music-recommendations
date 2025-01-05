export interface Song {
    name: string
    artist: string
    spotify_id: string
    preview: string
    img: string
    danceability: number
    energy: number
    loudness: number
    speechiness: number
    acousticness: number
    instrumentalness: number
    liveness: number
    valence: number
    acousticness_artist: number
    danceability_artist: number
    energy_artist: number
    instrumentalness_artist: number
    liveness_artist: number
    speechiness_artist: number
    valence_artist: number
  }
  
  export interface SearchParams {
    query?: string
    page?: number
    minDanceability?: number
    minEnergy?: number
    sortBy?: 'name' | 'danceability' | 'energy' | 'valence'
  }
  
  