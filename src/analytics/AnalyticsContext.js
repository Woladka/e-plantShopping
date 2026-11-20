import { createContext, useContext } from 'react';

export const AnalyticsContext = createContext(null);

export function useAnalytics() {
  const analytics = useContext(AnalyticsContext);
  if (!analytics) throw new Error('useAnalytics must be inside AnalyticsProvider');
  return analytics;
}
