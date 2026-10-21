import { Play, Pause, Plus, Activity, Music2 } from 'lucide-react';
import { useLang } from '../../context/LangContext';
import { usePlayer } from '../../context/PlayerContext';
import { useToast } from '../../context/ToastContext';
import { money } from '../../lib/format';
import { Spinner } from '../ui/Spinner';

export function BeatCard({ beat, licenses, onChooseLicense }) {
  const { lang, t } = useLang();
  const { playing, play } = usePlayer();
  const { showToast } = useToast();
  const isPlaying = playing === beat.id;

  const handlePlay = () => {
    const result = play(beat, lang);
    if (result.error) showToast(result.error, 'error');
  };

  const defaultLicense = licenses.find((l) => l.id === 'wav') || licenses[1] || licenses[0];
  const displayPrice = defaultLicense ? defaultLicense.price : 0;

  return (
    <article className="beatCard">
      <div className={`cover ${beat.coverUrl ? 'hasImage' : 'art3'}`}>
        {beat.coverUrl && (
          <img className="beatCoverImage" src={beat.coverUrl} alt={`Cover de ${beat.title}`} />
        )}
        <span className="coverIndex">JAN / {String(beat.id).slice(-2).padStart(2, '0')}</span>
        <button className="playButton" onClick={handlePlay} aria-label={t.play + ' ' + beat.title}>
          {isPlaying ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
        </button>
        <span className="coverGenre">{beat.genre}</span>
        <div className="coverTitle">{beat.title}</div>
        {beat.exclusive_sold && <span className="soldBadge">{t.sold}</span>}
      </div>
      <div className="beatInfo">
        <div>
          <h3>{beat.title}</h3>
          <p><Activity size={10} /> {beat.bpm} BPM <span>·</span> <Music2 size={10} /> {beat.musical_key}</p>
        </div>
        <strong>{money(displayPrice, lang)}</strong>
      </div>
      <div className="beatBottom">
        <span>{beat.mood}</span>
        <span className="selectedLicensePrice">{defaultLicense?.name}</span>
      </div>
      <div className="licenseQuick">
        <button className="addLicenseButton" onClick={() => onChooseLicense(beat)}>
          {t.details}
          <Plus size={15} />
        </button>
      </div>
    </article>
  );
}

export function BeatGrid({ beats, loading, licenses, onChooseLicense }) {
  const { t } = useLang();

  if (loading) {
    return (
      <div className="beatGrid">
        {[0, 1, 2].map((i) => (
          <div className="beatCardSkeleton" key={i}>
            <div className="skeletonCover" />
            <div className="skeletonLine" />
            <div className="skeletonLine short" />
          </div>
        ))}
      </div>
    );
  }

  if (beats.length === 0) {
    return <div className="empty">{t.empty}</div>;
  }

  return (
    <div className="beatGrid">
      {beats.map((beat) => (
        <BeatCard key={beat.id} beat={beat} licenses={licenses} onChooseLicense={onChooseLicense} />
      ))}
    </div>
  );
}
