import axios, { CancelTokenSource } from 'axios';
import React, { ChangeEvent, useEffect, useState, useRef } from 'react';

import { HiOutlineSearch } from 'react-icons/hi';
import { finderApi } from '../../apis/finderApi';

import styles from './InputSearch.module.scss';

const containsOnlyConsonantsOrVowels = (str: string) => {
  const regex = /([ㄱ-ㅎ]+|[ㅏ-ㅣ]+)/g;
  return regex.test(str);
};

const InputSearch = () => {
  const [inputFocus, setInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recommend, setRecommend] = useState([
    { sickNm: '검색어 없음', sickId: 0 },
  ]);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const cancelToken = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!containsOnlyConsonantsOrVowels(debouncedValue)) {
        if (cancelToken.current) {
          cancelToken.current.cancel();
        }
        cancelToken.current = axios.CancelToken.source();
        const recommendations = await finderApi(
          debouncedValue,
          cancelToken.current
        );
        if (recommendations) {
          setRecommend(recommendations);
        }
      } else {
        setRecommend([{ sickNm: '검색어 없음', sickId: 0 }]);
      }
    };

    fetchRecommendations();
  }, [debouncedValue]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]);

  const inputChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputFocus = () => {
    setInputFocus(true);
  };

  const handleInputBlur = () => {
    setInputFocus(false);
    setInputValue('');
    setRecommend([{ sickNm: '검색어 없음', sickId: 0 }]);
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>{`국내 모든 임상시험 검색하고\n온라인으로 참여하기`}</h1>
      </header>
      <div className={styles.searchBarWrapper}>
        <HiOutlineSearch />
        <input
          type="text"
          value={inputValue}
          placeholder="질환명을 입력해주세요"
          className="search-input"
          onChange={inputChangeHandler}
          onFocus={handleInputFocus}
          // onBlur={handleInputBlur}
        />
        <button type="button" className={styles.searchButton}>
          <span>검색</span>
        </button>
      </div>

      {inputFocus && (
        <ul>
          <span>추천 검색어</span>
          {recommend.map((el, idx) => {
            return (
              <li key={idx}>
                <HiOutlineSearch /> {el.sickNm}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default InputSearch;
