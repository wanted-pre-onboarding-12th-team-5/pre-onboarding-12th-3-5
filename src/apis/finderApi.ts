import { index } from './index';
import { getCacheData, setCacheData } from '../service/cacheStorage';
import axios, { CancelTokenSource } from 'axios';

export const finderApi = async (debouncedValue: string, cancelToken: CancelTokenSource) => {
  try {
    const cachedData = await getCacheData(debouncedValue);
    if (cachedData) {
      return cachedData;
    } else if (debouncedValue.length > 0) {
      const response = await index.get(`/sick?q=${debouncedValue}`, {
        cancelToken: cancelToken.token,
      });
      await setCacheData(debouncedValue, response.data);
      return response.data;
    }
    return [{ 'sickNm': '검색어 없음', 'sickId': 0 }];
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request was canceled');
      return [{ 'sickNm': '검색어 없음', 'sickId': 0 }];
    } else {
      console.error('An error occurred:', error);
      throw error;
    }
  }
};

