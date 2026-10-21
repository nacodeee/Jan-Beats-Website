import { Play, Pause, Volume2, VolumeX, X } from 'lucide-react';
import { usePlayer } from '../../context/PlayerContext';
import { useLang } from '../../context/LangContext';
import { formatTime } from '../../lib/format';

export function BottomPlayer() {
  const { currentBeat, playing, currentTime, duration, volume, play, pause, close, seek, changeVolume } = usePlayer();
  const { lang, t } = useLang();

  if (!currentBeat) return null;

  const handlePlayPause = () => {
    if (playing === currentBeat.id) {
      pause();
    } else {
      play(currentBeat, lang);
    }
  };

  return (
    <div className="bottomPlayer">
      <div className={`playerArtwork ${currentBeat.coverUrl ? 'hasImage' : 'art3'}`}>
        {currentBeat.coverUrl && <img src={currentBeat.coverUrl} alt="" />}
        {!currentBeat.coverUrl && <span>JAN</span>}
      </div>
      <div className="playerTrack">
        <strong>{currentBeat.title}</strong>
        <span>{currentBeat.genre} · {currentBeat.bpm} BPM</span>
      </div>
      <div className="playerControls">
        <button onClick={handlePlayPause} aria-label={playing === currentBeat.id ? 'Pause' : 'Play'}>
          {playing === currentBeat.id ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <div className="playerProgress">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={Math.min(currentTime, duration || 0)}
            disabled={!duration}
            onInput={(e) => seek(e.currentTarget.value)}
            aria-label="Seek"
          />
          <span>{formatTime(duration)}</span>
        </div>
      </div>
      <div className="playerVolume">
        {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onInput={(e) => changeVolume(e.currentTarget.value)}
          aria-label="Volume"
        />
      </div>
      <button className="playerClose" onClick={close} aria-label="Close player">
        <X size={20} />
      </button>
    </div>
  );
}
