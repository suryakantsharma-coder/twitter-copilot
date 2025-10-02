/* global chrome */
console.log('content.js initialized');

// style

const style = document.createElement('style');
style.textContent = `
.skeleton-line {
  height: 14px;
  margin: 6px 0;
  border-radius: 6px;
  // background: linear-gradient(90deg, #eee, #ddd, #eee);
  background: linear-gradient(90deg, #595151, #332929, #565050);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
.skeleton-line-short { width: 60%; }
.skeleton-line-medium { width: 80%; }
.skeleton-line-full { width: 100%; }

.ai-skeleton {
  width: 100%;
  height: fit-content;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
`;
document.head.appendChild(style);
console.log('style added');

// Animations

function showSkeleton(container) {
  const skeleton = document.createElement('div');
  skeleton.className = 'ai-skeleton';
  skeleton.innerHTML = `
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
    <div class="skeleton-line"></div>
  `;
  container.appendChild(skeleton);
  return skeleton;
}

// Replace skeleton with actual response
function replaceSkeleton(skeleton, content) {
  const result = document.createElement('div');
  result.className = 'ai-result';
  result.textContent = content;
  skeleton.replaceWith(result);
}

// varables and functions

var isCompoentVisibleForHome = false;
var isCompoentVisibleForComment = false;
var suggestedTopics = null;
var commentButton = null;
var isContainerVisible = null;
var isContainerVisibleForComment = null;

// APIs
const getUserSuggestedTopics = async () => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    region: 'IN',
    type: ['general', 'social', 'Business'],
    subtypes: 'developer, crypto, technology',
    isHashtag: true,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const response = await fetch(
    'http://localhost:3000/analysis/twitter-trends-by-users',
    requestOptions,
  );
  const result = await response.json();
  console.log({ result });
  return result;
};

const genrateComments = async (tweet, instruction) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');
  console.log({ tweet });

  const raw = JSON.stringify({
    tweet: tweet,
    commentInstruction: instruction || 'happy, sad, normal, funny',
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const response = await fetch('http://localhost:3000/genrate/tweet-comment', requestOptions);
  const result = await response.text();
  console.log({ result });
  return result;
};

const getTweetsBasedOnUserSelections = async (keyword) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    keyword,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const response = await fetch('http://localhost:3000/genrate/suggested-tweet', requestOptions);
  const result = await response.text();
  return result;
};

const createTweetEnhancer = async (tweet) => {
  const myHeaders = new Headers();
  myHeaders.append('Content-Type', 'application/json');

  const raw = JSON.stringify({
    tweet,
  });

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  };

  const response = await fetch('http://localhost:3000/genrate/tweet', requestOptions);
  const result = await response.text();
  return result;
};

// UI Functions
function createTagContainer() {
  const parent = document.querySelector(
    '.css-175oi2r.r-1iusvr4.r-16y2uox.r-1777fci.r-1h8ys4a.r-1bylmt5.r-13tjlyg.r-7qyjyx.r-1ftll1t',
  );

  if (!parent) {
    console.warn('Parent element not found!');
    return null;
  }

  const container = document.createElement('div');
  container.id = 'extension-tag-container';
  container.style.padding = '10px';
  container.style.borderRadius = '5px';
  container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
  container.style.fontFamily = 'Arial, sans-serif';
  container.style.display = 'flex';
  container.style.flexWrap = 'wrap';
  container.style.gap = '5px';

  parent.appendChild(container);
  return container;
}

/* global chrome */
console.log('content.js initialized');

// 1. Create "Improve Text" button

function getTweetBoxText() {
  const tweetBox = document.querySelector(
    'div[contenteditable="true"][data-testid="tweetTextarea_0"]',
  );
  return tweetBox ? tweetBox.innerText?.trim()?.replace(/\n/g, ' ') : '';
}
function createImproveButton(container) {
  const button = document.createElement('button');
  button.textContent = '💡 Enhance Tweet';
  button.style.padding = '2.5px 12px';
  button.style.margin = '0px 0';
  button.style.border = 'none';
  button.style.backgroundColor = '#28a745';
  button.style.color = '#fff';
  button.style.cursor = 'pointer';
  button.style.fontSize = '14px';
  button.style.height = 'fit-content';
  button.style.borderRadius = '16px';
  button.id = 'improve-text-btn';

  button.addEventListener('click', async () => {
    const tweet = getTweetBoxText();
    console.log({ tweet });
    const data = await createTweetEnhancer(tweet);
    console.log({ data });
    setTwitterReply(data);
  });

  // Append to body (or a specific section)
  container.appendChild(button);

  return button;
}

// 2. Render tags in the container
function renderTags(container, tags, action = () => {}) {
  const skeleton = showSkeleton(container);
  console.log({ skeleton });
  try {
    if (!container) return;

    container.innerHTML = ''; // Clear previous content
    tags.forEach((tag) => {
      const tagEl = document.createElement('span');
      tagEl.textContent = tag.keyword; // Adjust based on API structure
      tagEl.style.background = '#007bff';
      tagEl.style.color = '#fff';
      tagEl.style.padding = '5px 10px';
      tagEl.style.borderRadius = '16px';
      tagEl.style.fontSize = '12px';
      tagEl.style.cursor = 'pointer';
      tagEl.style.height = 'fit-content';
      tagEl.addEventListener('click', () => {
        // alert(`You clicked tag: ${tag.keyword}`);
        action(tag.keyword);
      });
      container.appendChild(tagEl);
    });
  } catch (error) {
    replaceSkeleton(skeleton, '❌ Failed to load tweets.');
    console.error(error);
  }
}

function renderOptionsTags(container, tags, action = () => {}) {
  if (!container) return;

  container.innerHTML = ''; // Clear previous content
  [...tags, 'Back to Menu'].forEach((tag) => {
    const tagEl = document.createElement('span');
    tagEl.textContent = tag; // Adjust based on API structure
    tagEl.style.background = tag === 'Back to Menu' ? '#DC143C' : 'rgba(255, 255, 255, 0.2)';
    tagEl.style.color = '#fff';
    tagEl.style.padding = '5px 10px';
    tagEl.style.borderRadius = '16px';
    tagEl.style.fontSize = '12px';
    tagEl.style.cursor = 'pointer';
    tagEl.style.height = 'fit-content';

    tagEl.addEventListener('click', () => {
      action(tag);
    });
    container.appendChild(tagEl);
  });
}

function setTwitterReply(text) {
  // Grab the comment box
  const commentBox = document.querySelector(
    'div[contenteditable="true"][data-testid="tweetTextarea_0"]',
  );

  if (!commentBox) {
    console.warn('Twitter comment box not found!');
    return;
  }

  // Focus the box
  commentBox.focus();

  // Use document.execCommand to simulate typing
  document.execCommand('selectAll', false, null);
  document.execCommand('insertText', false, text);

  // Fire input event so React updates the UI
  commentBox.dispatchEvent(new InputEvent('input', { bubbles: true }));
}

// 3. Initialize
(async function init() {
  setInterval(async () => {
    const url = window.location.href;
    if (url.includes('/home')) {
      isCompoentVisibleForComment = false;
      if (suggestedTopics === null || isCompoentVisibleForHome === false) {
        isContainerVisibleForComment = null;
        let container = isContainerVisible;

        if (!container) {
          container = createTagContainer();
          isContainerVisible = container;
        }

        if (!container) return;

        if (suggestedTopics === null) {
          const tags = await getUserSuggestedTopics();
          suggestedTopics = tags;
        }

        renderTags(container, suggestedTopics, async (keyword) => {
          container.innerHTML = '';
          const skeleton = showSkeleton(container);
          try {
            const tweets = await getTweetsBasedOnUserSelections(keyword);
            const tweet = tweets.split('\n\n');
            replaceSkeleton(skeleton, '');
            console.log({ tweets, tweet });
            renderOptionsTags(container, tweet, (tweet) => {
              console.log({ tweet });
              if (tweet === 'Back to Menu') {
                isCompoentVisibleForHome = false;
                container.innerHTML = '';
                return;
              }

              setTwitterReply(tweet);
            });
          } catch (error) {
            replaceSkeleton(skeleton, '❌ Failed to load tweets.');
            console.error(error);
          }
        });
        createImproveButton(container);
        isCompoentVisibleForHome = true;
      }
    } else {
      isCompoentVisibleForHome = false;
      isContainerVisible = null;
      if (commentButton === null || isCompoentVisibleForComment === false) {
        let container = isContainerVisibleForComment;

        if (!container) {
          container = createTagContainer();
          isContainerVisibleForComment = container;
        }

        const tags = [
          {
            keyword: '💡 Suggest Comment',
            count: 1,
          },
        ];
        renderTags(container, tags, async () => {
          container.innerHTML = '';
          const skeleton = showSkeleton(container);

          try {
            const values = readValuesAndAlert();
            const instruction = getTweetBoxText();
            const tweets = await genrateComments(values, instruction);
            const options = tweets.split('\n');
            replaceSkeleton(skeleton, '');
            console.log({ values, options });
            renderOptionsTags(container, options, (tweet) => {
              if (tweet === 'Back to Menu') {
                isCompoentVisibleForComment = false;
                container.innerHTML = '';
                return;
              }

              setTwitterReply(tweet);
            });
          } catch (error) {
            replaceSkeleton(skeleton, '❌ Failed to load tweets.');
            console.error(error);
          }
        });

        commentButton = 'added';
        isCompoentVisibleForComment = true;
      }
    }
  }, 5000);
})();
function readValuesAndAlert() {
  const elements = document.querySelector(
    '.css-146c3p1.r-bcqeeo.r-1ttztb7.r-qvutc0.r-37j5jr.r-1inkyih.r-16dba41.r-bnwqim.r-135wba7',
  );
  if (!elements) {
    alert('No elements found!');
    return;
  }

  const values = elements.innerText;
  return values;
}

// schedule post tweet

function postTweet(text) {
  setTwitterReply(text);
  const interval = setInterval(() => {
    const button = document.querySelector(
      '.css-175oi2r.r-sdzlij.r-1phboty.r-rs99b7.r-lrvibr.r-1cwvpvk.r-2yi16.r-1qi8awa.r-3pj75a.r-1loqt21.r-o7ynqc.r-6416eg.r-1ny4l3l',
    );
    if (button && !button.hasAttribute('disabled')) {
      button.click();
      console.log('Tweet posted:', text);
      clearInterval(interval);
    }
  }, 200);
  setTimeout(() => clearInterval(interval), 5000);
}

setTimeout(() => {
  const tweet = 'DEMO Tweet';
  console.log({ tweet });
  postTweet(tweet);
}, 5000);
