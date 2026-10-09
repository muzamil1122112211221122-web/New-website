export const fetchCache = new Map<string, { data: any, timestamp: number }>();

export const fetchWithCache = async (url: string, ttl = 300000) => {
  const cached = fetchCache.get(url);
  if (cached && Date.now() - cached.timestamp < ttl) {
    return cached.data;
  }
  const res = await fetch(url);
  const data = await res.json();
  fetchCache.set(url, { data, timestamp: Date.now() });
  return data;
};
