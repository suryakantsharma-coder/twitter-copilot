/* global chrome */
console.log("Content script loaded");

let observer = null;

function REMOVE_SCRIPT() {
    if (observer) {
        observer.disconnect();
    }

    
    // If you've dynamically added any elements like a script tag, remove them
    const injectedScript = document.getElementById('injectedScriptId');
    if (injectedScript) {
        injectedScript.remove();
    }

    console.log("Script removed!");
    window.location.reload();
}

async function FILTER_CONTENT_WITH_KEYWORDS (events) {

    let lastExecution = 0; 
    const throttleTime = 200;

    const hideElementsByTagName = (classNames, keywords) => {
      const lowerCaseKeywords = keywords.map(keyword => keyword.toLowerCase());
  
      classNames.forEach((className) => {
        document.querySelectorAll(className).forEach((item) => {
            const textContent = item.innerText?.toLowerCase();
            const matchFound = lowerCaseKeywords.some(keyword => textContent.includes(keyword));
            item.style.display = matchFound ? '' : 'none';
        });
    });
  }

  const checkYouTubeInput = (inputSelector, keywords) => {
    const inputElements = document.getElementsByClassName(inputSelector);
    console.log({inputElements});  // Debugging: Check if elements are correctly selected
    
    // Ensure that there is at least one element and select the first one
    if (inputElements.length === 0) return;

    const inputElement = inputElements[0];  // Select the first element

    // inputElement.addEventListener('input', () => {  // Use 'input' for real-time tracking
    //     const inputValue = inputElement.value.toLowerCase();
    //     console.log('Input value:', inputValue);  // Debugging: Check the input value
    //     const matchFound = keywords.some(keyword => inputValue.includes(keyword.toLowerCase()));
        
    //     if (matchFound) {
    //         inputElement.form.submit();  // Submit the form if keyword matches
    //     } else {
    //         alert('Search restricted due to keyword restrictions.');  // Alert if no match found
    //     }
    // });

    // Listen for 'keydown' event to detect Enter key
  //   inputElement.addEventListener('keydown', (event) => {
  //     if (event.key === 'Enter') {  // Check if the pressed key is Enter
  //         const inputValue = inputElement.value.toLowerCase();
  //         console.log('Input value:', inputValue);  // Debugging: Check the input value
  //         const matchFound = keywords.some(keyword => inputValue.includes(keyword.toLowerCase()));
          
  //         if (matchFound) {
  //             inputElement.form.submit();  // Submit the form if keyword matches
  //         } else {
  //             alert('Search restricted due to keyword restrictions.');  // Alert if no match found
  //         }
  //     }
  // });
};



     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return;
      lastExecution = now;

      const ristrict_keyword = events || ['strange parts', 'INDIAN RAILWAYS FAN CLUB -by SATYA', 'yatri doctor', 'Destroyed Phone Restore', 'Mat Armstrong', 'JerryRigEverything', 'Linus Tech Tips', 'Joe HaTTab', 'Gyan Therapy'];
      hideElementsByTagName([ 'ytd-rich-item-renderer', 'ytd-compact-video-renderer'], ristrict_keyword);
      // checkYouTubeInput('ytSearchboxComponentInput yt-searchbox-input title', ristrict_keyword);
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");

}

function CUSTOM_PARTS (isShorts, isSuggestion) {
    let lastExecution = 0; 
    const throttleTime = 200;

    const hideElementsByClass = (classNames) => {
      classNames.forEach((className) => {
        Array.from(document.getElementsByClassName(className)).forEach((item) => {
          item.hidden = true;
        });
      });
    };

    const hideElementsByTagName = (classNames) => {
      classNames.forEach((className) => {
        Array.from(document.getElementsByTagName(className)).forEach((item) => {
          item.hidden = true;
        });
      });
    };

    function hideChildElementById(rootId, childId) {
    const rootElement = document.getElementById(rootId);
    if (rootElement) {
        const childElement = rootElement.querySelector(`#${childId}`);
        if (childElement) {
            childElement.style.setProperty("display", "none", "important");
        } else {
            console.error(`Child element #${childId} not found within #${rootId}`);
        }
    } else {
        console.error(`Root element #${rootId} not found`);
    }
    };

    const toggleFullscreen = () => {
      const fullscreenButton = document.querySelector('.icon-button.fullscreen-icon');
      console.log({p : "fullscreen trigger"})
      if (fullscreenButton) {
        const isFullscreen = document.fullscreenElement || document.webkitFullscreenElement;
        if (!isFullscreen) {
          fullscreenButton.click();
        } else {
          document.exitFullscreen?.() || document.webkitExitFullscreen?.();
        }
      } else {
        console.warn("Fullscreen button not found");
      }
    };

    window.toggleFullscreen = toggleFullscreen;

    observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; 
      lastExecution = now;
      
      hideElementsByClass([
        (isShorts) &&  'style-scope ytd-rich-shelf-renderer',
        (isShorts) && 'style-scope yt-horizontal-list-renderer', //shorts
      ]);

  
      (isSuggestion) && hideChildElementById('columns','secondary'); //suggestions

      (isShorts) && hideElementsByTagName(['ytd-reel-shelf-renderer']) 
    });

    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};


// filter operations 

async function Operations(data) {
 if (data) {
      const setting = JSON.parse(data);
      let isShorts = false;
      let isSuggestion = false;
      let isFiltered = false;

      // check if the extenstion is active or not
      const response = await chrome.storage.local.get(['isActive']);
      const responseEvent = await chrome.storage.local.get(['keywords']);
      const isActive = response?.isActive;
      let events = [];
      if (responseEvent?.keywords) 
      events = JSON.parse(responseEvent?.keywords);

      console.log ({isActive, events});

      if (isActive) {
        setting.map((item) => {
          if (item?.name?.toString()?.toLowerCase() == "shorts") {
            isShorts = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "video suggestions") {
            isSuggestion = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "filter by keywords.") {
            isFiltered = item?.action;
          }
        })
  
        console.log({
          isShorts,
          isSuggestion,
          isFiltered
        })

        if (isFiltered)
          FILTER_CONTENT_WITH_KEYWORDS(events);
  
        CUSTOM_PARTS(isShorts, isSuggestion)
      }

    }
}


// load storage 

chrome.storage.local.get(['setting'], function(result) {
    console.log('Value currently is ' + result.setting, JSON.parse(result?.setting));
    if (result?.setting) {
      Operations(result?.setting);
    }
});


chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes?.setting?.newValue) {
      if (observer) {
        observer.disconnect();
      }
      Operations(changes?.setting?.newValue);
    }
});


// remove 

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    console.log({message})
    if (message.action === "remove") {
        window.location.reload();
        console.log("AD_SHORTS_SUGGESIONS");
        sendResponse({ success: true });
    }
});



  
