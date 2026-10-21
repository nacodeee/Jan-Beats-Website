import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { defaultLicenseItems } from '../config/licenses';

export function useLicenses(lang = 'es') {
  const [licenses, setLicenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLicenses = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('active', true)
      .order('sort', { ascending: true });

    if (!error && data) {
      const mapped = data.map((l) => ({
        ...l,
        name: lang === 'es' ? l.name_es : l.name_en,
        items: defaultLicenseItems[lang][l.id] || [],
      }));
      setLicenses(mapped);
    }
    setLoading(false);
  }, [lang]);

  useEffect(() => {
    fetchLicenses();
  }, [fetchLicenses]);

  return { licenses, loading, refetch: fetchLicenses };
}
