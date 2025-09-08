/* global chrome */

import { useEffect, useState } from 'react';
import { isExtension } from '../constant/constant';

const useKeywordHook = () => {
  const [listOfKeywords, setListOfKeywords] = useState([]);
  const [value, setValue] = useState(null);
  const [isAddedFeedback, setIsAddredFeedback] = useState(false);

  const setKeyWordList = (keyword) => {
    try {
      let keywords = [];
      if (listOfKeywords?.length > 0) keywords = [...listOfKeywords, keyword];
      else keywords = [keyword];

      if (keywords?.length <= 10) {
        if (isExtension) {
          chrome.storage.local.set({ keywords: JSON.stringify(keywords) }, function () {
            console.log('keword added');
          });
        } else {
          localStorage.setItem('keywords', JSON.stringify(keywords));
        }
      } else {
        alert('You can only use 10 keywords for now.');
      }
    } catch (err) {
      console.log(err);
      alert('failed to save keyword');
    }
  };

  const setKeyWordListArray = (keywords) => {
    try {
      if (keywords?.length <= 10) {
        if (isExtension) {
          chrome.storage.local.set({ keywords: JSON.stringify(keywords) }, function () {
            console.log('keword array list added');
          });
        } else {
          localStorage.setItem('keywords', JSON.stringify(keywords));
        }
      } else {
        alert('You can only use 10 keywords for now.');
      }
    } catch (err) {
      console.log(err);
      alert('failed to save keyword');
    }
  };

  const getKeywords = () => {
    try {
      if (isExtension) {
        chrome.storage.local.get(['keywords'], function (result) {
          console.log('keword array list added');
          console.log({ keywords: JSON.parse(result?.keywords) });
          setListOfKeywords(JSON.parse(result?.keywords));
        });
      } else {
        const keywords = localStorage.getItem('keywords');
        console.log({ keywords: JSON.parse(keywords) });
        setListOfKeywords(JSON.parse(keywords));
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleInput = (e) => {
    const value = e.target.value;
    setValue(value?.toString()?.toLowerCase());
  };

  const addToKeywords = () => {
    if (value) {
      setKeyWordList(value);
      setValue('');
      setIsAddredFeedback(!isAddedFeedback);
    }
  };

  const removeKeywords = (index) => {
    try {
      const keywords = listOfKeywords;
      const updatedData = keywords?.splice(index, 1);
      console.log({ keywords, updatedData });
      setKeyWordListArray(keywords);
      setIsAddredFeedback(!isAddedFeedback);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getKeywords();
  }, [isAddedFeedback]);

  return {
    value,
    listOfKeywords,
    setKeyWordList,
    handleInput,
    addToKeywords,
    removeKeywords,
  };
};
export default useKeywordHook;
