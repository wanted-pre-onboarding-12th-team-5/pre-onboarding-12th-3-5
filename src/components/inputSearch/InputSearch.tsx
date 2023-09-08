import React, {useEffect, useState} from 'react';
import {HiOutlineSearch} from "react-icons/hi";

const InputSearch = () => {
  const [inputValue,setInputValue] = useState('');

  const inputChangeHandler = () => {

  }

  return (
    <>
      <input
        type='text'
        value={inputValue}
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
