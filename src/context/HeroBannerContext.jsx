import { createContext, useEffect, useState, useCallback } from 'react';
import { listHeroBanners } from '../services/hero';

const HeroBannerContext = createContext();

export function HeroBannerProvider({ children }) {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refreshFromBackend = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const data = await listHeroBanners();
      // data items: { id, title, subtitle, imageUrl, linkUrl }
      setBanners(data);
      return data;
    } catch (e) {
      setError(e?.message || 'Failed to load hero banners');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refreshFromBackend(); }, [refreshFromBackend]);

  const value = { banners, loading, error, refreshFromBackend };
  return <HeroBannerContext.Provider value={value}>{children}</HeroBannerContext.Provider>;
}

export default HeroBannerContext;
