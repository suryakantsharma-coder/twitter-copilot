/* global chrome */

let audioContext;
let source;
let gainNode;
let equalizerNodes = [];
let initialized = false; // Prevent multiple initializations
let ShowText = false; // Prevent multiple initializations

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

async function FILTER_CONTENT_WITH_KEYWORDS (events, isShorts) {

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

  const hideContentChips = () => {
    const element = document.querySelector('#chips-content');
    console.log({element})

    if (element) {
      element.style.display = "none";
    } else {
      console.error("element not found")
    }
  }



     observer = new MutationObserver(() => {
      const now = Date.now();
      if (now - lastExecution < throttleTime) return;
      lastExecution = now;

      const ristrict_keyword = events || ['strange parts', 'INDIAN RAILWAYS FAN CLUB -by SATYA', 'yatri doctor', 'Destroyed Phone Restore', 'Mat Armstrong', 'JerryRigEverything', 'Linus Tech Tips', 'Joe HaTTab', 'Gyan Therapy'];
      hideElementsByTagName([ (isShorts) && 'ytd-rich-item-renderer', 'ytd-compact-video-renderer'], ristrict_keyword);
      hideContentChips(); // hide home screen chips;
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    // console.log("Throttled observer is running.");

}

function VOLUME_EQULIZER(isVolume, isEqualizer) {
    // Prevent reinitialization if already done
    if (initialized) return ;
      initialized = true;


    // Select the YouTube video element
    const video = document.querySelector('video');
    if (!video) {
        console.warn('No video element found!');
        initialized = false;
        return;
    }

    // Initialize Web Audio API once
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(video);
    gainNode = audioContext.createGain();
    equalizerNodes = [];

    // 🎶 Frequency bands and labels for clarity
    const frequencyBands = [
        { freq: 60, label: "Sub Bass" }, 
        { freq: 170, label: "Bass" },
        { freq: 350, label: "Low Mid" },
        { freq: 1000, label: "Mid" },
        { freq: 3500, label: "Upper Mid" },
        { freq: 10000, label: "Treble" }
    ];

    // Create biquad filter nodes for each frequency band
    frequencyBands.forEach((band) => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking'; 
        filter.frequency.value = band.freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        equalizerNodes.push(filter);
    });

    // Chain filters and gain node
    source.connect(equalizerNodes[0]);
    for (let i = 0; i < equalizerNodes.length - 1; i++) {
        equalizerNodes[i].connect(equalizerNodes[i + 1]);
    }
    equalizerNodes[equalizerNodes.length - 1].connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Activate audio context on play
    video.onplay = () => {
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    };

    // 🎛️ Add control panel for Equalizer and Volume Booster
    const controls = document.querySelector('#above-the-fold');
    const controlPanel = document.createElement('div');
    controlPanel.style.display = 'flex';
    controlPanel.style.flexDirection = 'column';
    controlPanel.style.background = 'transparent';
    controlPanel.style.paddingTop = '10px';
    controlPanel.style.paddingBottom = '10px';
    controlPanel.style.color = '#fff';

    // 🎚️ Generate sliders for frequency bands with labels
   function Equalizer() {

         const equalizerLabel = document.createElement('label');
        equalizerLabel.innerText = 'Audio Equalizer';
        equalizerLabel.style.marginBottom = '20px';
        equalizerLabel.style.marginTop = '25px';
        equalizerLabel.style.fontSize = "2rem";
        equalizerLabel.style.fontWeight = "700";
        controlPanel.appendChild(equalizerLabel);



        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.flexDirection = 'row';
        container.style.alignItems = 'flex-end';
        container.style.justifyContent = 'space-around';
        container.style.marginBottom = '20px';

        frequencyBands.forEach((band, index) => {
            const bandContainer = document.createElement('div');
            bandContainer.style.display = 'flex';
            bandContainer.style.flexDirection = 'column';
            bandContainer.style.alignItems = 'center';
            bandContainer.style.margin = '0 10px';

            const label = document.createElement('label');
            label.innerText = `${band.label} (${band.freq} Hz)`;
            label.style.marginBottom = '5px';
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = -12;
            slider.max = 12;
            slider.value = 0;
            slider.step = 1;
            slider.style.transform = 'rotate(-90deg)';
            slider.style.height = '150px';
            slider.oninput = () => {
                equalizerNodes[index].gain.value = parseFloat(slider.value);
            };
            bandContainer.appendChild(slider);
            bandContainer.appendChild(label);
            container.appendChild(bandContainer);
        });
        controlPanel.appendChild(container);
    }

    // 🎧 **Volume Booster Control (Boosts up to 3x)**
    function volumeBooster() {
        const volumeLabel = document.createElement('label');
        volumeLabel.innerText = 'Volume Booster';
        volumeLabel.style.marginBottom = '10px';
        volumeLabel.style.marginTop = '25px';
        volumeLabel.style.fontSize = "2rem";
        volumeLabel.style.fontWeight = "700";


        const volumeSlider = document.createElement('input');
        volumeSlider.type = 'range';
        volumeSlider.min = 1;
        volumeSlider.max = 3;
        volumeSlider.value = 1;
        volumeSlider.step = 0.1;
        volumeSlider.style.width = "96%";
        volumeSlider.style.marginBottom = "20px";
        volumeSlider.oninput = () => {
            gainNode.gain.value = parseFloat(volumeSlider.value);
        };
        controlPanel.appendChild(volumeLabel);
        controlPanel.appendChild(volumeSlider);
    }

    // Call functions based on parameters
    if (isVolume) volumeBooster();
    if (isEqualizer) Equalizer();

    // Inject the control panel into YouTube's control bar
    controls.prepend(controlPanel);
}

function replaceContentWithMessage(containerSelector, message, iconPath) {
    // Select and clear the container
    const containerElement = document.querySelector(containerSelector);
    if (!containerElement) {
        console.warn(`Element with selector ${containerSelector} not found.`);
        return;
    }
    containerElement.innerHTML = '';  // Clear existing content
}

// function CUSTOM_PARTS_WITH_AD_BLOCKER (isShorts, isSuggestion, isPip, isVolume, isEqualizer, isHome, isHistory) {
//     let lastExecution = 0; 
//     const throttleTime = 200;

//     const hideElementsByClass = (classNames) => {
//       classNames.forEach((className) => {
//         Array.from(document.getElementsByClassName(className)).forEach((item) => {
//           item.hidden = true;
//         });
//       });
//     };

//     const hideSideBarShortElementsByClass = (classNames) => {
//       const elementText = classNames?.text;
//       console.log({elementText, classNames})
//       classNames?.list?.forEach((className) => {
//         Array.from(document.getElementsByClassName(className)).forEach((item) => {
//           if (item?.innerText?.toString()?.toLowerCase() == elementText?.toString()?.toLowerCase()) {
//             item.hidden = true;
//           }
//         });
//       });
//     };

//     const hideElementsByTagName = (classNames) => {
//       classNames.forEach((className) => {
//         Array.from(document.getElementsByTagName(className)).forEach((item) => {
//           item.hidden = true;
//         });
//       });
//     };


//      function mxAds ()  {
//       const iframes = document.getElementsByTagName('iframe');
//     for (let iframe of iframes) {
//         if (iframe.src.includes('imasdk.googleapis.com')) {
//             iframe.remove();
//             console.log('Iframe removed successfully.');
//         }
//     }
//      }

//      function hideShortPageById() {
//       const element = document.getElementById("shorts-container");
//       if (element) {
//         element.style.display = "none"
//       }
//      }


//     function hideChildElementById(rootId, childId) {
//     const rootElement = document.getElementById(rootId);
//     if (rootElement) {
//         const childElement = rootElement.querySelector(`#${childId}`);
//         if (childElement) {
//             childElement.style.setProperty("display", "none", "important");
//         } else {
//             console.error(`Child element #${childId} not found within #${rootId}`);
//         }
//     } else {
//         // console.error(`Root element #${rootId} not found`);
//     }
//     };

//     const addPiPButtonOnce = () => {
//       const svg = `<svg class="ytp-subtitles-button-icon" width="100%" height="100%" viewBox="0 0 36.00 36.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path> </g> </g></svg>`

//     if (document.querySelector('.custom-pip-button')) return;

//     const controls = document.querySelector('.ytp-right-controls');
//     if (!controls) return;

//     const button = document.createElement('button');
//     button.innerHTML = svg || '🖥️'; 
//     button.classList.add('custom-pip-button');
//     button.style.background = 'transparent';
//     button.style.border = 'none';
//     button.style.width = '46px';
//     button.style.height = '37px';
//     button.title = 'Picture-in-Picture Mode';

//     button.onclick = () => {
//         const video = document.querySelector('video');
//         if (video) {
//             video.requestPictureInPicture().catch(console.error);
//         } else {
//             alert('No video found!');
//         }
//     };

//     controls.prepend(button);
// };

    

//     observer = new MutationObserver(() => {
//       const now = Date.now();
//       if (now - lastExecution < throttleTime) return; 
//       lastExecution = now;

//       hideElementsByClass([
//         'ad-container',
//         'video-ads',
//         'ytp-ad-module',
//       ]);

      
//       hideElementsByClass([
//         (isShorts) &&  'style-scope ytd-rich-shelf-renderer',
//         (isShorts) && 'style-scope yt-horizontal-list-renderer', //shorts
//       ]);

//       // (isHome) && hideElementsByClass(["style-scope ytd-two-column-browse-results-renderer"]) // hide the home screen content
//       // (isHistory) && hideElementsByClass(["style-scope ytd-two-column-browse-results-renderer"]) // hide the history screen content


//         {isShorts && hideSideBarShortElementsByClass({
//         list : ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'],
//         text : 'shorts'
//       })}
//         {isHistory && hideSideBarShortElementsByClass({
//         list : ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'],
//         text : 'history'
//       })}
//         {isHome &&  hideSideBarShortElementsByClass({
//         list : ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'],
//         text : 'home'
//       })}


//       isShorts && hideShortPageById("shorts-container");

//       isHistory && hideElementsByClass([
//        'style-scope ytd-browse-feed-actions-renderer'
//       ]);


  
//       (isSuggestion) && hideChildElementById('columns','secondary'); //suggestions

//       (isShorts) && hideElementsByTagName(['ytd-reel-shelf-renderer']) 

//       isPip && addPiPButtonOnce();


//       isHome && replaceContentWithMessage(
//     '#primary',  // id where to print
//     'Home Section off by My Tube', // message
//     'icon16.png'  // Replace with your desired image URL
//     );

//       const url = window.location.href;
//       if (url?.toString()?.includes("watch?v=")) {
//         VOLUME_EQULIZER(isVolume, isEqualizer)
//       } else if (url?.toString()?.includes("feed/history")) {
//            isHistory && replaceContentWithMessage(
//           '#primary',  // id where to print
//           'This Section off by My Tube', // message
//           'icon16.png'  // Replace with your desired image URL
//       );
//     }

      

//       const video = document.querySelector('video');
//       if (video && document.querySelector('.ad-showing')) {
//         video.currentTime = video.duration; // Skip ad
//       }

//       mxAds();

      

//     });

//     observer.observe(document.body, { childList: true, subtree: true });
// };

// function CUSTOM_PARTS (isShorts, isSuggestion, isPip, isVolume, isEqualizer, isHome, isHistory) {
//     let lastExecution = 0; 
//     const throttleTime = 200;

//     const hideElementsByClass = (classNames) => {
//       classNames.forEach((className) => {
//         Array.from(document.getElementsByClassName(className)).forEach((item) => {
//           item.hidden = true;
//         });
//       });
//     };

//     const hideElementsByClassWithSubType = (classNames, type) => {
//       classNames.forEach((className) => {
//         Array.from(document.getElementsByClassName(className)).forEach((item) => {
//           if (item?.type) 
//           item.hidden = true;
//         });
//       });
//     };

//     const hideElementsByTagName = (classNames) => {
//       classNames.forEach((className) => {
//         Array.from(document.getElementsByTagName(className)).forEach((item) => {
//           item.hidden = true;
//         });
//       });
//     };

//     function hideChildElementById(rootId, childId) {
//     const rootElement = document.getElementById(rootId);
//     if (rootElement) {
//         const childElement = rootElement.querySelector(`#${childId}`);
//         if (childElement) {
//             childElement.style.setProperty("display", "none", "important");
//         } else {
//             console.error(`Child element #${childId} not found within #${rootId}`);
//         }
//     } else {
//         console.error(`Root element #${rootId} not found`);
//     }
//     };

//     function hideShortPageById() {
//       const element = document.getElementById("shorts-container");
//       if (element) {
//         element.style.display = "none"
//       }
//      }

    
//      const hideSideBarShortElementsByClass = (classNames) => {
//       const elementText = classNames?.text;
//       classNames?.list?.forEach((className) => {
//         Array.from(document.getElementsByClassName(className)).forEach((item) => {
//           if (item?.innerText?.toString()?.toLowerCase() == elementText?.toString()?.toLowerCase()) {
//             item.hidden = true;
//           }
//         });
//       });
//     };

//     const hideSideBarElementsByClass = (elements) => {
//     elements.forEach(({ text, list }) => {
//         console.log({ text, list });
//         list.forEach((className) => {
//             Array.from(document.getElementsByClassName(className)).forEach((item) => {
//                 if (item?.innerText?.toString()?.toLowerCase() === text?.toString()?.toLowerCase()) {
//                     item.hidden = true;
//                 }
//             });
//         });
//     });
// };


 


//     const addPiPButtonOnce = () => {
//       const svg = `<svg class="ytp-subtitles-button-icon" width="100%" height="100%" viewBox="0 0 36.00 36.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path> </g> </g></svg>`

//     if (document.querySelector('.custom-pip-button')) return;

//     const controls = document.querySelector('.ytp-right-controls');
//     if (!controls) return;

//     const button = document.createElement('button');
//     button.innerHTML = svg || '🖥️'; 
//     button.classList.add('custom-pip-button');
//     button.style.background = 'transparent';
//     button.style.border = 'none';
//     button.style.width = '46px';
//     button.style.height = '37px';
//     button.title = 'Picture-in-Picture Mode';

//     button.onclick = () => {
//         const video = document.querySelector('video');
//         if (video) {
//             video.requestPictureInPicture().catch(console.error);
//         } else {
//             alert('No video found!');
//         }
//     };

//     controls.prepend(button);
// };




//     // VOLUME_EQULIZER(isVolume, isEqualizer);

//     observer = new MutationObserver(() => {
//       const now = Date.now();
//       if (now - lastExecution < throttleTime) return; 
//       lastExecution = now;

      
//       hideElementsByClass([
//         (isShorts) &&  'style-scope ytd-rich-shelf-renderer',
//         (isShorts) && 'style-scope yt-horizontal-list-renderer', //shorts
//       ]);
//       isHistory && hideElementsByClass([
//        'style-scope ytd-browse-feed-actions-renderer'
//       ]);


  
//       (isSuggestion) && hideChildElementById('columns','secondary'); //suggestions

//       (isShorts) && hideElementsByTagName(['ytd-reel-shelf-renderer']);
//       isHome&& replaceContentWithMessage(
//           '#primary',  // id where to print
//           'This Section off by My Tube', // message
//           'icon16.png'  // Replace with your desired image URL
//       );
     




//         {isShorts && hideSideBarShortElementsByClass({
//         list : ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'],
//         text : 'shorts'
//       })}
//         {isHistory && hideSideBarShortElementsByClass({
//         list : ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'],
//         text : 'history'
//       })}
//         {isHome &&  hideSideBarShortElementsByClass({
//         list : ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'],
//         text : 'home'
//       })}

//       isShorts && hideShortPageById("shorts-container");

//       isPip && addPiPButtonOnce();

//       const url = window.location.href;


//         if (url?.toString()?.includes("watch?v=")) {
//           VOLUME_EQULIZER(isVolume, isEqualizer)
//         } else if (url?.toString()?.includes("feed/history")) {
//            isHistory && replaceContentWithMessage(
//           '#primary',  // id where to print
//           'This Section off by My Tube', // message
//           'icon16.png'  // Replace with your desired image URL
//       );
//         }

      
//     });

//     observer.observe(document.body, { childList: true, subtree: true });
//     // console.log("Throttled observer is running.");
// };


// filter operations 


function CUSTOM_PARTS(isShorts, isSuggestion, isPip, isVolume, isEqualizer, isHome, isHistory, isAdBlocker = false) {
    const throttleTime = 200;
    let lastExecution = 0;

    const hideElements = (selector, byClass = true) => {
        const elements = byClass ? document.getElementsByClassName(selector) : document.getElementsByTagName(selector);
        Array.from(elements).forEach(item => item.hidden = true);
    };

    const hideSideBarElements = ({ list, text }) => {
        list.forEach(className => {
            Array.from(document.getElementsByClassName(className)).forEach(item => {
                if (item.innerText.toLowerCase() === text.toLowerCase()) {
                    item.hidden = true;
                }
            });
        });
    };

    const mxAds = () => {
        Array.from(document.getElementsByTagName('iframe')).forEach(iframe => {
            if (iframe.src.includes('imasdk.googleapis.com')) {
                iframe.remove();
                console.log('Iframe removed successfully.');
            }
        });
    };

    const hideElementById = (id) => {
        const element = document.getElementById(id);
        if (element) element.style.display = "none";
    };

    const hideChildElementById = (rootId, childId) => {
        const rootElement = document.getElementById(rootId);
        if (rootElement) {
            const childElement = rootElement.querySelector(`#${childId}`);
            if (childElement) {
                childElement.style.setProperty("display", "none", "important");
            } else {
                console.error(`Child element #${childId} not found within #${rootId}`);
            }
        }
    };

    const addPiPButtonOnce = () => {
        if (document.querySelector('.custom-pip-button')) return;

        const controls = document.querySelector('.ytp-right-controls');
        if (!controls) return;

        const button = document.createElement('button');
        button.innerHTML = `<svg class="ytp-subtitles-button-icon" width="100%" height="100%" viewBox="0 0 36.00 36.00" xmlns="http://www.w3.org/2000/svg" fill="#ffffff" stroke="#ffffff" transform="rotate(0)matrix(1, 0, 0, 1, 0, 0)" stroke-width="0.00024000000000000003"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.8160000000000001"></g><g id="SVGRepo_iconCarrier"><g><path fill="none" d="M0 0h24v24H0z"></path><path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path></g></g></svg>`;
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

        if (isAdBlocker) {
            hideElements('ad-container');
            hideElements('video-ads');
            hideElements('ytp-ad-module');
            mxAds();
        }

        if (isShorts) {
            hideElements('style-scope ytd-rich-shelf-renderer');
            hideElements('style-scope yt-horizontal-list-renderer');
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts' });
            hideElementById("shorts-container");
            hideElements('ytd-reel-shelf-renderer', false);
        }

        if (isHistory) {
            hideElements('style-scope ytd-browse-feed-actions-renderer');
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'history' });
        }

        if (isHome) {
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'home' });
            replaceContentWithMessage('#primary', 'Home Section off by My Tube', 'icon16.png');
        }

        if (isSuggestion) hideChildElementById('columns', 'secondary');

        if (isPip) addPiPButtonOnce();

        const url = window.location.href;
        if (url.includes("watch?v=")) {
            VOLUME_EQULIZER(isVolume, isEqualizer);
        } else if (url.includes("feed/history")) {
            replaceContentWithMessage('#primary', 'This Section off by My Tube', 'icon16.png');
        }

        const video = document.querySelector('video');
        if (video && document.querySelector('.ad-showing')) {
            video.currentTime = video.duration;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

async function Operations(data) {
 if (data) {
      const setting = JSON.parse(data);
      let isAds = false;
      let isShorts = false;
      let isSuggestion = false;
      let isFiltered = false;
      let isPip = false;
      let isVolumeBooster = false;
      let isEqualizer = false;
      let isHome = false;
      let isHistory = false;

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
          } else if (item?.name?.toString()?.toLowerCase() == "advanced volume booster") {
            isVolumeBooster = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "precision audio equalizer") {
            isEqualizer = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "home feed") {
            isHome = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "history") {
            isHistory = item?.action
          }
        })


        if (isFiltered && events?.length > 0)
          FILTER_CONTENT_WITH_KEYWORDS(events, isShorts);
  
        // if (isAds) {
        //   CUSTOM_PARTS_WITH_AD_BLOCKER(isShorts, isSuggestion, isPip, isVolumeBooster, isEqualizer, isHome, isHistory)
        // } else {
        //   CUSTOM_PARTS(isShorts, isSuggestion, isPip, isVolumeBooster, isEqualizer, isHome, isHistory)
        // }
        
        CUSTOM_PARTS(isShorts, isSuggestion, isPip, isVolumeBooster, isEqualizer, isHome, isHistory)
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
