/* global chrome */

import { settingOptions } from "../constant/constant";

const { useState, useEffect } = require("react");


const useHomeHook = () => {
  const [isActive, setIsActive] = useState(false);
  const [setting, setSetting] = useState([]);
  const [isScreiptLoaded, setIsScriptLoadded]  = useState(false);
  const [isAdEnable, setisAdEnabled] = useState(false);
  const [isShortsEnable, setisShortsEnabled] = useState(false);
  const [isSuggestionEnable, setisSuggestionEnabled] = useState(false);
  const events = [
    "AD_SHORTS_SUGGESTIONS",
    "AD_SUGGESTIONS",
    "AD_SHORTS",
    "SHORTS_SUGGESTIONS",
     "DISABLED",
     "AD",
     "SHORTS",
     "SUGGESTIONS"
]

const isExtension = true;

const handleState = (isActive) => {
  if (isExtension) {
    chrome.storage.local.set({ isActive : isActive }, function () {
      console.log('Value is set.');
    });
  } else {
    localStorage.setItem("isActive", isActive);
  }
}

const handleSettingState = (item, action) => {
    try {
      const data = setting.map((current) => {
        if (current?.name?.toString()?.toLowerCase() == item?.name?.toString()?.toLowerCase()) {
          return {
            name : current.name,
            description : current.description,
            type : current.type,
            action : action
          }
        } else {
          return current;
        }
      })
      console.log({data});
      if (isExtension) {
        chrome.storage.local.set({ setting : JSON.stringify(data) }, function () {
          console.log('Setting Saved');
      });
      } else {
        localStorage.setItem("setting", JSON.stringify(data))
      }
      getSettingState();
    } catch (err) {
        alert("Failed to save.")
        console.log("Failed to save setting");
    }
}

const clearSettingState = () => {
    try {
      if (isExtension) {
        chrome.storage.local.remove(["setting"], function () {
          console.log('Setting cleared');
      });
      } else {
        localStorage.removeItem("setting")
      }
      getSettingState();
    } catch (err) {
        alert("Failed to remove setting")
        console.log("Failed to save setting");
    }
}

const getExtensionState = () => {
  try {

    if (isExtension) {
      chrome.storage.local.get(['isActive'], function (result) {
        console.log('Value currently is ' + result.isActive);
        setIsActive(result?.isActive);
      });
    } else {
      const storage = localStorage.getItem('isActive');
      setIsActive(storage);
    }
  } catch (err) {
    setIsActive(false);
  }
}

const getSettingState = async (action) => {
  try {
    if (isExtension) {
        const result = await chrome.storage.local.get(['setting']);
        console.log('Value currently is ' + result.setting, JSON.parse(result?.setting));
        setSetting(JSON.parse(result?.setting))
    } else {
      const setting = localStorage.getItem("setting");
      console.log({setting : JSON.parse(setting)})
      if (setting)
      setSetting(JSON.parse(setting));
     else 
      setSetting(settingOptions)
    }
  } catch (err) {
    console.log(err);
    setSetting(settingOptions)
  }
}

 const handleChromeMessaging = (events, option)=> {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: events[option]},
      (response) => {
        if (response?.success) {
          alert("Ads blocked successfully!");
        } else {
          // alert("Failed to block ads. Make sure the content script is loaded.");
        }
      }
    );
  });
 }

  const handleButtonClick = ( isDisabled = false) => {
    if (!isDisabled && isScreiptLoaded) {
      let option = 0 ;

      if (isAdEnable && !isShortsEnable && !isSuggestionEnable) {
        option = 5;
      } else 
      if (isShortsEnable && !isAdEnable && !isSuggestionEnable) {
        option = 6;
      } else 
      if (isSuggestionEnable && !isAdEnable && !isShortsEnable) {
        option = 7;
      } else 

      if (isAdEnable && isShortsEnable && isSuggestionEnable) {
        option = 0;
      } else if (isAdEnable && isSuggestionEnable ) {
        option = 1;
      } else if (isAdEnable && isShortsEnable) {
        option = 2;
      } else if (isShortsEnable && isSuggestionEnable) {
        option = 3;
      }

      console.log({option})
      handleState(true);
      if (isExtension) handleChromeMessaging(events, option)
    } else {
      handleState(false);
      if (isExtension) handleChromeMessaging(events, 4)
    }
  }

  const handleExtensionState = (isActive)=> {
    if (isExtension) {
    chrome.storage.local.set({ isActive : isActive }, function () {
      console.log('Value is set.');
    });
    setIsActive(isActive);
  } else {
    localStorage.setItem("isActive", isActive);
    setIsActive(isActive);
  }
  }

  useEffect(() => {
    if (isExtension)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        function: () => {
          return document.body !== null;
        }
      }, (result) => {
        if (result && result[0].result) {
         setIsScriptLoadded(true)
        } else {
          alert("Content script is not loaded on this page.");
        }
      });
    });

    getExtensionState();
  }, [])

  useEffect(() => {
    getSettingState();
  }, [])

  useEffect(() => {
    if (isActive)
    getExtensionState();
  }, [isActive])

  


  const handleCheckBox = (e, item) => {
                    const value =  e?.target?.checked
                    console.log({e: value})

                    if (item.name == "Stop Ads") {
                      setisAdEnabled(value);
                    } else if (item.name == "Shorts") {
                      setisShortsEnabled(value)
                    } else if (item.name == "Video Suggestions") {
                      setisSuggestionEnabled(value)
                    }

                    handleSettingState(item ,value);
                  }
    return {
        isActive,
        setting,
        setisAdEnabled,
        setisShortsEnabled,
        setisSuggestionEnabled,
        handleButtonClick,
        handleSettingState,
        handleCheckBox,
        handleExtensionState,
        getSettingState,
        clearSettingState
    }
}

export default useHomeHook;