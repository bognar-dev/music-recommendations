"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import playlistTracks from '@/data/playlist'

interface Track {
  id: string
  title: string
  artist: string
  albumCover: string
  previewUrl?: string
}

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  isRepeatEnabled: boolean;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (value: number) => void;
  seek: (value: number) => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  previousTrack: () => void;
}

const AudioContext = createContext<AudioContextType | null>(null)

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(-1);
  const [isRepeatEnabled, setIsRepeatEnabled] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize audio on the client side
    setAudio(new Audio());
  }, []);

  useEffect(() => {
    if (!audio) return;

    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, [audio]);

  const seek = (value: number) => {
    if (!audio) return;
    const time = (value / 100) * audio.duration;
    audio.currentTime = time;
  };

  const handleVolumeChange = (value: number) => {
    if (!audio) return;
    const normalizedVolume = value / 100
    audio.volume = normalizedVolume
    setVolume(normalizedVolume)
  }

  const togglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  useEffect(() => {
    if (!audio) return;

    const handleEnded = () => {
      if (isRepeatEnabled) {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [isRepeatEnabled, audio]);

  const playTrack = (track: Track) => {
    if (!audio) return;
    if (track.previewUrl) {
      if (currentTrack?.id === track.id) {
        togglePlay()
        return
      }
      const trackIndex = playlistTracks.findIndex(t => t.id === track.id)
      setCurrentTrackIndex(trackIndex)
      audio.src = track.previewUrl
      setCurrentTrack(track)
      audio.play()
      setIsPlaying(true)
    }
  }

  const nextTrack = () => {
    if (currentTrackIndex < playlistTracks.length - 1) {
      const nextIndex = currentTrackIndex + 1
      const nextTrack = playlistTracks[nextIndex]
      setCurrentTrackIndex(nextIndex)
      playTrack(nextTrack)
    } else if (isRepeatEnabled) {
      const nextTrack = playlistTracks[0]
      setCurrentTrackIndex(0)
      playTrack(nextTrack)
    }
  }

  const previousTrack = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1
      const prevTrack = playlistTracks[prevIndex]
      setCurrentTrackIndex(prevIndex)
      playTrack(prevTrack)
    } else if (isRepeatEnabled) {
      const lastTrack = playlistTracks[playlistTracks.length - 1]
      setCurrentTrackIndex(playlistTracks.length - 1)
      playTrack(lastTrack)
    }
  }

  const toggleRepeat = () => setIsRepeatEnabled(!isRepeatEnabled);

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
    }}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext)
  if (!context) throw new Error('useAudio must be used within AudioProvider')
  return context
}

