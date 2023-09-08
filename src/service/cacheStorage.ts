import {CACHE_EXPIRATION_TIME, CACHE_NAME} from "../constants/cacheInfo";
import {RecommendType} from "../types/recommend";

export const getCacheData = async (debouncedValue: string) => {
  try {
    const cacheStorage = await caches.open(CACHE_NAME);
    const cachedResponse = await cacheStorage.match(debouncedValue);

    if (cachedResponse) {
      const expirationTime = Number(cachedResponse.headers.get('Expiration'));
      if (expirationTime && expirationTime < Date.now()) {
        await cacheStorage.delete(debouncedValue);
      }
      return await cachedResponse.json();
    } else {
      return false;
    }
  } catch (error) {
    console.error('Cache Data Error : ', error);
    return false;
  }
};

export const setCacheData = async (debouncedValue: string, response: RecommendType[]) => {
  if (debouncedValue.length > 0) {
    const cache = await caches.open(CACHE_NAME);
    const expirationTime = Date.now() + CACHE_EXPIRATION_TIME;

    const init = {
      headers: {
        'Content-Type': 'application/json',
        Expiration: expirationTime.toString(),
      },
    };

    const CachedData = new Response(JSON.stringify(response), init);
    await cache.put(debouncedValue, CachedData);
  }
};
