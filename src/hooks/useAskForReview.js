/* global chrome */
import { useEffect, useState } from 'react';

function useAskForReview() {
  const EXTENSION_ID = 'lajbhepiafloclhaiophefffbhjkfncp'; // Replace with your actual extension ID
  const REVIEW_URL = `https://chrome.google.com/webstore/detail/${EXTENSION_ID}/reviews`;
  const USAGE_THRESHOLD = 10;

  const [isReviewed, setIsReviewed] = useState(false);

  const checkUserUsage = () => {
    chrome.storage.local.get(['usageCount'], (data) => {
      let usageCount = data.usageCount || 0;

      if (usageCount <= USAGE_THRESHOLD) {
        usageCount++;
        if (usageCount === USAGE_THRESHOLD) {
          const isReviewd = window.confirm('Enjoying the extension? Please leave us a review! 😊');
          if (isReviewd) {
            window.open(REVIEW_URL, '_blank');
            setIsReviewed(true);
          } else {
            const usageCount = 0;
            chrome.storage.local.set({ usageCount });
            return;
          }
        }

        chrome.storage.local.set({ usageCount });
      }
    });
  };

  const fetchUserUsage = () => {
    chrome.storage.local.get(['usageCount'], (data) => {
      let usageCount = data.usageCount || 0;
      setIsReviewed(usageCount >= USAGE_THRESHOLD);
    });
  };

  useEffect(() => {
    fetchUserUsage();
  }, []);

  return {
    isReviewed,
    checkUserUsage,
  };
}

export default useAskForReview;
