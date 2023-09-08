import React, { ChangeEvent, useEffect, useState } from 'react';
import { HiOutlineSearch } from "react-icons/hi";
import { finderApi } from "../../apis/finderApi";

const InputSearch = () => {
  //FIXME: 하단 useEffect까지는 api호출 확인을 위해 작성 (디바운싱 적용 후 삭제 부탁드려요!)
  const [inputFocus, setInputFocus] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [recommend, setRecommend] = useState([{ 'sickNm': '검색어 없음', 'sickId': 0 }]);


  const inputChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    await finderApi(inputValue)
  }

  useEffect(() => {
    console.log(inputValue)
  }, [inputValue])

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
                🔍︎ {el.sickNm}
              </div>
            )
          })}
        </div>
      )}
    </>
  );
};

export default InputSearch;
