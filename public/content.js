/* global chrome */
console.log("Content script loaded");

let observer = null;

function AD_SHORTS_SUGGESTIONS () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

    const hideElementsCheckByTagName = (classNames) => {
      classNames.forEach((className) => {
        Array.from(document.getElementsByTagName(className)).forEach((item) => {
            if (item?.innerText?.toString()?.toLowerCase() == ("Nishkarsh Sharma")?.toLowerCase()) {
                item.hidden = true
            }
        });
      });
    };

     // Function to handle fullscreen toggle
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
    observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;

      // Hide specified elements
      hideElementsByClass([
        'ad-container',
        'video-ads',
        'ytp-ad-module',
        'style-scope yt-horizontal-list-renderer', //shorts
        //'style-scope ytd-watch-flexy' //suggestions
        // 'style-scope ytd-item-section-renderer', //shorts
      ]);

      hideElementsCheckByTagName([
        "yt-simple-endpoint style-scope yt-formatted-string"
      ])

      hideElementsByTagName([
        'ytd-watch-next-secondary-results-renderer' //suggestions
      ]);

      // Skip video ads if they're playing
      const video = document.querySelector('video');
      if (video && document.querySelector('.ad-showing')) {
        video.currentTime = video.duration; // Skip ad
      }
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

function SHORTS_SUGGESTIONS () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

    const hideElementsCheckByTagName = (classNames) => {
      classNames.forEach((className) => {
        Array.from(document.getElementsByTagName(className)).forEach((item) => {
            if (item?.innerText?.toString()?.toLowerCase() == ("Nishkarsh Sharma")?.toLowerCase()) {
                item.hidden = true
            }
        });
      });
    };

     // Function to handle fullscreen toggle
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
      observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;

      // Hide specified elements
      hideElementsByClass([
        'style-scope yt-horizontal-list-renderer', //shorts
      ]);

      hideElementsByTagName([
        'ytd-watch-next-secondary-results-renderer' //suggestions
      ]);
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

function AD_SUGGESTIONS () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

     // Function to handle fullscreen toggle
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;

      // Hide specified elements
      hideElementsByClass([
        'ad-container',
        'video-ads',
        'ytp-ad-module',
      ]);


      hideElementsByTagName([
        'ytd-watch-next-secondary-results-renderer' //suggestions
      ]);

      // Skip video ads if they're playing
      const video = document.querySelector('video');
      if (video && document.querySelector('.ad-showing')) {
        video.currentTime = video.duration; // Skip ad
      }
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

function AD_SHORTS () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

     // Function to handle fullscreen toggle
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;

      // Hide specified elements
      hideElementsByClass([
        'ad-container',
        'video-ads',
        'ytp-ad-module',
        'style-scope yt-horizontal-list-renderer', //shorts
        //'style-scope ytd-watch-flexy' //suggestions
        // 'style-scope ytd-item-section-renderer', //shorts
      ]);

      // Skip video ads if they're playing
      const video = document.querySelector('video');
      if (video && document.querySelector('.ad-showing')) {
        video.currentTime = video.duration; // Skip ad
      }
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

function AD () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

     // Function to handle fullscreen toggle
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;

      // Hide specified elements
      hideElementsByClass([
        'ad-container',
        'video-ads',
        'ytp-ad-module',
      ]);

      // Skip video ads if they're playing
      const video = document.querySelector('video');
      if (video && document.querySelector('.ad-showing')) {
        video.currentTime = video.duration; // Skip ad
      }
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

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

function SHORTS () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

     // Function to handle fullscreen toggle
    const toggleFullscreen = () => {
      const fullscreenButton = document.querySelector('.icon-button.fullscreen-icon');
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;

      // Hide specified elements
      hideElementsByClass([
        'style-scope yt-horizontal-list-renderer', //shorts
        //'style-scope ytd-watch-flexy' //suggestions
        // 'style-scope ytd-item-section-renderer', //shorts
      ]);

      hideElementsByTagName([
        'ytd-reel-shelf-renderer'
      ])


      // document.getElementsByTagName("ytd-rich-item-renderer")[2].innerText?.toLowerCase().includes("apradh ka sach")
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

function SUGGESTIONS () {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

    // Utility function to hide elements by class name
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

     // Function to handle fullscreen toggle
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

    // Define globally accessible function
    window.toggleFullscreen = toggleFullscreen;

    // Create a throttled MutationObserver
     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return; // Skip execution if throttling is active
      lastExecution = now;


      hideElementsByTagName([
        'ytd-watch-next-secondary-results-renderer' //suggestions
      ]);
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");
};

async function FILTER_CONTENT_WITH_KEYWORDS (events) {

    let lastExecution = 0; 
    const throttleTime = 200;

    const hideElementsByTagName = (classNames, keywords) => {
      console.log("HIDE_ELEMNT_BY_TAG_NAME")
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


     // Function to handle fullscreen toggle
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

      const ristrict_keyword = events || ['strange parts', 'INDIAN RAILWAYS FAN CLUB -by SATYA', 'yatri doctor', 'Destroyed Phone Restore', 'Mat Armstrong', 'JerryRigEverything', 'Linus Tech Tips', 'Joe HaTTab', 'Gyan Therapy'];
      hideElementsByTagName([ 'ytd-rich-item-renderer', 'ytd-compact-video-renderer'], ristrict_keyword);
      // checkYouTubeInput('ytSearchboxComponentInput yt-searchbox-input title', ristrict_keyword);
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("Throttled observer is running.");

}

function CUSTOM_PARTS (isShorts, isSuggestion) {
    let lastExecution = 0; // Store the last execution timestamp
    const throttleTime = 200; // Time in ms to throttle executions

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

    const hideSuggestionElementsById = () => {
      const element = document.getElementById("secondary");
      if (element) {
        element.style.display = "none";
      } else {
        console.error("Element not found");
      }
    };

    const hideElementsCheckByTagName = (classNames) => {
      classNames.forEach((className) => {
        Array.from(document.getElementsByTagName(className)).forEach((item) => {
            if (item?.innerText?.toString()?.toLowerCase() == ("Nishkarsh Sharma")?.toLowerCase()) {
                item.hidden = true
            }
        });
      });
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

     (isShorts) && hideElementsByTagName([
        'ytd-reel-shelf-renderer'
      ])

      (isSuggestion) && hideSuggestionElementsById(); //suggestions

      // Skip video ads if they're playing
      // const video = document.querySelector('video');
      // if (video && document.querySelector('.ad-showing')) {
      //   video.currentTime = video.duration; 
      // }
    });

    // Start observing changes in the body
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
      // CUSTOM_PARTS(isShorts, isSuggestion)

    }



});


chrome.storage.onChanged.addListener(function(changes, namespace) {
     console.log("change recived!", changes);

     console.log('Value currently is ' + changes.setting.newValue, JSON.parse(changes?.setting?.newValue));

    if (changes?.setting?.newValue) {
      Operations(changes?.setting?.newValue);
      // const setting = JSON.parse(changes?.setting?.newValue);
      // let isShorts = false;
      // let isSuggestion = false;

      // setting.map((item) => {
      //   if (item?.name?.toString()?.toLowerCase() == "shorts") {
      //     isShorts = item?.action;
      //   } else if (item?.name?.toString()?.toLowerCase() == "video suggestions") {
      //     isSuggestion = item?.action;
      //   }
      // })

      // console.log({
      //   isShorts,
      //   isSuggestion
      // })

      // CUSTOM_PARTS(isShorts, isSuggestion)

    }
});



// Listen for messages from the React UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    // if (observer) 
    //     REMOVE_SCRIPT()

    console.log({message})
    if (message.action === events[0]) {
        // AD_SHORTS_SUGGESTIONS();
        SHORTS();
        FILTER_CONTENT_WITH_KEYWORDS();
        console.log("AD_SHORTS_SUGGESIONS");
        sendResponse({ success: true });
    } else
    if (message.action === events[1]) {
        AD_SUGGESTIONS();
        console.log("AD_SUGGESIONS");
        sendResponse({ success: true });
    } else
    if (message.action === events[2]) {
        AD_SHORTS();
        console.log("AD_SHORTS");
        sendResponse({ success: true });
    } else
    if (message.action === events[3]) {
        console.log("SHORTS_SUGGESTIONS");
        SHORTS_SUGGESTIONS();
        sendResponse({ success: true });
    } else 
    if (message.action === events[4]){
        console.log("REMOVE_SCRIPT");
        REMOVE_SCRIPT();
        sendResponse({ success: true });
    } else 
    if (message.action === events[5]){
        console.log("AD");
        AD();
        sendResponse({ success: true });
    } else 
    if (message.action === events[6]){
        console.log("SHORTS");
        FILTER_CONTENT_WITH_KEYWORDS();
        SHORTS();
        sendResponse({ success: true });
    } else 
    if (message.action === events[7]){
        console.log("SUGGESTIONS");
        SUGGESTIONS();
      sendResponse({ success: true });
    }
});
  
