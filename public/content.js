/* global chrome */

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



     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return;
      lastExecution = now;

      const ristrict_keyword = events || ['strange parts', 'INDIAN RAILWAYS FAN CLUB -by SATYA', 'yatri doctor', 'Destroyed Phone Restore', 'Mat Armstrong', 'JerryRigEverything', 'Linus Tech Tips', 'Joe HaTTab', 'Gyan Therapy'];
      hideElementsByTagName([ 'ytd-rich-item-renderer', 'ytd-compact-video-renderer'], ristrict_keyword);
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    // console.log("Throttled observer is running.");

}

function CUSTOM_PARTS_WITH_AD_BLOCKER (isShorts, isSuggestion) {
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



//     window.addEventListener('DOMContentLoaded', () => {
//     const iframes = document.getElementsByTagName('iframe');
//     for (let iframe of iframes) {
//         if (iframe.src.includes('imasdk.googleapis.com')) {
//             iframe.remove();
//             console.log('Iframe removed successfully.');
//         } else {
//           console.log({iframe})
//         }
//     }
// });

     function mxAds ()  {
      const iframes = document.getElementsByTagName('iframe');
    for (let iframe of iframes) {
        if (iframe.src.includes('imasdk.googleapis.com')) {
            iframe.remove();
            console.log('Iframe removed successfully.');
        } else {
          console.log({iframe})
        }
    }
     }


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
        // console.error(`Root element #${rootId} not found`);
    }
    };


    observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; 
      lastExecution = now;

      hideElementsByClass([
        'ad-container',
        'video-ads',
        'ytp-ad-module',
      ]);

      
      hideElementsByClass([
        (isShorts) &&  'style-scope ytd-rich-shelf-renderer',
        (isShorts) && 'style-scope yt-horizontal-list-renderer', //shorts
      ]);

  
      (isSuggestion) && hideChildElementById('columns','secondary'); //suggestions

      (isShorts) && hideElementsByTagName(['ytd-reel-shelf-renderer']) 

      const video = document.querySelector('video');
      if (video && document.querySelector('.ad-showing')) {
        video.currentTime = video.duration; // Skip ad
      }

      // hideMxPlayerAds();

      mxAds();

    });

    observer.observe(document.body, { childList: true, subtree: true });
    // console.log("Throttled observer is running.");
};

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
    // console.log("Throttled observer is running.");
};


// filter operations 

async function Operations(data) {
 if (data) {
      const setting = JSON.parse(data);
      let isAds = false;
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

      if (isActive) {
        setting.map((item) => {
          if (item?.name?.toString()?.toLowerCase() == "shorts") {
            isShorts = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "block ads") {
            isAds = item?.action;
          }else if (item?.name?.toString()?.toLowerCase() == "video suggestions") {
            isSuggestion = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "filter by keywords") {
            isFiltered = item?.action;
          }
        })

        if (isFiltered && events?.length > 0)
          FILTER_CONTENT_WITH_KEYWORDS(events);
  
        if (isAds) {
          CUSTOM_PARTS_WITH_AD_BLOCKER(isShorts, isSuggestion)
        } else {
          CUSTOM_PARTS(isShorts, isSuggestion)
        }
      }

    }
}



chrome.storage.local.get(['setting'], function(result) {
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


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "remove") {
        window.location.reload();
        sendResponse({ success: true });
    }
});



  
