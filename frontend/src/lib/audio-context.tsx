"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { Song } from '@/db/schema'
interface AudioContextType {
  currentTrack: Song | null
  isPlaying: boolean
  volume: number
  progress: number
  duration: number
  isRepeatEnabled: boolean
  playlist: Song[]
  playTrack: (track: Song) => void
  togglePlay: () => void
  setVolume: (value: number) => void
  seek: (value: number) => void
  toggleRepeat: () => void
  nextTrack: () => void
  previousTrack: () => void
  updatePlaylist: (songs: Song[]) => void
  addSongToPlaylist: (song: Song) => void
  addSongsToPlaylist: (songs: Song[]) => void
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Song | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1)
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.4)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null)
  const [playlist, setPlaylist] = useState<Song[]>([])

  useEffect(() => {
    setAudio(new Audio())

    const fetchSongs = async () => {
      try {
        
        setPlaylist([])
      } catch (error) {
        console.error('Failed to fetch songs:', error)
      }
    }

    fetchSongs()
  }, [])

  useEffect(() => {
    if (!audio) return

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration)
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMetadata)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
    }
  }, [audio])

  const seek = (value: number) => {
    if (!audio) return
    const time = (value / 100) * audio.duration
    audio.currentTime = time
  }

  const handleVolumeChange = (value: number) => {
    if (!audio) return
    const normalizedVolume = value / 100
    audio.volume = normalizedVolume
    setVolume(normalizedVolume)
  }

  const togglePlay = () => {
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (!audio) return

    const handleEnded = () => {
      if (isRepeatEnabled) {
        audio.currentTime = 0
        audio.play()
      } else {
        nextTrack()
      }
    }

    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [isRepeatEnabled, audio])

  const playTrack = (track: Song) => {
    if (!audio) return
    if (track.preview_url) {
      if (currentTrack?.id === track.id) {
        togglePlay()
        return
      }
      const trackIndex = playlist.findIndex(t => t.id === track.id)
      setCurrentTrackIndex(trackIndex)
      audio.src = track.preview_url
      setCurrentTrack(track)
      audio.play()
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    if (currentTrackIndex < playlist.length - 1) {
      const nextIndex = currentTrackIndex + 1
      const nextTrack = playlist[nextIndex]
      setCurrentTrackIndex(nextIndex)
      playTrack(nextTrack)
    } else if (isRepeatEnabled) {
      const nextTrack = playlist[0]
      setCurrentTrackIndex(0)
      playTrack(nextTrack)
    }
  }

  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1
      const prevTrack = playlist[prevIndex]
      setCurrentTrackIndex(prevIndex)
      playTrack(prevTrack)
    } else if (isRepeatEnabled) {
      const lastTrack = playlist[playlist.length - 1]
      setCurrentTrackIndex(playlist.length - 1)
      playTrack(lastTrack)
    }
  }

  const toggleRepeat = () => setIsRepeatEnabled(!isRepeatEnabled)

  const updatePlaylist = (songs: Song[]) => {
    setPlaylist(songs)
    setCurrentTrackIndex(-1)
    setCurrentTrack(null)
    setIsPlaying(false)
    if (audio) {
      audio.pause()
      audio.currentTime = 0
    }
  }


  const addSongToPlaylist = (song: Song) => {
    if (!playlist.some(track => track.id === song.id)) {
      setPlaylist([...playlist, song])
    }
  }

  const addSongsToPlaylist = (songs: Song[]) => {
    setPlaylist([...playlist, ...songs])
    console.log(playlist)
  }

  return (
    <AudioContext.Provider value={{
      currentTrack,
      isPlaying,
      volume: volume * 100,
      progress,
      duration,
      playTrack,
      togglePlay,
      setVolume: handleVolumeChange,
      seek,
      isRepeatEnabled,
      toggleRepeat,
      nextTrack,
      previousTrack,
      playlist,
      updatePlaylist,
      addSongToPlaylist,
      addSongsToPlaylist
    }}>
      {children}
    </AudioContext.Provider>
  )
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within AudioProvider')
  return context
}

