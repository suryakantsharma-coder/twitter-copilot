/* global chrome */

import { useEffect, useState } from 'react';
import { isExtension } from '../constant/constant';

const useWatchLaterHook = () => {
  const [listOfWatchLater, setListOfWatchLater] = useState([]);
  const [isAddedFeedback, setIsAddredFeedback] = useState(false);

  const getKeywords = () => {
    try {
      if (isExtension) {
        chrome.storage.local.get(['mytube-watchlater'], function (result) {
          const watchlater = result['mytube-watchlater'];
          setListOfWatchLater(watchlater);
        });
      } else {
        const keywords = localStorage.getItem('mytube-watchlater');

        setListOfWatchLater(JSON.parse(keywords));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const removeWatchLater = (index) => {
    try {
      if (listOfWatchLater?.length > 0) {
        const keywords = listOfWatchLater;
        const updatedData = keywords?.filter((item, i) => i !== index);
        setListOfWatchLater(updatedData);
        chrome.storage.local.set({ 'mytube-watchlater': updatedData }, function () {
          // console.log('Saved to chrome.storage.local');
        });
        setIsAddredFeedback(!isAddedFeedback);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getKeywords();
  }, [isAddedFeedback]);

  return {
    listOfWatchLater,
    removeWatchLater,
  };
};
export default useWatchLaterHook;
