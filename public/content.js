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
let isVideoAutoFocus = false;
let isComments = false;
let isloop = false;
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

  console.log('Script removed!');
  window.location.reload();
}

async function FILTER_CONTENT_WITH_KEYWORDS(events, isShorts) {
  let lastExecution = 0;
  const throttleTime = 200;

  const hideElementsByTagName = (classNames, keywords) => {
    const lowerCaseKeywords = keywords.map((keyword) => keyword.toLowerCase());

    classNames.forEach((className) => {
      document.querySelectorAll(className).forEach((item) => {
        const textContent = item.innerText?.toLowerCase();
        const matchFound = lowerCaseKeywords.some((keyword) => textContent.includes(keyword));
        item.style.display = matchFound ? '' : 'none';
      });
    });
  };

  const hideContentChips = () => {
    const element = document.querySelector('#chips-content');
    if (element) {
      element.style.display = 'none';
    } else {
      console.error('element not found');
    }
  };

  observer = new MutationObserver(() => {
    const now = Date.now();
    if (now - lastExecution < throttleTime) return;
    lastExecution = now;

    const ristrict_keyword = events || [];
    if (ristrict_keyword?.length > 0) {
      hideElementsByTagName(
        [
          'ytd-rich-shelf-renderer',
          'ytd-rich-item-renderer',
          'ytd-compact-video-renderer',
          'yt-lockup-view-model',
        ],
        ristrict_keyword,
      );
      hideContentChips(); // hide home screen chips;
    }
  });

  // Start observing changes in the body
  observer.observe(document.body, { childList: true, subtree: true });
}

function VOLUME_EQULIZER(isVolume, isEqualizer) {
  // Prevent reinitialization if already done
  if (initialized) return;

  // Select the YouTube video element
  const video = document.querySelector('video');
  if (!video) {
    console.warn('No video element found!');
    initialized = false;
    return;
  }

  // Initialize Web Audio API once
  audioContext = new (window.AudioContext || window.webkitAudioContext)();
  if (!initialized) source = audioContext.createMediaElementSource(video);
  gainNode = audioContext.createGain();
  equalizerNodes = [];
  initialized = true;

  // 🎶 Frequency bands and labels for clarity
  const frequencyBands = [
    { freq: 60, label: 'Sub Bass' },
    { freq: 170, label: 'Bass' },
    { freq: 350, label: 'Low Mid' },
    { freq: 1000, label: 'Mid' },
    { freq: 3500, label: 'Upper Mid' },
    { freq: 10000, label: 'Treble' },
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
    equalizerLabel.style.fontSize = '2rem';
    equalizerLabel.style.fontWeight = '700';
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
    volumeLabel.style.fontSize = '2rem';
    volumeLabel.style.fontWeight = '700';

    const volumeSlider = document.createElement('input');
    volumeSlider.type = 'range';
    volumeSlider.min = 1;
    volumeSlider.max = 3;
    volumeSlider.value = 1;
    volumeSlider.step = 0.1;
    volumeSlider.style.width = '96%';
    volumeSlider.style.marginBottom = '20px';
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
  equalizerNodes.forEach((node) => node.disconnect());
  gainNode.disconnect();
  audioContext.close(); // Close the audio context
  initialized = false;
  console.log('Audio context disconnected and resources released.');
}

function createEqualizerNodes() {
  const frequencyBands = [
    { freq: 60, label: 'Sub Bass' },
    { freq: 170, label: 'Bass' },
    { freq: 350, label: 'Low Mid' },
    { freq: 1000, label: 'Mid' },
    { freq: 3500, label: 'Upper Mid' },
    { freq: 10000, label: 'Treble' },
  ];

  return frequencyBands.map((band) => {
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

function checkYouTubeTheme() {
  const bgColor = getComputedStyle(document.documentElement).backgroundColor;
  const isDarkMode = bgColor === 'rgb(0, 0, 0)' || bgColor === 'rgb(15, 15, 15)';
  return isDarkMode ? true : false;
}

function createEqualizerControlPanel(controlPanel) {
  const frequencyBands = [
    { freq: 60, label: 'Sub Bass' },
    { freq: 170, label: 'Bass' },
    { freq: 350, label: 'Low Mid' },
    { freq: 1000, label: 'Mid' },
    { freq: 3500, label: 'Upper Mid' },
    { freq: 10000, label: 'Treble' },
  ];

  const isDarkMode = checkYouTubeTheme();

  const equalizerLabel = document.createElement('label');
  equalizerLabel.innerText = 'Audio Equalizer';
  equalizerLabel.style.marginBottom = '20px';
  equalizerLabel.style.marginTop = '25px';
  equalizerLabel.style.fontSize = '2rem';
  equalizerLabel.style.fontWeight = '700';
  equalizerLabel.style.color = isDarkMode ? 'white' : 'black';

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
    label.style.color = isDarkMode ? 'white' : 'black';

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
  const isDarkMode = checkYouTubeTheme();
  const volumeLabel = document.createElement('label');
  volumeLabel.innerText = 'Volume Booster';
  volumeLabel.style.marginBottom = '10px';
  volumeLabel.style.marginTop = '25px';
  volumeLabel.style.fontSize = '2rem';
  volumeLabel.style.fontWeight = '700';
  volumeLabel.style.color = isDarkMode ? 'white' : 'black';

  // const volumeSlider = createSlider(1, 3, 0.1, (e) => gainNode.gain.value = e.target.value);
  const volumeSlider = document.createElement('input');
  volumeSlider.classList.add('custom-slider');
  volumeSlider.type = 'range';
  volumeSlider.min = 1;
  volumeSlider.max = 3;
  volumeSlider.value = 1;
  volumeSlider.step = 0.1;
  volumeSlider.style.width = '100%';
  volumeSlider.style.marginBottom = '20px';
  volumeSlider.style.cursor = 'pointer';
  volumeSlider.oninput = () => {
    gainNode.gain.value = parseFloat(volumeSlider.value);
  };

  controlPanel.appendChild(volumeLabel);
  controlPanel.appendChild(volumeSlider);
}

function setVisibility(elementName, visibility) {
  const element = document.querySelector(elementName);
  if (element) element.hidden = visibility;
  else return true;
}

function VOLUME_EQUALIZER_AND_BOOSTER(isVolume, isEqualizer, visibility = false, ISVOLUMEBOOSTER) {
  const video = document.querySelector('video');
  if (initialized) initAudioContext(video);
  else if (visibility && !initialized) if (!isVolume && !isEqualizer) disconnectAudioContext();

  if (!video) return;

  const controlPanel = document.createElement('div');
  controlPanel.classList.add(ISVOLUMEBOOSTER ? 'volume-control-box' : 'equalizer-control-box');
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

  const controls =
    document.querySelector('#above-the-fold') || document.querySelectorAll('.sp-content')[0];
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

  if (!visibility) containerElement.hidden = true;
  else containerElement.hidden = false; // Clear existing content
  // containerElement.style.width = `${window.innerWidth - 240}px` // Show Section
  // containerElement.style.setProperty('--ytd-rich-grid-chips-bar-width', `${window.innerWidth - 240}px`); // Show Section
}

// filter operations

const hideElements = (selector, byClass = true, visibility = false) => {
  const elements = byClass
    ? document.getElementsByClassName(selector)
    : document.getElementsByTagName(selector);
  if (!visibility) Array.from(elements).forEach((item) => (item.hidden = true));
  else Array.from(elements).forEach((item) => (item.hidden = false));
};

const hideSideBarElements = ({ list, text, visibility = false }) => {
  list.forEach((className) => {
    Array.from(document.getElementsByClassName(className)).forEach((item) => {
      if (item.innerText.toLowerCase() === text.toLowerCase()) {
        if (!visibility) item.hidden = true;
        else {
          item.hidden = false;
        }
      }
    });
  });
};

const handleVideoSize = (visibility) => {
  const playerOuterContainer = document.querySelector('#player-container-outer');
  const title = document.querySelector('#below');
  const isFullScreen = document.fullscreenElement;
  const videoContainer = document.querySelector('video');
  let pixel = 0;

  if (videoContainer) {
    pixel = videoContainer.style.width;
  }

  if (playerOuterContainer && !visibility) {
    playerOuterContainer.style.maxWidth = pixel;
  }

  if (title && !visibility) {
    title.style.maxWidth = pixel || '1280px';
    title.style.margin = '0 auto';
  } else if (title && visibility) {
    title.style.width = '';
    title.style.margin = '';
  }
};

const hideElementById = (id, visibility = false) => {
  const element = document.getElementById(id);
  if (element && !visibility) element.style.display = 'none';
  else if (element && visibility) element.style.display = 'flex';
};

const hideElementRemovedById = (id, visibility = false) => {
  const element = document.getElementById(id);
  if (element && !visibility) element.remove();
  else if (element && visibility) element.style.display = 'flex';
};

const hideOverflowByClassname = (id, visibility = false) => {
  const element = document.getElementById(id);
  if (element && !visibility) element.style.overflow = 'auto';
  else if (element && visibility) element.style.overflow = 'hidden';
};

const hideChildElementById = (rootId, childId, visibility = false) => {
  const rootElement = document.getElementById(rootId);
  if (rootElement) {
    const childElement = rootElement.querySelector(`#${childId}`);
    if (childElement) {
      if (!visibility) childElement.style.setProperty('display', 'none', 'important');
      else childElement.style.setProperty('display', 'block', 'important');
    } else {
      console.error(`Child element #${childId} not found within #${rootId}`);
    }
  }
};

const hideElementByShortsClassName = (className, num, visibility = false) => {
  const elements = document.getElementsByClassName(className);
  if (elements?.length > 0) {
    if (!visibility) elements[num].hidden = true;
    else elements[num].hidden = false;
  }
};

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

const showPlaylist = (visibility = false) => {
  const relatedVideo = document.querySelector(
    '.style-scope ytd-watch-next-secondary-results-renderer',
  );
  const adBanner = document.querySelector('.style-scope ytd-companion-slot-renderer');
  if (!visibility) {
    relatedVideo.hidden = !visibility;
    if (adBanner) {
      adBanner = !visibility;
    }
  } else {
    relatedVideo.hidden = !visibility;
    if (adBanner) {
      adBanner = !visibility;
    }
  }
};

function CUSTOM_PARTS_EXECUTION() {
  const throttleTime = 200;
  let lastExecution = 0;

  observer = new MutationObserver(() => {
    const now = Date.now();
    if (now - lastExecution < throttleTime) return;
    lastExecution = now;

    if (isShorts) {
      try {
        hideElements('style-scope ytd-rich-shelf-renderer');
        handleURL({
          fn: () =>
            hideElementByShortsClassName('yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable', 2),
          includesUrl: '/@',
        });
        hideElementById('shorts-container');
        hideElements('ytd-reel-shelf-renderer', false);
        hideElements('ytd-shorts', false, false);
        hideElements('yt-img-shadow', false, false);
        hideSideBarElements({
          list: [
            'style-scope ytd-guide-entry-renderer',
            'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer',
          ],
          text: 'shorts',
          visibility: false,
        });
      } catch (err) {
        console.log({ err: 'short' });
      }
    }

    if (isHome) {
      try {
        replaceContentWithMessage(
          '.style-scope ytd-rich-grid-renderer',
          'Home Section off by My Tube',
          'icon16.png',
        );
      } catch (err) {
        console.log({ err: 'home feed' });
      }
    }

    if (isComments) {
      try {
        hideElements('style-scope ytd-comments', true, false);
      } catch (err) {
        console.log({ err: 'comments' });
      }
    }

    // if (isSuggestion) {
    //     try {
    //         handleVideoSize(false);
    //         hideChildElementById('columns', 'secondary')
    //     } catch (err) { console.log({err : "suggestions"})}
    // }

    if (isVideoAutoFocus) {
      handleAutoFocusOnVideo();
    }

    if (isloop) {
      try {
        handleLoopButton();
      } catch (err) {
        console.log({ err: 'loop' });
      }
    }

    if (isPip) {
      try {
        addPiPButtonOnce();
      } catch (err) {
        console.log('pip');
      }
    }

    const url = window.location.href;
    if (url.includes('watch?v=')) {
      try {
        if (isVolumeBooster) {
          VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, isEqualizer, false, true);
        }

        if (isEqualizer) {
          VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, isEqualizer, false, false);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (url.includes('feed/history')) {
      try {
        if (isHistory) {
          hideElements('style-scope ytd-browse grid grid-6-columns', true, false);
          hideElements('style-scope ytd-browse grid grid-5-columns', true, false);
        } else {
          hideElements('style-scope ytd-browse grid grid-6-columns', true, true);
          hideElements('style-scope ytd-browse grid grid-5-columns', true, true);
        }
      } catch (err) {
        console.log(err);
      }
    } else if (url.includes('shorts/')) {
      try {
        if (isShorts) {
          window.location.replace('https://www.youtube.com/');
          document.querySelector('.ytdDesktopShortsVolumeControlsMuteIconButton').click();
          hideElementRemovedById('shorts-container', visibility);
        }
      } catch (err) {
        console.log(err);
      }
    }

    if (!url.includes('watch?v=')) {
      try {
        if (document.pictureInPictureElement) {
          document?.exitPictureInPicture();
        }
      } catch (err) {
        console.log(err);
      }
    }

    // for playlist option
    if (url.includes('watch?v=') && url.includes('&list=')) {
      try {
        if (isSuggestion) {
          handleVideoSize(false);
          hideChildElementById('columns', 'secondary', true);
          showPlaylist();
          hideOverflowByClassname('columns', true);
        }
      } catch (err) {}
    } else if (url.includes('watch?v=')) {
      try {
        if (isSuggestion) {
          handleVideoSize(false);
          hideChildElementById('columns', 'secondary');
          hideOverflowByClassname('columns', true);
        }
      } catch (err) {}
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// url specific Operations
function handleURL({ fn, specificUrl = '', includesUrl = '' }) {
  const url = window.location.href;
  if (url == specificUrl) {
    fn();
  } else if (url.includes(includesUrl)) {
    fn();
  }
}

// Shorts visibility control
function handleShorts(visibility) {
  try {
    isShorts = !visibility;
    hideElements('style-scope ytd-rich-shelf-renderer', true, visibility);
    hideElementByShortsClassName(
      'yt-tab-shape-wiz yt-tab-shape-wiz--host-clickable',
      2,
      visibility,
    );
    // hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer', 'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer'], text: 'shorts', visibility });
    hideElementById('shorts-container', visibility);
    hideElements('ytd-reel-shelf-renderer', false, visibility);
    hideElements('style-scope ytd-page-manager', false, visibility);
    hideElements('yt-img-shadow', false, visibility);
    hideSideBarElements({
      list: [
        'style-scope ytd-guide-entry-renderer',
        'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer',
      ],
      text: 'shorts',
      visibility: visibility,
    });

    // mute shorts section
    handleURL({
      fn: () => {
        document.querySelector('.ytdDesktopShortsVolumeControlsMuteIconButton').click();
        console.log('Shorts section muted.');
      },
      includesUrl: 'https://www.youtube.com/shorts/',
    });
  } catch (err) {
    console.log({ err: 'failed to init shorts' });
  }
}

// Video suggestions visibility control
function handleVideoSuggestions(visibility) {
  try {
    isSuggestion = !visibility;
    const url = window.location.href;
    handleVideoSize(visibility);

    if (url.includes('watch?v=') && url.includes('&list=')) {
      showPlaylist(visibility);
    } else if (url.includes('watch?v=') && !url.includes('&list='))
      hideChildElementById('columns', 'secondary', visibility);

    if (visibility) {
      hideOverflowByClassname('columns', true);
    } else {
      hideOverflowByClassname('columns', false);
    }
  } catch (err) {
    console.log({ err: 'failed to init suggestions' });
  }
}

// Filter by keywords control
function handleFilterByKeywords(item) {
  try {
    if (isFiltered !== item?.action) {
      isFiltered = item?.action;
      const url = window.location.href;
      if (url == 'https://www.youtube.com/' || url?.includes('/watch?v=')) {
        handleFiltered();
      }
    }
  } catch (err) {
    console.log({ err: 'failed to init filteration' });
  }
}

// Picture in Picture mode control
function handlePiPMode(visibility) {
  try {
    isPip = !visibility;
    addPiPButtonOnce(visibility);
    if (visibility) {
      document.exitPictureInPicture().catch((err) => console.log({ err }));
    }
  } catch (err) {
    console.log({ err: 'failed to execute pip mode' });
  }
}

function handleLoopVideo(visibility) {
  isloop = !visibility;
  handleLoopButton(visibility);
}

// Advanced volume booster control
function handleVolumeBooster(visibility) {
  try {
    isVolumeBooster = !visibility;
    if (!audioContext) initialized = true;
    const url = window.location.href;
    if (url.includes('watch?v=')) VOLUME_EQUALIZER_AND_BOOSTER(true, isEqualizer, visibility, true);
    else if (
      url.includes('https://www.mxplayer.in/show/') ||
      url.includes('https://www.mxplayer.in/movie/')
    )
      VOLUME_EQUALIZER_AND_BOOSTER(true, isEqualizer, visibility, true);
  } catch (err) {
    console.log({ err: 'failed to init volume booster' });
  }
}

// Precision audio equalizer control
function handleEqualizer(visibility) {
  try {
    isEqualizer = !visibility;
    if (!audioContext) initialized = true;
    const url = window.location.href;
    if (url.includes('watch?v='))
      VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, true, visibility, false);
    else if (
      url.includes('https://www.mxplayer.in/show/') ||
      url.includes('https://www.mxplayer.in/movie/')
    )
      VOLUME_EQUALIZER_AND_BOOSTER(isVolumeBooster, true, visibility, false);
  } catch (err) {
    console.log({ err: 'failed to init equlizer' });
  }
}

// Home feed control
function handleHomeFeed(visibility) {
  try {
    isHome = !visibility;
    hideSideBarElements({
      list: [
        '.style-scope ytd-guide-entry-renderer',
        'yt-simple-endpoint style-scope ytd-mini-guide-entry-renderer',
      ],
      text: 'home',
      visibility,
    });
    replaceContentWithMessage(
      '.style-scope ytd-rich-grid-renderer',
      'Home Section off by My Tube',
      'icon16.png',
      visibility,
    );
  } catch (err) {
    console.log({ err: 'failed to home feed' });
  }
}

// History visibility control
function handleHistory(visibility) {
  try {
    isHistory = !visibility;
    hideElements('style-scope ytd-browse grid grid-6-columns', true, visibility);
    hideElements('style-scope ytd-browse grid grid-5-columns', true, visibility);
  } catch (err) {
    console.log({ err: 'failed to init history' });
  }
  // hideElements({list : ['style-scope ytd-page-manager'], text : true, visibility})
  // hideSideBarElements({ list: ['style-scope ytd-guide-entry-renderer'], text: 'history', visibility });
}

// hide comment section

function hideComments(visibility) {
  try {
    isComments = !visibility;
    const url = window.location.href;
    if (url.includes('watch?v=')) hideElements('style-scope ytd-comments', true, visibility);
  } catch (err) {
    console.log({ err: 'falied to init comments' });
  }
}

function isValueChanged({ preValue, newValue, funCall, params, visibility = false }) {
  if (preValue !== newValue) funCall(visibility);
  else return false;
}

async function handleUIUpdateOnScreenVisible(data) {
  try {
    if (data) {
      const setting = JSON.parse(data);
      const response = await chrome.storage.local.get(['isActive']);
      const isActive = response?.isActive;
      setting.map((item) => {
        const { name } = item;
        if (isActive) {
          if (name.toLowerCase() == 'shorts')
            isValueChanged({
              preValue: isShorts,
              newValue: item?.action,
              funCall: handleShorts,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'video suggestions')
            isValueChanged({
              preValue: isSuggestion,
              newValue: item?.action,
              funCall: handleVideoSuggestions,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'home feed')
            isValueChanged({
              preValue: isHome,
              newValue: item?.action,
              funCall: handleHomeFeed,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'history')
            isValueChanged({
              preValue: isHistory,
              newValue: item?.action,
              funCall: handleHistory,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'picture in picture mode')
            isValueChanged({
              preValue: isPip,
              newValue: item?.action,
              funCall: handlePiPMode,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'filter by keywords')
            isValueChanged({
              preValue: isFiltered,
              newValue: item?.action,
              funCall: handleFilterByKeywords,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'advanced volume booster')
            isValueChanged({
              preValue: isVolumeBooster,
              newValue: item?.action,
              funCall: handleVolumeBooster,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'precision audio equalizer')
            isValueChanged({
              preValue: isEqualizer,
              newValue: item?.action,
              funCall: handleEqualizer,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'focus on video')
            isValueChanged({
              preValue: isVideoAutoFocus,
              newValue: item?.action,
              funCall: handleAutoFocusOnVideo,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'comments')
            isValueChanged({
              preValue: isComments,
              newValue: item?.action,
              funCall: hideComments,
              visibility: !item?.action,
            });
          else if (name.toLowerCase() == 'loop button for videos')
            isValueChanged({
              preValue: isloop,
              newValue: item?.action,
              funCall: handleLoopVideo,
              visibility: !item?.action,
            });
        } else {
          console.log('my tube off');
        }
      });

      setTimeout(() => {
        CUSTOM_PARTS_EXECUTION();
      }, 1000);
    }
  } catch (err) {
    console.log({ err: 'failed to ui update' });
  }
}

async function handleLoopButton(visibility = false) {
  let color = '#FFFFFF';
  if (visibility) {
    const button = document.querySelector('.custom-loop-button');
    if (button) button.hidden = true;
  } else {
    const ifButtonExist = document.querySelector('.custom-loop-button') || null;
    if (ifButtonExist == null) {
      if (document.querySelector('.custom-loop-button')) return;
      const controls = document.querySelector('.ytp-right-controls');
      if (!controls) return;

      const button = document.createElement('button');
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none">
        <g clip-path="url(#clip0_429_11114)">
        <path d="M21 9L21 4L19 5" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M15 7H7" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M5 19L3 17M3 17L5 15M3 17L17 17" stroke="${color}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M3 11C3 8.79086 4.79086 7 7 7" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M21 13C21 15.2091 19.2091 17 17 17" stroke="${color}" stroke-width="2.5" stroke-linecap="round"/>
        </g>
        <defs>
        <clipPath id="clip0_429_11114">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
        </svg>
      `;
      button.classList.add('custom-loop-button');
      button.style.background = 'transparent';
      button.style.border = 'none';
      button.style.borderRadius = '7px';
      button.style.width = '40px';
      button.style.height = '30px';
      button.style.cursor = 'pointer';
      button.style.position = 'relative';
      button.style.top = '-9px';
      button.title = 'Loop Video';
      button.onclick = () => {
        const video = document.querySelector('video');
        if (!video?.loop) {
          video.loop = true;
          button.style.color = 'red';
          button.style.background = 'red';
        } else {
          video.loop = false;
          button.style.background = 'transparent';
        }
      };

      controls.prepend(button);
    } else {
      ifButtonExist.hidden = false;
    }
  }
}

chrome.storage.onChanged.addListener(function (changes, namespace) {
  console.log('Changes', changes);
  if (changes?.setting?.newValue) {
    handleUIUpdateOnScreenVisible(changes?.setting?.newValue);
  }

  if (changes?.smplayback?.newValue) {
    handleSlowMotionPlayback(changes?.smplayback?.newValue);
  }
});

async function handleFiltered() {
  try {
    const responseEvent = await chrome.storage.local.get(['keywords']);
    let events = [];
    if (responseEvent?.keywords) {
      events = JSON.parse(responseEvent?.keywords);
      FILTER_CONTENT_WITH_KEYWORDS(events, isShorts);
    }
  } catch (err) {
    console.log({ err: 'failed to filter' });
  }
}

function handleAutoFocusOnVideo() {
  let timeout;
  let dimDelay = 2000;

  function setDimmed(state) {
    const pathName = document.location.pathname;
    if (pathName == '/watch') {
      const secondaryArray = document.querySelectorAll('#secondary');
      const below = document.querySelectorAll('#below')[0];

      let secondary = null;
      if (secondaryArray.length > 1) {
        secondary = document.querySelectorAll('#secondary');
      } else {
        secondary = document.querySelectorAll('#secondary');
      }

      if (!state) {
        if (secondary && below) {
          secondary.forEach((item) => {
            item.style.transition = 'opacity 0.4s ease-in';
            item.style.opacity = 1;
          });
          below.style.transition = 'opacity 0.4s ease-in';
          below.style.opacity = 1;
        }
      } else {
        if (secondary && below) {
          secondary.forEach((item) => {
            item.style.transition = 'opacity 0.4s ease-out';
            item.style.opacity = 0.15;
          });
          below.style.transition = 'opacity 0.4s ease-out';
          below.style.opacity = 0.15;
        }
      }
    }
  }

  function resetTimer() {
    setDimmed(false);
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      setDimmed(true);
    }, dimDelay);
  }

  document.addEventListener('mousemove', resetTimer);
  document.addEventListener('scroll', resetTimer);
  document.addEventListener('keydown', resetTimer);

  resetTimer();
}

(function () {
  function filterData(keyword) {
    const playlistItems = document.querySelectorAll('ytd-playlist-panel-video-renderer');

    if (playlistItems?.length > 0) {
      playlistItems.forEach((item) => {
        if (item.innerText.toLowerCase().includes(keyword)) {
          item.hidden = false;
        } else {
          item.hidden = true;
        }
      });
    }
  }

  function toEnterTextFeild() {
    const targetContainer = document.querySelectorAll('#header-contents')[1];
    if (!targetContainer) return;
    const wrapper = document.createElement('ytd-menu-renderer');
    wrapper.style.marginTop = '10px';
    wrapper.style.marginBottom = '10px';
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search playlist...';
    searchInput.style.padding = '6px 12px';
    searchInput.style.border = '1px solid gray';
    searchInput.style.borderRadius = '6px';
    searchInput.style.width = '97.5%';
    searchInput.style.boxSizing = 'border-box';
    searchInput.style.fontSize = '14px';
    searchInput.style.backgroundColor = 'transparent';
    searchInput.style.outline = 'none';
    searchInput.style.color = 'var(--yt-spec-text-primary)';

    // Append input to wrapper
    wrapper.appendChild(searchInput);

    // Append to target container
    targetContainer.appendChild(wrapper);

    // Optional: Log or bind search logic
    searchInput.addEventListener('input', (e) => {
      filterData(e.target.value);
    });
    searchInput.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Detect playlist collapse using MutationObserver
    const playlistContainer = document.querySelectorAll('ytd-playlist-panel-renderer')[1];
    if (!playlistContainer) return;

    searchInput.addEventListener('focus', (e) => {
      console.log('input focus');
      playlistContainer.removeAttribute('collapsed');
    });
  }

  setTimeout(() => {
    toEnterTextFeild();
    // filterData('kem');
  }, 2000);
})();

const backgroundColor = {
  backgroundColor: '#0F828C',
  backgroundSecondaryColor: '#0F828C',
  textColor: '#FFFFFF',
  hashTag: '#065084',
  hashTagBorder: '#320A6B',
  thumbColor: '#0F828C',
  progressColor: '#065084',
  headerColor: '#0F828C',
  headerBorder: '#0F828C',
};

// (function () {
//   const style = document.createElement('style');
//   style.id = 'mytube-custom-theme';

//   style.textContent = `
//     /* ===== GLOBAL BACKGROUND & TEXT COLOR ===== */
//     body, ytd-app, #page-manager, ytd-watch-flexy, #content, tp-yt-app-drawer {
//       background-color: ${backgroundColor.backgroundColor} !important;
//       color: ${backgroundColor.textColor} !important;
//     }

//     --yt-spec-base-background {
//       background-color: ${backgroundColor.backgroundColor} !important;
//     }

//     /* Text color override */
//     * {
//       color: ${backgroundColor.textColor} !important;
//     }

//     /* ===== HEADER BAR ===== */
//     #masthead-container, ytd-masthead, ytd-mini-guide-renderer {
//       background-color: ${backgroundColor.headerColor} !important;
//       border-bottom: ${backgroundColor.headerBorder} !important;
//     }

//     #container.ytd-masthead {
//       background-color: transparent !important;
//     }

//     /* ===== SCROLLBAR STYLING ===== */
//     ::-webkit-scrollbar {
//       width: 8px;
//       height: 8px;
//     }

//     ::-webkit-scrollbar-thumb {
//       background-color: ${backgroundColor.thumbColor} !important;
//       border-radius: 4px;
//     }

//     ::-webkit-scrollbar-track {
//       background-color: #222;
//     }

//     /* ===== PLAYER COLORS ===== */
//     .ytp-play-progress {
//       background: ${backgroundColor.progressColor} !important;
//     }

//     .ytp-load-progress {
//       background: ${backgroundColor.progressColor} !important;
//     }

//     .ytp-volume-slider-handle,
//     .ytp-scrubber-button {
//       background-color: ${backgroundColor.thumbColor} !important;
//     }

//     .ytp-chrome-bottom {
//       background: rgba(0, 0, 0, 0.8) !important;
//     }

//     .ytp-tooltip-text {
//       color: ${backgroundColor.textColor} !important;
//       background-color: ${backgroundColor.backgroundColor} !important;
//     }

//     /* ===== TAGS, HASHTAGS, CATEGORY BUTTONS ===== */
//     a.yt-simple-endpoint.style-scope.yt-formatted-string, /* hashtags */
//     ytd-guide-entry-renderer a, /* left nav items */
//     ytd-chip-cloud-chip-renderer { /* category chips */
//       color: ${backgroundColor.hashTag} !important;
//       background-color: ${backgroundColor.backgroundSecondaryColor} !important;
//       border-color: ${backgroundColor.hashTagBorder} !important;
//     }

//     ytd-chip-cloud-chip-renderer[selected] {
//       background-color: ${backgroundColor.backgroundColor} !important;
//       color: ${backgroundColor.color} !important;
//     }

//     /* ===== LIKE/DISLIKE BUTTON COLORS ===== */
//     ytd-toggle-button-renderer yt-icon,
//     ytd-toggle-button-renderer a {
//       color: ${backgroundColor.textColor} !important;
//     }
//   `;

//   document.head.appendChild(style);

//   // Re-apply styles on navigation due to SPA behavior
//   document.addEventListener('yt-navigate-finish', () => {
//     if (!document.getElementById('mytube-custom-theme')) {
//       document.head.appendChild(style);
//     }
//   });
// })();

function handleSlowMotionPlayback(newValue) {
  const options = JSON.parse(newValue);
  const video = document.querySelector('video');
  const slowSpeed = parseFloat(options.playbackSpeed) || 0.5; // You can change this to any slow speed
  const normalSpeed = 1.0;

  function handleKeyDown(event) {
    if (event.key.toLowerCase() === options.shortcutKey.toLowerCase() || 'Shift') {
      video.playbackRate = slowSpeed;
    }
  }

  function handleKeyUp(event) {
    if (event.key.toLowerCase() === options.shortcutKey?.toLowerCase() || 'Shift') {
      video.playbackRate = normalSpeed;
    }
  }

  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
}

chrome.storage.local.get(['setting'], function (result) {
  if (result?.setting) {
    console.log({ result: JSON.parse(result?.setting) });
    handleUIUpdateOnScreenVisible(result?.setting);
  }
});

chrome.storage.local.get(['smplayback'], function (result) {
  if (result?.smplayback) {
    handleSlowMotionPlayback(result?.smplayback);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'remove') {
    window.location.reload();
    sendResponse({ success: true });
  }
});

// ask for review

function updateTime(options) {
  const currentTime = new Date().getTime();
  const futureTime = currentTime + 96 * 60 * 60 * 1000; // Add 96 hours in milliseconds
  chrome.storage.local.set({ askForReview: JSON.stringify({ ...options, time: futureTime }) });
}

chrome.storage.local.get(['askForReview'], function (result) {
  console.log({ result });
  if (result?.askForReview) {
    let data = JSON.parse(result?.askForReview);
    const currentTime = new Date().getTime();
    if (parseInt(currentTime) > parseInt(data.time) && !data?.isReviewd) {
      const isReviewd = window.confirm(
        '🙏 Your feedback matters! Please consider reviewing My Tube on the Chrome Web Store to help us improve and grow.',
      );

      if (isReviewd) {
        data.isReviewd = true;
        window.open(
          'https://chrome.google.com/webstore/detail/my-tube-extension/lajbhepiafloclhaiophefffbhjkfncp/reviews',
          '_blank',
        );
        chrome.storage.local.set({ askForReview: JSON.stringify(data) });
      } else {
        updateTime(data);
      }
    }
  } else {
    updateTime({ isReviewd: false });
  }
});

// keywords
// youtube enhancer
// youtube premium
// youtube audio
// youtube blocker
// youtube ad blocker
