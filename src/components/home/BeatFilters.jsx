import { Search, X } from 'lucide-react';
import { useLang } from '../../context/LangContext';

export function BeatFilters({ genre, setGenre, query, setQuery, sort, setSort }) {
  const { t } = useLang();
  const genreOptions = [
    { value: 'all', label: t.all },
    { value: 'Trap', label: 'Trap' },
    { value: 'Reggaetón', label: 'Reggaetón' },
    { value: 'R&B', label: 'R&B' },
  ];

  return (
    <div className="filters">
      <div className="searchBox">
        <Search size={17} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search}
          aria-label={t.search}
        />
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="genreFilters">
        {genreOptions.map((g) => (
          <button
            key={g.value}
            className={genre === g.value ? 'active' : ''}
            onClick={() => setGenre(g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <select aria-label={t.sort} value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="newest">{t.newest}</option>
        <option value="low">{t.low}</option>
        <option value="high">{t.high}</option>
      </select>
    </div>
  );
}
