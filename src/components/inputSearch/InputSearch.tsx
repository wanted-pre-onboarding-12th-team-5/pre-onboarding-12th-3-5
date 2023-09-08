import React, { ChangeEvent, useEffect, useState, useRef  } from 'react';
import { HiOutlineSearch } from "react-icons/hi";
import { finderApi } from "../../apis/finderApi";
import axios, { CancelTokenSource } from 'axios';
import styled from 'styled-components';

const containsOnlyConsonantsOrVowels = (str: string) => {
  const regex = /([ㄱ-ㅎ]+|[ㅏ-ㅣ]+)/g;
  return regex.test(str);
};

const InputSearch = () => {
  const [inputFocus, setInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recommend, setRecommend] = useState([{ 'sickNm': '검색어 없음', 'sickId': 0 }]); //처음 인덱스 길이 1
  const [debouncedValue, setDebouncedValue] = useState(inputValue);
  const [selected, setSelected] = useState(-1);

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      if (selected === 0 ) {
        setSelected(-1);
        event.preventDefault();
      } else if (selected > 0) {
        setSelected((prevSelected) => prevSelected - 1);
      }
    } else if (event.key === 'ArrowDown' && selected < recommend.length - 1) {
      event.preventDefault();
      setSelected((prevSelected) => prevSelected + 1);
    } else if (event.key === 'Enter' && selected !== -1) {
      event.preventDefault();
      setInputValue(recommend[selected].sickNm);
      setSelected(-1);
    }
  };  
  
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
        onKeyDown={handleKeyDown}
      />
      <button type='button' className='search-btn'>
        <HiOutlineSearch />
      </button>

      {inputFocus && (
        <div>
          <p>추천 검색어</p>
          {recommend.map((el, idx) => {
            return (
              <StyledList 
                key={idx}
                className={selected === idx ? 'selected' : ''}
              >
                <HiOutlineSearch /> {el.sickNm}
              </StyledList>
            )
          })}
        </div>
      )}
    </>
  );
};

export default InputSearch;

// 테스트 디자인 : 작업하실 때 지워주세요 !
const StyledList = styled.div`
  background-color: beige;
  &.selected {
    background-color: aqua;
  }
`;