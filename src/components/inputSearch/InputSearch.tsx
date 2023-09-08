import axios, { CancelTokenSource } from 'axios';
import React, {
  ChangeEvent,
  useEffect,
  useState,
  useRef,
  FormEvent,
} from 'react';
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
  const [selected, setSelected] = useState(-1);

  const cancelToken = useRef<CancelTokenSource | null>(null);

  const fetchRecommendations = async () => {
    if (!containsOnlyConsonantsOrVowels(inputValue)) {
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
      cancelToken.current = axios.CancelToken.source();
      const recommendations = await finderApi(inputValue, cancelToken.current);
      if (recommendations) {
        setRecommend(recommendations);
      }
    } else {
      setRecommend([{ sickNm: '검색어 없음', sickId: 0 }]);
    }
  };

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

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      if (selected === 0) {
        setSelected(-1);
        event.preventDefault();
      } else if (selected > 0) {
        setSelected((prevSelected) => prevSelected - 1);
      }
    } else if (event.key === 'ArrowDown' && selected < recommend.length - 1) {
      event.preventDefault();
      setSelected((prevSelected) => prevSelected + 1);
    }
  };

  const handleInputSubmit = (e: FormEvent) => {
    e.preventDefault();
    fetchRecommendations();
  };

  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchRecommendations();
    }, 500);
    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]);

  useEffect(() => {
    const selectedElement = document.querySelector('.selected');
    if (selectedElement) {
      selectedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selected]);

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>{`국내 모든 임상시험 검색하고\n온라인으로 참여하기`}</h1>
      </header>
      <form onSubmit={handleInputSubmit} className={styles.searchBarWrapper}>
        <HiOutlineSearch />
        <input
          type="text"
          value={inputValue}
          placeholder="질환명을 입력해주세요"
          className="search-input"
          onChange={inputChangeHandler}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
        />
        <button type="submit" className={styles.searchButton}>
          <span>검색</span>
        </button>
      </form>
      {inputFocus && (
        <ul className={styles.resultWrapper}>
          <span>추천 검색어</span>
          {recommend.map((item, idx) => {
            return (
              <li
                key={`${idx}-${item.sickId}`}
                className={`${selected === idx ? styles.selected : ''} ${
                  styles.innerElement
                }`}>
                <HiOutlineSearch />
                <span>{item.sickNm}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default InputSearch;
