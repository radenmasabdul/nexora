const requestCache = new Map<string, Promise<unknown>>();
const CACHE_DURATION = 1000;

export const createCacheKey = (
  endpoint: string, 
  params?: Record<string, unknown>
): string => {
  return `${endpoint}_${JSON.stringify(params || {})}`;
};

export const cachedRequest = async <T>(
  cacheKey: string,
  requestFn: () => Promise<T>
): Promise<T> => {
  if (requestCache.has(cacheKey)) {
    return requestCache.get(cacheKey) as Promise<T>;
  }

  const promise = requestFn();
  requestCache.set(cacheKey, promise as Promise<unknown>);

  promise.finally(() => {
    setTimeout(() => {
      requestCache.delete(cacheKey);
    }, CACHE_DURATION);
  });

  return promise;
};

export const clearCache = (cacheKey: string): void => {
  requestCache.delete(cacheKey);
};

export const clearAllCache = (): void => {
  requestCache.clear();
};

export const hasCache = (cacheKey: string): boolean => {
  return requestCache.has(cacheKey);
};