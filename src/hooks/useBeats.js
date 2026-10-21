import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { getCoverUrl, getPreviewUrl } from '../lib/storage';

export function useBeats() {
  const [beats, setBeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBeats = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from('public_beats')
      .select('*')
      .order('sort_date', { ascending: false });

    if (fetchError) {
      setError(fetchError);
      setBeats([]);
    } else {
      const mapped = (data || []).map((b) => ({
        ...b,
        coverUrl: getCoverUrl(b.cover_path),
        previewUrl: getPreviewUrl(b.preview_path),
      }));
      setBeats(mapped);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBeats();
  }, [fetchBeats]);

  return { beats, loading, error, refetch: fetchBeats };
}
