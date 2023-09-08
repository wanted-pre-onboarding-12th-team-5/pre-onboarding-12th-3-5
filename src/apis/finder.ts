import { index } from './index';
import { getCacheData, setCacheData } from '../service/cacheStorage';

export const finder = async (debouncedValue: string) => {
  try {
    const cachedData = await getCacheData(debouncedValue);

    if (cachedData) {
      return cachedData;
    } else if (!cachedData || debouncedValue.length > 0) {
      const response = await index.get(`/sick?q=${debouncedValue}`);
      await setCacheData(debouncedValue, response.data);
      return response.data;
    }
  } catch (error) {
    console.error('An error occurred:', error);
    throw error;
  }
};
