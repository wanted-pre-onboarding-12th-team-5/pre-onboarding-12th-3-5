import React, { ChangeEvent, useEffect, useState, useRef  } from 'react';
import { HiOutlineSearch } from "react-icons/hi";
import { finderApi } from "../../apis/finderApi";
import axios, { CancelTokenSource } from 'axios';

const containsOnlyConsonantsOrVowels = (str: string) => {
  const regex = /([ㄱ-ㅎ]+|[ㅏ-ㅣ]+)/g;
  return regex.test(str);
};

const InputSearch = () => {
  const [inputFocus, setInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recommend, setRecommend] = useState([{ 'sickNm': '검색어 없음', 'sickId': 0 }]);
  const [debouncedValue, setDebouncedValue] = useState(inputValue);

  const cancelToken = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!containsOnlyConsonantsOrVowels(debouncedValue)) {
        if (cancelToken.current) {
          cancelToken.current.cancel();
        }
        cancelToken.current = axios.CancelToken.source();
        const recommendations = await finderApi(debouncedValue, cancelToken.current);
        if (recommendations) {
          setRecommend(recommendations);
        }
      } else {
        setRecommend([{ 'sickNm': '검색어 없음', 'sickId': 0 }]);
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
    setInputValue(e.target.value)
  };

  const handleInputFocus = () => {
    setInputFocus(true)
  }

  const handleInputBlur = () => {
    setInputFocus(false)
    setInputValue('')
    setRecommend([{ 'sickNm': '검색어 없음', 'sickId': 0 }]);
  }
  
  return (
    <>
      <input
        type='text'
        defaultValue={inputValue}
        placeholder='질환명을 입력해주세요'
        className='search-input'
        onChange={inputChangeHandler}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
      />
      <button type='button' className='search-btn'>
        <HiOutlineSearch />
      </button>

      {inputFocus && (
        <div>
          <p>추천 검색어</p>
          {recommend.map((el, idx) => {
            return (
              <div key={idx}>
                <HiOutlineSearch /> {el.sickNm}
              </div>
            )
          })}
        </div>
      )}
    </>
  );
};

export default InputSearch;
