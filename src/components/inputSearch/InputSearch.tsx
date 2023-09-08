import React, {ChangeEvent, useEffect, useState} from 'react';
import {HiOutlineSearch} from "react-icons/hi";
import {finderApi} from "../../apis/finderApi";

const InputSearch = () => {
  //FIXME: 하단 useEffect까지는 api호출 확인을 위해 작성 (디바운싱 적용 후 삭제 부탁드려요!)
  const [inputValue,setInputValue] = useState('');

  const inputChangeHandler = async (e:ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
    await finderApi(inputValue)
  }

  useEffect(()=>{
    console.log(inputValue)
  },[inputValue])

  return (
    <>
      <input
        type='text'
        defaultValue={inputValue}
        placeholder='질환명을 입력해주세요'
        className='search-input'
        onChange={inputChangeHandler}
      />
      <button type='button' className='search-btn'>
        <HiOutlineSearch />
      </button>
    </>
  );
};

export default InputSearch;
