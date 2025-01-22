
/* global chrome */

let observer;
let audioContext;
let source;
let gainNode;
let equalizerNodes = [];
let initialized = false; // Prevent multiple initializations
let ShowText = false; // Prevent multiple initializations


 let isAds = false;
 let isShorts = false;
 let isSuggestion = false;
 let isFiltered = false;
 let isPip = false;
 let isVolumeBooster = false;
 let isEqualizer = false;
 let isHome = false;
 let isHistory = false;
 let isComments = false;
 let initalizerHome = false;



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
      hideElementsByTagName(['ytd-rich-shelf-renderer', 'ytd-rich-item-renderer', 'ytd-compact-video-renderer'], ristrict_keyword);
      hideContentChips(); // hide home screen chips;
    });

    // Start observing changes in the body
    observer.observe(document.body, { childList: true, subtree: true });
    // console.log("Throttled observer is running.");

}

function VOLUME_EQULIZER(isVolume, isEqualizer) {
    // Prevent reinitialization if already done
    if (initialized) return;


    // Select the YouTube video element
    const video = document.querySelector('video')
    if (!video) {
        console.warn('No video element found!');
        initialized = false;
        return;
    } 


    // Initialize Web Audio API once
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    if (!initialized)
    source = audioContext.createMediaElementSource(video);
    gainNode = audioContext.createGain();
    equalizerNodes = [];
    initialized = true;


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
    let controls;
     controls = document.querySelector('#above-the-fold');
    if (!controls) {
        controls = document.querySelectorAll('.sp-content')[0];
        console.warn('No control bar found!');
        if (!controls) {
            console.warn('No control bar found!');
            initialized = false;
            return;
        }
        // initialized = false;
        // return;
    }
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


// volume module 

function initAudioContext(video) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    source = audioContext.createMediaElementSource(video);
    gainNode = audioContext.createGain();
    equalizerNodes = createEqualizerNodes();
    initialized = false;

    chainAudioNodes();
    video.onplay = () => {
        if (audioContext.state === 'suspended') audioContext.resume();
    };
}

function disconnectAudioContext() {
    source.disconnect();
    equalizerNodes.forEach(node => node.disconnect());
    gainNode.disconnect();
    audioContext.close();  // Close the audio context
    initialized = false;
    console.log('Audio context disconnected and resources released.');
}

function createEqualizerNodes() {
    const frequencyBands = [
        { freq: 60, label: "Sub Bass" },
        { freq: 170, label: "Bass" },
        { freq: 350, label: "Low Mid" },
        { freq: 1000, label: "Mid" },
        { freq: 3500, label: "Upper Mid" },
        { freq: 10000, label: "Treble" }
    ];

    return frequencyBands.map(band => {
        const filter = audioContext.createBiquadFilter();
        filter.type = 'peaking';
        filter.frequency.value = band.freq;
        filter.Q.value = 1;
        filter.gain.value = 0;
        return filter;
    });
}

function chainAudioNodes() {
    source.connect(equalizerNodes[0]);
    equalizerNodes.reduce((prev, curr) => (prev.connect(curr), curr));
    equalizerNodes[equalizerNodes.length - 1].connect(gainNode);
    gainNode.connect(audioContext.destination);
}

function createSlider(min, max, step, onInput) {
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.oninput = onInput;
    return slider;
}

function createEqualizerControlPanel(controlPanel) {

     const frequencyBands = [
        { freq: 60, label: "Sub Bass" },
        { freq: 170, label: "Bass" },
        { freq: 350, label: "Low Mid" },
        { freq: 1000, label: "Mid" },
        { freq: 3500, label: "Upper Mid" },
        { freq: 10000, label: "Treble" }
    ];

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
            slider.style.cursor = 'pointer';
            slider.classList.add('custom-slider');
            slider.oninput = () => {
                equalizerNodes[index].gain.value = parseFloat(slider.value);
            };
            bandContainer.appendChild(slider);
            bandContainer.appendChild(label);
            container.appendChild(bandContainer);
        });
        controlPanel.appendChild(container);
        
    // equalizerNodes.forEach((node, index) => {
    //     const slider = createSlider(-12, 12, 1, (e) => node.gain.value = e.target.value);
    //     controlPanel.appendChild(slider);
    // });
}

function createVolumeControlPanel(controlPanel) {
    const volumeLabel = document.createElement('label');
    volumeLabel.innerText = 'Volume Booster';
    volumeLabel.style.marginBottom = '10px';
    volumeLabel.style.marginTop = '25px';
    volumeLabel.style.fontSize = "2rem";
    volumeLabel.style.fontWeight = "700";

    // const volumeSlider = createSlider(1, 3, 0.1, (e) => gainNode.gain.value = e.target.value);
    const volumeSlider = document.createElement('input');
    volumeSlider.classList.add('custom-slider');
    volumeSlider.type = 'range';
    volumeSlider.min = 1;
    volumeSlider.max = 3;
    volumeSlider.value = 1;
    volumeSlider.step = 0.1;
    volumeSlider.style.width = "96%";
    volumeSlider.style.marginBottom = "20px";
    volumeSlider.style.cursor = 'pointer';
    volumeSlider.oninput = () => {
        gainNode.gain.value = parseFloat(volumeSlider.value);
    };
    
    controlPanel.appendChild(volumeLabel);
    controlPanel.appendChild(volumeSlider);
}

function setVisibility(elementName, visibility) {
    const element = document.querySelector(elementName);
    if (element)
        element.hidden = visibility;
    else
        return true;
}

function VOLUME_EQUALIZER_AND_BOOSTER(isVolume, isEqualizer, visibility = false, ISVOLUMEBOOSTER) {
    const video = document.querySelector('video');
    if (initialized)
        initAudioContext(video);
    else if (visibility && !initialized)
        if (!isVolume && !isEqualizer)
            disconnectAudioContext();

    if (!video) return;


    const controlPanel = document.createElement('div');
    controlPanel.classList.add((ISVOLUMEBOOSTER) ? 'volume-control-box' : 'equalizer-control-box');
    controlPanel.style.display = 'flex';
    controlPanel.style.flexDirection = 'column';
    controlPanel.style.background = 'transparent';
    controlPanel.style.paddingTop = '10px';
    controlPanel.style.paddingBottom = '10px';
    controlPanel.style.color = '#fff';

    let needToCreate = false;

    if (ISVOLUMEBOOSTER) {
        needToCreate = setVisibility('.volume-control-box', visibility);
        createVolumeControlPanel(controlPanel);
    } else if (isEqualizer) {
        needToCreate = setVisibility('.equalizer-control-box', visibility);
        createEqualizerControlPanel(controlPanel);
    } else if (ISVOLUMEBOOSTER && isEqualizer) {
        needToCreate = setVisibility('.volume-control-box', visibility);
        createVolumeControlPanel(controlPanel);
        createEqualizerControlPanel(controlPanel);
    }

    const controls = document.querySelector('#above-the-fold') || document.querySelectorAll('.sp-content')[0];
    if (controls && needToCreate) controls.prepend(controlPanel);
}

function replaceContentWithMessage(containerSelector, message, iconPath, visibility = false) {
    // Select and clear the container
    const containerElement = document.querySelector(containerSelector);
    
     if (!containerElement) {
         console.warn(`Element with selector ${containerSelector} not found.`);
         return;
        }

    

        // } else {
            //     contentScreen.style.setProperty('--ytd-rich-grid-chips-bar-width', '0px'); // Hide Section
            // }
            
            if (!visibility)
            containerElement.hidden = true;
            else
            containerElement.hidden = false;  // Clear existing content
            // containerElement.style.width = `${window.innerWidth - 240}px` // Show Section
            // containerElement.style.setProperty('--ytd-rich-grid-chips-bar-width', `${window.innerWidth - 240}px`); // Show Section
 
}



// filter operations 

const hideElements = (selector, byClass = true, visibility = false) => {
            const elements = byClass ? document.getElementsByClassName(selector) : document.getElementsByTagName(selector);
            if (!visibility) 
            Array.from(elements).forEach(item => item.hidden = true);
            else
            Array.from(elements).forEach(item => item.hidden = false);
};
    
const hideSideBarElements = ({ list, text, visibility = false}) => {
    list.forEach(className => {
        Array.from(document.getElementsByClassName(className)).forEach(item => {
            if (item.innerText.toLowerCase() === text.toLowerCase()) {
                if (!visibility)
                    item.hidden = true;
                else {
                    item.hidden = false;
                }
            } else if (item.innerText.toLowerCase()?.trim() == "" &&  visibility) {
                item.hidden = false;
            };
        });
    });
};

const handleVideoSize = () => {
    // const element = document.querySelector('video');
    // const controls = document.querySelector('.ytp-chrome-bottom');
    // const container = document.querySelector('#columns');
    // const seekBar = document.querySelector('.ytp-chapter-hover-container');
    //     if (element) {
    //         element.style.width= "100%";
    //         element.style.height="auto";
    //         element.style.left="0px";
    //         element.style.top="0px";
    //     }
    
    // if (controls) {
    //     controls.style.width = "99%";
    //     controls.style.left = "12px";
    // }

    // if (container) {
    //     container.style.width = "10%";
    // }

    // if (seekBar) {
    //     controls.style.width = "99%";
    // }

  // Hide the related videos section
  const secondarySection = document.querySelector("#secondary");
  if (secondarySection) {
    secondarySection.style.display = "none";
  }

  // Adjust the main player container to center
  const primarySection = document.querySelector("#primary");
  if (primarySection) {
    primarySection.style.margin = "0 auto";
    primarySection.style.maxWidth = "1000px"; // Adjust width as needed
  }

  // Adjust the player size if necessary
  const player = document.querySelector("#player");
  if (player) {
    player.style.margin = "0 auto";
    player.style.display = "block";
  }

}

const mxAds = () => {
            Array.from(document.getElementsByTagName('iframe')).forEach(iframe => {
                if (iframe.src.includes('imasdk.googleapis.com')) {
                    iframe.remove();
                    console.log('Iframe removed successfully.');
                }
            });
};

const hideElementById = (id, visibility = false) => {
            const element = document.getElementById(id);
            if (element && !visibility) element.style.display = "none";
            else  if (element && visibility) element.style.display = "flex";
};
const hideElementRemovedById = (id, visibility = false) => {
            const element = document.getElementById(id);
            if (element && !visibility) element.remove();
            else  if (element && visibility) element.style.display = "flex";
};

const hideChildElementById = (rootId, childId, visibility = false) => {
            const rootElement = document.getElementById(rootId);
            if (rootElement) {
                const childElement = rootElement.querySelector(`#${childId}`);
                if (childElement) {
                    if (!visibility)
                    childElement.style.setProperty("display", "none", "important");
                else
                    childElement.style.setProperty("display", "block", "important");
                } else {
                    console.error(`Child element #${childId} not found within #${rootId}`);
                }
            }
};

const hideElementByShortsClassName = (className, num, visibility = false) => {
            const elements = document.getElementsByClassName(className);
            if (elements?.length > 0) {
                if (!visibility) 
                    elements[num].hidden = true;
                else 
                    elements[num].hidden = false;
            }
}

const addPiPButtonOnce = (visibility = false) => {
                if (visibility) {
                    const button = document.querySelector('.custom-pip-button');
                    if (button) button.hidden = true;
                } else {
                    const ifButtonExist = document.querySelector('.custom-pip-button') || null;
                    if (ifButtonExist == null) {
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
                        button.style.cursor = 'pointer';
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
                    } else {
                      ifButtonExist.hidden = false;
                    }
                }

};


function CUSTOM_PARTS(isShorts, isSuggestion, isPip, isVolume, isEqualizer, isHome, isHistory, isAdBlocker = false, visibility = false) {
    const throttleTime = 200;
    let lastExecution = 0;

    observer = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastExecution < throttleTime) return;
        lastExecution = now;

        if (isAdBlocker) {
            // hideElements('ad-container');
            // hideElements('video-ads');
            // hideElements('ytp-ad-module');
            // mxAds();
        }

        if (isShorts) {
            hideElements('style-scope ytd-rich-shelf-renderer');
            // hideElements('shortsLockupViewModelHost style-scope ytd-rich-item-renderer');
            hideElementByShortsClassName("yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable", 2);
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts' });
            hideElementById("shorts-container");
            hideElements('ytd-reel-shelf-renderer', false);
        } else {
            hideElements('style-scope ytd-rich-shelf-renderer', false, true);
            // hideElements('shortsLockupViewModelHost style-scope ytd-rich-item-renderer');
            hideElementByShortsClassName("yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable", 2, true);
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts', visibility : true });
            hideElementById("shorts-container", true);
            hideElements('ytd-reel-shelf-renderer', false, true);

        }

        if (isHistory) {
            hideElements('style-scope ytd-browse-feed-actions-renderer', true, false);
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'history' });
        } else {
            hideElements('style-scope ytd-browse-feed-actions-renderer', true, true);
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'history', vsibility : true });
        }

        if (isHome) {
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'home' });
            replaceContentWithMessage('.style-scope ytd-rich-grid-renderer', 'Home Section off by My Tube', 'icon16.png');
        } else { 
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'home', visibility : true });   
            replaceContentWithMessage('.style-scope ytd-rich-grid-renderer', 'Home Section off by My Tube', 'icon16.png', true);
        }

        if (isSuggestion) hideChildElementById('columns', 'secondary') 
            else hideChildElementById('columns', 'secondary', true);

        if (isPip) addPiPButtonOnce() 
            else if (isPip && !visibility) addPiPButtonOnce(true);

        const url = window.location.href;
        if (url.includes("watch?v=")) {
            (isVolume || isEqualizer) && VOLUME_EQULIZER(isVolume, isEqualizer);
        } else if (url.includes("https://www.mxplayer.in/show/") || url.includes("https://www.mxplayer.in/movie/")) {
            (isVolume || isEqualizer) && VOLUME_EQULIZER(isVolume, isEqualizer);
        } else if (url.includes("feed/history") && isHistory) {
            // replaceContentWithMessage('#primary', 'This Section off by My Tube', 'icon16.png');
        }

        // const video = document.querySelector('video');
        // if (video && document.querySelector('.ad-showing')) {
        //     video.currentTime = video.duration;
        // }
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

function CUSTOM_PARTS_EXECUTION() {
    const throttleTime = 200;
    let lastExecution = 0;

    observer = new MutationObserver(() => {
        const now = Date.now();
        if (now - lastExecution < throttleTime) return;
        lastExecution = now;

        if (isShorts) {
            hideElements('style-scope ytd-rich-shelf-renderer');
            handleURL({ fn : () => hideElementByShortsClassName("yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable", 2), includesUrl : "/@"});
            hideElementById("shorts-container");
            hideElements('ytd-reel-shelf-renderer', false);
            hideElements('ytd-shorts', false, false);
            hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts', visibility : false });
        }
    

        if (isHome) {
            // hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'home' });
            replaceContentWithMessage('.style-scope ytd-rich-grid-renderer', 'Home Section off by My Tube', 'icon16.png');
        }

        if (isComments)
            hideElements('style-scope ytd-comments', true, false);

        if (isSuggestion) {
            handleVideoSize();
            hideChildElementById('columns', 'secondary') 
        }
          

        if (isPip) addPiPButtonOnce() 
        

        const url = window.location.href;
        if (url.includes("watch?v=")) {
            if (isVolumeBooster) {
                VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, isEqualizer, false, true)
            }
            
            if (isEqualizer) {
                 VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, isEqualizer, false, false)
            }


        } else if (url.includes("https://www.mxplayer.in/show/") || url.includes("https://www.mxplayer.in/movie/")) {
            (isVolumeBooster || isEqualizer) && VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, isEqualizer, false, isVolumeBooster);
        } else if (url.includes("feed/history")) {
            if (isHistory)
                hideElements('style-scope ytd-browse grid grid-6-columns', true, false);
            else
                hideElements('style-scope ytd-browse grid grid-6-columns', true, true);
        } else if (url.includes("shorts/")) {
            if (isShorts) {
                document.querySelector(".ytdDesktopShortsVolumeControlsMuteIconButton").click();
                hideElementRemovedById("shorts-container", visibility);
            }
        }

    });

    observer.observe(document.body, { childList: true, subtree: true });
}

async function Operations(data) {
 if (data) {
      const setting = JSON.parse(data);
      const response = await chrome.storage.local.get(['isActive']);
      const responseEvent = await chrome.storage.local.get(['keywords']);
      const isActive = response?.isActive;
      let events = [];
      if (responseEvent?.keywords) 
      events = JSON.parse(responseEvent?.keywords);

      if (isActive) {
        setting.map((item) => {
          if (item?.name?.toString()?.toLowerCase() == "shorts") {
            if (isShorts !== item?.action) 
                isShorts = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "block ads") {
            if (isAds !== item?.action) 
                isAds = item?.action;
          }else if (item?.name?.toString()?.toLowerCase() == "video suggestions") {
            if (isSuggestion !== item?.action) 
                isSuggestion = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "filter by keywords") {
            if (isFiltered !== item?.action) 
                isFiltered = item?.action;
          } else if (item?.name?.toString()?.toLowerCase() == "picture in picture mode") {
            if (isPip !== item?.action) 
                isPip = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "advanced volume booster") {
            if (isVolumeBooster !== item?.action) 
                isVolumeBooster = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "precision audio equalizer") {
            if (isEqualizer !== item?.action) 
                isEqualizer = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "home feed") {
            if (isHome !== item?.action) 
                isHome = item?.action
          } else if (item?.name?.toString()?.toLowerCase() == "history") {
            if (isHistory !== item?.action) 
                isHistory = item?.action
          }
        })


        // if (isFiltered && events?.length > 0)
        //   FILTER_CONTENT_WITH_KEYWORDS(events, isShorts);
  
        // if (isAds) {
        //   CUSTOM_PARTS_WITH_AD_BLOCKER(isShorts, isSuggestion, isPip, isVolumeBooster, isEqualizer, isHome, isHistory)
        // } else {
        //   CUSTOM_PARTS(isShorts, isSuggestion, isPip, isVolumeBooster, isEqualizer, isHome, isHistory)
        // }
        
        CUSTOM_PARTS(isShorts, isSuggestion, isPip, isVolumeBooster, isEqualizer, isHome, isHistory, isAds)
      }

    }
}


// url specific Operations
function handleURL({fn, specificUrl = "", includesUrl = ""}) {
    const url = window.location.href;
    if (url == specificUrl) {
      fn();
    } else if (url.includes(includesUrl)) {
      fn();
    }
}

// remove ads from mx player randomly

function getAdTimestamps(videoLength) {
  // Convert the video length ("hh:mm:ss") into total seconds
  const [hours, minutes, seconds] = videoLength.split(":").map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  // Calculate ad intervals (4 evenly spaced points)
  const interval = totalSeconds / 5;

  // Generate timestamps
  const timestamps = [];
  for (let i = 1; i <= 4; i++) {
    const adTimeInSeconds = Math.floor(interval * i);

    const adMinutes = Math.floor(adTimeInSeconds / 60);
    const adSeconds = adTimeInSeconds % 60;

    // Format the timestamp as "mm:ss"
    timestamps.push(`${adMinutes}:${adSeconds.toString().padStart(2, "0")}`);
  }

  return timestamps;
}

function manageAds(videoLength) {
  const ads = new Set(); // Use a set to ensure uniqueness
  const timestamps = getAdTimestamps(videoLength);

  // Function to add an ad
  function addAd() {
    if (ads.size < 4) {
      const available = timestamps.filter((time) => !ads.has(time));
      if (available.length > 0) {
        const randomAd = available[Math.floor(Math.random() * available.length)];
        ads.add(randomAd);
        console.log(`Ad added at: ${randomAd}`);
      } else {
        console.log("No available timestamps for adding ads.");
      }
    } else {
      console.log("Maximum number of ads already added.");
    }
  }

  // Function to remove an ad
  function removeAd() {
    if (ads.size > 0) {
      const randomAd = Array.from(ads)[Math.floor(Math.random() * ads.size)];
      ads.delete(randomAd);
      console.log(`Ad removed from: ${randomAd}`);
    } else {
      console.log("No ads to remove.");
    }
  }

  // Function to list all current ads
  function listAds() {
    console.log("Current ads:", Array.from(ads));
  }

  return { addAd, removeAd, listAds };
}

// Function to randomly toggle ads in MX Player
function mxAdsToggle() {
  Array.from(document.getElementsByTagName('iframe')).forEach((iframe) => {
    if (iframe.src.includes('imasdk.googleapis.com')) {
      if (Math.random() > 0.5) { // 50% chance to remove the ad
        iframe.remove();
        console.log('Ad iframe removed successfully.');
      } else {
        console.log('Ad iframe left intact.');
      }
    }
  });
}

// Shorts visibility control
function handleShorts(visibility) {
    isShorts = !visibility;
    hideElements('style-scope ytd-rich-shelf-renderer', true, visibility);
    hideElementByShortsClassName("yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable", 2, visibility);
    // hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts', visibility });
    hideElementById("shorts-container", visibility);
    hideElements('ytd-reel-shelf-renderer', false, visibility);
    hideElements('style-scope ytd-page-manager', false, visibility);
    hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts', visibility : visibility });

    // mute shorts section 
    handleURL({
        fn: () => {
            document.querySelector(".ytdDesktopShortsVolumeControlsMuteIconButton").click();
            console.log("Shorts section muted.");
        }, includesUrl: "https://www.youtube.com/shorts/"
    });
    
}

// Video suggestions visibility control
function handleVideoSuggestions(visibility) {
    isSuggestion = !visibility;
    handleVideoSize();
    hideChildElementById('columns', 'secondary', visibility);
}

// Filter by keywords control
function handleFilterByKeywords(item) {
    if (isFiltered !== item?.action) {
        isFiltered = item?.action;
        const url = window.location.href;
        if (url == "https://www.youtube.com/") {
            handleFiltered();
        }
    }
}

// Picture in Picture mode control
function handlePiPMode(visibility) {
    isPip = !visibility;
    addPiPButtonOnce(visibility);
}

// Advanced volume booster control
function handleVolumeBooster(visibility) {
    isVolumeBooster = !visibility;
    if (!audioContext) 
        initialized = true;
    const url = window.location.href;
    if (url.includes("watch?v=")) 
        VOLUME_EQUALIZER_AND_BOOSTER(true, isEqualizer, visibility, true)
    else if (url.includes("https://www.mxplayer.in/show/") || url.includes("https://www.mxplayer.in/movie/")) 
        VOLUME_EQUALIZER_AND_BOOSTER(true, isEqualizer, visibility, true)    
}

// Precision audio equalizer control
function handleEqualizer(visibility) {
    isEqualizer = !visibility;
    if (!audioContext) 
        initialized = true;
    const url = window.location.href;
    if (url.includes("watch?v=")) 
        VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, true, visibility, false)
    else if (url.includes("https://www.mxplayer.in/show/") || url.includes("https://www.mxplayer.in/movie/")) 
        VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, true, visibility, false)
}

// Home feed control
function handleHomeFeed(visibility) {
    isHome = !visibility;
    hideSideBarElements({ list: ['.style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'home', visibility });
    replaceContentWithMessage('.style-scope ytd-rich-grid-renderer', 'Home Section off by My Tube', 'icon16.png', visibility);
}

// History visibility control
function handleHistory(visibility) {
    isHistory = !visibility;
    hideElements('style-scope ytd-browse grid grid-6-columns', true, visibility);
    // hideElements({list : ['style-scope ytd-page-manager'], text : true, visibility})
    // hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer'], text: 'history', visibility });

}

// hide comment section 

function hideComments(visibility) {
    isComments = !visibility;
    const url = window.location.href;
    if (url.includes("watch?v=")) 
        hideElements('style-scope ytd-comments', true, visibility);
}

function isValueChanged({preValue, newValue, funCall, params, visibility = false}) {
    if (preValue !== newValue)
        funCall(visibility);
    else 
        return false;
}

function visibilityOfElement({ visibility = false }) {

}

function handleUIUpdateOnScreenVisible(data) {
    if (data) {
        const setting = JSON.parse(data);
        setting.map((item) => {
            const {name} = item;
            if (name.toLowerCase() == 'shorts')
                isValueChanged({ preValue: isShorts, newValue: item?.action, funCall: handleShorts, visibility: !item?.action });
            else if (name.toLowerCase() == 'video suggestions')
                isValueChanged({ preValue: isSuggestion, newValue: item?.action, funCall: handleVideoSuggestions, visibility: !item?.action });
            else if (name.toLowerCase() == 'home feed')
                isValueChanged({ preValue: isHome, newValue: item?.action, funCall: handleHomeFeed, visibility: !item?.action });
            else if (name.toLowerCase() == "history")
                isValueChanged({ preValue: isHistory, newValue: item?.action, funCall: handleHistory, visibility: !item?.action });
            else if (name.toLowerCase() == "picture in picture mode")
                isValueChanged({ preValue: isPip, newValue: item?.action, funCall: handlePiPMode, visibility: !item?.action });
            else if (name.toLowerCase() == "filter by keywords")
                isValueChanged({ preValue: isFiltered, newValue: item?.action, funCall: handleFilterByKeywords, visibility: !item?.action });
            else if (name.toLowerCase() == "advanced volume booster")
                isValueChanged({ preValue: isVolumeBooster, newValue: item?.action, funCall: handleVolumeBooster, visibility: !item?.action });
            else if (name.toLowerCase() == "precision audio equalizer")
                isValueChanged({ preValue: isEqualizer, newValue: item?.action, funCall: handleEqualizer, visibility: !item?.action });
            else if (name.toLowerCase() == "comments")
                isValueChanged({ preValue: isComments, newValue: item?.action, funCall: hideComments, visibility: !item?.action });
        }) 

        setTimeout(() => { 
            CUSTOM_PARTS_EXECUTION()
        }, 1000) 
    }
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
    console.log("Changes", changes);
        if (changes?.setting?.newValue) {
            handleUIUpdateOnScreenVisible(changes?.setting?.newValue);
        }
});


async function handleFiltered() {
    const responseEvent = await chrome.storage.local.get(['keywords']);
    let events = [];
    if (responseEvent?.keywords) {
        events = JSON.parse(responseEvent?.keywords);
        FILTER_CONTENT_WITH_KEYWORDS(events, isShorts);
    }
    
}

chrome.storage.local.get(['setting'], function(result) {
    if (result?.setting) {
        console.log({ result: JSON.parse(result?.setting) })
        handleUIUpdateOnScreenVisible(result?.setting);
    }
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "remove") {
        window.location.reload();
        sendResponse({ success: true });
    }
});
