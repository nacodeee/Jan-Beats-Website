import { createContext, useContext, useState, useRef, useCallback } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentBeat, setCurrentBeat] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(null);

  const play = useCallback((beat, lang) => {
    if (!beat.preview_path && !beat.preview) {
      return { error: lang === 'es' ? 'Este beat no tiene preescucha.' : 'This beat has no preview.' };
    }

    const previewUrl = beat.preview_path || beat.preview;
    const beatId = beat.id;

    if (playing === beatId && audioRef.current) {
      audioRef.current.pause();
      setPlaying(null);
      return {};
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(previewUrl);
    audio.volume = volume;
    audioRef.current = audio;
    setCurrentBeat(beat);
    setCurrentTime(0);
    setDuration(0);
    setPlaying(beatId);

    audio.ontimeupdate = () => setCurrentTime(audio.currentTime);
    audio.onloadedmetadata = () => setDuration(audio.duration || 0);
    audio.onended = () => {
      setPlaying(null);
      setCurrentTime(0);
      audioRef.current = null;
    };
    audio.onerror = () => {
      setPlaying(null);
      setCurrentTime(0);
      audioRef.current = null;
      return { error: lang === 'es' ? 'No se pudo cargar la preescucha.' : 'Could not load preview.' };
    };
    audio.play().catch(() => setPlaying(null));
    return {};
  }, [playing, volume]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setPlaying(null);
    }
  }, []);

  const close = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlaying(null);
    setCurrentBeat(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  const seek = useCallback((value) => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration)) return;
    audio.currentTime = Number(value);
    setCurrentTime(audio.currentTime);
  }, []);

  const changeVolume = useCallback((value) => {
    const next = Math.max(0, Math.min(1, Number(value)));
    setVolume(next);
    if (audioRef.current) audioRef.current.volume = next;
  }, []);

  const value = {
    currentBeat,
    playing,
    currentTime,
    duration,
    volume,
    play,
    pause,
    close,
    seek,
    changeVolume,
  };

  return <PlayerContext.Provider value={value}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
