/* global chrome */

import { useEffect, useState } from 'react';

const test = false;

const useSlowMotionPlaybackHook = () => {
  const [options, setOptions] = useState({
    playbackSpeed: 0.75,
    shortcutKey: 'S',
  });

  function getLocalOptions() {
    try {
      if (options) {
        if (test) {
          const data = localStorage.getItem('smplayback');
          setOptions(JSON.parse(data));
        } else
          chrome.storage.local.get(['smplayback'], (data) => {
            if (data.smplayback) {
              const state = JSON.parse(data.smplayback);
              console.log({ state });
              setOptions(state);
            } else {
              setLocalOptions({
                playbackSpeed: 0.75,
                shortcutKey: 'S',
              });
            }
          });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function setLocalOptions(options) {
    try {
      if (test) localStorage.setItem('smplayback', JSON.stringify(options));
      else
        chrome.storage.local.set({ smplayback: JSON.stringify(options) }, function () {
          console.log('smplayback added');
        });
    } catch (err) {
      console.log(err);
      alert('failed to save smplayback');
    }
  }

  useEffect(() => {
    getLocalOptions();
  }, []);

  return {
    options,
    setOptions,
    getLocalOptions,
    setLocalOptions,
  };
};
export default useSlowMotionPlaybackHook;
