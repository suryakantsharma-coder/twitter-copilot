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

function CUSTOM_PARTS_WITH_AD_BLOCKER (isShorts, isSuggestion, isPip) {
    let lastExecution = 0; 
    const throttleTime = 200;

    const hideElementsByClass = (classNames) => {
      classNames.forEach((className) => {
        Array.from(document.getElementsByClassName(className)).forEach((item) => {
          item.hidden = true;
        });
      });
    };

    const hideSideBarShortElementsByClass = (classNames) => {
      const elementText = classNames?.text;
      console.log({elementText, classNames})
      classNames?.list?.forEach((className) => {
        Array.from(document.getElementsByClassName(className)).forEach((item) => {
          if (item?.innerText?.toString()?.toLowerCase() == elementText?.toString()?.toLowerCase()) {
            item.hidden = true;
          }
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
        }
    }
     }

     function hideShortPageById() {
      const element = document.getElementById("shorts-container");
      if (element) {
        element.style.display = "none"
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

    const addPiPButtonOnce = () => {
      const svg = `<svg class="ytp-subtitles-button-icon" width="100%" height="100%" viewBox="0 0 36.00 36.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path> </g> </g></svg>`

    if (document.querySelector('.custom-pip-button')) return;

    const controls = document.querySelector('.ytp-right-controls');
    if (!controls) return;

    const button = document.createElement('button');
    button.innerHTML = svg || '🖥️'; 
    button.classList.add('custom-pip-button');
    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.width = '46px';
    button.style.height = '37px';
    button.title = 'Picture-in-Picture Mode';

    button.onclick = () => {
        const video = document.querySelector('video');
        if (video) {
            video.requestPictureInPicture().catch(console.error);
        } else {
            alert('No video found!');
        }
    };

    controls.prepend(button);
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

      {isShorts && hideSideBarShortElementsByClass({
        list : ['style-scope ytd-guide-entry-renderer'],
        text : 'shorts'
      })}

      isShorts && hideShortPageById("shorts-container");



  
      (isSuggestion) && hideChildElementById('columns','secondary'); //suggestions

      (isShorts) && hideElementsByTagName(['ytd-reel-shelf-renderer']) 

      isPip && addPiPButtonOnce();

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

function CUSTOM_PARTS (isShorts, isSuggestion, isPip) {
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

    function hideShortPageById() {
      const element = document.getElementById("shorts-container");
      if (element) {
        element.style.display = "none"
      }
     }


     const hideSideBarShortElementsByClass = (classNames) => {
      const elementText = classNames?.text;
      console.log({elementText, classNames})
      classNames?.list?.forEach((className) => {
        Array.from(document.getElementsByClassName(className)).forEach((item) => {
          if (item?.innerText?.toString()?.toLowerCase() == elementText?.toString()?.toLowerCase()) {
            item.hidden = true;
          }
        });
      });
    };


    const addPiPButtonOnce = () => {
      const svg = `<svg class="ytp-subtitles-button-icon" width="100%" height="100%" viewBox="0 0 36.00 36.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path> </g> </g></svg>`

    if (document.querySelector('.custom-pip-button')) return;

    const controls = document.querySelector('.ytp-right-controls');
    if (!controls) return;

    const button = document.createElement('button');
    button.innerHTML = svg || '🖥️'; 
    button.classList.add('custom-pip-button');
    button.style.background = 'transparent';
    button.style.border = 'none';
    button.style.width = '46px';
    button.style.height = '37px';
    button.title = 'Picture-in-Picture Mode';

    button.onclick = () => {
        const video = document.querySelector('video');
        if (video) {
            video.requestPictureInPicture().catch(console.error);
        } else {
            alert('No video found!');
        }
    };

    controls.prepend(button);
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

        {isShorts && hideSideBarShortElementsByClass({
        list : ['style-scope ytd-guide-entry-renderer'],
        text : 'shorts'
      })}

      isShorts && hideShortPageById("shorts-container");

      isPip && addPiPButtonOnce();

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
      let isPip = false;

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
          } else if (item?.name?.toString()?.toLowerCase() == "picture in picture mode") {
            isPip = item?.action
          }
        })

        if (isFiltered && events?.length > 0)
          FILTER_CONTENT_WITH_KEYWORDS(events);
  
        if (isAds) {
          CUSTOM_PARTS_WITH_AD_BLOCKER(isShorts, isSuggestion, isPip)
        } else {
          CUSTOM_PARTS(isShorts, isSuggestion, isPip)
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



  
