/* global chrome */

import { settingOptions } from "../constant/constant";

const { useState, useEffect } = require("react");


const useHomeHook = () => {
  const [isActive, setIsActive] = useState(false);
  const [setting, setSetting] = useState([]);

const isExtension = false;

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
        //  setIsScriptLoadded(true)
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

  


    return {
        isActive,
        setting,
        handleSettingState,
        handleExtensionState,
        getSettingState,
        clearSettingState
    }
}

export default useHomeHook;