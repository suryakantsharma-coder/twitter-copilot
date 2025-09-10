/* global chrome */

import { isExtension, settingOptions, startOption } from '../constant/constant';

const { useState, useEffect } = require('react');

const useHomeHook = () => {
  const [isActive, setIsActive] = useState(false);
  const [setting, setSetting] = useState([]);
  const [isStartOption, setStartOption] = useState([]);

  const handleState = (isActive) => {
    if (isExtension) {
      chrome.storage.local.set({ isActive: isActive }, function () {
        // console.log('Value is set.');
      });
    } else {
      localStorage.setItem('isActive', isActive);
    }
  };

  const handleSettingState = (item, action) => {
    try {
      const data = setting.map((current) => {
        if (current?.name?.toString()?.toLowerCase() == item?.name?.toString()?.toLowerCase()) {
          return {
            name: current.name,
            description: current.description,
            type: current.type,
            action: action,
          };
        } else {
          return current;
        }
      });

      if (isExtension) {
        chrome.storage.local.set({ setting: JSON.stringify(data) }, function () {
          // console.log('Setting Saved');
        });
      } else {
        localStorage.setItem('setting', JSON.stringify(data));
      }
      getSettingState();
    } catch (err) {
      alert('Failed to save.');
      console.error('Failed to save setting');
    }
  };

  const clearSettingState = () => {
    try {
      if (isExtension) {
        chrome.storage.local.remove(['setting'], function () {
          // console.log('Setting cleared');
        });

        chrome.storage.local.remove(['keywords'], function () {
          // console.log('keywords cleared');
        });
      } else {
        localStorage.removeItem('setting');
      }
      getSettingState();
      window.close();
    } catch (err) {
      alert('Failed to remove setting');
      console.error('Failed to save setting');
    }
  };

  const getExtensionState = () => {
    try {
      if (isExtension) {
        chrome.storage.local.get(['isActive'], function (result) {
          console.error({ isActive: result?.isActive });
          setIsActive(result?.isActive);
        });
      } else {
        const storage = localStorage.getItem('isActive');
        setIsActive(storage);
      }
    } catch (err) {
      setIsActive(false);
    }
  };

  const getSettingState = async (action) => {
    try {
      if (isExtension) {
        const result = await chrome.storage.local.get(['setting']);
        const settings = JSON.parse(result?.setting);
        if (settings?.length == settingOptions?.length) {
          setSetting(settings);
        } else {
          setSetting(settingOptions);
        }
      } else {
        const setting = localStorage.getItem('setting');
        // console.log({ setting: JSON.parse(setting) });
        if (setting) setSetting(JSON.parse(setting));
        else setSetting(settingOptions);
      }
    } catch (err) {
      console.error(err);
      setSetting(settingOptions);
    }
  };

  const getStartState = async (action) => {
    try {
      if (isExtension) {
        const result = await chrome.storage.local.get(['isActive']);
        console.error('Value currently is ' + result.isActive);
        const item = startOption?.map((item) => {
          return {
            name: item?.name,
            description: item?.description,
            type: item?.type,
            action: result?.isActive,
          };
        });
        setStartOption([item]);
      } else {
        const result = localStorage.getItem('isActive');
        if (setting) {
          const item = startOption?.map((item) => {
            return {
              name: item?.name,
              description: item?.description,
              type: item?.type,
              action: result,
            };
          });
          setStartOption([item]);
        } else setStartOption(startOption);
      }
    } catch (err) {
      console.error(err);
      setStartOption(startOption);
    }
  };

  const handleChromeMessaging = (events) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: events }, (response) => {
        if (response?.success) {
          // alert("Ads blocked successfully!");
          // console.log('removed');
        } else {
          // alert("Failed to block ads. Make sure the content script is loaded.");
        }
      });
    });
  };

  const handleChromeMessagingNotification = (events) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: events }, (response) => {
        if (response?.success) {
          // alert("Ads blocked successfully!");
          console.error('notified');
        } else {
          // alert("Failed to block ads. Make sure the content script is loaded.");
        }
      });
    });
  };

  const handleExtensionState = (isActive) => {
    if (isExtension) {
      chrome.storage.local.set({ isActive: isActive }, function () {
        // console.log('Value is set.');
      });
      setIsActive(isActive);
    } else {
      localStorage.setItem('isActive', isActive);
      setIsActive(isActive);
    }
  };

  const handleRemoveItem = () => {
    try {
      handleChromeMessaging('remove');
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getStartState();
    getSettingState();
  }, []);

  useEffect(() => {
    getExtensionState();
  }, [isActive]);

  return {
    isActive,
    isStartOption,
    setting,
    handleRemoveItem,
    handleSettingState,
    handleExtensionState,
    getSettingState,
    clearSettingState,
    handleChromeMessagingNotification,
  };
};

export default useHomeHook;
